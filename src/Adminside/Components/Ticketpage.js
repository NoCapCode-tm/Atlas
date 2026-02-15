import React, { useEffect, useMemo, useState } from "react";
import styles from "../CSS/Ticketpage.module.css"; // adjust path to your project
import { ChartNoAxesCombined, Clock, LayoutDashboard, Pencil, Ticket } from "lucide-react";
import axios from "axios";
import {useNavigate} from "react-router-dom"
import { toast } from "react-toastify";
import { InfoTooltip } from "./InfoTooltip";

const StatCard = ({ title, value, subtitle }) => {
  const getIconColor = () => {
    switch (title) {
      case "Active":
        return { icon: "orange", bg: "rgba(255,165,0,0.15)",tx: "rgb(255,165,0)" };
      case "Working":
        return { icon: "purple", bg: "rgba(128,0,128,0.15)" ,tx: "rgb(128,0,128)"};
      case "Complete":
        return { icon: "green", bg: "rgba(0,128,0,0.15)",tx: "rgb(0,128,0)" };
      case "Urgent":
        return { icon: "red", bg: "rgba(255,0,0,0.15)",tx: "rgb(255,0,0)" };
      default:
        return { icon: "#444", bg: "rgba(0,0,0,0.1)",tx: "rgb(0,0,0)" };
    }
  };

  const colors = getIconColor();

  const getIcon = () => {
    if (title === "Urgent") return <ChartNoAxesCombined color={colors.icon} />;
    return <Clock color={colors.icon} />;
  };

  return (
    <div className={styles.statCard}>
      <div className={styles.statLeft}>
        <div className={styles.icon} style={{ backgroundColor: colors.bg }}>
          {getIcon()}
        </div>
        <div className={styles.statTitle} style={{ color: colors.tx }}>{title}</div>
      </div>

      <div className={styles.statValue}>{value}</div>

      {subtitle && <div className={styles.statSubtitle}>{subtitle}</div>}
    </div>
  );
};



const CategoryItem = ({ color, name, count }) => (
    <div className={styles.catrowcount}>
  <div className={styles.catRow}>
    <span className={styles.catDot} style={{ background: color }} />
    <span className={styles.catName}>{name}</span>
    </div>
    <span className={styles.catCount}>{count}</span>
  
  </div>
);


const TicketRow = ({ ticket , users}) => {

    const handleuser = (raisedId) => {
    const found = users.find(u => u?._id?.toString() === raisedId?.toString());
    return found ? found.name : "Unknown";
  };

  const formatDate = (dateValue) => {
  if (!dateValue) return "No Date";
  return new Date(dateValue).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
};
    return(
  <div className={styles.ticketRow}>
    <div className={styles.ticketInfo}>
      <div className={styles.ticketTitle}>{ticket.title}</div>
      <div className={styles.ticketMeta}>
        Created by <b>{handleuser(ticket.raisedby)}</b><br/>{formatDate(ticket.raisedon)}
      </div>
    </div>

    <div className={styles.ticketTags}>
      <span className={`${styles.tag} ${styles[`priority_${ticket.priority}`]}`}>
        {ticket.priority || "medium"}
      </span>
      <span className={`${styles.tag} ${
  styles[`status_${(ticket.status || "Open").replace(/\s+/g, "_").replace(/&/g, "a")}`]
}`}>
  {ticket.status || "Open"}
      </span>
    </div>
  </div>
)};

