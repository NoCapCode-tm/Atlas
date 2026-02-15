import React from "react";
import styles from "../CSS/DailyReports.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

import {
  Clock,
  Plus,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock1,
  Send,
  X
} from "lucide-react";
import { toast } from "react-toastify";

export default function DailyReports() {
  const [reports, setReports] = useState([]);
  const[user,setUser]=useState(null)
const [loading, setLoading] = useState(true);
const[overlay,setOverlay]=useState(false)
const [tasks, setTasks] = useState([])
const [summary, setSummary] = useState("");
// const [subtasks, setSubtasks] = useState([]);
const [newSubtask, setNewSubtask] = useState("");
const [submitting, setSubmitting] = useState(false);
const [timeLeft, setTimeLeft] = useState("");
const [progress, setProgress] = useState(0);
const [showTaskDropdown, setShowTaskDropdown] = useState(false);
const [selectedTasks, setSelectedTasks] = useState([]);
const [allTasks, setAllTasks] = useState([]);





useEffect(() => {
  let mounted = true;

  const loadDashboard = async () => {
    setLoading(true);
    const startTime = Date.now();

    try {
      const [
        userRes,
        taskRes,
      ] = await Promise.all([
        axios.get("https://atlasbackend-px53.onrender.com/api/v1/admin/getuser", { withCredentials: true }),
        axios.get("https://atlasbackend-px53.onrender.com/api/v1/admin/getalltask"),
      ]);

      if (!mounted) return;

      setUser(userRes.data.message);
      const today = dayjs().startOf("day");

const todaysTasks = taskRes.data.message.filter((task) => {
  return (
    task.assignedto === userRes.data.message._id &&
    dayjs(task.dueAt).isSame(today, "day")
  );
});

setTasks(
  todaysTasks.map(task => ({
    id: task._id,
    text: task.title || task.name,
    done: task.status === "Completed"
  }))
);
const allUserTasks = taskRes.data.message.filter(
  t => t.assignedto === userRes.data.message._id
);
setAllTasks(allUserTasks);



    } catch (err) {
      toast.error("Failed to load dashboard");
    } finally {
      const elapsed = Date.now() - startTime;
      const delay = Math.max(800 - elapsed, 0);

      setTimeout(() => {
        if (mounted) setLoading(false);
      }, delay);
    }
  };

  loadDashboard();

  return () => {
    mounted = false;
  };
}, []);
const buildRelatedTasks = () => {
  return completedTasks.map(t => t.id);
};


const completedTasks = [
  ...tasks.filter(t => t.done),
  ...selectedTasks
];

const completed = completedTasks.length;

      

useEffect(() => {
  if (!user?._id) return;

  const fetchReports = async () => {
    try {
      const res = await axios.get(
        "https://atlasbackend-px53.onrender.com/api/v1/admin/getreports",
        { withCredentials: true }
      );

      const userReports = res.data.message.filter(
        (r) => r.user === user._id
      );

      const last7Days = [...Array(7)].map((_, i) =>
        dayjs().subtract(i, "day").startOf("day")
      );

      const formatted = last7Days.map((day) => {
        const found = userReports.find((r) =>
          dayjs(r.date).isSame(day, "day")
        );

        if (!found) {
          return {
            date: day,
            status: "missed",
          };
        }

        return {
          ...found,
          date: day,
          status: day.isSame(dayjs(), "day")
            ? "draft"
            : "submitted",
        };
      });

      setReports(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchReports();
}, [user]);

const formatDate = (date) => {
  if (dayjs(date).isSame(dayjs(), "day")) return "Today";
  if (dayjs(date).isSame(dayjs().subtract(1, "day"), "day"))
    return "Yesterday";
  return dayjs(date).format("ddd, MMM DD");
};

//overlay

// const handleAddSubtask = () => {
//   if (!newSubtask.trim()) return;

//   setSubtasks(prev => [
//     ...prev,
//     { title: newSubtask.trim() }
//   ]);

//   setNewSubtask("");
// };

const handleSubmitReport = async () => {

  try {
    setSubmitting(true);
     console.log(summary)
    await axios.post(
      "https://atlasbackend-px53.onrender.com/api/v1/employee/submitreport",
      {
        user: user._id,
        summary:summary,
        relatedtasks: buildRelatedTasks(),
        // subtasks:subtasks
      },
      { withCredentials: true }
    );

    toast.success("Daily report submitted");

    setOverlay(false);
    setSummary("");
    // setSubtasks([]);
    setNewSubtask([]);
    window.location.reload()

  } catch (err) {
    toast.error("Failed to submit report");
  } finally {
    setSubmitting(false);
  }
};

//timer working
const getNextDeadline = () => {
  const now = dayjs();
  let deadline = dayjs().startOf("day").add(1, "day");

  if (now.isAfter(deadline)) {
    deadline = deadline.add(1, "day");
  }

  return deadline;
};


useEffect(() => {
  const deadline = getNextDeadline();
  const totalDuration = 24 * 60 * 60 * 1000; // 24 hours

  const interval = setInterval(() => {
    const now = dayjs();
    const diff = deadline.diff(now);

    if (diff <= 0) {
      setTimeLeft("00:00:00");
      setProgress(100);
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    setTimeLeft(
      `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    );

    const elapsed = totalDuration - diff;
    const percent = Math.min((elapsed / totalDuration) * 100, 100);
    setProgress(percent);
  }, 1000);

  return () => clearInterval(interval);
}, []);





  return (
    <>
    <div className={styles.page}>
      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <h1>Daily Reports</h1>
          <p>Manage your daily tasks and submissions.</p>
        </div>

        <div className={styles.dateBox}>
          <span>Saturday</span>
          <small>20 December 2025</small>
        </div>
      </div>

      {/* TOP CARDS */}
      <div className={styles.topGrid}>
       <div className={styles.deadlineCard}>
  <div className={styles.deadlineLeft}>
    <div className={styles.iconCircle}>
      <Clock size={22} />
    </div>

    <div className={styles.deadlineText}>
      <h4>Daily Report Deadline</h4>
      <p>Submissions close at 12:00 PM</p>
    </div>
  </div>

  <div className={styles.timerWrap}>
    <Clock1 className={styles.clockBg} />

    <div className={styles.timer}>
      {(() => {
  const [hhmm, ss] =
    timeLeft.split(":").length === 3
      ? [timeLeft.slice(0, 5), timeLeft.slice(6)]
      : [timeLeft, "00"];

  return (
    <div className={styles.timeRow}>
      <span className={styles.timeMain}>{hhmm}</span>
      <span className={styles.timeSec}>:{ss}</span>
      <small className={styles.timeLabel}>left</small>
    </div>
  );
})()}


      {/* 👇 TIME KE NEECHE PROGRESS */}
      <div className={styles.inlineProgress}>
  <div
    className={styles.inlineFill}
    style={{ width: `${100-progress}%` }}
  />
</div>

    </div>
  </div>

  {/* 👇 CARD BORDER PROGRESS */}
  <div className={styles.borderProgress}>
  <div
    className={styles.borderFill}
    style={{ width: `${100-progress}%` }}
  />
</div>

</div>



        <div className={styles.submitCard}>
          <h4>Ready to submit?</h4>
          <p>Don't forget to attach your work summary.</p>

          <button onClick={()=>{setOverlay(true)}}>
            <Plus size={16} /> Submit Daily Report
          </button>
        </div>
      </div>

      {/* PAST REPORTS */}
      <div className={styles.pastReports}>
  <div className={styles.pastHeader}>
    <div className={styles.iconhead}>
      <FileText color="rgba(104, 78, 185, 1)" />
      <h3>Past Reports</h3>
    </div>
    <span>Last 7 Days</span>
  </div>

  {!loading &&
    reports.map((report, idx) => {
      if (report.status === "draft") {
        return (
          <div key={idx} className={styles.reportItem}>
            <div className={`${styles.statusIcon} ${styles.draft}`}>
              <FileText size={16} />
            </div>

            <div className={styles.reportInfo}>
              <h4>
                {formatDate(report.date)}{" "}
                <span className={styles.draftBadge}>Draft</span>
              </h4>
              <p>{report.summary}</p>
              <small>
                {report.relatedtasks?.length || 0} Tasks
              </small>
            </div>
          </div>
        );
      }

      if (report.status === "submitted") {
        return (
          <div key={idx} className={styles.reportItem}>
            <div className={`${styles.statusIcon} ${styles.success}`}>
              <CheckCircle size={16} />
            </div>

            <div className={styles.reportInfo}>
              <h4>
                {formatDate(report.date)}{" "}
                <span className={styles.successBadge}>Submitted</span>
              </h4>
              <p>{report.summary}</p>
              <small>
                {report.relatedtasks?.length || 0} Tasks
              </small>
            </div>
          </div>
        );
      }

      return (
        <div key={idx} className={styles.reportItem}>
          <div className={`${styles.statusIcon} ${styles.missed}`}>
            <AlertCircle size={16} />
          </div>

          <div className={styles.reportInfo}>
            <h4>
              {formatDate(report.date)}{" "}
              <span className={styles.missedBadge}>Missed</span>
            </h4>
            <p>No report submitted.</p>
          </div>
        </div>
      );
    })}
</div>

    </div>

    {overlay && (
      <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* HEADER */}
        <div className={styles.header1}>
          <div>
            <h2>Daily Report</h2>
            <p>{new Date().toLocaleString("en-IN",{
              weekday:"long",
              day:"2-digit",
              month:"short",
              year:"numeric"

            })}</p>
          </div>
          <X className={styles.close} onClick={()=>{setOverlay(false)}} />
        </div>

        {/* TASK CHECKLIST */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Task Checklist</h3>
            <span>{completed}/{tasks.length} Completed</span>
          </div>

          <div className={styles.taskBox}>
            {completedTasks.map((task, i) => (
  <label key={i} className={styles.task}>
    <input type="checkbox" checked readOnly />
    <span className={styles.done}>{task.text}</span>
  </label>
))}
            {/* {subtasks.length > 0 && (
  <div className={styles.subtaskList}>
    {subtasks.map((st, i) => (
      <div key={i} className={styles.subtaskItem}>
        • {st.title}
      </div>
    ))}
  </div>
)} */}

            <div className={styles.addTaskDropdownWrapper}>
  <div
    className={styles.addTaskDropdown}
    onClick={() => setShowTaskDropdown(prev => !prev)}
  >
    + Add completed task
  </div>

  {showTaskDropdown && (
    <div className={styles.dropdownList}>
      {allTasks
        .filter(
          t =>
            !completedTasks.some(ct => ct.id === t._id)
        )
        .map(task => (
          <div
            key={task._id}
            className={styles.dropdownItem}
            onClick={() => {
              setSelectedTasks(prev => [
                ...prev,
                { id: task._id, text: task.title }
              ]);
              setShowTaskDropdown(false);
            }}
          >
            <input type="checkbox" checked readOnly />
            <span>{task.title}</span>
          </div>
        ))}
    </div>
  )}
</div>

          </div>
        </div>

        {/* SUMMARY */}
        <div className={styles.section}>
          <h3>Work Summary</h3>
          <textarea placeholder="Describe any blockers, achievements, or notes for tomorrow..." value={summary} onChange={(e)=>{setSummary(e.target.value)}} />
          <div className={styles.footerNote}>
            <span>Markdown supported</span>
            <span>Saved at 20:59</span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className={styles.actions}>
          <button className={styles.cancel} onClick={()=>{setOverlay(false)}}>
            Cancel
          </button>
          <button
  className={styles.submit}
  onClick={handleSubmitReport}
  disabled={submitting}
>
  <Send size={16} />
  {submitting ? "Submitting..." : "Submit Report"}
</button>

        </div>
      </div>
    </div>
    )}

    </>
  );
}
