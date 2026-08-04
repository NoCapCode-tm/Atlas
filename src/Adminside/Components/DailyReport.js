import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import styles from "../CSS/Dailyreport.module.css";
import { API_URL } from "../../config";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { InfoTooltip } from "./InfoTooltip";


const toISTDateKey = (date) =>
  new Date(date).toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });

const startOfTodayIST = () => {
  const d = new Date();
  const ist = new Date(
    d.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
  ist.setHours(0, 0, 0, 0);
  return ist;
};

const getLastNDaysIST = (n) => {
  const out = [];
  const today = startOfTodayIST();

  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    out.push(toISTDateKey(d));
  }
  return out;
};

const makeWeekBuckets = (dates) => {
  const weeks = [];
  let idx = 1;

  for (let i = 0; i < dates.length; i += 7) {
    const chunk = dates.slice(i, i + 7);
    const start = chunk[0];
    const end = chunk[chunk.length - 1];

    weeks.push({
      label: `W${idx} (${start.slice(5)}→${end.slice(5)})`,
      dates: chunk,
    });
    idx++;
  }

  return weeks;
};


export default function DailyReport() {
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [metrics, setMetrics] = useState([]);

  const [selectedUser, setSelectedUser] = useState("all");
  const [rangeDays, setRangeDays] = useState(30);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    (async () => {
      const res = await axios.get(
        `${API_URL}admin/getmetrics`
      );
      setMetrics(res.data.message || []);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${API_URL}admin/getalluser`,
          { withCredentials: true }
        );
        setUsers(res.data.message || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const res = await axios.get(
        `${API_URL}admin/getreports`,
        { withCredentials: true }
      );
      setReports(res.data.message || []);
    })();
  }, []);


  const rangeDatesArr = useMemo(
    () => getLastNDaysIST(rangeDays),
    [rangeDays]
  );

 
  const companyChartData = useMemo(() => {
    const map = new Map();

    metrics.forEach((m) => {
      const key = toISTDateKey(m.date);
      map.set(key, m);
    });

    const expectedPerDay = users.length || 1;

    return rangeDatesArr.map((d) => {
      const m = map.get(d);
      const submitted = m?.reportsSubmitted || 0;
      const pct = expectedPerDay
        ? Math.round((submitted / expectedPerDay) * 100)
        : 0;

      return {
        date: d,
        submitted,
        expected: expectedPerDay,
        pct,
      };
    });
  }, [metrics, users, rangeDatesArr]);

  const employeeWeeklyChartData = useMemo(() => {
    if (selectedUser === "all") return [];

    const userReports = reports.filter(
      (r) =>
        String(r.user) === String(selectedUser) &&
        rangeDatesArr.includes(toISTDateKey(r.date))
    );

    const weeks = makeWeekBuckets(rangeDatesArr);

    return weeks.map((w) => {
      const submitted = userReports.filter((r) =>
        w.dates.includes(toISTDateKey(r.date))
      ).length;

      const expected = w.dates.length;
      const pct = expected ? Math.round((submitted / expected) * 100) : 0;

      return {
        label: w.label,
        submitted,
        expected,
        pct,
      };
    });
  }, [selectedUser, reports, rangeDatesArr]);

  const chartData = useMemo(() => {
    if (selectedUser === "all") {
      return companyChartData.map((d) => ({
        name: d.date.slice(5),
        value: d.pct,
      }));
    }

    return employeeWeeklyChartData.map((w) => ({
      name: w.label,
      value: w.pct,
    }));
  }, [selectedUser, companyChartData, employeeWeeklyChartData]);


  const summary = useMemo(() => {
    const src =
      selectedUser === "all"
        ? companyChartData
        : employeeWeeklyChartData;

    const totalSubmitted = src.reduce((s, x) => s + x.submitted, 0);
    const totalExpected = src.reduce((s, x) => s + x.expected, 0);

    const avgPct = totalExpected
      ? Math.round((totalSubmitted / totalExpected) * 100)
      : 0;

    return {
      avgPct,
      totalSubmitted,
      totalExpected,
      missing: Math.max(0, totalExpected - totalSubmitted),
    };
  }, [selectedUser, companyChartData, employeeWeeklyChartData]);

  if (loading) {
    return (
      <div className={styles.wrap}>
        <div className={styles.loader}>Loading...</div>
      </div>
    );
  }

  
  return (
    <div className={styles.wrap}>
      <h1>
        Daily Report Submission
        <InfoTooltip text="Trend of daily work report submissions over time" />
      </h1>

      <div className={styles.header}>
        <div className={styles.controls}>
          <div className={styles.selectWrap}>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="all">All employees (company)</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} — {u.designation?.name || "No role"}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.selectWrap}>
            <select
              value={rangeDays}
              onChange={(e) => setRangeDays(Number(e.target.value))}
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}>
          <h3>
            {selectedUser === "all"
              ? "[ Submission Rate (%) Over Time ]"
              : `Weekly submission rate for ${
                  users.find((u) => u._id === selectedUser)?.name || ""
                }`}
          </h3>
        </div>

        <div className={styles.chartArea}>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="20%" stopColor="#2035FF" stopOpacity={1} />
                  <stop offset="100%" stopColor="#6D78FF33" stopOpacity={1} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              {/* <XAxis dataKey="name" /> */}
              {/* <YAxis domain={[0, 100]} /> */}
              <Tooltip formatter={(v) => `${v}%`} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#2035FF"
                fill="url(#grad)"
                fillOpacity={1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.summaryCard}>
        <h3>Summary (Last {rangeDays} days)</h3>
        <div className={styles.summaryGrid}>
          <div className={styles.leftCol}>
            <p style={{fontWeight:700}}>Average Submission Rate :<span className={styles.small}>{summary.avgPct}%</span></p>
            <p style={{fontWeight:700}}>Total Reports Expected :<span className={styles.small}>{summary.totalExpected}</span></p>
            <p style={{fontWeight:700}}>Total Reports Submitted :<span className={styles.small}>{summary.totalSubmitted}</span></p>
            <p style={{fontWeight:700}}>Missing Reports :<span className={styles.small}>{summary.missing}</span></p>
          </div>
          <div className={styles.rightCol}>
            <p className={styles.big}>{summary.avgPct}%</p>
            <p className={styles.big}>{summary.totalExpected}</p>
            <p className={styles.big}>{summary.totalSubmitted}</p>
            <p className={styles.big}>{summary.missing}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
