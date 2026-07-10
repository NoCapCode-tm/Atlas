import React, { useMemo, useState, useEffect, useRef } from "react";
import styles from "../CSS/Projects.module.css";
import { Plus, Edit2, EllipsisVertical, X, BellRing, FileText, Files, Users } from "lucide-react";
import axios from "axios";
import {useNavigate} from "react-router-dom"
import {toast} from "react-toastify"


const todayDateOnly = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const parseDate = (v) => {
  if (!v) return null;
  try {
    const raw = typeof v === "string" ? v : v?.$date ?? v;
    const dt = new Date(raw);
    if (isNaN(dt)) return null;
    dt.setHours(0, 0, 0, 0);
    return dt;
  } catch {
    return null;
  }
};

const safeId = (id) => {
  if (!id) return "";
  if (typeof id === "string") return id;
  if (id.$oid) return id.$oid;
  return String(id);
};

const avatarUrl = (uid) => {
  const id = safeId(uid).slice(0, 8);
  return `https://i.pravatar.cc/40?u=${id}`;
};


const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [range, setRange] = useState(30); 
  const [showModal, setShowModal] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [managerId, setManagerId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [team, setTeam] = useState([]); 
  const navigate = useNavigate()
  const roles = [
    "Frontend Developer",
    "Backend Developer",
    "UI/UX Designer",
    "QA Tester",
    "DevOps",
    "Product Manager",
  ];

useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`https://b-atlas-ncc.onrender.com/api/v1/admin/getallproject`);
        setProjects(res.data.message || []);
      } catch (err) {
        console.log("Error fetching projects:", err);
      }
    })();
  }, []);

 
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`https://b-atlas-ncc.onrender.com/api/v1/admin/getalluser`);
        setEmployees(res.data.message || []);
      } catch (err) {
        console.log("Error fetching users:", err);
      }
    })();
  }, []);

  const filterByRange = (p) => {
  const start = parseDate(p.timeline?.startDate);
  if (!start) return false;

  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - range); 
  daysAgo.setHours(0, 0, 0, 0);

  return start >= daysAgo;
};


  const today = todayDateOnly();

  const categorized = useMemo(() => {
    const active = [];
    const upcoming = [];
    const overdue = [];
    const completed = [];

    for (const p of projects.filter(filterByRange)){
      const status = p.progress?.status;
      const start = parseDate(p.timeline?.startDate);
      const end = parseDate(p.timeline?.endDate);

      if (status === "Completed") {
        completed.push(p);
      } else if (status === "Ongoing") {
        active.push(p);
      } else if (status === "Pending") {
        if (start && start > today) {
          upcoming.push(p);
        } else if (end && end < today) {
          overdue.push(p);
        } else {
          active.push(p);
        }
      } else {
        active.push(p);
      }
    }

    return { active, upcoming, overdue, completed };
  }, [projects, today]);
  const totalProjects =
  projects.length 

const inProgress = categorized.active.length;

const atRisk = categorized.overdue.length;

const total = Math.max(totalProjects, 1);

const totalProgress = 100;

const activeProgress = (inProgress / total) * 100;

