import React, { useState, useRef, useEffect } from "react";
import { Filter, Plus, List, LayoutGrid, MoreVertical, Clock, X, ChevronDown, ChevronUp } from "lucide-react";
import styles from "../css/ManagerWork.module.css";
import dashboardStyles from "../css/ManagerDashboard.module.css";

export const initialTasks = [
  {
    id: 1,
    title: "Design System Audit",
    desc: "Review the current design system components for accessibility and consistency",
    assignee: "Alex Morgan",
    priority: "High",
    status: "In Progress",
    dueDate: "Dec 25, 2025",
    sla: "1 days left",
    slaStatus: "normal",
    impact: 8,
  },
  {
    id: 2,
    title: "API Integration for Analytics",
    desc: "Connect the frontend charts with the new analytics API",
    assignee: "Mike Ross",
    priority: "High",
    status: "Todo",
    dueDate: "Dec 24, 2025",
    sla: "0 days left",
    slaStatus: "danger",
    impact: 9,
  },
  {
    id: 3,
    title: "Mobile Responsiveness Fixes",
    desc: "Fix layout issues on iPhone SE and Pixel 5 viewports",
    assignee: "Sarah Miller",
    priority: "Medium",
    status: "Review",
    dueDate: "Dec 22, 2025",
    sla: "Overdue",
    slaStatus: "overdue",
    impact: 6,
  },
  {
    id: 4,
    title: "Q3 Financial Report",
    desc: "Compile the Q3 financial data and generate the PDF",
    assignee: "Jessica Pearson",
    priority: "Low",
    status: "Done",
    dueDate: "Dec 18, 2025",
    sla: "",
    slaStatus: "none",
    impact: 5,
  },
  {
    id: 5,
    title: "User Onboarding Flow",
    desc: "Redesign the user onboarding flow to improve retention",
    assignee: "Alex Morgan",
    priority: "High",
    status: "Todo",
    dueDate: "Dec 28, 2025",
    sla: "4 days left",
    slaStatus: "normal",
    impact: 9,
  },
  {
    id: 6,
    title: "Database Optimization",
    desc: "Optimize the user query performance by adding necessary indexes",
    assignee: "Mike Ross",
    priority: "Medium",
    status: "In Progress",
    dueDate: "Dec 26, 2025",
    sla: "2 days left",
    slaStatus: "normal",
    impact: 7,
  },
  {
    id: 7,
    title: "Marketing Campaign Launch",
    desc: "Prepare social media assets and launch email sequence",
    assignee: "Rachel Zane",
    priority: "High",
    status: "Review",
    dueDate: "Dec 20, 2025",
    sla: "Overdue",
    slaStatus: "overdue",
    impact: 8,
  },
  {
    id: 8,
    title: "Update Terms of Service",
    desc: "Review legal compliance for European users",
    assignee: "Harvey Specter",
    priority: "Low",
    status: "Done",
    dueDate: "Nov 30, 2025",
    sla: "",
    slaStatus: "none",
    impact: 4,
  },
  {
    id: 9,
    title: "Implement Dark Mode",
    desc: "Ensure all new components support dark theme palette",
    assignee: "Sarah Miller",
    priority: "Medium",
    status: "In Progress",
    dueDate: "Jan 10, 2026",
    sla: "15 days left",
    slaStatus: "normal",
    impact: 7,
  },
  {
    id: 10,
    title: "Security Patch Update",
    desc: "Apply urgent patches to the authentication microservice",
    assignee: "Mike Ross",
    priority: "High",
    status: "Todo",
    dueDate: "Dec 21, 2025",
    sla: "Overdue",
    slaStatus: "overdue",
    impact: 10,
  }
];

