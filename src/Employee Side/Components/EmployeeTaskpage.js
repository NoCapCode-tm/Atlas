import React, { useEffect, useMemo, useState } from "react";
import styles from "../CSS/EmployeeTaskpage.module.css";
import { Search, Plus, Filter, MoveRight, CheckCircle, Paperclip, FileText, X, Calendar, PlusIcon } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router";
import ECreatetaskmodal from "./EmployeeSubTask";
import Createtask from "./CreateTask";


export default function EmployeeTaskpage() {
     const[user,setUser] = useState("")
  const[tasks,setTasks]=useState([])
  const navigate = useNavigate()
  const[projects,setProjects]=useState([])
const [pageLoading, setPageLoading] = useState(true);
const [selectedTask, setSelectedTask] = useState(null);
const [tab, setTab] = useState("details");
const [attachments, setAttachments] = useState([]);
const fileInputRef = React.useRef(null);
const [uploading, setUploading] = useState(false);
const[comment,setComments]=useState("")
const [draggedTask, setDraggedTask] = useState(null);
 const[taskmodal,setTaskmodal] = useState(false)
 const[subtask,setSubtask]=useState([])
 const [openSubtasks, setOpenSubtasks] = useState({});
const[task,setTask]=useState(false)
const[addsubtask,setAddsubtask]=useState("")





//page loading
useEffect(() => {
  if (
    user &&
    tasks.length >= 0 &&
    projects.length >= 0 &&
    Array.isArray(subtask)
  ) {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 600); 

    return () => clearTimeout(timer);
  }
}, [user, tasks, projects,subtask]);

//all get apis togetherfor smooth loading
useEffect(() => {
  let mounted = true;

  const loadDashboard = async () => {
    setPageLoading(true);
    const startTime = Date.now();

    try {
      const [
        userRes,
        taskRes,
        projectRes,
        subtaskRes
      ] = await Promise.all([
        axios.get("https://prismbackend-27d920759150.herokuapp.com/api/v1/admin/getuser", { withCredentials: true }),
        axios.get("https://prismbackend-27d920759150.herokuapp.com/api/v1/admin/getalltask"),
        axios.get("https://prismbackend-27d920759150.herokuapp.com/api/v1/admin/getallproject"),
        axios.get("https://prismbackend-27d920759150.herokuapp.com/api/v1/employee/getsubtask")
      ]);

      if (!mounted) return;

      setUser(userRes.data.message);
      setTasks(taskRes.data.message);
      setProjects(projectRes.data.message);
      setSubtask(subtaskRes.data.message)
      console.log(subtaskRes.data.message)

    } catch (err) {
      toast.error("Failed to load dashboard");
    } finally {
      const elapsed = Date.now() - startTime;
      const delay = Math.max(800 - elapsed, 0);

      setTimeout(() => {
        if (mounted) setPageLoading(false);
      }, delay);
    }
  };

  loadDashboard();

  return () => {
    mounted = false;
  };
}, []);

const handletaskstats = () =>{
  const totaltask = tasks.filter(t => t.assignedto === user._id)

  const completedtask = totaltask.filter(t => t.status === "Completed")
  const pendingtask = totaltask.filter(t => t.status === "Pending")
  const inprogress = totaltask.filter(t=>t.status === "In Progress")
  const highpriority = totaltask.filter(t => t.priority === "High")

  

  return ({totaltask,completedtask,pendingtask,inprogress,highpriority})
}
const {
  totaltask,
  completedtask,
  pendingtask,
  inprogress,
  highpriority
} = handletaskstats();

const STATUS_COLUMNS = [
  { key: "To Do", title: "To Do", color: "rgba(98, 116, 142, 1)" },
  { key: "In Progress", title: "In Progress", color: "#2563eb" },
  { key: "Pending", title: "Review", color: "#f59e0b" },
  { key: "Completed", title: "Done", color: "#16a34a" }
  
];

const priorityUI = {
  High:   { color: "red", border: "red" },
  Medium:{ color: "orange", border: "orange" },
  Low:    { color: "green", border: "green" },
  Urgent:{color:"darkred", border:"darkred"}
};

//helper functions for finding overdue and completed time

const getTimeDiff = (date) => {
  const now = new Date();
  const target = new Date(date);

  const diffMs = target - now;
  const absMs = Math.abs(diffMs);

  const minutes = Math.floor(absMs / (1000 * 60));
  const hours = Math.floor(absMs / (1000 * 60 * 60));
  const days = Math.floor(absMs / (1000 * 60 * 60 * 24));

  if (diffMs > 0) {
    // future → time left
    if (minutes < 60) return `${minutes} min left`;
    if (hours < 24) return `${hours} hr left`;
    return `${days} day${days > 1 ? "s" : ""} left`;
  } else {
    // past → ago
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hr ago`;
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }
};


const boardColumns = useMemo(() => {
  if (!tasks.length || !user?._id) return [];

  const myTasks = tasks.filter(t => t.assignedto === user._id);

  return STATUS_COLUMNS.map(col => {
    let colTasks = myTasks.filter(t => t.status === col.key);

    if (col.key === "Completed") {
      // latest completed first
      colTasks = colTasks.sort(
        (a, b) => new Date(b.completedAt) - new Date(a.completedAt)
      );
    } else {
      // nearest due date first (overdue will auto come on top)
      colTasks = colTasks.sort(
        (a, b) => new Date(a.dueAt) - new Date(b.dueAt)
      );
    }

    return {
      ...col,
      count: colTasks.length,
      tasks: colTasks
    };
  });
}, [tasks, user]);

//overlay

const handleFileSelect = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // UI update
  setAttachments(prev => [...prev, file]);

  // API call
  await uploadAttachment(file);
};

const uploadAttachment = async (file) => {
  try {
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("taskId", selectedTask._id);

    await axios.post(
      "https://prismbackend-27d920759150.herokuapp.com/api/v1/employee/task/upload-attachment",
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    toast.success("Attachment uploaded");

  } catch (err) {
    toast.error("Upload failed");
  } finally {
    setUploading(false);
  }
};

//send comments

const handlecomment = async()=>{
 try {
   const response = await axios.post("https://prismbackend-27d920759150.herokuapp.com/api/v1/employee/commentsend",{
     comment:comment,
     taskid:selectedTask._id,
     userid:user._id,
   },{withCredentials:true})
   console.log(response.data.message)
   toast.success("Comment sent Successfully")
   window.location.reload()
 } catch (error) {
    toast.error("Comment cannot be send")
 }
}

const handlecomplete = async() =>{
  try {
    const response = await axios.post("https://prismbackend-27d920759150.herokuapp.com/api/v1/employee/complete-task",{
      taskid:selectedTask._id,
      userid:user._id
    })
    toast.success("Task Completed Successfully")
    window.location.reload()
  } catch (error) {
     toast.error("Task Cannot be Completed")
  }
}

const handlereview = async() =>{
  try {
    const response = await axios.post("https://prismbackend-27d920759150.herokuapp.com/api/v1/employee/review-task",{
      taskid:selectedTask._id,
      userid:user._id
    })
    toast.success("Task Set to Review Successfully")
    window.location.reload()
  } catch (error) {
     toast.error("Task Cannot be set to Reviewed")
  }
}

const getTaskSubtasks = (taskId) => {
  return subtask?.filter(st => String(st.relatedtasks) === String(taskId));
};


const toggleSubtasks = (taskId) => {
  setOpenSubtasks(prev => ({
    ...prev,
    [taskId]: !prev[taskId]
  }));
};






const PageLoader = () => {
  return (
    <div className={styles.pageLoader}>
      <div className={styles.loaderCard}>
        <div className={styles.spinner}></div>
        <p>Loading your workspace…</p>
      </div>
    </div>
  );
};

if (pageLoading) {
  return <PageLoader />;
}


  return (
    <>
    <div className={styles.page}>
      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <h1>My Tasks</h1>
          <div className={styles.meta}>
            <span className={styles.pending}>{pendingtask?.length} Pending</span>
            <span className={styles.high}>{highpriority?.length} High Priority</span>
          </div>
        </div>

        <div className={styles.actions}>
          {/* <div className={styles.searchBox}>
            <Search size={16} />
            <input placeholder="Search tasks..." />
          </div>
          <button className={styles.filterBtn}>
            <Filter size={16} /> Filter
          </button> */}
          <button className={styles.newBtn} onClick={()=>{setTask(true)}}>
            <Plus size={18} /> New Task
          </button>
        </div>
      </div>

      {/* BOARD */}
      <div className={styles.board}>
  {boardColumns.map((col, idx) => (
    <div
  key={idx}
  className={styles.column}
  onDragOver={(e) => e.preventDefault()}
  onDrop={async () => {
    if (!draggedTask) return;
    if (draggedTask.status === col.key) return;

    try {
      await axios.put(
        `https://prismbackend-27d920759150.herokuapp.com/api/v1/employee/updatetask/${draggedTask._id}`,
        {
          status: col.key
        },
        { withCredentials: true }
      );
      setTasks(prev =>
        prev.map(t =>
          t._id === draggedTask._id
            ? { ...t, status: col.key }
            : t
        )
      );

      toast.success(`Task moved to ${col.title}`);
    } catch {
      toast.error("Failed to update task status");
    } finally {
      setDraggedTask(null);
    }
  }}
>
      <div className={styles.columnHeader}>
        <span className={styles.dot} style={{ background: col.color }} />
        <h3>{col.title}</h3>
        <span className={styles.count}>{col.count}</span>
        <span className={styles.more}>•••</span>
      </div>

      <div className={styles.cards}>
        {col.tasks.map(task => {
          const ui = priorityUI[task.priority] || {};

          return (
            <div key={task._id} draggable onDragStart={() => {setDraggedTask(task);}}
                className={`${styles.card} ${styles[ui.border]}`}
            >

              <span
                className={`${styles.priority} ${styles[ui.color]}`}
              >
                {task.priority}
              </span>

              <h4>{task.title}</h4>

              <div className={styles.tags}>
                {task.tags?.map((t, i) => (
                  <span key={i}>{t}</span>
                ))}
              </div>
              
              <div className={styles.bothtimearrow}>
                {/* SUBTASK INDICATOR */}
{Array.isArray(task?.subtasks) && task.subtasks.length > 0 && (
  <div
    className={styles.subtaskToggle}
    onClick={(e) => {
      e.stopPropagation();
      toggleSubtasks(task._id);
    }}
  >
    {task?.subtasks?.length} subtask{task?.subtasks?.length > 1 ? "s" : ""}
    
  </div>
)}


              <div
  className={`${styles.time} ${
    task.status !== "Completed" && new Date(task.dueAt) < new Date()
      ? styles.overdue
      : ""
  }`}
>
  ⏱{" "}
  {task.status === "Completed"
    ? getTimeDiff(task.completedAt)
    : getTimeDiff(task.dueAt)}
              </div>
                <span
  className={styles.showarrow}
  onClick={(e) => {
    e.stopPropagation();
    console.log("ARROW CLICKED", task);
    setSelectedTask(task);
  }}
>
  <MoveRight color="white" />
</span>

              </div>
              {/* SUBTASK DROPDOWN */}
{openSubtasks[task._id] ?(
  <div className={styles.subtaskList}>
    {getTaskSubtasks(task._id)?.map(st => (
      <div key={st._id} className={styles.subtaskCard}>
        <h5>{st.title}</h5>
        <p>{st.description}</p>
        <span>
          {new Date(st.createdAt).toLocaleDateString("en-IN")}
        </span>
      </div>
    ))}
  </div>
):(
  <div className={styles.addsubtask} onClick={()=>{
    setAddsubtask(task)
    setTaskmodal(true)}}>
      <PlusIcon size={12}/>
      Add Subtask
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


    {selectedTask && (
   <div className={styles.backdrop} onClick={()=>{setSelectedTask(null)}}>
      <div
        className={styles.panel}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className={styles.header1}>
          <div className={styles.badges}>
            <span className={styles.priority1}>{selectedTask?.priority} Priority</span>
            <span className={styles.status1}>{selectedTask?.status}</span>
          </div>

          <div className={styles.headerRight}>
            {/* <span className={styles.taskId}>Task ID: TASK-102</span> */}
            <button onClick={()=>{setSelectedTask(null)}} className={styles.closeBtn}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* TITLE */}
        <h1 className={styles.title}>
          {selectedTask?.title}
        </h1>

        {/* META */}
        <div className={styles.meta}>
          <div>
            <span>ASSIGNEE</span>
            <p>{user?.name}</p>
          </div>

          <div>
            <span>DUE DATE</span>
            <p>
              <Calendar size={14} /> {new Date(selectedTask?.dueAt).toLocaleDateString("en-IN",{
                 day:"2-digit",
                 month:"short",
                 year:"numeric"
              })}
            </p>
          </div>
        </div>

        {/* TABS */}
        <div className={styles.tabs}>
          <button
            className={tab === "details" ? styles.activeTab : styles.buttons2}
            onClick={() => setTab("details")}
          >
            Details
          </button>
          <button
            className={tab === "activity" ? styles.activeTab : styles.buttons2}
            onClick={() => setTab("activity")}
          >
            Activity & Comments
          </button>
        </div>

        {/* CONTENT */}
        {tab === "details" && (
          <div className={styles.content}>
            {/* DESCRIPTION */}
            <div className={styles.division}>
            <div className={styles.card}>
              <h4>
                <FileText size={16} /> Description
              </h4>
              <p>
                {selectedTask?.description}
              </p>
            </div>

            {/* ATTACHMENTS */}
            <div className={styles.card}>
              <h4>
                <Paperclip size={16} /> Attachments (0)
              </h4>
              {attachments.length === 0 ? (
  <p className={styles.muted}>No attachments</p>
) : (
  <ul className={styles.attachmentList}>
    {attachments.map((file, i) => (
      <li key={i}>
        <Paperclip size={14} />
        {file.name}
      </li>
    ))}
  </ul>
)}


              <button
  className={styles.attachBtn}
  onClick={() => fileInputRef.current.click()}
>
  + Add Attachment
</button>

              <input
  type="file"
  ref={fileInputRef}
  style={{ display: "none" }}
  onChange={(e) => handleFileSelect(e)}
/>

            </div>
            </div>
               {selectedTask?.status !=="Completed" && (
            <div className={styles.footer}>
          <button className={styles.completeBtn} onClick={handlecomplete} disabled={selectedTask?.status === "Completed"}>
            <CheckCircle size={18} /> Mark Complete
          </button>

          <button className={styles.reviewBtn} onClick={handlereview} disabled={selectedTask?.status === "Completed" || selectedTask?.status === "Pending"}>
            Submit for Review
          </button>
        </div>

        )}
          </div>
        )}

        {tab === "activity" && (
  <div className={styles.activityWrapper}>

    {/* COMMENTS */}
    <div className={styles.division}>
        <div className={styles.comments}>
      {selectedTask?.comments?.map((c, i) => (
        <div key={i} className={styles.commentCard}>
          <div className={styles.commentHeader}>
            <span className={styles.commentAuthor}>{c?.commentby}</span>
            <span className={styles.commentTime}>
              {new Date(c.timeat).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit"
              })}
            </span>
          </div>

          <p className={styles.commentText}>{c.text}</p>
        </div>
      ))}
    </div>

    {/* COMMENT INPUT */}
    <div className={styles.commentBox}>
      <textarea placeholder="Write a comment..."  value={comment} onChange={(e)=>{setComments(e.target.value)}}/>
      <button className={styles.sendBtn} onClick={handlecomment}>➤</button>
    </div>

    {/* HISTORY */}
    <div className={styles.historySection}>
      <h4>TASK HISTORY</h4>

      <div className={styles.timeline}>
        {selectedTask?.history?.map((h, i) => (
          <div key={i} className={styles.timelineItem}>
            <span className={styles.dot}></span>

            <div className={styles.timelineContent}>
              <p>
                <strong>{h?.actionby }</strong>{" "}
                {h.title}
              </p>
              <span>
                {new Date(h.timeat).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric"
                })}{" "}
                at{" "}
                {new Date(h.timeat).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
   </div>
 

      {selectedTask?.status !=="Completed" && (
            <div className={styles.footer}>
          <button className={styles.completeBtn} onClick={handlecomplete} disabled={selectedTask?.status === "Completed"}>
            <CheckCircle size={18} /> Mark Complete
          </button>

          <button className={styles.reviewBtn} onClick={handlereview} disabled={selectedTask?.status === "Completed" || selectedTask?.status === "Pending"}>
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
{task && <Createtask modal={task}  setModal={setTask} user={user} projects={projects}/>}


    </>
  );
}
