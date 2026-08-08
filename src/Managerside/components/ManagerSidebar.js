import React from "react";
import {
  LayoutGrid,
  Users,
  FolderKanban,
  BarChart2,
  Workflow,
  Headphones
} from "lucide-react";
import styles from "../css/ManagerSidebar.module.css";

function ManagerSidebar({ activeTab, setActiveTab, collapsed, setCollapsed }) {
  const navItems = [
    { name: "Dashboard", icon: <LayoutGrid size={18} /> },
    { name: "My Team", icon: <Users size={18} /> },
    { name: "Work", icon: <FolderKanban size={18} /> },
    { name: "Performance", icon: <BarChart2 size={18} /> },
    { name: "Requests / Support", icon: <Workflow size={18} /> }
  ];

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ""}`}>
      <div className={styles.sidebarTop}>
        <div
          className={styles.logomenu}
          onClick={() => {
            if (window.innerWidth > 768) {
              setCollapsed((prev) => !prev);
            }
          }}
          style={{ cursor: window.innerWidth > 768 ? "pointer" : "default" }}
          title={window.innerWidth > 768 ? (collapsed ? "Expand sidebar" : "Collapse sidebar") : ""}
        >
          <svg width="48" height="48" viewBox="0 0 67 57" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M4.24084 51.7974L32.5664 9.06055L62.2408 51.7974C40.0276 37.9745 27.3506 37.7995 4.24084 51.7974Z"
              stroke="#FFFFFF"
              strokeWidth="8"
            />
          </svg>
        </div>

        <nav className={styles.navMenu}>
          {navItems.map((item) => (
            <button
              key={item.name}
              className={`${styles.navItem} ${activeTab === item.name ? styles.activeNavItem : ""}`}
              onClick={() => setActiveTab(item.name)}
              title={item.name}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
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

        <button className={styles.supportItem} title="Support">
          <Headphones size={18} />
          <span>Support</span>
        </button>
      </div>
    </aside>
  );
}

export default ManagerSidebar;
