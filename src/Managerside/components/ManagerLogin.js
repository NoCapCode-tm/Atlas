import React, { useState } from 'react';
import { User, Lock, ArrowRight } from "lucide-react";
import styles from "./css/ManagerLogin.module.css";
import managerLogin_svg from "./managerlogin_svg.svg";
import { useNavigate } from 'react-router-dom';

const ManagerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Add your login logic here
    navigate('/dashboard');
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginContainer}>
        {/* Left Side - Content */}
        <div className={styles.loginLeft}>
          
          <div className={styles.contentSection}>
            <h1 className={styles.mainTitle}>
              Track Progress<br />
              <span className={styles.highlight}>Seamlessly.</span>
            </h1>
            
            <p className={styles.description}>
                A purpose-built portal to manage workflows, track performance, and lead with insight.
            </p>
            <div className={styles.logoSection}>
              <img src={managerLogin_svg} alt="Prism Logo" className={styles.loginLogo} />
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className={styles.loginRight}>
          <div className={styles.loginFormContainer}>
            <div className={styles.formHeader}>
              <h2>Welcome Back</h2>
              <p>Please enter your details to sign in.</p>
            </div>

            <form onSubmit={handleLogin} className={styles.loginForm}>
              <div className={styles.formGroup}>
                <label>USERNAME</label>
                <div className={styles.inputWrapper}>
                  <User size={20} className={styles.inputIcon} />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>PASSWORD</label>
                <div className={styles.inputWrapper}>
                  <Lock size={20} className={styles.inputIcon} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  
                </div>
              </div>

              <div className={styles.formOptions}>
                <a href="/reset-password" className={styles.forgotPassword}>Forgot password?</a>
              </div>

              <button type="submit" className={styles.signInBtn}>
                Sign In
                <ArrowRight size={20} />
              </button>

              <div className={styles.formFooter}>
                <span>Don't have an account? </span>
                <a href="/request-access" className={styles.requestAccess}>Request Access</a>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className={styles.footerCopyright}>
        © 2025 Humanity Founders. All rights reserved.
      </div>
    </div>
  );
};

export default ManagerLogin;