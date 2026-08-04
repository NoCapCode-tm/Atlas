import React from "react";
import styles from "../CSS/Entrypage.module.css";
import { User, Briefcase, Users, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";

const AtlasRoleSelect = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: "employee",
      label: "Employee",
      icon: <User size={28} strokeWidth={1.5} />,
      path: "/employeelogin",
    },
    {
      id: "manager",
      label: "Manager",
      icon: <Briefcase size={28} strokeWidth={1.5} />,
      path: "/managerlogin",
    },
    {
      id: "hr",
      label: "Human Resource",
      icon: <Users size={28} strokeWidth={1.5} />,
      path: "/hrlogin",
    },
    {
      id: "admin",
      label: "Administrator",
      icon: <ShieldCheck size={28} strokeWidth={1.5} />,
      path: "/login",
    },
  ];

  return (
    <div className={styles.wrapper}>
      {/* ── LEFT PANEL ── */}
      <div className={styles.leftPanel}>
        
        {/* Invisible spacer to perfectly center the main content while using space-between */}
        <div className={styles.spacer}></div>

        <div className={styles.contentContainer}>
          <div className={styles.header}>
            <h1>Welcome to <span className={styles.brandName}>Aτλας</span> Workspace</h1>
            <p>
              Select your functional portal to access the workspace<br />
              environments designed for your role.
            </p>
            <ul className={styles.featuresList}>
              <li>✓ Secure authentication</li>
              <li>✓ Role-based permissions</li>
              <li>✓ Real-time collaboration</li>
            </ul>
          </div>

          <div className={styles.cardGrid}>
            {roles.map((role) => (
              <button
                key={role.id}
                className={styles.roleCard}
                onClick={() => navigate(role.path)}
              >
                <div className={styles.iconBox}>{role.icon}</div>
                <span className={styles.cardLabel}>{role.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className={styles.footer}>
              <svg
                  width="28"
                  height="28"
                  viewBox="0 0 193 160"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="Atlas Workspace Logo"
                  role="img"
                >
                <path
                  d="M10.4258 149.295L94.4258 22.2947L182.426 149.295C116.552 108.217 78.9582 107.698 10.4258 149.295Z"
                  stroke="white"
                  strokeWidth="18"
                />
              </svg>
          <p className={styles.copyright}>© 2023-26 Powered by NoCapCode Inc. Infrastructure</p>
          <div className={styles.legalLinks}>
            <a href="https://nocapcode.cloud/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a>
            <span className={styles.divider}>|</span>
            <a href="https://nocapcode.cloud/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
            <span className={styles.divider}>|</span>
            <a href="https://nocapcode.cloud/security" target="_blank" rel="noopener noreferrer">Trust & Security</a>
          </div>
        </div>

      </div>

      {/* ── RIGHT PANEL (Image) ── */}
      <div className={styles.rightPanel}>
        {/* Background handled in CSS */}
      </div>
    </div>
  );
};

export default AtlasRoleSelect;