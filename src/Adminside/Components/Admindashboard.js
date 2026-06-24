import React, { useEffect, useState, useMemo } from 'react'
import styles from '../CSS/admindashboard.module.css'
import {
  UserPlus, Plus, Users, DollarSign,
  GraduationCap, FolderKanban,
  TriangleAlert, X, ChevronUp, ChevronDown,
  Activity, CheckCircle, CalendarClock, TrendingUp,
  AlertTriangle, Clock, UserCheck, FileText,
  BarChart3, Search, Bell, Home, Target, PieChart,
  Flame
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
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

const getYesterdayISTKey = () => {
  const d = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
  d.setDate(d.getDate() - 1);
  return toISTDateKey(d);
};

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
  { name: 'Submitted', value: 74, color: '#22C55E' },
  { name: 'Missing', value: 8, color: '#EF4444' },
  { name: 'Expected', value: 18, color: '#F59E0B' },
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

/* ================= MOCK USER DATA ================= */
const mockActiveUsers = [
  { name: 'Sarah Johnson', role: 'Product Designer', time: '6h', color: '#3B82F6' },
  { name: 'Michael Chen', role: 'Full Stack Dev', time: '5h', color: '#8B5CF6' },
  { name: 'Emily Rodriguez', role: 'Project Manager', time: '4h', color: '#22C55E' },
  { name: 'David Kim', role: 'Frontend Dev', time: '3h', color: '#F59E0B' },
  { name: 'Lisa Anderson', role: 'UX Researcher', time: '2h', color: '#EC4899' },
];

const mockRedFlags = [
  { name: 'David Kim', desc: 'Missed Reports', severity: 'high' },
  { name: 'Lisa Anderson', desc: 'Poor Performance', severity: 'medium' },
  { name: 'John Doe', desc: 'Inactive', severity: 'low' },
];

/* ================= MOCK HEATMAP ================= */
const generateHeatmapData = () => {
  const cells = [];
  const levels = [0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4];
  for (let i = 0; i < 35; i++) {
    cells.push({ level: levels[i % levels.length] || Math.floor(Math.random() * 6) });
  }
  return cells;
};

const heatmapData = generateHeatmapData();

/* ================= MOCK PROJECT STATUS ================= */
const projectStatusData = [
  { label: 'Completed', count: 5, color: '#22C55E' },
  { label: 'In Progress', count: 10, color: '#3B82F6' },
  { label: 'On Hold', count: 5, color: '#F59E0B' },
  { label: 'Pending', count: 4, color: '#64748b' },
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
      // Generate hourly data for today
      return Array.from({ length: 8 }, (_, i) => ({
        name: `${(i + 8).toString().padStart(2, '0')}:00`,
        value: Math.floor(Math.random() * 15) + 5
      }));
    } else if (activegraph === "monthly") {
      // Generate monthly data
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

  const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);
  const paginatedEmployees = sortedEmployees.slice(
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

  const handleactivepaid = () => {
    const ap = employees?.filter((e) => e.status === "Active & Paid")
    return ap?.length
  }
  const handleactiveunpaid = () => {
    const au = employees?.filter((e) => e.status === "Active & Unpaid")
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


  //as not want
  // const getGreeting = () => {
  //   const hour = new Date().getHours();
  //   if (hour < 12) return "Good morning";
  //   if (hour < 18) return "Good afternoon";
  //   return "Good evening";
  // };

  /* ===== KPI DATA (4 cards only) ===== */
  const kpiData = [
    {
      label: "Total Employees",
      value: employees?.length || 124,
      growth: "+12% from last month",
      positive: true,
      icon: <Users size={20} />,
      iconClass: styles.kpiIconPrimary,
      cardClass: styles.kpiPrimary,
      onClick: () => navigate("/employees")
    },
    {
      label: "Tasks Due Today",
      value: projects?.reduce((acc, p) => acc + (p.Tasks?.filter(t => {
        const due = new Date(t.deadline);
        const today = new Date();
        return due.toDateString() === today.toDateString();
      })?.length || 0), 0) || 12,
      growth: "5 overdue",
      positive: false,
      icon: <CalendarClock size={20} />,
      iconClass: styles.kpiIconWarning,
      cardClass: styles.kpiWarning,
      onClick: () => navigate("/tasks")
    },
    {
      label: "Task Completion Rate",
      value: "80%",
      growth: "+5% improvement",
      positive: true,
      icon: <CheckCircle size={20} />,
      iconClass: styles.kpiIconSuccess,
      cardClass: styles.kpiSuccess,
      onClick: () => navigate("/performance")
    },
    {
      label: "Adoption Score",
      value: "75%",
      growth: "↑ High Engagement",
      positive: true,
      icon: null,
      iconClass: "",
      cardClass: styles.kpiAccent,
      onClick: () => navigate("/performance")
    },
  ];


  return (
    <>
      <div className={styles.mainContainer}>
        {/* HEADER */}
        <div className={styles.topcontainer}>
          <div className={styles.topleft}>
            <div className={styles.topleft1}>{user?.name?.split(" ")[0] || 'Dashboard'}</div>
            <div className={styles.topleft2}>
             Here’s what’s happening today
            </div>
          </div>
          <div className={styles.topright}>
            <div className={styles.topright2} onClick={() => navigate("/employees")}>
              <Plus size={16} />Assign Task
            </div>
          </div>
        </div>

        {/* ======== SECTION 1: KPI CARDS (4) ======== */}
        <div className={styles.kpiStrip}>
          {kpiData.map((kpi, idx) => (
            <div
              key={idx}
              className={`${styles.kpiCard} ${kpi.cardClass}`}
              style={{ "--i": idx }}
              onClick={kpi.onClick}
            >
              <div className={styles.kpiLeft}>
                <div className={styles.kpiLabel}>{kpi.label}</div>
                <div className={styles.kpiValue}>{kpi.value}</div>
                <div className={`${styles.kpiGrowth} ${kpi.positive ? styles.kpiGrowthPositive : styles.kpiGrowthNegative}`}>
                  {kpi.positive ? "↑" : "↓"} {kpi.growth}
                </div>
              </div>
              <div className={`${styles.kpiIcon} ${kpi.iconClass}`}>
                {kpi.label === "Adoption Score" ? (
                  <div className={styles.adoptionRingWrap}>
                    <svg className={styles.adoptionRingSvg} viewBox="0 0 48 48" aria-hidden="true">
                      <circle className={styles.adoptionRingBg} cx="24" cy="24" r="18" />
                      <circle
                        className={styles.adoptionRingProgress}
                        cx="24"
                        cy="24"
                        r="18"
                        strokeDasharray="113.097"
                        strokeDashoffset="26.774"
                      />
                    </svg>
                    <div className={styles.adoptionRingText}>75%</div>
                  </div>
                ) : (
                  kpi.icon
                )}
              </div>

            </div>
          ))}
        </div>

        {/* ======== SECTION 2: MIDDLE GRID (Chart + Project Status + Users Active) ======== */}
        <div className={styles.middleGrid}>
          {/* Chart: Task Completion Trend */}
          <div className={styles.graphCard}>
            <div className={styles.graphHeader}>
              <div className={styles.graphTitle}>
                <BarChart3 size={18} color="#3B82F6" />
                Task Completion Trend
              </div>
              <div className={styles.graphTabs}>
                <button
                  className={`${styles.graphTab} ${activegraph === "daily" ? styles.graphTabActive : ""}`}
                  onClick={() => setActivegraph("daily")}
                >Daily</button>
                <button
                  className={`${styles.graphTab} ${activegraph === "weekly" ? styles.graphTabActive : ""}`}
                  onClick={() => setActivegraph("weekly")}
                >Weekly</button>
                <button
                  className={`${styles.graphTab} ${activegraph === "monthly" ? styles.graphTabActive : ""}`}
                  onClick={() => setActivegraph("monthly")}
                >Monthly</button>
              </div>
            </div>
            <div className={styles.graphBody}>
              <div style={{ width: "100%", height: 200 }}>
                <ResponsiveContainer>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 11 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 11 }}
                      width={30}
                    />
                    <Tooltip
                      contentStyle={{
                        background: '#1E293B',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 8,
                        fontSize: 12,
                        color: '#f8fafc'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      fill="url(#chartGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
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
              <div className={styles.projectStatusMetric}>
                <div className={styles.projectStatusMetricLabel}>Completed</div>
                <div className={styles.projectStatusMetricValue}>5</div>
              </div>
              <div className={styles.projectStatusMetric}>
                <div className={styles.projectStatusMetricLabel}>In Progress</div>
                <div className={styles.projectStatusMetricValue}>10</div>
              </div>
              <div className={styles.projectStatusMetric}>
                <div className={styles.projectStatusMetricLabel}>On Hold</div>
                <div className={styles.projectStatusMetricValue}>5</div>
              </div>
              <div className={styles.projectStatusMetric}>
                <div className={styles.projectStatusMetricLabel}>Pending</div>
                <div className={styles.projectStatusMetricValue}>4</div>
              </div>
            </div>
          </div>

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
                  <div
                    className={styles.usersActiveAvatar}
                    style={{ background: u.color }}
                  >
                    {getInitials(u.name)}
                  </div>
                  <div className={styles.usersActiveInfo}>
                    <div className={styles.usersActiveName}>{u.name}</div>
                    <div className={styles.usersActiveRole}>{u.role}</div>
                  </div>
                  <div className={styles.usersActiveTime}>{u.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ======== SECTION 3: BOTTOM GRID (Red Flags + Heatmap + Donut) ======== */}
        <div className={styles.bottomGrid}>
          {/* Red Flags Panel */}
          <div className={styles.redFlagsCard}>
            <div className={styles.redFlagsHeader}>
              <div className={styles.redFlagsTitle}>
                <TriangleAlert size={18} color="#EF4444" />
                Red Flags
              </div>
              <div className={styles.redFlagsLegend}>
                <div className={styles.redFlagLegendItem}>
                  <div className={styles.redFlagLegendDot} style={{ background: '#EF4444' }} />
                  High
                </div>
                <div className={styles.redFlagLegendItem}>
                  <div className={styles.redFlagLegendDot} style={{ background: '#F59E0B' }} />
                  Medium
                </div>
                <div className={styles.redFlagLegendItem}>
                  <div className={styles.redFlagLegendDot} style={{ background: '#64748b' }} />
                  Low
                </div>
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
                    <div className={styles.redFlagDesc}>{flag.desc}</div>
                  </div>
                  <div className={styles.redFlagAction}>View</div>
                </div>
              ))}
            </div>
          </div>

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
                Daily Report Submissions
              </div>
            </div>
            <div className={styles.donutContainer}>
              <RePieChart width={160} height={160}>
                <Pie
                  data={donutData}
                  cx={80}
                  cy={80}
                  innerRadius={50}
                  outerRadius={72}
                  paddingAngle={2}
                  dataKey="value"
                  label={renderCustomizedLabel}
                  labelLine={false}
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#1E293B',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 8,
                    fontSize: 12,
                    color: '#f8fafc'
                  }}
                />
              </RePieChart>
              <div className={styles.donutCenterText}>
                <div className={styles.donutCenterValue}>92%</div>
                <div className={styles.donutCenterLabel}>Rate</div>
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

        {/* ======== SECTION 4: TABLE ======== */}
        <div className={styles.tableContainer}>
          <div className={styles.tabletop}>
            <div className={styles.tabletitle}>Recent Employees</div>
          </div>

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
                <th>Manager</th>
                <th>Projects</th>
                <th>Issues</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEmployees.map((row) => (
                <tr key={row._id}>
                  <td>
                    <div className={styles.employeeCell}>
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
                  <td>{row.manager || '—'}</td>
                  <td>{row.Projects?.length || 0}</td>
                  <td>{row.issues || 0}</td>
                  <td>
                    <span className={`${styles.status} ${statusClassMap[row.status] || styles.onboarding}`}>
                      {row.status || 'Onboarding'}
                    </span>
                  </td>
                  <td>
                    <span className={styles.status} style={{
                      background: 'rgba(59, 130, 246, 0.08)',
                      color: '#3B82F6',
                      border: '1px solid rgba(59, 130, 246, 0.15)',
                      cursor: 'pointer'
                    }}>
                      Edit
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.pagination}>
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? styles.activePage : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
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
              <X />
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
                <input value={email} onChange={(e) => setEmail(e.target.value)} />
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