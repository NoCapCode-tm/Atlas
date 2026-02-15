import React, { useEffect, useState } from "react";
import styles from "../CSS/EmployeeDashboard.module.css";
import {
  Bell,
  Search,
  ListTodo,
  LoaderCircle,
  ClipboardClock,
  Clock3,
  Calendar,
  Send,
  Pause,
  Play,
  ChevronDown,
} from "lucide-react";
import dayjs from "dayjs";

import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import axios from "axios";
import {toast} from "react-toastify";
import { useNavigate } from "react-router";
import { useMemo } from "react";
import DailyReportModal from "./DailyReportModal";
import ECreatetaskmodal from "./EmployeeSubTask";
import Createtask from "./CreateTask";


export default function EmployeeDashboard() {
  const[user,setUser] = useState("")
  const[tasks,setTasks]=useState([])
  const navigate = useNavigate()
  const[projects,setProjects]=useState([])
  const[announcements,setAnnouncements]=useState([])
  const[reports,setReports]=useState([])
  const[attendance,setAttendance]=useState([])
  const [timerStatus, setTimerStatus] = useState("PUNCH_OUT");
  const [overlay, setOverlay] = useState(false);
  const[modaltasks,setModaltasks] = useState([])
  const[noncompleted,setNoncompleted]=useState([])
  const[taskmodal,setTaskmodal] = useState(false)
  const[subtask,setSubtask]=useState([])
  const[task,setTask]=useState(false)
  
// PUNCH_IN | BREAK | PUNCH_OUT

const [seconds, setSeconds] = useState(0);
const timerRef = React.useRef(null);
const [showDropdown, setShowDropdown] = useState(false);

const [pageLoading, setPageLoading] = useState(true);


//page loading
useEffect(() => {
  if (
    user &&
    tasks.length >= 0 &&
    projects.length >= 0 &&
    attendance &&
    reports &&
    announcements &&
    Array.isArray(subtask)
  ) {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 600); 

    return () => clearTimeout(timer);
  }
}, [user, tasks, projects, attendance, reports,subtask]);

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
        attendanceRes,
        reportRes,
        announceres,
        subtaskRes
      ] = await Promise.all([
        axios.get("https://atlasbackend-px53.onrender.com/api/v1/admin/getuser", { withCredentials: true }),
        axios.get("https://atlasbackend-px53.onrender.com/api/v1/admin/getalltask"),
        axios.get("https://atlasbackend-px53.onrender.com/api/v1/admin/getallproject"),
        axios.get("https://atlasbackend-px53.onrender.com/api/v1/admin/getattendance"),
        axios.get("https://atlasbackend-px53.onrender.com/api/v1/admin/getreports"),
        axios.get("https://atlasbackend-px53.onrender.com/api/v1/admin/getannouncements"),
        axios.get("https://atlasbackend-px53.onrender.com/api/v1/employee/getsubtask")
      ]);

      if (!mounted) return;

      setUser(userRes.data.message);
      setTasks(taskRes.data.message);
      setProjects(projectRes.data.message);
        setSubtask(subtaskRes.data.message)

      const userId = userRes.data.message._id;

      setAttendance(
        attendanceRes.data.message.filter(a => String(a.user) === String(userId))
      );

      setReports(
        reportRes.data.message.filter(r => String(r.user) === String(userId))
      );
      setAnnouncements(announceres.data.message?.filter(a =>
        Array.isArray(a.channels) &&
        a.channels.includes("Dashboard Banner") &&
        Array.isArray(a?.audience?.includeUsers) &&
        a.audience.includeUsers.includes(userId)
      ));

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


//attendance system

useEffect(() => {
  const status = localStorage.getItem("prism_timer_status");
  const start = localStorage.getItem("prism_timer_start");

  if (status === "PUNCH_IN" && start) {
    setTimerStatus("PUNCH_IN");

    timerRef.current = setInterval(() => {
      setSeconds(Math.floor((Date.now() - Number(start)) / 1000));
    }, 1000);
  } 
  else if (status === "BREAK") {
    setTimerStatus("BREAK");
    setSeconds(0); // ya last saved value agar chaho
  } 
  else {
    setTimerStatus("PUNCH_OUT");
    setSeconds(0);
  }
}, []);


const punchIn = async () => {
  if (timerStatus === "PUNCH_IN") return;

  await axios.post(
    "https://atlasbackend-px53.onrender.com/api/v1/employee/start-attendance",
    { userId: user._id },
    { withCredentials: true }
  );

  const startTime = Date.now();
  localStorage.setItem("prism_timer_status", "PUNCH_IN");
  localStorage.setItem("prism_timer_start", startTime);

  setTimerStatus("PUNCH_IN");

  timerRef.current = setInterval(() => {
    setSeconds(Math.floor((Date.now() - startTime) / 1000));
  }, 1000);
  window.location.reload()
};


const takeBreak = async () => {
  if (timerStatus !== "PUNCH_IN") return;

  clearInterval(timerRef.current);
  timerRef.current = null;

  const startTime = Number(localStorage.getItem("prism_timer_start"));
  const workedSeconds = Math.floor((Date.now() - startTime) / 1000);

  await axios.post(
    "https://atlasbackend-px53.onrender.com/api/v1/employee/save-time",
    { userId: user._id, seconds: workedSeconds },
    { withCredentials: true }
  );
  localStorage.setItem("prism_timer_status", "BREAK");
  localStorage.removeItem("prism_timer_start");
  setTimerStatus(localStorage.getItem("prism_timer_status"));
   window.location.reload()
};


const punchOut = async () => {
  try {
    let workedSeconds = 0;

    const start = localStorage.getItem("prism_timer_start");
    const status = localStorage.getItem("prism_timer_status");

    // agar timer chal raha tha
    if (status === "PUNCH_IN" && start) {
      workedSeconds = Math.floor(
        (Date.now() - Number(start)) / 1000
      );
    }

    await axios.post(
      "https://atlasbackend-px53.onrender.com/api/v1/employee/punchout",
      {
        userId: user._id,
        seconds: workedSeconds || 0,
      },
      { withCredentials: true }
    );

    clearInterval(timerRef.current);
    timerRef.current = null;

    localStorage.removeItem("prism_timer_status");
    localStorage.removeItem("prism_timer_start");

    setSeconds(0);
    setTimerStatus("PUNCH_OUT");
    setShowDropdown(false);

    toast.success("Punched out successfully");

  } catch (err) {
    toast.error("Punch out failed");
  }
};




const formatTimer = (secs) => {
  const h = String(Math.floor(secs / 3600)).padStart(2, "0");
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
};




//stats for card
const handletaskstats = () =>{
  const totaltask = tasks.filter(t => t.assignedto === user._id)

  const completedtask = totaltask.filter(t => t.status === "Completed")
  const pendingtask = totaltask.filter(t => t.status === "Pending")
  const inprogress = totaltask.filter(t=>t.status === "In Progress")
 
  return ({totaltask,completedtask,pendingtask,inprogress})
}
const {
  totaltask,
  completedtask,
  pendingtask,
  inprogress
} = handletaskstats();

//getting todays tasks
const getLocalDate = (date) =>
  new Date(date).toLocaleDateString("en-CA"); // YYYY-MM-DD

const today = getLocalDate(new Date());

const todayTasks = totaltask.filter(
  t => t.dueAt && getLocalDate(t.dueAt) === today
);



//productivity trend
const getLocalDateKey = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};


const getLast7Days = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);

    days.push({
      key: getLocalDateKey(d),
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
      count: 0
    });
  }
  return days;
};


const getProductivityData = (tasks, userId) => {
  if (!tasks || !userId) return [];

  const last7Days = getLast7Days();

  const completedTasks = tasks.filter(
    t => t.assignedto === userId && t.status === "Completed"
  );

  completedTasks.forEach(task => {
    if (!task.completedAt) return;

    const completedDateKey = getLocalDateKey(task.completedAt);

    const day = last7Days.find(d => d.key === completedDateKey);
    if (day) day.count += 1;
  });

  return last7Days.map(d => ({
    day: d.label,
    value: d.count
  }));
};


