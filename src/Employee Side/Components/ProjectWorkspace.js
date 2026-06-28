import React, { useEffect, useMemo, useState } from "react";
import styles from "../CSS/ProjectWorkspace.module.css";
import { toast } from "react-toastify";
import axios from "axios";
import { useParams } from "react-router";
import { CircleAlert, CircleCheck, Clock, File, FileSpreadsheet, FileText, ImageIcon } from 'lucide-react';
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import Createtask from "./CreateTask";

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
    const[projects,setProjects]=useState([])
    const[modal,setModal]=useState(false)

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
        projectsRes,
      ] = await Promise.all([
        axios.get("b-atlas-ncc.onrender.com/api/v1/admin/getuser", { withCredentials: true }),
        axios.get("b-atlas-ncc.onrender.com/api/v1/admin/getalltask"),
        axios.get(`b-atlas-ncc.onrender.com/api/v1/admin/getprojectdetails/${id}`),
        axios.get("b-atlas-ncc.onrender.com/api/v1/admin/getalluser"),
        axios.get("b-atlas-ncc.onrender.com/api/v1/admin/getallproject"),
      ]);

      if (!mounted) return;

      setUser(userRes.data.message);
      setTasks(taskRes.data.message);
      setProject(projectRes.data.message);
      setalluser(alluserRes.data.message)
      setProjects(projectsRes.data.message)

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
        My Tasks › Project › {project?.projectname}
      </div>

      {/* Header */}
      <div className={styles.headerSection}>
        <div className={styles.headerLeft}>
          <h1>{project?.projectname}</h1>
          <p className={styles.description}>
            {project?.description}
          </p>

          <div className={styles.metaRow}>
            <span className={styles.statusBadge}>On Track</span>
            <span className={styles.dueDate}>• Due {new Date(project?.timeline?.endDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            })}</span>

            <div className={styles.avatars}>
              {(() => {
                const projectUsers = alluser.filter(u =>
                  u?.Projects?.includes(project._id)
                );

                const visibleUsers = projectUsers.slice(0, 4);
                const remainingCount = projectUsers.length - visibleUsers.length;

                return (
                  <>
                    {visibleUsers.map((u) => (
                      <div key={u._id} className={styles.avatar}>
                        {u.profilepicture ? (
                          <img
                            src={u.profilepicture}
                            alt={u.name}
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

        <div className={styles.headerRight}>
          <button className={styles.moreBtn}>•••</button>
          <button className={styles.addTaskBtn} onClick={() => setModal(true)}>+ Add Task</button>
          
          <div className={styles.progressInfo}>
            <span className={styles.progressLabel}>Progress</span>
            <span className={styles.progressValue}>{progress}%</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{width:`${progress}%`}}></div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button className={tabs==="overview" ? styles.activeTab : styles.tab} onClick={()=>{setTabs("overview")}}>
          Overview
        </button>
        <button className={tabs==="tasks" ? styles.activeTab : styles.tab} onClick={()=>{setTabs("tasks")}}>
          Tasks
        </button>
        <button className={tabs==="files" ? styles.activeTab : styles.tab} onClick={()=>{setTabs("files")}}>
          Files
        </button>
        <button className={tabs==="milestone" ? styles.activeTab : styles.tab} onClick={()=>{setTabs("milestone")}}>
          Milestones
        </button>
      </div>

      {/* Stats */}
      {tabs === "overview" ? (
        <>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <CircleCheck size={24} color="#6366f1"/>
              </div>
              <h2>{(()=>{
                const projecttask = tasks.filter(t => t?.projectId === project._id)
                return projecttask.length
              })()}</h2>
              <p>Total Tasks</p>
              <span className={styles.statHint}>{todayTasksCount} tasks added today</span>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <Clock size={24} color="#6366f1"/>
              </div>
              <h2>{hoursSpent}h</h2>
              <p>Hours Spent</p>
              <span className={styles.statHint}>12h remaining in budget</span>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <CircleAlert size={24} color="#6366f1"/>
              </div>
              <h2>{(()=>{
                const projecttask = tasks.filter(t => t?.projectId === project._id)
                const pending = projecttask.filter(t => t.status !== "Completed" )
                return pending.length
              })()}</h2>
              <p>Pending Tasks</p>
              <span className={styles.statHint}>{(()=>{
                const highprioritytask = tasks.filter(t => t?.projectId === project._id  && t?.priority === "High")
                return highprioritytask.length
              })()} high priority</span>
            </div>
          </div>

          {/* Bottom */}
          <div className={styles.bottomGrid}>
            <div className={styles.activityCard}>
              <h3>Recent Activity</h3>
              <div className={styles.activityList}>
                {project?.recentActivity?.map((p,index)=>(
                  <div key={index} className={styles.activityItem}>
                    <span className={styles.activityDot}></span>
                    <div className={styles.activityContent}>
                      <p>
                        <b>{p?.user}</b> {p?.title}
                      </p>
                      <span className={styles.activityTask}>
                        {(()=>{
                          const task = tasks.find(t => t?._id ===p?.refs)
                          return task?.title
                        })()}
                      </span>
                    </div>
                    <small className={styles.activityTime}>{timeAgo(p?.time)}</small>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.statusCard}>
              <h3>Task Status</h3>
              <div className={styles.doughnutWrapper}>
                <TaskStatusDonut
                  completed={completedCount}
                  inProgress={inProgressCount}
                  todo={todoCount}
                />
              </div>

              <div className={styles.legend}>
                <div className={styles.legendItem}>
                  <span className={styles.legendDot} style={{background: "#10B981"}}></span>
                  <span>Completed</span>
                </div>
                <div className={styles.legendItem}>
                  <span className={styles.legendDot} style={{background: "#6D5BD0"}}></span>
                  <span>In Progress</span>
                </div>
                <div className={styles.legendItem}>
                  <span className={styles.legendDot} style={{background: "#CBD5E1"}}></span>
                  <span>To Do</span>
                </div>
              </div>
            </div>
          </div>
        </>
      ):tabs=== "tasks" ? (
        <div className={styles.tasksSection}>
          <div className={styles.taskFilters}>
            {["All", "To Do", "In Progress","Pending", "Completed"].map(tab => (
              <button
                key={tab}
                className={`${styles.filterTab} ${
                  filter === tab ? styles.activeFilter : ""
                }`}
                onClick={() => setFilter(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className={styles.taskTable}>
            <div className={styles.tableHeader}>
              <div className={styles.colTitle}>Title</div>
              <div className={styles.colStatus}>Status</div>
              <div className={styles.colPriority}>Priority</div>
              <div className={styles.colAssignee}>Assignee</div>
              <div className={styles.colDue}>Due date</div>
              <div className={styles.colProgress}>Progress</div>
            </div>

            <div className={styles.tableBody}>
              {filteredTasks.map(task => (
                <div key={task._id} className={styles.tableRow}>
                  <div className={styles.colTitle}>
                    <input 
                      type="checkbox" 
                      checked={task.status === "Completed"}
                      readOnly
                      className={styles.checkbox}
                    />
                    <span className={task.status === "Completed" ? styles.completedText : ""}>
                      {task?.title}
                    </span>
                  </div>
                  
                  <div className={styles.colStatus}>
                    <span className={`${styles.statusBadgeTable} ${styles[task?.status.replace(" ", "")]}`}>
                      {task?.status}
                    </span>
                  </div>
                  
                  <div className={styles.colPriority}>
                    <span className={`${styles.priorityBadge} ${styles[task.priority]}`}>
                      {task?.priority}
                    </span>
                  </div>
                  
                  <div className={styles.colAssignee}>
                    {(()=>{
                      const user = alluser.find(u => u._id === task.assignedto)
                      return user?.name || "Unassigned"
                    })()}
                  </div>
                  
                  <div className={styles.colDue}>
                    {new Date(task?.dueAt).toLocaleDateString("en-US",{
                      day:"numeric",
                      month:"short",
                      year:"numeric"
                    })}
                  </div>
                  
                  <div className={styles.colProgress}>
                    {task.progress || 0} / 4
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
                <div className={styles.fileIcon}>
                  {getFileIcon(meta.type)}
                </div>

                <div className={styles.fileInfo}>
                  <p className={styles.fileName}>{meta.name}</p>
                  <span className={styles.fileMeta}>2.4 MB • Oct 10, 2024</span>
                </div>

                <div className={styles.fileUploader}>
                  <div className={styles.uploaderAvatar}>JD</div>
                  <span>Uploaded by Jane Doe</span>
                </div>
              </a>
            );
          })}

          {/* Upload Card */}
          <div className={`${styles.fileCard} ${styles.uploadCard}`}>
            <div className={styles.uploadIcon}>⬇</div>
            <p>Upload File</p>
            <span>or drag & drop</span>
          </div>
        </div>
      ):(
        <div className={styles.milestonesSection}>
          <div className={styles.timeline}>
            {project?.milestones && project.milestones.length > 0 ? (
              project.milestones.map((milestone, index) => {
                // Determine milestone status and icon
                const today = new Date();
                const milestoneDate = new Date(milestone.dueDate);
                let statusClass = styles.upcoming;
                let statusText = "Upcoming";
                let iconContent = "📋";

                if (milestone.status === "Completed") {
                  statusClass = styles.completed;
                  statusText = "Completed";
                  iconContent = "✓";
                } else if (milestone.status === "In Progress") {
                  statusClass = styles.inProgress;
                  statusText = "In Progress";
                  iconContent = <Clock size={20} />;
                } else if (milestoneDate < today) {
                  statusClass = styles.overdue;
                  statusText = "Overdue";
                  iconContent = "⚠";
                }

                return (
                  <div key={index} className={styles.milestoneItem}>
                    <div className={`${styles.milestoneIcon} ${statusClass}`}>
                      {typeof iconContent === 'string' ? (
                        <span>{iconContent}</span>
                      ) : (
                        iconContent
                      )}
                    </div>
                    <div className={styles.milestoneContent}>
                      <div className={styles.milestoneHeader}>
                        <h4>{milestone.title}</h4>
                        <span className={styles.milestoneDate}>
                          📅 {new Date(milestone.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                      <p>{milestone.description}</p>
                      <span className={`${styles.milestoneStatus} ${
                        milestone.status === "Completed" ? styles.completedStatus :
                        milestone.status === "In Progress" ? styles.inProgressStatus :
                        milestoneDate < today ? styles.overdueStatus :
                        styles.upcomingStatus
                      }`}>
                        ● {statusText}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              // Default milestones if none exist
              <>
                <div className={styles.milestoneItem}>
                  <div className={`${styles.milestoneIcon} ${styles.completed}`}>
                    <span>✓</span>
                  </div>
                  <div className={styles.milestoneContent}>
                    <div className={styles.milestoneHeader}>
                      <h4>Project Kickoff</h4>
                      <span className={styles.milestoneDate}>
                        📅 {new Date(project?.timeline?.startDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </span>
                    </div>
                    <p>Initial meeting with stakeholders to define scope and requirements.</p>
                    <span className={`${styles.milestoneStatus} ${styles.completedStatus}`}>
                      ● Completed
                    </span>
                  </div>
                </div>

                <div className={styles.milestoneItem}>
                  <div className={`${styles.milestoneIcon} ${styles.inProgress}`}>
                    <Clock size={20} />
                  </div>
                  <div className={styles.milestoneContent}>
                    <div className={styles.milestoneHeader}>
                      <h4>Development Phase</h4>
                      <span className={styles.milestoneDate}>📅 In Progress</span>
                    </div>
                    <p>Active development and implementation of project deliverables.</p>
                    <span className={`${styles.milestoneStatus} ${styles.inProgressStatus}`}>
                      ● In Progress
                    </span>
                  </div>
                </div>

                <div className={styles.milestoneItem}>
                  <div className={`${styles.milestoneIcon} ${styles.upcoming}`}>
                    <span>🚀</span>
                  </div>
                  <div className={styles.milestoneContent}>
                    <div className={styles.milestoneHeader}>
                      <h4>Project Launch</h4>
                      <span className={styles.milestoneDate}>
                        📅 {new Date(project?.timeline?.endDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </span>
                    </div>
                    <p>Official project launch and delivery to stakeholders.</p>
                    <span className={`${styles.milestoneStatus} ${styles.upcomingStatus}`}>
                      ● Upcoming
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
     
      {/* Create Task Modal */}
      {modal && (
        <Createtask
          modal={modal}
          setModal={setModal}
          user={user}
          projects={projects}
        />
      )}

    </div>
  );
}