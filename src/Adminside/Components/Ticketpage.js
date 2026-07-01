import React, { useEffect, useMemo, useState } from "react";
import styles from "../CSS/Ticketpage.module.css"; // adjust path to your project
import { ChartNoAxesCombined, Clock, Filter, LayoutDashboard, Pencil, Search, Ticket } from "lucide-react";
import axios from "axios";
import {useNavigate} from "react-router-dom"
import { toast } from "react-toastify";
import { InfoTooltip } from "./InfoTooltip";



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
      `https://b-atlas-ncc.onrender.com/api/v1/admin/createticket`,
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
          `https://b-atlas-ncc.onrender.com/api/v1/admin/getalluser`,
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
      `https://b-atlas-ncc.onrender.com/api/v1/admin/gettickets`
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
            const response = await axios.post(`https://b-atlas-ncc.onrender.com/api/v1/admin/updatestatus`,{
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
            const response = await axios.post(`https://b-atlas-ncc.onrender.com/api/v1/admin/comment`,{
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
           const response = await axios.get(`https://b-atlas-ncc.onrender.com/api/v1/admin/getroles`)
           console.log(response)
           setRole(response.data.message)
    
        })()
       },[])

       const filteredTickets = tickets.filter((ticket) => {
  const matchesSearch =
    ticket.title?.toLowerCase().includes(search.toLowerCase()) ||
    ticket.category?.toLowerCase().includes(search.toLowerCase()) ||
    ticket.status?.toLowerCase().includes(search.toLowerCase());

  const matchesCategory = filterCategory
    ? ticket.category === filterCategory
    : true;

  const matchesStatus = filterStatus
    ? ticket.status === filterStatus
    : true;

  return matchesSearch && matchesCategory && matchesStatus;
});

const ticketsPerPage = 9;
const [currentPage, setCurrentPage] = useState(1);

const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

const currentTickets = filteredTickets.slice(
  (currentPage - 1) * ticketsPerPage,
  currentPage * ticketsPerPage
);



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

{/* //kip cards */}
<div className={styles.statsGrid}>
  <div className={styles.statCard}>
    <p className={styles.statTitle}>Avg. Response</p>
    <h2 className={styles.statValue}>
      {Math.floor(avgResolutionHours / 60)}h {Math.round(avgResolutionHours % 60)}m
    </h2>
  </div>

  <div className={styles.statCard}>
    <p className={styles.statTitle}>Breached SLA</p>
    <h2 className={styles.statValue}>{stats.urgent}</h2>
  </div>

  <div className={styles.statCard}>
    <p className={styles.statTitle}>Due Today</p>
    <h2 className={styles.statValue}>
      {
        tickets.filter(ticket => {
          if (!ticket.dueDate) return false;

          const today = new Date();
          const due = new Date(ticket.dueDate);

          return (
            due.getDate() === today.getDate() &&
            due.getMonth() === today.getMonth() &&
            due.getFullYear() === today.getFullYear() &&
            ticket.status !== "Resolved & Closed"
          );
        }).length
      }
    </h2>
  </div>

  <div className={styles.statCard}>
    <p className={styles.statTitle}>Resolved</p>
    <h2 className={styles.statValue}>{stats.resolved}</h2>
  </div>
</div>

{/* table part */}
<div className={styles.ticketContainer}>

    <div className={styles.ticketToolbar}>

        <div className={styles.searchBox}>

            <Search size={18} />

            <input
                type="text"
                placeholder="Search Employees"
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
            />

        </div>

        <button className={styles.filterBtn}>

            <Filter size={16}/>

            Filters

        </button>

    </div>


    <table className={styles.ticketTable}>

        <thead>

        <tr>

            <th>Ticket List</th>

            <th>Categories</th>

            <th>SLA</th>

            <th>Priority</th>

            <th>Assignee</th>

            <th>Status</th>

        </tr>

        </thead>


        <tbody>

        {currentTickets.map(ticket=>{

            const assignee = users.find(
                u=>u._id===ticket.assignedTo
            );

            const dueHours = ticket.dueHours || 0;

            const slaText =
                dueHours<=0
                ?"Breached"
                :`${dueHours}h left`;

            return(

                <tr
                    key={ticket._id}
                    className={styles.tableRow}
                    onClick={()=>{
                        setticket(ticket);
                        setdetails(true);
                    }}
                >

                    <td className={styles.ticketTitle}>
                        {ticket.title}
                    </td>

                    <td>{ticket.category}</td>

                    <td
                    className={
                        dueHours<=0
                        ?styles.breached
                        :styles.remaining
                    }
                    >
                        {slaText}
                    </td>

                    <td>

                        <span
                        className={`${styles.priority}
                        ${
                            ticket.priority==="High"
                            ?styles.high
                            :ticket.priority==="Medium"
                            ?styles.medium
                            :styles.low
                        }`}
                        >

                            {ticket.priority}

                        </span>

                    </td>

                    <td>

                        {assignee
                        ?assignee.name
                        :"Unassigned"}

                    </td>

                    <td>

                        <span
                        className={
                            ticket.status==="Resolved & Closed"
                            ?styles.resolved
                            :ticket.status==="In Progress"
                            ?styles.inprogress
                            :styles.open
                        }
                        >

                            {ticket.status}

                        </span>

                    </td>

                </tr>

            )

        })}

        </tbody>

    </table>

    <div className={styles.pagination}>

        <p>

            Showing{" "}
            {(currentPage-1)*ticketsPerPage+1}

            –

            {Math.min(
                currentPage*ticketsPerPage,
                filteredTickets.length
            )}

            {" "}of{" "}

            {filteredTickets.length}

        </p>

        <div className={styles.pageButtons}>

            <button
            disabled={currentPage===1}
            onClick={()=>setCurrentPage(p=>p-1)}
            >

                ❮

            </button>

            {[...Array(totalPages)].map((_,i)=>(

                <button
                key={i}
                onClick={()=>setCurrentPage(i+1)}
                className={
                    currentPage===i+1
                    ?styles.activePage
                    :""
                }
                >

                    {i+1}

                </button>

            ))}

            <button
            disabled={currentPage===totalPages}
            onClick={()=>setCurrentPage(p=>p+1)}
            >

                ❯

            </button>

        </div>

    </div>

</div>


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
                `https://b-atlas-ncc.onrender.com/api/v1/admin/assign`,
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
