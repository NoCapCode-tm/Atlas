import React, { useEffect, useState } from "react";
import styles from "../CSS/navbar.module.css";
import {
  Menu, Bell, LayoutDashboard, Users, FolderKanban, SquareCheckBig, 
  Heart, ChartNoAxesColumnIncreasing, Megaphone, Wrench, KeyRound, 
  UserCircle, Settings, LogOut, ChevronDown, Pause, Play, User, House, Square 
} from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../../config";

function Navbar() {
  const [menuopen, setMenuopen] = useState(false);
  const [empmenu, setempmenuopen] = useState(false);
  const [toggle, settoggle] = useState("dashboard");
  const [dropdown, setdropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setuser] = useState("");
  const [info, setinfo] = useState(false);
  const [timerStatus, setTimerStatus] = useState("PUNCH_OUT");
  const [seconds, setSeconds] = useState(0);
  const timerRef = React.useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Create refs for the dropdown wrappers
  const timerDropdownRef = React.useRef(null);
  const profileDropdownRef = React.useRef(null);

  const getActive = (paths) => {
    return paths.includes(location.pathname);
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `${API_URL}admin/getuser`,
          { withCredentials: true }
        );
        console.log(response.data.message);
        setuser(response.data.message);
      } catch (error) {
        toast.error("Connection Timed Out");
        navigate("/");
      }
    })();
  }, []);

  // Add click-outside listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the timer dropdown is open and we click outside of its wrapper, close it
      if (timerDropdownRef.current && !timerDropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      
      // If the profile dropdown is open and we click outside of its wrapper, close it
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setinfo(false);
      }
    };

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    
    // Unbind the event listener on cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  useEffect(() => {
    const status = localStorage.getItem("prism_timer_status");
    const start = localStorage.getItem("prism_timer_start");

    if (status === "PUNCH_IN" && start) {
      setTimerStatus("PUNCH_IN");

      timerRef.current = setInterval(() => {
        setSeconds(Math.floor((Date.now() - Number(start)) / 1000));
      }, 1000);
    } else if (status === "BREAK") {
      setTimerStatus("BREAK");
      setSeconds(0);
    } else {
      setTimerStatus("PUNCH_OUT");
      setSeconds(0);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handlelogout = async () => {
    try {
      const response = await axios.get(
        `${API_URL}admin/logout`,
        { withCredentials: true }
      );
      toast.success("Logout Successfull");
      navigate("/");
    } catch (error) {
      toast.error("Logout Unsuccessfull");
    }
  };
  const handlesidebar = () => {
    if (user?.designation?.name === "Administrator") {
      setMenuopen(!menuopen);
    } else if (
      user?.designation?.name === "Employee" ||
      user?.designation?.name === "Intern"
    ) {
      setempmenuopen(!empmenu);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const isEmployee =
    user?.designation?.name === "Employee" ||
    user?.designation?.name === "Intern";

  const formatTimer = (secs) => {
    const h = String(Math.floor(secs / 3600)).padStart(2, "0");
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const punchIn = async () => {
    if (timerStatus === "PUNCH_IN") return;

    await axios.post(
      `${API_URL}employee/start-attendance`,
      { userId: user._id },
      { withCredentials: true }
    );

    const startTime = Date.now();
    localStorage.setItem("prism_timer_status", "PUNCH_IN");
    localStorage.setItem("prism_timer_start", startTime);

    setTimerStatus("PUNCH_IN");

    timerRef.current = setInterval(() => {
      setSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    window.location.reload();
  };

  const takeBreak = async () => {
    if (timerStatus !== "PUNCH_IN") return;

    clearInterval(timerRef.current);
    timerRef.current = null;

    const startTime = Number(localStorage.getItem("prism_timer_start"));
    const workedSeconds = Math.floor((Date.now() - startTime) / 1000);

    await axios.post(
      `${API_URL}employee/save-time`,
      { userId: user._id, seconds: workedSeconds },
      { withCredentials: true }
    );
    localStorage.setItem("prism_timer_status", "BREAK");
    localStorage.removeItem("prism_timer_start");
    setTimerStatus(localStorage.getItem("prism_timer_status"));
    window.location.reload();
  };

  const punchOut = async () => {
    try {
      let workedSeconds = 0;

      const start = localStorage.getItem("prism_timer_start");
      const status = localStorage.getItem("prism_timer_status");

      if (status === "PUNCH_IN" && start) {
        workedSeconds = Math.floor((Date.now() - Number(start)) / 1000);
      }

      await axios.post(
        `${API_URL}employee/punchout`,
        {
          userId: user._id,
          seconds: workedSeconds || 0,
        },
        { withCredentials: true }
      );

      clearInterval(timerRef.current);
      timerRef.current = null;

      localStorage.removeItem("prism_timer_status");
      localStorage.removeItem("prism_timer_start");

      setSeconds(0);
      setTimerStatus("PUNCH_OUT");
      setShowDropdown(false);

      toast.success("Punched out successfully");
      window.location.reload();
    } catch (err) {
      toast.error("Punch out failed");
    }
  };

  const isOpen = menuopen || empmenu;

return (
    <>
      <div className={styles.container}>
        
        {/* LOGO - Search bar wrapper completely removed */}
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
              stroke-width="10.1754"
            />
          </svg>
        </div>
        
        {/* RIGHT SIDE ITEMS */}
        <div className={styles.right}>
          {isEmployee && (
            <div className={styles.timerBoxWrapper} ref={timerDropdownRef}>
              <div className={styles.timerBox} onClick={() => setShowDropdown(!showDropdown)}>
                <button className={styles.playPauseBtn}>
                  {timerStatus === "PUNCH_IN" ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                </button>

                <div className={styles.timerTextWrap}>
                  <p className={styles.timerLabel}>
                    {timerStatus === "PUNCH_IN"
                      ? "WORKING"
                      : timerStatus === "BREAK"
                      ? "ON BREAK"
                      : "PUNCH OUT"}
                  </p>
                  <b className={styles.timerValue}>{formatTimer(seconds)}</b>
                </div>

                <ChevronDown
                  size={16}
                  color="white"
                  className={styles.chevron}
                  style={{ transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </div>

              {showDropdown && (
                <div className={styles.timerDropdown}>
                  <button onClick={punchIn}>
                    <Play size={14} fill="currentColor" /> Punch In
                  </button>
                  <button onClick={takeBreak}>
                    <Pause size={14} fill="currentColor" /> Break
                  </button>
                  <button onClick={punchOut}>
                    <Square size={14} fill="currentColor" /> Punch Out
                  </button>
                </div>
              )}
            </div>
          )}
          
          <div className={styles.notification}>
            <Bell size={20} />
          </div>
          <div
            className={styles.profile}
            ref={profileDropdownRef}
            onClick={() => setinfo(!info)}
          >
            <div className={styles.profilepic}>
              {user?.profilepicture ? (
                <img
                  src={user?.profilepicture}
                  height="100%"
                  width="100%"
                  alt="/"
                />
              ) : (
                user?.name?.charAt(0).toUpperCase() || "U"
              )}
            </div>
            <span className={styles.profileName}>{user?.name?.split(" ")[0]}</span>
            <ChevronDown 
              size={14} 
              className={styles.profileChevron}
              style={{ transform: info ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
            
            {info && (
              <div className={styles.info}>
                <button 
                  className={styles.options} 
                  onClick={() => navigate(isEmployee ? '/employee/profile' : '/profile')}
                >
                  <UserCircle size={18} color="#6d64fa" />
                  Profile
                </button>
                <button 
                  className={styles.options} 
                  onClick={() => navigate(isEmployee ? '/employee/profile' : '/setting')}
                >
                  <Settings size={18} color="#6d64fa" />
                  Settings
                </button>
                <button className={styles.options} onClick={handlelogout}>
                  <LogOut size={18} color="#6d64fa" />
                  Log Out
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
                    stroke-width="10.1754"
                  />
                </svg>
              </div>
            </div>
            <div className={styles.menuScroll}>
              <div
                className={
                  getActive("/dashboard")
                    ? styles.dashboardmenucolor
                    : styles.dashboardmenu
                }
                onClick={() => {
                  navigate("/dashboard");
                  settoggle("dashboard");
                }}
              >
                <House  />
                Home
              </div>
              {/* <div className={
                getActive("/employees")
                  ? styles.dashboardmenucolor
                  : styles.dashboardmenu
              } onClick={() => {
                navigate("/employees")
                settoggle("employees")
              }}>
                <Users />
                Employees
              </div>
              <div className={
                getActive("/projects")
                  ? styles.dashboardmenucolor
                  : styles.dashboardmenu
              } onClick={() => {
                navigate("/projects")
                settoggle("projects")
              }}>
                <FolderKanban />
                Projects
              </div>
              <div className={
                getActive("/tasks")
                  ? styles.dashboardmenucolor
                  : styles.dashboardmenu
              } onClick={() => {
                navigate("/tasks")
                settoggle("tasks")
              }}>
                <SquareCheckBig />
                Tasks

              </div>
              <div className={
                getActive("/hr")
                  ? styles.dashboardmenucolor
                  : styles.dashboardmenu
              } onClick={() => {
                navigate("/hr")
                settoggle("hr")
              }}>
                <Heart />
                HR Hub
              </div> */}

              {/* People Section */}
              <div
                className={
                  getActive([
                    "/people/employees",
                    "/people/managers",
                    // "/people/activity",
                  ])
                    ? styles.dashboardmenucolor
                    : styles.dashboardmenu
                }
                onClick={() => {
                  setdropdown((prev) => (prev === "people" ? "" : "people"));

                  // Open first page if not already inside People
                  if (!location.pathname.startsWith("/people/")) {
                    navigate("/people/employees");
                  }
                }}
              >
                <Users />
                People ▾
              </div>

              {/* DROPDOWN ITEMS */}
              <div
                className={`${styles.reportsDropdown} ${
                  dropdown === "people" ? styles.showDropdown : ""
                }`}
              >
                <div
                  className={
                    location.pathname === "/people/employees"
                      ? styles.dashboardmenucolor
                      : styles.reportItem
                  }
                  onClick={() => navigate("/people/employees")}
                >
                  Employees
                </div>

                <div
                  className={
                    location.pathname === "/people/managers"
                      ? styles.dashboardmenucolor
                      : styles.reportItem
                  }
                  onClick={() => navigate("/people/managers")}
                >
                  Managers
                </div>

                {/* <div
                  className={
                    location.pathname === "/people/activity"
                      ? styles.dashboardmenucolor
                      : styles.reportItem
                  }
                  onClick={() => navigate("/people/activity")}
                >
                  Activity Logs
                </div> */}
              </div>

              {/* Work Section */}
              <div
                className={
                  getActive(["/projects", "/tasks"])
                    ? styles.dashboardmenucolor
                    : styles.dashboardmenu
                }
                onClick={() => {
                  setdropdown((prev) => (prev === "work" ? "" : "work"));

                  if (
                    location.pathname !== "/projects" &&
                    location.pathname !== "/tasks"
                  ) {
                    navigate("/projects");
                  }
                }}
              >
                <FolderKanban />
                Work ▾
              </div>

              {/* DROPDOWN ITEMS */}
              <div
                className={`${styles.reportsDropdown} ${
                  dropdown === "work" ? styles.showDropdown : ""
                }`}
              >
                <div
                  className={
                    location.pathname === "/projects"
                      ? styles.dashboardmenucolor
                      : styles.reportItem
                  }
                  onClick={() => navigate("/projects")}
                >
                  Projects
                </div>

                <div
                  className={
                    location.pathname === "/tasks"
                      ? styles.dashboardmenucolor
                      : styles.reportItem
                  }
                  onClick={() => navigate("/tasks")}
                >
                  Tasks
                </div>
              </div>

              {/* REPORTS MAIN MENU */}
              <div
                className={
                  getActive([
                    "/reports1",
                    "/daily-report-submission",
                    "/redreport",
                    "/project-success",
                    "/task-analytics",
                    "/data-export",
                  ])
                    ? styles.dashboardmenucolor
                    : styles.dashboardmenu
                }
                onClick={() => {
                  setdropdown((prev) => (prev === "reports" ? "" : "reports"));

                  if (
                    !location.pathname.startsWith("/reports1") &&
                    !location.pathname.startsWith("/daily-report-submission") &&
                    !location.pathname.startsWith("/redreport") &&
                    !location.pathname.startsWith("/project-success") &&
                    !location.pathname.startsWith("/task-analytics") &&
                    !location.pathname.startsWith("/data-export")
                  ) {
                    navigate("/reports1");
                  }
                }}
              >
                <ChartNoAxesColumnIncreasing />
                Reports ▾
              </div>

              {/* DROPDOWN ITEMS */}
              <div
                className={`${styles.reportsDropdown} ${
                  dropdown === "reports" ? styles.showDropdown : ""
                }`}
              >
                <div
                  className={
                    location.pathname === "/reports1"
                      ? styles.dashboardmenucolor
                      : styles.reportItem
                  }
                  onClick={() => navigate("/reports1")}
                >
                  Productivity Reports
                </div>
                <div
                  className={
                    location.pathname === "/daily-report-submission"
                      ? styles.dashboardmenucolor
                      : styles.reportItem
                  }
                  onClick={() => navigate("/daily-report-submission")}
                >
                  Daily Report Submission Chart
                </div>
                <div
                  className={
                    location.pathname === "/task-analytics"
                      ? styles.dashboardmenucolor
                      : styles.reportItem
                  }
                  onClick={() => navigate("/task-analytics")}
                >
                  Task Delivery Analytics
                </div>
                <div
                  className={
                    location.pathname === "/redreport"
                      ? styles.dashboardmenucolor
                      : styles.reportItem
                  }
                  onClick={() => navigate("/redreport")}
                >
                  Red Flags Report
                </div>
                <div
                  className={
                    location.pathname === "/project-success"
                      ? styles.dashboardmenucolor
                      : styles.reportItem
                  }
                  onClick={() => navigate("/project-success")}
                >
                  Project Success Reports
                </div>
                <div
                  className={
                    location.pathname === "/data-export"
                      ? styles.dashboardmenucolor
                      : styles.reportItem
                  }
                  onClick={() => navigate("/data-export")}
                >
                  Data Export
                </div>
              </div>

              {/* System MAIN MENU */}
             <div
className={
getActive([
"/role",
"/announcement",
"/support"
])
?styles.dashboardmenucolor
:styles.dashboardmenu
}
onClick={()=>{
setdropdown(prev=>prev==="system"?"":"system");

if(
location.pathname!=="/role" &&
location.pathname!=="/announcement" &&
location.pathname!=="/support"
){
navigate("/role");
}
}}
>
<KeyRound/>
System ▾
</div>

              {/* DROPDOWN ITEMS */}
             <div className={`${styles.reportsDropdown} ${dropdown==="system"?styles.showDropdown:""}`}>

<div
className={
location.pathname==="/role"
?styles.dashboardmenucolor
:styles.reportItem
}
onClick={()=>navigate("/role")}
>
Roles & Permissions
</div>

<div
className={
location.pathname==="/announcement"
?styles.dashboardmenucolor
:styles.reportItem
}
onClick={()=>navigate("/announcement")}
>
Announcement
</div>

<div
className={
location.pathname==="/support"
?styles.dashboardmenucolor
:styles.reportItem
}
onClick={()=>navigate("/support")}
>
Support Tickets
</div>

</div>

              {/* <div className={
                getActive("/performance")
                  ? styles.dashboardmenucolor
                  : styles.dashboardmenu
              } onClick={() => {
                navigate("/performance")
                settoggle("performance")
              }}>
                <ChartNoAxesColumnIncreasing />
                Performance
              </div>
              <div className={
                getActive("/announcement")
                  ? styles.dashboardmenucolor
                  : styles.dashboardmenu
              } onClick={() => {
                navigate("/announcement")
                settoggle("announcement")
              }}>
                <Megaphone />
                Announcements
              </div>
              <div className={
                getActive("/support")
                  ? styles.dashboardmenucolor
                  : styles.dashboardmenu
              } onClick={() => {
                navigate("/support")
                settoggle("support")
              }}>
                <Wrench />
                Support/Tickets
              </div>
              <div className={
                getActive("/role")
                  ? styles.dashboardmenucolor
                  : styles.dashboardmenu
              } onClick={() => {
                navigate("/role")
                settoggle("role")
              }}>
                <KeyRound />
                Role and Permissions
              </div> */}
            </div>
          </div>
        </div>
      )}

      {empmenu && (
        <div
          className={styles.sidebarOverlay}
          onClick={() => setempmenuopen(false)}
        >
          <div
            className={styles.mobilemenu}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.logomenu}>
              {/* <Menu
                onClick={() => {
                  setempmenuopen(false);
                }}
              /> */}
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
                    stroke-width="10.1754"
                  />
                </svg>
              </div>
            </div>
            <div className={styles.menuScroll}>
              <div
                className={
                  getActive("/employee/dashboard")
                    ? styles.dashboardmenucolor
                    : styles.dashboardmenu
                }
                onClick={() => {
                  navigate("/employee/dashboard");
                  settoggle("dashboard");
                }}
              >
                <LayoutDashboard />
                Dashboard
              </div>
              <div
                className={
                  getActive("/employees/tasks")
                    ? styles.dashboardmenucolor
                    : styles.dashboardmenu
                }
                onClick={() => {
                  navigate("/employees/tasks");
                  settoggle("tasks");
                }}
              >
                <Users />
                My Task
              </div>
              <div
                className={
                  getActive("/employee/reports")
                    ? styles.dashboardmenucolor
                    : styles.dashboardmenu
                }
                onClick={() => {
                  navigate("/employee/reports");
                  settoggle("reports");
                }}
              >
                <FolderKanban />
                Daily Reports
              </div>
              <div
                className={
                  getActive("/employee/Calendar")
                    ? styles.dashboardmenucolor
                    : styles.dashboardmenu
                }
                onClick={() => {
                  navigate("/employee/Calendar");
                  settoggle("calendar");
                }}
              >
                <Heart />
                Calendar
              </div>

              <div
                className={
                  getActive("/employee/announcement")
                    ? styles.dashboardmenucolor
                    : styles.dashboardmenu
                }
                onClick={() => {
                  navigate("/employee/announcement");
                  settoggle("performance");
                }}
              >
                <ChartNoAxesColumnIncreasing />
                Announcements
              </div>
              <div
                className={
                  getActive("/employee/support")
                    ? styles.dashboardmenucolor
                    : styles.dashboardmenu
                }
                onClick={() => {
                  navigate("/employee/support");
                  settoggle("support");
                }}
              >
                <Wrench />
                Support / Request
              </div>
              <div
                className={
                  getActive("/employee/profile")
                    ? styles.dashboardmenucolor
                    : styles.dashboardmenu
                }
                onClick={() => {
                  navigate("/employee/profile");
                  settoggle("profile");
                }}
              >
                <User />
                Profile
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
