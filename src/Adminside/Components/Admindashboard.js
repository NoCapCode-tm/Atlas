
import React, { useEffect, useState, useMemo } from 'react'
import styles from '../CSS/admindashboard.module.css'
import {
  UserPlus, Plus, Users, DollarSign,
  GraduationCap, FolderKanban,
  TriangleAlert, X, ChevronUp, ChevronDown
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import { Tag } from "primereact/tag";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import Createtaskmodal from './Createtaskmodal';
import { InfoTooltip } from './InfoTooltip';

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
      label: d.toLocaleDateString("en-US", {
        weekday: "short",
        timeZone: "Asia/Kolkata"
      })
    });
  }
  return days;
};

function Admindashboard() {
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
  const [activegraph, setActivegraph] = useState("monthly");
  const[email,setEmail]=useState("") 
  const[password,setPassword]=useState("")
  const [currentPage, setCurrentPage] = useState(1);
  const[loading,setLoading]=useState(false)
  const [sortOrder, setSortOrder] = useState("desc");
  const[user,setUser]=useState("")
  const itemsPerPage = 5;
  
  useEffect(() => {
    axios.get(`https://atlasbackend-px53.onrender.com/api/v1/admin/getalluser`, { withCredentials: true })
      .then(res => setEmployees(res.data.message || []));
  }, []);
  useEffect(() => {
   (async()=>{
    const response = await axios.get("https://atlasbackend-px53.onrender.com/api/v1/admin/getuser",{withCredentials:true})
    console.log(response.data.message)
    setUser(response.data.message)
   })()
     
  }, []);

  useEffect(() => {
    axios.get(`https://atlasbackend-px53.onrender.com/api/v1/admin/getallproject`)
      .then(res => setprojects(res.data.message || []));
  }, []);

  useEffect(() => {
    axios.get(`https://atlasbackend-px53.onrender.com/api/v1/admin/getmetrics`)
      .then(res => setMetrics(res.data.message || []));
  }, []);

  useEffect(() => {
    axios.get(`https://atlasbackend-px53.onrender.com/api/v1/admin/getredflags`)
      .then(res => setredflags(res.data.message || []));
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

  const handleDaily = () => {
    setActivegraph("daily");
    setData(weeklyDynamicData);
  };
  const handleWeekly = () => {
    setActivegraph("weekly");
    setData(weeklyDynamicData);
  };
  const handleMonthly = () => {
    setActivegraph("monthly");
    setData(weeklyDynamicData);
  };

  /* ================= RED FLAGS ================= */
  const getYesterdayRedFlags = () => {
    const key = getYesterdayISTKey();
    return redflags.filter(r => toISTDateKey(r.date) === key);
  };

  const redflagdetail = (id) =>
    employees.find(e => e._id.toString() === id)?.name || "-";

  /* ================= PAGINATION ================= */
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
    };
     const severityClassMap = { 
      "high":styles.high, 
      "medium":styles.medium,
       "low":styles.low, 
      }

      const handleactivepaid = () =>{
         const ap = employees?.filter((e)=>e.status === "Active & Paid") 
         return ap?.length 
        } 
        const handleactiveunpaid = () =>{ 
          const au = employees?.filter((e)=>e.status === "Active & Unpaid") 
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
      "https://atlasbackend-px53.onrender.com/api/v1/admin/addemployee",
      {
        name: fullName,
        email: email,
        password: password,
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
const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};



  /* ================= JSX ================= */
  return (
   <>
    <div className={styles.mainContainer}>
      <div className={styles.topcontainer}>
        <div className={styles.topleft}>
  <div className={styles.topleft1}>{getGreeting()}, {user?.name?.split(" ")[0]}!</div>
  <div className={styles.topleft2}>
     Here's what's happening today.
  </div>
</div>
        <div className={styles.topright}>
          <div className={styles.topright1} onClick={()=>{setoverlay(true)}}><UserPlus size={16}/>Add Employee</div>
          <div className={styles.topright2} onClick={()=>{setTaskmodal(true)}}><Plus size={16}/>Assign Task</div>
        </div>
      </div>
      <div className={styles.cards}>
        <div className={`${styles.card} ${styles.animateOnScroll}`}  data-animate style={{ "--delay": 0 }} onClick={()=>{navigate("/employees")}}>
          <div className={styles.cardleft} >
            <div className={styles.cardleft1}>Total Employees
              <InfoTooltip text="Total number of registered employees in the organization" />
            </div>
            <div className={styles.cardleft2}>{employees?.length}</div>
            {/* <div className={styles.cardleft3}>↑ 12% from last month</div> */}
          </div>
          <div className={styles.cardright}>
            <div className={styles.cardlogo5}><Users /></div>
          </div>
        </div>

        <div className={`${styles.card1} ${styles.animateOnScroll}`}  data-animate style={{ "--delay": 0 }} onClick={() =>
  navigate("/employees", {
    state: {
      tab: "onboarding",
      status: "Active & Paid" // Active & Unpaid
    }
  })
}
>
          <div className={styles.cardleft}>
            <div className={styles.cardleft1}>Active & Paid
              <InfoTooltip text="Employees currently active and paid in the current cycle" />
            </div>
            <div className={styles.cardleft2}>{handleactivepaid()}</div>
            {/* <div className={styles.cardleft3}></div> */}
          </div>
          <div className={styles.cardright}>
            <div className={styles.cardlogo2}><DollarSign /></div>
          </div>
        </div>
        <div className={`${styles.card2} ${styles.animateOnScroll}`}  data-animate style={{ "--delay": 0 }} onClick={() =>
  navigate("/employees", {
    state: {
      status: "Active & UnPaid"
    }
  })
}
>
          <div className={styles.cardleft}>
            <div className={styles.cardleft1}>Active & Unpaid
              <InfoTooltip text="Employees currently active but pending payment status" />
            </div>
            <div className={styles.cardleft2}>{handleactiveunpaid()}</div>
            {/* <div className={styles.cardleft3}></div> */}
          </div>
          <div className={styles.cardright}>
            <div className={styles.cardlogo3}> <GraduationCap /></div>
          </div>
        </div>
        <div className={`${styles.card3} ${styles.animateOnScroll}`}  data-animate  style={{ "--delay": 0 }} onClick={()=>{navigate("/projects")}}>
          <div className={styles.cardleft}>
            <div className={styles.cardleft1}>Total Projects
              <InfoTooltip text="Projects currently running with active tasks assigned" />
            </div>
            <div className={styles.cardleft2}>{projects?.length}</div>
            {/* <div className={styles.cardleft3}></div> */}
          </div>
          <div className={styles.cardright}>
            <div className={styles.cardlogo1}><FolderKanban /></div>
          </div>
        </div>
      </div>
      <div className={styles.graphcontainer}>
        <div className={`${styles.graphleft} ${styles.animateOnScroll}`}  data-animate style={{ "--delay": 0 }}>
          <div className={styles.bothgraph}>
          <div className={styles.graphleft1}>Company Report
            <InfoTooltip text="Consolidated view of company-wide productivity and activity" />
          </div>
          {/* <div className={styles.graphleft2}>
            <div className={styles.graphtoggle}>
              <div className={`${styles.leftweekly} ${activegraph === "daily" ? styles.active : ""}`} onClick={handleDaily}>Daily</div>
              <div className={`${styles.leftweekly} ${activegraph === "weekly" ? styles.active : ""}`} onClick={handleWeekly}>Weekly</div>
              <div className={`${styles.leftweekly} ${activegraph === "monthly" ? styles.active : ""}`} onClick={handleMonthly}>Monthly</div>
            </div>
          </div> */}
          </div>
          <div className={styles.graphleft3}>
            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer>
                <AreaChart data={data}>

                  {/* Gradient Fill */}
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="10%" stopColor="#7C3AED" stopOpacity={0.4} />
                      <stop offset="90%" stopColor="#7C3AED" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  {/* Light dotted grid */}
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />

                  {/* Bottom labels */}
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF" }}
                  />

                  {/* Smooth Purple Area */}
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#7C3AED"
                    strokeWidth={3}
                    fill="url(#colorValue)"
                  />

                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
        <div className={`${styles.graphright} ${styles.animateOnScroll}`}  data-animate  style={{ "--delay": 0 }}>
          <div className={styles.graphrighttop}><TriangleAlert color='#FB2C36' />Red Flags
          <InfoTooltip text="Employees with missed reports, prolonged inactivity, or overdue tasks" /></div>
          <div className={styles.graphrightbottom}>
            {getYesterdayRedFlags().length === 0 ? (
  <div className={styles.emptyState}>
    🎉 No red flags detected yesterday
  </div>
) : (
  getYesterdayRedFlags().map((e, id) => {
    return (
      <div
  className={`${styles.graphright1} ${styles.animateOnScroll} ${
    id % 2 === 0 ? styles.fromLeft : styles.fromRight
  }`}
  data-animate
  style={{ "--delay": id }}
>

        <div className={styles.graphright2}>
          {/* <div className={styles.graphrightperformance}>
            {e.type?.map((t, i) => (
              <span key={i} className={styles.tags}>{t}</span>
            ))}
          </div> */}
          <div className={styles.graphrightname}>
            {redflagdetail(e?.userId?.toString())}
          </div>
          <div className={styles.graphrightdate}>
            {new Date(e.date).toLocaleDateString()}
          </div>
        </div>
        <div className={styles.graphright3}>
          <div className={`${styles.severity} ${severityClassMap[e.severity]}`}>
            {e.severity}
          </div>
        </div>
      </div>
    );
  })
)}

        
            {/* <div className={styles.graphright1}>
              <div className={styles.graphright2}>
                <div className={styles.graphrightperformance}>Poor Performance</div>
                <div className={styles.graphrightname}>Lisa Anderson</div>
                <div className={styles.graphrightdate}>2025-11-20</div>
              </div>
              <div className={styles.graphright3}>
                <div className={styles.graphrightlevel}>medium</div>
              </div>
            </div>
            <div className={styles.graphright1}>
              <div className={styles.graphright2}>
                <div className={styles.graphrightperformance}>Inactive Account</div>
                <div className={styles.graphrightname}>John Doe</div>
                <div className={styles.graphrightdate}>2025-11-15</div>
              </div>
              <div className={styles.graphright3}>
                <div className={styles.graphrightlevel}>low</div>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <div className={`${styles.tablecontainer} ${styles.animateOnScroll}`}  data-animate>
  <div className={styles.tabletop}>
    <div className={styles.tabletitle}>Recent Employees</div>

    {/* <select
      value={statusFilter}
      onChange={(e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1);
      }}
      className={styles.filterSelect}
    >
      <option value="All">All</option>
      <option value="Active & Paid">Active & Paid</option>
      <option value="Active & Unpaid">Active & Unpaid</option>
      <option value="Inactive">Inactive</option>
      <option value="Onboarding">Onboarding</option>
    </select> */}
  </div>

  <table className={styles.employeeTable}>
    <thead>
      <tr>
        <th
          onClick={() =>
            setSortOrder(sortOrder === "desc" ? "asc" : "desc")
          }
          style={{ cursor: "pointer" }}
        >
          Employee {sortOrder === "desc" ? "↓" : "↑"}
        </th>
        <th>Status</th>
        <th>Role</th>
        <th>Projects</th>
        <th>Issues</th>
        <th>Tasks</th>
      </tr>
    </thead>

    <tbody>
      {paginatedEmployees.map((row) => (
        <tr key={row._id}>
          <td>{row.name}</td>
          <td>
            <span className={`${styles.status} ${statusClassMap[row.status]}`}>
              {row.status}
            </span>
          </td>
          <td>{row.role}</td>
          <td>{row.Projects?.length || 0}</td>
          <td>{row.issues || 0}</td>
          <td>{row.Tasks?.length || 0}</td>
        </tr>
      ))}
    </tbody>
  </table>

  <div className={styles.pagination}>
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(p => p - 1)}
    >
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

    <button
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage(p => p + 1)}
    >
      Next
    </button>
  </div>
</div>

    </div>
 {overlay && (
  <div className={styles.overlay} onClick={() => setoverlay(false)}>
    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

      {/* CLOSE */}
      <button className={styles.closeBtn} onClick={() => setoverlay(false)}>
        <X onClick={()=>{setoverlay(false)}}/>
      </button>

      {/* TITLE */}
      <div className={styles.titleRow}>
        <div className={styles.line}></div>
        <h2>Add Employee</h2>
        <div className={styles.line}></div>
      </div>

      {/* BASIC DETAILS */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Basic Details<span style={{color:"red",margin:"0px 5px"}}>*</span>:</p>

        <div className={styles.row2}>
          <div className={styles.field}>
            <span>First name</span>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <span>Last name</span>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.fieldFull}>
          <span>email ID</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={styles.fieldFull}>
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>

      {/* OTHER DETAILS */}
      {/* <div className={styles.section}>
        <p className={styles.sectionTitle}>Other Details<span style={{color:"red",margin:"0px 5px"}}>*</span>:</p>
        <div className={styles.divider}></div>

        <div className={styles.row2}>
          <div className={styles.field}>
            <span>Date of birth</span>
            <input
              type="date"
              value={dob}
              className={styles.overlaydate}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <span>Gender</span>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option></option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>
      </div> */}

      {/* SAVE */}
      <div className={styles.footer}>
        <button className={styles.saveBtn} onClick={handleaddu}>
          {loading ? "Adding..." : "Save →"}
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
