import React, { useState } from "react";
import styles from "../CSS/navbar.module.css";
import {
  Headphones,
  UserCircle,
  Settings,
  LogOut,
  Search,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

// Custom Home icon
const HomeIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 21V7L10 0L20 7V21H12.5V12.8333H7.5V21H0Z"
      fill="currentColor"
    />
  </svg>
);

// Custom People icon
const PeopleIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={(size * 19) / 25}
    viewBox="0 0 25 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 19V15.675C0 15.0021 0.16572 14.3836 0.497159 13.8195C0.828598 13.2555 1.26894 12.825 1.81818 12.5281C2.99242 11.9146 4.18561 11.4544 5.39773 11.1477C6.60985 10.8409 7.84091 10.6875 9.09091 10.6875C10.3409 10.6875 11.572 10.8409 12.7841 11.1477C13.9962 11.4544 15.1894 11.9146 16.3636 12.5281C16.9129 12.825 17.3532 13.2555 17.6847 13.8195C18.0161 14.3836 18.1818 15.0021 18.1818 15.675V19H0ZM20.4545 19V15.4375C20.4545 14.5667 20.2225 13.7305 19.7585 12.9289C19.2945 12.1273 18.6364 11.4396 17.7841 10.8656C18.75 10.9844 19.6591 11.1872 20.5114 11.4742C21.3636 11.7612 22.1591 12.1125 22.8977 12.5281C23.5795 12.924 24.1004 13.3643 24.4602 13.8492C24.8201 14.3341 25 14.8635 25 15.4375V19H20.4545ZM9.09091 9.5C7.84091 9.5 6.77083 9.0349 5.88068 8.10469C4.99053 7.17448 4.54545 6.05625 4.54545 4.75C4.54545 3.44375 4.99053 2.32552 5.88068 1.39531C6.77083 0.465104 7.84091 0 9.09091 0C10.3409 0 11.411 0.465104 12.3011 1.39531C13.1913 2.32552 13.6364 3.44375 13.6364 4.75C13.6364 6.05625 13.1913 7.17448 12.3011 8.10469C11.411 9.0349 10.3409 9.5 9.09091 9.5ZM20.4545 4.75C20.4545 6.05625 20.0095 7.17448 19.1193 8.10469C18.2292 9.0349 17.1591 9.5 15.9091 9.5C15.7008 9.5 15.4356 9.47526 15.1136 9.42578C14.7917 9.3763 14.5265 9.32188 14.3182 9.2625C14.8295 8.62917 15.2225 7.92656 15.4972 7.15469C15.7718 6.38281 15.9091 5.58125 15.9091 4.75C15.9091 3.91875 15.7718 3.11719 15.4972 2.34531C15.2225 1.57344 14.8295 0.870833 14.3182 0.2375C14.5833 0.138542 14.8485 0.0742188 15.1136 0.0445313C15.3788 0.0148438 15.6439 0 15.9091 0C17.1591 0 18.2292 0.465104 19.1193 1.39531C20.0095 2.32552 20.4545 3.44375 20.4545 4.75ZM2.27273 16.625H15.9091V15.675C15.9091 15.4573 15.857 15.2594 15.7528 15.0813C15.6487 14.9031 15.5114 14.7646 15.3409 14.6656C14.3182 14.1313 13.286 13.7305 12.2443 13.4633C11.2027 13.1961 10.1515 13.0625 9.09091 13.0625C8.0303 13.0625 6.97917 13.1961 5.9375 13.4633C4.89583 13.7305 3.86364 14.1313 2.84091 14.6656C2.67045 14.7646 2.53314 14.9031 2.42898 15.0813C2.32481 15.2594 2.27273 15.4573 2.27273 15.675V16.625ZM9.09091 7.125C9.71591 7.125 10.2509 6.89245 10.696 6.42734C11.1411 5.96224 11.3636 5.40312 11.3636 4.75C11.3636 4.09688 11.1411 3.53776 10.696 3.07266C10.2509 2.60755 9.71591 2.375 9.09091 2.375C8.46591 2.375 7.93087 2.60755 7.4858 3.07266C7.04072 3.53776 6.81818 4.09688 6.81818 4.75C6.81818 5.40312 7.04072 5.96224 7.4858 6.42734C7.93087 6.89245 8.46591 7.125 9.09091 7.125Z"
      fill="currentColor"
    />
  </svg>
);