const productivityData = useMemo(() => {
  return getProductivityData(tasks, user?._id);
}, [tasks, user]);

useEffect(() => {
  if (!user?._id) return;

  (async () => {
    const res = await axios.get("https://atlasbackend-px53.onrender.com/api/v1/admin/getattendance");
    setAttendance(
      res.data.message.filter(a => String(a.user) === String(user._id))
    );
  })();
}, [user]);

useEffect(() => {
  if (!user?._id) return;

  (async () => {
    const res = await axios.get("https://atlasbackend-px53.onrender.com/api/v1/admin/getreports");
    setReports(
      res.data.message.filter(r => String(r.user) === String(user._id))
    );
  })();
}, [user]);

useEffect(() => {
  return () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };
}, []);

//heatmap

const getLocalDateKey1 = (date) => {
  const d = new Date(date);
  return new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate()
  ).toISOString().slice(0, 10);
};


const getCurrentMonthDays = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const todayKey = getLocalDateKey1(now);

  const totalDays = new Date(year, month + 1, 0).getDate();

  return Array.from({ length: totalDays }, (_, i) => {
    const d = new Date(year, month, i + 1);
    const dateKey = getLocalDateKey1(d);

    return {
      dateKey,
      isFuture: dateKey > todayKey,
      level: null
    };
  });
};


const buildHeatmapData = ({ attendance, reports, tasks, userId }) => {
  const days = getCurrentMonthDays();

  days.forEach(day => {
    if (day.isFuture) {
      day.level = null;
      return;
    }

    const hasAttendance = attendance.some(
      a => a.date && getLocalDateKey1(a.date) === day.dateKey
    );

    if (!hasAttendance) {
      day.level = 0;
      return;
    }

    const hasReport = reports.some(
      r => r.createdAt && getLocalDateKey1(r.createdAt) === day.dateKey
    );

    if (!hasReport) {
      day.level = 0;
      return;
    }

    const dailyTasks = tasks.filter(
      t =>
        String(t.assignedto) === String(userId) &&
        t.dueAt &&
        getLocalDateKey1(t.dueAt) === day.dateKey
    );
    const employeecompleted = totaltask.filter(t => t.completedAt && getLocalDateKey1(t.completedAt) === day.dateKey);

    if (!dailyTasks.length && employeecompleted.length >0) {
      day.level = 2;
      return;
    }else if(!dailyTasks.length && employeecompleted.length>=0){
      day.level = 1;
      return;
    }

    const completed = dailyTasks.filter(t => t.status === "Completed").length;
    const ratio = completed / dailyTasks.length;

    day.level = ratio === 1 ? 2 : 1;
  });

 return days.map(d => ({
  level: d.level,
  dateKey: d.dateKey
}));

};





