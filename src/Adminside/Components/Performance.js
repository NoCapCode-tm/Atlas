import React, { useEffect, useMemo, useState } from "react";
import styles from "../CSS/Performance.module.css";
import axios from "axios";
import { InfoTooltip } from "./InfoTooltip";

/* =========================
   IST DATE HELPERS
========================= */
const toISTDateKey = (date) =>
  new Date(date).toLocaleDateString("en-CA", {
    timeZone: "Asia/Kolkata",
  });

const getISTTodayKey = () =>
  toISTDateKey(new Date());

const getISTYesterdayKey = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return toISTDateKey(d);
};

/* =========================
   TENURE
========================= */
const calculateTenure = (createdAt) => {
  if (!createdAt) return "-";

  const start = new Date(createdAt);
  const now = new Date();
  const diffDays = Math.floor(
    (now - start) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 30) return `${diffDays} days`;

  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  if (months < 0) {
    years--;
    months += 12;
  }

  if (years <= 0) return `${months} months`;
  return `${years}.${Math.floor((months / 12) * 10)} years`;
};

/* =========================
   COMPONENT
========================= */
export default function PerformanceSection() {
  const [employees, setEmployees] = useState([]);
  const [performance, setPerformance] = useState([]);

  const [department, setDepartment] = useState("All");
  const [sortBy, setSortBy] = useState("score");
  const [scoreRange, setScoreRange] = useState("All");

  /* =========================
     FETCH DATA
  ========================= */
  useEffect(() => {
    (async () => {
      const empRes = await axios.get(
        "http://localhost:5000/api/v1/admin/getalluser",
        { withCredentials: true }
      );
      const perfRes = await axios.get(
        "http://localhost:5000/api/v1/admin/getscores",
        { withCredentials: true }
      );

      setEmployees(empRes.data.message || []);
      setPerformance(perfRes.data.message || []);
    })();
  }, []);

  /* =========================
     FILTER EMPLOYEES
     (NO ADMIN / MANAGER)
  ========================= */
  const validEmployees = useMemo(
    () =>
      employees.filter(
        (e) =>
          e.designation?.name !== "Administrator" &&
          e.designation?.name !== "Manager"
      ),
    [employees]
  );

  /* =========================
     TODAY PERFORMANCE
     (BASED ON createdAt IST)
  ========================= */
  const todayKey = getISTTodayKey();
  const yesterdayKey = getISTYesterdayKey();

  const todaysPerformance = useMemo(
    () =>
      performance.filter(
        (p) => toISTDateKey(p.createdAt) === todayKey
      ),
    [performance, todayKey]
  );

  const getPrevScore = (userId) => {
    const prev = performance.find(
      (p) =>
        String(p.userId) === String(userId) &&
        toISTDateKey(p.createdAt) === yesterdayKey
    );
    return prev?.totalScore ?? null;
  };

  /* =========================
     BUILD CARDS
  ========================= */
  const cards = useMemo(
    () =>
      todaysPerformance
        .map((p) => {
          const emp = validEmployees.find(
            (e) => String(e._id) === String(p.userId)
          );
          if (!emp) return null;

          const prevScore = getPrevScore(p.userId);
          const diff =
            prevScore !== null ? p.totalScore - prevScore : 0;

          return {
            id: p._id,
            name: emp.name,
            profession: emp.designation?.name,
            score: p.totalScore,
            prevScore,
            diff,
            tenure: calculateTenure(emp.createdAt),
            avatar:
              emp.profilepicture ||
              `https://i.pravatar.cc/60?u=${p.userId}`,
          };
        })
        .filter(Boolean),
    [todaysPerformance, validEmployees]
  );

  /* =========================
     FILTERS
  ========================= */
  const filtered = useMemo(() => {
    let d = [...cards];

    if (department !== "All") {
      d = d.filter((x) => x.profession === department);
    }

    if (scoreRange !== "All") {
      d = d.filter((x) => {
        if (scoreRange === "above70") return x.score > 70;
        if (scoreRange === "40to70")
          return x.score >= 40 && x.score <= 70;
        if (scoreRange === "below40") return x.score < 40;
        return true;
      });
    }

    if (sortBy === "score") {
      d.sort((a, b) => b.score - a.score);
    }

    return d;
  }, [cards, department, scoreRange, sortBy]);

  const topPerformer = filtered[0];

  /* =========================
     JSX (UNCHANGED)
  ========================= */
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>
        Performance section
        <InfoTooltip text="View and analyze employee and team performance metrics" />
      </h1>

      <div className={styles.tabBar}>
        <button className={styles.activeTab}>
          Employee Performance
        </button>
        <button>Trend & Growth Graph</button>
        <button>AI suggestions</button>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.icon}>👥</span>
          <span>Total employees</span>
          <h3>{validEmployees.length}</h3>
        </div>

        <div className={styles.statCard}>
          <span className={styles.icon}>⭐</span>
          <span>Top performer</span>
          <h2>{topPerformer?.name || "-"}</h2>
        </div>
      </div>

      <div className={styles.filterRow}>
        <div>
          <label>Department</label>
          <select onChange={(e) => setDepartment(e.target.value)}>
            <option>All</option>
            {[...new Set(validEmployees.map(e => e.designation?.name))]
              .filter(Boolean)
              .map((d) => (
                <option key={d}>{d}</option>
              ))}
          </select>
        </div>

        <div>
          <label>Score range</label>
          <select onChange={(e) => setScoreRange(e.target.value)}>
            <option value="All">All</option>
            <option value="above70">Above 70</option>
            <option value="40to70">40 - 70</option>
            <option value="below40">Below 40</option>
          </select>
        </div>
      </div>

      <div className={styles.grid}>
        {filtered.map((c) => (
          <div key={c.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <img src={c.avatar} alt="" />
              <div>
                <h3>{c.name}</h3>
                <p>{c.profession}</p>
              </div>
            </div>

            <div className={styles.scoreRow}>
              <div className={styles.score}>
                {c.score}
                <span>/100</span>
              </div>

              {c.diff !== 0 && (
                <div
                  className={
                    c.diff > 0
                      ? styles.positive
                      : styles.negative
                  }
                >
                  {c.diff > 0 ? "+" : ""}
                  {c.diff}% from last time
                </div>
              )}
            </div>

            <div className={styles.meta}>
              <div>
                <span>Previous Score</span>
                <b>{c.prevScore ?? "-"}</b>
              </div>
              <div>
                <span>Tenure</span>
                <b>{c.tenure}</b>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
