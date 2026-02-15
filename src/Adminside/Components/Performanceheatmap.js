import React, { useEffect, useState } from "react";
import styles from "../CSS/Performanceheatmap.module.css";
import axios from "axios";
import { InfoTooltip } from "./InfoTooltip";

const dateRanges = [
  { label: "Last 30 days", value: 30 },
  { label: "Last 60 days", value: 60 },
  { label: "Last 90 days", value: 90 },
  { label: "Last 180 days", value: 180 },
  { label: "Last 240 days", value: 240 }
];

// Color intensity levels
const COLORS = [
  "#F0FFF0", // very light
  "#A8E6A1",
  "#6ECB63",
  "#3FA34D",
  "#1E7A35", // dark
];

const PerformanceHeatmap = () => {
  const [reports, setReports] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState("");
  const [range, setRange] = useState(30);

  useEffect(() => {
    async function fetchData() {
      const res1 = await axios.get(`https://atlasbackend-px53.onrender.com/api/v1/admin/getreports`);
      const res2 = await axios.get(`https://atlasbackend-px53.onrender.com/api/v1/admin/getalluser`);
      setReports(res1.data.message);
      setEmployees(res2.data.message);
    }
    fetchData();
  }, []);

  // Filter reports by employee + time range
  const filteredReports = reports.filter(r => {
    const diff = (Date.now() - new Date(r.date)) / (1000 * 3600 * 24);
    if (diff > range) return false;
    if (!selectedEmp) return true;
    return r.user === selectedEmp;
  });

  // Count submissions per day
  const dateMap = {};
  filteredReports.forEach(rep => {
    const d = new Date(rep.date).toDateString();
    dateMap[d] = (dateMap[d] || 0) + rep.relatedtasks.length;
  });

  // Build last X days grid
  const daysArray = Array.from({ length: range }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (range - i - 1));
    const key = date.toDateString();
    const count = dateMap[key] || 0;

    let color = COLORS[0];
    if (count === 0) color = "transparent";
    else if (count === 1) color = COLORS[1];
    else if (count === 2) color = COLORS[2];
    else if (count <= 4) color = COLORS[3];
    else color = COLORS[4];

    return {
      date,
      count,
      color
    };
  });

  // Summary
  const totalExpected = range * (selectedEmp ? 1 : employees.length);
  const totalSubmitted = filteredReports.length;
  const missing = totalExpected - totalSubmitted;
  const percent =
    totalExpected === 0 ? 0 : Math.round((totalSubmitted / totalExpected) * 100);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Performance score Heatmap
        <InfoTooltip text="Visual overview of performance scores across teams and individuals" />
      </h1>
      
      <p className={styles.subtitle}>
        Visual representation of team performance over time
      </p>

      {/* FILTERS */}
      <div className={styles.filters}>
        <select
          className={styles.dropdown}
          value={selectedEmp}
          onChange={(e) => setSelectedEmp(e.target.value)}
        >
          <option value="">All Employees</option>
          {employees.map(emp => (
            <option key={emp._id} value={emp._id}>
              {emp.name}
            </option>
          ))}
        </select>

        <select
          className={styles.dropdown}
          value={range}
          onChange={(e) => setRange(Number(e.target.value))}
        >
          {dateRanges.map(r => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {/* HEATMAP */}
      <div className={styles.heatmapCard}>
        <div className={styles.heatmapGrid}>
          {daysArray.map((day, i) => (
            <div
              key={i}
              className={`${styles.dayBox} ${
                day.count ? styles.filled : styles.empty
              }`}
              style={{ backgroundColor: day.color }}
              title={`${day.date.toDateString()} — ${day.count} reports`}
            />
          ))}
        </div>
      </div>

      {/* SUMMARY */}
      <div className={styles.summaryCard}>
        <h2 className={styles.summaryTitle}>
          Summary <span>(Last {range} days)</span>
        </h2>

        <p>Average Submission Rate : <b>{percent}%</b></p>
        <p>Total Reports Expected : <b>{totalExpected}</b></p>
        <p>Total Reports Submitted : <b>{totalSubmitted}</b></p>
        <p>Missing Reports : <b>{missing}</b></p>
      </div>
    </div>
  );
};

export default PerformanceHeatmap;
