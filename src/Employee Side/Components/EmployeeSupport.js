import React, { useEffect, useState } from "react";
import styles from "../CSS/EmployeeSupport.module.css";
import {
  Plus,
  Filter,
  Clock,
  MessageSquare,
  CheckCircle,
  Pencil,
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

export default function EmployeeSupport() {
    const[tickets,setTickets]=useState([])
    const[alluser,setallusers]=useState([])
        const[user,setUser]=useState([])
    const [form, setForm] = useState({
    title: "",
    category: "",
    priority: "",
    description: "",
  });
  const[comment,setComment]=useState("")
  const [loading, setLoading] = useState(false);
  const [createTicketOpen, setCreateTicketOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const[details,setdetails]=useState(false)
      const[ticket,setticket]=useState({})
      const[activestatus,setactivestatus]=useState("")
      const[comments1,setComments1]=useState([])

  useEffect(() => {
  if (
    alluser.length>=0 &&
    user &&
    tickets.length>=0
  ) {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 600); 

    return () => clearTimeout(timer);
  }
}, [user, tickets ,alluser]);

//all get apis togetherfor smooth loading
useEffect(() => {
  let mounted = true;

  const loadDashboard = async () => {
    setPageLoading(true);
    const startTime = Date.now();

    try {
      const [
        userRes,
        ticketres,
        usersres,
      ] = await Promise.all([
        axios.get("https://prismbackend-27d920759150.herokuapp.com/api/v1/admin/getuser", { withCredentials: true }),
        axios.get("https://prismbackend-27d920759150.herokuapp.com/api/v1/admin/gettickets"),
        axios.get("https://prismbackend-27d920759150.herokuapp.com/api/v1/admin/getalluser")
      ]);

      if (!mounted) return;
     const currentUser = userRes.data.message;
      setUser(currentUser);

      const myTickets = ticketres.data.data.filter(
        t => String(t.raisedby) === String(currentUser._id)
      );

      setTickets(myTickets);

      setallusers(usersres.data.message)

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


  const handleCreate = async () => {
  if (!form.title || !form.category || !form.priority || !form.description) {
    toast.error("Please fill all fields");
    return;
  }

  try {
    setLoading(true);

    await axios.post(
      `https://prismbackend-27d920759150.herokuapp.com/api/v1/admin/createticket`,
      {
        title: form.title,
        category: form.category,
        priority: form.priority,
        details: form.description,
      },
      { withCredentials: true }
    );

    toast.success("Ticket Created Successfully");

    setCreateTicketOpen(false);
    setForm({ title: "", category: "", priority: "", description: "" }); // 🔥 AUTO REFRESH

  } catch (error) {
    toast.error("Failed to create ticket");
  } finally {
    setLoading(false);
  }
};

const handledetails = async(id) =>{
      const response = await axios.post(`https://prismbackend-27d920759150.herokuapp.com/api/v1/admin/ticketdetail`,{
            id:id
           },{withCredentials:true})
           console.log(response.data.message)
           setticket(response.data.message)
           setdetails(true)
           setactivestatus(response.data.message.status)
    }


const PageLoader = () => {
  return (
    <div className={styles.pageLoader}>
      <div className={styles.loaderCard}>
        <div className={styles.spinner}></div>
        <p>Loading your workspace…</p>
      </div>
    </div>
  );
};

if (pageLoading) {
  return <PageLoader />;
}

const sendMessage =async() =>{
        try {
            const response = await axios.post(`https://prismbackend-27d920759150.herokuapp.com/api/v1/admin/comment`,{
                comment:comment,
                id:ticket._id
            },{withCredentials:true})
            console.log(response)
            toast.success("Comment Added Successfully")
            setactivestatus("In Progress")
            
            setComments1(prev => [...prev, comment]);

            setComment("")
        } catch (error) {
            toast.error("Error in adding Comments")
        }
    }

     const handlestatus = async(status)=>{
        setactivestatus(status)
        try {
            const response = await axios.post(`https://prismbackend-27d920759150.herokuapp.com/api/v1/admin/updatestatus`,{
                id:ticket._id,
                status:status
            },{withCredentials:true})
            console.log(response)
            toast.success("Status Updated Successfully")
            window.location.reload()

        } catch (error) {
            toast.error("Status Cannot be Added Successfully")
        }
        
    }

  return (
    <>
    <div className={styles.page}>
      {/* HEADER */}
        <div className={styles.top}>
        <div>
          <h1 className={styles.title}>Support Ticket</h1>

           {!details && (<div className={styles.tabs}>
            <Filter size={16} />
            <button className={`${styles.tab} ${styles.active}`}>Open</button>
            <button className={styles.tab}>In Progress</button>
            <button className={styles.tab}>Resolved</button>
          </div>)}
        </div>

        <button className={styles.createBtn} onClick={()=>{setCreateTicketOpen(true)}}>
          <Plus size={16}  />
          Create Ticket
        </button>
      </div>

      {/* TICKETS */}
      <div className={styles.list}>
        {/* CARD 1 */}
        {!details && tickets.map((t,index)=>(
              <div className={styles.card} key={index} onClick={()=>handledetails(t._id)}>
          <div>
            <div className={styles.cardTop}>
              <h3>{t?.title}</h3>
              <span className={`${styles.priority} ${styles.high}`}>{t?.priority}</span>
              <span className={`${styles.status} ${styles.progress}`}>
                {t?.status}
              </span>
            </div>

            <p className={styles.desc}>{t?.details}</p>

            <div className={styles.meta}>
              <span>
                <MessageSquare size={14} /> 2 messages
              </span>
              <span>Created {new Date().toLocaleDateString("en-IN",{
                day:"2-digit",
                month:"long",
                year:"numeric"
              })}</span>
            </div>
          </div>

          <div className={styles.sla}>
            <Clock size={14} />
            SLA: 0h 56m
          </div>
        </div>
            )
        )}

        {details && (
             <div className={styles.detailWrapper}>

  {/* BACK BUTTON */}
  <button className={styles.backBtn} onClick={() => setdetails(false)}>
    ← Back to Tickets
  </button>

  <div className={styles.detailGrid}>
    
    {/* LEFT MAIN SECTION */}
    <div className={styles.detailLeft}>

      {/* TITLE CARD */}
      <div className={styles.detailCard}>
        <div className={styles.detailTopRow}>
          <span className={styles.detailId}>TKT-{ticket?.ticketno || "001"}</span>

          <span className={`${styles.tag} ${styles[`priority_${ticket.priority}`]}`}>
            {ticket.priority}
          </span>

          <span className={`${styles.tag} ${styles[`category_${ticket.category}`]}`}>
            {ticket.category}
          </span>
        </div>

        <div className={styles.detailTitle}>{ticket.title}</div>

        <div className={styles.detailMeta}>
          Created by <b>{alluser.find(u => u._id === ticket.raisedby)?.name || "Unknown"}</b>
          • {new Date(ticket.raisedon).toLocaleString("en-IN")}
        </div>

        <div className={styles.detailDescriptionBox}>
          {ticket.details}
        </div>

        {/* ATTACHMENTS */}
        <div className={styles.attachmentTitle}>Attachments</div>
        <div className={styles.attachmentBox}>
          {ticket.attachments?.length > 0 ? (
            ticket.attachments.map((f, i) => (
              <div key={i} className={styles.attachmentItem}>
                📎 {f}
              </div>
            ))
          ) : (
            <div className={styles.noAttachment}>No attachments</div>
          )}
        </div>

      </div>

      {/* DISCUSSION THREAD */}
      <div className={styles.detailCard}>

        <div className={styles.discussionTitle}>Discussion Thread</div>

        {ticket.comments?.map((c, i) => {
          return (
            <div key={i} className={styles.commentRow}>
              <div className={styles.commentAvatar}>👤</div>
              
              <div>
                <div className={styles.commentMeta}>
                  <b>{c?.by || "User"}</b> • {new Date(c?.date).toLocaleString("en-IN")}
                </div>

                <div className={styles.commentBubble}>{c.text?c.text:comments1}</div>
              </div>
            </div>
          );
        })}

        {/* COMMENT INPUT */}
        <div className={styles.commentInputRow}>
          <div className={styles.commentAvatarLarge}>👤</div>
          <input className={styles.commentInput} placeholder="Add a comment..." value={comment} onChange={(e)=>{setComment(e.target.value)}}/>
          <button className={styles.commentSend} onClick={sendMessage}>Send</button>
        </div>
      </div>

    </div>

    {/* RIGHT SIDE SECTION */}
    <div className={styles.detailRight}>

      {/* STATUS BOX */}
      <div className={styles.sideCard1}>
        <div className={styles.sideTitle}>Status</div>
        
        <div className={styles.statusList}>
            {activestatus === "Open" ?(
           <div className={`${styles.statusOption} ${activestatus === "Open" ? styles.activeStatus : styles.openStatus}`} onClick={()=>{handlestatus("Open")}}>
            Open
          </div>
        ):(
            activestatus === "In Progress" ? (
               <div className={`${styles.statusOption} ${activestatus === "In Progress" ? styles.activeStatus : styles.progressStatus}`} onClick={()=>{handlestatus("In Progress")}}>
            In Progress
          </div>
            ):(
                <div className={`${styles.statusOption} ${activestatus === "Resolved & Closed" ? styles.activeStatus : styles.resolvedStatus}`} onClick={()=>{handlestatus("Resolved & Closed")}}>
            Resolved
          </div>
            )
        )}
          
          
         
        </div>
      </div>

      {/* ASSIGNMENT BOX */}
      <div className={styles.sideCard}>
        <div className={styles.sideTitle}>Assignment </div>

        <div className={styles.sideSubtitle}>Assigned To</div>
        <div className={styles.sideValue}>
          {alluser.find(u => u._id === ticket.assignedto)?.name || "Not Assigned"}
        </div>

        <div className={styles.sideSubtitle}>Role</div>
        <div className={styles.sideValue}>
           {
    (() => {
      const usr = alluser.find(u => u._id === ticket.assignedto);
      if (!usr) return "Not Assigned";
      return usr?.designation?.name || "Unknown Role";
    })()
  }
        </div>
      </div>

      {/* DETAILS BOX */}
      <div className={styles.sideCard}>
        <div className={styles.sideTitle}>Details</div>

        <div className={styles.sideSubtitle}>Category</div>
        <div className={styles.sideValue}>{ticket.category}</div>

        <div className={styles.sideSubtitle}>Priority</div>
        <div className={styles.sideValue}>{ticket.priority}</div>

        <div className={styles.sideSubtitle}>Created</div>
        <div className={styles.sideValue}>
          {new Date(ticket.raisedon).toLocaleString("en-IN")}
        </div>

        <div className={styles.sideSubtitle}>Last Updated</div>
        <div className={styles.sideValue}>
          {new Date(ticket.updatedAt).toLocaleString("en-IN")}
        </div>

      </div>

    </div>

  </div>
            </div>
        )}
        
      </div>
    </div>

    {createTicketOpen && (
      <div className={styles.overlay}>
          <div className={styles.modal}>
    
            {/* HEADER */}
            <div className={styles.header}>
              <div>
                <h3>Create New Ticket</h3>
                <p>Submit a support request</p>
              </div>
              <button className={styles.closeBtn} onClick={()=>{setCreateTicketOpen(false)}}>✕</button>
            </div>
    
            {/* TITLE */}
            <label className={styles.label}>Ticket Title *</label>
            <input
              className={styles.input}
              placeholder="Brief description of your issue"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
    
            {/* CATEGORY */}
            <label className={styles.label}>Category *</label>
    <div className={styles.optionRow}>
      {[
        { name: "Access", color: "#7C3AED" },
        { name: "Payroll", color: "#10B981" },
        { name: "Hardware", color: "#F97316" },
        { name: "Software", color: "#3B82F6" },
        { name: "Bug", color: "#EF4444" },
      ].map((c) => (
        <button
          key={c.name}
          className={`${styles.optionBtn} ${
            form.category === c.name ? styles.active : ""
          }`}
          onClick={() => setForm({ ...form, category: c.name })}
        >
          <span
            className={styles.dot}
            style={{ backgroundColor: c.color }}
          />
          {c.name}
        </button>
      ))}
    </div>
    
    
            {/* PRIORITY */}
            <label className={styles.label}>Priority *</label>
            <div className={styles.optionRow}>
              {["Low", "Medium", "High"].map((p) => (
                <button
                  key={p}
                  className={`${styles.optionBtn} ${
                    form.priority === p ? styles.active : ""
                  }`}
                  onClick={() => setForm({ ...form, priority: p })}
                >
                  {p}
                </button>
              ))}
            </div>
    
            {/* DESCRIPTION */}
            <label className={styles.label}>Description *</label>
            <textarea
              className={styles.textarea}
              placeholder="Please provide detailed information about your issue..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
    
            {/* ACTIONS */}
            <div className={styles.actions}>
              <button
                className={styles.primaryBtn}
                onClick={handleCreate}
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Ticket"}
              </button>
              <button className={styles.cancelBtn} onClick={()=>setCreateTicketOpen(false)}>
                Cancel
              </button>
            </div>
    
          </div>
        </div>
    )}

    </>
  );
}
