import React, { useEffect, useState } from "react";
import styles from "../CSS/EmployeeSupport.module.css";
import { API_URL } from "../../config";
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
import PageLoader from "./PageLoader"; // Adjust the relative path if it's stored in a different folder like "../components/PageLoader"

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
  const [createRequestOpen, setCreateRequestOpen] = useState(false); // New state for request modal
  const [pageLoading, setPageLoading] = useState(true);
  const[details,setdetails]=useState(false)
      const[ticket,setticket]=useState({})
      const[activestatus,setactivestatus]=useState("")
      const[comments1,setComments1]=useState([])
      const[activeTab,setActiveTab]=useState("alltickets") // New state for tabs
      const[requests,setRequests]=useState([]) // New state for requests
      const[requestForm,setRequestForm]=useState({ // New state for request form
        type: "",
        shortDescription: "",
        detailedInfo: ""
      })
      const[ticketFilter,setTicketFilter]=useState("All") // Filter for tickets
      const[requestFilter,setRequestFilter]=useState("All") // Filter for requests

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
        axios.get(`${API_URL}/admin/getuser`, { withCredentials: true }),
        axios.get(`${API_URL}/admin/gettickets`),
        axios.get(`${API_URL}/admin/getalluser`)
      ]);
      if (!mounted) return;
     const currentUser = userRes.data.message;
      setUser(currentUser);

      const myTickets = ticketres.data.data.filter(
        t => String(t.raisedby) === String(currentUser._id)
      );

      setTickets(ticketres.data.data);

      setallusers(usersres.data.message)

      // Mock requests data - replace with actual API call
      // const mockRequests = [
      //   {
      //     _id: "1",
      //     title: "Leave Request",
      //     status: "Approved",
      //     submittedAt: new Date("2026-01-03"),
      //     details: "Annual leave request for vacation"
      //   },
      //   {
      //     _id: "2",
      //     title: "Task Extension Request",
      //     status: "In Review",
      //     submittedAt: new Date("2026-02-06"),
      //     details: "Request to extend deadline for Project Alpha"
      //   },
      //   {
      //     _id: "3",
      //     title: "Resource Access Request",
      //     status: "Pending",
      //     submittedAt: new Date("2026-02-01"),
      //     details: "Access to production database"
      //   }
      // ];
      setRequests(myTickets)

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
      `${API_URL}/admin/createticket`,
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
      const response = await axios.post(`${API_URL}/admin/ticketdetail`,{
            id:id
           },{withCredentials:true})
           console.log(response.data.message)
           setticket(response.data.message)
           setdetails(true)
           setactivestatus(response.data.message.status)
    }

// const handleCreateRequest = async () => {
//   if (!requestForm.type || !requestForm.shortDescription || !requestForm.detailedInfo) {
//     toast.error("Please fill all fields");
//     return;
//   }

//   try {
//     setLoading(true);

//     // Mock API call - replace with actual endpoint
//     await new Promise(resolve => setTimeout(resolve, 1000));

//     toast.success("Request Created Successfully");

//     setCreateRequestOpen(false);
//     setRequestForm({ type: "", shortDescription: "", detailedInfo: "" });

//     // Add to requests list
//     const newRequest = {
//       _id: Date.now().toString(),
//       title: requestForm.shortDescription,
//       status: "Pending",
//       submittedAt: new Date(),
//       details: requestForm.detailedInfo,
//       type: requestForm.type
//     };
//     setRequests(prev => [newRequest, ...prev]);

//   } catch (error) {
//     toast.error("Failed to create request");
//   } finally {
//     setLoading(false);
//   }
// };


if (pageLoading) {
  return <PageLoader message="Loading your workspace…" />;
}

// Filter tickets based on selected filter
const filteredTickets = ticketFilter === "All" 
  ? tickets 
  : tickets.filter(t => {
      if (ticketFilter === "Open") return t.status === "Open";
      if (ticketFilter === "In Progress") return t.status === "In Progress";
      if (ticketFilter === "Resolved") return t.status === "Resolved & Closed";
      return true;
    });

// Filter requests based on selected filter
const filteredRequests = requestFilter === "All"
  ? requests
  : requests.filter(r => {
      if (requestFilter === "Open") return r?.status === "Open";
      if (requestFilter === "In Progress") return r?.status === "In Progress";
      if (requestFilter=== "Resolved") return r?.status === "Resolved & Closed";
      return true;
    });

if (pageLoading) {
  return <PageLoader />;
}

const sendMessage =async() =>{
        try {
            const response = await axios.post(`${API_URL}/admin/comment`,{
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
            const response = await axios.post(`${API_URL}/admin/updatestatus`,{
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
          <h1 className={styles.title}>Hello {user?.name?.split(" ")[0]},</h1>

           {!details && (
            <div className={styles.tabsContainer}>
              <button 
                className={`${styles.mainTab} ${activeTab === "alltickets" ? styles.activeMainTab : ""}`}
                onClick={() => setActiveTab("alltickets")}
              >
                All Tickets
              </button>
              <button 
                className={`${styles.mainTab} ${activeTab === "myrequests" ? styles.activeMainTab : ""}`}
                onClick={() => setActiveTab("myrequests")}
              >
                My Requests
              </button>
            </div>
           )}
        </div>

        <button className={styles.createBtn} onClick={()=>{
          if(activeTab === "alltickets") {
            setCreateTicketOpen(true)
          } else {
           setCreateTicketOpen(true)
          }
        }}>
          <Plus size={16}  />
          {activeTab === "alltickets" ? "Create Ticket" : "Create Ticket"}
        </button>
      </div>

      {/* TICKETS/REQUESTS */}
      <div className={styles.list}>
        {!details && activeTab === "alltickets" && (
          <>
            {/* Filter Buttons for Tickets */}
            <div className={styles.filterRow}>
              <button 
                className={`${styles.filterBtn} ${ticketFilter === "All" ? styles.activeFilter : ""}`}
                onClick={() => setTicketFilter("All")}
              >
                All
              </button>
              <button 
                className={`${styles.filterBtn} ${ticketFilter === "Open" ? styles.activeFilter : ""}`}
                onClick={() => setTicketFilter("Open")}
              >
                Open
              </button>
              <button 
                className={`${styles.filterBtn} ${ticketFilter === "In Progress" ? styles.activeFilter : ""}`}
                onClick={() => setTicketFilter("In Progress")}
              >
                In Progress
              </button>
              <button 
                className={`${styles.filterBtn} ${ticketFilter === "Resolved" ? styles.activeFilter : ""}`}
                onClick={() => setTicketFilter("Resolved")}
              >
                Resolved
              </button>
            </div>

            {/* Stats Cards for All Tickets */}
            <div className={styles.statsGrid}>
              <div className={`${styles.statCard} ${styles.openCard}`}>
                <div className={styles.statNumber}>{tickets.filter(t => t.status === "Open").length}</div>
                <div className={styles.statLabel}>Open</div>
                {/* <div className={styles.statIconBox}>
                  <MessageSquare size={24} />
                </div> */}
              </div>

              <div className={`${styles.statCard} ${styles.waitingCard}`}>
                <div className={styles.statNumber}>{tickets.filter(t => t.status === "In Progress").length}</div>
                <div className={styles.statLabel}>Waiting</div>
                {/* <div className={styles.statIconBox}>
                  <Clock size={24} />
                </div> */}
              </div>

              <div className={`${styles.statCard} ${styles.activeCard}`}>
                <div className={styles.statNumber}>{tickets.filter(t => t.status === "Active").length}</div>
                <div className={styles.statLabel}>Active</div>
                {/* <div className={styles.statIconBox}>
                  <Pencil size={24} />
                </div> */}
              </div>

              <div className={`${styles.statCard} ${styles.resolvedCard}`}>
                <div className={styles.statNumber}>{tickets.filter(t => t.status === "Resolved & Closed").length}</div>
                <div className={styles.statLabel}>Resolved</div>
                {/* <div className={styles.statIconBox}>
                  <CheckCircle size={24} />
                </div> */}
              </div>
            </div>

            {/* Tickets Table */}
            <div className={styles.tableContainer}>
              <div className={styles.tableHeader}>
                <div className={styles.colTitle}>Title</div>
                <div className={styles.colStatus}>Status</div>
                <div className={styles.colPriority}>Priority</div>
                <div className={styles.colAssignee}>Assignee</div>
                <div className={styles.colSLA}>SLA</div>
              </div>

              {filteredTickets.map((t, index) => (
                <div className={styles.tableRow} key={index} onClick={() => handledetails(t._id)}>
                  <div className={styles.colTitle}>
                    <div>
                      <div className={styles.ticketTitle}>{t?.title}</div>
                      <div className={styles.ticketDetails}>Details... <span className={styles.chatBadge}>Chat</span></div>
                    </div>
                  </div>

                  <div className={styles.colStatus}>
                    <span className={`${styles.statusBadge} ${
                      t.status === "Open" ? styles.statusOpen :
                      t.status === "In Progress" ? styles.statusProgress :
                      t.status === "Resolved & Closed" ? styles.statusResolved :
                      styles.statusOpen
                    }`}>
                      {t.status === "In Progress" ? "● In Progress" : 
                       t.status === "Resolved & Closed" ? "● Resolved" : 
                       "● Open"}
                    </span>
                  </div>

                  <div className={styles.colPriority}>
                    <span className={`${styles.priorityBadge} ${
                      t.priority === "High" ? styles.priorityHigh :
                      t.priority === "Medium" ? styles.priorityMedium :
                      styles.priorityLow
                    }`}>
                      {t.priority}
                    </span>
                  </div>

                  <div className={styles.colAssignee}>
                    {alluser.find(u => u._id === t.assignedto)?.name || "Unassigned"}
                  </div>

                  <div className={styles.colSLA}>
                    0h 55m
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!details && activeTab === "myrequests" && (
          <>
            {/* Filter Buttons for Requests */}
            <div className={styles.filterRow}>
              <button 
                className={`${styles.filterBtn} ${requestFilter === "All" ? styles.activeFilter : ""}`}
                onClick={() => setRequestFilter("All")}
              >
                All
              </button>
              <button 
                className={`${styles.filterBtn} ${requestFilter === "Open" ? styles.activeFilter : ""}`}
                onClick={() => setRequestFilter("Open")}
              >
                Open
              </button>
              <button 
                className={`${styles.filterBtn} ${requestFilter === "Waiting" ? styles.activeFilter : ""}`}
                onClick={() => setRequestFilter("In Progress")}
              >
                In Progress
              </button>
              <button 
                className={`${styles.filterBtn} ${requestFilter === "Active" ? styles.activeFilter : ""}`}
                onClick={() => setRequestFilter("Resolved & Closed")}
              >
                Resolved
              </button>
              {/* <button 
                className={`${styles.filterBtn} ${requestFilter === "Review" ? styles.activeFilter : ""}`}
                onClick={() => setRequestFilter("Review")}
              >
                Review
              </button> */}
            </div>

            {/* Stats Cards for My Requests */}
            <div className={styles.statsGrid}>
              <div className={`${styles.statCard} ${styles.openCard}`}>
                <div className={styles.statNumber}>{requests.filter(r => r.status === "Open").length}</div>
                <div className={styles.statLabel}>Open</div>
                {/* <div className={styles.statIconBox}>
                  <MessageSquare size={24} />
                </div> */}
              </div>

              <div className={`${styles.statCard} ${styles.waitingCard}`}>
                <div className={styles.statNumber}>{requests.filter(r => r.status === "In Review").length}</div>
                <div className={styles.statLabel}>In Progress</div>
                {/* <div className={styles.statIconBox}>
                  <Clock size={24} />
                </div> */}
              </div>

              {/* <div className={`${styles.statCard} ${styles.activeCard}`}>
                <div className={styles.statNumber}>{requests.filter(r => r.status === "Pending").length}</div>
                <div className={styles.statLabel}>Resolved</div>
                <div className={styles.statIconBox}>
                  <Pencil size={24} />
                </div>
              </div> */}

              <div className={`${styles.statCard} ${styles.resolvedCard}`}>
                <div className={styles.statNumber}>{requests.filter(r => r.status === "Approved").length}</div>
                <div className={styles.statLabel}>Resolved</div>
                {/* <div className={styles.statIconBox}>
                  <CheckCircle size={24} />
                </div> */}
              </div>
            </div>

            {/* Requests Table */}
            <div className={styles.tableContainer}>
              <div className={styles.tableHeader}>
                <div className={styles.colTitle}>Title</div>
                <div className={styles.colStatus}>Status</div>
                <div className={styles.colPriority}>Priority</div>
                <div className={styles.colAssignee}>Assignee</div>
                <div className={styles.colSLA}>SLA</div>
              </div>

               {filteredRequests.map((t, index) => (
                <div className={styles.tableRow} key={index} onClick={() => handledetails(t._id)}>
                  <div className={styles.colTitle}>
                    <div>
                      <div className={styles.ticketTitle}>{t?.title}</div>
                      <div className={styles.ticketDetails}>Details... <span className={styles.chatBadge}>Chat</span></div>
                    </div>
                  </div>

                  <div className={styles.colStatus}>
                    <span className={`${styles.statusBadge} ${
                      t.status === "Open" ? styles.statusOpen :
                      t.status === "In Progress" ? styles.statusProgress :
                      t.status === "Resolved & Closed" ? styles.statusResolved :
                      styles.statusOpen
                    }`}>
                      {t.status === "In Progress" ? "● In Progress" : 
                       t.status === "Resolved & Closed" ? "● Resolved" : 
                       "● Open"}
                    </span>
                  </div>

                  <div className={styles.colPriority}>
                    <span className={`${styles.priorityBadge} ${
                      t.priority === "High" ? styles.priorityHigh :
                      t.priority === "Medium" ? styles.priorityMedium :
                      styles.priorityLow
                    }`}>
                      {t.priority}
                    </span>
                  </div>

                  <div className={styles.colAssignee}>
                    {alluser.find(u => u._id === t.assignedto)?.name || "Unassigned"}
                  </div>

                  <div className={styles.colSLA}>
                    0h 55m
                  </div>
                </div>
              ))}
            </div>
          </>
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

    {/* Create Request Modal */}
    {createRequestOpen && (
      <div className={styles.overlay}>
        <div className={styles.modal}>
  
          {/* HEADER */}
          <div className={styles.header}>
            <div>
              <h3>Create Request</h3>
            </div>
            <button className={styles.closeBtn} onClick={()=>{setCreateRequestOpen(false)}}>✕</button>
          </div>
  
          {/* REQUEST TYPE */}
          <label className={styles.label}>Request Type *</label>
          <select
            className={styles.input}
            value={requestForm.type}
            onChange={(e) => setRequestForm({ ...requestForm, type: e.target.value })}
          >
            <option value="">Select request type</option>
            <option value="Leave Request">Leave Request</option>
            <option value="Task Extension">Task Extension Request</option>
            <option value="Resource Access">Resource Access Request</option>
            <option value="Equipment">Equipment Request</option>
            <option value="Training">Training Request</option>
            <option value="Other">Other</option>
          </select>
  
          {/* SHORT DESCRIPTION */}
          <label className={styles.label}>Short Description *</label>
          <input
            className={styles.input}
            placeholder="Enter..."
            value={requestForm.shortDescription}
            onChange={(e) => setRequestForm({ ...requestForm, shortDescription: e.target.value })}
          />
  
          {/* DETAILED INFORMATION */}
          <label className={styles.label}>Detailed Information *</label>
          <textarea
            className={styles.textarea}
            placeholder="Enter..."
            value={requestForm.detailedInfo}
            onChange={(e) =>
              setRequestForm({ ...requestForm, detailedInfo: e.target.value })
            }
          />
  
          {/* ACTIONS */}
          <div className={styles.actions}>
            <button
              className={styles.primaryBtn}
              onClick={handleCreate}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
            <button className={styles.cancelBtn} onClick={()=>setCreateRequestOpen(false)}>
              Cancel
            </button>
          </div>
  
        </div>
      </div>
    )}

    </>
  );
}
