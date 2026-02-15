import React, { useMemo, useState, useEffect, useRef } from "react";
import styles from "../CSS/EmployeeProjectpage.module.css";
import { Plus, Edit2, EllipsisVertical, X } from "lucide-react";
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
  const[user,setUser]=useState()
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
        const res = await axios.get(`https://prismbackend-27d920759150.herokuapp.com/api/v1/admin/getuser`,{withCredentials:true});
        setUser(res.data.message || []);
      } catch (err) {
        console.log("Error fetching users:", err);
      }
    })();
  }, []);

useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`https://prismbackend-27d920759150.herokuapp.com/api/v1/admin/getallproject`);
        const employeeprojects = res.data.message.filter(p => p.team.assignedMembers && p.team.assignedMembers.userId === user?._id)
        setProjects(employeeprojects)
      } catch (err) {
        console.log("Error fetching projects:", err);
      }
    })();
  },[]);

 
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`https://prismbackend-27d920759150.herokuapp.com/api/v1/admin/getalluser`);
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
          `https://prismbackend-27d920759150.herokuapp.com/api/v1/admin/getalluser`,
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
        `https://prismbackend-27d920759150.herokuapp.com/api/v1/admin/addproject`,
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


  const ProjectCard = ({ p }) => {
    const percent = p.progress?.percent ?? 0;
    const riskCount = p.risks?.length || 0;
    const navigate = useNavigate()

    return (
      <div className={styles.projectCard} >
        <div className={styles.cardTop}>
          <div className={styles.cardTitle}>
            <div>
              <div className={styles.cardName}>{p.projectname}</div>
              <div className={styles.cardSub}>{p.description}</div>
            </div>
          </div>

          <div className={styles.cardActions}>
            <div className={styles.statusBadge}>
              {p.progress?.status === "Ongoing"
                ? "On Track"
                : p.progress?.status === "Completed"
                ? "Completed"
                : "Pending"}
            </div>
          </div>
        </div>

        <div className={styles.cardBody}>
          <div className={styles.progressLabel}>Progress</div>

          <div className={styles.progressBarWrap}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${Math.min(100, percent)}%` }}
              />
            </div>
            <div className={styles.progressPercent}>{percent}%</div>
          </div>

          {riskCount > 0 && <div className={styles.riskCount}>{riskCount} Risk</div>}

          <div className={styles.avatarRow}>
            <div className={styles.avatarStack}>{avatarStack(p)}</div>

            <div className={styles.cardFooterRight}>
              <div className={styles.dateRange}>{formatRange(p)}</div>
            </div>
          </div>

          <div className={styles.settinganddetails}>
            <div className={styles.viewDetails} onClick={()=>{
       navigate(`/employee/projects/${p._id}`)
      }}>View Details</div>
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

          <div className={styles.rangeSelector}>
            <select
  value={range}
  onChange={(e) => setRange(Number(e.target.value))}
>
  <option value="7">Last 7 Days</option>
  <option value="30">Last 30 Days</option>
  <option value="90">Last 90 Days</option>
</select>

          </div>
        </div>

        <div className={styles.headerActions}>
          <button className={styles.addBtn} onClick={()=>{setShowModal(true)}}>
            <Plus size={14} /> Add Project
          </button>
        </div>
      </div>

      <div className={styles.statusRow}>
        <div className={styles.statusColumn}>
          <h3>Active Projects</h3>
          <div className={styles.compactList}>
            {categorized.active.map((p, i) => (
              <CompactCard key={i} p={p} />
            ))}
          </div>
        </div>

        <div className={styles.statusColumn}>
          <h3>Upcoming</h3>
          <div className={styles.compactList}>
            {categorized.upcoming.map((p, i) => (
              <CompactCard key={i} p={p} />
            ))}
          </div>
        </div>

        <div className={styles.statusColumn}>
          <h3>Overdue</h3>
          <div className={styles.compactList}>
            {categorized.overdue.map((p, i) => (
              <CompactCard key={i} p={p} />
            ))}
          </div>
        </div>
      </div>

      <section className={styles.allProjects}>
        <h2>All Projects</h2>
        <div className={styles.grid}>
          {projects.map((p, i) => (
            <ProjectCard key={i} p={p}/>
          ))}
        </div>
      </section>
    </div>

    {showModal && (
         <div className={styles.overlay}>
      <div className={styles.modalWrap}>
        {/* LEFT - MAIN FORM */}
        <div className={styles.left}>
          <h3 className={styles.formTitle}>Create a new project :</h3>

          <label className={styles.label}>Project Name :</label>
          <input
            className={styles.input}
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Project Name"
          />

          <label className={styles.label}>Project Manager :</label>
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
              <label className={styles.label}>Project Duration :</label>
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
              <label className={styles.label}>Assign Team Members :</label>
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
              <label className={styles.label}>Role :</label>
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

          <label className={styles.label}>Description :</label>
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
        <div className={styles.right}>
          <div className={styles.searchWrap}>
            <input className={styles.search} placeholder="Search..." />
          </div>

          <div className={styles.employeesList}>
            {loadingUsers ? (
              <div className={styles.loading}>Loading employees...</div>
            ) : (
              employees.map((emp) => (
                <div
                  key={emp._id}
                  className={`${styles.empCard} ${isSelected(emp._id) ? styles.disabled : ""}`}
                  onClick={() => pickEmployeeQuick(emp._id)}
                >
                  <img
                    src={emp.profilepicture || `https://i.pravatar.cc/40?u=${emp._id}`}
                    alt=""
                    className={styles.empAvatar}
                  />
                  <div className={styles.empInfo}>
                    <div className={styles.empName}>{emp.name}</div>
                    <div className={styles.empRoleSmall}>{emp.designation.name}</div>
                    {/* show skills */}
                    {/* <div className={styles.skillRow}>
                      {staticSkills.slice(0, 4).map((s) => (
                        <button
                          key={s}
                          className={styles.skillTag}
                          onClick={(ev) => {
                            ev.stopPropagation();
                            // set member if not set
                            if (!selectedMember) setSelectedMember(emp._id);
                            onSkillClick(s);
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div> */}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* bottom simple selected summary with custom scrollbar */}
          <div className={styles.selectedPanel}>
            <div className={styles.selectedTitle}>Selected</div>
            <div className={styles.selectedScroll}>
              {team.map((t) => {
                const emp = employees.find((e) => e._id === t.userId);
                return (
                  <div className={styles.selectedRow} key={t.userId}>
                    <img
                      src={emp?.profilepicture || `https://i.pravatar.cc/40?u=${t.userId}`}
                      alt=""
                      className={styles.smallAvatar}
                    />
                    <div className={styles.selectedName}>{emp?.name || "---"}</div>
                    <button
                      className={styles.smallRemove}
                      onClick={() => removePair(t.userId)}
                    >
                      <X/>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
    )}
    </>
  );
};

export default Projects;
