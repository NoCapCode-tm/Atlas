import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import styles from "../CSS/SLAComplianceDashboard.module.css";
import axios from "axios";
import { InfoTooltip } from "./InfoTooltip";

export default function SLAComplianceDashboard() {
  const [sla, setSla] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);

  const [selectedSLAType, setSelectedSLAType] = useState("All");
  const [selectedProject, setSelectedProject] = useState("All");

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`https://atlasbackend-px53.onrender.com/api/v1/admin/getsla`);
        setSla(res.data.message || []);
      } catch (err) {
        console.error("SLA fetch error:", err);
      }
    })();
  }, []);

  useEffect(() => {
    let mounted = true;

    async function fetchAll() {
      try {
        const [tRes, uRes, pRes] = await Promise.all([
          axios.get(`https://atlasbackend-px53.onrender.com/api/v1/admin/getalltask`, {
            withCredentials: true,
          }),
          axios.get(`https://atlasbackend-px53.onrender.com/api/v1/admin/getalluser`, {
            withCredentials: true,
          }),
          axios.get(`https://atlasbackend-px53.onrender.com/api/v1/admin/getallproject`, {
            withCredentials: true,
          }),
        ]);

        if (!mounted) return;

        setTasks(tRes.data.message || []);
        setEmployees(uRes.data.message || []);
        setProjects(pRes.data.message || []);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }

    fetchAll();
    return () => (mounted = false);
  }, []);

  const SLA_TYPES = [
    { key: "P1", min: 0.000001, max: 10, color: "#A78BFA" },
    { key: "P2", min: 10.000001, max: 22, color: "#8B5CF6" },
    { key: "P3", min: 22.000001, max: 30, color: "#7C3AED" },
    { key: "F4", min: 30.000001, max: 48, color: "#6D28D9" },
    { key: "F5", min: 48.000001, max: 72, color: "#5B21B6" },
    { key: "F6", min: 72.000001, max: Infinity, color: "#4C1D95" },
  ];

  const getOverdueHours = (task) => {
    if (!task.completedAt || !task.dueAt) return null;
    const ms = new Date(task.completedAt) - new Date(task.dueAt);
    return ms / (1000 * 60 * 60);
  };

  const mapOverdueToType = (overdueHours) => {
    if (overdueHours == null) return null;
    if (overdueHours <= 0) return null;
    for (const t of SLA_TYPES) {
      if (overdueHours > t.min - 0.0001 && overdueHours <= t.max) return t.key;
    }
    return null;
  };

  const scopedTasks =
    selectedProject === "All"
      ? tasks
      : tasks.filter((t) => String(t.projectId) === String(selectedProject));

  const tasksWithTiming = scopedTasks.filter(
    (t) => t.dueAt && t.completedAt && t.createdAt
  );

  const enrichedTasks = tasksWithTiming.map((t) => {
    const overdueHours = getOverdueHours(t);
    const isOnTime = overdueHours <= 0;
    const slaType = mapOverdueToType(overdueHours);
    const targetHours =
      t.dueAt && t.createdAt
        ? Math.max(
            0,
            Math.round(
              (new Date(t.dueAt) - new Date(t.createdAt)) /
                (1000 * 60 * 60)
            )
          )
        : null;
    const actualHours =
      t.completedAt && t.createdAt
        ? Math.max(
            0,
            Math.round(
              (new Date(t.completedAt) - new Date(t.createdAt)) /
                (1000 * 60 * 60)
            )
          )
        : null;

    let slaPercent = null;
    if (targetHours != null && actualHours != null && targetHours > 0) {
      if (actualHours <= targetHours) slaPercent = 100;
      else slaPercent = Math.round((targetHours / actualHours) * 100);
    }

    return {
      ...t,
      overdueHours,
      isOnTime,
      slaType,
      targetHours,
      actualHours,
      slaPercent,
    };
  });

  const filteredTasks =
    selectedSLAType === "All"
      ? enrichedTasks
      : enrichedTasks.filter((t) => t.slaType === selectedSLAType);

  const projectTasks = enrichedTasks;

  const projectOnTime = projectTasks.filter(
    (t) =>
      t.completedAt &&
      new Date(t.completedAt) <= new Date(t.dueAt)
  ).length;

  const totalProjectTasks = projectTasks.length;

  const donutPercentage =
    totalProjectTasks > 0
      ? Math.round((projectOnTime / totalProjectTasks) * 100)
      : 0;

  const totalScopeTasks = scopedTasks.length;

  const barData = SLA_TYPES.map((typeObj) => {
    const countOverdueOfType = filteredTasks.filter(
      (t) => t.slaType === typeObj.key
    ).length;

    const value =
      totalScopeTasks > 0
        ? Number(((countOverdueOfType / totalScopeTasks) * 100).toFixed(2))
        : 0;

    return { name: typeObj.key, value, color: typeObj.color };
  });

  const tableRows = filteredTasks.map((t) => {
    const owner =
      employees.find((u) => u._id === t.assignedto)?.name || "Unknown";
    const projectName =
      projects.find((p) => p._id === t.projectId)?.projectname || "Unknown";

    return {
      project: projectName,
      owner,
      target: t.targetHours != null ? `${t.targetHours}h` : "N/A",
      actual: t.actualHours != null ? `${t.actualHours}h` : "N/A",
      overdueHours: t.overdueHours != null ? Math.round(t.overdueHours) : null,
      slaType: t.slaType || "On Time",
      slaPercent: t.slaPercent != null ? t.slaPercent : "N/A",
    };
  });

  const barColors = barData.map((b) => b.color);

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>SLA Compliance Dashboard
        <InfoTooltip text="Analysis of task completion and deadline adherence"/>
      </h1>

      <div className={styles.filterRow}>
        <div className={styles.filterGroup}>
          <button className={styles.filterBtn}>SLA Type</button>
          <select
            className={styles.dropdown}
            value={selectedSLAType}
            onChange={(e) => setSelectedSLAType(e.target.value)}
          >
            <option value="All">All Types</option>
            {SLA_TYPES.map((t) => (
              <option key={t.key} value={t.key}>
                {t.key}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <button className={styles.filterBtn}>Project Filter</button>
          <select
            className={styles.dropdown}
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="All">All Projects</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.projectname}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.chartRow}>
        <div className={styles.donutBox}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                <linearGradient id="pieGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#BEACFF" />
                  <stop offset="100%" stopColor="#4E3899" />
                </linearGradient>
              </defs>

              <Pie
                data={[
                  { name: "OnTime", value: donutPercentage },
                  { name: "Remaining", value: 100 - donutPercentage },
                ]}
                cx="50%"
                cy="50%"
                innerRadius={85}
                outerRadius={130}
                paddingAngle={2}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                isAnimationActive={false}
              >
                <Cell fill="url(#pieGradient)" />
                <Cell fill="#E6D8FF" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className={styles.donutText}>{donutPercentage}%</div>
        </div>

        <div className={styles.barBox}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} barCategoryGap="22%">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name"  />
              <YAxis tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={barColors[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Task Owner</th>
              <th>Target (hrs)</th>
              <th>Actual (hrs)</th>
            </tr>
          </thead>

          <tbody>
            {tableRows.map((row, i) => (
              <tr key={i}>
                <td>{row.project}</td>
                <td>{row.owner}</td>
                <td className={styles.bold}>{row.target}</td>
                <td className={styles.bold}>{row.actual}</td>
              
              </tr>
            ))}
            {tableRows.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: 20 }}>
                  No tasks with valid timings in this scope.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
