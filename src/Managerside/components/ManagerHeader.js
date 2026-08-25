import React from "react";
import { Headphones, Bell } from "lucide-react";
import styles from "../css/ManagerHeader.module.css";

function ManagerHeader({
  title,
  subtitle,
  collapsed,
  setCollapsed,
  isMobile,
  userName = "Om Vashishtha",
  initials = "OV",
  userRole = "Manager",
  showBell = true,
  children
}) {
  if (isMobile) {
    return (
      <>
        <nav className={styles.mobileNavbar} aria-label="Mobile top navigation">
          <div
            className={styles.navLogo}
            title="Atlas"
            style={{ cursor: "pointer" }}
            onClick={() => setCollapsed(false)}
          >
            <svg viewBox="0 0 67 57" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4.24084 51.7974L32.5664 9.06055L62.2408 51.7974C40.0276 37.9745 27.3506 37.7995 4.24084 51.7974Z"
                stroke="#DDDDFF"
                strokeWidth="10.1754"
              />
            </svg>
          </div>

          <div className={styles.navIcons}>
            <button className={styles.iconBtn} title="Support" aria-label="Support">
              <Headphones size={18} />
            </button>

            <button className={styles.notifBtn} title="Notifications" aria-label="Notifications">
              <Bell size={16} />
              <span className={styles.notifBadge} aria-hidden="true" />
            </button>

            <div
              className={styles.userAvatar}
              title={userName}
              aria-label={`Logged in as ${userName}`}
            >
              {initials}
            </div>
          </div>
        </nav>

        {(title || subtitle || children) ? (
          <div className={styles.mobileTitleSection}>
            <div className={styles.headerTitleGroup}>
              {title && <h1 className={styles.headerTitle}>{title}</h1>}
              {subtitle && <p className={styles.headerSubtitle}>{subtitle}</p>}
            </div>
            {children && <div className={styles.mobileHeaderActions}>{children}</div>}
          </div>
        ) : null}
      </>
    );
  }

  return (
    <header className={styles.dashboardHeader}>
      <div className={styles.headerLeftSection}>
        <div
          className={styles.headerLogoToggle}
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg width="30" height="30" viewBox="0 0 67 57" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M4.24084 51.7974L32.5664 9.06055L62.2408 51.7974C40.0276 37.9745 27.3506 37.7995 4.24084 51.7974Z"
              stroke="#DDDDFF"
              strokeWidth="10.1754"
            />
          </svg>
        </div>

        {(title || subtitle) ? (
          <div className={styles.headerTitleGroup}>
            {title && <h1 className={styles.headerTitle}>{title}</h1>}
            {subtitle && <p className={styles.headerSubtitle}>{subtitle}</p>}
          </div>
        ) : null}
      </div>

      <div className={styles.headerRightSection}>
        {children}

        <div className={styles.headerUserControls}>
          {showBell && (
            <button className={styles.notificationBtn} title="Notifications">
              <Bell size={18} />
              <span className={styles.notificationBadge} />
            </button>
          )}

          <div className={styles.headerDivider} />

          <div className={styles.headerUserProfile}>
            <div className={styles.headerUserInfo}>
              <span className={styles.headerUserName}>{userName}</span>
              <span className={styles.headerUserRole}>{userRole}</span>
            </div>
            <div className={styles.headerUserAvatar} title={userName}>
              {initials}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default ManagerHeader;