export const kanbanTasks = [
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `todo-${i + 1}`, 
    title: `Task ${i + 1}`, 
    priority: i % 3 === 0 ? 'High' : i % 3 === 1 ? 'Medium' : 'Low', 
    prioClass: i % 3 === 0 ? styles.priorityHigh : i % 3 === 1 ? styles.priorityMedium : styles.priorityLow, 
    assignee: 'AM',
    status: 'Todo'
  })),
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `pending-${i + 1}`, 
    title: `Task ${i + 1}`, 
    priority: i % 2 === 0 ? 'Low' : 'Medium', 
    prioClass: i % 2 === 0 ? styles.priorityLow : styles.priorityMedium, 
    assignee: 'LA',
    status: 'In Progress'
  })),
  ...Array.from({ length: 3 }, (_, i) => ({
    id: `review-${i + 1}`, 
    title: `Task ${i + 1}`, 
    priority: i === 0 ? 'High' : 'Low', 
    prioClass: i === 0 ? styles.priorityHigh : styles.priorityLow, 
    assignee: 'LA',
    status: 'Review'
  })),
  ...Array.from({ length: 7 }, (_, i) => ({
    id: `overdue-${i + 1}`, 
    title: `Task ${i + 1}`, 
    priority: i % 2 === 0 ? 'Medium' : 'High', 
    prioClass: i % 2 === 0 ? styles.priorityMedium : styles.priorityHigh, 
    assignee: 'LA',
    status: 'Done'
  }))
];

