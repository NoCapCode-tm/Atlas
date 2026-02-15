import React, { useEffect, useState } from "react";
import styles from "../CSS/ProductivityReport.module.css";
import axios from "axios";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";
import { InfoTooltip } from "./InfoTooltip";

const ProductivityReport = () => {
  const [metrics, setMetrics] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 5;

  const indexOfLast = currentPage * employeesPerPage;
  const indexOfFirst = indexOfLast - employeesPerPage;
  const currentEmployees = employees.slice(indexOfFirst, indexOfLast);

  // =========================
  // DATA FETCHING
  // =========================
  useEffect(() => {
    (async () => {
      const res = await axios.get(
        "https://atlasbackend-px53.onrender.com/api/v1/admin/getmetrics"
      );
      setMetrics(res.data.message || []);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const res = await axios.get(
        "https://atlasbackend-px53.onrender.com/api/v1/admin/getattendance"
      );
      setAttendance(res.data.message || []);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const res = await axios.get(
        "https://atlasbackend-px53.onrender.com/api/v1/admin/getalluser",
        { withCredentials: true }
      );
      setEmployees(res.data.message || []);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const res = await axios.get(
        "https://atlasbackend-px53.onrender.com/api/v1/admin/getalltask",
        { withCredentials: true }
      );
      setTasks(res.data.message || []);
    })();
  }, []);

  // =========================
  // DATE HELPERS (IST SAFE)
  // =========================
  const toISTDateKey = (date) =>
    new Date(date).toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata"
    });

  const getISTWeekday = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      timeZone: "Asia/Kolkata"
    });

  const getLast6DaysIST = () => {
    const days = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push({
        key: toISTDateKey(d),
        label: getISTWeekday(d)
      });
    }
    return days;
  };

  const last6Days = getLast6DaysIST();

  // =========================
  // BAR CHART (METRICS)
  // =========================
  const barChartData = last6Days.map(d => {
    const m = metrics.find(
      x => toISTDateKey(x.date) === d.key
    );

    return {
      day: d.label,
      tasks: m?.tasksCompleted || 0
    };
  });

  // =========================
  // AREA CHART (ATTENDANCE)
  // =========================
  const attendanceByDate = attendance.reduce((acc, a) => {
    const key = toISTDateKey(a.date);
    acc[key] = (acc[key] || 0) + (a.timespent || 0);
    return acc;
  }, {});

  const lineChartData = last6Days.map(d => ({
    day: d.label,
    hours: Math.round((attendanceByDate[d.key] || 0) / 60)
  }));

  // =========================
  // TABLE DATA
  // =========================
  const minutesBetween = (start, end) => {
    if (!start || !end) return 0;
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    if (isNaN(s) || isNaN(e) || e <= s) return 0;
    return Math.round((e - s) / (1000 * 60));
  };

  const tableData = currentEmployees.map(emp => {
    const empTasks = tasks.filter(t =>
      String(t.assignedto) === String(emp._id)
    );

    const completedTasks = empTasks.filter(
      t => (t.status || "").toLowerCase() === "completed"
    );

    const totalMinutes = completedTasks.reduce(
      (sum, t) => sum + minutesBetween(t.createdAt, t.completedAt),
      0
    );

    const avgMinutes = completedTasks.length
      ? Math.round(totalMinutes / completedTasks.length)
      : 0;

    const avgTime =
      avgMinutes >= 60
        ? `${Math.floor(avgMinutes / 60)}h ${avgMinutes % 60}m`
        : `${avgMinutes}m`;

    return {
      name: emp.name,
      role: emp.designation?.name || "No Role",
      assignedCount: empTasks.length,
      completedCount: completedTasks.length,
      avgTime: completedTasks.length ? avgTime : "-",
      score: emp.productivityScore ?? "88%"
    };
  });

  // =========================
  // JSX (UNCHANGED)
  // =========================
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>
        Productivity Report
        <InfoTooltip text="Detailed insights into individual and team productivity" />
      </h1>

      <p className={styles.subtitle}>Company</p>

      <div className={styles.chartRow}>
        <div className={styles.card}>
          <h3>Average tasks completed per week</h3>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barChartData} barSize={50}>
              <CartesianGrid vertical={false} horizontal={false} />
              <XAxis dataKey="day" tick={false} />
              <YAxis tick={false} />
              <Tooltip />
              <Bar
                dataKey="tasks"
                fill="#a78bfa"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.card}>
          <h3>Hours logged vs Output</h3>

          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={lineChartData}>
              <defs>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6850BE" stopOpacity={1} />
                  <stop offset="100%" stopColor="#EBE4FF" stopOpacity={1} />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} />
              <XAxis dataKey="day" tick={false} />
              <YAxis tick={false} />
              <Tooltip />

              <Area
                type="monotone"
                dataKey="hours"
                stroke="transparent"
                fill="url(#colorHours)"
                fillOpacity={1}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Tasks assigned</th>
              <th>Tasks done</th>
              <th>Avg. time/task</th>
              <th>Productivity score</th>
            </tr>
          </thead>

          <tbody>
            {tableData.map((row, i) => (
              <tr key={i}>
                <td className={styles.userCell}>
                  <span className={styles.avatar}>{row.name[0]}</span>
                  {row.name}
                </td>
                <td><span className={styles.roleTag}>{row.role}</span></td>
                <td>Tasks Assigned <span className={styles.taskBadge}>{row.assignedCount}</span></td>
                <td>Tasks Completed <span className={styles.taskBadge}>{row.completedCount}</span></td>
                <td>{row.avgTime}</td>
                <td className={styles.scoreGood}>{row.score}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.pagination}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className={styles.pageBtn}
          >
            ⬅ Prev
          </button>

          <span className={styles.pageNumber}>Page {currentPage}</span>

          <button
            disabled={indexOfLast >= employees.length}
            onClick={() => setCurrentPage(p => p + 1)}
            className={styles.pageBtn}
          >
            Next ➡
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductivityReport;
