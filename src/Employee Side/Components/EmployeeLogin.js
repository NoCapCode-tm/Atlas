import { useState } from 'react';
import styles from "../CSS/EmployeeLogin.module.css";
import axios from "axios"
import { useNavigate } from "react-router"
import { toast } from "react-toastify"
import { User, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

const EmployeeLogin = () => {
  const [email, setemail] = useState("")
  const [pass, setpass] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const [loading, setloading] = useState(false)

  const handlelogin = async () => {
    try {
      setloading(true)
      const response = await axios.post(`${API_URL}/employee/login`, {
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
        {/* Centered Login Card */}
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
              <h2>Employee Access</h2>
              <p>Please enter your credentials to sign in</p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault()
              handlelogin()
            }} className={styles.loginForm}>
              <div className={styles.formGroup}>
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

              <button type='submit' className={styles.signInBtn}>
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


export default EmployeeLogin;