import React, { useEffect, useState } from "react";
import styles from "../CSS/EmployeeAnnouncementpage.module.css";
import { Megaphone, Check } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useMemo } from "react";

export default function EmployeeAnnouncementpage() {
 const[announcements,setAnnouncement]=useState(null)
 const [pageLoading, setPageLoading] = useState(true);
 const[user,setUser] = useState("")
 const[acknowledge,setAcknowledge]=useState(false)
 const [activeFilter, setActiveFilter] = useState("all");


 useEffect(() => {
  if (
    user &&
    announcements
  ) {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 600); 

    return () => clearTimeout(timer);
  }
}, [user,announcements]);

//all get apis togetherfor smooth loading
useEffect(() => {
  let mounted = true;

  const loadDashboard = async () => {
    setPageLoading(true);
    const startTime = Date.now();

    try {
      const [
        userRes,
        announceres
      ] = await Promise.all([
        axios.get("https://prismbackend-27d920759150.herokuapp.com/api/v1/admin/getuser", { withCredentials: true }),
        axios.get("https://prismbackend-27d920759150.herokuapp.com/api/v1/admin/getannouncements")
      ]);

      if (!mounted) return;

      setUser(userRes.data.message);

      const userId = userRes.data.message._id;
      setAnnouncement(announceres.data.message?.filter(a =>
        Array.isArray(a.channels) &&
        Array.isArray(a?.audience?.includeUsers) &&
        a.audience.includeUsers.includes(userId)
      ));

    } catch (err) {
      toast.error("Failed to load dashboard");
    } finally {
      const elapsed = Date.now() - startTime;
      const delay = Math.max(800 - elapsed, 0);

      setTimeout(() => {
        if (mounted) setPageLoading(false);
      }, delay);
    }
  };

  loadDashboard();

  return () => {
    mounted = false;
  };
}, []);

const handleacknowledge = async(id)=>{
  try {
    const response = await axios.post("https://prismbackend-27d920759150.herokuapp.com/api/v1/employee/acknowledged",{
      user : user._id,
      id:id
    },{withCredentials:true})
    console.log(response.data.message)
    toast.success("Announcement acknowleged successfully")
    setAcknowledge(true)
    window.location.reload()
  } catch (error) {
    toast.error("Announcement cannot be acknowledged")
  }
}



const unreadAnnouncements = useMemo(() => {
  if (!user?._id || !announcements) return [];

  return announcements.filter(a => {
    // 1. user included hona chahiye
    if (
      !Array.isArray(a?.audience?.includeUsers) ||
      !a.audience.includeUsers.includes(user._id)
    ) {
      return false;
    }

    // 2. acknowledged entry dhundo
    const ack = a.acknowledged?.find(
      x => String(x.userid) === String(user._id)
    );

    // unread = no entry OR status false
    return !ack || ack.status === false;
  });
}, [announcements, user?._id]);

const filteredAnnouncements = useMemo(() => {
  if (!announcements) return [];

  switch (activeFilter) {
    case "unread":
      return unreadAnnouncements;

    case "dashboard":
      return announcements.filter(a =>
        a.channels?.includes("Dashboard Banner")
      );

    case "email":
      return announcements.filter(a =>
        a.channels?.includes("Email Notification")
      );

    default:
      return announcements;
  }
}, [announcements, unreadAnnouncements, activeFilter]);






  return (
    <div className={styles.page}>
      {/* HEADER */}
      <div className={styles.headerfilters}>
      <div className={styles.header}>
        <h1>Announcement</h1>
         <div className={styles.unreadBadge}>
          <span>{unreadAnnouncements.length} unread</span>
        </div>
      </div>
     <div className={styles.filters}>
  <button
    className={`${styles.filterBtn} ${activeFilter === "all" ? styles.active : ""}`}
    onClick={() => setActiveFilter("all")}
  >
    All Announcements
  </button>

  <button
    className={`${styles.filterBtn} ${activeFilter === "dashboard" ? styles.active : ""}`}
    onClick={() => setActiveFilter("dashboard")}
  >
    Dashboard Banner
  </button>

  <button
    className={`${styles.filterBtn} ${activeFilter === "email" ? styles.active : ""}`}
    onClick={() => setActiveFilter("email")}
  >
    Email Notification
  </button>

  <button
    className={`${styles.filterBtn} ${activeFilter === "unread" ? styles.active : ""}`}
    onClick={() => setActiveFilter("unread")}
  >
    Unread Only
  </button>
</div>


      </div>

      {/* ANNOUNCEMENT 1 */}
      {filteredAnnouncements.map((a, index) => {
        return(
           <div className={styles.card}>
        <div className={styles.iconWrap}>
          <Megaphone size={20} />
        </div>

        <div className={styles.content}>
          <div className={styles.topRow}>
            <h3>{a?.title}</h3>
            <span className={styles.important}>{a?.priority}</span>
            <span className={styles.date}>{new Date(a?.createdon).toLocaleDateString("en-IN",{
              month:"long",
              day:"2-digit",
              year:"numeric",

            })}</span>
          </div>

          <div className={styles.meta}>
            <span className={styles.orgTag}>{a?.audience?.name}</span>
            <span className={styles.by}>by {a?.scheduledby}</span>
          </div>

          <p className={styles.message}>{a?.details}</p>

          <div className={styles.actions}>
            <button className={styles.primaryBtn} onClick={()=>handleacknowledge(a._id)} disabled={a.acknowledged?.some(
  x => String(x.userid) === String(user._id) && x.status === true
)} >
              <Check size={16} /> Acknowledge
            </button>
            {/* <button className={styles.linkBtn}>Mark as read</button> */}
          </div>
        </div>
      </div>

        )
      })}
    </div>
  );
}