// Custom Briefcase icon
const BriefcaseIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M27 7H22V6C22 5.20435 21.6839 4.44129 21.1213 3.87868C20.5587 3.31607 19.7956 3 19 3H13C12.2044 3 11.4413 3.31607 10.8787 3.87868C10.3161 4.44129 10 5.20435 10 6V7H5C4.46957 7 3.96086 7.21071 3.58579 7.58579C3.21071 7.96086 3 8.46957 3 9V25C3 25.5304 3.21071 26.0391 3.58579 26.4142C3.96086 26.7893 4.46957 27 5 27H27C27.5304 27 28.0391 26.7893 28.4142 26.4142C28.7893 26.0391 29 25.5304 29 25V9C29 8.46957 28.7893 7.96086 28.4142 7.58579C28.0391 7.21071 27.5304 7 27 7ZM12 6C12 5.73478 12.1054 5.48043 12.2929 5.29289C12.4804 5.10536 12.7348 5 13 5H19C19.2652 5 19.5196 5.10536 19.7071 5.29289C19.8946 5.48043 20 5.73478 20 6V7H12V6ZM27 9V14.2013C23.6247 16.0385 19.8429 17.0007 16 17C12.1573 17.0007 8.37553 16.0389 5 14.2025V9H27ZM27 25H5V16.455C8.42491 18.1302 12.1873 19.0007 16 19C19.8127 19.0001 23.5751 18.1292 27 16.4538V25ZM13 14C13 13.7348 13.1054 13.4804 13.2929 13.2929C13.4804 13.1054 13.7348 13 14 13H18C18.2652 13 18.5196 13.1054 18.7071 13.2929C18.8946 13.4804 19 13.7348 19 14C19 14.2652 18.8946 14.5196 18.7071 14.7071C18.5196 14.8946 18.2652 15 18 15H14C13.7348 15 13.4804 14.8946 13.2929 14.7071C13.1054 14.5196 13 14.2652 13 14Z"
      fill="currentColor"
    />
  </svg>
);

// Custom Documents icon
const DocumentsIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M25 14C25 14.2652 24.8946 14.5196 24.7071 14.7071C24.5196 14.8946 24.2652 15 24 15H19C18.7348 15 18.4804 14.8946 18.2929 14.7071C18.1054 14.5196 18 14.2652 18 14C18 13.7348 18.1054 13.4804 18.2929 13.2929C18.4804 13.1054 18.7348 13 19 13H24C24.2652 13 24.5196 13.1054 24.7071 13.2929C24.8946 13.4804 25 13.7348 25 14ZM24 17H19C18.7348 17 18.4804 17.1054 18.2929 17.2929C18.1054 17.4804 18 17.7348 18 18C18 18.2652 18.1054 18.5196 18.2929 18.7071C18.4804 18.8946 18.7348 19 19 19H24C24.2652 19 24.5196 18.8946 24.7071 18.7071C24.8946 18.5196 25 18.2652 25 18C25 17.7348 24.8946 17.4804 24.7071 17.2929C24.5196 17.1054 24.2652 17 24 17ZM29 7V25C29 25.5304 28.7893 26.0391 28.4142 26.4142C28.0391 26.7893 27.5304 27 27 27H5C4.46957 27 3.96086 26.7893 3.58579 26.4142C3.21071 26.0391 3 25.5304 3 25V7C3 6.46957 3.21071 5.96086 3.58579 5.58579C3.96086 5.21071 4.46957 5 5 5H27C27.5304 5 28.0391 5.21071 28.4142 5.58579C28.7893 5.96086 29 6.46957 29 7ZM27 25V7H5V25H27ZM16.9675 20.75C17.0338 21.0069 16.9953 21.2797 16.8605 21.5082C16.7257 21.7368 16.5057 21.9024 16.2488 21.9688C15.9918 22.0351 15.7191 21.9966 15.4905 21.8618C15.262 21.727 15.0963 21.5069 15.03 21.25C14.7013 19.9675 13.3975 19 11.9987 19C10.6 19 9.2975 19.9675 8.9675 21.25C8.9012 21.5069 8.73554 21.727 8.50698 21.8618C8.27842 21.9966 8.00568 22.0351 7.74875 21.9688C7.49182 21.9024 7.27176 21.7368 7.13696 21.5082C7.00217 21.2797 6.9637 21.0069 7.03 20.75C7.3545 19.5422 8.12157 18.5007 9.17875 17.8325C8.61696 17.274 8.23363 16.5614 8.07736 15.7848C7.92109 15.0082 7.99891 14.2027 8.30096 13.4704C8.60301 12.7381 9.11568 12.112 9.774 11.6714C10.4323 11.2309 11.2066 10.9957 11.9987 10.9957C12.7909 10.9957 13.5652 11.2309 14.2235 11.6714C14.8818 12.112 15.3945 12.7381 15.6965 13.4704C15.9986 14.2027 16.0764 15.0082 15.9201 15.7848C15.7639 16.5614 15.3805 17.274 14.8188 17.8325C15.8771 18.4997 16.6448 19.5416 16.9688 20.75H16.9675ZM12 17C12.3956 17 12.7822 16.8827 13.1111 16.6629C13.44 16.4432 13.6964 16.1308 13.8478 15.7654C13.9991 15.3999 14.0387 14.9978 13.9616 14.6098C13.8844 14.2219 13.6939 13.8655 13.4142 13.5858C13.1345 13.3061 12.7781 13.1156 12.3902 13.0384C12.0022 12.9613 11.6001 13.0009 11.2346 13.1522C10.8692 13.3036 10.5568 13.56 10.3371 13.8889C10.1173 14.2178 10 14.6044 10 15C10 15.5304 10.2107 16.0391 10.5858 16.4142C10.9609 16.7893 11.4696 17 12 17Z"
      fill="currentColor"
    />
  </svg>
);

