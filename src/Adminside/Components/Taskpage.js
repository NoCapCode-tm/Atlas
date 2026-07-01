import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import styles from "../CSS/Taskspage.module.css";
import { Pencil, Trash, Search, ChevronLeft, ChevronRight, X, ChevronDown, Bell, Clock3, TriangleAlert, ClipboardList, Plus, MoreVertical } from "lucide-react";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { useNavigate } from "react-router";
import Createtaskmodal from "./Createtaskmodal";


const Taskpage = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const[modal,setModal]=useState(false)
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const[taskmodal,setTaskmodal] = useState(false)
const [selectedTask, setSelectedTask] = useState(null);

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

  // fetch all data
  useEffect(() => {
    let mounted = true;
    async function fetchAll() {
      try {
        setLoading(true);
        const [tRes, uRes, pRes] = await Promise.all([
          axios.get(`https://b-atlas-ncc.onrender.com/api/v1/admin/getalltask`, { withCredentials: true }),
          axios.get(`https://b-atlas-ncc.onrender.com/api/v1/admin/getalluser`, { withCredentials: true }),
          axios.get(`https://b-atlas-ncc.onrender.com/api/v1/admin/getallproject`, { withCredentials: true }),
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

  console.log(tasks);

  

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
      await axios.delete(`https://b-atlas-ncc.onrender.com/api/v1/admin/deletetask/${task._id}`, { withCredentials: true });
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
      (t) =>
        t.status?.toLowerCase() === "to do"
    ),

    pending: tasks.filter(
      (t) =>
        t.status?.toLowerCase() === "pending"
    ),

    review: tasks.filter(
      (t) =>
        t.status?.toLowerCase() === "in progress"
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
    <div className={styles.taskCard}>
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
  title,
  color,
  tasks,
}) => (
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
    >
      <div className={styles.columnTitle}>
        {title}

        <span>{tasks.length}</span>
      </div>

      <div className={styles.columnIcons}>
        <Plus size={18} />

        <MoreVertical size={18} />
      </div>
    </div>

    <div className={styles.columnBody}>
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
        />
      ))}
    </div>
  </div>
);

   
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
    title="To Do"
    tasks={taskColumns.todo}
    color={{
      background: "#0F241A",
      header: "#2F8E57",
    }}
  />

  <TaskColumn
    title="Pending"
    tasks={taskColumns.pending}
    color={{
      background: "#342514",
      header: "#F3A948",
    }}
  />

  <TaskColumn
    title="In Review"
    tasks={taskColumns.review}
    color={{
      background: "#15293F",
      header: "#3E8BDB",
    }}
  />

  <TaskColumn
    title="Overdue"
    tasks={taskColumns.overdue}
    color={{
      background: "#391A1A",
      header: "#C64537",
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
              `https://b-atlas-ncc.onrender.com/api/v1/admin/updatetask/${selectedTask._id}`,
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

</>
  );
};

export default Taskpage;
