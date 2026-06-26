import React, { useEffect, useState, useMemo } from 'react'
import styles from '../CSS/admindashboard.module.css'
import {
  Plus, CalendarClock, TriangleAlert, X,
  Bell, Settings, PieChart, UserRound,
  MoreHorizontal, Activity
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  // CartesianGrid,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip
} from "recharts";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import Createtaskmodal from './Createtaskmodal';

/* ================= IST HELPERS ================= */
const toISTDateKey = (date) =>
  new Date(date).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });




// const getYesterdayISTKey = () => {
//   const d = new Date(
//     new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
//   );
//   d.setDate(d.getDate() - 1);
//   return toISTDateKey(d);
// };


const getLast7DaysIST = () => {
  const days = [];
  const today = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
  today.setHours(0, 0, 0, 0);
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push({
      key: toISTDateKey(d),
      label: d.toLocaleDateString("en-US", { weekday: "short", timeZone: "Asia/Kolkata" })
    });
  }
  return days;
};

/* ================= AVATAR COLORS ================= */
const avatarColors = [
  '#3B82F6', '#8B5CF6', '#EC4899', '#EF4444',
  '#F59E0B', '#22C55E', '#06B6D4', '#6366F1',
  '#D946EF', '#14B8A6'
];

const getAvatarColor = (name) => {
  if (!name) return avatarColors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
};

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

/* ================= DONUT CHART DATA ================= */
const donutData = [
  { name: 'Expected: 180', value: 180, color: '#FF574D' },
  { name: 'Submitted: 160', value: 160, color: '#22C55E' },
  { name: 'Missing: 20', value: 20, color: '#F59E0B' },
];
// remove radian chart data 


// const RADIAN = Math.PI / 180;
// const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
//   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
//   const x = cx + radius * Math.cos(-midAngle * RADIAN);
//   const y = cy + radius * Math.sin(-midAngle * RADIAN);
//   return (
//     <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={600}>
//       {`${(percent * 100).toFixed(0)}%`}
//     </text>
//   );
// };


/* ================= MOCK USER DATA ================= */
const mockActiveUsers = [
  { name: 'Sarah Johnson', role: 'Product Designer', time: '6h', color: '#3B82F6' },
  { name: 'Michael Chen', role: 'Full Stack Dev', time: '5h', color: '#8B5CF6' },
  { name: 'Emily Rodriguez', role: 'Project Manager', time: '4h', color: '#22C55E' },
  { name: 'David Kim', role: 'Frontend Dev', time: '3h', color: '#F59E0B' },
  { name: 'Lisa Anderson', role: 'UX Researcher', time: '2h', color: '#EC4899' },
];

const mockRedFlags = [
  { name: 'David Kim', desc: 'Missed Reports', severity: 'high', date: 'Jun 25, 2026' },
  { name: 'Lisa Anderson', desc: 'Poor Performance', severity: 'medium', date: 'Jun 24, 2026' },
  { name: 'John Doe', desc: 'Inactive', severity: 'low', date: 'Jun 23, 2026' },
];

/* ================= MOCK HEATMAP ================= */
const generateHeatmapData = () => {
  const cells = [];
  // 7 rows x 26 cols = 182 cells project hemp
  const pattern = [0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5, 0];
  for (let i = 0; i < 111; i++) {
    cells.push({ level: pattern[i % pattern.length] || Math.floor(Math.random() * 3) });
  }
  return cells;
};

const heatmapData = generateHeatmapData();

/* ================= MOCK PROJECT STATUS ================= */
const projectStatusData = [
  { label: 'Completed', count: 5, color: '#22C55E' },
  { label: 'In Progress', count: 10, color: '#3B82F6' },
  { label: 'On Hold', count: 5, color: '#F59E0B' },
  { label: 'Pending', count: 4, color: '#5C5F6A' },
];

