import React, { useEffect, useMemo, useState } from "react";
import styles from "../CSS/EmployeeTaskpage.module.css";
import { Plus, CheckCircle, Paperclip, FileText, X, Calendar, PlusIcon, MoreVertical } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router";
import ECreatetaskmodal from "./EmployeeSubTask";
import Createtask from "./CreateTask";

/* ── Column config matching the image ── */
const STATUS_COLUMNS = [
  { key: "To Do",       title: "To Do",     headerBg: "#2E8B5A", colBg: "rgba(46,139,90,0.20)"   },
  { key: "Pending",     title: "Pending",   headerBg: "#FFAE4C", colBg: "rgba(255,174,76,0.20)"  },
  { key: "In Progress", title: "In Review", headerBg: "#378ADD", colBg: "rgba(55,138,221,0.20)"  },
  { key: "Completed",   title: "Done",      headerBg: "#FF5447", colBg: "rgba(255,84,71,0.20)"   },
];

/* ── Priority config ── */
const PRIORITY_CFG = {
  High:   { color: "#ef4444", bg: "rgba(239,68,68,0.15)",   border: "rgba(239,68,68,0.4)"   },
  Medium: { color: "#f59e0b", bg: "rgba(245,158,11,0.15)",  border: "rgba(245,158,11,0.4)"  },
  Low:    { color: "#22c55e", bg: "rgba(34,197,94,0.15)",   border: "rgba(34,197,94,0.4)"   },
  Urgent: { color: "#a855f7", bg: "rgba(168,85,247,0.15)",  border: "rgba(168,85,247,0.4)"  },
};

