import React, { useEffect, useState } from "react";
import styles from "../CSS/Reports.module.css";
import {
  generateReportAPI,
  fetchReportsAPI
} from "../api/reports.api";
import dayjs from "dayjs";
import { InfoTooltip } from "./InfoTooltip";

export default function Reports() {
  const [type, setType] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [format, setFormat] = useState("excel");
  const [options, setOptions] = useState({
    includeRawTasks: false,
    summaryOnly: false,
    employeeBreakdown: false,
    includeCharts: false
  });

  const [loading, setLoading] = useState(false);
  const [exports, setExports] = useState([]);

  const loadExports = async () => {
    const res = await fetchReportsAPI();
    setExports(res.data || []);
  };

  useEffect(() => {
    loadExports();
  }, []);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      await generateReportAPI({
        type,
        from,
        to,
        format,
        options
      });
      await loadExports();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setTimeout(() => {
         window.location.reload()
      }, (5000));
     
    }
  };

  return (
    <div className={styles.page}>
      <h2 className={styles.heading}>Reports
        <InfoTooltip text="Download reports in supported file formats"/>
      </h2>
      <p className={styles.subheading}>
        Generate and export reports for your organization
      </p>

      {/* ---------- Generate Card ---------- */}
      <div className={styles.card}>
        <h4>Generate Report Export</h4>

        <label>Report Type *</label>
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="">Select</option>
          <option value="tasks">Tasks</option>
          <option value="metrics">Metrics</option>
          <option value="performance">Employee Performance</option>
          <option value="employees">Employees</option>
          <option value="redflags">Red Flags</option>
        </select>

        <label>Date Range *</label>
        <div className={styles.dates}>
          <input type="date" onChange={e => setFrom(e.target.value)} />
          <input type="date" onChange={e => setTo(e.target.value)} />
        </div>

        <label>Export Format *</label>
        <div className={styles.radioRow}>
          <label>
            <input
              type="radio"
              checked={format === "excel"}
              onChange={() => setFormat("excel")}
            />
            Excel
          </label>
          <label>
            <input
              type="radio"
              checked={format === "pdf"}
              onChange={() => setFormat("pdf")}
            />
            PDF
          </label>
        </div>

        {/* <label>Detail Level Options</label>
        <div className={styles.checks}>
          <label>
            <input
              type="checkbox"
              onChange={e =>
                setOptions({ ...options, includeRawTasks: e.target.checked })
              }
            />
            Include Raw Task Data
          </label>

          <label>
            <input
              type="checkbox"
              onChange={e =>
                setOptions({ ...options, summaryOnly: e.target.checked })
              }
            />
            Include Summary Metrics Only
          </label>

          <label>
            <input
              type="checkbox"
              onChange={e =>
                setOptions({
                  ...options,
                  employeeBreakdown: e.target.checked
                })
              }
            />
            Employee-Level Breakdown
          </label>

          {format === "pdf" && (
            <label>
              <input
                type="checkbox"
                onChange={e =>
                  setOptions({ ...options, includeCharts: e.target.checked })
                }
              />
              Include Charts & Visualizations
            </label>
          )}
        </div> */}

        <button
          className={styles.btn}
          disabled={loading}
          onClick={handleGenerate}
        >
          {loading ? "Generating..." : "Generate Export"}
        </button>
      </div>

      {/* ---------- Recent Exports ---------- */}
      <div className={styles.card}>
        <h4>Recent Exports</h4>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>File Name</th>
              <th>Date Generated</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {exports.map(r => (
              <tr key={r._id}>
                <td>
                  {r.type}-report-{dayjs(r.createdAt).format("YYYY-MM")}
                  .{r.format}
                </td>
                <td>{dayjs(r.createdAt).format("YYYY-MM-DD HH:mm")}</td>
                <td>
                  <span
                    className={`${styles.badge} ${
                      r.status === "ready"
                        ? styles.ready
                        : styles.processing
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td>
                  {r.status === "ready" ? (
                    <a
                      href={`http://localhost:5000${r.fileUrl}`}
                      className={styles.link}
                    >
                      Download
                    </a>
                  ) : (
                    "Processing..."
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
