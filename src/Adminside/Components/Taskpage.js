import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import styles from "../CSS/Taskspage.module.css";
import { Pencil, Trash, Search, ChevronLeft, ChevronRight, X, ChevronDown, Bell, Clock3, TriangleAlert, ClipboardList, Plus, MoreVertical, CheckCircle, Paperclip, FileText, Calendar } from "lucide-react";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { useNavigate } from "react-router";
import Createtaskmodal from "./Createtaskmodal";

const PRIORITY_CFG = {
  High:   { color: "#ef4444", bg: "rgba(239,68,68,0.15)",   border: "rgba(239,68,68,0.4)"   },
  Medium: { color: "#f59e0b", bg: "rgba(245,158,11,0.15)",  border: "rgba(245,158,11,0.4)"  },
  Low:    { color: "#22c55e", bg: "rgba(34,197,94,0.15)",   border: "rgba(34,197,94,0.4)"   },
  Urgent: { color: "#a855f7", bg: "rgba(168,85,247,0.15)",  border: "rgba(168,85,247,0.4)"  },
};
const Taskpage = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const[user,setUser]=useState()
  const[modal,setModal]=useState(false)
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const[taskmodal,setTaskmodal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null);
const [openColumn, setOpenColumn] = useState("todo");
const [draggedTask, setDraggedTask] = useState(null);
 const [tab, setTab]             = useState("details");
  const [attachments, setAttachments] = useState([]);
  const fileInputRef              = React.useRef(null);
  const [comment, setComments]    = useState("");


   const [form, setForm] = useState({
    title: "",
    linkedproject: "",
    description: "",
    status: "",
    priority: "",
    employeeid: "",
    dueAt:""
  });
  const navigate = useNavigate()

 const handleDrop = async (columnId) => {
  if (!draggedTask) return;

  if (columnId === "Overdue") {
    setDraggedTask(null);
    return;
  }

  const newStatus = columnId;

  if (draggedTask.status === newStatus) {
    setDraggedTask(null);
    return;
  }

  try {
    await axios.put(
      `${API_URL}admin/updatetask/${draggedTask._id}`,
      {
        status: newStatus,
      },
      {
        withCredentials: true,
      }
    );

    setTasks(prev =>
      prev.map(task =>
        task._id === draggedTask._id
          ? {
              ...task,
              status: newStatus,
            }
          : task
      )
    );

    toast.success("Task updated");
  } catch {
    toast.error("Failed");
  }

  setDraggedTask(null);
};

  // fetch all data
  useEffect(() => {
    let mounted = true;
    async function fetchAll() {
      try {
        setLoading(true);
        const [tRes, uRes, pRes] = await Promise.all([
          axios.get(`${API_URL}admin/getalltask`, { withCredentials: true }),
          axios.get(`${API_URL}admin/getalluser`, { withCredentials: true }),
          axios.get(`${API_URL}admin/getallproject`, { withCredentials: true }),
        ]);

        if (!mounted) return;

        setTasks(tRes.data.message || tRes.data || []);
        setUsers(uRes.data.message || uRes.data || []);
        setProjects(pRes.data.message || pRes.data || []);
      } catch (err) {
        console.error("Fetch failed", err);
        toast.error("Failed to load task manager data");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchAll();
    return () => { mounted = false; };
  }, []);

  

  // derived enriched rows: join task.assignedto -> user, projectId -> project
  const enriched = useMemo(() => {
    const uMap = new Map(users.map((u) => [String(u._id), u]));
    const pMap = new Map(projects.map((p) => [String(p._id), p]));
    return tasks.map((t) => {
      const assigned = uMap.get(String(t.assignedto)) || null;
      const project = pMap.get(String(t.projectId)) || null;
      return {
        ...t,
        assigned,
        project,
      };
    });
  }, [tasks, users, projects])


  // actions (stubbed)
  const handleEdit = (task) => {
  setSelectedTask(task);
  setForm({
    employeeid: task.assignedto || "",
    priority: task.priority || "",
    status: task.status || "",
    dueAt: task.dueAt ? dayjs(task.dueAt).format("YYYY-MM-DD") : "",
  });
  setEditModal(true);
};


  const handleDelete = async (task) => {
    if (!window.confirm(`Delete task "${task.title}" ?`)) return;
    try {
      // replace with real API if exists:
      await axios.delete(`${API_URL}admin/deletetask/${task._id}`, { withCredentials: true });
      setTasks((prev) => prev.filter((t) => String(t._id) !== String(task._id)));
      toast.success("Task deleted");
      window.location.reload()
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Delete failed");
    }
  };


const inProgressCount = tasks.filter(
  t => (t.status || "").toLowerCase() === "in progress"
).length;

const completedTodayCount = tasks.filter(t => {
  return(
   t.status === "Completed"
  )
 
}).length;

const pendingCount = tasks.filter(
  t => (t.status || "").toLowerCase() === "pending"
).length;

// Total Active Tasks
const activeTasks = tasks.filter(
  (task) =>
    task.status?.toLowerCase() !== "completed"
).length;

// High Priority Tasks (Risk Level)
const highRiskTasks = tasks.filter(
  (task) =>
    task.priority?.toLowerCase() === "high"
).length;

// Average Completion Time
const completedTasks = tasks.filter(
  (task) =>
    task.status?.toLowerCase() === "completed"
);

const averageCompletionTime = (() => {
  if (!completedTasks.length) return "0h";

  const totalHours = completedTasks.reduce((sum, task) => {
    if (!task.createdAt || !task.completedAt) return sum;

    const created = new Date(task.createdAt);
    const completed = new Date(task.completedAt);

    return (
      sum +
      (completed - created) /
        (1000 * 60 * 60)
    );
  }, 0);

  return `${(
    totalHours / completedTasks.length
  ).toFixed(1)}h`;
})();

const stats = [
  {
    title: "Tasks Active",
    value: activeTasks,
    sub: `${completedTodayCount} Completed`,
    color: "#2ECC71",
    icon: <ClipboardList size={28} color="rgba(221, 221, 255, 1)"/>,
  },
  {
    title: "Risk Level",
    value: highRiskTasks ? "HIGH" : "LOW",
    sub: `${highRiskTasks} High Priority`,
    color: highRiskTasks ? "#FF5B4D" : "#A0A0A0",
    icon: <TriangleAlert size={28} color="rgba(221, 221, 255, 1)"/>,
  },
  {
    title: "Avg. Completion Time",
    value: averageCompletionTime,
    sub: `${completedTasks.length} Completed Tasks`,
    color: "#A0A0A0",
    icon: <Clock3 size={28} color="rgba(221, 221, 255, 1)"/>,
  },
];

const today = new Date();
today.setHours(0, 0, 0, 0);

const taskColumns = useMemo(() => {
  return {
    todo: tasks.filter(
      (t) => t.status=== "To Do"
    ),

    pending: tasks.filter(
      (t) => t.status === "In Progress"
    ),

    review: tasks.filter(
      (t) => t.status === "In Review"
    ),

    completed: tasks.filter(
      (t) => t.status === "Completed"
    ),

    overdue: tasks.filter((t) => {
      if (!t.dueAt) return false;

      return (
        new Date(t.dueAt) < new Date() &&
        t.status?.toLowerCase() !== "completed"
      );
    }),
  };
}, [tasks]);

const getPriorityClass = (priority) => {
  switch (priority?.toLowerCase()) {
    case "high":
      return styles.high;

    case "medium":
      return styles.medium;

    case "low":
      return styles.low;

    default:
      return styles.low;
  }
};

const getRemaining = (due) => {
  if (!due) return "";

  const now = new Date();
  const end = new Date(due);

  const diff = end - now;

  if (diff <= 0) return "Expired";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days > 0)
    return `${days} day${days > 1 ? "s" : ""} Left`;

  const hours = Math.floor(
    diff / (1000 * 60 * 60)
  );

  return `${hours}h Left`;
};

const getDueText = (due) => {
  if (!due) return "-";

  const now = new Date();

  const end = new Date(due);

  const diff = end - now;

  if (diff <= 0) return "Overdue";

  const days = Math.ceil(
    diff / (1000 * 60 * 60 * 24)
  );

  return `Due in ${days} day${days > 1 ? "s" : ""}`;
};

      const handlecomment = async () => {
    try {
      await axios.post(`${API_URL}employee/commentsend`,
        { comment, taskid: selectedTask, userid: user },
        { withCredentials: true }
      );
      toast.success("Comment sent");
      window.location.reload();
    } catch { toast.error("Comment failed"); }
  };
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAttachments(prev => [...prev, file]);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("taskId", selectedTask);
      await axios.post(
        `${API_URL}employee/task/upload-attachment`,
        fd, { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success("Attachment uploaded");
    } catch { toast.error("Upload failed"); }
  };

  /* ── Complete / Review ── */
  const handlecomplete = async () => {
    try {
      await axios.post(`${API_URL}employee/complete-task`,
        { taskid: selectedTask, userid: user}
      );
      toast.success("Task completed");
      window.location.reload();
    } catch { toast.error("Failed"); }
  };

  const handlereview = async () => {
    try {
      await axios.post(`${API_URL}employee/review-task`,
        { taskid: selectedTask, userid: user}
      );
      toast.success("Sent for review");
      window.location.reload();
    } catch { toast.error("Failed"); }
  };

   const getFileMeta = (url) => {
  const name = decodeURIComponent(url.split("/").pop().split("?")[0]);
  const ext = name.split(".").pop().toLowerCase();

  let type = "file";
  if (ext === "pdf") type = "pdf";
  else if (["xls", "xlsx"].includes(ext)) type = "excel";
  else if (["jpg", "jpeg", "png", "webp"].includes(ext)) type = "image";

  return name;
};
      



const TaskCard = ({ task }) => {
  const emp = users.find(
    (u) => String(u._id) === String(task.assignedto)
  );

  const initials =
    emp?.name
      ?.split(" ")
      .map((x) => x[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "--";

 

  return (
    <div
  className={styles.taskCard}
  draggable
  onDragStart={() => setDraggedTask(task)}
  onClick={() => {
    setUser(task?.assignedto);
    setSelectedTask(task);
  }}
>
      <div className={styles.cardTop}>
        <div>
          <h4>{task.title}</h4>

          <span
            className={`${styles.priority} ${getPriorityClass(
              task.priority
            )}`}
          >
            {task.priority}
          </span>
        </div>

        {emp?.profilepicture ? (
          <img
            src={emp.profilepicture}
            className={styles.avatar}
            alt=""
          />
        ) : (
          <div className={styles.avatar}>
            {initials}
          </div>
        )}
      </div>

      <div className={styles.cardBottom}>
        <span>{getDueText(task.dueAt)}</span>

        <span>{getRemaining(task.dueAt)}</span>
      </div>
    </div>
  );
};

const TaskColumn = ({
  id,
  title,
  tasks,
  color,
  openColumn,
  setOpenColumn,
}) => {
  const isOpen = openColumn === id;

  return (
    <div
      className={styles.column}
      style={{
        background: color.background,
      }}
    >
      <div
        className={styles.columnHeader}
        style={{
          background: color.header,
        }}
        onClick={() =>
          setOpenColumn(isOpen ? "" : id)
        }
      >
        <div className={styles.columnTitle}>
          {title}

          <span>{tasks.length}</span>
        </div>

        <div className={styles.columnIcons}>
          <Plus size={18} />

          <MoreVertical size={18} />

          <ChevronDown
            size={18}
            className={`${styles.arrow} ${
              isOpen ? styles.rotate : ""
            }`}
          />
        </div>
      </div>

      <div
  className={`${styles.columnBody} ${
    isOpen ? styles.open : styles.closed
  }`}
  onDragOver={(e) => e.preventDefault()}
  onDrop={() => handleDrop(id)}

>
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
          />
        ))}
      </div>
    </div>
  );
};

   
  return (
    <>
  <div className={styles.page}>
      <div className={styles.headbutton}>
        <div className={styles.block}>
          <h1 className={styles.title}>Task Manager</h1>
      <span className={styles.subtext}>Track and manage project tasks</span>
        </div>
      
      <button className={styles.addtask} onClick={()=>{setTaskmodal(true)}}>Assign Task</button>
      </div>

      {/* KPI CARDS */}
     <div className={styles.statsRow}>
  {stats.map((item, index) => (
    <div className={styles.card} key={index}>
      <div className={styles.cardHeader}>
        <span className={styles.title1}>
          {item.title}
        </span>

        <div className={styles.icon}>
          {item.icon}
        </div>
      </div>

      <div className={styles.value}>
        {item.value}
      </div>

     
    </div>
  ))}
</div>
    
    {/* Kanban */}

  <div className={styles.kanbanBoard}>
  <TaskColumn
    id="To Do"
    openColumn={openColumn}
    
    setOpenColumn={setOpenColumn}
    title="To Do"
    tasks={taskColumns.todo}
    color={{
      background:"#1A1A1A",
      header:"#596079"
    }}
  />

  <TaskColumn
    id="In Progress"
    openColumn={openColumn}
    setOpenColumn={setOpenColumn}
    title="In Progress"
    tasks={taskColumns.pending}
    color={{
      background:"#342514",
      header:"#F3A948"
    }}
  />

  <TaskColumn
    id="In Review"
    openColumn={openColumn}
    setOpenColumn={setOpenColumn}
    title="In Review"
    tasks={taskColumns.review}
    color={{
      background:"#15293F",
      header:"#3E8BDB"
    }}
  />
  <TaskColumn
  id="Completed"
  openColumn={openColumn}
  setOpenColumn={setOpenColumn}
  title="Completed"
  tasks={taskColumns.completed}
  color={{
    background: "#17322A",
    header: "#16A34A",
  }}
/>

  <TaskColumn
    id="Overdue"
  
    openColumn={openColumn}
    setOpenColumn={setOpenColumn}
    title="Overdue"
    tasks={taskColumns.overdue}
    color={{
      background:"#391A1A",
      header:"#C64537"
    }}
  />
</div>
   </div>

    {modal && <Createtaskmodal modal={modal} setModal={setModal} projects={projects} users={users}/>}

    {editModal && (
  <div className={styles.overlay}>
    <div className={styles.editModal}>
      
      <button
        className={styles.closeBtn}
        onClick={() => setEditModal(false)}
      >
        <X />
      </button>

      <h2 className={styles.editTitle}>Edit Details</h2>

      {/* ASSIGNEE */}
      <select
        className={styles.input}
        value={form.employeeid}
        onChange={(e) => setForm({ ...form, employeeid: e.target.value })}
      >
        <option value="">Assignee</option>
        {users.map((u) => (
          <option key={u._id} value={u._id}>
            {u.name}
          </option>
        ))}
      </select>

      {/* PRIORITY */}
      <select
        className={styles.input}
        value={form.priority}
        onChange={(e) => setForm({ ...form, priority: e.target.value })}
      >
        <option value="">Priority</option>
        {["Low", "Medium", "High", "Urgent"].map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      {/* STATUS */}
      <select
        className={styles.input}
        value={form.status}
        onChange={(e) => setForm({ ...form, status: e.target.value })}
      >
        <option value="">Status</option>
        {["To Do","Pending", "In Progress", "Completed"].map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {/* DEADLINE */}
      <input
        type="date"
        className={styles.input}
        value={form.dueAt}
        onChange={(e) => setForm({ ...form, dueAt: e.target.value })}
      />

      <button
        className={styles.saveBtn}
        onClick={async () => {
          try {
            await axios.put(
              `${API_URL}admin/updatetask/${selectedTask._id}`,
              form,
              { withCredentials: true }
            );
            toast.success("Task updated");
            setEditModal(false);
            window.location.reload();
          } catch (err) {
            toast.error("Update failed");
          }
        }}
      >
        Save →
      </button>

    </div>
  </div>
)}


{taskmodal && <Createtaskmodal modal={taskmodal} setModal={setTaskmodal} projects={projects} users={users}/>}

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
                  <h4><Paperclip size={15} /> Attachments ({selectedTask?.dependencies?.files.length})</h4>
                  {selectedTask?.dependencies?.files?.length === 0
                    ? <p className={styles.muted}>No attachments yet</p>
                    : <ul className={styles.attachList}>
                        {selectedTask?.dependencies?.files?.map((f, i) => (
                          <a
                                          key={i}
                                          href={f?.img}
                                          target="_blank"
                                          rel="noreferrer"
                                          className={styles.fileCard}
                                        ><li key={i}><Paperclip size={13} />{getFileMeta(f?.img)}</li></a>
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
                {selectedTask.status === "Completed" && (
                  <div className={styles.panelFooter}>
                    <button className={styles.completeBtn} onClick={handlecomplete}  disabled={selectedTask.status === "Completed"}>
                      <CheckCircle size={16} /> Mark Complete
                    </button>
                    <button className={styles.reviewBtn} onClick={handlereview}>
                      Submit for Review
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

</>
  );
};

export default Taskpage;