// Custom Documents and Payroll icon
const DocumentsPayrollIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M27 8H7C6.73478 8 6.48043 7.89464 6.29289 7.70711C6.10536 7.51957 6 7.26522 6 7C6 6.73478 6.10536 6.48043 6.29289 6.29289C6.48043 6.10536 6.73478 6 7 6H24C24.2652 6 24.5196 5.89464 24.7071 5.70711C24.8946 5.51957 25 5.26522 25 5C25 4.73478 24.8946 4.48043 24.7071 4.29289C24.5196 4.10536 24.2652 4 24 4H7C6.20435 4 5.44129 4.31607 4.87868 4.87868C4.31607 5.44129 4 6.20435 4 7V23C4 23.7956 4.31607 24.5587 4.87868 25.1213C5.44129 25.6839 6.20435 26 7 26H27C27.5304 26 28.0391 25.7893 28.4142 25.4142C28.7893 25.0391 29 24.5304 29 24V10C29 9.46957 28.7893 8.96086 28.4142 8.58579C28.0391 8.21071 27.5304 8 27 8ZM27 24H7C6.73478 24 6.48043 23.8946 6.29289 23.7071C6.10536 23.5196 6 23.2652 6 23V9.82875C6.32109 9.94257 6.65933 10.0005 7 10H27V24ZM21 16.5C21 16.2033 21.088 15.9133 21.2528 15.6666C21.4176 15.42 21.6519 15.2277 21.926 15.1142C22.2001 15.0006 22.5017 14.9709 22.7926 15.0288C23.0836 15.0867 23.3509 15.2296 23.5607 15.4393C23.7704 15.6491 23.9133 15.9164 23.9712 16.2074C24.0291 16.4983 23.9993 16.7999 23.8858 17.074C23.7723 17.3481 23.58 17.5824 23.3334 17.7472C23.0867 17.912 22.7967 18 22.5 18C22.1022 18 21.7206 17.842 21.4393 17.5607C21.158 17.2794 21 16.8978 21 16.5Z"
      fill="currentColor"
    />
  </svg>
);

