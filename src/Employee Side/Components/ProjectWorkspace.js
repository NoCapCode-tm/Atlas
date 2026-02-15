import React, { useEffect, useMemo, useState } from "react";
import styles from "../CSS/ProjectWorkspace.module.css";
import { toast } from "react-toastify";
import axios from "axios";
import { useParams } from "react-router";
import { CircleAlert, CircleCheck, Clock, File, FileSpreadsheet, FileText, Image, ImageIcon } from 'lucide-react';
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function TaskStatusDonut({
  completed,
  inProgress,
  todo
}) {
  const data = {
    labels: ["Completed", "In Progress", "To Do"],
    datasets: [
      {
        data: [completed, inProgress, todo],
        backgroundColor: ["#10B981", "#6D5BD0", "#CBD5E1"],
        borderWidth: 0,
        cutout: "70%"   // 👈 donut thickness (image jaisa)
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true
      }
    }
  };

  return (
    <div style={{ width: 220, height: 220 }}>
      <Doughnut data={data} options={options} />
    </div>
  );
}

export default function ProjectWorkspace() {
    const {id} = useParams()
      const[user,setUser] = useState("")
      const[alluser,setalluser]=useState([])
      const[tasks,setTasks]=useState([])
       const[project,setProject]=useState("")
       const [pageLoading, setPageLoading] = useState(true);
    const[tabs,setTabs]=useState("overview")
    const [filter, setFilter] = useState("All");
    const[files,setFiles]=useState([])

  const filteredTasks =
    filter === "All"
      ? tasks
      : tasks.filter(t => t.status === filter);

   
   
useEffect(() => {
  if (
    user &&
    tasks.length >= 0 &&
    project &&
    alluser.length>=0
  ) {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 600); 

    return () => clearTimeout(timer);
  }
}, [user, tasks, project,alluser]);

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
        alluserRes,
      ] = await Promise.all([
        axios.get("https://prismbackend-27d920759150.herokuapp.com/api/v1/admin/getuser", { withCredentials: true }),
        axios.get("https://prismbackend-27d920759150.herokuapp.com/api/v1/admin/getalltask"),
        axios.get(`https://prismbackend-27d920759150.herokuapp.com/api/v1/admin/getprojectdetails/${id}`),
        axios.get("https://prismbackend-27d920759150.herokuapp.com/api/v1/admin/getalluser"),
      ]);

      if (!mounted) return;

      setUser(userRes.data.message);
      setTasks(taskRes.data.message);
      setProject(projectRes.data.message);
      setalluser(alluserRes.data.message)

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

const projectTasks = useMemo(() => {
  return tasks.filter(t => String(t.projectId) === String(project?._id));
}, [tasks, project?._id]);

useEffect(() => {
  if (!projectTasks.length) {
    setFiles([]);
    return;
  }

  const allFiles = projectTasks.flatMap(
    t => t.dependencies?.files || []
  );

  setFiles(allFiles);
}, [projectTasks]);

const completedCount = useMemo(() =>
  tasks.filter(
    t => t.status === "Completed" && String(t.projectId) === String(project._id)
  ).length
, [tasks, project?._id]);

const inProgressCount = useMemo(() =>
  tasks.filter(
    t => t.status === "In Progress" && String(t.projectId) === String(project._id)
  ).length
, [tasks, project?._id]);

const todoCount = useMemo(() =>
  tasks.filter(
    t => t.status === "To Do" && String(t.projectId) === String(project._id)
  ).length
, [tasks, project?._id]);


const hoursSpent = useMemo(() => {
  if (!tasks?.length || !project?._id) return 0;

  const projectTasks = tasks.filter(
    t => String(t.projectId) === String(project._id)
  );

  const completedTasks = projectTasks.filter(
    t => t.status === "Completed" && t.completedAt && t.createdAt
  );

  const totalMs = completedTasks.reduce((sum, task) => {
    const start = new Date(task.createdAt).getTime();
    const end = new Date(task.completedAt).getTime();
    return sum + Math.max(end - start, 0);
  }, 0);

  // ms → hours (rounded)
  return Math.round(totalMs / (1000 * 60 * 60));
}, [tasks, project._id]);

const isToday = (date) => {
  const d = new Date(date);
  const today = new Date();

  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

const todayTasksCount = useMemo(() => {
  if (!tasks?.length || !project?._id) return 0;

  return tasks.filter(
    t =>
      String(t.projectId) === String(project._id) &&
      t.createdAt &&
      isToday(t.createdAt)
  ).length;
}, [tasks, project._id]);

const timeAgo = (date) => {
  if (!date) return "";

  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours   = Math.floor(minutes / 60);
  const days    = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
};

// 
const progress = useMemo(()=>{
   const projecttask = tasks.filter(t => t?.projectId === project._id)
                const completedtask = projecttask.filter(t => t.status === "Completed")
            const progress =projecttask.length === 0? 0: Math.floor((completedtask.length / projecttask.length) * 100);
            return progress;
},[tasks,project._id])


const getFileMeta = (url) => {
  const name = decodeURIComponent(url.split("/").pop().split("?")[0]);
  const ext = name.split(".").pop().toLowerCase();

  let type = "file";
  if (ext === "pdf") type = "pdf";
  else if (["xls", "xlsx"].includes(ext)) type = "excel";
  else if (["jpg", "jpeg", "png", "webp"].includes(ext)) type = "image";

  return { name, ext, type };
};

const getFileIcon = (type) => {
  switch (type) {
    case "image":
      return <ImageIcon size={30} />;
    case "pdf":
      return <FileText size={30} />;
    case "excel":
      return <FileSpreadsheet size={30} />;
    default:
      return <File size={30} />;
  }
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
    <div className={styles.projectPage}>

      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        Projects <span>›</span> {project?.projectname}
      </div>

      {/* Header */}
      <div className={styles.headerRow}>
        <div>
          <h1>{project?.projectname}</h1>
          <p className={styles.subtitle}>
            {project?.description}
          </p>

          <div className={styles.metaRow}>
            <span className={`${styles.badge} ${styles.green}`}>On Track</span>
            <span className={styles.due}>• Due {new Date(project?.timeline?.endDate).toLocaleString("en-IN",{
               day:"2-digit",
               month:"long",
               year:"numeric"
            })}</span>

            <div className={styles.avatars}>
  {(() => {
    const projectUsers = alluser.filter(u =>
      u?.Projects?.includes(project._id)
    );

    const visibleUsers = projectUsers.slice(0, 3);
    const remainingCount = projectUsers.length - visibleUsers.length;

    return (
      <>
        {visibleUsers.map((u) => (
          <div key={u._id} className={styles.avatar}>
            {u.profilepicture ? (
              <img
                src={u.profilepicture}
                alt={u.name}
                style={{ width: "100%", height: "100%", borderRadius: "50%" }}
              />
            ) : (
              <span>
                {u.name
                  ?.split(" ")
                  .map(n => n[0])
                  .join("")
                  .toUpperCase()}
              </span>
            )}
          </div>
        ))}

        {remainingCount > 0 && (
          <div className={`${styles.avatar} ${styles.more}`}>
            +{remainingCount}
          </div>
        )}
      </>
    );
  })()}
</div>

          </div>
        </div>

        <div className={styles.rightHeader}>
          <div className={styles.progressWrap}>
            <div className={styles.progress}>
            <span>Progress</span>
            <span className={styles.percent}>{progress}%</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{width:`${progress}%`}}></div>
            </div>
          </div>

          <button className={styles.addBtn}>＋ Add Task</button>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button className={tabs==="overview"?`${styles.tab} ${styles.active}`:styles.tab} onClick={()=>{setTabs("overview")}}>Overview</button>
        <button className={tabs==="tasks"?`${styles.tab} ${styles.active}`:styles.tab} onClick={()=>{setTabs("tasks")}}>Tasks</button>
        <button className={tabs==="files"?`${styles.tab} ${styles.active}`:styles.tab} onClick={()=>{setTabs("files")}}>Files</button>
        <button className={tabs==="milestone"?`${styles.tab} ${styles.active}`:styles.tab} onClick={()=>{setTabs("milestone")}}>Milestones</button>
      </div>

      {/* Stats */}
      {tabs === "overview" ? (
        <>
           <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.icon} ${styles.purple}`}><CircleCheck size={20} color="white"/></div>
          <h2>{(()=>{
            const projecttask = tasks.filter(t => t?.projectId === project._id)
            return projecttask.length
          })()}</h2>
          <p>Total Tasks</p>
          <span className={styles.hint}> {todayTasksCount} tasks added today</span>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.icon} ${styles.purple}`}><Clock size={20} color="white"/></div>
         <h2>{hoursSpent}h</h2>
         <p>Hours Spent</p>
          <span className={styles.hint}>12h remaining in budget</span>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.icon} ${styles.purple}`}><CircleAlert size={20} color="white"/></div>
          <h2>{(()=>{
            const projecttask = tasks.filter(t => t?.projectId === project._id)
            const pending = projecttask.filter(t => t.status !== "Completed" )
            return pending.length
          })()}</h2>
          <p>Pending Tasks</p>
          <span className={styles.hint}>{(()=>{
            const highprioritytask = tasks.filter(t => t?.projectId === project._id  && t?.priority === "High")
            return highprioritytask.length
          })()} high priority</span>
          <span className={styles.dot}></span>
        </div>
      </div>

      {/* Bottom */}
      <div className={styles.bottomGrid}>
        <div className={styles.activityCard}>
          <h3>Recent Activity</h3>
          <div className={styles.allactivity}>
          {project?.recentActivity.map((p,index)=>(
            <div className={styles.activityItem}>
            <span className={styles.bullet}></span>
            <p>
              <b>{p?.user} -</b> {p?.title} - <span className={styles.link}>{(()=>{
            const task = tasks.find(t => t?._id ===p?.refs)
            return task?.title
          })()} </span>
            </p>
            <small>{timeAgo(p?.time)}</small>
          </div>
          ))}
          </div>
        </div>

    <div className={styles.statusCard}>
  <h3>Task Status</h3>
  <div className={styles.doughnut}>
  <TaskStatusDonut
    completed={completedCount}
    inProgress={inProgressCount}
    todo={todoCount}
  />
  </div>

  <div className={styles.legend}>
    <span><i className={styles.green}></i> Completed</span>
    <span><i className={styles.purple}></i> In Progress</span>
    <span><i className={styles.gray}></i> To Do</span>
  </div>
</div>
      </div>
        </>
      ):tabs=== "tasks" ? (
        <div className={styles.tasks}>
           <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3>Tasks</h3>

        <div className={styles.tabs}>
          {["All", "To Do", "In Progress","Pending", "Completed"].map(tab => (
            <button
              key={tab}
              className={`${styles.tab} ${
                filter === tab ? styles.active : ""
              }`}
              onClick={() => setFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.list}>
        {filteredTasks.map(task => (
          <div key={task.id} className={styles.row}>
            <div className={styles.left}>
              <span
                className={`${styles.checkbox} ${
                  task.status === "Completed" ? styles.checked : ""
                }`}
              />

              <div className={styles.text}>
                <p
                  className={`${styles.title} ${
                    task?.status === "Completed" ? styles.done : ""
                  }`}
                >
                  {task?.title}
                </p>

                <div className={styles.meta}>
                  <span
                    className={`${styles.priority} ${styles[task.priority]}`}
                  >
                    {task?.priority}
                  </span>
                  <span className={styles.dot}>•</span>
                  <span>{new Date(task?.dueAt).toLocaleString("en-IN",{
                    day:"2-digit",
                    month:"long",
                    year:"numeric"
                  })}</span>
                </div>
              </div>
            </div>

            <div className={styles.right}>
              <span
                className={`${styles.status} ${styles[task?.status.replace(" ", "")]}`}
              >
                {task?.status}
              </span>

              <span
                className={`${styles.assignee} ${
                  task?.assignedto ? styles.unassigned : ""
                }`}
              >
                {(()=>{
                   const user = alluser.find(u => u._id === task.assignedto)
                   return user?.name
                })()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
        </div>
      ):tabs === "files" ?(
         <div className={styles.filesGrid}>
    {files.map((url, i) => {
      const meta = getFileMeta(url);

      return (
        <a
          key={i}
          href={url}
          target="_blank"
          rel="noreferrer"
          className={styles.fileCard}
        >
          <div className={styles.filePreview}>
  <span className={`${styles.fileIcon} ${styles[meta.type]}`}>
    {getFileIcon(meta.type)}
  </span>
</div>


          <div className={styles.fileInfo}>
            <p className={styles.fileName}>{meta.name}</p>
            <span className={styles.fileMeta}>Uploaded</span>
          </div>
        </a>
      );
    })}

    {/* Upload Card */}
    <div className={`${styles.fileCard} ${styles.uploadCard}`}>
      <div className={styles.uploadInner}>
        <div className={styles.uploadIcon}>⬇</div>
        <p>Upload File</p>
        <span>or drag & drop</span>
      </div>
    </div>
  </div>
      ):(
        <div className={styles.milestone}>
          <h2 style={{textAlign:"center",marginTop:"20px"}}>Work In Progress ! V2 Coming Soon</h2>
        </div>
      )}
     

    </div>
  );
}
