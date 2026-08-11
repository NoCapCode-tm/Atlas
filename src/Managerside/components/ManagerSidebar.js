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
    { name: "Dashboard", icon: <LayoutGrid size={24} /> },
    { name: "My Team", icon: <Users size={24} /> },
    { name: "Work", icon: <FolderKanban size={24} /> },
    { name: "Performance", icon: <BarChart2 size={24} /> },
    { name: "Requests / Support", icon: <Workflow size={24} /> }
  ];

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
          <Headphones size={24} />
          <span>Support</span>
        </button>
      </div>
    </aside>
  </>
  );
}

export default ManagerSidebar;
