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
        "https://b-atlas-ncc.onrender.com/api/v1/admin/getmetrics"
      );
      setMetrics(res.data.message || []);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const res = await axios.get(
        "https://b-atlas-ncc.onrender.com/api/v1/admin/getattendance"
      );
      setAttendance(res.data.message || []);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const res = await axios.get(
        "https://b-atlas-ncc.onrender.com/api/v1/admin/getalluser",
        { withCredentials: true }
      );
      setEmployees(res.data.message || []);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const res = await axios.get(
        "https://b-atlas-ncc.onrender.com/api/v1/admin/getalltask",
        { withCredentials: true }
      );
      setTasks(res.data.message || []);
    })();
  }, []);

  
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

 
  const barChartData = last6Days.map(d => {
    const m = metrics.find(
      x => toISTDateKey(x.date) === d.key
    );

    return {
      day: d.label,
      tasks: m?.tasksCompleted || 0
    };
  });


  const attendanceByDate = attendance.reduce((acc, a) => {
    const key = toISTDateKey(a.date);
    acc[key] = (acc[key] || 0) + (a.timespent || 0);
    return acc;
  }, {});

  const lineChartData = last6Days.map(d => ({
    day: d.label,
    hours: Math.round((attendanceByDate[d.key] || 0) / 60)
  }));

  
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


  return (
    <div className={styles.page}>
      <h1 className={styles.title}>
        Productivity Report
        <InfoTooltip text="Detailed insights into individual and team productivity" />
      </h1>

      <p className={styles.subtitle}>Company</p>

       <div className={styles.wrapper}>
      {/* Left Card */}

      <div className={styles.card}>

        <h3>
          Average tasks completed per week
        </h3>

        <div className={styles.chart}>
          <ResponsiveContainer
            width="100%"
            height={220}
          >
            <BarChart
              data={barChartData}
              margin={{
                top: 20,
                right: 15,
                left: 0,
                bottom: 0,
              }}
              barGap={8}
            >
              <CartesianGrid
                vertical={false}
                stroke="#17181d"
              />

              <XAxis
                dataKey="day"
                tick={{
                  fill: "#72737a",
                  fontSize: 12,
                }}
                tickLine={false}
                axisLine={false}
              />

              <YAxis
                hide
              />

              <Tooltip
                cursor={false}
                contentStyle={{
                  background: "#17181d",
                  border: "1px solid #2f3138",
                  color: "#fff",
                  borderRadius: 10,
                }}
              />

              <Bar
                dataKey="tasks"
                radius={[6, 6, 0, 0]}
                fill="#1D7CFF"
                maxBarSize={34}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Right Card */}

      <div className={styles.card}>

        <h3>
          Hours logged vs Output
        </h3>

        <div className={styles.chart}>
          <ResponsiveContainer
            width="100%"
            height={220}
          >
            <AreaChart
              data={lineChartData}
              margin={{
                top: 20,
                right: 5,
                left: -20,
                bottom: 0,
              }}
            >
              <defs>

                <linearGradient
                  id="gradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#4654FF"
                    stopOpacity={0.95}
                  />

                  <stop
                    offset="95%"
                    stopColor="#4654FF"
                    stopOpacity={0.08}
                  />

                </linearGradient>

              </defs>

              <CartesianGrid
                vertical={false}
                stroke="#17181d"
              />

              <XAxis
                dataKey="day"
                tick={{
                  fill: "#72737a",
                  fontSize: 12,
                }}
                tickLine={false}
                axisLine={false}
              />

              <YAxis hide />

              <Tooltip
                contentStyle={{
                  background: "#17181d",
                  border: "1px solid #2f3138",
                  color: "#fff",
                  borderRadius: 10,
                }}
              />

              <Area
                type="monotone"
                dataKey="hours"
                stroke="#4051FF"
                strokeWidth={3}
                fill="url(#gradient)"
                dot={false}
                activeDot={{
                  r: 5,
                }}
              />

            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>

      <div className={styles.tableWrapper}>
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
          {tableData.map((employee, index) => (
            <tr key={index}>
              <td className={styles.name}>
                {employee.name}
              </td>

              <td className={styles.role}>
                {employee.role}
              </td>

              <td>
                <div className={styles.taskCell}>
                  <span className={styles.taskText}>
                    Assigned Tasks
                  </span>

                  <div className={styles.countBadge}>
                    {employee.assignedCount}
                  </div>
                </div>
              </td>

              <td>
                <div className={styles.taskCell}>
                  <span className={styles.taskText}>
                    Completed Tasks
                  </span>

                  <div className={styles.countBadge}>
                    {employee.completedCount}
                  </div>
                </div>
              </td>

              <td className={styles.avgTime}>
                {employee.avgTime}
              </td>

              <td>
                <span className={styles.score}>
                  {employee.score}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default ProductivityReport;