const riskProgress = (atRisk / total) * 100;


  const formatRange = (p) => {
    const s = parseDate(p.timeline?.startDate);
    const e = parseDate(p.timeline?.endDate);
    if (!s || !e) return "";
    const opt = { month: "short", day: "numeric" };
    return `${s.toLocaleDateString(undefined, opt)} to ${e.toLocaleDateString(undefined, opt)}`;
  };

  const avatarStack = (p) => {
  const members = p.team?.assignedMembers || [];

  return members.slice(0, 4).map((member, i) => {
    const userId = member?.userId ?? member;

    const user = employees.find(
      (u) => String(u._id) === String(userId)
    );

    return (
      <img
        key={i}
        src={
          user?.profilepicture
            ? user.profilepicture
            : avatarUrl(userId)
        }
        alt="avatar"
        className={styles.avatar}
        style={{ left: `${i * 18}px`, zIndex: 10 - i }}
      />
    );
  });
};


   const roleSelectRef = useRef(null);

  useEffect(() => {
    (async function loadUsers() {
      setLoadingUsers(true);
      try {
        const res = await axios.get(
          `https://b-atlas-ncc.onrender.com/api/v1/admin/getalluser`,
          { withCredentials: true }
        );
        setEmployees(res.data.message || []);
      } catch (e) {
        console.error("Failed to fetch employees", e);
      } finally {
        setLoadingUsers(false);
      }
    })();
  }, []);


  useEffect(() => {
    if (selectedMember && roleSelectRef.current) {
      roleSelectRef.current.focus();
    }
  }, [selectedMember]);

  const addPair = () => {
    if (!selectedMember || !selectedRole) return;
    
    if (team.some((t) => t.userId === selectedMember)) {
      setSelectedMember("");
      setSelectedRole("");
      return;
    }
    setTeam((t) => [...t, { userId: selectedMember, role: selectedRole }]);
    setSelectedMember("");
    setSelectedRole("");
  };

  const removePair = (userId) => {
    setTeam((t) => t.filter((x) => x.userId !== userId));
  };

 
  const pickEmployeeQuick = (userId) => {
    if (team.some((t) => t.userId === userId)) return; 
    setSelectedMember(userId);
    setTimeout(() => {
      if (roleSelectRef.current) roleSelectRef.current.focus();
    }, 10);
  };

  const onSkillClick = (skill) => {
    if (!selectedMember) return;

    const found = roles.find((r) =>
      r.toLowerCase().includes(skill.toLowerCase())
    );
    setSelectedRole(found || skill);

    setTimeout(addPair, 250);
  };

  const handleCreateProject = async () => {
    
    const payload = {
      projectname: projectName,
      description,
      startdate:startDate,
      enddate:endDate,
      manager: managerId || null,
      team: team,
      progress: { percent: 0, status: "Pending" },
      risks: [],
    };

    try {
      setLoadingUsers(true)
      console.log(payload)
      const res = await axios.post(
        `https://b-atlas-ncc.onrender.com/api/v1/admin/addproject`,
        payload,
        { withCredentials: true }
      );
      console.log("Created:", res.data.message);
      toast.success("Project Addedd Successfully")
      navigate("/projects")
      window.location.reload()

    } catch (err) {
      console.error("Create project failed", err);
      toast.error("Create failed - check console");
    }finally{
      setLoadingUsers(false)
    }
  };

 const stats = [
  {
    title: "Total Projects",
    value: totalProjects,
    progress: totalProgress,
    color: "#3D8BFF",
    icon: <Files size={22} color="rgba(220, 220, 255, 1)" />,
  },
  {
    title: "In progress",
    value: inProgress,
    progress: activeProgress,
    color: "#2FA86B",
    icon: null,
  },
  {
    title: "At risk",
    value: atRisk,
    progress: riskProgress,
    color: "#FF564B",
    icon: <BellRing size={22} color="#FF564B" />,
  },
];
  // helpers
  const managers = employees.filter(
    (e) => e.designation.name === "Manager" || e.role?.toLowerCase()?.includes("manager")
  );

  const isSelected = (userId) => team.some((t) => t.userId === userId);



  const CompactCard = ({ p }) => (
    <div className={styles.compactCard}>
      <div className={styles.compactLeft}>
        <div className={styles.compactLogo}></div>
        <div className={styles.compactTitle}>{p.projectname}</div>
      </div>
      <div className={styles.compactRight}>
        <div className={styles.compactMembers}>{p.team?.assignedMembers?.length || 0}</div>
      </div>
    </div>
  );

  const getProjectProgress = (project) => {
  const start = parseDate(project.timeline?.startDate);
  const end = parseDate(project.timeline?.endDate);
  const today = todayDateOnly();

  if (!start || !end) {
    return {
      progress: 0,
      label: "On-Hold",
      className: styles.onHold,
    };
  }

  const totalDuration = end.getTime() - start.getTime();
  const elapsed = today.getTime() - start.getTime();

  // Before project starts
  if (today < start) {
    return {
      progress: 0,
      label: "On-Hold",
      className: styles.onHold,
    };
  }

  // After deadline
  if (today > end) {
    return {
      progress: 100,
      label: "Overdue",
      className: styles.overdue,
    };
  }

  let progress = Math.round((elapsed / totalDuration) * 100);

  progress = Math.max(0, Math.min(progress, 100));

  // Completed project
  if (project.progress?.status === "Completed") {
    return {
      progress: 100,
      label: "Completed",
      className: styles.completed,
    };
  }

  return {
    progress,
    label: "On-Track",
    className: styles.onTrack,
  };
};

const ProjectCard = ({ p }) => {
  const navigate = useNavigate();

  const memberCount =
    p.team?.assignedMembers?.length ||
    p.team?.length ||
    0;

  const {
    progress: percent,
    label,
    className,
  } = getProjectProgress(p);

  return (
    <div className={styles.projectCard}>

      <div className={styles.cardHeader}>
        <h2 className={styles.projectTitle}>
          {p.projectname}
        </h2>

        <div className={styles.memberCount}>
          <Users size={18}/>
          <span>{memberCount}</span>
        </div>
      </div>

      <div className={styles.cardMiddle}>
        <span className={`${styles.statusBadge} ${className}`}>
          {label}
        </span>

        <button
          className={styles.viewBtn}
          onClick={() => navigate(`/projects/${p._id}`)}
        >
          View Details
        </button>
      </div>

      <div className={styles.cardFooter}>
        <span className={styles.progressLabel}>
          Progress
        </span>

        <div className={styles.progressRow}>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{
                width: `${percent}%`,
              }}
            />
          </div>

          <span className={styles.progressText}>
            {percent}%
          </span>
        </div>
      </div>

    </div>
  );
};
  return (
    <>
    <div className={styles.adminprojects}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.pageTitle}>Projects</h1>
          <span className={styles.subtext}>Manage project allocation, assignments, and team ownership</span>
        </div>

        <div className={styles.headerActions}>
          <button className={styles.addBtn} onClick={()=>{setShowModal(true)}}>
            <Plus size={14} /> Add Project
          </button>
        </div>
      </div>

