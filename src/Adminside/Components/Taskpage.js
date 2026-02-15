import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import styles from "../CSS/Taskspage.module.css";
import { Pencil, Trash, Search, ChevronLeft, ChevronRight, X, ChevronDown, Bell } from "lucide-react";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { useNavigate } from "react-router";
import Createtaskmodal from "./Createtaskmodal";

const PAGE_SIZE = 5;

const formatDate = (d) => {
  if (!d) return "-";
  const dt = dayjs(d);
  if (!dt.isValid()) return "-";
  return dt.format("DD-MM-YY");
};

const priorityClass = (p) => {
  switch ((p || "").toLowerCase()) {
    case "urgent":
      return styles.priorityUrgent;
    case "high":
      return styles.priorityHigh;
    case "medium":
      return styles.priorityMedium;
    case "low":
      return styles.priorityLow;
    default:
      return styles.priorityNeutral;
  }
};

const statusClass = (s) => {
  if (!s) return styles.statusPending;
  switch (s.toLowerCase()) {
    case "completed":
    case "done":
      return styles.statusDone;
    case "in progress":
    case "inprogress":
      return styles.statusInProgress;
    default:
      return styles.statusPending;
  }
};

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

  // UI state
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
const [priorityFilter, setPriorityFilter] = useState("All");
const [projectFilter, setProjectFilter] = useState("All");

  const [page, setPage] = useState(1);
  const navigate = useNavigate()

  // fetch all data
  useEffect(() => {
    let mounted = true;
    async function fetchAll() {
      try {
        setLoading(true);
        const [tRes, uRes, pRes] = await Promise.all([
          axios.get(`https://atlasbackend-px53.onrender.com/api/v1/admin/getalltask`, { withCredentials: true }),
          axios.get(`https://atlasbackend-px53.onrender.com/api/v1/admin/getalluser`, { withCredentials: true }),
          axios.get(`https://atlasbackend-px53.onrender.com/api/v1/admin/getallproject`, { withCredentials: true }),
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
  }, [tasks, users, projects]);

  // filtering (search by title or assignee or project)
const filtered = useMemo(() => {
  let data = enriched;

  // 🔍 SEARCH (title + assignee + project)
  const q = query.trim().toLowerCase();
  if (q) {
    data = data.filter((t) => {
      const title = (t.title || "").toLowerCase();
      const assignee = (t.assigned?.name || "").toLowerCase();
      const project = (t.project?.projectname || "").toLowerCase();

      return (
        title.includes(q) ||
        assignee.includes(q) ||
        project.includes(q)
      );
    });
  }

  // 📌 STATUS
  if (statusFilter !== "All") {
    data = data.filter(
      (t) =>
        (t.status || "").toLowerCase() ===
        statusFilter.toLowerCase()
    );
  }

  // 🚦 PRIORITY
  if (priorityFilter !== "All") {
    data = data.filter(
      (t) =>
        (t.priority || "").toLowerCase() ===
        priorityFilter.toLowerCase()
    );
  }

  // 📁 PROJECT
  if (projectFilter !== "All") {
    data = data.filter(
      (t) => t.project?._id === projectFilter
    );
  }

  return data;
}, [
  enriched,
  query,
  statusFilter,
  priorityFilter,
  projectFilter
]);



  // pagination
 const total = filtered.length;
const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

useEffect(() => {
  if (page > totalPages) setPage(totalPages);
}, [totalPages, page]);

const pageItems = useMemo(() => {
  const start = (page - 1) * PAGE_SIZE;
  return filtered.slice(start, start + PAGE_SIZE);
}, [filtered, page]);


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
      await axios.delete(`https://atlasbackend-px53.onrender.com/api/v1/admin/deletetask/${task._id}`, { withCredentials: true });
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

function InfoTooltip({ text }) {
  return (
    <span className={styles.tooltipWrap}>
      <span className={styles.infoIcon}>i</span>
      <span className={styles.tooltipText}>{text}</span>
    </span>
  );
}


   
  return (
    <>
  <div className={styles.page}>
      <div className={styles.headbutton}>
      <h1 className={styles.title}>Task Manager</h1>
      <button className={styles.addtask} onClick={()=>{setTaskmodal(true)}}>Assign Task</button>
      </div>

      {/* KPI CARDS */}
       <div className={styles.kpiRow}>

      {/* TOTAL TASKS */}
      <div className={`${styles.kpiCard} ${styles.purple}`}>
        <div className={styles.left}>
          <p>Total Tasks <InfoTooltip text="Total number of tasks created across all projects" /></p>
          <h2>{tasks?.length}</h2>
        </div>

        {/* IMAGE PLACEHOLDER */}
        <div className={styles.imageSlot}>
          <img src ="./task1.png" alt="/" height="100%" width="100%"/>
        </div>
      </div>

      {/* IN PROGRESS */}
      <div className={`${styles.kpiCard} ${styles.green}`}>
        <div className={styles.left}>
          <p>In Progress <InfoTooltip text="Tasks currently being worked on and not completed" /></p>
          <h2>{inProgressCount}</h2>
        </div>

        <div className={styles.imageSlot1}>
          <span></span>
  <span></span>
  <span></span>
        </div>
      </div>

      {/* COMPLETED TODAY */}
      <div className={`${styles.kpiCard} ${styles.orange}`}>
        <div className={styles.left}>
          <p>Completed<InfoTooltip text="Tasks that have been completed" /></p>
          <h2>{completedTodayCount}</h2>
        </div>

        <div className={styles.imageSlot}>
          <img src ="./task4.png" alt="/" height="100%" width="100%"/>
        </div>
      </div>

      {/* PENDING */}
      <div className={`${styles.kpiCard} ${styles.red}`}>
        <div className={styles.left}>
          <p>Pending <InfoTooltip text="Tasks that have passed their assigned deadline" /></p>
          <h2>{pendingCount}</h2>
        </div>

        <div className={styles.imageSlot}>
          <img src ="./task3.png" alt="/" height="100%" width="100%"/>
        </div>
      </div>

    </div>

      {/* ADV FILTER */}
   <div className={styles.tableWrap}>

  {/* HEADER ROW */}
  <div className={styles.taskHeaderRow}>
    <h2>Task Status</h2>

    <div className={styles.filtersRow}>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search tasks"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setPage(1);
        }}
        className={styles.filterSearch}
      />

      {/* STATUS FILTER */}
      <select
        className={styles.filterSelect}
        value={statusFilter}
        onChange={(e) => {
          setStatusFilter(e.target.value);
          setPage(1);
        }}
      >
        <option value="All">All Status</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      {/* PRIORITY FILTER */}
      <select
        className={styles.filterSelect}
        value={priorityFilter}
        onChange={(e) => {
          setPriorityFilter(e.target.value);
          setPage(1);
        }}
      >
        <option value="All">All Priority</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
        <option value="Urgent">Urgent</option>
      </select>

      {/* PROJECT FILTER */}
      <select
        className={styles.filterSelect}
        value={projectFilter}
        onChange={(e) => {
          setProjectFilter(e.target.value);
          setPage(1);
        }}
      >
        <option value="All">All Projects</option>
        {projects.map((p) => (
          <option key={p._id} value={p._id}>
            {p.projectname}
          </option>
        ))}
      </select>

    </div>
  </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: "40px" }} />
              <th>Task Title</th>
              <th>Assignee</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Deadline</th>
              <th>Project</th>
              <th style={{ width: "110px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} className={styles.loadingRow}>Loading...</td></tr>
            ) : pageItems.length === 0 ? (
              <tr><td colSpan={9} className={styles.loadingRow}>No tasks found</td></tr>
            ) : pageItems.map((row) => (
              <tr key={row._id}>
                <td>
                  <input type="checkbox" />
                </td>

                <td className={styles.titleCell}>
                  <div className={styles.taskTitle}>{row.title}</div>
                </td>

                <td>
                  <div className={styles.assigneeCell}>
                    <img
                      src={row.assigned?.profilepicture || `https://i.pravatar.cc/40?u=${row.assigned?._id || row.assignedto}`}
                      alt="avatar"
                      className={styles.avatar}
                    />
                    <div>
                      <div className={styles.assigneeName}>{row.assigned?.name || "—"}</div>
                      <div className={styles.assigneeRole}>{row.assigned?.designation?.name || "No Role"}</div>
                    </div>
                  </div>
                </td>

                <td>
                  <div className={`${styles.priorityTag} ${priorityClass(row.priority)}`}>
                    {row.priority || "—"}
                  </div>
                </td>

                <td>
                  <div className={`${styles.statusTag} ${statusClass(row.status)}`}>
                    {row.status || "Pending"}
                  </div>
                </td>

                <td>{formatDate(row.dueAt)}</td>

                <td>{row.project?.projectname || "—"}</td>

                {/* <td>
                  <div className={styles.progressWrap}>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${Math.min(100, Number(row.weightage || 0))}%` }}
                      />
                    </div>
                    <div className={styles.progressNumber}>{row.weightage ?? 0}%</div>
                  </div>
                </td> */}

                <td className={styles.actions}>
                  <button className={styles.iconBtn} title="Edit" onClick={() => handleEdit(row)}>
                    <Pencil size={16} color="black" fill="black"  />
                  </button>
                  <button className={styles.iconBtnDanger} title="Delete" onClick={() => handleDelete(row)}>
                    <Trash size={16} color="red" fill="red"/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

    </div>
    <div className={styles.pagination}>
        <div className={styles.pageInfo}>
          Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, total)} of {total} tasks
        </div>
     <div className={styles.pageControls}>
          <button
            className={styles.pageBtn}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft />
          </button>

          <div className={styles.pageNumbers}>
            {Array.from({ length: totalPages }).map((_, i) => {
              const idx = i + 1;
              return (
                <button
                  key={idx}
                  className={`${styles.pageNumber} ${page === idx ? styles.activePage : ""}`}
                  onClick={() => setPage(idx)}
                >
                  {idx}
                </button>
              );
            })}
         </div>
    </div>
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
              `https://atlasbackend-px53.onrender.com/api/v1/admin/updatetask/${selectedTask._id}`,
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
