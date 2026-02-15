import React, { useEffect, useState } from 'react'
import styles from '../CSS/navbar.module.css'
import { Menu , Bell ,LayoutDashboard, Users, FolderKanban, SquareCheckBig, Heart, ChartNoAxesColumnIncreasing, Megaphone, Wrench, KeyRound, UserCircle, Settings, LogOut, ArrowBigDown, ChevronDown } from "lucide-react";
import { useNavigate,useLocation } from 'react-router';
import axios from 'axios';
import { toast } from 'react-toastify';


function Navbar() {
  const [menuopen,setMenuopen]=useState(false);
  const [empmenu,setempmenuopen]=useState(false);
  const[toggle,settoggle]=useState("dashboard")
  const[dropdown,setdropdown]=useState(false)
  const navigate = useNavigate()
  const location = useLocation();
  const[user,setuser]=useState("")
  const[info,setinfo]=useState(false)

const getActive = (path) => {
  return location.pathname === path;
};

useEffect(()=>{
  (async()=>{
  try {
    const response = await axios.get("https://atlasbackend-px53.onrender.com/api/v1/admin/getuser",{withCredentials:true})
    console.log(response.data.message)
    setuser(response.data.message)
  } catch (error) {
    toast.error("Connection Timed Out")
    navigate("/")
  }
})()
},[])

const handlelogout = async()=>{
  try {
    const response = await axios.get("https://atlasbackend-px53.onrender.com/api/v1/admin/logout",{withCredentials:true})
    toast.success("Logout Successfull")
    navigate("/login")
  } catch (error) {
     toast.error("Logout Unsuccessfull")
  }
}
 const handlesidebar = () =>{
  if(user?.designation?.name === "Administrator"){
    setMenuopen(!menuopen)
  }
  else if(user?.designation?.name === "Employee" || user?.designation?.name === "Intern"){
    setempmenuopen(!empmenu)
  }
 }

  return (
    <>
    <div className={styles.container}>
      <div className={styles.searchBar}> 
        <div className={styles.logo} onClick={handlesidebar}>
            <Menu />
        </div>
        {/* <Search /> */}
        {/* <input
          type="text"
          placeholder={` Search employees,projects,tasks...`}
          className={styles.searchInput}
        /> */}
      </div>
      <div className={styles.right}>
        <div className={styles.notification}>
            <Bell />
        </div>
        <div className={styles.profile} onClick={()=>{setinfo(!info)}}>
            <div className={styles.profilepic}>{user.profilepicture ?(<img src ={user?.profilepicture} height="100%" width="100%" alt="/"/>):"B"}</div>
            <span >{user?.name?.split(" ")[0]}</span>
            <ChevronDown size={12} />
            {info && (
              <div className={styles.info}>
                <div className={styles.options}><UserCircle color="rgba(104, 80, 190, 1)"/>Profile</div>
                 <div className={styles.options}><Settings color="rgba(104, 80, 190, 1)"/>Settings</div>
                  <div className={styles.options} onClick={handlelogout}><LogOut color="rgba(104, 80, 190, 1)"/>Log Out</div>
              </div>
            )}
        </div>
      </div>
    </div>
     {menuopen && (
  <div
    className={styles.sidebarOverlay}
    onClick={() => setMenuopen(false)}
  >
    <div className={styles.mobilemenu} onClick={(e) => e.stopPropagation()}>
        <div className={styles.logomenu}>
          <Menu onClick={()=>{setMenuopen(false)}}/>
          <div className={styles.logohumanity}>
            <img src ="/companylogo.png" alt="/" height="100%" width="100%" />
          </div>
        </div>
        <div className={styles.menuScroll}>
        <div  className={
    getActive("/dashboard")
      ? styles.dashboardmenucolor
      : styles.dashboardmenu
  } onClick={()=>{
          navigate("/dashboard")
          settoggle("dashboard")}}>
          <LayoutDashboard/>
          Dashboard
        </div>
        <div  className={
    getActive("/employees")
      ? styles.dashboardmenucolor
      : styles.dashboardmenu
  } onClick={()=>{
          navigate("/employees")
          settoggle("employees")}}>
         <Users/>
         Employees
        </div>
        <div  className={
    getActive("/projects")
      ? styles.dashboardmenucolor
      : styles.dashboardmenu
  } onClick={()=>{
          navigate("/projects")
          settoggle("projects")}}>
          <FolderKanban/>
          Projects
        </div>
        <div  className={
    getActive("/tasks")
      ? styles.dashboardmenucolor
      : styles.dashboardmenu
  } onClick={()=>{
          navigate("/tasks")
          settoggle("tasks")}}>
          <SquareCheckBig/>
          Tasks

        </div>
        <div  className={
    getActive("/hr")
      ? styles.dashboardmenucolor
      : styles.dashboardmenu
  } onClick={()=>{
          navigate("/hr")
          settoggle("hr")}}>
         <Heart/>
         HR Hub
        </div>
       {/* REPORTS MAIN MENU */}
<div
   className={
    getActive("/reports")
      ? styles.dashboardmenucolor
      : styles.dashboardmenu
  }
  onClick={() => {
    settoggle("reports");
    setdropdown(!dropdown);
  }}
>
  <LayoutDashboard />
  Reports ▾
</div>

{/* DROPDOWN ITEMS */}
<div
  className={`${styles.reportsDropdown} ${dropdown ? styles.showDropdown : ""}`}
>
  <div className={styles.reportItem} onClick={() => navigate("/reports1")}>
    Productivity Reports
  </div>
  <div className={styles.reportItem} onClick={() => navigate("/heatmap")}>
    Performance Score Heatmap
  </div>
  <div className={styles.reportItem} onClick={() => navigate("/daily-report-submission")}>
    Daily Report Submission Chart
  </div>
  <div className={styles.reportItem} onClick={() => navigate("/task-analytics")}>
    Task Delivery Analytics
  </div>
  <div className={styles.reportItem} onClick={() => navigate("/redreport")}>
    Red Flags Report
  </div>
  <div className={styles.reportItem} onClick={() => navigate("/project-success")}>
    Project Success Reports
  </div>
  <div className={styles.reportItem} onClick={() => navigate("/data-export")}>
    Data Export
  </div>
</div>

        <div  className={
    getActive("/performance")
      ? styles.dashboardmenucolor
      : styles.dashboardmenu
  } onClick={()=>{
          navigate("/performance")
          settoggle("performance")}}>
          <ChartNoAxesColumnIncreasing/>
          Performance
        </div>
        <div  className={
    getActive("/announcement")
      ? styles.dashboardmenucolor
      : styles.dashboardmenu
  } onClick={()=>{
          navigate("/announcement")
          settoggle("announcement")}}>
         <Megaphone/>
         Announcements
        </div>
        <div  className={
    getActive("/support")
      ? styles.dashboardmenucolor
      : styles.dashboardmenu
  } onClick={()=>{
          navigate("/support")
          settoggle("support")}}>
         <Wrench/>
         Support/Tickets
        </div>
        <div  className={
    getActive("/role")
      ? styles.dashboardmenucolor
      : styles.dashboardmenu
  } onClick={()=>{
          navigate("/role")
          settoggle("role")}}>
         <KeyRound/>
         Role and Permissions
        </div>
        </div>
    </div>
    </div>
        
        )}

        {empmenu && (
  <div
    className={styles.sidebarOverlay}
    onClick={() => setempmenuopen(false)}
  >
    <div className={styles.mobilemenu} onClick={(e) => e.stopPropagation()}>
        <div className={styles.logomenu}>
          <Menu onClick={()=>{setempmenuopen(false)}}/>
          <div className={styles.logohumanity}>
            <img src ="./companylogo.png" alt="/" height="100%" width="100%" />
          </div>
        </div>
        <div className={styles.menuScroll}>
        <div  className={
    getActive("/employee/dashboard")
      ? styles.dashboardmenucolor
      : styles.dashboardmenu
  } onClick={()=>{
          navigate("/employee/dashboard")
          settoggle("dashboard")}}>
          <LayoutDashboard/>
          Dashboard
        </div>
        <div  className={
    getActive("/employees/tasks")
      ? styles.dashboardmenucolor
      : styles.dashboardmenu
  } onClick={()=>{
          navigate("/employees/tasks")
          settoggle("tasks")}}>
         <Users/>
         My Task
        </div>
        <div  className={
    getActive("/employee/reports")
      ? styles.dashboardmenucolor
      : styles.dashboardmenu
  } onClick={()=>{
          navigate("/employee/reports")
          settoggle("reports")}}>
          <FolderKanban/>
          Daily Reports
        </div>
        <div  className={
    getActive("/employee/projects")
      ? styles.dashboardmenucolor
      : styles.dashboardmenu
  } onClick={()=>{
          navigate("/employee/projects")
          settoggle("projects")}}>
          <SquareCheckBig/>
          Project Workspace

        </div>
        <div  className={
    getActive("/employee/Calendar")
      ? styles.dashboardmenucolor
      : styles.dashboardmenu
  } onClick={()=>{
          navigate("/employee/Calendar")
          settoggle("calendar")}}>
         <Heart/>
         Calendar
        </div>

        <div  className={
    getActive("/employee/announcement")
      ? styles.dashboardmenucolor
      : styles.dashboardmenu
  } onClick={()=>{
          navigate("/employee/announcement")
          settoggle("performance")}}>
          <ChartNoAxesColumnIncreasing/>
          Announcements
        </div>
        <div  className={
    getActive("/announcement")
      ? styles.dashboardmenucolor
      : styles.dashboardmenu
  } onClick={()=>{
          navigate("/employee/request")
          settoggle("request")}}>
         <Megaphone/>
         My Requests
        </div>
        <div  className={
    getActive("/employee/support")
      ? styles.dashboardmenucolor
      : styles.dashboardmenu
  } onClick={()=>{
          navigate("/employee/support")
          settoggle("support")}}>
         <Wrench/>
         Support/Tickets
        </div>
        </div>
    </div>
    </div>
        
        )}
</>
  )
}

export default Navbar