const heatmapData = useMemo(() => {
  if (!user?._id) return [];
  return buildHeatmapData({
    attendance,
    reports,
    tasks,
    userId: user._id
  });
}, [attendance, reports, tasks, user]);

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};
const getReportByDate = (dateKey) => {
  return reports.find(r => {
    if (!r.createdAt) return false;

    const reportDateKey = getLocalDateKey1(r.createdAt);
    return reportDateKey === dateKey;
  });
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
    {/* HEADER */}
<div className={styles.topHeader}>
  <div className={styles.leftHeader}>
    <div className={styles.avatarWrap}>
      <img
        src={user?.profilepicture||"https://i.pravatar.cc/60?img=9"}
        alt=""
        height="100%"
        width="100%"
        className={styles.avatar}
      />
    </div>

    <div className={styles.userText}>
      <h2>{getGreeting()}, {user?.name?.split(" ")[0]}!</h2>
      <div className={styles.userMeta}>
        <div
  className={`${styles.statususer} ${
    timerStatus === "PUNCH_IN"
      ? styles.PUNCH_IN
      : timerStatus === "BREAK"
      ? styles.BREAK
      : styles.PUNCH_OUT
  }`}
>
        <span className={timerStatus === "PUNCH_IN" ?styles.onlineDot : timerStatus === "BREAK" ? styles.breakDot:styles.endDot}></span>
        <span>{timerStatus === "PUNCH_IN" ?"Online": timerStatus === "BREAK" ? "Break":"Offline"}</span>
        </div>
        <span className={styles.sep}>•</span>
        <span>{user?.role || "No Role"}</span>
        <span className={styles.sep}>•</span>
        <span>{user?.designation?.name}</span>
      </div>
    </div>
  </div>

  <div className={styles.rightHeader}>
    <div className={styles.timerBox}>
  <button
    className={styles.playPauseBtn}
    
  >
    {timerStatus === "PUNCH_IN" ? (
      <Pause />
    ) : (
      <Play />
    )}
  </button>

  <div>
    <p className={styles.timerLabel}>
      {timerStatus === "PUNCH_IN"
        ? "WORKING"
        : timerStatus === "BREAK"
        ? "ON BREAK"
        : "PUNCH OUT"}
    </p>
    <b className={styles.timerValue}>{formatTimer(seconds)}</b>
  </div>

  <ChevronDown onClick={() => setShowDropdown(!showDropdown)} />
</div>

{showDropdown && (
  <div className={styles.timerDropdown}>
    <button onClick={punchIn}>▶ Punch In</button>
    <button onClick={takeBreak}>⏸ Break</button>
    <button onClick={punchOut}>⏹ Punch Out</button>
  </div>
)}



    {/* <div className={styles.searchBox}>
      <Search size={16} />
      <input placeholder="Search tasks, docs..." />
    </div> */}

    {/* <div className={styles.bell}>
      <Bell size={18} />
      <span className={styles.dot}></span>
    </div> */}
  </div>
</div>

{/* STATS */}
<div className={styles.statsRow}>
  <div className={`${styles.statCard}`} onClick={()=>{navigate("/employees/tasks")}}>
    <div className={styles.headnumber}>
      <p>Tasks Assigned</p>
      <h2>{totaltask?.length || 0}</h2>
    </div>
    <span className={styles.icon}><ListTodo color="rgba(21, 93, 252, 1)"/></span>
  </div>

  <div className={styles.statCard1} onClick={()=>{navigate("/employees/tasks")}}>
    <div className={styles.headnumber}>
    <p>In Progress</p>
    <h2>{inprogress?.length || 0}</h2>
    </div>
    <span className={styles.icon1}><LoaderCircle color ="rgba(104, 78, 185, 1)"/></span>
  </div>

  <div className={styles.statCard2} onClick={()=>{navigate("/employees/tasks")}}>
    <div className={styles.headnumber}>
    <p>Pending Review</p>
    <h2>{pendingtask?.length || 0}</h2>
    </div>
    <span className={styles.icon2}><ClipboardClock color="rgba(225, 113, 0, 1)"/></span>
  </div>

  <div className={styles.statCard3} onClick={()=>{navigate("/employees/tasks")}}>
    <div className={styles.headnumber}>
    <p>Completed</p>
    <h2>{completedtask?.length || 0}</h2>
    </div>
    <span className={styles.icon3}><Clock3 color="rgba(0, 153, 102, 1)"/></span>
  </div>
</div>



      {/* MAIN CONTENT */}
      <div className={styles.dashboardMain}>
  {/* LEFT COLUMN */}
  <div className={styles.mainLeft}>
    {/* TODAY TASKS */}
    <div className={`${styles.tasksCard} ${styles.hoverCard}`}>
      <div className={styles.cardHeader}>
        <h3><Calendar color="rgba(104, 78, 185, 1)" size={20}/>Today's Tasks</h3>
        <span>•••</span>
      </div>
     {todayTasks.map(task => (
  <TaskRow
    key={task._id}
    task={{
      ...task,
      project: projects.find(p => p._id === task.projectId)
    }}
  />
))}

      <button className={styles.addTaskBtn} onClick={()=>{setTask(true)}}>+ Add New Task</button>
    </div>

    {/* BOTTOM ROW */}
    <div className={styles.bottomRow}>
      <div className={`${styles.productivityCard} ${styles.hoverCard}`}>
        <div className={styles.cardHeader}>
          <h3>Productivity Trend</h3>
          <span className={styles.greenTag}></span>
        </div>
        <ProductivityChart data={productivityData}/>

        {/* <div className={styles.chartDays}>
          {["Tue","Wed","Thu","Fri","Sat","Sun"].map(d=>(
            <span key={d}>{d}</span>
          ))}
        </div> */}
      </div>

      <div className={`${styles.snapshotCard} ${styles.hoverCard}`}>
        <div className={styles.cardHeader}>
          <h3>Activity Snapshot</h3>
        </div>
       <ActivityHeatmap
  heatmapData={heatmapData}
  reports={reports}
/>


        <div className={styles.legend}>
          <div className ={styles.restdiv}>
            <span className={styles.grey}></span>Rest</div>
          <div className ={styles.restdiv}>
            <span className={styles.green}></span>Good</div>
          <div className ={styles.restdiv}>
            <span className={styles.darkgreen}></span>Great</div>
        </div>
      </div>
    </div>
    {/* RECENT ACTIVITY */}
<div className={`${styles.recentActivityCard} ${styles.hoverCard}`}>
  <div className={styles.cardHeader}>
    <h3>Recent Activity</h3>
  </div>

  <ul className={styles.activityList}>
    {user?.recentActivity?.map((r,index)=>{

      const taskcompleted= tasks.find(t => t._id === r?.refs)
      return (
          <li key={index}>
      <span className={styles.activityDot}></span>
      <span className={styles.activityText}>
        <b>{r?.name}</b> - {taskcompleted?.title}
      </span>
      <span className={styles.activityTime}>{new Date(r?.time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true
      })}
</span>
    </li>

      )
    })}
   
  </ul>
