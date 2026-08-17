import React, { useState, useEffect, useRef } from "react";
import styles from "../css/ManagerDashboard.module.css";
import useWindowWidth from "../../useWindowWidth";
import {
  Users,
  Plus,
  Briefcase,
  Clock,
  AlertCircle,
  TrendingUp,
  Check,
  X,
  AlertTriangle,
  ChevronDown,
  Download
} from "lucide-react";
import ManagerSidebar from "../components/ManagerSidebar";
import ManagerHeader from "../components/ManagerHeader";
import ManagerTeam from "../components/ManagerTeam";

function ManagerDashboard() {
  const width = useWindowWidth();
  const isMobile = width <= 425;
  const isTablet = width > 425 && width <= 768;

  const storedName = localStorage.getItem("managerName") || "Om Vashishtha";
  const firstName = storedName.split(" ")[0];
  const initials = storedName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [collapsed, setCollapsed] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalForm, setModalForm] = useState({ title: "", assignee: "", priority: "", description: "" });
  const [openDropdown, setOpenDropdown] = useState(null); // 'assignee' | 'priority' | null
  const assigneeRef = useRef(null);
  const priorityRef = useRef(null);

  const handleModalClose = () => {
    setShowModal(false);
    setOpenDropdown(null);
  };
  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (!modalForm.assignee || !modalForm.priority) {
      alert("Please select both Assignee and Priority.");
      return;
    }
    setShowModal(false);
    setOpenDropdown(null);
    setModalForm({ title: "", assignee: "", priority: "", description: "" });
  };

  const prevWidthRef = useRef(width);
  useEffect(() => {
    if (prevWidthRef.current > 768 && width <= 768) {
      setCollapsed(true);
    }
    prevWidthRef.current = width;
  }, [width]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (assigneeRef.current && !assigneeRef.current.contains(event.target)) &&
        (priorityRef.current && !priorityRef.current.contains(event.target))
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [approvalsList, setApprovalsList] = useState([
    { id: 1, type: "Task Approval", subtitle: "Lisa M. · Homepage Redesign V2", initials: "LM" },
    { id: 2, type: "Task Approval", subtitle: "Lisa M. · Homepage Redesign V2", initials: "LM" },
    { id: 3, type: "Task Approval", subtitle: "Lisa M. · Homepage Redesign V2", initials: "LM" },
    { id: 4, type: "Task Approval", subtitle: "John D. · API Integration", initials: "JD" }
  ]);

  const stats = [
    {
      title: "Team Size",
      value: "24",
      subtext: "+2 this month",
      icon: <Users size={24} />
    },
    {
      title: "Projects Assigned",
      value: "12",
      subtext: "3 nearing deadlines",
      icon: <Briefcase size={24} />
    },
    {
      title: "Tasks Pending",
      value: "148",
      subtext: "15 high priority",
      icon: <Clock size={24} />
    },
    {
      title: "Missed Reports",
      value: "3",
      subtext: "Requires attention",
      icon: <AlertCircle size={24} className={styles.dangerIcon} />
    }
  ];

  const teamMembers = [
    { name: "Alice Freeman", role: "Designer", initials: "AF", status: "online" },
    { name: "Bob Smith", role: "Developer", initials: "BS", status: "online" },
    { name: "Charlie Day", role: "Manager", initials: "CD", status: "away" },
    { name: "Diana Prince", role: "Marketing", initials: "DP", status: "away" },
    { name: "Evan Wright", role: "Developer", initials: "EW", status: "online" },
    { name: "Fiona Gallagher", role: "HR Specialist", initials: "FG", status: "online" },
    { name: "George Clark", role: "Product Manager", initials: "GC", status: "away" },
    { name: "Hannah Abbott", role: "QA Engineer", initials: "HA", status: "online" },
    { name: "Ian Malcolm", role: "Data Analyst", initials: "IM", status: "online" },
    { name: "Julia Roberts", role: "UX Researcher", initials: "JR", status: "away" },
    { name: "Kevin Bacon", role: "Designer", initials: "KB", status: "online" },
    { name: "Lisa Simpson", role: "Developer", initials: "LS", status: "online" },
    { name: "Matt Damon", role: "Product Manager", initials: "MD", status: "away" },
    { name: "Natalie Portman", role: "Designer", initials: "NP", status: "online" },
    { name: "Owen Wilson", role: "Developer", initials: "OW", status: "online" },
    { name: "Penelope Cruz", role: "HR Specialist", initials: "PC", status: "away" },
    { name: "Quincy Jones", role: "QA Engineer", initials: "QJ", status: "online" },
    { name: "Rihanna Fenty", role: "Marketing", initials: "RF", status: "online" },
    { name: "Sam Wilson", role: "Developer", initials: "SW", status: "away" },
    { name: "Taylor Swift", role: "Data Analyst", initials: "TS", status: "online" },
    { name: "Uma Thurman", role: "UX Researcher", initials: "UT", status: "online" },
    { name: "Vin Diesel", role: "Developer", initials: "VD", status: "away" },
    { name: "Will Smith", role: "QA Engineer", initials: "WS", status: "online" },
    { name: "Zach Galifianakis", role: "Designer", initials: "ZG", status: "online" }
  ];

  const criticalTasks = [
    { title: "Server Migration Sign-off", priority: "High", due: "Due 5:00 PM", assignee: "David L.", avatar: "DL" },
    { title: "Server Migration Sign-off", priority: "Med", due: "Due 5:00 PM", assignee: "David L.", avatar: "DL" },
    { title: "Server Migration Sign-off", priority: "Med", due: "Due 5:00 PM", assignee: "David L.", avatar: "DL" },
    { title: "Server Migration Sign-off", priority: "High", due: "Due 5:00 PM", assignee: "David L.", avatar: "DL" }
  ];

  const dailyUpdates = [
    {
      user: "Emily R.",
      action: "submitted daily report",
      time: "10:30 AM",
      quote: '"Completed the UI mockups for the new dashboard."',
      nodeClass: styles.nodePurple
    },
    {
      user: "James T.",
      action: "updated task status",
      time: "11:15 AM",
      quote: '"Moved API Integration In Progress."',
      nodeClass: styles.nodeBlue
    },
    {
      user: "Emily R.",
      action: "submitted daily report",
      time: "10:30 AM",
      quote: '"Completed Pending Tasks."',
      nodeClass: styles.nodeOrange
    }
  ];

  const taskStatus = [
    { name: "To Do", tasks: "12 Tasks", width: "60%", barClass: styles.barBlue, pillClass: styles.pillBlue },
    { name: "In Progress", tasks: "8 Tasks", width: "55%", barClass: styles.barPurple, pillClass: styles.pillPurple },
    { name: "Review", tasks: "5 Tasks", width: "50%", barClass: styles.barRed, pillClass: styles.pillOrange },
    { name: "Completed", tasks: "24 Tasks", width: "72%", barClass: styles.barGreen, pillClass: styles.pillGreen }
  ];

  const escalations = [
    { title: "API Gateway Timeout", time: "10m ago", severity: "CRITICAL", badgeClass: styles.badgeCritical },
    { title: "Login Dependency Block", time: "1h ago", severity: "HIGH", badgeClass: styles.badgeHighEsc },
    { title: "License Expiry Warning", time: "3h ago", severity: "MEDIUM", badgeClass: styles.badgeMediumEsc },
    { title: "Database Disk Full", time: "5m ago", severity: "CRITICAL", badgeClass: styles.badgeCritical }
  ];

  const handleAction = (id) => {
    setApprovalsList(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className={styles.dashboardContainer}>
      <ManagerHeader
        title={activeTab === "Dashboard" ? "Dashboard" : ""}
        subtitle={
          activeTab === "Dashboard"
            ? (isMobile ? `Welcome back, ${firstName}` : "Welcome back, here's what's happening today.")
            : ""
        }
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
        userName={storedName}
        initials={initials}
      >
        <button className={styles.quickAssignBtn} onClick={() => setShowModal(true)}>
          <Plus size={16} />
          <span>Quick Assign</span>
        </button>
      </ManagerHeader>

      <div className={styles.dashboardBody}>
        <ManagerSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <main className={styles.mainContent}>

        {activeTab === "Dashboard" && (
          <>
          <section className={styles.statsGrid}>
          {stats.map((stat, idx) => (
            <div key={idx} className={styles.statCard}>
              <div className={styles.statCardTop}>
                <span className={styles.statTitle}>{stat.title}</span>
              </div>
              <div className={styles.statCardMiddle}>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statIconWrap}>{stat.icon}</div>
              </div>
              <div className={styles.statCardBottom}>
                <span className={styles.statSubtext}>{stat.subtext}</span>
              </div>
            </div>
          ))}
        </section>

        <div className={styles.dashboardMainGrid}>
          <div className={`${styles.gridRow} ${styles.rowTwoColumns}`}>
            <div className={styles.cardBlock}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Team Performance</h2>
                <span className={styles.badgeGreen}>
                  <TrendingUp size={12} /> +12%
                </span>
              </div>

              <div className={styles.performanceMetrics}>
                <div className={`${styles.metricMiniCard} ${styles.bgPurple}`}>
                  <span className={styles.metricLabel}>Average Score</span>
                  <span className={styles.metricVal}>92/100</span>
                </div>
                <div className={`${styles.metricMiniCard} ${styles.bgBlue}`}>
                  <span className={styles.metricLabel}>Consistency</span>
                  <span className={styles.metricVal}>98%</span>
                </div>
                <div className={`${styles.metricMiniCard} ${styles.bgPeach}`}>
                  <span className={styles.metricLabel}>Top Performer</span>
                  <span className={styles.metricVal}>
                    S. Miller <span className={styles.performerIndicator} />
                  </span>
                </div>
              </div>

              <div className={styles.chartContainer}>
                <svg className={styles.svgChart} viewBox="0 0 500 135" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6d78ff" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#2035FF" stopOpacity="1" />
                    </linearGradient>
                  </defs>

                  <line x1="0" y1="4" x2="500" y2="4" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="6 4" />
                  <line x1="0" y1="36" x2="500" y2="36" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="6 4" />
                  <line x1="0" y1="68" x2="500" y2="68" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="6 4" />
                  <line x1="0" y1="100" x2="500" y2="100" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="6 4" />
                  <line x1="0" y1="132" x2="500" y2="132" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="6 4" />

                  <path
                    d="M 0 78 C 50 56 90 42 140 50 C 178 57 210 72 260 75 C 298 78 330 60 370 44 C 402 30 450 20 500 22 L 500 132 L 0 132 Z"
                    fill="url(#waveGradient)"
                  />

                  <path
                    d="M 0 78 C 50 56 90 42 140 50 C 178 57 210 72 260 75 C 298 78 330 60 370 44 C 402 30 450 20 500 22"
                    fill="none"
                    stroke="#5C83F6"
                    strokeWidth="3"
                  />
                </svg>

                <div className={styles.chartAxis}>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sun</span>
                </div>
              </div>
            </div>

            <div className={`${styles.cardBlock} ${styles.teamActivityCard}`}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Team Activity</h2>
                <span className={styles.badgeBlue}>24 Online</span>
              </div>

              <div className={styles.activityScrollContainer}>
                <div className={styles.activityGrid}>
                  {teamMembers.map((member, index) => (
                    <div key={index} className={styles.memberItem}>
                      <div className={styles.avatarWrapper}>
                        <div className={styles.memberAvatar}>{member.initials}</div>
                        <span className={member.status === "online" ? styles.statusDotGreen : styles.statusDotOrange} />
                      </div>
                      <div className={styles.memberInfo}>
                        <span className={styles.memberName}>{member.name}</span>
                        <span className={styles.memberRole}>{member.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.gridRow} ${styles.rowEqualColumns}`}>
            <div className={styles.columnGroup}>
              <div className={styles.cardBlock}>
                <div className={styles.criticalHeader}>
                  <div className={styles.cardTitleWrap}>
                    <AlertTriangle size={19} color="#ef4444" />
                    <h2 className={`${styles.cardTitle} ${styles.criticalCardTitle}`}>Critical Tasks</h2>
                  </div>
                  <span className={styles.badgeRedTag}>3 Due Today</span>
                </div>
                <div className={styles.cardDivider} />

                <div className={styles.tasksScrollContainer}>
                  <div className={styles.tasksGrid}>
                    {criticalTasks.map((task, idx) => (
                      <div key={idx} className={styles.taskCardItem}>
                        <div className={styles.taskAvatar}>{task.avatar}</div>
                        <div className={styles.taskContent}>
                          <div className={styles.taskTopRow}>
                            <span className={styles.taskTitleText}>{task.title}</span>
                            <span className={task.priority === "High" ? styles.badgeHigh : styles.badgeMed}>
                              {task.priority}
                            </span>
                          </div>
                          <div className={styles.taskMetaGroup}>
                            <div className={styles.taskDueRow}>
                              <Clock size={12} />
                              <span>{task.due}</span>
                            </div>
                            <span className={styles.taskAssignee}>{task.assignee}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.cardBlock}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Daily Updates</h2>
                </div>

                <div className={styles.timelineList}>
                  {dailyUpdates.map((update, idx) => (
                    <div key={idx} className={styles.timelineItem}>
                      <div className={update.nodeClass} />
                      <div className={styles.timelineContent}>
                        <div className={styles.timelineTextGroup}>
                          <span className={styles.timelineUser}>{update.user}</span>
                          <span className={styles.timelineAction}>{update.action}</span>
                        </div>
                        <span className={styles.timelineTime}>{update.time}</span>
                        <div className={styles.speechCard}>{update.quote}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.cardBlock}>
                <div className={`${styles.cardHeader} ${styles.statusHeader}`}>
                  <h2 className={styles.cardTitle}>Task Status</h2>
                </div>

                <div className={styles.statusRows}>
                  {taskStatus.map((status, idx) => (
                    <div key={idx} className={styles.statusRowItem}>
                      <div className={styles.statusLabelGroup}>
                        <span className={styles.statusName}>{status.name}</span>
                        <span className={`${styles.statusBadgePill} ${status.pillClass}`}>{status.tasks}</span>
                      </div>
                      <div className={styles.progressBarTrack}>
                        <div className={status.barClass} style={{ width: status.width }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.columnGroup}>
              <div className={styles.cardBlock}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Action Center</h2>
                  <span className={styles.badgePending}>{approvalsList.length} Pending</span>
                </div>

                <div className={styles.actionScrollContainer}>
                  <div className={styles.actionList}>
                    {approvalsList.map((item) => (
                      <div key={item.id} className={styles.actionCardItem}>
                        <div className={styles.actionLeft}>
                          <div className={styles.actionAvatar}>{item.initials}</div>
                          <div className={styles.actionMeta}>
                            <span className={styles.actionType}>{item.type}</span>
                            <span className={styles.actionSub}>{item.subtitle}</span>
                          </div>
                        </div>
                        <div className={styles.actionBtns}>
                          <button
                            className={styles.btnReject}
                            title="Reject"
                            onClick={() => handleAction(item.id)}
                          >
                            <X size={14} />
                          </button>
                          <button
                            className={styles.btnApprove}
                            title="Approve"
                            onClick={() => handleAction(item.id)}
                          >
                            <Check size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.cardBlock}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitleWrap}>
                    <AlertCircle size={15} color="#ef4444" />
                    <h2 className={styles.cardTitle}>Escalations</h2>
                  </div>
                </div>

                <div className={styles.escalationScrollContainer}>
                  <div className={styles.escalationsList}>
                    {escalations.map((item, idx) => (
                      <div key={idx} className={styles.escalationCard}>
                        <div className={styles.escalationLeft}>
                          <AlertCircle size={14} className={styles.escalationIcon} />
                          <div className={styles.escalationInfo}>
                            <span className={styles.escalationTitle}>{item.title}</span>
                            <span className={styles.escalationTime}>{item.time}</span>
                          </div>
                        </div>
                        <span className={item.badgeClass}>{item.severity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </>
        )}
        {activeTab === "My Team" && <ManagerTeam />}
      </main>
      </div>

      {showModal && (
        <div className={styles.modalOverlay} onClick={handleModalClose}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>Quick Assign Task</h2>
                <p className={styles.modalSubtitle}>Assign a new task to a team member instantly.</p>
              </div>
              <button className={styles.modalCloseBtn} onClick={handleModalClose} title="Close">
                <X size={18} />
              </button>
            </div>

            <form className={styles.modalForm} onSubmit={handleModalSubmit}>
              <div className={styles.modalField}>
                <label className={styles.modalLabel}>Task Title</label>
                <input
                  className={styles.modalInput}
                  type="text"
                  placeholder="eg. make the dashboard"
                  value={modalForm.title}
                  onChange={(e) => setModalForm(f => ({ ...f, title: e.target.value }))}
                  required
                />
              </div>

              <div className={styles.modalRow}>
                <div className={styles.modalField} ref={assigneeRef}>
                  <label className={styles.modalLabel}>Assignee</label>
                  <div className={styles.customSelectContainer}>
                    <div
                      className={`${styles.customSelectHeader} ${openDropdown === "assignee" ? styles.customSelectHeaderOpen : ""}`}
                      onClick={() => setOpenDropdown(openDropdown === "assignee" ? null : "assignee")}
                    >
                      <span style={{ color: modalForm.assignee ? "#ffffff" : "#94a3b8" }}>
                        {modalForm.assignee || "Select"}
                      </span>
                      <ChevronDown size={14} style={{ color: "#94a3b8" }} />
                    </div>
                    {openDropdown === "assignee" && (
                      <div className={styles.customSelectDropdown}>
                        {["Alice Freeman", "Bob Smith", "Charlie Day", "Diana Prince", "Evan Wright"].map((item) => (
                          <div
                            key={item}
                            className={`${styles.customSelectOption} ${modalForm.assignee === item ? styles.customSelectOptionSelected : ""}`}
                            onClick={() => {
                              setModalForm((f) => ({ ...f, assignee: item }));
                              setOpenDropdown(null);
                            }}
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.modalField} ref={priorityRef}>
                  <label className={styles.modalLabel}>Priority</label>
                  <div className={styles.customSelectContainer}>
                    <div
                      className={`${styles.customSelectHeader} ${openDropdown === "priority" ? styles.customSelectHeaderOpen : ""}`}
                      onClick={() => setOpenDropdown(openDropdown === "priority" ? null : "priority")}
                    >
                      <span style={{ color: modalForm.priority ? "#ffffff" : "#94a3b8" }}>
                        {modalForm.priority || "Select"}
                      </span>
                      <ChevronDown size={14} style={{ color: "#94a3b8" }} />
                    </div>
                    {openDropdown === "priority" && (
                      <div className={styles.customSelectDropdown}>
                        {["High", "Medium", "Low"].map((item) => (
                          <div
                            key={item}
                            className={`${styles.customSelectOption} ${modalForm.priority === item ? styles.customSelectOptionSelected : ""}`}
                            onClick={() => {
                              setModalForm((f) => ({ ...f, priority: item }));
                              setOpenDropdown(null);
                            }}
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.modalField}>
                <label className={styles.modalLabel}>Description :</label>
                <textarea
                  className={styles.modalTextarea}
                  rows={4}
                  value={modalForm.description}
                  onChange={(e) => setModalForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.modalCancelBtn} onClick={handleModalClose}>Cancel</button>
                <button type="submit" className={styles.modalSubmitBtn}>Assign Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManagerDashboard;