/* ── Avatar initials helper ── */
function getInitials(name = "") {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function EmployeeTaskpage() {
  const [user, setUser]           = useState("");
  const [tasks, setTasks]         = useState([]);
  const navigate                  = useNavigate();
  const [projects, setProjects]   = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tab, setTab]             = useState("details");
  const [attachments, setAttachments] = useState([]);
  const fileInputRef              = React.useRef(null);
  const [comment, setComments]    = useState("");
  const [draggedTask, setDraggedTask] = useState(null);
  const [taskmodal, setTaskmodal] = useState(false);
  const [subtask, setSubtask]     = useState([]);
  const [openSubtasks, setOpenSubtasks] = useState({});
  const [task, setTask]           = useState(false);
  const [addsubtask, setAddsubtask] = useState("");

  /* ── Page loading gate ── */
  useEffect(() => {
    if (user && tasks.length >= 0 && projects.length >= 0 && Array.isArray(subtask)) {
      const t = setTimeout(() => setPageLoading(false), 600);
      return () => clearTimeout(t);
    }
  }, [user, tasks, projects, subtask]);

  /* ── Fetch all data ── */
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setPageLoading(true);
      const startTime = Date.now();
      try {
        const [userRes, taskRes, projectRes, subtaskRes] = await Promise.all([
          axios.get("b-atlas-ncc.onrender.com/api/v1/admin/getuser", { withCredentials: true }),
          axios.get("b-atlas-ncc.onrender.com/api/v1/admin/getalltask"),
          axios.get("b-atlas-ncc.onrender.com/api/v1/admin/getallproject"),
          axios.get("b-atlas-ncc.onrender.com/api/v1/employee/getsubtask"),
        ]);
        if (!mounted) return;
        setUser(userRes.data.message);
        setTasks(taskRes.data.message);
        setProjects(projectRes.data.message);
        setSubtask(subtaskRes.data.message);
      } catch {
        toast.error("Failed to load tasks");
      } finally {
        const delay = Math.max(800 - (Date.now() - startTime), 0);
        setTimeout(() => { if (mounted) setPageLoading(false); }, delay);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  /* ── Stats ── */
  const myTasks     = tasks.filter(t => t.assignedto === user._id);
  const pendingtask = myTasks.filter(t => t.status === "Pending");
  const highpriority = myTasks.filter(t => t.priority === "High");

  /* ── Board columns ── */
  const boardColumns = useMemo(() => {
    if (!tasks.length || !user?._id) return STATUS_COLUMNS.map(c => ({ ...c, count: 0, tasks: [] }));
    return STATUS_COLUMNS.map(col => {
      let colTasks = myTasks.filter(t => t.status === col.key);
      colTasks = col.key === "Completed"
        ? colTasks.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
        : colTasks.sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt));
      return { ...col, count: colTasks.length, tasks: colTasks };
    });
  }, [tasks, user]);

  /* ── Time diff helper ── */
  const getTimeDiff = (date) => {
    const diffMs = new Date(date) - new Date();
    const abs = Math.abs(diffMs);
    const mins = Math.floor(abs / 60000);
    const hrs  = Math.floor(abs / 3600000);
    const days = Math.floor(abs / 86400000);
    if (diffMs > 0) {
      if (mins < 60) return `${mins}m left`;
      if (hrs < 24)  return `${hrs}h left`;
      return `${days}d left`;
    }
    if (mins < 60) return `${mins}m ago`;
    if (hrs < 24)  return `${hrs}h ago`;
    return `${days}d ago`;
  };

  /* ── Attachment upload ── */
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAttachments(prev => [...prev, file]);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("taskId", selectedTask._id);
      await axios.post(
        "b-atlas-ncc.onrender.com/api/v1/employee/task/upload-attachment",
        fd, { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success("Attachment uploaded");
    } catch { toast.error("Upload failed"); }
  };

  /* ── Comment ── */
  const handlecomment = async () => {
    try {
      await axios.post("b-atlas-ncc.onrender.com/api/v1/employee/commentsend",
        { comment, taskid: selectedTask._id, userid: user._id },
        { withCredentials: true }
      );
      toast.success("Comment sent");
      window.location.reload();
    } catch { toast.error("Comment failed"); }
  };

  /* ── Complete / Review ── */
  const handlecomplete = async () => {
    try {
      await axios.post("b-atlas-ncc.onrender.com/api/v1/employee/complete-task",
        { taskid: selectedTask._id, userid: user._id }
      );
      toast.success("Task completed");
      window.location.reload();
    } catch { toast.error("Failed"); }
  };

  const handlereview = async () => {
    try {
      await axios.post("b-atlas-ncc.onrender.com/api/v1/employee/review-task",
        { taskid: selectedTask._id, userid: user._id }
      );
      toast.success("Sent for review");
      window.location.reload();
    } catch { toast.error("Failed"); }
  };

  const getTaskSubtasks = (taskId) =>
    subtask?.filter(st => String(st.relatedtasks) === String(taskId));

  const toggleSubtasks = (taskId) =>
    setOpenSubtasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));

  /* ── Loader ── */
  if (pageLoading) {
    return (
      <div className={styles.pageLoader}>
        <div className={styles.loaderCard}>
          <div className={styles.spinner} />
          <p>Loading your workspace…</p>
        </div>
      </div>
    );
  }

  /* ── Render ── */
  return (
    <>
      <div className={styles.page}>

        {/* PAGE HEADER */}
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderLeft}>
            <h1>My Tasks</h1>
            <div className={styles.headerMeta}>
              <span className={styles.metaBadge}>{pendingtask.length} Pending</span>
              <span className={styles.metaBadgeHigh}>{highpriority.length} High Priority</span>
            </div>
          </div>
          <div className={styles.headerActions}>
            <button className={styles.viewProjectsBtn} onClick={() => navigate("/employee/projects")}>
              View Projects
            </button>
            <button className={styles.newBtn} onClick={() => setTask(true)}>
              <Plus size={16} /> New Task
            </button>
          </div>
        </div>

        {/* KANBAN BOARD */}
        <div className={styles.board}>
          {boardColumns.map((col) => (
            <div
              key={col.key}
              className={styles.column}
              style={{ background: col.colBg }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={async () => {
                if (!draggedTask || draggedTask.status === col.key) return;
                try {
                  await axios.put(
                    `b-atlas-ncc.onrender.com/api/v1/employee/updatetask/${draggedTask._id}`,
                    { status: col.key },
                    { withCredentials: true }
                  );
                  setTasks(prev => prev.map(t =>
                    t._id === draggedTask._id ? { ...t, status: col.key } : t
                  ));
                  toast.success(`Moved to ${col.title}`);
                } catch { toast.error("Failed to move task"); }
                finally { setDraggedTask(null); }
              }}
            >
              {/* COLUMN HEADER — colored bar like the image */}
              <div
                className={styles.columnHeader}
                style={{ background: col.headerBg }}
              >
                <span className={styles.colTitle}>{col.title}</span>
                <span className={styles.colCount}>{col.count}</span>
                <div className={styles.colActions}>
                  <button className={styles.colIconBtn}><Plus size={14} /></button>
                  <button className={styles.colIconBtn}><MoreVertical size={14} /></button>
                </div>
              </div>

              {/* TASK CARDS */}
              <div className={styles.cards}>
                {col.tasks.length === 0 && (
                  <div className={styles.emptyCol}>No tasks here</div>
                )}
                {col.tasks.map(t => {
                  const pcfg = PRIORITY_CFG[t.priority] || PRIORITY_CFG.Low;
                  const initials = getInitials(user?.name);
                  const isOverdue = t.status !== "Completed" && new Date(t.dueAt) < new Date();
                  const isSoon = !isOverdue && (new Date(t.dueAt) - new Date()) < 86400000 && t.status !== "Completed";

                  return (
                    <div
                      key={t._id}
                      className={styles.card}
                      draggable
                      onDragStart={() => setDraggedTask(t)}
                      onClick={() => setSelectedTask(t)}
                    >
                      {/* TOP ROW: title + avatar */}
                      <div className={styles.cardTop}>
                        <span className={styles.cardTitle}>{t.title}</span>
                        <div className={styles.avatarCircle}>{initials}</div>
                      </div>

                      {/* PRIORITY BADGE */}
                      <div className={styles.priorityBadge}
                        style={{ color: pcfg.color, background: pcfg.bg, border: `1px solid ${pcfg.border}` }}>
                        {t.priority}
                      </div>

                      {/* PROGRESS BAR (In Progress only) */}
                      {t.status === "In Progress" && (
                        <div className={styles.progressWrap}>
                          <div className={styles.progressBar}>
                            <div className={styles.progressFill}
                              style={{ width: `${t.progress || 0}%`, background: col.headerBorder }} />
                          </div>
                          <span className={styles.progressPct}>{t.progress || 0}%</span>
                        </div>
                      )}

                      {/* FOOTER: due + time left */}
                      <div className={styles.cardFooter}>
                        <span className={`${styles.dueLabel} ${isOverdue ? styles.overdueText : isSoon ? styles.soonText : ""}`}>
                          {t.status === "Completed"
                            ? `Completed ${getTimeDiff(t.completedAt)}`
                            : `Due in ${getTimeDiff(t.dueAt)}`}
                        </span>
                        <span className={`${styles.timeLeft} ${isOverdue ? styles.overdueChip : ""}`}>
                          {t.status === "Completed" ? "Done" : getTimeDiff(t.dueAt)}
                        </span>
                      </div>

                      {/* SUBTASKS */}
                      {Array.isArray(t.subtasks) && t.subtasks.length > 0 && (
                        <div className={styles.subtaskToggle}
                          onClick={(e) => { e.stopPropagation(); toggleSubtasks(t._id); }}>
                          {t.subtasks.length} subtask{t.subtasks.length > 1 ? "s" : ""}
                        </div>
                      )}
                      {openSubtasks[t._id] && (
                        <div className={styles.subtaskList}>
                          {getTaskSubtasks(t._id)?.map(st => (
                            <div key={st._id} className={styles.subtaskCard}>
                              <h5>{st.title}</h5>
                              <p>{st.description}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      {!openSubtasks[t._id] && (
                        <div className={styles.addsubtask}
                          onClick={(e) => { e.stopPropagation(); setAddsubtask(t); setTaskmodal(true); }}>
                          <PlusIcon size={11} /> Add Subtask
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TASK DETAIL PANEL ── */}
      {selectedTask && (
        <div className={styles.backdrop} onClick={() => setSelectedTask(null)}>
          <div className={styles.panel} onClick={(e) => e.stopPropagation()}>

            <div className={styles.panelHeader}>
              <div className={styles.panelBadges}>
                {(() => {
                  const pcfg = PRIORITY_CFG[selectedTask.priority] || PRIORITY_CFG.Low;
                  return (
                    <span className={styles.priorityBadge}
                      style={{ color: pcfg.color, background: pcfg.bg, border: `1px solid ${pcfg.border}` }}>
                      {selectedTask.priority} Priority
                    </span>
                  );
                })()}
                <span className={styles.statusBadge}>{selectedTask.status}</span>
              </div>
              <button className={styles.closeBtn} onClick={() => setSelectedTask(null)}>
                <X size={16} />
              </button>
            </div>

            <h2 className={styles.panelTitle}>{selectedTask.title}</h2>

            <div className={styles.panelMeta}>
              <div>
                <span>ASSIGNEE</span>
                <p>{user?.name}</p>
              </div>
              <div>
                <span>DUE DATE</span>
                <p><Calendar size={13} />
                  {new Date(selectedTask.dueAt).toLocaleDateString("en-IN", {
                    day: "2-digit", month: "short", year: "numeric"
                  })}
                </p>
              </div>
            </div>

            <div className={styles.panelTabs}>
              <button className={tab === "details" ? styles.activeTab : styles.tabBtn}
                onClick={() => setTab("details")}>Details</button>
              <button className={tab === "activity" ? styles.activeTab : styles.tabBtn}
                onClick={() => setTab("activity")}>Activity & Comments</button>
            </div>

            {tab === "details" && (
              <div className={styles.panelContent}>
                <div className={styles.panelCard}>
                  <h4><FileText size={15} /> Description</h4>
                  <p>{selectedTask.description}</p>
                </div>

                <div className={styles.panelCard}>
                  <h4><Paperclip size={15} /> Attachments ({attachments.length})</h4>
                  {attachments.length === 0
                    ? <p className={styles.muted}>No attachments yet</p>
                    : <ul className={styles.attachList}>
                        {attachments.map((f, i) => (
                          <li key={i}><Paperclip size={13} />{f.name}</li>
                        ))}
                      </ul>
                  }
                  <button className={styles.attachBtn}
                    onClick={() => fileInputRef.current.click()}>
                    + Add Attachment
                  </button>
                  <input type="file" ref={fileInputRef} style={{ display: "none" }}
                    onChange={handleFileSelect} />
                </div>

                {selectedTask.status !== "Completed" && (
                  <div className={styles.panelFooter}>
                    <button className={styles.completeBtn} onClick={handlecomplete}>
                      <CheckCircle size={16} /> Mark Complete
                    </button>
                    <button className={styles.reviewBtn} onClick={handlereview}
                      disabled={selectedTask.status === "Pending"}>
                      Submit for Review
                    </button>
                  </div>
                )}
              </div>
            )}

            {tab === "activity" && (
              <div className={styles.panelContent}>
                <div className={styles.comments}>
                  {selectedTask.comments?.map((c, i) => (
                    <div key={i} className={styles.commentCard}>
                      <div className={styles.commentHeader}>
                        <span className={styles.commentAuthor}>{c.commentby}</span>
                        <span className={styles.commentTime}>
                          {new Date(c.timeat).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p>{c.text}</p>
                    </div>
                  ))}
                </div>

                <div className={styles.commentBox}>
                  <textarea placeholder="Write a comment…"
                    value={comment} onChange={(e) => setComments(e.target.value)} />
                  <button className={styles.sendBtn} onClick={handlecomment}>➤</button>
                </div>

                <div className={styles.historySection}>
                  <h4>TASK HISTORY</h4>
                  <div className={styles.timeline}>
                    {selectedTask.history?.map((h, i) => (
                      <div key={i} className={styles.timelineItem}>
                        <span className={styles.timelineDot} />
                        <div>
                          <p><strong>{h.actionby}</strong> {h.title}</p>
                          <span>
                            {new Date(h.timeat).toLocaleDateString("en-IN", {
                              day: "2-digit", month: "2-digit", year: "numeric"
                            })} at {new Date(h.timeat).toLocaleTimeString("en-IN", {
                              hour: "2-digit", minute: "2-digit"
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedTask.status !== "Completed" && (
                  <div className={styles.panelFooter}>
                    <button className={styles.completeBtn} onClick={handlecomplete}>
                      <CheckCircle size={16} /> Mark Complete
                    </button>
                    <button className={styles.reviewBtn} onClick={handlereview}
                      disabled={selectedTask.status === "Pending"}>
                      Submit for Review
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {taskmodal && <ECreatetaskmodal modal={taskmodal} setModal={setTaskmodal} tasks={addsubtask} />}
      {task && <Createtask modal={task} setModal={setTask} user={user} projects={projects} />}
    </>
  );
}
