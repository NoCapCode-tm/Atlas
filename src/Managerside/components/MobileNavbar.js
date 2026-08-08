import React from "react";
import { Headphones, Bell } from "lucide-react";
import styles from "../css/MobileNavbar.module.css";

/**
 * MobileNavbar — shown only on mobile (≤ 425px).
 * Mirrors the Figma top bar:  [Atlas Logo]  ...  [Headphone] [Bell] [Avatar]
 *
 * Props:
 *  - userName  : full name string, e.g. "Om Vashishtha"
 *  - initials  : 2-letter initials string, e.g. "OV"
 */
function MobileNavbar({ userName = "User", initials = "U" }) {
  return (
    <nav className={styles.mobileNavbar} aria-label="Mobile top navigation">

      {/* Atlas Logo — same SVG path used in ManagerSidebar */}
      <div className={styles.navLogo} title="Atlas">
        <svg viewBox="0 0 67 57" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4.24084 51.7974L32.5664 9.06055L62.2408 51.7974C40.0276 37.9745 27.3506 37.7995 4.24084 51.7974Z"
            stroke="#FFFFFF"
            strokeWidth="8"
          />
        </svg>
      </div>

      {/* Right-side icon group */}
      <div className={styles.navIcons}>

        {/* Headphone / Support button */}
        <button className={styles.iconBtn} title="Support" aria-label="Support">
          <Headphones />
        </button>

        {/* Notification bell — rounded square with red badge */}
        <button className={styles.notifBtn} title="Notifications" aria-label="Notifications">
          <Bell />
          <span className={styles.notifBadge} aria-hidden="true" />
        </button>

        {/* User avatar — shows initials */}
        <div
          className={styles.userAvatar}
          title={userName}
          aria-label={`Logged in as ${userName}`}
        >
          {initials}
        </div>

      </div>
    </nav>
  );
}

export default MobileNavbar;
