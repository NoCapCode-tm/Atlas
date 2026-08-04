import { API_URL } from "../../config";
import React, { useEffect, useState, useMemo } from 'react'
import styles from '../CSS/admindashboard.module.css'
import {
  UserPlus, Plus, Users, DollarSign,
  GraduationCap, FolderKanban,
  TriangleAlert, X, ChevronUp, ChevronDown,
  MoreVertical,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { Tag } from "primereact/tag";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import Createtaskmodal from './Createtaskmodal';
import { InfoTooltip } from './InfoTooltip';


// const toISTDateKey = (date) =>
//   new Date(date).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

// const getYesterdayISTKey = () => {
//   const d = new Date(
//     new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
//   );
//   d.setDate(d.getDate() - 1);
//   return toISTDateKey(d);
// };

// const getLast7DaysIST = () => {
//   const days = [];
//   const today = new Date(
//     new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
//   );
//   today.setHours(0, 0, 0, 0);

//   for (let i = 6; i >= 0; i--) {
//     const d = new Date(today);
//     d.setDate(today.getDate() - i);
//     days.push({
//       key: toISTDateKey(d),
//       label: d.toLocaleDateString("en-US", {
//         weekday: "short",
//         timeZone: "Asia/Kolkata"
//       })
//     });
//   }
//   return days;
// };

function Admindashboard() {
  const navigate = useNavigate();

  const [overlay, setoverlay] = useState(false);
  const [taskmodal, setTaskmodal] = useState(false);
  const [projects, setprojects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [redflags, setredflags] = useState([]);
  const [dob, setDob] = useState("");
   const [gender, setGender] = useState("");
   const [firstName, setFirstName] = useState("");
const [lastName, setLastName] = useState("");

const fullName = `${firstName} ${lastName}`.trim();

  const [data, setData] = useState([]);
  const [activegraph, setActivegraph] = useState("daily");
  const[email,setEmail]=useState("") 
  const[password,setPassword]=useState("")
  const [currentPage, setCurrentPage] = useState(1);
  const[loading,setLoading]=useState(false)
  const [sortOrder, setSortOrder] = useState("desc");
  const[user,setUser]=useState("")
  const[role,setRole]=useState("")
  const[tasks,setTasks]=useState([])
  const[attendance,setAttendance]=useState([])
  const[reports,setReports]=useState([])
  const itemsPerPage = 5;
  
useEffect(() => {
  const fetchData = async () => {
    try {
      const [
        employeesRes,
        userRes,
        taskRes,
        attRes,
        repRes,
        projectsRes,
        metricsRes,
        redflagsRes,
    ] = await Promise.all([
        axios.get(`${API_URL}/admin/getalluser`, {
          withCredentials: true,
        }),
        axios.get(`${API_URL}/admin/getuser`, {
          withCredentials: true,
        }),
        axios.get(`${API_URL}/admin/getalltask`, {
          withCredentials: true,
        }),
        axios.get(`${API_URL}admin/getattendance`, {
          withCredentials: true,
        }),
        axios.get(`${API_URL}admin/getreports`, {
          withCredentials: true,
        }),
        axios.get(`${API_URL}admin/getallproject`),
        axios.get(`${API_URL}admin/getmetrics`),
        axios.get(`${API_URL}admin/getredflags`),
      ]);

      setEmployees(employeesRes.data.message || []);
      setUser(userRes.data.message || {});
      setTasks(taskRes.data.message || {});
      setAttendance(attRes.data.message || {});
      setReports(repRes.data.message || {});
      setprojects(projectsRes.data.message || []);
      setMetrics(metricsRes.data.message || []);
      setredflags(redflagsRes.data.message || []);

      console.log("User:", userRes.data.message);
      console.log("Metrics:", metricsRes.data.message);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  fetchData();
}, []);

        const handletasks = () =>{ 
          const au = tasks?.filter((t)=>t.status === "Completed") 
          return au?.length
         }

         const handleaddu = async () => {
  try {
    console.log({
      name: fullName,
      email: email,
      password: password,
      gender,
      dob: dob,
    });

    setLoading(true);

    const response = await axios.post(
      `${API_URL}admin/addemployee`,
      {
        name: fullName,
        email: email,
        password: password,
        dob,
        gender,

      },
      { withCredentials: true }
    );

    console.log(response);
    toast.success("Employees Added Successfully");
    setoverlay(false);
    window.location.reload();

  } catch (error) {
    console.log("Sometthing went wrong", error.message);
    toast.error("Something Went Wrong");

  } finally {
    setLoading(false);
  }
};

//project section logic

const projectStats = useMemo(() => {
  const today = new Date();

  let pending = 0;
  let inProgress = 0;
  let overdue = 0;
  let completed = 0;

  projects.forEach((project) => {
    // Completed has highest priority
    if (project?.progress?.status === "completed") {
      completed++;
      return;
    }

    const startDate = new Date(project?.timeline?.startDate);
    const endDate = new Date(project?.timeline?.endDate);

    if (today < startDate) {
      pending++;
    } else if (today >= startDate && today <= endDate) {
      inProgress++;
    } else if (today > endDate) {
      overdue++;
    }
  });

  return {
    pending,
    inProgress,
    overdue,
    completed,
  };
}, [projects]);

//red flags of previous day
const yesterdayRedFlags = useMemo(() => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const yesterdayString = yesterday.toLocaleDateString("en-CA"); // YYYY-MM-DD

  return redflags.filter((flag) => {
    const flagDateString = new Date(flag.createdAt || flag.date).toLocaleDateString("en-CA");

    return flagDateString === yesterdayString;
  });
}, [redflags]);

//attendance time

const workinghours = useMemo(()=>{
  const nowIST = new Date().toLocaleDateString("en-IN", {
  timeZone: "Asia/Kolkata",
});

  const workinghour = attendance.filter((a)=>new Date(a?.date).toLocaleDateString("en-IN", {
  timeZone: "Asia/Kolkata",
}) === nowIST)
  return workinghour
},[attendance])

//report submitted today

const todayreports = useMemo(()=>{
   const nowIST = new Date().toLocaleDateString("en-IN", {
  timeZone: "Asia/Kolkata",
});

 const todayreport = reports.filter((a)=>new Date(a?.date).toLocaleDateString("en-IN", {
  timeZone: "Asia/Kolkata",
}) === nowIST).length

const total = employees.filter((e)=>e?.designation?.name !=="Administrator").length
const percent = (todayreport/total)*100
const missing = total-todayreport

return{
  todayreport,
  percent,
  missing
}
})

const levels = [
  "veryLow",
  "low1",
  "moderate",
  "high1",
  "exceptional",
];

// const heatmap = [
//   [1,3,0,2,0,3,3,2,1,1,2,0,3,4,3,4,2,1,0,3,1,4,3],
//   [2,3,4,1,2,0,3,4,2,2,2,1,0,0,3,2,2,2,1,2,0,4,3],
//   [4,0,0,1,3,0,0,4,4,3,2,1,0,0,2,0,4,0,3,4,1,0,4],
//   [0,2,1,2,0,3,0,4,4,4,2,4,3,2,4,2,0,3,4,1,4,0,3],
//   [1,0,4,4,3,0,0,4,3,2,1,0,3,2,0,4,2,4,1,2,3,2,3],
//   [2,4,4,3,0,3,2,2,3,1,4,4,3,3,2,4,1,1,0,4,4,1,2],
//   [3,0,3,2,1,1,0,2,1,0,2,3,3,2,4,2,3,2,3,2,4,0,3],
// ];




const cards = [
  {
    title: "Completed",
    count: projectStats?.completed,
  },
  {
    title: "In Progress",
    count: projectStats?.inProgress,
  },
  {
    title: "Overdue",
    count: projectStats?.overdue,
  },
  {
    title: "Pending",
    count: projectStats?.pending,
  },
];
  const perPage = 6;

const totalPages = Math.ceil(employees.length / perPage);

  const paginatedEmployees = employees.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );


  //company report section 

 const chartData = useMemo(() => {
  if (!reports?.length) return [];

  // Sort reports oldest -> newest
  const sorted = [...reports].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // ================= DAILY =================

  if (activegraph === "daily") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyMap = {};

    // Last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);

      const key = d.toISOString().slice(0, 10);

      dailyMap[key] = {
        name: d.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        value: 0,
      };
    }

    sorted.forEach((report) => {
      const key = new Date(report.date)
        .toISOString()
        .slice(0, 10);

      if (dailyMap[key]) {
        dailyMap[key].value++;
      }
    });

    return Object.values(dailyMap);
  }

  // ================= WEEKLY =================

  if (activegraph === "weekly") {
    const weekly = {};

    sorted.forEach((report) => {
      const date = new Date(report.date);

      const firstDay = new Date(date.getFullYear(), 0, 1);

      const week = Math.ceil(
        (((date - firstDay) / 86400000) +
          firstDay.getDay() +
          1) /
          7
      );

      const key = `${date.getFullYear()}-${week}`;

      if (!weekly[key]) {
        weekly[key] = {
          name: `Week ${week}`,
          value: 0,
        };
      }

      weekly[key].value++;
    });

    return Object.values(weekly).slice(-8);
  }

  // ================= MONTHLY =================

  const monthly = {};

  sorted.forEach((report) => {
    const date = new Date(report.date);

    const key = `${date.getFullYear()}-${date.getMonth()}`;

    if (!monthly[key]) {
      monthly[key] = {
        name: date.toLocaleDateString("en-US", {
          month: "short",
        }),
        value: 0,
      };
    }

    monthly[key].value++;
  });

  return Object.values(monthly).slice(-12);

}, [reports, activegraph]);
//heatmap data

const metricsMap = useMemo(() => {
  const map = {};

  metrics.forEach(metric => {
    const key = new Date(metric.date).toISOString().slice(0, 10);

    map[key] = metric;
  });

  return map;
}, [metrics]);

const heatmap = useMemo(() => {
  const cells = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(today);
  start.setDate(start.getDate() - 364);

  // GitHub starts on Sunday
  start.setDate(start.getDate() - start.getDay());

  // Find maximum values for normalization
  const maxReports = Math.max(...metrics.map(m => m.reportsSubmitted), 1);
  const maxTasks = Math.max(...metrics.map(m => m.tasksCompleted), 1);
  const maxUsers = Math.max(...metrics.map(m => m.activeUsers), 1);

  const current = new Date(start);

  while (current <= today) {
    const key = current.toISOString().slice(0, 10);

    const metric = metricsMap[key];

    let level = "veryLow";

    if (metric) {
      const reportScore = metric.reportsSubmitted / maxReports;
      const taskScore = metric.tasksCompleted / maxTasks;
      const userScore = metric.activeUsers / maxUsers;

      // weighted performance score
      const score =
        reportScore * 0.4 +
        taskScore * 0.4 +
        userScore * 0.2;

      if (score < 0.2)
        level = "veryLow";
      else if (score < 0.4)
        level = "low1";
      else if (score < 0.6)
        level = "moderate";
      else if (score < 0.8)
        level = "high1";
      else
        level = "exceptional";
    }

    cells.push({
      date: new Date(current),
      metric,
      level,
    });

    current.setDate(current.getDate() + 1);
  }

  return cells;
}, [metrics, metricsMap]);








  
  return (
   <>
    <div className={styles.mainContainer}>
      <div className={styles.topcontainer}>
        <div className={styles.topleft}>
  <div className={styles.topleft1}>Dashboard</div>
  <div className={styles.topleft2}>
     Here's what's happening today.
  </div>
</div>
        <div className={styles.topright}>
          <div className={styles.topright1} onClick={()=>{setoverlay(true)}}>New Employee</div>
        </div>
      </div>
      <div className={styles.cards}>
        <div className={`${styles.card} ${styles.animateOnScroll}`}  data-animate style={{ "--delay": 0 }} onClick={()=>{navigate("/people/employees")}}>
          <div className={styles.cardleft} >
            <div className={styles.cardleft1}>Total Employees
              <InfoTooltip text="Total number of registered employees in the organization" />
            </div>
            <div className={styles.cardleft2}>{employees?.length}</div>
            {/* <div className={styles.cardleft3}>↑ 12% from last month</div> */}
          </div>
        </div>

        <div className={`${styles.card1} ${styles.animateOnScroll}`}  data-animate style={{ "--delay": 0 }} onClick={() =>
  navigate("/tasks")
}
>
          <div className={styles.cardleft}>
            <div className={styles.cardleft1}>Total Tasks
              <InfoTooltip text="Employees currently active and paid in the current cycle" />
            </div>
            <div className={styles.cardleft2}>{tasks?.length}</div>
            {/* <div className={styles.cardleft3}></div> */}
          </div>
          {/* <div className={styles.cardright}>
            <div className={styles.cardlogo2}><DollarSign /></div>
          </div> */}
        </div>
        <div className={`${styles.card2} ${styles.animateOnScroll}`}  data-animate style={{ "--delay": 0 }} onClick={() =>
  navigate("/tasks")
}
>
          <div className={styles.cardleft}>
            <div className={styles.cardleft1}>Completed Tasks
              <InfoTooltip text="Employees currently active but pending payment status" />
            </div>
            <div className={styles.cardleft2}>{handletasks()}</div>
            {/* <div className={styles.cardleft3}></div> */}
          </div>
          {/* <div className={styles.cardright}>
            <div className={styles.cardlogo3}> <GraduationCap /></div>
          </div> */}
        </div>
        <div className={`${styles.card3} ${styles.animateOnScroll}`}  data-animate  style={{ "--delay": 0 }} onClick={()=>{navigate("/projects")}}>
          <div className={styles.cardleft}>
            <div className={styles.cardleft1}>Total Projects
              <InfoTooltip text="Projects currently running with active tasks assigned" />
            </div>
            <div className={styles.cardleft2}>{projects?.length}</div>
            {/* <div className={styles.cardleft3}></div> */}
          </div>
          {/* <div className={styles.cardright}>
            <div className={styles.cardlogo1}><FolderKanban /></div>
          </div> */}
        </div>
      </div>
      <div className={styles.graphcontainer}>
        <div className={`${styles.graphleft} ${styles.animateOnScroll}`}  data-animate style={{ "--delay": 0 }}>
          <div className={styles.bothgraph}>
          <div className={styles.graphleft1}>Company Report
            <InfoTooltip text="Consolidated view of company-wide productivity and activity" />
          </div>
          <div className={styles.graphleft2}>
            <div className={styles.graphtoggle}>
              <div className={`${styles.leftweekly} ${activegraph === "daily" ? styles.active : ""}` } onClick={() => setActivegraph("daily")}>Daily</div>
              <div className={`${styles.leftweekly} ${activegraph === "weekly" ? styles.active : ""}`} onClick={() => setActivegraph("weekly")}>Weekly</div>
              <div className={`${styles.leftweekly} ${activegraph === "monthly" ? styles.active : ""}`} onClick={() => setActivegraph("monthly")}>Monthly</div>
            </div>
          </div>
          </div>
          <div className={styles.graphleft3}>
            <div className={styles.gandmekeeda}>
              <ResponsiveContainer>
                <AreaChart data={chartData}>

                  {/* Gradient Fill */}
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="20%" stopColor="#2035FF" stopOpacity={1} />
                      <stop offset="100%" stopColor="#6D78FF33" stopOpacity={9} />
                    </linearGradient>
                  </defs>

                  {/* Light dotted grid */}
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#6D78FF33" />

                  {/* Bottom labels */}
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6D78FF33" }}
                  />

                  <Tooltip
                                  contentStyle={{
                                    background: "#17181d",
                                    border: "1px solid #2f3138",
                                    color: "#fff",
                                    borderRadius: 10,
                                  }}
                                />

                  {/* Smooth Purple Area */}
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#2035FF"
                    // strokeWidth={3}
                    fill="url(#colorValue)"
                  />

                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
        <div className={`${styles.graphright} ${styles.animateOnScroll}`}  data-animate  style={{ "--delay": 0 }}>
          <div className={styles.graphrighttop}>Project Status Overview
          <InfoTooltip text="Employees with missed reports, prolonged inactivity, or overdue tasks" /></div>
          <div className={styles.newproject}>
            <h1>{projects.length}</h1>
            <h2>Projects Active</h2>
            <div className={styles.container}>
      {cards.map((card, index) => (
        <div className={styles.cardpr} key={index}>
          <span className={styles.text}>
            {card.title} - {card.count}
          </span>
        </div>
      ))}
    </div>

          </div>
        </div>
      </div>


      {/* Red flag row */}

      <div className={styles.dashboardRow}>
  <div className={styles.cardred}>
    <div className={styles.cardHeader}>Users Active</div>

    <div className={styles.usersList}>
      {workinghours?.map((user, i) => {
        const emp = employees.find((e)=>e._id === user.user)
        return(
          <div key={i} className={styles.userItem}>
          <span className={styles.userName}>{emp?.name}</span>
          <span className={styles.userTime}>{user?.timespent} sec</span>
        </div>
        )
        
})}
    </div>
  </div>

  <div className={styles.cardred}>
    <div className={styles.cardHeader}>Redflags Panel</div>
    
    
    <div className={styles.legend}>
      
      <div className={styles.legendItem}>
        <span className={`${styles.dot} ${styles.highDot}`}></span>
        High
      </div>

      <div className={styles.legendItem}>
        <span className={`${styles.dot} ${styles.mediumDot}`}></span>
        Medium
      </div>

      <div className={styles.legendItem}>
        <span className={`${styles.dot} ${styles.lowDot}`}></span>
        Low
      </div>
    </div>

    <div className={styles.redflagList}>
      {yesterdayRedFlags.map((flag, i) => {
        const redemployee = employees.find((e)=>e._id === flag.userId)
        if(!redemployee) return null
        return(
          <div
          key={i}
          className={`${styles.flagItem} ${
            styles[flag.severity]
          }`}
        >
          <div className={styles.flagInfo}>
            <div className={styles.flagName}>{redemployee?.name}</div>
            <div className={styles.flagDate}>{new Date(flag?.date).toLocaleString("en-IN", {
  timeZone: "Asia/Kolkata",
})}</div>
          </div>

          <div className={styles.flagStatus}>
            {flag.reason}
          </div>
        </div>
        )
        
})}
    </div>
  </div>
</div>

{/* heatmap and dounut */}

 <div className={styles.wrapper}>
      {/* LEFT */}

      <div className={styles.heatmapCard}>
        <div className={styles.header}>
          Performance Heatmap
        </div>

        <div className={styles.body}>
          <div className={styles.legend}>
            <div className={styles.legendItem}>
              <span className={`${styles.box} ${styles.veryLow}`}></span>
              Very Low
            </div>

            <div className={styles.legendItem}>
              <span className={`${styles.box} ${styles.low1}`}></span>
              Low
            </div>

            <div className={styles.legendItem}>
              <span className={`${styles.box} ${styles.moderate}`}></span>
              Moderate
            </div>

            <div className={styles.legendItem}>
              <span className={`${styles.box} ${styles.high1}`}></span>
              High
            </div>

            <div className={styles.legendItem}>
              <span className={`${styles.box} ${styles.exceptional}`}></span>
              Exceptional
            </div>
          </div>

         <div className={styles.grid}>
  {heatmap.map((cell, index) => (
    <div
      key={index}
      className={`${styles.cell} ${styles[cell.level]}`}
      title={
        cell.metric
          ? `${cell.date.toDateString()}
Reports : ${cell.metric.reportsSubmitted}
Tasks : ${cell.metric.tasksCompleted}
Users : ${cell.metric.activeUsers}`
          : `${cell.date.toDateString()}
No activity`
      }
    />
  ))}
</div>
        </div>
      </div>

      {/* RIGHT */}

      <div className={styles.reportCard}>
        <div className={styles.header}>
          Daily Report Submissions
        </div>

        <div className={styles.reportBody}>
          <div className={styles.chart}>
            <div className={styles.chartInner}>
              {todayreports?.percent.toFixed(1)}%
            </div>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={`${styles.dot} ${styles.red}`}></span>
              Expected : {employees.filter((e)=>e?.designation?.name !=="Administrator")?.length}
            </div>

            <div className={styles.stat}>
              <span className={`${styles.dot} ${styles.green}`}></span>
              Submitted : {todayreports?.todayreport}
            </div>

            <div className={styles.stat}>
              <span className={`${styles.dot} ${styles.orange}`}></span>
              Missing : {todayreports?.missing}
            </div>
          </div>
        </div>
      </div>
    </div>

  {/* table employes */}
  <div className={styles.wrapper2}>
      <div className={styles.header}>
        Recent Employees
      </div>
      <div className={styles.desktopview}>
         <table className={styles.table}>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Role</th>
            <th>Manager</th>
            <th>Projects</th>
            <th>Issues</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginatedEmployees.map((employee, index) =>{
            const manager = employees.find((e)=>e?._id === employee?.managerAssigned)
            const project = projects.filter((p) =>p?.team?.assignedMembers?.some((member) => member.userId === employee._id));
            return (
               <tr key={index}>
              <td>
                <div className={styles.employee}>
                  <div className={styles.avatar}>
  {employee.name
    ?.split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("")}
</div>

                  <span>{employee.name}</span>
                </div>
              </td>

              <td className={styles.role}>
                {employee.role || "NA"}
              </td>

              <td>{manager?.name || "NA"}</td>

              <td className={styles.center}>
                {project?.length}
              </td>

              <td
                className={`${styles.center} ${
                  employee.issues >= 4
                    ? styles.red1
                    : ""
                }`}
              >
                {employee?.ticketsraised?.length}
              </td>

              <td>
                <span
                  className={`${styles.badge} ${
                    styles[
                      employee?.onboarding?.status.toLowerCase()
                    ]
                  }`}
                >
                  {employee?.onboarding?.status}
                </span>
              </td>

              <td className={styles.actions}>
                <MoreVertical size={18} />
              </td>
            </tr>
            )
          })}
        </tbody>
      </table>
      </div>
      <div className={styles.mobileView}>
        {paginatedEmployees.map((emp) => {
          const initials = emp.name
            .split(" ")
            .map((n) => n[0])
            .join("");
      
          const manager1 = employees.find(
            (e) => e._id === emp.managerAssigned
          );
          const project1 = projects.filter((p) =>
            p?.team?.assignedMembers?.some(
              (member) => member.userId === emp._id
            )
          );
      
          return (
            <div className={styles.employeeCard} key={emp._id}>
              {/* Top */}
      
              <div className={styles.cardTop}>
                <div className={styles.avatar}>
                  {initials}
                </div>
      
                <div className={styles.cardUser}>
                  <h3>{emp.name}</h3>
                  <p>{emp.email}</p>
                </div>
              </div>
      
              <div className={styles.cardDivider}></div>
      
              {/* Details */}
      
              <div className={styles.cardGrid}>
                <div>
                  <span className={styles.cardLabel}>Role</span>
                  <h4>{emp.role || "NA"}</h4>
                </div>
      
                <div>
                  <span className={styles.cardLabel}>Manager</span>
                  <h4>{manager1?.name || "NA"}</h4>
                </div>
      
                <div>
                  <span className={styles.cardLabel}>Projects</span>
                  <h4>{project1.length}</h4>
                </div>
      
                <div>
                  <span
                    className={`${styles.mobileStatus} ${
                      emp?.onboarding?.status === "Completed"
                        ? styles.active
                        : styles.inactive
                    }`}
                  >
                    {emp?.onboarding?.status || "NA"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      

        <div className={styles.pagination}>
  <span>
    Showing {(currentPage - 1) * perPage + 1}–
    {Math.min(currentPage * perPage, employees.length)} of{" "}
    {employees.length}
  </span>

  <div className={styles.pagebtns1}>
    {/* Previous */}
    <button
      className={styles.arrowBtn}
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((p) => p - 1)}
    >
      <ChevronLeft size={18} />
    </button>

    {/* First 3 Pages */}
    {Array.from(
      { length: Math.min(3, totalPages) },
      (_, i) => i + 1
    ).map((page) => (
      <button
        key={page}
        className={`${styles.pageNumber1} ${
          currentPage === page ? styles.activepage : ""
        }`}
        onClick={() => setCurrentPage(page)}
      >
        {page}
      </button>
    ))}

    {/* Ellipsis */}
    {totalPages > 4 && (
      <>
        <span className={styles.dots}>.....</span>

        <button
          className={`${styles.pageNumber} ${
            currentPage === totalPages
              ? styles.activepage
              : ""
          }`}
          onClick={() => setCurrentPage(totalPages)}
        >
          {totalPages}
        </button>
      </>
    )}

    {/* Next */}
    <button
      className={styles.arrowBtn}
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage((p) => p + 1)}
    >
      <ChevronRight size={18} />
    </button>
  </div>
</div>
    </div>

    </div>
{overlay && (
  <div
    className={styles.overlay}
    onClick={() => setoverlay(false)}
  >
    <div
      className={styles.modal}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close */}

      <button
        className={styles.closeBtn}
        onClick={() => setoverlay(false)}
      >
        <X size={28} strokeWidth={2} />
      </button>

      {/* Header */}

      <div className={styles.header1}>
        <h2>Employee Details</h2>

        <p>
          Fill the fields below to add new members
        </p>
      </div>

      {/* First Last */}

      <div className={styles.row}>
        <div className={styles.field}>
          <label>
            FIRST NAME <span>*</span>
          </label>

          <input
            type="text"
            value={firstName}
            onChange={(e) =>
              setFirstName(e.target.value)
            }
          />
        </div>

        <div className={styles.field}>
          <label>
            LAST NAME <span>*</span>
          </label>

          <input
            type="text"
            value={lastName}
            onChange={(e) =>
              setLastName(e.target.value)
            }
          />
        </div>
      </div>

      {/* Role */}

      <div className={styles.fullField}>
        <label>
          ROLE <span>*</span>
        </label>
         <input
            type="text"
            value={role}
            onChange={(e) =>
              setRole(e.target.value)
            }
          />
        
      </div>

      {/* Email */}

      <div className={styles.fullField}>
        <label>
          EMAIL <span>*</span>
        </label>

        <input
          type="email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />
      </div>

      {/* Password */}

      <div className={styles.fullField}>
        <label>
          PASSWORD <span>*</span>
        </label>

        <input
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />
      </div>

      {/* Bottom */}

      <div className={styles.rowBottom}>
        <div className={styles.field}>
          <label>DATE OF BIRTH</label>

          <div className={styles.dateWrapper}>
            <input
              type="date"
              value={dob}
              onChange={(e) =>
                setDob(e.target.value)
              }
            />
          </div>
        </div>

        <div className={styles.field}>
          <label>GENDER</label>

          <select
            value={gender}
            onChange={(e) =>
              setGender(e.target.value)
            }
          >
            <option value="">
              Select
            </option>

            <option>Male</option>

            <option>Female</option>

            <option>Other</option>
          </select>
        </div>
      </div>

      {/* Footer */}

      <div className={styles.footer}>
        <p>
          <span>*</span> Required fields
        </p>

        <button
          className={styles.addBtn}
          onClick={handleaddu}
        >
          {loading
            ? "Adding..."
            : "Add Employee"}
        </button>
      </div>
    </div>
  </div>
)}





    {taskmodal && <Createtaskmodal modal={taskmodal} setModal={setTaskmodal} projects={projects} users={employees}/>}

    </>

  );
}

export default Admindashboard;
