import React, { useEffect, useState } from 'react'
import styles from '../CSS/navbar.module.css'
import { Bell,Volume2 , Users, FolderKanban, SquareCheckBig, ChartNoAxesColumnIncreasing, Megaphone, KeyRound, UserCircle, Settings, ChevronDown, Play, User, Activity, BarChart3, Shield, MessageSquare, Plus, Home, Wrench, Clock, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from 'react-router';
import axios from 'axios';
import { toast } from 'react-toastify';

function Navbar({ onAddEmployee, onAssignTask }) {
  const [menuopen, setMenuopen] = useState(false);
  const [empmenu, setempmenuopen] = useState(false);
  const [dropdown, setdropdown] = useState(false)
  const navigate = useNavigate()
  const location = useLocation();
  const [user, setuser] = useState("")
  const [info, setinfo] = useState(false)
  const [timerStatus, setTimerStatus] = useState("PUNCH_OUT");
  const [seconds, setSeconds] = useState(0);
  const timerRef = React.useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const getActive = (path) => {
    return location.pathname === path;
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("https://atlasbackend-1bt5.onrender.com/api/v1/admin/getuser", { withCredentials: true })
        console.log(response.data.message)
        setuser(response.data.message)
      } catch (error) {

         // (toast.error is the real as it show to out the session and render to ./  page )
       // toast.error("Connection Timed Out")
       // navigate("/")
        //before push or pull changes krna hai isko.

        console.log("API not reachable - using offline mode")
        // Don't redirect - just show sidebar with placeholder data
        //right now mene console pe error bej diya hai rather than toast use krna 
       
      }
    })()
  }, [])

  useEffect(() => {
    const status = localStorage.getItem("prism_timer_status");
    const start = localStorage.getItem("prism_timer_start");

    if (status === "PUNCH_IN" && start) {
      setTimerStatus("PUNCH_IN");

      timerRef.current = setInterval(() => {
        setSeconds(Math.floor((Date.now() - Number(start)) / 1000));
      }, 1000);
    } 
    else if (status === "BREAK") {
      setTimerStatus("BREAK");
      setSeconds(0);
    } 
    else {
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
      const response = await axios.get("https://atlasbackend-1bt5.onrender.com/api/v1/admin/logout", { withCredentials: true })
      toast.success("Logout Successfull")
      navigate("/login")
    } catch (error) {
      toast.error("Logout Unsuccessfull")
    }
  }



// as not want 

  // const getGreeting = () => {
  //   const hour = new Date().getHours();
  //   if (hour < 12) return "Good morning";
  //   if (hour < 18) return "Good afternoon";
  //   return "Good evening";
  // };

  const isEmployee = user?.designation?.name === "Employee" || user?.designation?.name === "Intern";

  const formatTimer = (secs) => {
    const h = String(Math.floor(secs / 3600)).padStart(2, "0");
    const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const punchIn = async () => {
    if (timerStatus === "PUNCH_IN") return;
    await axios.post(
      "https://atlasbackend-1bt5.onrender.com/api/v1/employee/start-attendance",
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
    window.location.reload()
  };

  const takeBreak = async () => {
    if (timerStatus !== "PUNCH_IN") return;
    clearInterval(timerRef.current);
    timerRef.current = null;
    const startTime = Number(localStorage.getItem("prism_timer_start"));
    const workedSeconds = Math.floor((Date.now() - startTime) / 1000);
    await axios.post(
      "https://atlasbackend-1bt5.onrender.com/api/v1/employee/save-time",
      { userId: user._id, seconds: workedSeconds },
      { withCredentials: true }
    );
    localStorage.setItem("prism_timer_status", "BREAK");
    localStorage.removeItem("prism_timer_start");
    setTimerStatus(localStorage.getItem("prism_timer_status"));
    window.location.reload()
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
        "https://atlasbackend-1bt5.onrender.com/api/v1/employee/punchout",
        { userId: user._id, seconds: workedSeconds || 0 },
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
      window.location.reload()
    } catch (err) {
      toast.error("Punch out failed");
    }
  };

  /* ========== OPEN/CLOSE STATE FOR SECTION HEADERS (People, Work, etc.) ========== */
  const [expandedSections, setExpandedSections] = useState({
    people: true,
    work: false,
    performance: false,
    system: false
  });

  const toggleSection = (key) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  /* ========== SIDEBAR NAV ITEMS — FLAT STRUCTURE ========== */
  const navItems = [
    { type: "main", icon: <Home size={18} />, label: "Home", path: "/dashboard", active: getActive("/dashboard"), onClick: () => { navigate("/dashboard"); } },
    { type: "divider" },
    { type: "section", key: "people", icon: <Users size={18} />, label: "People" },
    { type: "sub", icon: <User size={14} />, label: "Employees", path: "/employees", active: getActive("/employees"), onClick: () => { navigate("/employees"); } },
    { type: "sub", icon: <UserCircle size={14} />, label: "Managers", path: "/employees", active: false, onClick: () => { navigate("/employees"); } },
    { type: "sub", icon: <Activity size={14} />, label: "Activity Logs", path: "/employees", active: false, onClick: () => { navigate("/employees"); } },
    { type: "section", key: "work", icon: <FolderKanban size={18} />, label: "Work" },
    { type: "sub", icon: <FolderKanban size={14} />, label: "Projects", path: "/projects", active: getActive("/projects"), onClick: () => { navigate("/projects"); } },
    { type: "sub", icon: <SquareCheckBig size={14} />, label: "Tasks", path: "/tasks", active: getActive("/tasks"), onClick: () => { navigate("/tasks"); } },
    { type: "section", key: "performance", icon: <BarChart3 size={18} />, label: "Performance" },
    { type: "sub", icon: <ChartNoAxesColumnIncreasing size={14} />, label: "Overview", path: "/performance", active: getActive("/performance"), onClick: () => { navigate("/performance"); } },
    { type: "sub", icon: <BarChart3 size={14} />, label: "Analysis", path: "/heatmap", active: getActive("/heatmap"), onClick: () => { navigate("/heatmap"); } },
    { type: "section", key: "system", icon: <Shield size={18} />, label: "System" },
    { type: "sub", icon: <KeyRound size={14} />, label: "Roles & Permissions", path: "/role", active: getActive("/role"), onClick: () => { navigate("/role"); } },
    { type: "sub", icon: <Megaphone size={14} />, label: "Announcements", path: "/announcement", active: getActive("/announcement"), onClick: () => { navigate("/announcement"); } },
    { type: "sub", icon: <MessageSquare size={14} />, label: "Support Tickets", path: "/support", active: getActive("/support"), onClick: () => { navigate("/support"); } },
  ];

  /* ========== BOTTOM NAV ITEMS — pinned to sidebar bottom ========== */
  const bottomNavItems = [
    { type: "main", icon: <Wrench size={18} />, label: "Support", path: "/support", active: getActive("/support"), onClick: () => { navigate("/support"); } },
    { type: "main", icon: <UserCircle size={18} />, label: "Admin Profile", onClick: () => { setinfo(!info); } },
  ];

  const closeSidebar = () => setMenuopen(false);

  return (
    <>
      {/* ============ FIXED TOP NAVBAR ============ */}
      <div className={styles.container}>
        <div className={styles.navLeft}>
          {/* Hamburger menu icon for mobile */}
          <div className={styles.hamburgerBtn} onClick={() => setMenuopen(true)}>
            <Menu size={24} />
          </div>
          {/* Logo (visible on mobile)
          <div className={styles.logo} onClick={() => setMenuopen(!menuopen)}>
            <img src={require("./atlas.png")} alt="Atlas" className={`${styles.logoImg} ${menuopen ? styles.logoRotated : ""}`} />
          </div> */}
        </div>
        <div className={styles.right}>
          {isEmployee && (
            <div className={styles.timerBoxWrapper}>
              <div className={styles.timerBox}>
                <button className={styles.playPauseBtn}>
                  {timerStatus === "PUNCH_IN" ? <Clock size={14} /> : <Play size={14} />}
                </button>
                <div>
                  <p className={styles.timerLabel}>{timerStatus === "PUNCH_IN" ? "WORKING" : timerStatus === "BREAK" ? "ON BREAK" : "PUNCH OUT"}</p>
                  <b className={styles.timerValue}>{formatTimer(seconds)}</b>
                </div>
                <ChevronDown size={14} onClick={() => setShowDropdown(!showDropdown)} color='white'/>
              </div>
              {showDropdown && (
                <div className={styles.timerDropdown}>
                  <button onClick={punchIn}>▶ Punch In</button>
                  <button onClick={takeBreak}>⏸ Break</button>
                  <button onClick={punchOut}>⏹ Punch Out</button>
                </div>
              )}
            </div>
          )}
          <div className={styles.separator} />
        <button
  className={styles.announceIconBtn}
  onClick={() => navigate("/announcement")}
>
  <Volume2 size={16} />
</button>
          <button className={styles.announceIconBtn} onClick={() => navigate("/announcement")}>
            <Bell size={16} />
          </button>
        </div>
      </div>

      {/* ============ FIXED LEFT SIDEBAR (Desktop) ============ */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <img src="/favicon/favicon.svg" alt="Logo" className={styles.sidebarFavicon} />
        </div>

        <div className={styles.sidebarNav}>
          {navItems.map((item, idx) => {
            if (item.type === "divider") {
              return <div key={`div-${idx}`} className={styles.sidebarDivider} />;
            }
            if (item.type === "main") {
              return (
                <div
                  key={item.label}
                  className={`${styles.sidebarItem} ${item.active ? styles.sidebarItemActive : ""}`}
                  onClick={item.onClick}
                >
                  <span className={styles.sidebarItemIcon}>{item.icon}</span>
                  <span className={styles.sidebarItemLabel}>{item.label}</span>
                  {item.active && <div className={styles.sidebarActiveDot} />}
                </div>
              );
            }
            if (item.type === "section") {
              const isOpen = expandedSections[item.key];
              return (
                <div key={`sec-${item.key}`}>
                  <div
                    className={styles.sidebarItem}
                    onClick={() => toggleSection(item.key)}
                    style={{ cursor: "pointer" }}
                  >
                    <span className={styles.sidebarItemIcon}>{item.icon}</span>
                    <span className={styles.sidebarItemLabel}>{item.label}</span>
                    <ChevronDown
                      size={14}
                      style={{
                        transition: 'transform 0.3s ease',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        opacity: 0.4
                      }}
                    />
                  </div>
                  {isOpen && (
                    <div>
                      {/* sub items rendered below via type === "sub" */}
                    </div>
                  )}
                </div>
              );
            }
            if (item.type === "sub") {
              // Find the parent section key by looking backwards through items
              let parentOpen = true;
              for (let i = idx - 1; i >= 0; i--) {
                if (navItems[i].type === "section") {
                  parentOpen = expandedSections[navItems[i].key];
                  break;
                }
              }
              // Only render if parent section is open
              if (!parentOpen) return null;
              return (
                <div
                  key={`sub-${item.label}`}
                  className={`${styles.sidebarSubItem} ${item.active ? styles.sidebarSubItemActive : ""}`}
                  onClick={item.onClick}
                >
                  <span className={styles.sidebarSubItemIcon}>{item.icon}</span>
                  <span className={styles.sidebarSubItemLabel}>{item.label}</span>
                </div>
              );
            }
            return null;
          })}
        </div>

        <div className={styles.sidebarFooter}>
          <div className={styles.sidebarDivider} />
          {bottomNavItems.map((item, idx) => (
            <div
              key={item.label}
              className={`${styles.sidebarItem} ${item.active ? styles.sidebarItemActive : ""}`}
              onClick={item.onClick}
            >
              <span className={styles.sidebarItemIcon}>{item.icon}</span>
              <span className={styles.sidebarItemLabel}>{item.label}</span>
              {item.active && <div className={styles.sidebarActiveDot} />}
            </div>
          ))}
        </div>
      </div>

      {/* ============ MOBILE SIDEBAR DRAWER ============ */}
      {menuopen && (
        <div className={styles.mobileOverlay} onClick={closeSidebar}>
          <div className={styles.mobileSidebar} onClick={(e) => e.stopPropagation()}>
            <div className={styles.mobileSidebarHeader}>
              <img src="/favicon/favicon.svg" alt="Logo" className={styles.sidebarFavicon} />
              <button className={styles.mobileCloseBtn} onClick={closeSidebar}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.sidebarNav}>
              {navItems.map((item, idx) => {
                if (item.type === "divider") return <div key={`div-${idx}`} className={styles.sidebarDivider} />;
                if (item.type === "main") {
                  return (
                    <div key={item.label} className={`${styles.sidebarItem} ${item.active ? styles.sidebarItemActive : ""}`}
                      onClick={() => { item.onClick(); closeSidebar(); }}>
                      <span className={styles.sidebarItemIcon}>{item.icon}</span>
                      <span className={styles.sidebarItemLabel}>{item.label}</span>
                    </div>
                  );
                }
                if (item.type === "section") {
                  return null; // Simplified for mobile
                }
                if (item.type === "sub") {
                  return (
                    <div key={`sub-${item.label}`} className={`${styles.sidebarSubItem} ${item.active ? styles.sidebarSubItemActive : ""}`}
                      onClick={() => { item.onClick(); closeSidebar(); }}>
                      <span className={styles.sidebarSubItemIcon}>{item.icon}</span>
                      <span className={styles.sidebarSubItemLabel}>{item.label}</span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
            <div className={styles.sidebarFooter}>
              <div className={styles.sidebarDivider} />
              {bottomNavItems.map((item, idx) => (
                <div
                  key={`mobile-${item.label}`}
                  className={`${styles.sidebarItem} ${item.active ? styles.sidebarItemActive : ""}`}
                  onClick={() => { item.onClick(); closeSidebar(); }}
                >
                  <span className={styles.sidebarItemIcon}>{item.icon}</span>
                  <span className={styles.sidebarItemLabel}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar