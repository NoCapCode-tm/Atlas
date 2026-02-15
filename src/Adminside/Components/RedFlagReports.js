import React, { useEffect, useMemo, useState } from "react";
import styles from "../CSS/RedFlagsReport.module.css";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

import {  ChartNoAxesCombined, CircleCheckBig, Clock, TriangleAlert } from "lucide-react";
import { InfoTooltip } from "./InfoTooltip";

const API = `https://atlasbackend-px53.onrender.com/api/v1/admin`;

const severityColors = {
  High: "rgba(239,68,68,1)",
  Medium: "rgba(255,179,51,1)",
  Low: "rgba(59,130,246,1)",
  Critical: "#9B1C1C",
};
const tableseverityColors = {
  High: "rgba(255, 226, 226, 1)",
  Medium: "rgba(254, 243, 198, 1)",
  Low: "rgba(219, 234, 254, 1)",
  Critical: "#FFD7D9",
};
const severitytext = {
  High: "rgba(193, 0, 7, 1)",
  Medium: "rgba(187, 77, 0, 1)",
  Low: "rgba(20, 71, 230, 1)",
  Critical: "#FF0000",
};
const border = {
  High: "rgba(193, 0, 7, 1)",
  Medium: "rgba(187, 77, 0, 1)",
  Low: "rgba(20, 71, 230, 1)",
  Critical: "#FF0000",
};

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

