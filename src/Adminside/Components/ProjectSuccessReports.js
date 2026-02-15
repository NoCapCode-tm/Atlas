import React, { useEffect, useMemo, useState } from "react";
import styles from "../CSS/ProjectSuccessReport.module.css";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { InfoTooltip } from "./InfoTooltip";

const API_PROJECTS = "api/v1/admin/getallproject";
const API_USERS = "api/v1/admin/getalluser";

const severityColor = {
  Critical: "#e53e3e",
  Warning: "#f59e0b",
  Minor: "#60a5fa",
};

function safeNumber(v) {
  return typeof v === "number" && !isNaN(v) ? v : 0;
}

export default function ProjectSuccessReports() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState("All Projects");
  const [ownerFilter, setOwnerFilter] = useState("All Owners");
  const [timeframe, setTimeframe] = useState("All Time");

  useEffect(() => {
    (async () => {
      try {
        const [pRes, uRes] = await Promise.all([
          axios.get(`http://localhost:5000/${API_PROJECTS}`),
          axios.get(`http://localhost:5000/${API_USERS}`),
        ]);
        // assuming API returns { message: [...] } like your earlier responses
        console.log(pRes.data.message)
        console.log(uRes.data.message)
        setProjects(pRes?.data?.message || pRes?.data || []);
        setUsers(uRes?.data?.message || uRes?.data || []);
      } catch (err) {
        console.warn("Failed to fetch from API — using fallback sample data", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // user map for quick lookup
  const userMap = useMemo(() => {
    const m = {};
    users.forEach((u) => {
      m[u._id || u.id] = u;
    });
    return m;
  }, [users]);

  // prepare enriched projects with computed metrics
  const enriched = useMemo(() => {
    const now = new Date();
    return projects.map((p) => {
      const budget = safeNumber(p.budget || p.projectBudget || 0);

      // manager object
      const managerId = p.manager;
      const managerObj = userMap[managerId] || {};

      // assigned members array
      const members = (p.team?.assignedMembers || []).map((m) => {
        const u = userMap[m.userId] || {};
        return {
          ...m,
          ...u,
        };
      });

      // sum of salaries: manager + members
      const managerSalary = safeNumber(managerObj?.salary?.amount);
      const membersSalarySum = members.reduce((s, mm) => s + safeNumber(mm?.salary?.amount), 0);
      const budgetUsedAmount = managerSalary + membersSalarySum; // interpreted as 'used by salaries'
      const budgetUsedPercent = budget > 0 ? Math.round((budgetUsedAmount / budget) * 100) : 0;
      const budgetRemaining = Math.max(0, budget - budgetUsedAmount);

      // completion
      const completion = safeNumber(p.progress?.percent ?? p.completionPercent ?? 0);

      // risks normalization
      const risks = Array.isArray(p.risks)
        ? p.risks.map((r) => ({
            ...r,
            severity: (r.severity || r.level || "Minor"),
            category: r.category || r.type || "General",
            raisedon: r.raisedon ? new Date(r.raisedon) : null,
            resolvedon: r.resolvedon ? new Date(r.resolvedon) : null,
          }))
        : [];

      // health calculation
      let health = "Healthy";
      const hasCriticalOpen = risks.some((r) => r.severity === "Critical" && !r.resolvedon);
      if (hasCriticalOpen) health = "At Risk";
      else if (completion >= 80) health = "Healthy";
      else if (completion >= 50) health = "Warning";
      else health = "At Risk";

      return {
        ...p,
        budget,
        managerObj,
        members,
        budgetUsedAmount,
        budgetUsedPercent,
        budgetRemaining,
        completion,
        risks,
        health,
      };
    });
  }, [projects, userMap]);

  const filteredProjects = useMemo(() => {
    let arr = [...enriched];
    if (statusFilter !== "All Projects") {
      arr = arr.filter((p) => p.health === statusFilter);
    }
    if (ownerFilter !== "All Owners") {
      arr = arr.filter((p) => {
        const mid = p.manager || (p.manager?._id);
        return mid === ownerFilter;
      });
    }
    if (timeframe === "Last 30 days") {
      const cut = new Date();
      cut.setDate(cut.getDate() - 30);
      arr = arr.filter((p) => new Date(p.createdAt || p.timeline?.startDate || 0) >= cut);
    } else if (timeframe === "Last 90 days") {
      const cut = new Date();
      cut.setDate(cut.getDate() - 90);
      arr = arr.filter((p) => new Date(p.createdAt || p.timeline?.startDate || 0) >= cut);
    }
    return arr;
  }, [enriched, statusFilter, ownerFilter, timeframe]);

const bottleneckData = useMemo(() => {
  const rows = [];
  const now = new Date();

  filteredProjects.forEach((p) => {
    p.risks.forEach((r) => {
      const title = r.title || r.category || "Unnamed Risk";

      const start = r.raisedon ? new Date(r.raisedon) : null;
      const end = r.resolvedon ? new Date(r.resolvedon) : now;

      if (!start) return;

      const delayDays = Math.max(
        0,
        Math.round((end - start) / (1000 * 60 * 60 * 24))
      );

      // severity bucket
      let severity = "Minor";
      if (delayDays >= 10) severity = "Critical";
      else if (delayDays >= 5) severity = "Warning";

      rows.push({
        title,
        delay: delayDays,
        Critical: severity === "Critical" ? delayDays : 0,
        Warning: severity === "Warning" ? delayDays : 0,
        Minor: severity === "Minor" ? delayDays : 0,
      });
    });
  });

  // sort longest delays first (like screenshot)
  return rows.sort((a, b) => b.delay - a.delay);
}, [filteredProjects]);


  // chart expects keys: category, Critical, Warning, Minor
  const chartData = bottleneckData.map((d) => ({
    category: d.category,
    Critical: d.Critical,
    Warning: d.Warning,
    Minor: d.Minor,
  }));

  if (loading) {
    return <div className={styles.page}>Loading Projects...</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Project Success Reports <InfoTooltip text="Insights into project completion rates and bottlenecks"/></h1>
        <p className={styles.sub}>
          Monitor project health, completion rates, and identify bottlenecks
        </p>

        <div className={styles.filters}>
          <div className={styles.control}>
            <label>Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option>All Projects</option>
              <option>Healthy</option>
              <option>Warning</option>
              <option>At Risk</option>
            </select>
          </div>

          <div className={styles.control}>
            <label>Project Owner/Manager</label>
            <select
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
            >
              <option>All Owners</option>
              {users.map((u) => (
                <option key={u._id || u.id} value={u._id || u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.control}>
            <label>Timeframe</label>
            <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
              <option>All Time</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Project Health Table */}
      <div className={styles.card}>
        <div className={styles.headerdiv}>
                <h3 className={styles.tableHeader}>Project Health Overview</h3>
                <p className={styles.tablesubHeader}>Click on a project to view detailed information</p>
            </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Completion %</th>
                <th>Budget Used</th>
                <th>Est. Completion</th>
                <th>Health Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((p) => {
                const estCompletion = p.timeline?.endDate ? new Date(p.timeline.endDate) : null;
                return (
                  <tr key={p._id || p.id}>
                    <td className={styles.projectCell}>
                      <div className={styles.projectTitle}>{p.projectname}</div>
                      <div className={styles.projectSub}>{p.managerObj?.name || "—"}</div>
                    </td>

                    <td>
                      <div className={styles.completionRow}>
                        <div className={styles.progressBar}>
                          <div
                            className={styles.progressFill}
                            style={{ width: `${Math.max(0, Math.min(100, p.progress.percent))}%` }}
                          />
                        </div>
                        <div className={styles.percentText}>{p.progress.percent}%</div>
                      </div>
                    </td>

                    <td>
                      <div className={styles.budgetText}>
                        <div className={styles.budgetPercent}>
                          {p.budgetUsedPercent}%{" "}
                        </div>
                        <div className={styles.budgetAmount}>
                          ${formatNumber(p.budgetUsedAmount)} of ${formatNumber(p.budget)}
                        </div>
                      </div>
                    </td>

                    <td>{estCompletion ? format(estCompletion, "MMM dd, yyyy") : "—"}</td>

                    <td>
                      <div className={styles.healthRow}>
                        <span
                          className={`${styles.healthDot} ${
                            p.health === "Healthy"
                              ? styles.healthy
                              : p.health === "Warning"
                              ? styles.warning
                              : styles.atRisk
                          }`}
                        ></span>
                        <span>{p.health}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottlenecks Chart */}
      <div className={styles.card1}>
        <h3>Top Bottlenecks Across All Projects</h3>
        <p className={styles.cardSub}>Tasks and phases that exceeded their estimated duration</p>

        <div style={{ width: "100%", height: 400, overflowY: "auto", paddingRight: 10}}>
          {chartData.length === 0 ? (
            <div className={styles.empty}>No risk/bottleneck data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
  <BarChart
    layout="vertical"
    data={bottleneckData}
    // margin={{ top: 10, right: 30, left: 150, bottom: 20 }}
    barGap={20}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis type="number" label={{ value: "Days Delayed", position: "bottom" }} />
    <YAxis dataKey="title" type="category" width={300} />
    <Tooltip />
    <Legend />

    <Bar dataKey="Critical" stackId="a" fill={severityColor.Critical} radius={[0, 8, 8, 0]}/>
    <Bar dataKey="Warning" stackId="a" fill={severityColor.Warning} radius={[0, 8, 8, 0]}/>
    <Bar dataKey="Minor" stackId="a" fill={severityColor.Minor} radius={[0, 8, 8, 0]}/>
  </BarChart>
</ResponsiveContainer>

          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Helpers and fallback sample data ---------- */

function formatNumber(v) {
  if (!v && v !== 0) return "0";
  return v.toLocaleString();
}