<div className={styles.statsContainer}>
  {stats.map((card, index) => (
    <div className={styles.statCard} key={index}>
      <div className={styles.statTop}>
        <span className={styles.statTitle}>
          {card.title}
        </span>

        {card.icon && (
          <div className={styles.statIcon}>
            {card.icon}
          </div>
        )}
      </div>

      <h2 className={styles.statValue}>
        {card.value}
      </h2>

      <div className={styles.progressTrack}>
        <div
          className={styles.progressFill}
          style={{
            width: `${card.progress}%`,
            background: card.color,
          }}
        />
      </div>
    </div>
  ))}
</div>

      <section className={styles.allProjects}>
        <h2>All Projects</h2>
      </section>
      
      <div className={styles.projectGrid}>
  {projects.map((p) => (
    <ProjectCard
      key={p._id}
      p={p}
    />
  ))}
</div>

    </div>

    {showModal && (
         <div className={styles.overlay} onClick={() => setShowModal(false)}>
      <div className={styles.modalWrap} onClick={(e) => e.stopPropagation()}>
        {/* LEFT - MAIN FORM */}
        <div className={styles.left}>
          <h3 className={styles.formTitle}>Create a new project :</h3>

          <label className={styles.label}>Project Name<span style={{color:"red",margin:"0px 5px"}}>*</span> :</label>
          <input
            className={styles.input}
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Project Name"
          />

          <label className={styles.label}>Project Manager<span style={{color:"red",margin:"0px 5px"}}>*</span>:</label>
          <select
            className={styles.input}
            value={managerId}
            onChange={(e) => setManagerId(e.target.value)}
          >
            <option value="">Select Manager</option>
            {managers.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name} ({m.designation.name})
              </option>
            ))}
          </select>

          <div className={styles.row}>
            <div style={{ flex: 1 }}>
              <label className={styles.label}>Project Duration<span style={{color:"red",margin:"0px 5px"}}>*</span> :</label>
              <input
                type="date"
                className={styles.input}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label className={styles.label}>&nbsp;</label>
              <input
                type="date"
                className={styles.input}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div style={{ flex: 1 }}>
              <label className={styles.label}>Assign Team Members<span style={{color:"red",margin:"0px 5px"}}>*</span> :</label>
              <select
                className={styles.input}
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
              >
                <option value="">Select employee</option>
                {employees.map((emp) => (
                  <option
                    key={emp._id}
                    value={emp._id}
                    disabled={isSelected(emp._id)}
                  >
                    {emp.name} — {emp?.designation?.name || "No Role"}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ width: 8 }} />

            <div style={{ flex: 1 }}>
              <label className={styles.label}>Role<span style={{color:"red",margin:"0px 5px"}}>*</span> :</label>
              <select
                ref={roleSelectRef}
                className={styles.input}
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                disabled={!selectedMember}
              >
                <option value="">Select role</option>
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className={styles.addRow}>
            <button
              className={styles.addBtn}
              onClick={addPair}
              disabled={!selectedMember || !selectedRole}
            >
              Add
            </button>
          </div>

          <label className={styles.label}>Description<span style={{color:"red",margin:"0px 5px"}}>*</span> :</label>
          <textarea
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Project description..."
          />

          {/* Selected chips */}
          <div className={styles.selectedWrap}>
            {team.map((t) => {
              const emp = employees.find((e) => e._id === t.userId);
              return (
                <div key={t.userId} className={styles.chip}>
                  <img
                    src={emp?.profilepicture || `https://i.pravatar.cc/40?u=${t.userId}`}
                    alt=""
                    className={styles.chipAvatar}
                  />
                  <div className={styles.chipText}>
                    <div className={styles.chipName}>{emp?.name || "Unknown"}</div>
                    <div className={styles.chipRole}>{t.role}</div>
                  </div>
                  <button
                    className={styles.chipRemove}
                    onClick={() => removePair(t.userId)}
                    aria-label="remove"
                  >
                    <X/>
                  </button>
                </div>
              );
            })}
          </div>

          <div className={styles.formFooter}>
            <button className={styles.cancelBtn} onClick={()=>{setShowModal(false)}}>
              Cancel
            </button>
            <button className={styles.createBtn} onClick={handleCreateProject}>
              {loadingUsers?"Creating...":"Create"}
            </button>
          </div>
        </div>

        {/* RIGHT - employee + skills */}
       
      </div>
    </div>
    )}
    </>
  );
};

export default Projects;
