import React, { useState } from 'react';
import styles from "../CSS/Login.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Hexagon } from "lucide-react";
import { toast } from "react-toastify";
import { API_URL } from "../../config";

const Login = () => {
  const [email, setemail] = useState("");
  const [pass, setpass] = useState("");
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);

  const handlelogin = async (e) => {
    e.preventDefault();
    try {
      setloading(true);
      const response = await axios.post(`${API_URL}admin/adminlogin`, {
        userid: email,
        password: pass
      }, { withCredentials: true });
      console.log(response.data.message);
      toast.success("Login Successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Login Unsuccessful");
    } finally {
      setloading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* ── LEFT PANEL (Form) ── */}
      <div className={styles.leftPanel}>
        
        <div className={styles.logo}>
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
          <span>Aτλας</span>
        </div>

        <div className={styles.formContainer}>
          <h1 className={styles.heading}>Administrator Sign In</h1>

          <form onSubmit={handlelogin} className={styles.form}>
            
            <div className={styles.inputGroup}>
              <label>User Name</label>
              <div className={`${styles.inputWrapper} ${email ? styles.activeInput : ''}`}>
                <Mail size={18} className={styles.icon} color={email ? "#4F46E5" : "#6b7280"} />
                <input
                  type="text"
                  placeholder="Enter User Name"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Password</label>
              <div className={styles.inputWrapper}>
                <Lock size={18} className={styles.icon} color="#6b7280" />
                <input
                  type="password"
                  placeholder="Enter Password"
                  value={pass}
                  onChange={(e) => setpass(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <div className={styles.forgotPassword}>
              <span onClick={() => navigate('/reset-password')}>FORGOT PASSWORD?</span>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
            
          </form>
        </div>

        {/* Updated Footer with Legal Links */}
        <div className={styles.footer}>
          <a href="https://nocapcode.cloud/terms/" target="_blank" rel="noopener noreferrer">Terms of Service</a>
          <span className={styles.divider}>|</span>
          <a href="https://nocapcode.cloud/privacy/" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
          <span className={styles.divider}>|</span>
          <a href="https://nocapcode.cloud/security/" target="_blank" rel="noopener noreferrer">Trust & Security</a>
        </div>
        
      </div>

      {/* ── RIGHT PANEL (Image Only) ── */}
      <div className={styles.rightPanel}>
        {/* Intentionally left blank as requested */}
      </div>
    </div>
  );
};

export default Login;