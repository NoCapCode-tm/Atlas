import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  Users,
  FolderKanban,
  BarChart2,
  Workflow,
  Headphones,
  ChevronDown,
  Megaphone
} from "lucide-react";
import styles from "../css/ManagerSidebar.module.css";

function ManagerSidebar({ activeTab, setActiveTab, collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isTeamActive =
    location.pathname.startsWith("/manager/team") ||
    location.pathname.startsWith("/manager/announcements");
  const [teamDropdownOpen, setTeamDropdownOpen] = React.useState(false);

  const navItems = [
    { name: "Dashboard", icon: <LayoutGrid size={24} />, path: "/manager/dashboard" },
    { name: "My Team", icon: <Users size={24} />, path: "/manager/team" },
    { name: "Work", icon: <FolderKanban size={24} />, path: "/manager/work" },
    { name: "Performance", icon: <BarChart2 size={24} />, path: "/manager/performance" },
    { name: "Requests / Support", icon: <Workflow size={24} />, path: "/manager/requests" }
  ];

  const isActive = (item) => {
    if (item.path) {
      if (item.name === "Work") {
        return location.pathname === "/manager/work" || location.pathname === "/manager/daily-updates";
      }
      return location.pathname === item.path;
    }
    return activeTab === item.name;
  };

  const handleNavClick = (item) => {
    if (item.path) {
      navigate(item.path);
    } else {
      setActiveTab && setActiveTab(item.name);
    }
  };

  return (
    <>
      {!collapsed && (
        <div
          className={styles.sidebarOverlay}
          onClick={() => setCollapsed(true)}
          title="Close sidebar"
        />
      )}
      <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ""}`}>
        <div className={styles.sidebarTop}>
          <div
            className={styles.logomenu}
            onClick={() => setCollapsed(true)}
            style={{ cursor: "pointer" }}
            title="Collapse sidebar"
          >
            <svg width="40" height="40" viewBox="0 0 67 57" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4.24084 51.7974L32.5664 9.06055L62.2408 51.7974C40.0276 37.9745 27.3506 37.7995 4.24084 51.7974Z"
                stroke="#DDDDFF"
                strokeWidth="10.1754"
              />
            </svg>
          </div>

          <nav className={styles.navMenu}>
            {navItems.map((item) => {
              if (item.name === "My Team") {
                return (
                  <div
                    key="My Team"
                    className={`${styles.teamDropdownContainer} ${
                      isTeamActive ? styles.activeTeamDropdown : ""
                    }`}
                  >
                    <div
                      className={styles.teamMainRow}
                      onClick={() => {
                        navigate("/manager/team");
                        setTeamDropdownOpen((prev) => !prev);
                      }}
                      title="My Team"
                    >
                      <div className={styles.teamMainLeft}>
                        <Users size={22} />
                        <span>My Team</span>
                      </div>
                      <div
                        className={`${styles.chevronIcon} ${
                          teamDropdownOpen ? styles.chevronRotated : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setTeamDropdownOpen(!teamDropdownOpen);
                        }}
                        title={teamDropdownOpen ? "Collapse My Team" : "Expand My Team"}
                      >
                        <ChevronDown size={18} />
                      </div>
                    </div>

                    {teamDropdownOpen && (
                      <div className={styles.teamSubMenu}>
                        <button
                          className={`${styles.teamSubItem} ${
                            location.pathname.startsWith("/manager/announcements")
                              ? styles.activeSubItem
                              : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("/manager/announcements");
                          }}
                          title="Announcements"
                        >
                          <Megaphone size={22} />
                          <span>Announcements</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.name}
                  className={`${styles.navItem} ${isActive(item) ? styles.activeNavItem : ""}`}
                  onClick={() => handleNavClick(item)}
                  title={item.name}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className={styles.sidebarBottom}>
          <div className={styles.profileBox} title="Om Vashishtha">
            <div className={styles.profileAvatar}>OV</div>
            <div className={styles.profileDetails}>
              <span className={styles.profileName}>Om Vashishtha</span>
              <span className={styles.profileRole}>Manager</span>
            </div>
          </div>

          <button 
            className={`${styles.supportItem} ${
              location.pathname.startsWith("/manager/support-ticket") ? styles.activeNavItem : ""
            }`} 
            title="Support"
            onClick={() => navigate("/manager/support-ticket")}
          >
            <Headphones size={24} />
            <span>Support</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default ManagerSidebar;
