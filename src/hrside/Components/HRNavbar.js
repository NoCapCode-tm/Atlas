import React, { useState } from "react";
import styles from "../CSS/navbar.module.css";
import {
  Search,
  UserCircle,
  Settings,
  LogOut,
  Users,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSidebar } from "./SidebarContext";

function HRNavbar() {
  const [user] = useState({ name: "Aaniya Test", profilepicture: "" });
  const [info, setInfo] = useState(false);
  const [search, setSearch] = useState("");
  const [dropdown, setdropdown] = useState(false);
  const { collapsed, setCollapsed } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const profileDropdownRef = React.useRef(null);

  const getActive = (paths) => {
    if (Array.isArray(paths)) return paths.includes(location.pathname);
    return location.pathname === paths;
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setInfo(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    navigate("/hrlogin");
  };

  return (
    <>
      {/* ── Persistent sidebar ── */}
      <div className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ""}`}>
        <div
          className={styles.logomenu}
          onClick={() => setCollapsed(!collapsed)}
          style={{ cursor: "pointer" }}
        >
          <svg width="34" height="34" viewBox="0 0 67 57" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M4.24084 51.7974L32.5664 9.06055L62.2408 51.7974C40.0276 37.9745 27.3506 37.7995 4.24084 51.7974Z"
              stroke="#DDDDFF"
              strokeWidth="10.1754"
            />
          </svg>
        </div>

        <div className={styles.menuScroll}>
          <div
            className={getActive("/hr/dashboard") ? styles.dashboardmenucolor : styles.dashboardmenu}
            onClick={() => navigate("/hr/dashboard")}
          >
            <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 21V7L10 0L20 7V21H12.5V12.8333H7.5V21H0Z" fill="currentColor" />
            </svg>
            <span>Home</span>
          </div>

          <div
            className={getActive(["/hr/employees", "/hr/departments"]) ? styles.dashboardmenucolor : styles.dashboardmenu}
            onClick={() => {
              setdropdown((prev) => (prev === "employees" ? "" : "employees"));
              if (!location.pathname.startsWith("/hr/employees") && location.pathname !== "/hr/departments") {
                navigate("/hr/employees");
              }
            }}
          >
            <Users />
            <span>People</span>
          </div>
          <div className={`${styles.reportsDropdown} ${dropdown === "employees" ? styles.showDropdown : ""}`}>
            <div
              className={location.pathname === "/hr/employees" ? styles.dashboardmenucolor : styles.reportItem}
              onClick={() => navigate("/hr/employees")}
            >
              All Employees
            </div>
            <div
              className={location.pathname === "/hr/departments" ? styles.dashboardmenucolor : styles.reportItem}
              onClick={() => navigate("/hr/departments")}
            >
              Departments
            </div>
          </div>

          <div
            className={getActive(["/hr/attendance", "/hr/leave-requests"]) ? styles.dashboardmenucolor : styles.dashboardmenu}
            onClick={() => {
              setdropdown((prev) => (prev === "attendance" ? "" : "attendance"));
              if (location.pathname !== "/hr/attendance" && location.pathname !== "/hr/leave-requests") {
                navigate("/hr/attendance");
              }
            }}
          >
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M27 7H22V6C22 5.20435 21.6839 4.44129 21.1213 3.87868C20.5587 3.31607 19.7956 3 19 3H13C12.2044 3 11.4413 3.31607 10.8787 3.87868C10.3161 4.44129 10 5.20435 10 6V7H5C4.46957 7 3.96086 7.21071 3.58579 7.58579C3.21071 7.96086 3 8.46957 3 9V25C3 25.5304 3.21071 26.0391 3.58579 26.4142C3.96086 26.7893 4.46957 27 5 27H27C27.5304 27 28.0391 26.7893 28.4142 26.4142C28.7893 26.0391 29 25.5304 29 25V9C29 8.46957 28.7893 7.96086 28.4142 7.58579C28.0391 7.21071 27.5304 7 27 7ZM12 6C12 5.73478 12.1054 5.48043 12.2929 5.29289C12.4804 5.10536 12.7348 5 13 5H19C19.2652 5 19.5196 5.10536 19.7071 5.29289C19.8946 5.48043 20 5.73478 20 6V7H12V6ZM27 9V14.2013C23.6247 16.0385 19.8429 17.0007 16 17C12.1573 17.0007 8.37553 16.0389 5 14.2025V9H27ZM27 25H5V16.455C8.42491 18.1302 12.1873 19.0007 16 19C19.8127 19.0001 23.5751 18.1292 27 16.4538V25ZM13 14C13 13.7348 13.1054 13.4804 13.2929 13.2929C13.4804 13.1054 13.7348 13 14 13H18C18.2652 13 18.5196 13.1054 18.7071 13.2929C18.8946 13.4804 19 13.7348 19 14C19 14.2652 18.8946 14.5196 18.7071 14.7071C18.5196 14.8946 18.2652 15 18 15H14C13.7348 15 13.4804 14.8946 13.2929 14.7071C13.1054 14.5196 13 14.2652 13 14Z" fill="currentColor" />
            </svg>
            <span>Hiring</span>
          </div>
          <div className={`${styles.reportsDropdown} ${dropdown === "attendance" ? styles.showDropdown : ""}`}>
            <div
              className={location.pathname === "/hr/attendance" ? styles.dashboardmenucolor : styles.reportItem}
              onClick={() => navigate("/hr/attendance")}
            >
              Attendance Log
            </div>
            <div
              className={location.pathname === "/hr/leave-requests" ? styles.dashboardmenucolor : styles.reportItem}
              onClick={() => navigate("/hr/leave-requests")}
            >
              Leave Requests
            </div>
          </div>

          <div
            className={getActive("/hr/payroll") ? styles.dashboardmenucolor : styles.dashboardmenu}
            onClick={() => navigate("/hr/payroll")}
          >
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M25 14C25 14.2652 24.8946 14.5196 24.7071 14.7071C24.5196 14.8946 24.2652 15 24 15H19C18.7348 15 18.4804 14.8946 18.2929 14.7071C18.1054 14.5196 18 14.2652 18 14C18 13.7348 18.1054 13.4804 18.2929 13.2929C18.4804 13.1054 18.7348 13 19 13H24C24.2652 13 24.5196 13.1054 24.7071 13.2929C24.8946 13.4804 25 13.7348 25 14ZM24 17H19C18.7348 17 18.4804 17.1054 18.2929 17.2929C18.1054 17.4804 18 17.7348 18 18C18 18.2652 18.1054 18.5196 18.2929 18.7071C18.4804 18.8946 18.7348 19 19 19H24C24.2652 19 24.5196 18.8946 24.7071 18.7071C24.8946 18.5196 25 18.2652 25 18C25 17.7348 24.8946 17.4804 24.7071 17.2929C24.5196 17.1054 24.2652 17 24 17ZM29 7V25C29 25.5304 28.7893 26.0391 28.4142 26.4142C28.0391 26.7893 27.5304 27 27 27H5C4.46957 27 3.96086 26.7893 3.58579 26.4142C3.21071 26.0391 3 25.5304 3 25V7C3 6.46957 3.21071 5.96086 3.58579 5.58579C3.96086 5.21071 4.46957 5 5 5H27C27.5304 5 28.0391 5.21071 28.4142 5.58579C28.7893 5.96086 29 6.46957 29 7ZM27 25V7H5V25H27ZM16.9675 20.75C17.0338 21.0069 16.9953 21.2797 16.8605 21.5082C16.7257 21.7368 16.5057 21.9024 16.2488 21.9688C15.9918 22.0351 15.7191 21.9966 15.4905 21.8618C15.262 21.727 15.0963 21.5069 15.03 21.25C14.7013 19.9675 13.3975 19 11.9987 19C10.6 19 9.2975 19.9675 8.9675 21.25C8.9012 21.5069 8.73554 21.727 8.50698 21.8618C8.27842 21.9966 8.00568 22.0351 7.74875 21.9688C7.49182 21.9024 7.27176 21.7368 7.13696 21.5082C7.00217 21.2797 6.9637 21.0069 7.03 20.75C7.3545 19.5422 8.12157 18.5007 9.17875 17.8325C8.61696 17.274 8.23363 16.5614 8.07736 15.7848C7.92109 15.0082 7.99891 14.2027 8.30096 13.4704C8.60301 12.7381 9.11568 12.112 9.774 11.6714C10.4323 11.2309 11.2066 10.9957 11.9987 10.9957C12.7909 10.9957 13.5652 11.2309 14.2235 11.6714C14.8818 12.112 15.3945 12.7381 15.6965 13.4704C15.9986 14.2027 16.0764 15.0082 15.9201 15.7848C15.7639 16.5614 15.3805 17.274 14.8188 17.8325C15.8771 18.4997 16.6448 19.5416 16.9688 20.75H16.9675ZM12 17C12.3956 17 12.7822 16.8827 13.1111 16.6629C13.44 16.4432 13.6964 16.1308 13.8478 15.7654C13.9991 15.3999 14.0387 14.9978 13.9616 14.6098C13.8844 14.2219 13.6939 13.8655 13.4142 13.5858C13.1345 13.3061 12.7781 13.1156 12.3902 13.0384C12.0022 12.9613 11.6001 13.0009 11.2346 13.1522C10.8692 13.3036 10.5568 13.56 10.3371 13.8889C10.1173 14.2178 10 14.6044 10 15C10 15.5304 10.2107 16.0391 10.5858 16.4142C10.9609 16.7893 11.4696 17 12 17Z" fill="currentColor" />
            </svg>
            <span>Onboarding</span>
          </div>

          <div
            className={getActive(["/hr/payroll-reports", "/hr/attendance-reports"]) ? styles.dashboardmenucolor : styles.dashboardmenu}
            onClick={() => {
              setdropdown((prev) => (prev === "reports" ? "" : "reports"));
              if (location.pathname !== "/hr/payroll-reports" && location.pathname !== "/hr/attendance-reports") {
                navigate("/hr/payroll-reports");
              }
            }}
          >
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M27 8H7C6.73478 8 6.48043 7.89464 6.29289 7.70711C6.10536 7.51957 6 7.26522 6 7C6 6.73478 6.10536 6.48043 6.29289 6.29289C6.48043 6.10536 6.73478 6 7 6H24C24.2652 6 24.5196 5.89464 24.7071 5.70711C24.8946 5.51957 25 5.26522 25 5C25 4.73478 24.8946 4.48043 24.7071 4.29289C24.5196 4.10536 24.2652 4 24 4H7C6.20435 4 5.44129 4.31607 4.87868 4.87868C4.31607 5.44129 4 6.20435 4 7V23C4 23.7956 4.31607 24.5587 4.87868 25.1213C5.44129 25.6839 6.20435 26 7 26H27C27.5304 26 28.0391 25.7893 28.4142 25.4142C28.7893 25.0391 29 24.5304 29 24V10C29 9.46957 28.7893 8.96086 28.4142 8.58579C28.0391 8.21071 27.5304 8 27 8ZM27 24H7C6.73478 24 6.48043 23.8946 6.29289 23.7071C6.10536 23.5196 6 23.2652 6 23V9.82875C6.32109 9.94257 6.65933 10.0005 7 10H27V24ZM21 16.5C21 16.2033 21.088 15.9133 21.2528 15.6666C21.4176 15.42 21.6519 15.2277 21.926 15.1142C22.2001 15.0006 22.5017 14.9709 22.7926 15.0288C23.0836 15.0867 23.3509 15.2296 23.5607 15.4393C23.7704 15.6491 23.9133 15.9164 23.9712 16.2074C24.0291 16.4983 23.9993 16.7999 23.8858 17.074C23.7723 17.3481 23.58 17.5824 23.3334 17.7472C23.0867 17.912 22.7967 18 22.5 18C22.1022 18 21.7206 17.842 21.4393 17.5607C21.158 17.2794 21 16.8978 21 16.5Z" fill="currentColor" />
            </svg>
            <span>Documents and Payroll</span>
          </div>
          <div className={`${styles.reportsDropdown} ${dropdown === "reports" ? styles.showDropdown : ""}`}>
            <div
              className={location.pathname === "/hr/payroll-reports" ? styles.dashboardmenucolor : styles.reportItem}
              onClick={() => navigate("/hr/payroll-reports")}
            >
              Payroll Reports
            </div>
            <div
              className={location.pathname === "/hr/attendance-reports" ? styles.dashboardmenucolor : styles.reportItem}
              onClick={() => navigate("/hr/attendance-reports")}
            >
              Attendance Reports
            </div>
          </div>
        </div>
      </div>

      {/* ── Top bar (offset by sidebar width) ── */}
      <div className={`${styles.container} ${collapsed ? styles.containerCollapsed : ""}`}>
        <div className={styles.searchWrapper}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search Employees, Project, Tasks"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.right}>
          <div className={styles.profile} ref={profileDropdownRef} onClick={() => setInfo(!info)}>
            <div className={styles.profilepic}>
              {user?.profilepicture ? (
                <img src={user?.profilepicture} height="100%" width="100%" alt="/" />
              ) : (
                user?.name?.charAt(0).toUpperCase() || "H"
              )}
            </div>

            {info && (
              <div className={styles.info}>
                <button className={styles.options} onClick={() => navigate("/hr/profile")}>
                  <UserCircle size={18} color="#6d64fa" />
                  Profile
                </button>
                <button className={styles.options} onClick={() => navigate("/hr/settings")}>
                  <Settings size={18} color="#6d64fa" />
                  Settings
                </button>
                <button className={styles.options} onClick={handleLogout}>
                  <LogOut size={18} color="#6d64fa" />
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default HRNavbar;