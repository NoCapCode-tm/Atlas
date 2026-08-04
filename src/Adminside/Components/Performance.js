import React, { useEffect, useMemo, useState } from "react";
import styles from "../CSS/Performance.module.css";
import axios from "axios";
import { InfoTooltip } from "./InfoTooltip";
import {
  Users,
  BarChart3,
  Building2,
  CalendarDays,
} from "lucide-react";
import { API_URL } from "../../config";


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


export default function PerformanceSection() {
  const [employees, setEmployees] = useState([]);
  const [performance, setPerformance] = useState([]);

  const [department, setDepartment] = useState("All");
  const [sortBy, setSortBy] = useState("score");
  const [scoreRange, setScoreRange] = useState("All");


  useEffect(() => {
    (async () => {
      const empRes = await axios.get(
        `${API_URL}admin/getalluser`,
        { withCredentials: true }
      );
      const perfRes = await axios.get(
        `${API_URL}admin/getscores`,
        { withCredentials: true }
      );

      setEmployees(empRes.data.message || []);
      setPerformance(perfRes.data.message || []);
    })();
  }, []);


  const validEmployees = useMemo(
    () =>
      employees.filter(
        (e) =>
          e.designation?.name !== "Administrator" &&
          e.designation?.name !== "Manager"
      ),
    [employees]
  );

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

  const kpiData = [
  {
    title: "Total Employees",
    value: "124",
    icon: <Users size={20} />,
  },
  {
    title: "Avg. Score",
    value: "79.8",
    icon: <BarChart3 size={20} />,
  },
  {
    title: "Top Department",
    value: "Engineering",
    icon: <Building2 size={20} />,
  },
  {
    title: "Period",
    value: "Q2 2026",
    icon: <CalendarDays size={20} />,
  },
];

const topEmployees = [
  {
    id: 1,
    name: "Lisa Anderson",
    department: "Engineering",
    trend: "+1",
    score: 91,
  },
  {
    id: 2,
    name: "Ethan Walker",
    department: "Marketing",
    trend: "-4",
    score: 93,
  },
  {
    id: 3,
    name: "Olivia Bennett",
    department: "Sales",
    trend: "+5",
    score: 91,
  },
  {
    id: 4,
    name: "Ava Thompson",
    department: "Human Resources",
    trend: "+2",
    score: 90,
  },
  {
    id: 5,
    name: "Noah Anderson",
    department: "Finance",
    trend: "+1",
    score: 88,
  },
  {
    id: 6,
    name: "Sophia Mitchell",
    department: "Product",
    trend: "-2",
    score: 87,
  },
  {
    id: 7,
    name: "Mason Reed",
    department: "Operations",
    trend: "+1",
    score: 86,
  },
  {
    id: 8,
    name: "Isabella Hayes",
    department: "Customer Support",
    trend: "+5",
    score: 85,
  },
  {
    id: 9,
    name: "Lucas Brooks",
    department: "IT",
    trend: "-4",
    score: 84,
  },
  {
    id: 10,
    name: "Mia Foster",
    department: "Design",
    trend: "2",
    score: 83,
  },
];

const departments = [
  {
    name: "Engineering",
    score: 77.6,
  },
  {
    name: "Marketing",
    score: 82.4,
  },
  {
    name: "Sales",
    score: 80.1,
  },
  {
    name: "Human Resources",
    score: 75.9,
  },
  {
    name: "Finance",
    score: 83.2,
  },
  {
    name: "Operation",
    score: 79.6,
  },
];

const departments1 = [
  {
    name: "Engineering Department",
    score: 77.6,
  },
  {
    name: "Marketing Department",
    score: 82.4,
  },
  {
    name: "Human Resource",
    score: 75.9,
  },
];



  return (
    <div className={styles.page}>
      <div className={styles.topcontainer}>
        <div className={styles.topleft}>
  <div className={styles.topleft1}>Scoreboard</div>
  <div className={styles.topleft2}>
     A clear view of performance rankings.
  </div>
</div>
      </div>
       <div className={styles.grid}>
      {kpiData.map((item, index) => (
        <div className={styles.card} key={index}>
          <div className={styles.header}>
            <span className={styles.title}>{item.title}</span>

            <div className={styles.icon}>
              {item.icon}
            </div>
          </div>

          <h2
            className={`${styles.value} ${
              item.title === "Top Department"
                ? styles.department
                : ""
            }`}
          >
            {item.value}
          </h2>
        </div>
      ))}
    </div>

    <div className={styles.wrapper}>
      {/* LEFT */}

      <div className={styles.employeeCard}>
        <div className={styles.cardHeader}>
          Top 10 Employees
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Trend</th>
              <th>Score</th>
            </tr>
          </thead>

          <tbody>
            {topEmployees.map((emp) => (
              <tr key={emp.id}>
                <td className={styles.name}>
                  #{emp.id}. {emp.name}
                </td>

                <td>{emp.department}</td>

                <td>
                  <span
                    className={
                      emp.trend.startsWith("+")
                        ? styles.positive
                        : emp.trend.startsWith("-")
                        ? styles.negative
                        : styles.neutral
                    }
                  >
                    {emp.trend}
                  </span>
                </td>

                <td className={styles.score}>
                  {emp.score}/100
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RIGHT */}

      <div className={styles.compareCard}>
        <div className={styles.compareHeader}>
          Team Comparison
        </div>

        <div className={styles.progressContainer}>
          {departments.map((item) => (
            <div
              className={styles.progressItem}
              key={item.name}
            >
              <div className={styles.progressTop}>
                <span>{item.name}</span>

                <span>{item.score}</span>
              </div>

              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{
                    width: `${item.score}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

     <div className={styles.card1}>
      <h2 className={styles.heading}>Top 3 Departments</h2>

      <div className={styles.departmentContainer}>
        {departments1.map((dept) => (
          <div className={styles.department} key={dept.name}>
            <div
              className={styles.progressCircle}
              style={{
                "--percentage": `${dept.score}%`,
              }}
            >
              <div className={styles.innerCircle}>
                {dept.score}
              </div>
            </div>

            <span className={styles.departmentName}>
              {dept.name}
            </span>
          </div>
        ))}
      </div>
    </div>


    </div>
  );
}
