import React, { useEffect, useState, useMemo } from "react";
import styles from "../CSS/HRhubpage.module.css";
import axios from "axios";
  import { useLocation } from "react-router";

export default function HRhubpage() {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("All");
  const[active,setactive]=useState("onboarding")
  const [payrollFilter, setPayrollFilter] = useState("All");
  const [payrollPage, setPayrollPage] = useState(1);
  const location = useLocation();



const payrollPageSize = 10;


  const pageSize = 10;
  

useEffect(() => {
  if (!location.state) return;

  const { tab, status } = location.state;

  if (tab === "onboarding") {
    setactive("onboarding");
  }

  if (status) {
    setActiveFilter(status);
  }
}, [location.state]);



  useEffect(() => {
    (async () => {
      const res = await axios.get(`https://atlasbackend-px53.onrender.com/api/v1/admin/getalluser`);
      setEmployees(res.data.message);
    })();
  }, []);

  const normalizeStatus = (s = "") => {
  const v = s.toLowerCase();
  if (v === "pending") return "Incomplete";
  if (v === "in progress" || v === "inprogress") return "In Progress";
  if (v === "completed") return "Completed";
  return "Incomplete";
};
const payrollEmployees = useMemo(() => {
  let data = employees.filter(
    (emp) => emp.status === "Active & Paid"
  );

  if (payrollFilter === "All") return data;

  return data.filter(
    (emp) =>
      (emp.salary?.paymentstatus || "Pending") === payrollFilter
  );
}, [employees, payrollFilter]);



const calculateWorkdays = (completedAt) => {
  if (!completedAt) return 0;
  const start = new Date(completedAt).getTime();
  const now = Date.now();
  return Math.max(
    0,
    Math.floor((now - start) / (1000 * 60 * 60 * 24))
  );
};



  const filteredEmployees = useMemo(() => {
  if (activeFilter === "All") return employees;

  return employees.filter((emp) => {
    const rawStatus = emp?.onboarding?.status || "Pending";
    const status = normalizeStatus(rawStatus);
    return status === activeFilter;
  });
}, [activeFilter, employees]);


  const totalPages = Math.ceil(filteredEmployees.length / pageSize);

  const paginatedData = filteredEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const payrollTotalPages = Math.ceil(
  payrollEmployees.length / payrollPageSize
);

const payrollPaginatedData = payrollEmployees.slice(
  (payrollPage - 1) * payrollPageSize,
  payrollPage * payrollPageSize
);
useEffect(() => {
  setPayrollPage(1);
}, [payrollFilter]);


  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  return (
    <div className={styles.hrhub}>
     
      <div className={styles.header}>
        <h2>HR Hub</h2>
        <p>Manage onboarding, payroll, and employee documentation</p>
      </div>

     
      <div className={styles.topTabs}>
        <button className={active ==="onboarding"?styles.activeTab:styles.tab} onClick={()=>{setactive("onboarding")}}>Onboarding Status</button>
        <button className={active==="payroll"?styles.activeTab:styles.tab} onClick={()=>{setactive("payroll")}}>Payroll Checklist</button>
      </div>

     {active==="onboarding" ? (
        <>
             <div className={styles.filterTabs}>
        {["All", "Incomplete", "In Progress", "Completed"].map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={activeFilter === f ? styles.activeFilter : styles.filter}
          >
            {f}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>NAME</th>
              <th>JOINING DATE</th>
              <th>STATUS</th>
              <th>DOCUMENTS</th>
              <th>ACTION</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((emp, i) => {
              const rawStatus = emp?.onboarding?.status || "Pending";
const status = normalizeStatus(rawStatus);


              return (
                <tr key={i}>
                  {/* NAME */}
                  <td>
                    <div className={styles.userCell}>
                      <div className={styles.avatarCircle}>
                        {emp.name?.charAt(0)}
                        {emp.name?.split(" ")[1]?.charAt(0)}
                      </div>
                      <span>{emp.name}</span>
                    </div>
                  </td>

                  {/* JOINING DATE */}
                  <td>{new Date(emp.updatedAt).toLocaleDateString("en-IN")}</td>

                  {/* STATUS BADGE */}
                  <td>
                    <span
                      className={`${styles.badge} ${
                        status === "Completed"
                          ? styles.done
                          : status === "In Progress"
                          ? styles.progress
                          : styles.pending
                      }`}
                    >
                      {status}
                    </span>
                  </td>

                  {/* DOCUMENT STATUS */}
                  <td>
                    {emp.documents?.aadhar && emp.documents?.pan ? (
                      <span className={styles.completedBadge}>Completed</span>
                    ) : (
                      <span className={styles.pendingBadge}>Pending</span>
                    )}
                  </td>

                  <td>
                    <button className={styles.actionBtn}>⋮</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className={styles.pagination}>
        <button
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          className={styles.pageBtn}
        >
          ‹
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`${styles.pageNumber} ${
              currentPage === index + 1 ? styles.activePage : ""
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() =>
            currentPage < totalPages && setCurrentPage(currentPage + 1)
          }
          className={styles.pageBtn}
        >
          ›
        </button>
      </div>
      </>
     ):(
        <div className={styles.payroll}>
  <div className={styles.filterTabs}>
  {["All", "Pending", "In Progress", "Completed"].map((f) => (
    <button
      key={f}
      onClick={() => setPayrollFilter(f)}
      className={
        payrollFilter === f
          ? styles.activeFilter
          : styles.filter
      }
    >
      {f}
    </button>
  ))}
</div>


  <div className={styles.tableWrapper}>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>NAME</th>
          <th>WORKDAYS</th>
          <th>PAYMENT STATUS</th>
          <th>SALARY</th>
          <th>BANK DETAILS</th>
          <th>ACTION</th>
        </tr>
      </thead>

      <tbody>
        {payrollPaginatedData.map((emp, i) => {

          const workdays = calculateWorkdays(
            emp.onboarding?.completedAt
          );

          return (
            <tr key={i}>
              {/* NAME */}
              <td>
                <div className={styles.userCell}>
                  <div className={styles.avatarCircle}>
                    {emp.name?.charAt(0)}
                    {emp.name?.split(" ")[1]?.charAt(0)}
                  </div>
                  <span>{emp.name}</span>
                </div>
              </td>

              {/* WORKDAYS */}
              <td>{workdays}</td>

              {/* PAYMENT STATUS */}
              <td>
                <span
  className={`${styles.badge} ${
    emp.salary?.paymentstatus === "Completed"
      ? styles.done
      : emp.salary?.paymentstatus === "In Progress"
      ? styles.progress
      : styles.pending
  }`}
>
  {emp.salary?.paymentstatus || "Pending"}
</span>

              </td>

              {/* SALARY */}
              <td>
                ₹{emp.salary?.amount?.toLocaleString("en-IN") || 0}
              </td>

              {/* BANK DETAILS */}
              <td>
                {emp.bankdetails?.ifsc &&
                emp.bankdetails?.accountno ? (
                  <span className={styles.completedBadge}>
                    Completed
                  </span>
                ) : (
                  <span className={styles.pendingBadge}>
                    Pending
                  </span>
                )}
              </td>

              {/* ACTION */}
              <td>
                <button className={styles.actionBtn}>⋮</button>
              </td>
            </tr>
          );
        })}
      </tbody>
     </table>
      
  </div>
  <div className={styles.pagination}>
  <button
    className={styles.pageBtn}
    disabled={payrollPage === 1}
    onClick={() => setPayrollPage((p) => p - 1)}
  >
    ‹
  </button>

  {[...Array(payrollTotalPages)].map((_, index) => (
    <button
      key={index}
      onClick={() => setPayrollPage(index + 1)}
      className={`${styles.pageNumber} ${
        payrollPage === index + 1 ? styles.activePage : ""
      }`}
    >
      {index + 1}
    </button>
  ))}

  <button
    className={styles.pageBtn}
    disabled={payrollPage === payrollTotalPages}
    onClick={() => setPayrollPage((p) => p + 1)}
  >
    ›
  </button>
</div>
</div>

     )}

    </div>
  );
}