const Ticketpage = () => {
     const[active,setActive]=useState("dashboard")
     const [roles,setRole] = useState([]);
    const[tickets,setTickets]=useState([])
    const[users,setusers]=useState([])
    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const[details,setdetails]=useState(false)
    const[ticket,setticket]=useState({})
    const[activestatus,setactivestatus]=useState("")
    const[comment,setComment]=useState("")
    const [assignPopup, setAssignPopup] = useState(false);
const [selectedEmployee, setSelectedEmployee] = useState("");
const [createTicketOpen, setCreateTicketOpen] = useState(false);
const[comments1,setComments1]=useState([])
const [pageLoading, setPageLoading] = useState(true);
const [actionLoading, setActionLoading] = useState(false);


const [newTicket, setNewTicket] = useState({
  title: "",
  category: "",
  priority: "",
  description: "",
});

const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "",
    priority: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
  if (!form.title || !form.category || !form.priority || !form.description) {
    toast.error("Please fill all fields");
    return;
  }

  try {
    setLoading(true);

    await axios.post(
      `https://atlasbackend-px53.onrender.com/api/v1/admin/createticket`,
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
    setForm({ title: "", category: "", priority: "", description: "" });

    await fetchTickets(); // 🔥 AUTO REFRESH
    setActive("allticket"); // move user to tickets

  } catch (error) {
    toast.error("Failed to create ticket");
  } finally {
    setLoading(false);
  }
};



    const navigate = useNavigate()

   
    const fetchemployees = async () => {
      try {
        const response = await axios.get(
          `https://atlasbackend-px53.onrender.com/api/v1/admin/getalluser`,
          { withCredentials: true }
        );

        console.log(response.data);
        console.log(response.data.message[0].status)
        setusers(response.data.message); 
      } catch (error) {
        console.log("Error fetching employees:", error.message);
      }
    };

    const fetchTickets = async () => {
  try {
    const response = await axios.get(
      `https://atlasbackend-px53.onrender.com/api/v1/admin/gettickets`
    );
    setTickets(response.data.data);
  } catch (error) {
    toast.error("Failed to load tickets");
  }
};

useEffect(() => {
  const init = async () => {
    setPageLoading(true);
    await Promise.all([fetchemployees(), fetchTickets()]);
    setPageLoading(false);
  };
  init();
}, []);


  
  const stats = useMemo(() => {
    const open = tickets.filter(t => t.status === "Open").length;
    const inProgress = tickets.filter(t => t.status === "In Progress").length;
    const resolved = tickets.filter(t => t.status === "Resolved & Closed").length;
    const urgent = tickets.filter(t => t.priority === "High" || t.priority === "Urgent").length;
    return { open, inProgress, resolved, urgent };
  }, [tickets]);

  const avgResolutionHours = useMemo(() => {
    
    return 2966.2;
  }, []);

  const categoryCounts = useMemo(() => {
    const map = {};
    tickets.forEach(t => {
      map[t.category] = (map[t.category] || 0) + 1;
    });
    return map;
  }, [tickets]);

  const categoryPalette = {
    Access: "#7C3AED",
    Payroll: "#10B981",
    Hardware: "#F97316",
    Software: "#3B82F6",
    Bug: "#EF4444",
  };

  const handlestatus = async(status)=>{
        setactivestatus(status)
        try {
            const response = await axios.post(`https://atlasbackend-px53.onrender.com/api/v1/admin/updatestatus`,{
                id:ticket._id,
                status:status
            },{withCredentials:true})
            console.log(response)
            toast.success("Status Updated Successfully")
            await fetchTickets();

        } catch (error) {
            toast.error("Status Cannot be Added Successfully")
        }
        
    }

    const sendMessage =async() =>{
        try {
            const response = await axios.post(`https://atlasbackend-px53.onrender.com/api/v1/admin/comment`,{
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

    useEffect(()=>{
        (async()=>{
           const response = await axios.get(`https://atlasbackend-px53.onrender.com/api/v1/admin/getroles`)
           console.log(response)
           setRole(response.data.message)
    
        })()
       },[])



  return (
    <>
    {pageLoading && (
  <div className={styles.fullLoader}>
    <div className={styles.spinner}></div>
    <p>Loading tickets…</p>
  </div>
)}

    <div className={styles.wholepage}>
     {/* TOP BAR HEADER LIKE FIGMA UI */}
<div className={styles.topBar}>
  <div className={styles.topBarLeft}>
    <div className={styles.appIcon}><Ticket size={25} color="white"/></div>
    <div>
      <div className={styles.appTitle}>Support / Ticketing System 
        <InfoTooltip text="Track and resolve employee support and issue requests" />
      </div>
      <div className={styles.appSubtitle}>Employee Support Portal</div>
    </div>
  </div>

  <div className={styles.topBarRight}>
    <button
  className={styles.createTicketBtn}
  onClick={() => setCreateTicketOpen(true)}
>
  ＋ Create Ticket
</button>

  </div>
</div>

{/* NAV TABS */}
<div className={styles.navTabs}>
  <button className={active==="dashboard"?styles.activeTab : styles.inactiveTab} onClick={()=>{setActive("dashboard")}}><LayoutDashboard/>Dashboard</button>
  <button className={active==="allticket"?styles.activeTab : styles.inactiveTab} onClick={()=>{setActive("allticket")}}><Ticket/>All Tickets</button>
</div>

{active === "dashboard" ?(

      <div className={styles.page}>

      <h3 className={styles.sectionTitle}>Ticket Statistics</h3>
      <div className={styles.underhead}>Overview of support ticket metrics</div>

      <div className={styles.statsGrid}>
        <StatCard title="Active" value={stats.open} subtitle="Open Tickets" accent="#FFEFE9" />
        <StatCard title="Working" value={stats.inProgress} subtitle="In Progress" accent="#EEF2FF" />
        <StatCard title="Complete" value={stats.resolved} subtitle="Resolved/Closed" accent="#ECFDF5" />
        <StatCard title="Urgent" value={stats.urgent} subtitle="High Priority" accent="#FFF1F2" />
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.leftCol}>
          <div className={styles.largeCard}>
            <div className={styles.largeTitle}>Average Resolution Time</div>
            <div className={styles.bigNumber}>{avgResolutionHours}<span className={styles.spanhours}>hours</span></div>
            <div className={styles.smallNote}>Based on {stats.resolved} resolved tickets</div>
          </div>
        </div>

        <div className={styles.rightCol}>
          <div className={styles.largeCard}>
            <div className={styles.largeTitle}>Tickets by Category</div>
            <div className={styles.categoryList}>
              {Object.keys(categoryCounts).length === 0 && <div className={styles.empty}>No categories</div>}
              {Object.entries(categoryCounts).map(([cat, count]) => (
                <CategoryItem key={cat} color={categoryPalette[cat] || "#9CA3AF"} name={cat} count={count} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.recentCard}>
        <div className={styles.recentTitle}>Recent Tickets</div>
        <div className={styles.ticketList}>
          {tickets.map((t, i) => (
            <TicketRow key={i} ticket={t} users={users} />
          ))}
        </div>
      </div>
    </div>
    ):(
        !details? (
             <div className={styles.allticketsInner}>

  {/* FILTER STATES */}
  {(() => {
    
    // COMPUTED FILTERED TICKETS
    var filteredTickets = tickets.filter(t => {
      const matchesSearch =
        t.title?.toLowerCase().includes(search.toLowerCase()) ||
        t.details?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = filterCategory ? t.category === filterCategory : true;
      const matchesStatus = filterStatus ? t.status === filterStatus : true;

      return matchesSearch && matchesCategory && matchesStatus;
    });

    const handledetails = async(id) =>{
      const response = await axios.post(`https://atlasbackend-px53.onrender.com/api/v1/admin/ticketdetail`,{
            id:id
           },{withCredentials:true})
           console.log(response.data.message)
           setticket(response.data.message)
           setdetails(true)
           setactivestatus(response.data.message.status)
    }

    

    // RETURN JSX
    return (
      <>

        {/* TOP BAR */}
        <div className={styles.allHead}>
          <div className={styles.allTitle}>All Support Tickets</div>
          <div className={styles.allSubtitle}>
            View and manage employee support requests
          </div>
        </div>

        {/* SEARCH + FILTERS */}
        <div className={styles.allSearchRow}>
          <input
            className={styles.searchInputBox}
            placeholder="Search tickets by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className={styles.filterBox}
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option>Access</option>
            <option>Payrole</option>
            <option>Hardware</option>
            <option>Software</option>
            <option>Bug</option>
          </select>

          <select
            className={styles.filterBox}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Resolved & Closed</option>
          </select>
        </div>

        {/* COUNT */}
        <div className={styles.ticketCount}>
          Showing {filteredTickets.length} of {tickets.length} tickets
        </div>

        {/* FILTERED TICKET LIST */}
        <div className={styles.ticketListAll}>
          {filteredTickets.map((t, index) => (
            <div key={index} className={styles.ticketCardAll} onClick={()=>handledetails(t._id)}>
              
              {/* TOP ROW */}
              <div className={styles.ticketTopRow}>
                <div className={styles.tagRow}>
                  <span className={styles.ticketId}>
                    TKT-{String(index + 1).padStart(3, "0")}
                  </span>
                  <span className={`${styles.tag} ${styles[`priority_${t.priority}`]}`}>
                    {t.priority}
                  </span>
                  <span className={`${styles.tag} ${styles[`category_${t.category}`]}`}>
                    {t.category}
                  </span>
                </div>

                <span className={`${styles.tag} ${
  styles[`status_${(t.status || "Open").replace(/\s+/g, "_").replace(/&/g, "a")}`]
}`}>
  {t.status || "Open"}
</span>

              </div>

              {/* TITLE */}
              <div className={styles.ticketTitleAll}>{t.title}</div>

              {/* DESCRIPTION */}
              <div className={styles.ticketDetailsAll}>
                {t.details?.substring(0, 140)}...
              </div>

              {/* META INFO */}
              <div className={styles.ticketMetaAll}>
                <span>
                  Created by <b>{users.find(u => u._id === t.raisedby)?.name || "Unknown"}</b>
                </span>
                <span>•</span>
                <span>
                  Assigned to <b>{users.find(u => u._id === t.assignedto)?.name || "Not Assigned"}</b>
                </span>
                <span>•</span>
                <span>{new Date(t.raisedon).toLocaleDateString("en-IN")}</span>
              </div>

              {/* ATTACHMENTS + COMMENTS */}
              <div className={styles.ticketFooterRow}>
                <span className={styles.attachment}>{t.attachments?.length || 0} attachments</span>
                <span className={styles.comments}>{t.comments?.length || 0} comments</span>
              </div>

            </div>
          ))}
        </div>
      </>
    );
  })()}
             </div>
        ):(
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
          Created by <b>{users.find(u => u._id === ticket.raisedby)?.name || "Unknown"}</b>
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
      <div className={styles.sideCard}>
        <div className={styles.sideTitle}>Status</div>

        <div className={styles.statusList}>
          <div className={`${styles.statusOption} ${activestatus === "Open" ? styles.activeStatus : styles.openStatus}`} onClick={()=>{handlestatus("Open")}}>
            Open
          </div>
          <div className={`${styles.statusOption} ${activestatus === "In Progress" ? styles.activeStatus : styles.progressStatus}`} onClick={()=>{handlestatus("In Progress")}}>
            In Progress
          </div>
          <div className={`${styles.statusOption} ${activestatus === "Resolved & Closed" ? styles.activeStatus : styles.resolvedStatus}`} onClick={()=>{handlestatus("Resolved & Closed")}}>
            Resolved
          </div>
        </div>
      </div>

      {/* ASSIGNMENT BOX */}
      <div className={styles.sideCard}>
        <div className={styles.sideTitle}>Assignment <Pencil size={16} onClick={() => setAssignPopup(true)}/></div>

        <div className={styles.sideSubtitle}>Assigned To</div>
        <div className={styles.sideValue}>
          {users.find(u => u._id === ticket.assignedto)?.name || "Not Assigned"}
        </div>

        <div className={styles.sideSubtitle}>Role</div>
        <div className={styles.sideValue}>
           {
    (() => {
      const usr = users.find(u => u._id === ticket.assignedto);
      if (!usr) return "Not Assigned";
      const roleId = usr.roleid;
      if (!roleId) return "No Role Assigned";
      const roleObj = roles.find(r => r._id === roleId);
      return roleObj?.rolename || "Unknown Role";
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
          )
   

)}

    </div>

    {assignPopup && (
  <div className={styles.popupOverlay}>
    <div className={styles.popupBox}>
      
      <div className={styles.popupHeader}>
        <h3>Assign Ticket</h3>
        <button className={styles.closeBtn} onClick={() => setAssignPopup(false)}>✕</button>
      </div>

      {/* Employee Dropdown */}
      <select 
        className={styles.assignSelect}
        value={selectedEmployee}
        onChange={(e) => setSelectedEmployee(e.target.value)}
      >
        <option value="">Select Employee</option>
        {users.map((u) => (
          <option key={u._id} value={u._id}>{u.name}</option>
        ))}
      </select>

      {/* Buttons */}
      <div className={styles.popupActions}>
        <button 
          className={styles.saveAssignBtn}
          onClick={async () => {
            try {
              const response = await axios.post(
                `https://atlasbackend-px53.onrender.com/api/v1/admin/assign`,
                { id: ticket._id, assignedto: selectedEmployee },
                { withCredentials: true }
              );
              console.log(response)
              toast.success("User Assigned Successfully");
setAssignPopup(false);
window.location.reload();

            } catch (error) {
              toast.error("Error assigning user");
            }
          }}
        >
          Assign
        </button>

        <button 
          className={styles.cancelAssignBtn}
          onClick={() => setAssignPopup(false)}
        >
          Cancel
        </button>
      </div>

    </div>
  </div>
)}

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
};

export default Ticketpage;
