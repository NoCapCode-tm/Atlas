import React, { useEffect, useMemo, useState } from "react";
import styles from "../CSS/Calendarpage.module.css";
import { ChevronLeft, ChevronRight, Plus, SlidersHorizontal, Bell, CheckSquare } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import useWindowWidth from "../../useWindowWidth";

/* ── Color map matching the image ── */
const LEVEL_COLORS = {
  strong: "#1a7a4a",   // green circle
  good:   "#2d2fa8",   // blue/indigo circle
  needs:  "#b07d00",   // amber/gold circle
  missed: "#8b1a1a",   // dark red circle
  future: "transparent",
};

/* ── TodoTabs sub-component ── */
function TodoTabs({ meetingsCount, tasksCount, meetings, tasks }) {
  const [activeTab, setActiveTab] = useState("tasks");

  return (
    <>
      {/* Tab pills */}
      <div className={styles.mobileTodoPills}>
        <button
          className={`${styles.mobileTodoPill} ${activeTab === "meetings" ? styles.mobileTodoPillActive : ""}`}
          onClick={() => setActiveTab("meetings")}
        >
          {meetingsCount} meetings
        </button>
        <button
          className={`${styles.mobileTodoPill} ${activeTab === "tasks" ? styles.mobileTodoPillActive : ""}`}
          onClick={() => setActiveTab("tasks")}
        >
          {tasksCount} tasks
        </button>
      </div>

      {/* Task / Meeting rows */}
      <div className={styles.mobileTodoList}>
        {activeTab === "tasks" ? (
          tasks.length === 0 ? (
            <p className={styles.mobileTodoEmpty}>No tasks due today</p>
          ) : (
            tasks.map((t, i) => (
              <div key={i} className={styles.mobileTodoRow}>
                <div className={`${styles.mobileTodoCheck} ${t.status === "Completed" ? styles.mobileTodoChecked : ""}`}>
                  {t.status === "Completed" && <CheckSquare size={14} color="#fff" />}
                </div>
                <span className={`${styles.mobileTodoText} ${t.status === "Completed" ? styles.mobileTodoDone : ""}`}>
                  {t.title}
                </span>
              </div>
            ))
          )
        ) : (
          meetings.map((m, i) => (
            <div key={i} className={styles.mobileTodoRow}>
              <div className={styles.mobileTodoCheck}>
                <CheckSquare size={14} color="#fff" />
              </div>
              <span className={styles.mobileTodoText}>{m.title}</span>
              <span className={styles.mobileTodoTime}>{m.time}</span>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default function Calendarpage() {
  const [user, setUser]           = useState("");
  const [tasks, setTasks]         = useState([]);
  const [projects, setProjects]   = useState([]);
  const [reports, setReports]     = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const width = useWindowWidth();
  const isMobile = width < 768;

  /* ── Data loading ── */
  useEffect(() => {
    if (user && tasks.length >= 0 && projects.length >= 0 && attendance && reports) {
      const t = setTimeout(() => setPageLoading(false), 600);
      return () => clearTimeout(t);
    }
  }, [user, tasks, projects, attendance, reports]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setPageLoading(true);
      const startTime = Date.now();
      try {
        const [userRes, taskRes, projectRes, attendanceRes, reportRes] = await Promise.all([
          axios.get("b-atlas-ncc.onrender.com/api/v1/admin/getuser", { withCredentials: true }),
          axios.get("b-atlas-ncc.onrender.com/api/v1/admin/getalltask"),
          axios.get("b-atlas-ncc.onrender.com/api/v1/admin/getallproject"),
          axios.get("b-atlas-ncc.onrender.com/api/v1/admin/getattendance"),
          axios.get("b-atlas-ncc.onrender.com/api/v1/admin/getreports"),
        ]);
        if (!mounted) return;
        setUser(userRes.data.message);
        setTasks(taskRes.data.message);
        setProjects(projectRes.data.message);
        const userId = userRes.data.message._id;
        setAttendance(attendanceRes.data.message.filter(a => String(a.user) === String(userId)));
        setReports(reportRes.data.message.filter(r => String(r.user) === String(userId)));
      } catch {
        toast.error("Failed to load calendar");
      } finally {
        const delay = Math.max(800 - (Date.now() - startTime), 0);
        setTimeout(() => { if (mounted) setPageLoading(false); }, delay);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  /* ── Date helpers ── */
  const getDateKey = (date) => {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().slice(0, 10);
  };

  const today = new Date();
  const [currentYear, setCurrentYear]   = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const daysInMonth    = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay       = new Date(currentYear, currentMonth, 1).getDay();
  const isCurrentMonth = currentYear === today.getFullYear() && currentMonth === today.getMonth();
  const lastVisibleDay = isCurrentMonth ? today.getDate() : daysInMonth;

  const goPrevMonth = () => {
    setCurrentMonth(prev => {
      if (prev === 0) { setCurrentYear(y => y - 1); return 11; }
      return prev - 1;
    });
  };

  const goNextMonth = () => {
    if (isCurrentMonth) return;
    setCurrentMonth(prev => {
      if (prev === 11) { setCurrentYear(y => y + 1); return 0; }
      return prev + 1;
    });
  };

  /* ── Calendar day data ── */
  const calendarDays = useMemo(() => {
    if (!user?._id) return [];
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      if (day > lastVisibleDay) return { day, level: "future", dateKey: null };

      const date    = new Date(currentYear, currentMonth, day);
      const dateKey = getDateKey(date);

      const hasAttendance = attendance.some(a => a.date && getDateKey(a.date) === dateKey);
      const report        = reports.find(r => r.createdAt && getDateKey(r.createdAt) === dateKey);

      if (!hasAttendance || !report) return { day, level: "missed", dateKey, report: null };

      const dayTasks       = tasks.filter(t => String(t.assignedto) === String(user._id) && t.dueAt && getDateKey(t.dueAt) === dateKey);
      const completedTasks = dayTasks.filter(t => t.status === "Completed");

      if (dayTasks.length === 0)                              return { day, level: "strong", dateKey, report };
      if (completedTasks.length === dayTasks.length)          return { day, level: "strong", dateKey, report };
      if (completedTasks.length > 0)                          return { day, level: "good",   dateKey, report };
      return { day, level: "needs", dateKey, report };
    });
  }, [attendance, reports, tasks, user?._id, currentYear, currentMonth, lastVisibleDay]);

  const monthLabel = new Date(currentYear, currentMonth).toLocaleString("en-US", { month: "long", year: "numeric" });

  /* ── Desktop day cell ── */
  function CalendarDay({ dayData }) {
    const [show, setShow] = useState(false);
    return (
      <div className={styles.dayCell}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}>
        <span>{dayData.day}</span>
        {dayData.level !== "future" && (
          <span className={`${styles.dot} ${styles[dayData.level]}`} />
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

  /* ── Loader ── */
  if (pageLoading) {
    return (
      <div className={styles.pageLoader}>
        <div className={styles.loaderCard}>
          <div className={styles.spinner} />
          <p>Loading your workspace…</p>
        </div>
      </div>
    );
  }

  /* ================================================================
     MOBILE LAYOUT — matches the image exactly
     ================================================================ */
  if (isMobile) {
    // Today's tasks for the employee
    const todayKey = getDateKey(today);
    const todayTasks = tasks.filter(
      t => String(t.assignedto) === String(user?._id) && t.dueAt && getDateKey(t.dueAt) === todayKey
    );

    // Static meetings (no meetings API yet)
    const todayMeetings = [
      { title: "Team Sync",          time: "10:00 AM" },
      { title: "Manager 1:1",        time: "02:00 PM" },
      { title: "Department Meeting",  time: "04:00 PM" },
    ];

    return (
      <div className={styles.mobilePage}>

        {/* ── PAGE TITLE ── */}
        <div className={styles.mobilePageTitle}>Calendar</div>

        {/* ── CALENDAR CARD ── */}
        <div className={styles.mobileCard}>

          {/* Month header + nav */}
          <div className={styles.mobileHeader}>
            <h2 className={styles.mobileMonthLabel}>{monthLabel}</h2>
            <div className={styles.mobileNav}>
              <button className={styles.mobileNavBtn} onClick={goPrevMonth}>
                <ChevronLeft size={20} color="#fff" />
              </button>
              <button
                className={styles.mobileNavBtn}
                onClick={goNextMonth}
                style={{ opacity: isCurrentMonth ? 0.3 : 1 }}
              >
                <ChevronRight size={20} color="#fff" />
              </button>
            </div>
          </div>

          {/* Weekday labels */}
          <div className={styles.mobileWeekdays}>
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>

          {/* Day grid — circles */}
          <div className={styles.mobileGrid}>
            {[...Array(firstDay)].map((_, i) => (
              <div key={`e-${i}`} className={styles.mobileEmptyCell} />
            ))}
            {calendarDays.map((d, i) => {
              const isFuture = d.level === "future";
              const isToday  = isCurrentMonth && d.day === today.getDate();
              return (
                <div key={i} className={styles.mobileDayCell}>
                  <div
                    className={styles.mobileDayCircle}
                    style={{
                      background: isFuture ? "transparent" : LEVEL_COLORS[d.level],
                      color:      isFuture ? "#3a3f55" : "#ffffff",
                      border:     isToday  ? "2px solid #ffffff" : "none",
                    }}
                  >
                    {d.day}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend — 2 columns */}
          <div className={styles.mobileLegend}>
            <div className={styles.mobileLegendItem}>
              <span style={{ background: LEVEL_COLORS.strong }} className={styles.mobileLegendDot} />
              <span>Strong day</span>
            </div>
            <div className={styles.mobileLegendItem}>
              <span style={{ background: LEVEL_COLORS.good }} className={styles.mobileLegendDot} />
              <span>Good / average</span>
            </div>
            <div className={styles.mobileLegendItem}>
              <span style={{ background: LEVEL_COLORS.needs }} className={styles.mobileLegendDot} />
              <span>Needs improvement</span>
            </div>
            <div className={styles.mobileLegendItem}>
              <span style={{ background: LEVEL_COLORS.missed }} className={styles.mobileLegendDot} />
              <span>Missed report / task</span>
            </div>
          </div>
        </div>

        {/* ── TODAY'S TO-DO SECTION ── */}
        <div className={styles.mobileTodoSection}>
          <h3 className={styles.mobileTodoTitle}>Today's to-do</h3>

          {/* Tab pills */}
          <TodoTabs
            meetingsCount={todayMeetings.length}
            tasksCount={todayTasks.length}
            meetings={todayMeetings}
            tasks={todayTasks}
          />
        </div>

        {/* ── FLOATING + BUTTON ── */}
        <button className={styles.mobileFab}>
          <Plus size={22} color="#fff" />
        </button>

      </div>
    );
  }

  /* ================================================================
     DESKTOP LAYOUT (unchanged)
     ================================================================ */
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.monthInfo}>
          <h1>{monthLabel}</h1>
          <p>{calendarDays.filter(d => d.level !== null).length} Events this month.</p>
        </div>
        <button className={styles.addEventBtn}>
          <Plus size={16} /> Add Event
        </button>
      </div>

      <div className={styles.layout}>
        {/* LEFT CALENDAR */}
        <div className={styles.calendarCard}>
          <div className={styles.calendarHeader}>
            <div className={styles.headerActions}>
              <div className={styles.nav}>
                <ChevronLeft size={30} onClick={goPrevMonth} color="white" />
                <ChevronRight
                  color="white"
                  size={30}
                  onClick={goNextMonth}
                  style={{ opacity: isCurrentMonth ? 0.3 : 1 }}
                />
              </div>
            </div>
          </div>

          <div className={styles.weekdays}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className={styles.grid}>
            {[...Array(firstDay)].map((_, i) => <div key={`e-${i}`} />)}
            {calendarDays.map((d, i) => <CalendarDay key={i} dayData={d} />)}
          </div>

          <div className={styles.legend}>
            <div><span className={styles.strong} />&nbsp;Strong day</div>
            <div><span className={styles.good} />&nbsp;Good / average</div>
            <div><span className={styles.needs} />&nbsp;Needs improvement</div>
            <div><span className={styles.missed} />&nbsp;Missed report / task</div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className={styles.side}>
          <div className={styles.sideCard}>
            <div className={styles.sideHeader}>
              <h3>Today — {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}</h3>
              <button className={styles.addEvent}><Plus size={16} /> Add</button>
            </div>
            <div className={styles.eventsList}>
              <div className={`${styles.item} ${styles.purple}`}>
                <b>Daily Report</b><p>Submit weekly daily report</p><span>Oct 21</span>
              </div>
              <div className={`${styles.item} ${styles.blue}`}>
                <b>Weekly Report</b><p>Submit weekly progress report</p><span>Oct 21</span>
              </div>
              <div className={`${styles.item} ${styles.yellow}`}>
                <b>Performance Review</b><p>Complete self-assessment form</p><span>Oct 7</span>
              </div>
            </div>
          </div>

          <div className={styles.sideCard}>
            <div className={styles.sideHeader}><h3>Upcoming Meetings</h3></div>
            <div className={styles.meetingsList}>
              <div className={styles.meet}>
                <div><b>Team Sync</b><p>Details...</p></div>
                <span>Oct 2, 10:00 AM</span>
              </div>
              <div className={styles.meet}>
                <div><b>Manager 1:1</b><p>Details...</p></div>
                <span>Oct 8, 10:00 AM</span>
              </div>
              <div className={styles.meet}>
                <div><b>Department Meeting</b><p>Details...</p></div>
                <span>Oct 8, 10:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
