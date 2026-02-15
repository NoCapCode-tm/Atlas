import React, { useEffect, useMemo, useState } from "react";
import styles from "../CSS/Calendarpage.module.css";
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Video } from "lucide-react";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";

export default function Calendarpage() {
    const[user,setUser] = useState("")
  const[tasks,setTasks]=useState([])
  const navigate = useNavigate()
  const[projects,setProjects]=useState([])
  const[reports,setReports]=useState([])
  const[attendance,setAttendance]=useState([])
  const [pageLoading, setPageLoading] = useState(true);

useEffect(() => {
  if (
    user &&
    tasks.length >= 0 &&
    projects.length >= 0 &&
    attendance &&
    reports 
  ) {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 600); 

    return () => clearTimeout(timer);
  }
}, [user, tasks, projects, attendance, reports]);

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
      
      ] = await Promise.all([
        axios.get("https://prismbackend-27d920759150.herokuapp.com/api/v1/admin/getuser", { withCredentials: true }),
        axios.get("https://prismbackend-27d920759150.herokuapp.com/api/v1/admin/getalltask"),
        axios.get("https://prismbackend-27d920759150.herokuapp.com/api/v1/admin/getallproject"),
        axios.get("https://prismbackend-27d920759150.herokuapp.com/api/v1/admin/getattendance"),
        axios.get("https://prismbackend-27d920759150.herokuapp.com/api/v1/admin/getreports"),
        // axios.get("https://prismbackend-27d920759150.herokuapp.com/api/v1/admin/getannouncements")
      ]);

      if (!mounted) return;

      setUser(userRes.data.message);
      setTasks(taskRes.data.message);
      setProjects(projectRes.data.message);

      const userId = userRes.data.message._id;

      setAttendance(
        attendanceRes.data.message.filter(a => String(a.user) === String(userId))
      );

      setReports(
        reportRes.data.message.filter(r => String(r.user) === String(userId))
      );

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
const getDateKey = (date) => {
  const d = new Date(date);
  return new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate()
  ).toISOString().slice(0, 10);
};


 const today = new Date();

const [currentYear, setCurrentYear] = useState(today.getFullYear());
const [currentMonth, setCurrentMonth] = useState(today.getMonth());

const todayDate = today.getDate(); 


 const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
const firstDay = new Date(currentYear, currentMonth, 1).getDay();

const isCurrentMonth =
  currentYear === today.getFullYear() &&
  currentMonth === today.getMonth();

const lastVisibleDay = isCurrentMonth
  ? today.getDate()
  : daysInMonth;


  const getKey = (d) => {
  const date = new Date(d);
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
};

const goPrevMonth = () => {
  setCurrentMonth(prev => {
    if (prev === 0) {
      setCurrentYear(y => y - 1);
      return 11;
    }
    return prev - 1;
  });
};

const goNextMonth = () => {
  if (isCurrentMonth) return;

  setCurrentMonth(prev => {
    if (prev === 11) {
      setCurrentYear(y => y + 1);
      return 0;
    }
    return prev + 1;
  });
};



 const calendarDays = useMemo(() => {
  if (!user?._id) return [];

  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;

    if (day > lastVisibleDay) {
      return { day, level: "future", dateKey: null };
    }

    const date = new Date(currentYear, currentMonth, day);
    const dateKey = getDateKey(date);

    const hasAttendance = attendance.some(
      a => a.date && getDateKey(a.date) === dateKey
    );

    const report = reports.find(
      r => r.createdAt && getDateKey(r.createdAt) === dateKey
    );

    if (!hasAttendance || !report) {
      return { day, level: "missed", dateKey, report: null };
    }

    const dayTasks = tasks.filter(
      t =>
        String(t.assignedto) === String(user._id) &&
        t.dueAt &&
        getDateKey(t.dueAt) === dateKey
    );

    const completedTasks = dayTasks.filter(
      t => t.status === "Completed"
    );

   
    if (dayTasks.length === 0) {
      return { day, level: "strong", dateKey, report };
    }

    
    if (completedTasks.length === dayTasks.length) {
      return { day, level: "strong", dateKey, report };
    }

   
    if (completedTasks.length > 0) {
      return { day, level: "good", dateKey, report };
    }

    
    return { day, level: "needs", dateKey, report };
  });
}, [
  attendance,
  reports,
  tasks,
  user?._id,
  currentYear,
  currentMonth,
  lastVisibleDay
]);


const monthLabel = new Date(
  currentYear,
  currentMonth
).toLocaleString("en-US", { month: "long", year: "numeric" });

function CalendarDay({ dayData }) {
  const [show, setShow] = useState(false);

  return (
    <div
      className={styles.dayCell}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span>{dayData.day}</span>

      {dayData.level !== "future" && (
        <span
          className={`${styles.dot} ${styles[dayData.level]}`}
        />
      )}


      {show && dayData.report && (
        <div className={styles.reportTooltip}>
          <h4>{dayData.report.title || "Daily Report"}</h4>
          <p>{dayData.report.summary}</p>
        </div>
      )}
    </div>
  );
}




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
    <div className={styles.page}>
      <h1 className={styles.title}>Calendar</h1>

      <div className={styles.layout}>
        {/* LEFT CALENDAR */}
        <div className={styles.calendarCard}>
          <div className={styles.calendarHeader}>
  <h3>{monthLabel}</h3>

  <div className={styles.nav}>
    <ChevronLeft size={22} onClick={goPrevMonth} />

    <ChevronRight
      size={22}
      onClick={goNextMonth}
      style={{ opacity: isCurrentMonth ? 0.3 : 1 }}
    />
  </div>
</div>


          <div className={styles.weekdays}>
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className={styles.grid}>
  {[...Array(firstDay)].map((_, i) => (
    <div key={`e-${i}`} />
  ))}

  {calendarDays.map((d, i) => (
    <CalendarDay key={i} dayData={d} />
  ))}
</div>

          <h3 className={styles.indicatorhead}>Performance Indicators</h3>
          <div className={styles.legend}>
            <div><span className={styles.strong}></span>Strong day</div>
            <div><span className={styles.good}></span>Good / average</div>
            <div><span className={styles.needs}></span>Needs improvement</div>
            <div><span className={styles.missed}></span>Missed report / task</div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className={styles.side}>
          {/* DUE ITEMS */}
          <div className={styles.sideCard}>
            <div className={styles.sideHeader}>
              <h4>Due Items</h4>
              <Plus size={16}/>
            </div>

            <div className={`${styles.item} ${styles.purple}`}>
                <span>Oct 21</span>
              <b>Weekly Report</b>
              <p>Submit weekly progress report</p>
              
            </div>

            <div className={`${styles.item} ${styles.yellow}`}>
                <span>Oct 7</span>
              <b>Performance Review</b>
              <p>Complete self-assessment form</p>
              
            </div>

            <div className={`${styles.item} ${styles.blue}`}>
                <span>Oct 14</span>
              <b>Goals</b>
              <p>Submit objectives</p>
             
            </div>
          </div>

          {/* MEETINGS */}
          <div className={styles.sideCard}>
            <div className={styles.sideHeader}>
              <h4>Upcoming Meetings</h4>
              <Video size={16}/>
            </div>

            <div className={styles.meet}>
              <b>Team Sync</b>
              <span>Oct 2, 10:00 AM</span>
            </div>

            <div className={styles.meet}>
              <b>Manager 1:1</b>
              <span>Oct 8, 10:00 AM</span>
            </div>

            <div className={styles.meet}>
              <b>Department Meeting</b>
              <span>Oct 8, 10:00 PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
