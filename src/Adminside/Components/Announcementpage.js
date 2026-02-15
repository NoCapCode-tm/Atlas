import React, { useState, useMemo, useEffect } from "react";
import styles from "../CSS/Announcementpage.module.css";
import { Calendar, Clock, Users, X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { InfoTooltip } from "./InfoTooltip";


export default function Announcementpage() {
  // CREATE tab state
  const [title, setTitle] = useState("");
  const [type, setType] = useState("General Announcement");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("All Employees");
  const [priority, setPriority] = useState("High");
  const [channels, setChannels] = useState({ banner: true, email: false, push: false });
  const [scheduleLater, setScheduleLater] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");

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
        const r = await axios.get(`https://atlasbackend-px53.onrender.com/api/v1/admin/getroles`);
        if (r?.data?.message) setTeams(r.data.message);
      } catch (e) {
        console.log("roles fetch error", e.message);
      }
    })();

    (async () => {
      try {
        const r = await axios.get(`https://atlasbackend-px53.onrender.com/api/v1/admin/getalluser`, { withCredentials: true });
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
        const r = await axios.get(`https://atlasbackend-px53.onrender.com/api/v1/admin/getannouncements`);
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
        const r = await axios.get(`https://atlasbackend-px53.onrender.com/api/v1/admin/getredflags`, { withCredentials: true });
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
    audience,
    selectedTeams,
    selectedPeople,
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
      `https://atlasbackend-px53.onrender.com/api/v1/admin/announcement`,
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
    () => teams.filter((t) => String(t.rolename || "").toLowerCase().includes(teamSearch.toLowerCase())),
    [teams, teamSearch]
  );
  const filteredPeople = useMemo(
    () => employees.filter((u) => String(u.name || "").toLowerCase().includes(peopleSearch.toLowerCase())),
    [employees, peopleSearch]
  );

  return (

    <div className={styles.pageWrap}>
      <div className={styles.header}>
        <h1>Announcements & Broadcast
           <InfoTooltip text="Create and manage organization-wide communications" />
        </h1>
        <p className={styles.hint}>Create and manage company-wide communications, team updates, and targeted notifications</p>

        <div className={styles.toggleheadings}>
          <span className={active === "create" ? styles.activetoggler : styles.toggler} onClick={() => setActive("create")}>+ Create Announcement</span>
          <span className={active === "history" ? styles.activetoggler : styles.toggler} onClick={() => setActive("history")}>Archive & History</span>
          <span className={active === "target" ? styles.activetoggler : styles.toggler} onClick={() => setActive("target")}>Targeted Notifications</span>
        </div>
      </div>

      {/* ================= CREATE ================= */}
      {active === "create" && (
        <div className={styles.card}>
          <div className={styles.cardTitleRow}>
            <h2>Create New Announcement</h2>
            <div className={styles.cardSub}>Compose and schedule announcements, updates, or targeted communications</div>
          </div>

          <div className={styles.row}>
            <label className={styles.smallLabel}>Communication Type</label>
            <div className={styles.typeRow}>
              <label className={styles.typeCheckbox}><input type="checkbox" checked={type === "General Announcement"} onChange={() => setType("General Announcement")} /> General Announcement</label>
              <label className={styles.typeCheckbox}><input type="checkbox" checked={type === "Warning/Inquiry"} onChange={() => setType("Warning/Inquiry")} /> Warning/Inquiry</label>
              <label className={styles.typeCheckbox}><input type="checkbox" checked={type === "Motivational"} onChange={() => setType("Motivational")} /> Motivational</label>
            </div>
          </div>

          <div className={styles.row}>
            <label className={styles.smallLabel}>Title <span className={styles.required}>*</span></label>
            <input className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter announcement title" />
          </div>

          <div className={styles.row}>
            <label className={styles.smallLabel}>Message <span className={styles.required}>*</span></label>
            <textarea className={styles.textarea} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Enter your message..." />
          </div>

          <div className={styles.row}>
            <label className={styles.smallLabel}>Audience Group</label>
            <div className={styles.audienceRow}>
              <label className={styles.audOption}>
                <input type="radio" name="aud" checked={audience === "All Employees"} onChange={() => setAudience("All Employees")} /> <div>All Employees</div>
              </label>

              <label className={styles.audOption}>
                <input type="radio" name="aud" checked={audience === "Specific Teams"} onChange={() => setAudience("Specific Teams")} />
                <div>
                  Specific Teams
                  {audience === "Specific Teams" && <button className={styles.selectBtn} onClick={() => setTeamsOverlayOpen(true)}>Select Teams</button>}
                </div>
              </label>

              <label className={styles.audOption}>
                <input type="radio" name="aud" checked={audience === "Individual Recipients"} onChange={() => setAudience("Individual Recipients")} />
                <div>
                  Individual Recipients
                  {audience === "Individual Recipients" && <button className={styles.selectBtn} onClick={() => setPeopleOverlayOpen(true)}>Select People</button>}
                </div>
              </label>
            </div>

            <div className={styles.selectedRow}>
              {selectedTeams.map((id) => {
                const t = teams.find((x) => x._id === id);
                return <div className={styles.chip} key={id}>{t?.rolename}</div>;
              })}
              {selectedPeople.map((id) => {
                const p = employees.find((x) => x._id === id);
                return <div className={styles.chip} key={id}>{p?.name}</div>;
              })}
            </div>
          </div>

          <div className={styles.row}>
            <label className={styles.smallLabel}>Priority Level</label>
            <div className={styles.priorityRow}>
              <label className={styles.radioItem}><input type="radio" name="priority" checked={priority === "High"} onChange={() => setPriority("High")} /> High</label>
              <label className={styles.radioItem}><input type="radio" name="priority" checked={priority === "Medium"} onChange={() => setPriority("Medium")} /> Medium</label>
              <label className={styles.radioItem}><input type="radio" name="priority" checked={priority === "Low"} onChange={() => setPriority("Low")} /> Low</label>
            </div>
          </div>

          <div className={styles.row}>
            <label className={styles.smallLabel}>Delivery Channels</label>
            <div className={styles.channelList}>
              <label className={styles.deliveryItem}><input type="checkbox" checked={channels.banner} onChange={() => setChannels((c) => ({ ...c, banner: !c.banner }))} /><div><div className={styles.deliveryTitle}>Dashboard Banner</div><div className={styles.deliverySub}>Display as a prominent banner on the main dashboard</div></div></label>
              <label className={styles.deliveryItem}><input type="checkbox" checked={channels.email} onChange={() => setChannels((c) => ({ ...c, email: !c.email }))} /><div><div className={styles.deliveryTitle}>Email Notification</div><div className={styles.deliverySub}>Send email to all recipients</div></div></label>
              <label className={styles.deliveryItem}><input type="checkbox" checked={channels.push} onChange={() => setChannels((c) => ({ ...c, push: !c.push }))} /><div><div className={styles.deliveryTitle}>In-App Push Notification</div><div className={styles.deliverySub}>Real-time push notifications within the app (coming soon)</div></div></label>
            </div>
          </div>

          <div className={styles.row}>
            <label className={styles.smallLabel}>Schedule</label>
            <div className={styles.scheduleRow}>
              <label className={styles.checkboxInline}><input type="checkbox" checked={scheduleLater} onChange={() => setScheduleLater((s) => !s)} /> Schedule for later</label>
              {scheduleLater && <input className={styles.inputDate} type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />}
            </div>
          </div>

          <div className={styles.btnRow}>
            <button className={styles.resetBtn} onClick={() => { setTitle(""); setMessage(""); setType("General Announcement"); setAudience("All Employees"); setSelectedTeams([]); setSelectedPeople([]); setPriority("High"); setChannels({ banner: true, email: false, push: false }); setScheduleLater(false); setScheduledAt(""); }}>Reset</button>
            <button className={styles.publishBtn} onClick={handlePublish}>Publish Announcement</button>
          </div>
        </div>
      )}

      {/* ================= HISTORY ================= */}
      {active === "history" && (
        <div className={styles.historyWrap}>
          <h2 className={styles.historyTitle}>Announcement Archive & History</h2>
          <p className={styles.historySub}>View and track all previous announcements and their engagement metrics</p>

          {announcements.map((a, i) => (
            <div key={i} className={styles.historyCard}>
              <div className={styles.topRow}>
                <div className={styles.leftTop}>
                  <h3 className={styles.cardTitle}>{a.title}</h3>

                  <div className={styles.tagRow}>
                    <span className={`${styles.pill} ${styles[a.priority]}`}>{a.priority}</span>
                    <span className={`${styles.pill} ${styles.published}`}>Published</span>
                    <span className={`${styles.pill} ${styles.general}`}>{a.type}</span>
                  </div>
                </div>

                <div className={styles.readBox}>
                  <div className={styles.readCount}>
                    {a.readby}/{getAudienceCount(a.audience)}
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${(a.readby / getAudienceCount(a.audience)) * 100}%` }}></div>
                  </div>
                  <span className={styles.readLabel}>Read</span>
                </div>
              </div>

              <p className={styles.desc}>{a.details}</p>

              <div className={styles.metaRow}>
                <span className={styles.metaItem}><Calendar size={16} />{new Date(a.createdon || a.createdAt).toLocaleString("en-IN")}</span>
                <span className={styles.metaItem}><Users size={16} />{a.audience?.name || "All Employees"}</span>
                {a.scheduledon && <span className={styles.metaItemScheduled}><Clock size={16} /> Scheduled: {new Date(a.scheduledon).toLocaleString("en-IN")}</span>}
              </div>

              <div className={styles.scheduledfooter}>
                <div className={styles.channelRow}>Channels:
                  {(a.channels || []).map((c, idx) => <span key={idx} className={styles.channelPill}>{c}</span>)}
                </div>

                <div className={styles.footer}>By {a.scheduledby || "System"}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= TARGETED ================= */}
      {active === "target" && (
        <div className={styles.target}>
          <div className={styles.targetBanner}>
            <span className={styles.alertIcon}>⚠️</span>
            <div>
              <p className={styles.targethead}>Targeted Notifications for Red-Flag Users</p>
              <p className={styles.targetsubhead}>Send warning or inquiry messages to users requiring attention. This feature supports both disciplinary and motivational communication.</p>
            </div>
          </div>

          <div className={styles.filterTabs}>
            <h4>Filter Red-Flag Users</h4>
            <div className={styles.onlytabs}>
            {["All Issues", "Missed Report", "Low Performance", "Inactive User"].map((tab) => (
              <div key={tab} className={`${styles.filterTab} ${activeTab === tab ? styles.activeFilter : ""}`} onClick={() => setActiveTab(tab)}>
                {tab} ({filteredCounts[tab] || 0})
              </div>
            ))}</div>
          </div>

          <div className={styles.recipientHeaderRow}>
            <span className={styles.recipientHeaderTitle}>Select Recipients</span>
            <button className={styles.selectAllBtn} onClick={handleSelectAll}>Select All</button>
          </div>

          <div className={styles.redFlagList}>
            {filteredRedFlags.length === 0 ? (
              <div className={styles.noData}>No issues found for today.</div>
            ) : (
              filteredRedFlags.map((rf) => {
                const user = employees.find((u) => String(u._id) === String(rf.userId));
                return (
                  <div key={rf._id} className={styles.redFlagCard}>
                    <input type="checkbox" className={styles.cardCheckbox} checked={selectedRecipients.includes(rf.userId)} onChange={() => toggleRecipientSelect(rf.userId)} />
                    <img src={user?.profilepicture || `https://i.pravatar.cc/48?u=${rf.userId}`} alt="" className={styles.cardAvatar} />
                    <div className={styles.cardInfo}>
                      <div className={styles.cardTopRow}><strong>{user?.name || "Unknown"}</strong></div>
                      <div className={styles.cardRole}>{user?.designation?.name || "No Role Assigned"}</div>
                      <div className={styles.badgesRow}>
                        <span className={`${styles.badge} ${styles[`sev_${rf.severity?.toLowerCase()}`]}`}>{rf.severity?.toUpperCase()}</span>
                        <span className={styles.badge1}>{rf.type? rf.type.map((t)=>{
                          return(
                            <span className={styles.badge}>{t}</span>
                          )
                        }):""}</span>
                      </div>
                      <div className={styles.cardMessage}>
                        {rf.type.includes("Missed Report")?rf.reason.includes("Missed daily"):""}
                        {rf.type.includes("Low Performance")?rf.reason.includes("Performance dropped"):""}
                        {rf.type.includes("Inactive User")?rf.reason.includes("No activity"):""}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TEAMS OVERLAY */}
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
                  <div>{t.rolename}</div>
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

      {/* PEOPLE OVERLAY */}
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

    </div>
  );
}