</div>

  </div>

  {/* RIGHT COLUMN */}
  <div className={styles.mainRight}>
    {/* DAILY REPORT */}
    <div className={`${styles.reportCard} ${styles.hoverCard}`}>
      <span className={styles.reportIcon}><Send/></span>
      <h3>Daily Report</h3>
      <p>Please submit your end-of-day report before 6 PM.</p>
      <button
  onClick={() => {
    const todayTasks = totaltask.filter(
      t => t.dueAt && getLocalDate(t.dueAt) === today
    );

    setModaltasks(
      todayTasks.map(task => ({
        id: task._id,
        text: task.title || task.name,
        done: task.status === "Completed"
      }))
    );
    const alltasks = totaltask.filter( t => t?.status !== "Completed")
    setNoncompleted(alltasks)

    setOverlay(true);
  }}
>
  Submit Report
</button>

      <span className={styles.reportMeta}>
        Last sent: Yesterday, 5:45 PM
      </span>
    </div>

    {/* NOTIFICATIONS */}
    <div className={`${styles.infoCard} ${styles.hoverCard}`}>
      <h3>Notifications</h3>
      <NotifRow title="Task Due Soon" sub="Marketing Campaign" />
      <NotifRow title="Onboarding Pending" sub="Complete the Security" />
      <NotifRow title="New Request" sub="Design access" />
    </div>

    {/* ANNOUNCEMENTS */}
    <div className={`${styles.infoCard1} ${styles.hoverCard}`}>
      <h3>Announcements</h3>
      <div className={styles.allannouncements}>
      {announcements?.map((a,index)=>(
        <Announcement
        name={a?.scheduledby}
        text={a?.details}
        createdon={a.createdon}
        key={index}
      />

      ))}
      </div>
      
      <button className={styles.viewAll} onClick={()=>{navigate("/employee/announcement")}}>View all announcements</button>
    </div>
  </div>
</div>

    </div>

    <DailyReportModal
  open={overlay}
  onClose={() => setOverlay(false)}
  user={user}
  tasks={modaltasks}
  allTasks={noncompleted}
  allTasksSubtasks={subtask}
/>

{/* {taskmodal && <ECreatetaskmodal modal={taskmodal} setModal={setTaskmodal} tasks={totaltask} />} */}
{task && <Createtask modal={task}  setModal={setTask} user={user} projects={projects}/>}



    </>
  );
}


