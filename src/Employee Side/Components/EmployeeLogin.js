import React, { useState } from 'react';
import styles from "../CSS/EmployeeLogin.module.css";
import axios from "axios"
import {useNavigate} from "react-router"
import {toast} from "react-toastify"

import { User, Lock, ArrowRight } from "lucide-react";
import empLogin_svg from "./empLogin_svg.svg";

const EmployeeLogin = () => {
    const[email,setemail]=useState("")
    const[pass,setpass]=useState("")
    const navigate = useNavigate()
    const[loading,setloading]=useState(false)

    const handlelogin = async()=>{
        try {
            setloading(true)
            const response  = await axios.post("https://prismbackend-27d920759150.herokuapp.com/api/v1/employee/login",{
                userid:email,
                password:pass
            },{withCredentials:true})
            console.log(response)
            toast.success("Login Successfull")
            navigate("/employee/dashboard")
        } catch (error) {
             toast.error("Login Unsuccessfull")
        }finally{
            setloading(false)
        }
    }
    return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginContainer}>
        {/* Left Side - Content */}
        <div className={styles.loginLeft}>
          
          <div className={styles.contentSection}>
            <h1 className={styles.mainTitle}>
              A smarter way<br />
              <span className={styles.highlight}>to work together.</span>
            </h1>
            
            <p className={styles.description}>
              A unified employee portal to manage tasks, collaborate seamlessly, and stay aligned with organizational goals
            </p>
            <div className={styles.logoSection}>
              <img src={empLogin_svg} alt="Prism Logo" className={styles.loginLogo} />
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

            <form onSubmit={(e) => {e.preventDefault();
                                    handlelogin();
                                    }} 
                className={styles.loginForm}>
              <div className={styles.formGroup}>
                <label>USERNAME</label>
                <div className={styles.inputWrapper}>
                  <User size={20} className={styles.inputIcon} />
                  <input
                    type="text"
                    placeholder="username"
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
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
                    value={pass}
                    onChange={(e) => setpass(e.target.value)}
                    required
                  />
                  
                </div>
              </div>

              <div className={styles.formOptions}>
                <a href="/reset-password" className={styles.forgotPassword}>Forgot password?</a>
              </div>

              <button type="submit" className={styles.signInBtn}>
                {loading ? 'Logging In...' : 'Sign In'}
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


export default EmployeeLogin;