import { useState } from 'react';
import { User, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import styles from "../CSS/HRLogin.module.css";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../../config";

const HRLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/hr/login`, {
        userid: email,
        password: password
      }, { withCredentials: true });
      console.log(response);
      toast.success("Login Successfull");
      navigate('/hr/dashboard');
    } catch (error) {
      toast.error("Login Unsuccessfull");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginContainer}>
        <div className={styles.loginRight}>
          <div className={styles.loginFormContainer}>
            <div className={styles.logo}>
              <img
                src={require("../../Adminside/Components/atlas.png")}
                alt="Atlas Workspace Logo"
              />
              <span>Aτλας</span>
            </div>

            <div className={styles.formHeader}>
              <h2>HR Access</h2>
              <p>Please enter your credentials to sign in</p>
            </div>

            <form onSubmit={handleLogin} className={styles.loginForm}>
              <div className={styles.formGroup}>
                <div className={styles.inputWrapper}>
                  <User size={18} className={styles.inputIcon} />
                  <input
                    type="text"
                    placeholder="Username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <div className={styles.inputWrapper}>
                  <Lock size={18} className={styles.inputIcon} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className={styles.signInBtn}>
                {loading ? 'Signing In...' : 'Login'}
                <ArrowRight size={18} />
              </button>

              <div className={styles.formOptions}>
                <a href="/reset-password" className={styles.forgotPassword}>Forgot Password?</a>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className={styles.footerCopyright}>
        Powered by NoCapCode
      </div>
    </div>
  );
};

export default HRLogin;