function ActivityHeatmap({ heatmapData, reports }) {
  const [hoverReport, setHoverReport] = useState(null);

  const getLocalDateKey1 = (date) => {
  const d = new Date(date);
  return new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate()
  ).toISOString().slice(0, 10);
};

const getReportByDate = (dateKey) => {
  return reports.find(r => {
    if (!r.createdAt) return false;
    return getLocalDateKey1(r.createdAt) === dateKey;
  });
};


  return (
    <div className={styles.heatmapWrapper}>
      <div className={styles.heatmap}>
        {heatmapData.map((item, i) => {
          if (item.level === null) {
            return <span key={i} className={styles.future} />;
          }

          const report = getReportByDate(item.dateKey);

          return (
            <span
              key={i}
              className={
                item.level === 0
                  ? styles.rest
                  : item.level === 1
                  ? styles.good
                  : styles.great
              }
              onMouseEnter={() => {
                if (report) setHoverReport(report);
              }}
              onMouseLeave={() => setHoverReport(null)}
            />
          );
        })}
      </div>

      {/* 🔥 HOVER REPORT CARD */}
      {hoverReport && (
        <div className={styles.reportTooltip}>
          <h4>{hoverReport.title || "Daily Report"}</h4>
          <p>{hoverReport.summary}</p>
        </div>
      )}
    </div>
  );
}




function ProductivityChart({ data }) {
  return (
    <div className={styles.chartWrapper}>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9ca3af", fontSize: 12 }}
          />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="value"
            stroke="#7c3aed"
            strokeWidth={3}
            fill="url(#purpleGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}





function TaskRow({ task }) {
  const [checked, setChecked] = useState(task.status === "Completed");

  const handleComplete = async () => {
    if (checked) return;

    try {
      await axios.post(
        "https://atlasbackend-px53.onrender.com/api/v1/employee/completedtask",
        { taskid: task._id },
        { withCredentials: true }
      );

      setChecked(true);
      toast.success("Task marked as completed");
      window.location.reload()
    } catch (err) {
      toast.error("Failed to complete task");
    }
  };

  return (
    <div className={styles.taskRow}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleComplete}
        disabled={checked}
      />

      <div className={styles.taskInfo}>
        <p
          style={{
            textDecoration: checked ? "line-through" : "none",
            opacity: checked ? 0.6 : 1
          }}
        >
          {task.title}
        </p>

        <span>
          {task.project?.projectname || "Project"} •{" "}
          {new Date(task.dueAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })}
        </span>
      </div>

      <span className={`${styles.tag} ${styles[task.priority.toLowerCase()]}`}>
        {task.priority}
      </span>
    </div>
  );
}

function NotifRow({ title, sub }) {
  return (
    <div className={styles.notifRow}>
      <div className={styles.notifDot}></div>
      <div>
        <p>{title}</p>
        <span>{sub}</span>
      </div>
      <small>30m ago</small>
    </div>
  );
}

function Announcement({ createdon ,name , text }) {

  const[sender,setSender]=useState()
  useEffect(() => {
    const fetchemployees = async () => {
      try {
        const response = await axios.get(
          `https://atlasbackend-px53.onrender.com/api/v1/admin/getalluser`,
          {withCredentials:true}
        );
        const emp = response.data.message?.find(e => e?.name === name)
        setSender(emp)
        
      } catch (error) {
        console.log("Error fetching employees:", error.message);
      }
    };

    fetchemployees();
  }, []);

 const timeAgo = (createdon) => {
  if (!createdon) return "";

  const diffMs = Date.now() - new Date(createdon).getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours   = Math.floor(diffMs / (1000 * 60 * 60));
  const days    = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24)   return `${hours} hr ago`;
  return `${days} day${days > 1 ? "s" : ""} ago`;
};



  return (
    <div className={styles.announceRow}>
      <div className={styles.avatarMini}>
        <img src = {sender?.profilepicture || ""} alt="/" height="100%" width="100%"/>
      </div>
      <div>
        <p>{name} . {sender?.designation?.name}</p>
        <span>{text}</span>
        <span>{timeAgo(createdon)}</span>

      </div>
    </div>
  );
}