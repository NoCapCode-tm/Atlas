import styles from "../CSS/Entrypage.module.css";
import { User, Briefcase, Users, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"

const AtlasRoleSelect = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <img
            src={require("./atlas.png")}
            alt="Atlas Workspace Logo"
          />
          <span>Aτλας</span>
        </div>

        <div className={styles.content}>
          {/* Left Section */}
          <div className={styles.leftSection}>
            <h1 className={styles.heading}>Welcome to Atlas Workspace</h1>

            <p className={styles.subText}>
              Select your role to securely access the unified corporate workspace.
            </p>
            <ul className={styles.list}>
              <li>✓ Secure authentication</li>
              <li>✓ Role-based permissions</li>
              <li>✓ Real-time collaboration</li>
            </ul>

            <button className={styles.portalBtn}>
              • SECURE ENTERPRISE PORTAL
            </button>
          </div>

          {/* Role Cards Section */}
          <div className={styles.cardGrid}>
            {/* Employee */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={styles.roleCard}
              onClick={() => navigate("/employeelogin")}
            >
              <div className={styles.iconBox}>
                <User size={24} />
              </div>
              <h2>Employee</h2>
              <p>Access your dashboard and manage requests.</p>
            </motion.div>

            {/* Manager */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={styles.roleCard}
              onClick={() => navigate("/managerlogin")}
            >
              <div className={styles.iconBox} >
                <Briefcase size={24} />
              </div>
              <h2>Manager</h2>
              <p>Review performance and manage approvals.</p>
            </motion.div>

            {/* HR */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={styles.roleCard}
              onClick={() => navigate("/hrlogin")}
            >
              <div className={styles.iconBox} >
                <Users size={24} />
              </div>
              <h2>Human Resource</h2>
              <p>Manage records and recruitment.</p>
            </motion.div>

            {/* Admin */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={styles.roleCard}
              onClick={() => navigate("/login")}
            >
              <div className={styles.iconBox} >
                <ShieldCheck size={24} />
              </div>
              <h2>Administrator</h2>
              <p>Manage system settings and permissions.</p>
            </motion.div>
          </div>
        </div>

        <footer className={styles.footer}>
          © 2025-26 NoCapCode. All rights reserved. Secure connection established.
        </footer>
      </div>
    </div>
  );
};

export default AtlasRoleSelect;