const CustomLegend = ({ payload }) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "16px",
        justifyContent: "center",
        marginBottom: "12px",
        flexWrap: "wrap",
      }}
    >
      {payload.map((entry, index) => (
        <div
          key={`item-${index}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "13px",
            color: "#334155",
            fontWeight: 500,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: entry.color,
              display: "inline-block",
               boxShadow: `0 0 0 3px ${entry.color}22`,
            }}
          />
          {entry.value}
        </div>
      ))}
    </div>
  );
};

export default function RedFlagReports() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const [severityFilter, setSeverityFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [preset, setPreset] = useState("Last 30 days");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [page, setPage] = useState(1);
  const perPage = 5;

  // LOAD DATA
  useEffect(() => {
    (async () => {
      const [pr, us] = await Promise.all([
        axios.get(`${API}/getallproject`),
        axios.get(`${API}/getalluser`),
      ]);

      setProjects(pr.data.message || []);
      setUsers(us.data.message || []);
    })();
  }, []);

  // PRESET DATE LOGIC
  useEffect(() => {
    const end = new Date();
    end.setHours(23, 59, 59);

    const start = new Date();
    if (preset === "Last 30 days") start.setDate(start.getDate() - 29);
    if (preset === "Last 90 days") start.setDate(start.getDate() - 89);

    start.setHours(0, 0, 0);

    setFromDate(start.toISOString().slice(0, 10));
    setToDate(end.toISOString().slice(0, 10));
  }, [preset]);

  // NORMALIZE RISKS
  const risks = useMemo(() => {
    const out = [];

    projects.forEach((p) => {
      if (!Array.isArray(p.risks)) return;

      p.risks.forEach((r) => {
        out.push({
          id: r._id,
          projectName: p.projectname,
          severity: cap(r.severity),
          type: r.category,
          status: r.status,
          raisedon: r.raisedon ? new Date(r.raisedon) : null,
          resolvedon: r.resolvedon ? new Date(r.resolvedon) : null,
          raisedby: r.raisedby,
        });
      });
    });

    return out.sort((a, b) => b.raisedon - a.raisedon);
  }, [projects]);

  


  // FILTERING
  const filtered = useMemo(() => {
    let arr = [...risks];

    if (fromDate) {
      const f = new Date(fromDate);
      arr = arr.filter((x) => x.raisedon >= f);
    }
    if (toDate) {
      const t = new Date(toDate);
      t.setHours(23, 59, 59);
      arr = arr.filter((x) => x.raisedon <= t);
    }

    if (severityFilter)
      arr = arr.filter(
        (x) => x.severity.toLowerCase() === severityFilter.toLowerCase()
      );

    if (typeFilter)
      arr = arr.filter(
        (x) => x.type?.toLowerCase() === typeFilter.toLowerCase()
      );

    return arr;
  }, [risks, severityFilter, typeFilter, fromDate, toDate]);

  // SUMMARY
  const summary = useMemo(() => {
    const total = filtered.length;

    const bySeverity = filtered.reduce((acc, f) => {
      acc[f.severity] = (acc[f.severity] || 0) + 1;
      return acc;
    }, {});

    const byStatus = filtered.reduce((acc, f) => {
      acc[f.status] = (acc[f.status] || 0) + 1;
      return acc;
    }, {});

    let totalHours = 0;
    let resolvedCount = 0;

    filtered.forEach((r) => {
      if (r.resolvedon && r.raisedon) {
        const diff = r.resolvedon - r.raisedon;
        if (diff > 0) {
          totalHours += diff / (1000 * 60 * 60);
          resolvedCount++;
        }
      }
    });

    const avg = resolvedCount ? Math.round(totalHours / resolvedCount) : 0;
    const resolvedPercent = (byStatus.Resolved / total)*100
    const openPercent = (byStatus.Raised / total)*100

    return { total, bySeverity, byStatus, avg ,resolvedPercent,openPercent };
  }, [filtered]);

  // CHART DATA
  const chartData = useMemo(() => {
    const map = {};

    filtered.forEach((r) => {
      const key = r.raisedon?.toISOString().slice(0, 10);
      if (!key) return;

      if (!map[key])
        map[key] = { date: key, High: 0, Medium: 0, Low: 0, Critical: 0 };

      map[key][r.severity]++;
    });

    return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
  }, [filtered]);

  // PAGINATION
  const totalPages = Math.ceil(filtered.length / perPage);
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  const userMap = useMemo(() => {
    const m = {};
    users.forEach((u) => (m[u._id] = u.name));
    return m;
  }, [users]);

  return (
    <div className={styles.page}>
      {/* TITLE */}
      <div className={styles.titlefilter}>
      <h1 className={styles.title}>Red Flags Report
        <InfoTooltip text="Summary of performance risks and escalation history"/>
      </h1>
      <p className={styles.subtitle}>
        Track escalations, issues, and their resolution history
      </p>

      {/* FILTERS ROW */}
      <div className={styles.filtersRow}>
        <div className={styles.filterItem}>
          <label>Type</label>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">All</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Database">Database</option>
            <option value="DevOps">DevOps</option>
          </select>
        </div>

        <div className={styles.filterItem}>
          <label>Severity</label>
          <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}>
            <option value="">All</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        <div className={styles.filterItem1}>
          <label>Date Range</label>
          <div className={styles.bothfilter}>
          <div className={styles.dateRow}>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setPreset("custom");
                setFromDate(e.target.value);
              }}
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => {
                setPreset("custom");
                setToDate(e.target.value);
              }}
            />
          </div>
          </div>
        </div>
      </div>
      </div>

      {/* SUMMARY CARDS */}
      {/* ESCALATION OVERVIEW */}
      <div className={styles.bothdiv}>

      
<div className={styles.overviewContainer}>
  <div className={styles.overviewHeader}>
    <div className={styles.alertIcon}><TriangleAlert size={22} color="red"/></div>
    <div>
      <h3>Escalation Overview</h3>
      <p>Total risks raised in selected period</p>
    </div>
  </div>

  <div className={styles.overviewGrid}>

    {/* TOTAL ESCALATIONS CARD */}
    <div className={styles.totalCard}>
      <h4>Total Escalations</h4>
      <div className={styles.bigNumber}>{summary.total}</div>
      <div className={styles.smallText}>vs. previous period (0)</div>
    </div>

    {/* BY SEVERITY */}
    <div className={styles.severityCard}>
      <h4>By Severity</h4>

      <div className={styles.row}>
        <div className={styles.both}>
        <span className={styles.dotRed}></span> High</div>
        <span className={styles.count}>{summary.bySeverity.High || 0}</span>
      </div>
      <div className={styles.row}>
        <div className={styles.both}>
        <span className={styles.dotOrange}></span> Medium</div>
        <span className={styles.count}>{summary.bySeverity.Medium || 0}</span>
      </div>
      <div className={styles.row}>
        <div className={styles.both}>
        <span className={styles.dotBlue}></span> Low</div>
        <span className={styles.count}>{summary.bySeverity.Low || 0}</span>
      </div>
    </div>

    {/* BY STATUS CARD */}
    <div className={styles.statusCard}>
      <h4>By Status</h4>

      <div className={styles.statusRow}>
        <span>Open</span>
        <span className={styles.count}>{summary.byStatus.Raised}</span>
      </div>
      <div className={styles.progressBar}>
        <div className={styles.redFill} style={{ width: `${summary.openPercent}%` }}></div>
      </div>

      <div className={styles.statusRow}>
        <span>Resolved</span>
        <span className={styles.count}>{summary.byStatus.Resolved}</span>
      </div>
      <div className={styles.progressBar}>
        <div className={styles.greenFill} style={{ width: `${summary.resolvedPercent}%` }}></div>
      </div>
    </div>

    {/* AVG RESOLUTION TIME */}
    <div className={styles.avgCard}>
      <h4>Avg. Resolution Time</h4>
      <div className={styles.bigNumber}>{summary.avg} <span className={styles.smallText}>Hours</span></div>
    </div>

  </div>
</div>


      {/* CHART */}
      <div className={styles.chartCard1}>
        <div className={styles.overviewHeader1}>
    <div className={styles.alertIcon1}><ChartNoAxesCombined size={22} color="rgba(21, 93, 252, 1)"/></div>
    <div>
      <h3>Escalation Trend</h3>
      <p>Escalations over time by severity level</p>
    </div>
  </div>

        <ResponsiveContainer width="100%" height={270}>
          <BarChart data={chartData} barSize={50} >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" />
            {/* <YAxis /> */}
            <Legend
  verticalAlign="top"
  align="center"
   wrapperStyle={{
    position:"absolute",
    bottom:250
    // marginBottom: 55,
    // paddingTop: 6
  }}
  content={<CustomLegend />}
/>

            <Tooltip />

            <Bar dataKey="High" fill={severityColors.High} stackId="a" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Medium" fill={severityColors.Medium} stackId="a" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Low" fill={severityColors.Low} stackId="a" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Critical" fill={severityColors.Critical} stackId="a" radius={[0, 0, 0, 0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
      </div>

      {/* TABLE */}
      <div className={styles.tableCard}>
        <div className={styles.headerdiv}>
        <h3 className={styles.tableHeader}>Escalation History Log</h3>
        <p className={styles.tablesubHeader}>Complete record of all escalations and their resolution status</p>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date/Time</th>
              <th>Project</th>
              <th>Initiator</th>
              <th>Severity</th>
              <th>Type</th>
              <th>Status</th>
              <th>Resolution</th>
            </tr>
          </thead>

          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: 20 }}>
                  No data found
                </td>
              </tr>
            ) : (
              pageData.map((r) => {
                const res =
                  r.resolvedon && r.raisedon
                    ? Math.round((r.resolvedon - r.raisedon) / (1000 * 60 * 60)) +
                      "h"
                    : "—";

                return (
                  <tr key={r.id}>
                    <td>{r.raisedon?.toLocaleString()}</td>
                    <td>{r.projectName}</td>
                    <td>{userMap[r.raisedby] || "Unknown"}</td>
                    <td>
                      <span
                        className={styles.severityTag}
                        style={{ background: tableseverityColors[r.severity] ,color:severitytext[r.severity],borderColor:border[r.severity] }}
                      >
                        {r.severity}
                      </span>
                    </td>
                    <td>{r.type}</td>
                    <td>
                      {r.status === "Resolved" ?(
                        <div className ={`${styles.status} ${styles.resolved}`}>
                          <CircleCheckBig size={16}/>{r.status}
                        </div>
                      ):(
                        <div className ={`${styles.status} ${styles.raised}`}>
                          <Clock size={16}/>{r.status}
                        </div>
                      )}
                    </td>
                    <td>{res}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className={styles.pagination}>
          <button disabled={page === 1} onClick={() => setPage(1)}>
            «
          </button>
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </button>

          <span>
            Page {page} / {totalPages}
          </span>

          <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            Next
          </button>
          <button disabled={page === totalPages} onClick={() => setPage(totalPages)}>
            »
          </button>
        </div>
      </div>
    </div>
  );
}
