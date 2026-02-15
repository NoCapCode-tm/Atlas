import React, { useState } from 'react';
import styles from "../CSS/Login.module.css";
import axios from "axios"
import {useNavigate} from "react-router"
import { User, Lock, ArrowRight } from "lucide-react";
import prismLogo from './logo_withoutBack.svg';

import {toast} from "react-toastify"
const Login = () => {
    const[email,setemail]=useState("")
    const[pass,setpass]=useState("")
    const navigate = useNavigate()
    const[loading,setloading]=useState(false)

    const handlelogin = async()=>{
        try {
            setloading(true)
            const response  = await axios.post("http://localhost:5000/api/v1/admin/adminlogin",{
                userid:email,
                password:pass
            },{withCredentials:true})
            console.log(response.data.message)
            toast.success("Login Successfull")
            navigate("/dashboard")
        } catch (error) {
             toast.error("Login Unsuccessfull")
        }finally{
            setloading(false)
        }
    }
  return(
    <div className={styles.loginWrapper}>
      <div className={styles.loginContainer}>
        {/* Left Side - Content */}
        <div className={styles.loginLeft}>
          <div className={styles.logoSection}>
            <img src={prismLogo} alt="Prism Logo" className={styles.loginLogo} />
          </div>
          
          <div className={styles.contentSection}>
            <h1 className={styles.mainTitle}>
              Future of Work<br />
              <span className={styles.highlight}>Is Here.</span>
            </h1>
            
            <p className={styles.description}>
              Experience a seamless, intelligent, and beautifully designed workspace portal built for modern teams.
            </p>
            
            <div className={styles.trustSection}>
              <div className={styles.trustCircles}>
                <div className={`${styles.circle} ${styles.circle1}`}></div>
                <div className={`${styles.circle} ${styles.circle2}`}></div>
                <div className={`${styles.circle} ${styles.circle3}`}></div>
                <div className={`${styles.circle} ${styles.circle4}`}></div>
              </div>
              <span className={styles.trustText}>Trusted by 10,000+ teams</span>
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

            <form  onSubmit={(e)=>
              {e.preventDefault()
              handlelogin()}} className={styles.loginForm}>
              <div className={styles.formGroup}>
                <label>USERNAME</label>
                <div className={styles.inputWrapper}>
                  <User size={20} className={styles.inputIcon} />
                  <input
                    type="text"
                    placeholder="name@company.com"
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

              <button type='submit' className={styles.signInBtn}>
                {loading ? 'Logging In...' : 'Login'}
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


export default Login;