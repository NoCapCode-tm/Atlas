import styles from "../CSS/Entrypage.module.css";
import { User, Briefcase, Users, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import useWindowWidth from "..//../useWindowWidth";

const AtlasRoleSelect = () => {
  const navigate = useNavigate();
  const width = useWindowWidth();
  const isTab = width >= 480 && width < 1000;
  const isMobile = width < 480;

  const roles = [
    { label: "Employee",        icon: <User size={26} />,        path: "/employeelogin" },
    { label: "Manager",         icon: <Briefcase size={26} />,   path: "/managerlogin" },
    { label: "Human Resource",  icon: <Users size={26} />,       path: "/hrlogin" },
    { label: "Administrator",   icon: <ShieldCheck size={26} />, path: "/login" },
  ];

  /* ── Mobile layout — single column stacked cards ── */
  if (isMobile) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.mobileContainer}>

          <div className={styles.tabBrand}>
            <img src={require("./atlas.png")} alt="Atlas logo" className={styles.tabLogoImg} />
            <h1 className={styles.tabTitle}>Aτλας</h1>
            <p className={styles.tabSubtitle}>Access your workspace</p>
            <div className={styles.tabDivider} />
            <span className={styles.tabRoleLabel}>Select your role</span>
          </div>

          <div className={styles.mobileCardList}>
            {roles.map(({ label, icon, path }) => (
              <motion.button
                key={label}
                whileTap={{ scale: 0.97 }}
                className={styles.mobileCard}
                onClick={() => navigate(path)}
              >
                <div className={styles.mobileIconBox}>{icon}</div>
                <span className={styles.mobileCardLabel}>{label}</span>
              </motion.button>
            ))}
          </div>

          <footer className={styles.tabFooter}>Powered by NoCapCode</footer>
        </div>
      </div>
    );
  }

  /* ── Tablet layout — 2×2 grid ── */
  if (isTab) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.tabContainer}>

          <div className={styles.tabBrand}>
            <img src={require("./atlas.png")} alt="Atlas logo" className={styles.tabLogoImg} />
            <h1 className={styles.tabTitle}>Aτλας</h1>
            <p className={styles.tabSubtitle}>Access your workspace</p>
            <div className={styles.tabDivider} />
            <span className={styles.tabRoleLabel}>Select your role</span>
          </div>

          <div className={styles.tabCardGrid}>
            {roles.map(({ label, icon, path }) => (
              <motion.button
                key={label}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={styles.tabCard}
                onClick={() => navigate(path)}
              >
                <div className={styles.tabIconBox}>{icon}</div>
                <span className={styles.tabCardLabel}>{label}</span>
              </motion.button>
            ))}
          </div>

          <footer className={styles.tabFooter}>© 2025-26 Powered by NoCapCode Infrastructure.</footer>
        </div>
      </div>
    );
  }

  /* ── Desktop layout (unchanged) ── */
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>

        <div className={styles.content}>
          <div className={styles.leftSection}>
            <h1 className={styles.heading}>Welcome to <span>Aτλας</span> Workspace</h1>
            <p className={styles.subText}>
              Select your functional portal to access the workspace <br />environments designed for your role.
            </p>
            <ul className={styles.list}>
              <li>✓ Secure authentication</li>
              <li>✓ Role-based permissions</li>
              <li>✓ Real-time collaboration</li>
            </ul>
          </div>

          <div className={styles.cardGrid}>
            <motion.div whileHover={{ scale: 1.05 }} className={styles.roleCard} onClick={() => navigate("/employeelogin")}>
              <div className={styles.iconBox}><User size={40} /></div>
              <h2>Employee</h2>
              <p>Access your personal dashboard, pay stubs, benefits, and training modules.</p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className={styles.roleCard} onClick={() => navigate("/managerlogin")}>
              <div className={styles.iconBox}><Briefcase size={40} /></div>
              <h2>Manager</h2>
              <p>Review team performance metrics, approve requests, and manage talent pipelines.</p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className={styles.roleCard} onClick={() => navigate("/hrlogin")}>
              <div className={styles.iconBox}><Users size={40} /></div>
              <h2>Human Resource</h2>
              <p>Administer company-wide policies, recruitment cycles, and employee relations.</p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className={styles.roleCard} onClick={() => navigate("/login")}>
              <div className={styles.iconBox}><ShieldCheck size={40} /></div>
              <h2>Administrator</h2>
              <p>Full system overrides, configuration management, and security auditing logs.</p>
            </motion.div>
          </div>
        </div>

        <div className={styles.logo}>
          <img src={require("./atlas.png")} alt="Atlas Workspace Logo" />
        </div>

        <footer className={styles.footer}>
          © 2025-26 Powered by NoCapCode Infrastructure.
        </footer>
      </div>
    </div>
  );
};

export default AtlasRoleSelect;