function HRNavbar() {
  const [menuopen, setMenuopen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [info, setinfo] = useState(false);
  const profileDropdownRef = React.useRef(null);

  const getActive = (path) => location.pathname === path;

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setinfo(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlelogout = () => {
    navigate("/hrlogin");
  };

  const handlesidebar = () => {
    setMenuopen(!menuopen);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.logo} onClick={handlesidebar}>
          <svg
            width="30"
            height="30"
            viewBox="0 0 67 57"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.24084 51.7974L32.5664 9.06055L62.2408 51.7974C40.0276 37.9745 27.3506 37.7995 4.24084 51.7974Z"
              stroke="#DDDDFF"
              strokeWidth="10.1754"
            />
          </svg>
        </div>

        <div className={styles.searchBar}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search Employees, Project, Tasks"
          />
        </div>

        <div className={styles.right}>
          <div
            className={styles.profile}
            ref={profileDropdownRef}
            onClick={() => setinfo(!info)}
          >
            <div className={styles.profilepic}>H</div>

            {info && (
              <div className={styles.info}>
                <button className={styles.options} onClick={() => navigate("/hr/profile")}>
                  <UserCircle size={18} color="#6d64fa" /> Profile
                </button>
                <button className={styles.options} onClick={() => navigate("/hr/settings")}>
                  <Settings size={18} color="#6d64fa" /> Settings
                </button>
                <button className={styles.options} onClick={handlelogout}>
                  <LogOut size={18} color="#6d64fa" /> Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {menuopen && (
        <div
          className={styles.sidebarOverlay}
          onClick={() => setMenuopen(false)}
        >
          <div
            className={styles.mobilemenu}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.logomenu}>
              <div className={styles.logohumanity}>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 67 57"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.24084 51.7974L32.5664 9.06055L62.2408 51.7974C40.0276 37.9745 27.3506 37.7995 4.24084 51.7974Z"
                    stroke="#DDDDFF"
                    strokeWidth="10.1754"
                  />
                </svg>
              </div>
            </div>
            <div className={styles.menuScroll}>
              <div
                className={
                  getActive("/hr/dashboard")
                    ? styles.dashboardmenucolor
                    : styles.dashboardmenu
                }
                onClick={() => {
                  navigate("/hr/dashboard");
                  setMenuopen(false);
                }}
              >
                <HomeIcon size={20} />
                Home
              </div>

              <div
                className={
                  getActive("/hr/employees")
                    ? styles.dashboardmenucolor
                    : styles.dashboardmenu
                }
                onClick={() => {
                  navigate("/hr/employees");
                  setMenuopen(false);
                }}
              >
                <PeopleIcon size={20} />
                People
              </div>

              <div
                className={
                  getActive("/hr/hiring")
                    ? styles.dashboardmenucolor
                    : styles.dashboardmenu
                }
                onClick={() => {
                  navigate("/hr/hiring");
                  setMenuopen(false);
                }}
              >
                <BriefcaseIcon size={20} />
                Hiring
              </div>

              <div
                className={
                  getActive("/hr/payroll")
                    ? styles.dashboardmenucolor
                    : styles.dashboardmenu
                }
                onClick={() => {
                  navigate("/hr/payroll");
                  setMenuopen(false);
                }}
              >
                <DocumentsIcon size={20} />
                Onboarding
              </div>

              <div
                className={
                  getActive("/hr/payroll-reports")
                    ? styles.dashboardmenucolor
                    : styles.dashboardmenu
                }
                onClick={() => {
                  navigate("/hr/payroll-reports");
                  setMenuopen(false);
                }}
              >
                <DocumentsPayrollIcon size={20} />
                Documents and Payroll
              </div>
            </div>

            <div className={styles.menuFooter}>
              <div
                className={
                  getActive("/hr/support")
                    ? styles.dashboardmenucolor
                    : styles.dashboardmenu
                }
                onClick={() => {
                  navigate("/hr/support");
                  setMenuopen(false);
                }}
              >
                <Headphones size={20} />
                Support
              </div>

              <div
                className={
                  getActive("/hr/admin-profile")
                    ? styles.dashboardmenucolor
                    : styles.dashboardmenu
                }
                onClick={() => {
                  navigate("/hr/admin-profile");
                  setMenuopen(false);
                }}
              >
                <UserCircle size={20} />
                Admin Profile
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HRNavbar;