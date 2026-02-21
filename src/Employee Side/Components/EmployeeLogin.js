import { useState } from 'react';
import styles from "../CSS/EmployeeLogin.module.css";
import axios from "axios"
import { useNavigate } from "react-router"
import { toast } from "react-toastify"
import { User, Lock, ArrowRight, Eye, EyeOff, UserCircle, Settings } from "lucide-react";
import { FaUserTie } from "react-icons/fa";

const EmployeeLogin = () => {
  const [email, setemail] = useState("")
  const [pass, setpass] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const [loading, setloading] = useState(false)

  const handlelogin = async () => {
    try {
      setloading(true)
      const response = await axios.post("https://atlasbackend-px53.onrender.com/api/v1/employee/login", {
        userid: email,
        password: pass
      }, { withCredentials: true })
      console.log(response)
      toast.success("Login Successfull")
      navigate("/employee/dashboard")
    } catch (error) {
      toast.error("Login Unsuccessfull")
    } finally {
      setloading(false)
    }
  }
  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginContainer}>
        {/* Left Side - Content */}
        <div className={styles.loginLeft}>
          <div className={styles.iconWrapper}>
            <UserCircle size={80} strokeWidth={1.5} />
          </div>

          <div className={styles.contentSection}>
            <div className={styles.userIcon}>
              <FaUserTie size={80} color="#8E96B2" />
              <h1 className={styles.mainTitle}>
                Work Smarter<br />
                <span className={styles.highlight}>Together.</span>
              </h1>
            </div>

            <div >
              <p className={styles.description}>
              Empowering teams to work smarter, together.
              </p>
            </div>

          </div>


          <div className={styles.footerCopyright}>
            © 2025-26 NoCapCode. All rights reserved. Secure connection established.
          </div>
        </div>

        {/* Right Side - Login Form */}
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
              <h2>Welcome Back</h2>
              <p>Please enter your details to sign in.</p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault()
              handlelogin()
            }} className={styles.loginForm}>
              <div className={styles.formGroup}>
                <label>USERNAME</label>
                <div className={styles.inputWrapper}>
                  <User size={18} className={styles.inputIcon} />
                  <input
                    type="text"
                    placeholder="Username"
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>PASSWORD</label>
                <div className={styles.inputWrapper}>
                  <Lock size={18} className={styles.inputIcon} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={pass}
                    onChange={(e) => setpass(e.target.value)}
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

              <div className={styles.formOptions}>
                <a href="/reset-password" className={styles.forgotPassword}>Forgot password?</a>
              </div>

              <button type='submit' className={styles.signInBtn}>
                {loading ? 'Signing In...' : 'Sign In'}
                <ArrowRight size={18} />
              </button>

              <div className={styles.formFooter}>
                <span>Don't have an account? </span>
                <a href="/request-access" className={styles.requestAccess}>Request Access</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};


export default EmployeeLogin;