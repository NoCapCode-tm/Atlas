import React from "react";
import {
  User,
  Briefcase,
  Users,
  Shield
} from "lucide-react";
import styles from '../CSS/Entrypage.module.css';
import { useNavigate } from "react-router-dom";
import prismLogo from './logo_withoutBack.svg';

const Entrypage = () => {
    const navigate = useNavigate();
  return (
    <div className={styles.portalWrapper}>
      <div className={styles.secureBadge}>
        <div className={styles.badgeDot}></div>
        SECURE ENTERPRISE PORTAL
      </div>
      
      <div className={styles.welcomeHeader}>
        <h1>Welcome to <img src={prismLogo} alt="Prism" className={styles.prismLogo} /><span>One Humanity Portal</span></h1>
        <p className={styles.subtitle}>
          Select your role to securely access the unified corporate workspace
        </p>
      </div>

      <div className={styles.portalGrid}>
        <div className={styles.portalCard} onClick={() => navigate('/login')}>
          <div className={`${styles.portalIcon} ${styles.employee}`}>
            <Shield size={24} />
          </div>
          <h3>System Admin</h3>
          <p>Configure system settings, user permissions, and security protocols.</p>
        </div>

        <div className={styles.portalCard} onClick={()=>navigate('/managerlogin')}>
          <div className={`${styles.portalIcon} ${styles.manager}`}>
            <Briefcase size={24} />
          </div>
          <h3>Manager</h3>
          <p>Review team performance, approve requests, and manage projects.</p>
        </div>

        <div className={styles.portalCard} onClick={()=> navigate('/hrlogin')}>
          <div className={`${styles.portalIcon} ${styles.hrAdmin}`}>
            <Users size={24} />
          </div>
          <h3>HR Admin</h3>
          <p>Manage personnel records, recruitment, and organizational policy.</p>
        </div>

        <div className={styles.portalCard} onClick={() => navigate('/employeelogin')}>
          <div className={`${styles.portalIcon} ${styles.systemAdmin}`}>
            <User size={24} />
          </div>
          <h3>Employee</h3>
          <p>Access your dashboard, submit requests, and view company updates.</p>
        </div>
      </div>

      <div className={styles.footerText}>
        © 2025 Humanity Founders. All rights reserved. Secure connection established.
      </div>
    </div>
  );
};

export default Entrypage;