import React, { useState, useMemo, useEffect } from "react";
import styles from "../CSS/Announcementpage.module.css";
import { Calendar, Clock, Users, X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { InfoTooltip } from "./InfoTooltip";


export default function Announcementpage() {
  // CREATE tab stat
  const [title, setTitle] = useState("");
  const [type, setType] = useState("General Announcement");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("All Employees");
  const [priority, setPriority] = useState("High");
  const [channels, setChannels] = useState({ banner: true, email: false, push: false });
  const [scheduleLater, setScheduleLater] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");
  const[overlay,setOverlay]=useState(false)
  // lists from server
  const [teams, setTeams] = useState([]); // roles
  const [employees, setEmployees] = useState([]);

  // overlays & selection
  const [teamsOverlayOpen, setTeamsOverlayOpen] = useState(false);
  const [peopleOverlayOpen, setPeopleOverlayOpen] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [teamSearch, setTeamSearch] = useState("");
  const [peopleSearch, setPeopleSearch] = useState("");

  // overall UI tab
  const [active, setActive] = useState("create"); // create | history | target
  const [audienceType, setAudienceType] = useState("company");
  // history (announcements)
  const [announcements, setAnnouncements] = useState([]);
  const [publishing, setPublishing] = useState(false);
const [publishStep, setPublishStep] = useState("");


  // targeted (red flags)
  const [redFlags, setRedFlags] = useState([]);
  const [filteredRedFlags, setFilteredRedFlags] = useState([]);
  const [activeTab, setActiveTab] = useState("All Issues");
  const [selectedRecipients, setSelectedRecipients] = useState([]); // user ids selected in Target page

  // fetch teams and users on mount
  useEffect(() => {
    (async () => {
      try {
        const r = await axios.get(`https://b-atlas-ncc.onrender.com/api/v1/admin/getallproject`);
        if (r?.data?.message) setTeams(r.data.message);
      } catch (e) {
        console.log("roles fetch error", e.message);
      }
    })();

    (async () => {
      try {
        const r = await axios.get(`https://b-atlas-ncc.onrender.com/api/v1/admin/getalluser`, { withCredentials: true });
        if (r?.data?.message) setEmployees(r.data.message);
      } catch (e) {
        console.log("users fetch error", e.message);
      }
    })();
  }, []);

  // fetch announcements
  useEffect(() => {
    (async () => {
      try {
        const r = await axios.get(`https://b-atlas-ncc.onrender.com/api/v1/admin/getannouncements`);
        if (r?.data?.message) setAnnouncements(r.data.message);
      } catch (e) {
        console.log("announcements fetch error", e.message);
      }
    })();
  }, []);

  // fetch today's red flags (server returns array of { _id, userId, type, severity, date })
  useEffect(() => {
    (async () => {
      try {
        const r = await axios.get(`https://b-atlas-ncc.onrender.com/api/v1/admin/getredflags`, { withCredentials: true });
        const today = new Date().toISOString().split("T")[0];
        const todays = (r?.data?.message || []).filter((f) => {
          const flagDate = new Date(f.date).toISOString().split("T")[0];
          return flagDate === today;
        });
        setRedFlags(todays);
      } catch (e) {
        console.log("redflags fetch error", e.message);
      }
    })();
  }, []);

  // Filter counts for tabs
  const filteredCounts = {
    "All Issues": redFlags.length,
    "Missed Report": redFlags.filter((f) => f.type.includes("Missed Report")).length,
    "Low Performance": redFlags.filter((f) => f.type.includes("Low Performance")).length,
    "Inactive User": redFlags.filter((f) => f.type.includes("Inactive User")).length,
  };

  // update filteredRedFlags when activeTab or redFlags change
  useEffect(() => {
    if (activeTab === "All Issues") setFilteredRedFlags(redFlags);
    else setFilteredRedFlags(redFlags.filter((f) => {
      if (activeTab === "Missed Report") return f.type.includes("Missed Report");
      if (activeTab === "Low Performance") return f.type.includes("Low Performance");
      if (activeTab === "Inactive User") return f.type.includes("Inactive User");
      return false;
    }));
  }, [activeTab, redFlags]);

  // helper toggles
  // const toggleChannel = (k) => setChannels((s) => ({ ...s, [k]: !s[k] }));
  const toggleTeamSelect = (id) => setSelectedTeams((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const togglePersonSelect = (id) => setSelectedPeople((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const toggleRecipientSelect = (id) => setSelectedRecipients((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  // Select All for Targeted page (only currently filtered flags)
  const handleSelectAll = () => {
    const ids = filteredRedFlags.map((f) => f.userId);
    setSelectedRecipients(ids);
  };

  // publish announcement (calls API)
  const handlePublish = async () => {
  if (!title || !message) {
    toast.error("Title and message required");
    return;
  }

  const payload = {
    title,
    type,
    message,
    audience: audienceType,
selectedTeams:
  audienceType === "Specific Teams"
    ? selectedTeams
    : [],

selectedPeople:
  audienceType === "Individual Recipients"
    ? selectedPeople
    : [],
    priority,
    channels,
    scheduledAt: scheduleLater ? scheduledAt : null,
  };

  try {
    setPublishing(true);
    setPublishStep("Finding users");

    await new Promise(r => setTimeout(r, 700));
    setPublishStep("Extracting mail IDs");

    await new Promise(r => setTimeout(r, 700));
    setPublishStep("Sending emails");

    const r = await axios.post(
      `https://b-atlas-ncc.onrender.com/api/v1/admin/announcement`,
      payload,
      { withCredentials: true }
    );

    setPublishStep("Announcement published");

    toast.success("Announcement Created");

    setTimeout(() => {
      setPublishing(false);
      setPublishStep("");
      setTitle("");
      setMessage("");
      setAudience("All Employees");
      setSelectedTeams([]);
      setSelectedPeople([]);
      setScheduleLater(false);
      setScheduledAt("");
    }, 900);

  } catch (e) {
    setPublishing(false);
    setPublishStep("");
    toast.error("Could not create announcement");
  }finally{
    window.location.reload()
  }
};


  // CSS-friendly helpers for announcements read progress (avoid NaN)
  const getAudienceCount = (a) => {
    const teamsCount = (a?.includeTeams || []).length;
    const usersCount = (a?.includeUsers || []).length;
    return Math.max(1, teamsCount + usersCount); // avoid divide-by-zero
  };

  // overlay filtered lists
  const filteredTeams = useMemo(
    () => teams.filter((t) => String(t?.projectname || "").toLowerCase().includes(teamSearch.toLowerCase())),
    [teams, teamSearch]
  );
  const filteredPeople = useMemo(
    () => employees.filter((u) => String(u.name || "").toLowerCase().includes(peopleSearch.toLowerCase())),
    [employees, peopleSearch]
  );

  return (

    <div className={styles.pageWrap}>
       <div className={styles.topcontainer}>
              <div className={styles.topleft}>
        <div className={styles.topleft1}>Announcement</div>
        <div className={styles.topleft2}>
          Manage user roles and access levels.
        </div>
      </div>
              <div className={styles.topright}>
                <div className={styles.topright1} onClick={()=>{setOverlay(true)}}>Create Announcement</div>
              </div>
    </div>

     <div className={styles.historyWrapper}>
    <div className={styles.historyHeader}>
      <h2>Announcement History</h2>
      <p>
        Create and manage company-wide communications, team updates, and
        targeted notifications
      </p>
    </div>

    <div className={styles.historyList}>
      {announcements.length === 0 ? (
        <div className={styles.emptyHistory}>
          No announcements available.
        </div>
      ) : (
        announcements.map((announcement) => {
          const channels = [];

          if (announcement.channels?.banner)
            channels.push("Dashboard");
          if (announcement.channels?.email)
            channels.push("Email");
          if (announcement.channels?.push)
            channels.push("Push");

          return (
            <div
              className={styles.historyCard1}
              key={announcement._id}
            >
              <div className={styles.cardTop}>
                <h3>{announcement.title}</h3>
              </div>

              <p className={styles.cardMessage}>
                {announcement.details}
              </p>

              <div className={styles.cardBottom}>
                <span className={styles.channelText}>
                  <strong>Channels:</strong>{" "}
                  {channels.length
                    ? channels.join(", ")
                    : "Dashboard"}
                </span>

                <span className={styles.dateText}>
                  {new Date(
                    announcement.createdAt
                  ).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  {new Date(
                    announcement.createdAt
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
  </div>


    
    
   
      {publishing && (
  <div className={styles.publishOverlay}>
    <div className={styles.publishCard}>
      <div className={styles.dots}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <p className={styles.publishText}>{publishStep}...</p>
    </div>
  </div>
)}
{overlay && (
  <div
    className={styles.overlay}
    onClick={() => setOverlay(false)}
  >
    <div
      className={styles.broadcastModal}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}

      <div className={styles.modalHeader}>
        <h2>Create Broadcast</h2>

        <button
          className={styles.closeBtn}
          onClick={() => setOverlay(false)}
        >
          <X size={20} />
        </button>
      </div>

      {/* Title */}

      <input
        className={styles.input}
        placeholder="Announcement Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Message */}

      <textarea
        className={styles.textarea}
        placeholder="Enter your message here"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      {/* Communication Type */}

      <select
        className={styles.select}
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option>General Announcement</option>
        <option>Important Update</option>
        <option>Reminder</option>
        <option>Emergency</option>
      </select>

      {/* Audience + Delivery */}

      <div className={styles.doubleGrid}>
        {/* Left */}

        <div className={styles.card}>
  <h4>Target Audience</h4>

  {/* Whole Company */}

  <label className={styles.checkboxRow}>
    <input
      type="radio"
      name="audience"
      checked={audienceType === "All Employees"}
      onChange={() => {
        setAudienceType("All Employees");
        setAudience("All Employees");
        setSelectedTeams([]);
        setSelectedPeople([]);
      }}
    />

    <span>Whole Company</span>
  </label>

  {/* Teams */}

  <div
    className={styles.selectAudienceCard}
    onClick={() => {
      setAudienceType("Specific Teams");
      setAudience("Specific Teams");
      setTeamsOverlayOpen(true);
    }}
  >
    <div className={styles.selectAudienceLeft}>
      <input
        type="radio"
        checked={audienceType === "Specific Teams"}
        readOnly
      />

      <span>Teams</span>
    </div>

    <div className={styles.selectedCount}>
      {selectedTeams.length > 0
        ? `${selectedTeams.length} Selected`
        : "Select"}
    </div>
  </div>

  {/* Employees */}

  <div
    className={styles.selectAudienceCard}
    onClick={() => {
      setAudienceType("Individual Recipients");
      setAudience("Individual Recipients");
      setPeopleOverlayOpen(true);
    }}
  >
    <div className={styles.selectAudienceLeft}>
      <input
        type="radio"
        checked={audienceType === "Individual Recipients"}
        readOnly
      />

      <span>Employees</span>
    </div>

    <div className={styles.selectedCount}>
      {selectedPeople.length > 0
        ? `${selectedPeople.length} Selected`
        : "Select"}
    </div>
  </div>
</div>

        {/* Right */}

        <div className={styles.card}>
          <h4>Delivery Method</h4>

          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={channels.banner}
              onChange={() =>
                setChannels((s) => ({
                  ...s,
                  banner: !s.banner,
                }))
              }
            />

            <span>Dashboard Notification</span>
          </label>

          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={channels.email}
              onChange={() =>
                setChannels((s) => ({
                  ...s,
                  email: !s.email,
                }))
              }
            />

            <span>Email Dispatch</span>
          </label>

          <label className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={channels.push}
              onChange={() =>
                setChannels((s) => ({
                  ...s,
                  push: !s.push,
                }))
              }
            />

            <span>Push Notification</span>
          </label>
        </div>
      </div>

      {/* Schedule */}
{/* 
     <div className={styles.scheduleRow}>
  <span>Schedule For Later</span>

  <input
    type="date"
    className={styles.dateInput}
    value={
      scheduledAt
        ? new Date(scheduledAt).toLocaleDateString("en-CA")
        : ""
    }
    onChange={(e) => {
      const current = scheduledAt
        ? new Date(scheduledAt)
        : new Date();

      const [year, month, day] = e.target.value.split("-").map(Number);

      current.setFullYear(year, month - 1, day);

      setScheduledAt(current);
      setScheduleLater(true);
    }}
  />

  <input
    type="time"
    className={styles.timeInput}
    value={
      scheduledAt
        ? `${String(new Date(scheduledAt).getHours()).padStart(2, "0")}:${String(
            new Date(scheduledAt).getMinutes()
          ).padStart(2, "0")}`
        : ""
    }
    onChange={(e) => {
      const current = scheduledAt
        ? new Date(scheduledAt)
        : new Date();

      const [hours, minutes] = e.target.value.split(":").map(Number);

      current.setHours(hours);
      current.setMinutes(minutes);
      current.setSeconds(0);
      current.setMilliseconds(0);

      setScheduledAt(current);
      setScheduleLater(true);
    }}
  />
</div> */}

      {/* Priority */}

      <div className={styles.priorityRow}>
        <button
          className={`${styles.priorityBtn} ${
            priority === "Low"
              ? styles.activePriority
              : ""
          }`}
          onClick={() => setPriority("Low")}
        >
          Low
        </button>

        <button
          className={`${styles.priorityBtn} ${
            priority === "Medium"
              ? styles.activePriority
              : ""
          }`}
          onClick={() => setPriority("Medium")}
        >
          Medium
        </button>

        <button
          className={`${styles.priorityBtn} ${
            priority === "High"
              ? styles.activePriority
              : ""
          }`}
          onClick={() => setPriority("High")}
        >
          High
        </button>
      </div>

      {/* Footer */}

      <div className={styles.footer}>
        <button
          className={styles.createBtn}
          onClick={handlePublish}
          disabled={publishing}
        >
          {publishing
            ? "Creating..."
            : "Create New Assignment"}
        </button>

        <button
          className={styles.draftBtn}
          onClick={() => {
            handlePublish()
            toast.info("Draft Saved");
            setOverlay(false);
          }}
        >
          Save as draft
        </button>
      </div>
        {teamsOverlayOpen && (
        <div className={styles.overlay}>
          <div className={styles.overlayCard}>
            <div className={styles.overlayHeader}>
              <h3>Select Teams</h3>
              <button className={styles.iconBtn} onClick={() => setTeamsOverlayOpen(false)}><X size={16} /></button>
            </div>

            <input className={styles.overlaySearch} placeholder="Search teams..." value={teamSearch} onChange={(e) => setTeamSearch(e.target.value)} />

            <div className={styles.overlayList}>
              {filteredTeams.map((t) => (
                <label key={t._id} className={styles.overlayItem}>
                  <input type="checkbox" checked={selectedTeams.includes(t._id)} onChange={() => toggleTeamSelect(t._id)} />
                  <div>{t?.projectname}</div>
                </label>
              ))}
            </div>

            <div className={styles.overlayFooter}>
              <button className={styles.resetBtn} onClick={() => setSelectedTeams([])}>Clear</button>
              <button className={styles.publishBtn} onClick={() => setTeamsOverlayOpen(false)}>Done</button>
            </div>
          </div>
        </div>
      )}

     
      {peopleOverlayOpen && (
        <div className={styles.recipientOverlay}>
          <div className={styles.recipientModal}>
            <div className={styles.recipientHeader}>
              <span>Select Recipients</span>
              <button className={styles.closeBtn} onClick={() => setPeopleOverlayOpen(false)}>×</button>
            </div>

            <input type="text" className={styles.searchBar} placeholder="Search people..." value={peopleSearch} onChange={(e) => setPeopleSearch(e.target.value)} />

            <div className={styles.recipientList}>
              {filteredPeople.map((user) => (
                <label key={user._id} className={styles.recipientRow}>
                  <input type="checkbox" className={styles.checkBox} checked={selectedPeople.includes(user._id)} onChange={() => togglePersonSelect(user._id)} />
                  <img src={user.profilepicture || `https://i.pravatar.cc/48?u=${user._id}`} className={styles.avatar} alt="" />
                  <div className={styles.recipientInfo}>
                    <div className={styles.recipientName}>{user.name}</div>
                    <div className={styles.recipientRole}>{user.role}</div>
                  </div>
                </label>
              ))}
            </div>

            <div className={styles.footerBar}>
              <button className={styles.clearBtn} onClick={() => setSelectedPeople([])}>Clear</button>
              <button className={styles.doneBtn} onClick={() => setPeopleOverlayOpen(false)}>Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
    
  </div>
  
)}

    </div>
  );
}