function Admindashboard({ showAddEmployee, setShowAddEmployee, showAssignTask, setShowAssignTask }) {
  const navigate = useNavigate();

  /* ================= STATES ================= */
  const [overlay, setoverlay] = useState(false);
  const [taskmodal, setTaskmodal] = useState(false);
  const [projects, setprojects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [redflags, setredflags] = useState([]);

  // Demo employees for "Recent Employees" UI (never affects API logic)
  const demoRecentEmployees = useMemo(
    () => [
      { _id: "demo-emp-1", name: "Rahul Kumar", role: "Frontend Developer", manager: "Anita", Projects: ["p1"], issues: 2, status: "Active & Paid", designation: { name: "Frontend Developer" } },
      { _id: "demo-emp-2", name: "Priya Sharma", role: "Backend Developer", manager: "Vikram", Projects: ["p2", "p3"], issues: 1, status: "Active & Unpaid", designation: { name: "Backend Developer" } },
      { _id: "demo-emp-3", name: "Arjun Mehta", role: "QA Engineer", manager: "Nidhi", Projects: [], issues: 3, status: "Onboarding", designation: { name: "QA" } },
      { _id: "demo-emp-4", name: "Neha Patel", role: "UI/UX Designer", manager: "Rohit", Projects: ["p4"], issues: 0, status: "Inactive", designation: { name: "UI/UX Designer" } },
      { _id: "demo-emp-5", name: "Sahil Verma", role: "DevOps", manager: "Kavya", Projects: ["p5"], issues: 2, status: "Active & Paid", designation: { name: "Devops" } },
    ],
    []
  );

  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const fullName = `${firstName} ${lastName}`.trim();
  const [data, setData] = useState([]);
  const [activegraph, setActivegraph] = useState("weekly");
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false)
  const [sortOrder, setSortOrder] = useState("desc");
  const [user, setUser] = useState("")
  const itemsPerPage = 5;

  // Sync overlay state from App-level props
  useEffect(() => {
    if (showAddEmployee) {
      setoverlay(true);
      setShowAddEmployee(false);
    }
  }, [showAddEmployee]);

  useEffect(() => {
    if (showAssignTask) {
      setTaskmodal(true);
      setShowAssignTask(false);
    }
  }, [showAssignTask]);

  
   // this term i use for not go to ./ that page rather to get the error in console only 
  // before push and pull remove and replace with this
  
  {/*
  useEffect(() => {
    axios.get(`https://atlasbackend-1bt5.onrender.com/api/v1/admin/getalluser`, { withCredentials: true })
      .then(res => setEmployees(res.data.message || []));
  }, []);

  useEffect(() => {
    (async () => {
      const response = await axios.get("https://atlasbackend-1bt5.onrender.com/api/v1/admin/getuser", { withCredentials: true })
      console.log(response.data.message)
      setUser(response.data.message)
    })()
  }, []);

  useEffect(() => {
    axios.get(`https://atlasbackend-1bt5.onrender.com/api/v1/admin/getallproject`)
      .then(res => setprojects(res.data.message || []));
  }, []);

  useEffect(() => {
    axios.get(`https://atlasbackend-1bt5.onrender.com/api/v1/admin/getmetrics`)
      .then(res => setMetrics(res.data.message || []));
  }, []);

  useEffect(() => {
    axios.get(`https://atlasbackend-1bt5.onrender.com/api/v1/admin/getredflags`)
      .then(res => setredflags(res.data.message || []));
  }, [employees]); 

 */}
  useEffect(() => {
    axios.get(`https://atlasbackend-1bt5.onrender.com/api/v1/admin/getalluser`, { withCredentials: true })
      .then(res => setEmployees(res.data.message || []))
      .catch(err => console.log("API offline - using mock data"));
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("https://atlasbackend-1bt5.onrender.com/api/v1/admin/getuser", { withCredentials: true })
        console.log(response.data.message)
        setUser(response.data.message)
      } catch(err) {
        console.log("API offline for getuser");
      }
    })()
  }, []);

  useEffect(() => {
    axios.get(`https://atlasbackend-1bt5.onrender.com/api/v1/admin/getallproject`)
      .then(res => setprojects(res.data.message || []))
      .catch(err => console.log("API offline - projects"));
  }, []);

  useEffect(() => {
    axios.get(`https://atlasbackend-1bt5.onrender.com/api/v1/admin/getmetrics`)
      .then(res => setMetrics(res.data.message || []))
      .catch(err => console.log("API offline - metrics"));
  }, []);

  useEffect(() => {
    axios.get(`https://atlasbackend-1bt5.onrender.com/api/v1/admin/getredflags`)
      .then(res => setredflags(res.data.message || []))
      .catch(err => console.log("API offline - redflags"));
  }, [employees]);

  const weeklyDynamicData = useMemo(() => {
    const days = getLast7DaysIST();
    return days.map(d => {
      const m = metrics.find(x => toISTDateKey(x.date) === d.key);
      return { name: d.label, value: m?.reportsSubmitted || 0 };
    });
  }, [metrics]);

  useEffect(() => {
    setData(weeklyDynamicData);
  }, [weeklyDynamicData]);

  // Generate chart data based on active tab
  const chartData = useMemo(() => {
    if (activegraph === "daily") {
      return Array.from({ length: 8 }, (_, i) => ({
        name: `${(i + 8).toString().padStart(2, '0')}:00`,
        value: Math.floor(Math.random() * 15) + 5
      }));
    } else if (activegraph === "monthly") {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.map(m => ({
        name: m,
        value: Math.floor(Math.random() * 30) + 10
      }));
    }
    return weeklyDynamicData;
  }, [activegraph, weeklyDynamicData]);

  const sortedEmployees = [...employees].sort((a, b) =>
    sortOrder === "desc"
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt)
  );

  // Recent Employees table uses demo list only when API list is empty
  const effectiveEmployees = employees?.length ? sortedEmployees : demoRecentEmployees;

  const totalPages = Math.ceil(effectiveEmployees.length / itemsPerPage);
  const paginatedEmployees = effectiveEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const statusClassMap = {
    "Active & Paid": styles.activePaid,
    "Active & Unpaid": styles.activeUnpaid,
    "Inactive": styles.inactive,
    "Onboarding": styles.onboarding,
    "Training": styles.training,
  };

  // const handleactivepaid = () => {
  //   const ap = employees?.filter((e) => e.status === "Active & Paid")
  //   return ap?.length
  // }
  // const handleactiveunpaid = () => {
  //   const au = employees?.filter((e) => e.status === "Active & Unpaid")
  //   return au?.length
  // }

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
        "https://atlasbackend-1bt5.onrender.com/api/v1/admin/addemployee",
        { name: fullName, email: email, password: password },
        { withCredentials: true }
      );
      console.log(response);
      toast.success("Employees Added Successfully");
      setoverlay(false);
      window.location.reload();
    } catch (error) {
      console.log("Something went wrong", error.message);
      toast.error("Something Went Wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ===== Severity Badge Helper ===== */
  const getSeverityBadge = (severity) => {
    if (severity === 'high') {
      return <span className={`${styles.redFlagBadge} ${styles.redFlagBadgeHigh}`}>High</span>;
    } else if (severity === 'medium') {
      return <span className={`${styles.redFlagBadge} ${styles.redFlagBadgeMedium}`}>Medium</span>;
    }
    return <span className={`${styles.redFlagBadge} ${styles.redFlagBadgeLow}`}>Low</span>;
  };

  /* ===== Tooltip Style (shared) ===== */
  const tooltipStyle = {
    background: '#111520',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 8,
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 500,
    boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
  };

  return (
    <>
      <div className={styles.mainContainer}>
        {/* ─── HEADER ─── */}
        <div className={styles.topcontainer}>
          <div className={styles.topleft}>
            <div className={styles.topleft1}>
              {user?.name?.split(" ")[0] || 'Dashboard'}
            </div>
            <div className={styles.topleft2}>
              Here's what's happening today
            </div>
          </div>
          <div className={styles.topright}>
            
            <div className={styles.topright2} onClick={() => navigate("/employees")}>
              <Plus size={16} />New Employee
            </div>
          </div>
        </div>

        {/* ─── ROW 1: PREMIUM KPI STATS CARDS (4 Columns) ─── */}
        <div className={styles.kpiStrip}>
          {/* Card 1: Total Employees */}
          <div className={styles.kpiCard} onClick={() => navigate("/employees")}>
            <div className={styles.kpiCardContent}>
              <div className={styles.kpiTopRow}>
                <div className={styles.kpiLabel}>Total Employees</div>
                <div className={styles.kpiIconCircle}>
                  <UserRound size={18} />
                </div>
              </div>
              <div className={styles.kpiValueRow}>
                <div className={styles.kpiValue}>{employees?.length || 124}</div>
              </div>
            </div>
          </div>

          {/* Card 2: Tasks Due Today */}
          <div className={styles.kpiCard} onClick={() => navigate("/tasks")}>
            <div className={styles.kpiCardContent}>
              <div className={styles.kpiTopRow}>
                <div className={styles.kpiLabel}>Tasks Due Today</div>
                <div className={`${styles.kpiIconCircle} ${styles.kpiIconCircleRed}`}>
                  <Bell size={16} />
                </div>
              </div>
              <div className={styles.kpiValueRow}>
                <div className={styles.kpiValue}>
                  {projects?.reduce((acc, p) => acc + (p.Tasks?.filter(t => {
                    const due = new Date(t.deadline);
                    const today = new Date();
                    return due.toDateString() === today.toDateString();
                  })?.length || 0), 0) || 12}
                </div>
              </div>
            </div>
          </div>

         {/* Card 3: Task Completion Rate */}
<div
  className={styles.kpiCard}
  onClick={() => navigate("/performance")}
>
  <div className={styles.kpiCardContent}>

    <div className={styles.kpiTopRow}>
      <div className={styles.kpiLabel}>Task Completion Rate</div>
    </div>

    <div className={styles.kpiValueRow}>
      
      <div className={styles.kpiValue}>80%</div>

      <div className={styles.kpiBarsRight}>
        {[30, 55, 80, 45, 65].map((value, index) => (
          <div
            key={index}
            className={styles.kpiPillBar}
            // Make bars visually more distinct vs container padding by mapping to an easier range
            style={{ height: `${Math.max(10, Math.min(100, value * 1.1))}%` }}
            aria-hidden="true"
          />
        ))}
      </div>

    </div>
  </div>
</div>
          {/* Card 4: Adoption Score */}
          <div className={styles.kpiCard} onClick={() => navigate("/performance")}>
            <div className={styles.kpiCardContent}>
              <div className={styles.kpiTopRow}>
                <div className={styles.kpiLabel}>Adoption Score</div>
              </div>
              <div className={styles.kpiValueRow}>
                <div className={styles.kpiAdoptionWrap}>
                  <div className={styles.adoptionRingWrapNew}>
                    <svg className={styles.adoptionRingSvgNew} viewBox="0 0 100 100">
                      <defs>
                        <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3B82F6" />
                          <stop offset="100%" stopColor="#60A5FA" />
                        </linearGradient>
                      </defs>
                      <circle className={styles.adoptionRingBgNew} cx="50" cy="50" r="34" />
                      <circle
                        className={styles.adoptionRingProgressNew}
                        cx="50"
                        cy="50"
                        r="34"
                        stroke="url(#blueGradient)"
                        strokeDasharray="213.6"
                        strokeDashoffset="53.4"
                      />
                    </svg>
                    <div className={styles.adoptionRingCenterText}>75%</div>
                  </div>
                  <div className={styles.kpiAdoptionRight}>
                    <div className={styles.kpiAdoptionHigh}>High</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── ROW 2: Task Completion Trend + Project Status Overview ─── */}
        <div className={styles.row2}>
          {/* Chart: Task Completion Trend */}

<div className={styles.graphCard}>
  
  {/* Header */}
  <div className={styles.graphHeader}>
    <div className={styles.graphTitle}>
      Task Completion Trend
    </div>

    {/* Tabs */}
    <div className={styles.graphTabs}>
      <div className={styles.graphTabsPill}>
        
        <span
          className={`${styles.graphTabPillItem} ${
            activegraph === "daily" ? styles.graphTabPillActive : ""
          }`}
          onClick={() => setActivegraph("daily")}
        >
          Daily
        </span>

        <span
          className={`${styles.graphTabPillItem} ${
            activegraph === "weekly" ? styles.graphTabPillActive : ""
          }`}
          onClick={() => setActivegraph("weekly")}
        >
          Weekly
        </span>

        <span
          className={`${styles.graphTabPillItem} ${
            activegraph === "monthly" ? styles.graphTabPillActive : ""
          }`}
          onClick={() => setActivegraph("monthly")}
        >
          Monthly
        </span>

      </div>
    </div>
  </div>

  {/* Chart Body */}
  <div className={styles.graphBody}>
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={chartData}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >

        {/* Gradient */}
        <defs>
  <linearGradient id="splineGradient" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stopColor="#3B46FF" stopOpacity={0.95} />
    <stop offset="45%" stopColor="#3B46FF" stopOpacity={0.55} />
    <stop offset="100%" stopColor="#3B46FF" stopOpacity={0.10} />
  </linearGradient>
</defs>

        {/* Axes (hidden for clean UI) */}
        <XAxis dataKey="name" hide />
        <YAxis hide domain={[0, "auto"]} />

        {/* Subtle grid */}
        {/* <CartesianGrid
          stroke="rgba(255,255,255,0.03)"
          vertical={false}
        /> */}

        {/* Tooltip */}
        <Tooltip contentStyle={tooltipStyle} />

        {/* Area Chart */}
       <Area
  type="natural"
  dataKey="value"
  stroke="#3F4DFF"
  strokeWidth={3}
  fill="url(#splineGradient)"
  dot={false}
  activeDot={false}
/>
      </AreaChart>
    </ResponsiveContainer>
  </div>

</div>

          {/* Project Status Overview */}
          <div className={styles.projectStatusCard}>
            <div className={styles.projectStatusHeader}>
              <div className={styles.projectStatusTitle}>Project Status Overview</div>
            </div>
            <div className={styles.projectStatusTop}>
              <div className={styles.projectStatusBigNumber}>{projects?.length || 24}</div>
              <div className={styles.projectStatusTopSub}>Projects Active</div>
            </div>
            <div className={styles.projectStatusGrid}>
              {projectStatusData.map((item, idx) => (
               <div className={styles.projectStatusMetric}>
  <span className={styles.projectStatusMetricLabel}>
    {item.label}
  </span>
  <span className={styles.projectStatusMetricValue}>
    {item.count}
  </span>
</div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── ROW 3: Users Active + Red Flags Panel ─── */}
        <div className={styles.row3}>
          {/* Users Active Panel */}
          <div className={styles.usersActiveCard}>
            <div className={styles.usersActiveHeader}>
              <div className={styles.usersActiveTitle}>
                Users Active
              </div>
              <div className={styles.usersActiveCount}>5 online</div>
            </div>
            <div className={styles.usersActiveList}>
              {mockActiveUsers.map((u, idx) => (
                <div key={idx} className={styles.usersActiveItem}>
                {/* TODO: If future “Users Active” avatar is needed again, re-introduce usersActiveAvatar here. For now, showing comment word instead. */}
                  {/* <div className={styles.usersActiveAvatar} style={{ background: u.color }}>{getInitials(u.name)}</div> */}
                  {/* <div className={styles.usersActiveAvatarComment}>
                    comment
                  </div> */}
                  <div className={styles.usersActiveInfo}>
                    <div className={styles.usersActiveName}>{u.name}</div>
                    <div className={styles.usersActiveRole}>{u.role}</div>
                  </div>
                  <div className={styles.usersActiveTime}>{u.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Red Flags Panel */}
          <div className={styles.redFlagsCard}>
            <div className={styles.redFlagsHeader}>
              <div className={styles.redFlagsTitleWrap}>
                <div className={styles.redFlagsTitle}>
                  <TriangleAlert size={18} color="#EF4444" />
                  Red Flags
                </div>
              </div>
            </div>
            <div className={styles.redFlagsLegendBar}>
              <div className={styles.redFlagLegendItem}>
                <div className={styles.redFlagLegendDot} style={{ background: '#EF4444' }} />
                High
              </div>
              <div className={styles.redFlagLegendItem}>
                <div className={styles.redFlagLegendDot} style={{ background: '#F59E0B' }} />
                Medium
              </div>
              <div className={styles.redFlagLegendItem}>
                <div className={styles.redFlagLegendDot} style={{ background: '#5C5F6A' }} />
                Low
              </div>
            </div>
            <div className={styles.redFlagsList}>
              {mockRedFlags.map((flag, idx) => (
                <div
                  key={idx}
                  className={`${styles.redFlagItem} ${
                    flag.severity === 'high' ? styles.redFlagHigh :
                    flag.severity === 'medium' ? styles.redFlagMedium :
                    styles.redFlagLow
                  }`}
                >
                  <div className={styles.redFlagInfo}>
                    <div className={styles.redFlagName}>{flag.name}</div>
                    <div className={styles.redFlagDate}>{flag.date}</div>
                  </div>
                  {getSeverityBadge(flag.severity)}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── ROW 4: Performance Heatmap + Daily Report Submissions ─── */}
        <div className={styles.row4}>
          {/* Performance Heatmap */}
          <div className={styles.heatmapCard}>
            <div className={styles.heatmapHeader}>
              <div className={styles.heatmapTitle}>Performance Heatmap</div>
            </div>
            <div className={styles.heatmapLegendRow}>
              <div className={styles.heatmapLegendItem}>
                <span className={`${styles.heatmapLegendDot} ${styles.legendDotVeryLow}`} />
                <span>Very Low</span>
              </div>
              <div className={styles.heatmapLegendItem}>
                <span className={`${styles.heatmapLegendDot} ${styles.legendDotLow}`} />
                <span>Low</span>
              </div>
              <div className={styles.heatmapLegendItem}>
                <span className={`${styles.heatmapLegendDot} ${styles.legendDotModerate}`} />
                <span>Moderate</span>
              </div>
              <div className={styles.heatmapLegendItem}>
                <span className={`${styles.heatmapLegendDot} ${styles.legendDotHigh}`} />
                <span>High</span>
              </div>
              <div className={styles.heatmapLegendItem}>
                <span className={`${styles.heatmapLegendDot} ${styles.legendDotExceptional}`} />
                <span>Exceptional</span>
              </div>
            </div>
            <div className={styles.heatmapGrid}>
              {heatmapData.map((cell, idx) => (
                <div
                  key={idx}
                  className={`${styles.heatmapCell} ${styles[`heatmapLevel${cell.level}`]}`}
                  title={`Level: ${cell.level}`}
                />
              ))}
            </div>
          </div>

          {/* Daily Report Submissions (Donut Chart) */}
          <div className={styles.donutCard}>
            <div className={styles.donutHeader}>
              <div className={styles.donutTitle}>
                <PieChart size={18} color="#3B82F6" />
                Daily Report
              </div>
            </div>
            <div className={styles.donutContainer}>
              <RePieChart width={160} height={160}>
                <Pie
                  data={donutData}
                  cx={80}
                  cy={80}
                  innerRadius={52}
                  outerRadius={70}
                  strokeWidth={0}
                  paddingAngle={3}
                  dataKey="value"
                  labelLine={false}
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </RePieChart>
              <div className={styles.donutCenterText}>
                <div className={styles.donutCenterValue}>92%</div>
              </div>
            </div>
            <div className={styles.donutLegend}>
              {donutData.map((item, idx) => (
                <div key={idx} className={styles.donutLegendItem}>
                  <div className={styles.donutLegendDot} style={{ background: item.color }} />
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── SECTION 4: TABLE ─── */}
        <div className={styles.tableContainer}>
          <div className={styles.tabletop}>
            <div className={styles.tabletitle}>Recent Employees</div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.employeeTable}>
              <thead>
                <tr>
                  <th
                    onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                    style={{ cursor: "pointer" }}
                  >
                    Employee {sortOrder === "desc" ? "↓" : "↑"}
                  </th>
                  <th>Role</th>
                  <th className={styles.hideMobile}>Manager</th>
                  <th className={styles.hideTablet}>Projects</th>
                  <th className={styles.hideTablet}>Issues</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.length > 0 ? (
                  paginatedEmployees.map((row) => (
                    <tr key={row._id}>
                      <td>
                        <div
                          className={styles.employeeCell}
                          style={{ cursor: 'pointer' }}
onClick={() => navigate(`/employees/${row._id}`)}
                        >
                          <div
                            className={styles.avatarCircle}
                            style={{ background: getAvatarColor(row.name) }}
                          >
                            {getInitials(row.name)}
                          </div>
                          <span className={styles.employeeName}>{row.name}</span>
                        </div>
                      </td>
                      <td>{row.role || '—'}</td>
                      <td className={styles.hideMobile}>{row.manager || '—'}</td>
                      <td className={styles.hideTablet}>{row.Projects?.length || 0}</td>
                      <td className={styles.hideTablet}>{row.issues || 0}</td>
                      <td>
                        <span className={`${styles.status} ${statusClassMap[row.status] || styles.onboarding}`}>
                          {row.status || 'Onboarding'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <MoreHorizontal size={16} color="#8B8D97" style={{ cursor: 'pointer' }} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '32px 16px', color: '#5C5F6A', fontSize: 14 }}>
                      No employees found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className={styles.pagination}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            >
              Prev
            </button>
            {totalPages > 0 && [...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? styles.activePage : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ADD EMPLOYEE OVERLAY */}
      {overlay && (
        <div className={styles.overlay} onClick={() => setoverlay(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setoverlay(false)}>
              <X size={18} />
            </button>
            <div className={styles.titleRow}>
              <div className={styles.line}></div>
              <h2>Add Employee</h2>
              <div className={styles.line}></div>
            </div>
            <div className={styles.section}>
              <p className={styles.sectionTitle}>
                Basic Details<span style={{ color: "red", margin: "0px 5px" }}>*</span>:
              </p>
              <div className={styles.row2}>
                <div className={styles.field}>
                  <span>First name</span>
                  <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className={styles.field}>
                  <span>Last name</span>
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>
              <div className={styles.fieldFull}>
                <span>Email ID</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className={styles.fieldFull}>
                <span>Password</span>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
            <div className={styles.footer}>
              <button className={styles.saveBtn} onClick={handleaddu}>
                {loading ? "Adding..." : "Save →"}
              </button>
            </div>
          </div>
        </div>
      )}

      {taskmodal && <Createtaskmodal modal={taskmodal} setModal={setTaskmodal} projects={projects} users={employees} />}
    </>
  );
}

export default Admindashboard;