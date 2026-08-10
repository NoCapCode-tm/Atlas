import React, { useMemo, useState, useEffect } from "react";
import styles from "../CSS/EmployeeProjectpage.module.css";
import { FolderOpen, Target, AlertTriangle, CheckCircle } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";

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
  const [user, setUser] = useState(null);
  const [range, setRange] = useState(30);
  const navigate = useNavigate();

  /* ── Fetch current user ── */
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `${API_URL}admin/getuser`,
          { withCredentials: true }
        );
        setUser(res.data.message || null);
      } catch (err) {
        console.log("Error fetching user:", err);
      }
    })();
  }, []);

  /* ── Fetch projects assigned to this employee ── */
  useEffect(() => {
    if (!user?._id) return; // Wait until current user is loaded

    (async () => {
      try {
        const res = await axios.get(
          `${API_URL}admin/getallproject`
        );
        const allProjects = res.data.message || [];

        // Filter projects where team.assignedMembers includes user._id
        const employeeProjects = allProjects.filter((p) =>
          p.team?.assignedMembers?.some(
            (member) => String(member?.userId ?? member) === String(user._id)
          )
        );

        setProjects(employeeProjects);
      } catch (err) {
        console.log("Error fetching projects:", err);
      }
    })();
  }, [user?._id]); // Re-run when user._id becomes available

  /* ── Fetch all users for avatar stack ── */
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `${API_URL}admin/getalluser`
        );
        setEmployees(res.data.message || []);
      } catch (err) {
        console.log("Error fetching employees:", err);
      }
    })();
  }, []);

  /* ── Range filter ── */
  const filterByRange = (p) => {
    const start = parseDate(p.timeline?.startDate);
    if (!start) return false;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - range);
    daysAgo.setHours(0, 0, 0, 0);
    return start >= daysAgo;
  };

  const today = todayDateOnly();

  /* ── Categorize ── */
  const categorized = useMemo(() => {
    const active = [], upcoming = [], overdue = [], completed = [];
    for (const p of projects.filter(filterByRange)) {
      const status = p.progress?.status;
      const start  = parseDate(p.timeline?.startDate);
      const end    = parseDate(p.timeline?.endDate);
      if (status === "Completed")       completed.push(p);
      else if (status === "Ongoing")    active.push(p);
      else if (status === "Pending") {
        if (start && start > today)     upcoming.push(p);
        else if (end && end < today)    overdue.push(p);
        else                            active.push(p);
      } else {
        active.push(p);
      }
    }
    return { active, upcoming, overdue, completed };
  }, [projects, today]);

  /* ── Helpers ── */
  const formatRange = (p) => {
    const s = parseDate(p.timeline?.startDate);
    const e = parseDate(p.timeline?.endDate);
    if (!s || !e) return "";
    const opt = { month: "short", day: "numeric" };
    return `${s.toLocaleDateString(undefined, opt)} – ${e.toLocaleDateString(undefined, opt)}`;
  };

  const avatarStack = (p) => {
    const members = p.team?.assignedMembers || [];
    return members.slice(0, 4).map((member, i) => {
      const userId = member?.userId ?? member;
      const emp = employees.find((u) => String(u._id) === String(userId));
      return (
        <img
          key={i}
          src={emp?.profilepicture ? emp.profilepicture : avatarUrl(userId)}
          alt="avatar"
          className={styles.avatar}
          style={{ left: `${i * 18}px`, zIndex: 10 - i }}
        />
      );
    });
  };

  /* ── Render ── */
  return (
    <div className={styles.adminprojects}>

      {/* HEADER — no Add Project button */}
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.pageTitle}>My Projects</h1>
          <p className={styles.subtitle}>Track and manage your assigned projects.</p>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.activeCard}`}>
          <div className={styles.statNumber}>{categorized.active.length}</div>
          <div className={styles.statLabel}>Active</div>
          <div className={styles.statIcon}>
            <FolderOpen size={40} color="#155DFC" />
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.onTrackCard}`}>
          <div className={styles.statNumber}>
            {projects.filter((p) => p.progress?.status === "Ongoing").length}
          </div>
          <div className={styles.statLabel}>On Track</div>
          <div className={styles.statIcon}>
            <Target size={40} color="#684EB9" />
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.atRiskCard}`}>
          <div className={styles.statNumber}>
            {projects.filter((p) => p.risks && p.risks.length > 0).length}
          </div>
          <div className={styles.statLabel}>At Risk</div>
          <div className={styles.statIcon}>
            <AlertTriangle size={40} color="#E17100" />
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.completedCard}`}>
          <div className={styles.statNumber}>{categorized.completed.length}</div>
          <div className={styles.statLabel}>Completed</div>
          <div className={styles.statIcon}>
            <CheckCircle size={40} color="#009966" />
          </div>
        </div>
      </div>

      {/* PROJECTS GRID */}
      <section className={styles.allProjects}>
        {projects.length === 0 ? (
          <div className={styles.emptyState}>
            <FolderOpen size={48} color="#6e7491" />
            <p>No projects assigned to you yet.</p>
          </div>
        ) : (
          <div className={styles.projectsGrid}>
            {projects.map((p, i) => {
              const percent = p.progress?.percent ?? 0;
              const status  = p.progress?.status || "Pending";

              let priorityClass = styles.mediumPriority;
              if (status === "Completed")              priorityClass = styles.lowPriority;
              else if (p.risks && p.risks.length > 0) priorityClass = styles.highPriority;

              return (
                <div
                  key={i}
                  className={`${styles.projectCard} ${priorityClass}`}
                  onClick={() => navigate(`/employee/projects/${p._id}`)}
                >
                  {/* Priority Badge */}
                  <div className={styles.priorityBadge}>
                    {p.risks && p.risks.length > 0
                      ? "High"
                      : status === "Completed"
                      ? "Low"
                      : "Medium"}
                  </div>

                  {/* Title & Description */}
                  <h3 className={styles.projectTitle}>{p.projectname}</h3>
                  <p className={styles.projectDesc}>{p.description}</p>

                  {/* Progress Bar */}
                  <div className={styles.progressSection}>
                    <div className={styles.progressHeader}>
                      <span className={styles.progressLabel}>Progress</span>
                      <span className={styles.progressPercent}>{percent}%</span>
                    </div>
                    <div className={styles.progressBarContainer}>
                      <div
                        className={styles.progressBarFill}
                        style={{ width: `${Math.min(100, percent)}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className={styles.projectFooter}>
                    <div className={styles.avatarGroup}>{avatarStack(p)}</div>
                    <div className={styles.projectDate}>📅 {formatRange(p)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Projects;