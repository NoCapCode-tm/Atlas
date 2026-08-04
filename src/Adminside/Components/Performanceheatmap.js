import React, { useEffect, useMemo, useState } from "react";
import styles from "../CSS/Performanceheatmap.module.css";
import axios from "axios";
import { InfoTooltip } from "./InfoTooltip";
import { ChevronDown, SlidersHorizontal } from "lucide-react";


const COLORS = [
  "#000000",
  "#123F2C",
  "#246F47",
  "#43A56C",
  "#5FD89B",
];
const PerformanceHeatmap = () => {
  const [reports, setReports] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState("");

  useEffect(() => {
    async function fetchData() {
      const res1 = await axios.get(`${API_URL}admin/getreports`);
      const res2 = await axios.get(`${API_URL}admin/getalluser`);
      setReports(res1.data.message);
      setEmployees(res2.data.message);
    }
    fetchData();
  }, []);

  // Filter reports by employee + time range
const filteredReports = useMemo(() => {
  if (!selectedEmp) return reports;

  return reports.filter(report => report.user === selectedEmp);
}, [reports, selectedEmp]);
  // Count submissions per day
  const dateMap = {};
  filteredReports.forEach(rep => {
    const d = new Date(rep.date).toDateString();
    dateMap[d] = (dateMap[d] || 0) + rep.relatedtasks.length;
  });

  // Build last X days grid
const daysArray = useMemo(() => {
  const dateMap = {};

  filteredReports.forEach(report => {
    const key = new Date(report.date).toDateString();

    dateMap[key] =
      (dateMap[key] || 0) + (report.relatedtasks?.length || 0);
  });

  const endDate = new Date();
  endDate.setHours(0, 0, 0, 0);

  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 364);

  // GitHub starts the grid from Sunday
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const arr = [];

  const current = new Date(startDate);

  while (current <= endDate) {
    const key = current.toDateString();

    const count = dateMap[key] || 0;

    let color = "#000000";

    if (count === 1) color = "#123F2C";
    else if (count === 2) color = "#246F47";
    else if (count <= 4) color = "#43A56C";
    else if (count > 4) color = "#5FD89B";

    arr.push({
      date: new Date(current),
      count,
      color,
    });

    current.setDate(current.getDate() + 1);
  }

  return arr;
}, [filteredReports]);

  // Summary
 const totalSubmitted = filteredReports.length;

const totalTasks = filteredReports.reduce(
    (sum, report) => sum + report.relatedtasks.length,
    0
);

const activeDays = daysArray.filter(day => day.count > 0).length;

const percent =
    daysArray.length
        ? Math.round((activeDays / daysArray.length) * 100)
        : 0;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Performance score Heatmap
        <InfoTooltip text="Visual overview of performance scores across teams and individuals" />
      </h1>
      
      <p className={styles.subtitle}>
        Visual representation of team performance over time
      </p>

     <div className={styles.wrapper}>
      <div className={styles.filters}>
        {/* Employee */}

        <div className={styles.selectWrapper}>
          <div className={styles.leftIcon}>
            {selectedEmp ? (
              <img
                src={
                  employees.find((e) => e._id === selectedEmp)
                    ?.profilepicture
                }
                alt=""
              />
            ) : (
              <img
                src={
                  employees[0]?.profilepicture ||
                  "https://i.pravatar.cc/100"
                }
                alt=""
              />
            )}
          </div>

          <select
            value={selectedEmp}
            onChange={(e) => setSelectedEmp(e.target.value)}
            className={styles.select}
          >
            <option value="">Name</option>

            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name}
              </option>
            ))}
          </select>

          <ChevronDown size={18} className={styles.arrow} />
        </div>

        {/* Date */}

        {/* <div className={styles.selectWrapper}>
          <div className={styles.filterIcon}>
            <SlidersHorizontal size={15} />
          </div>

          <select
            className={styles.select}
            value={range}
            onChange={(e) => setRange(Number(e.target.value))}
          >
            {dateRanges.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>

          <ChevronDown size={18} className={styles.arrow} />
        </div> */}
      </div>

  <div className={styles.heatmap}>
  {daysArray.map((day, index) => (
    <div
      key={index}
      className={styles.box}
      style={{ background: day.color }}
      title={`${day.date.toDateString()}
Tasks: ${day.count}`}
    />
  ))}
</div>
    </div>

      {/* SUMMARY */}
      <div className={styles.summaryCard}>
        <h2 className={styles.summaryTitle}>
          <span>Summary</span>
        </h2>

       <p>Contribution Days : <b>{activeDays}</b></p>
<p>Total Reports : <b>{totalSubmitted}</b></p>
<p>Total Tasks : <b>{totalTasks}</b></p>
<p>Activity : <b>{percent}%</b></p>
      </div>
    </div>
  );
};

export default PerformanceHeatmap;