function ManagerWork({ listTasks, setListTasks, kanbanData, setKanbanData }) {
  const [viewMode, setViewMode] = useState("list");
  const [activeFilter, setActiveFilter] = useState("All");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [modalForm, setModalForm] = useState({ title: "", assignee: "", priority: "", dueTime: "" });
  const [openDropdown, setOpenDropdown] = useState(null);
  const [kanbanExpanded, setKanbanExpanded] = useState({
    todo: true,
    pending: true,
    review: false,
    overdue: false
  });
  
  const toggleKanbanCol = (col) => {
    setKanbanExpanded(prev => ({ ...prev, [col]: !prev[col] }));
  };

  const assigneeRef = useRef(null);
  const priorityRef = useRef(null);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleModalClose = () => {
    setShowAssignModal(false);
    setOpenDropdown(null);
    setModalForm({ title: "", assignee: "", priority: "", dueTime: "" });
  };

  const getInitials = (name) => {
    if (!name) return "UI";
    const parts = name.split(" ");
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (!modalForm.assignee || !modalForm.priority) {
      alert("Please select both Assignee and Priority.");
      return;
    }
    
    const newTaskList = {
      id: Date.now(),
      title: modalForm.title,
      desc: "Newly assigned task",
      assignee: modalForm.assignee,
      priority: modalForm.priority,
      status: "Todo",
      dueDate: modalForm.dueTime ? `Today, ${modalForm.dueTime}` : "Today",
      sla: "1 days left",
      slaStatus: "normal",
      impact: 5,
    };
    
    const newTaskKanban = {
      id: `todo-${Date.now()}`,
      title: modalForm.title,
      priority: modalForm.priority,
      prioClass: modalForm.priority === 'High' ? styles.priorityHigh : modalForm.priority === 'Medium' ? styles.priorityMedium : styles.priorityLow,
      assignee: getInitials(modalForm.assignee),
      status: 'Todo'
    };

    setListTasks([newTaskList, ...listTasks]);
    setKanbanData([newTaskKanban, ...kanbanData]);
    
    handleModalClose();
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "High": return styles.priorityHigh;
      case "Medium": return styles.priorityMedium;
      case "Low": return styles.priorityLow;
      default: return "";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "In Progress": return styles.statusProgress;
      case "Todo": return styles.statusTodo;
      case "Review": return styles.statusReview;
      case "Done": return styles.statusDone;
      default: return "";
    }
  };

  const activeData = viewMode === "list" ? listTasks : kanbanData;

  const filteredTasks = activeData.filter(task => {
    if (activeFilter === "All") return true;
    if (activeFilter === "In Progress") return task.status === "In Progress";
    if (activeFilter === "High Priority") return task.priority === "High";
    return true;
  });

  const todoTasks = filteredTasks.filter(t => t.status === 'Todo');
  const pendingTasks = filteredTasks.filter(t => t.status === 'In Progress');
  const reviewTasks = filteredTasks.filter(t => t.status === 'Review');
  const overdueTasks = filteredTasks.filter(t => t.status === 'Done');

  const renderKanbanCard = (card) => (
    <div key={card.id} className={styles.kanbanCard}>
      <div className={styles.cardTop}>
        <div className={styles.cardTitleSection}>
          <span className={styles.cardTitle}>{card.title}</span>
          <span className={`${styles.badgeOutlined} ${card.prioClass || getPriorityClass(card.priority)}`}>{card.priority}</span>
        </div>
        <div className={styles.cardAvatar}>{getInitials(card.assignee)}</div>
      </div>
      <div className={styles.cardBottom}>
        <span className={styles.cardDueText}>Due in 2 days</span>
        <span className={styles.cardTimeLeft}>2h Left</span>
      </div>
    </div>
  );

  return (
    <div className={styles.workContainer}>
      <div className={styles.headerRow}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Team Tasks</h1>
          <p className={styles.subtitle}>Manage, track and assign tasks to your team members.</p>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.filterBtn}>
            Daily Updates
          </button>
          <button className={styles.filterBtn}>
            <Filter size={14} /> Filter
          </button>
          <button className={styles.assignBtn} onClick={() => setShowAssignModal(true)}>
            <Plus size={14} /> Assign New Task
          </button>
        </div>
      </div>

      <div className={styles.controlsRow}>
        <div className={styles.viewSwitcher}>
          <button
            className={`${styles.viewBtn} ${viewMode === "list" ? styles.active : ""}`}
            onClick={() => setViewMode("list")}
          >
            <List size={16} /> List View
          </button>
          <button
            className={`${styles.viewBtn} ${viewMode === "kanban" ? styles.active : ""}`}
            onClick={() => setViewMode("kanban")}
          >
            <LayoutGrid size={16} /> Kanban Board
          </button>
        </div>

        <div className={styles.filterPills}>
          <button 
            className={`${styles.filterPill} ${activeFilter === "All" ? styles.activeFilter : ""}`}
            onClick={() => setActiveFilter("All")}
          >
            <span className={`${styles.pillDot} ${styles.dotAll}`} /> All Tasks ({activeData.length})
          </button>
          <button 
            className={`${styles.filterPill} ${activeFilter === "In Progress" ? styles.activeFilter : ""}`}
            onClick={() => setActiveFilter("In Progress")}
          >
            <span className={`${styles.pillDot} ${styles.dotProgress}`} /> In Progress ({activeData.filter(t => t.status === 'In Progress').length})
          </button>
          <button 
            className={`${styles.filterPill} ${activeFilter === "High Priority" ? styles.activeFilter : ""}`}
            onClick={() => setActiveFilter("High Priority")}
          >
            <span className={`${styles.pillDot} ${styles.dotHigh}`} /> High Priority ({activeData.filter(t => t.priority === 'High').length})
          </button>
          <button className={styles.moreBtn}>
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      {viewMode === "list" ? (
        <div className={styles.tableContainer}>
          <div className={styles.tableScroll}>
            <div className={styles.tableInner}>
              <div className={styles.tableHeader}>
                <div>Task Name</div>
                <div>Assignee</div>
                <div>Priority</div>
                <div>Status</div>
                <div>Due Date / SLA</div>
                <div className={styles.colImpactHeader}>Impact Score</div>
              </div>

              <div className={styles.tableBody}>
                {filteredTasks.map((task) => (
                  <div key={task.id} className={styles.tableRow}>
                    <div className={styles.colTask}>
                      <span className={styles.taskName}>{task.title}</span>
                      <span className={styles.taskDesc}>{task.desc}</span>
                    </div>
                    <div className={styles.colAssignee}>
                      <div className={styles.assigneeAvatar}>
                        {getInitials(task.assignee)}
                        <span className={styles.statusDot}></span>
                      </div>
                      <span className={styles.assigneeName}>{task.assignee}</span>
                    </div>
                    <div className={styles.colPriority}>
                      <span className={`${styles.badgeOutlined} ${getPriorityClass(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className={styles.colStatus}>
                      <span className={`${styles.badgeOutlined} ${getStatusClass(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                    <div className={styles.colDate}>
                      <span className={styles.dateText}>{task.dueDate}</span>
                      {task.sla && (
                        <span className={`${styles.slaText} ${task.slaStatus === 'overdue' || task.slaStatus === 'danger' ? styles.slaOverdue : ''}`}>
                          <Clock size={12} /> {task.sla}
                        </span>
                      )}
                    </div>
                    <div className={styles.colImpact}>
                      <div className={styles.impactCircle}>{task.impact}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.kanbanContainer}>
          {/* To Do Column */}
          <div className={`${styles.kanbanColumn} ${styles.colBgTodo} ${kanbanExpanded.todo ? styles.expanded : styles.collapsed}`}>
            <div className={`${styles.columnHeader} ${styles.headerTodo}`} onClick={() => toggleKanbanCol('todo')}>
              <div className={styles.columnHeaderLeft}>
                <span>To Do</span>
                <span className={styles.columnBadge}>{todoTasks.length}</span>
              </div>
              <div className={styles.columnHeaderRight}>
                <Plus size={16} cursor="pointer" className={styles.kanbanActionIcon} onClick={(e) => { e.stopPropagation(); setShowAssignModal(true); }} />
                <MoreVertical size={16} cursor="pointer" className={styles.kanbanMoreIcon} />
                <div className={styles.accordionIcon}>
                  {kanbanExpanded.todo ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>
            </div>
            <div className={styles.columnCards}>
              {todoTasks.map(renderKanbanCard)}
            </div>
          </div>

          {/* Pending Column */}
          <div className={`${styles.kanbanColumn} ${styles.colBgPending} ${kanbanExpanded.pending ? styles.expanded : styles.collapsed}`}>
            <div className={`${styles.columnHeader} ${styles.headerPending}`} onClick={() => toggleKanbanCol('pending')}>
              <div className={styles.columnHeaderLeft}>
                <span>Pending</span>
                <span className={styles.columnBadge}>{pendingTasks.length}</span>
              </div>
              <div className={styles.columnHeaderRight}>
                <Plus size={16} cursor="pointer" className={styles.kanbanActionIcon} onClick={(e) => { e.stopPropagation(); setShowAssignModal(true); }} />
                <MoreVertical size={16} cursor="pointer" className={styles.kanbanMoreIcon} />
                <div className={styles.accordionIcon}>
                  {kanbanExpanded.pending ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>
            </div>
            <div className={styles.columnCards}>
              {pendingTasks.map(renderKanbanCard)}
            </div>
          </div>

          {/* In Review Column */}
          <div className={`${styles.kanbanColumn} ${styles.colBgReview} ${kanbanExpanded.review ? styles.expanded : styles.collapsed}`}>
            <div className={`${styles.columnHeader} ${styles.headerReview}`} onClick={() => toggleKanbanCol('review')}>
              <div className={styles.columnHeaderLeft}>
                <span>In Review</span>
                <span className={styles.columnBadge}>{reviewTasks.length}</span>
              </div>
              <div className={styles.columnHeaderRight}>
                <Plus size={16} cursor="pointer" className={styles.kanbanActionIcon} onClick={(e) => { e.stopPropagation(); setShowAssignModal(true); }} />
                <MoreVertical size={16} cursor="pointer" className={styles.kanbanMoreIcon} />
                <div className={styles.accordionIcon}>
                  {kanbanExpanded.review ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>
            </div>
            <div className={styles.columnCards}>
              {reviewTasks.map(renderKanbanCard)}
            </div>
          </div>

          {/* Overdue Column */}
          <div className={`${styles.kanbanColumn} ${styles.colBgOverdue} ${kanbanExpanded.overdue ? styles.expanded : styles.collapsed}`}>
            <div className={`${styles.columnHeader} ${styles.headerOverdue}`} onClick={() => toggleKanbanCol('overdue')}>
              <div className={styles.columnHeaderLeft}>
                <span>Overdue</span>
                <span className={styles.columnBadge}>{overdueTasks.length}</span>
              </div>
              <div className={styles.columnHeaderRight}>
                <Plus size={16} cursor="pointer" className={styles.kanbanActionIcon} onClick={(e) => { e.stopPropagation(); setShowAssignModal(true); }} />
                <MoreVertical size={16} cursor="pointer" className={styles.kanbanMoreIcon} />
                <div className={styles.accordionIcon}>
                  {kanbanExpanded.overdue ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>
            </div>
            <div className={styles.columnCards}>
              {overdueTasks.map(renderKanbanCard)}
            </div>
          </div>
        </div>
      )}

      {showAssignModal && (
        <div className={dashboardStyles.modalOverlay} onClick={handleModalClose}>
          <div className={dashboardStyles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={dashboardStyles.modalHeader}>
              <div>
                <h2 className={dashboardStyles.modalTitle}>Assign New Task</h2>
                <p className={dashboardStyles.modalSubtitle}>Assign a new task to a team member instantly.</p>
              </div>
              <button className={dashboardStyles.modalCloseBtn} onClick={handleModalClose} title="Close">
                <X size={18} />
              </button>
            </div>

            <form className={dashboardStyles.modalForm} onSubmit={handleModalSubmit}>
              <div className={dashboardStyles.modalField}>
                <label className={dashboardStyles.modalLabel}>Task Title</label>
                <input
                  className={dashboardStyles.modalInput}
                  type="text"
                  placeholder="e.g. Review Design Specs"
                  value={modalForm.title}
                  onChange={(e) => setModalForm(f => ({ ...f, title: e.target.value }))}
                  required
                />
              </div>

              <div className={dashboardStyles.modalRow}>
                <div className={dashboardStyles.modalField} ref={assigneeRef}>
                  <label className={dashboardStyles.modalLabel}>Assignee</label>
                  <div className={dashboardStyles.customSelectContainer}>
                    <div
                      className={`${dashboardStyles.customSelectHeader} ${openDropdown === "assignee" ? dashboardStyles.customSelectHeaderOpen : ""}`}
                      onClick={() => setOpenDropdown(openDropdown === "assignee" ? null : "assignee")}
                    >
                      <span style={{ color: modalForm.assignee ? "#ffffff" : "#94a3b8" }}>
                        {modalForm.assignee || "Select"}
                      </span>
                      <ChevronDown size={14} style={{ color: "#94a3b8" }} />
                    </div>
                    {openDropdown === "assignee" && (
                      <div className={dashboardStyles.customSelectDropdown}>
                        {["Alice Freeman", "Bob Smith", "Charlie Day", "Diana Prince", "Evan Wright"].map((item) => (
                          <div
                            key={item}
                            className={`${dashboardStyles.customSelectOption} ${modalForm.assignee === item ? dashboardStyles.customSelectOptionSelected : ""}`}
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

                <div className={dashboardStyles.modalField} ref={priorityRef}>
                  <label className={dashboardStyles.modalLabel}>Priority</label>
                  <div className={dashboardStyles.customSelectContainer}>
                    <div
                      className={`${dashboardStyles.customSelectHeader} ${openDropdown === "priority" ? dashboardStyles.customSelectHeaderOpen : ""}`}
                      onClick={() => setOpenDropdown(openDropdown === "priority" ? null : "priority")}
                    >
                      <span style={{ color: modalForm.priority ? "#ffffff" : "#94a3b8" }}>
                        {modalForm.priority || "Select"}
                      </span>
                      <ChevronDown size={14} style={{ color: "#94a3b8" }} />
                    </div>
                    {openDropdown === "priority" && (
                      <div className={dashboardStyles.customSelectDropdown}>
                        {["High", "Medium", "Low"].map((item) => (
                          <div
                            key={item}
                            className={`${dashboardStyles.customSelectOption} ${modalForm.priority === item ? dashboardStyles.customSelectOptionSelected : ""}`}
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

              <div className={dashboardStyles.modalField}>
                <label className={dashboardStyles.modalLabel}>Due Time</label>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", display: "flex" }}>
                    <Clock size={14} />
                  </div>
                  <input
                    className={dashboardStyles.modalInput}
                    style={{ paddingLeft: "34px" }}
                    type="text"
                    placeholder="e.g. 2:00 PM"
                    value={modalForm.dueTime}
                    onChange={(e) => setModalForm(f => ({ ...f, dueTime: e.target.value }))}
                  />
                </div>
              </div>

              <div className={dashboardStyles.modalActions}>
                <button type="button" className={dashboardStyles.modalCancelBtn} onClick={handleModalClose}>Cancel</button>
                <button type="submit" className={dashboardStyles.modalSubmitBtn}>Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManagerWork;
