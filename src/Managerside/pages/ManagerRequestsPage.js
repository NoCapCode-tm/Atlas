import React, { useState, useRef, useEffect } from "react";
import ManagerHeader from "../components/ManagerHeader";
import ManagerSidebar from "../components/ManagerSidebar";
import ManagerRequests from "../components/ManagerRequests";
import styles from "../css/ManagerDashboard.module.css";
import useWindowWidth from "../../useWindowWidth";

function ManagerRequestsPage() {
  const width = useWindowWidth();
  const isMobile = width <= 425;

  const storedName = localStorage.getItem("managerName") || "Om Vashishtha";
  const initials = storedName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const [collapsed, setCollapsed] = useState(true);

  const prevWidthRef = useRef(width);
  useEffect(() => {
    if (prevWidthRef.current > 768 && width <= 768) {
      setCollapsed(true);
    }
    prevWidthRef.current = width;
  }, [width]);

  return (
    <div className={styles.dashboardContainer}>
      <ManagerHeader
        title=""
        subtitle=""
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
        userName={storedName}
        initials={initials}
      />

      <div className={styles.dashboardBody}>
        <ManagerSidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <main className={styles.mainContent}>
          <ManagerRequests isMobile={isMobile} />
        </main>
      </div>
    </div>
  );
}

export default ManagerRequestsPage;
