import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../CSS/EmployeeDetailspage.css";
import { BotMessageSquare, Calendar, CircleDot, Clock, Folder, Mail, Menu, Phone, Send } from "lucide-react";
// import HumanityFounderNavbarLogo from "../../components/HumanityFounderNavbarLogo";
// import ManagerSidebar from "../../components/ManagerSidebar2";
// import ReactMarkdown from "react-markdown";
// import ScheduleTaskModal from "../../components/ScheduleTaskModal";
// import SendMailModal from "../../components/SendMailModal";
import {toast} from "react-toastify";


const EmployeeDetails = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const[task,setTask]=useState([])
  const[Reports,setReports]=useState([])
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState("");
  const [projects, setProjects] = useState([]);
  const [allusers, setAllusers] = useState([]);
  const [toggleon, setToggleon] = useState(false);
  const [status, setStatus] = useState(employee?.status);
  const[completedtasks,setcompletedtasks]=useState([])
  const[incompletedtasks,setincompletedtasks]=useState([])
  const [projectsWithEmployees, setProjectsWithEmployees] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
const [selectedUpdate, setSelectedUpdate] = useState(null);
const [showModal, setShowModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const navigate = useNavigate()
   const [selectedTask, setSelectedTask] = useState(null);
   const [pageLoading, setPageLoading] = useState(true);
  const [taskData, setTaskData] = useState({
    employeeid: id,
    title: "",
    linkedproject: "",
    assigneddate: "",
    duration: "",
    details: "",
  });
  const [message, setMessage] = useState("");

 



  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await axios.get(
          `https://atlasbackend-px53.onrender.com/api/v1/admin/getuserdetails/${id}`,
          { withCredentials: true }
        );
        setEmployee(res.data.message);
        console.log(res.data.message);
      } catch (err) {
        console.error("Error fetching employee:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id]);

  useEffect(() => {
  if (!employee?._id) return;

  let mounted = true;

  const loadDashboard = async () => {
    try {
      const [taskRes, reportRes] = await Promise.all([
        axios.get("https://atlasbackend-px53.onrender.com/api/v1/admin/getalltask"),
        axios.get("https://atlasbackend-px53.onrender.com/api/v1/admin/getreports"),
      ]);

      if (!mounted) return;

      const employeeTasks = taskRes.data.message.filter(
  t =>
    String(t.assignedto?._id || t.assignedto) ===
    String(employee._id)
);


      const completed = employeeTasks.filter(
        t => t.status === "Completed"
      );

      const incomplete = employeeTasks.filter(
        t => t.status !== "Completed"
      );

      setTask(employeeTasks);
      setcompletedtasks(completed);
      setincompletedtasks(incomplete);

      setReports(
        reportRes.data.message.filter(
          r => String(r.user) === String(employee._id)
        )
      );

    } catch (err) {
      toast.error("Failed to load tasks / reports");
    } finally {
      setPageLoading(false);
    }
  };

  loadDashboard();

  return () => {
    mounted = false;
  };
}, [employee]);

  // ✅ Fetch AI summary after employee loads
  // useEffect(() => {
  //   if (employee?._id) {
  //     const fetchSummary = async () => {
  //       try {
  //         setSummaryLoading(true);
  //         const res = await axios.post(
  //           `https://atlasbackend-px53.onrender.com/api/v1/manager/getaisummary`,
  //           { id: employee._id },
  //           { withCredentials: true }
  //         );
  //         setAiSummary(res.data?.data?.summary || "No summary available yet.");
  //       } catch (error) {
  //         console.error("Error generating AI summary:", error);
  //         setAiSummary("AI summary generation failed or quota exceeded.");
  //       } finally {
  //         setSummaryLoading(false);
  //       }
  //     };
  //     fetchSummary();
  //   }
  // }, [employee]);

   useEffect(() => {
    const fetchProjects = async () => {
      if (!employee?._id) return;
      try {
        const response = await axios.get(
          "https://atlasbackend-px53.onrender.com/api/v1/admin/getallproject",
          { withCredentials: true }
        );
        const myProjects = response.data.message.filter((proj) =>
          employee?.Projects?.includes(proj._id)
        );
        console.log(myProjects)
        setProjects(myProjects || []);
      } catch (err) {
        console.log("Error in fetching projects",err.message)
      }
    };
    fetchProjects();
  }, [employee]);

   useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          'https://atlasbackend-px53.onrender.com/api/v1/admin/getalluser',
          { withCredentials: true }
        );
        const allUsersData = response.data.message;
        setAllusers(allUsersData);
    

        if (!projects.length) return;
        const combined = projects.map((proj) => {
          const assignedEmployees = allUsersData.filter((user) =>
            proj.employeeAlloted.includes(user._id)
          );
         const leader =
            allUsersData.find((u) => u._id === proj.projectleader) || null;
          return {
            ...proj,
            teamMembers: assignedEmployees,
            projectLeader: leader,
          };
        });
        setProjectsWithEmployees(combined);
      } catch (error) {
        console.error('Error fetching users:', error.message);
      }
    };
    if (projects.length > 0) fetchUsers();
  }, [projects]);

  //  const sendmail = async() =>{ 
  //   try { 
  //     const response = await axios.post("https://humanity-website-91b09b541030.herokuapp.com/api/v1/manager/sendmail",{
  //        message:message, email:employee.email 
  //       },{withCredentials:true}) 
  //       console.log(response) 
  //       toast.success("Mail sent Successfully")
  //     } 
  //       catch (error) { 
  //         console.log("Error in sending mail",error.message) 
  //         toast.error("Mail cannot be sent")
  //       }finally{ 
  //         setMessage(""); setShowModal(false);
  //        } }

  // const handleTaskSubmit = async() =>{ 
  //   try { 
  //     setLoading(true)
  //     console.log(taskData)
  //     const response = await axios.post("https://humanity-website-91b09b541030.herokuapp.com/api/v1/manager/assigntask",taskData,{withCredentials:true}) 
  //     console.log(response) 
  //   } catch (error) { 
  //     console.log("Error in assigning task",error.message) 
  //     toast.error("Task cannot be assigned")
  //   }finally{ 
  //     setShowTaskModal(false) 
  //     toast.success("Task Assigned Successfully")
  //     setLoading(false)
  //     window.location.reload();

  //   } }

//     const handlestatus = async() =>{
//       try{
//         setLoading(true)
//         const response = await axios.put("https://humanity-website-91b09b541030.herokuapp.com/api/v1/manager/updatedetails",{
//           id:id,
//           status:status
//         },{withCredentials:true})
//         console.log(response)
//         if (status === "Terminated") {
//              toast.success("Employee terminated successfully.");
//              navigate("/manager/dashboard");
//            return;
// }
//       }catch(error){
//        console.log("Error occured in updating details",error.message)
//        toast.success("Something went wrong")
//       }finally{
//         setLoading(false)
//       }
//     }

//   const openModal = (task) => {
//   setSelectedTask(task);
//   setShowModal(true);
// };

const updateTaskStatus = async (taskId, newStatus) => {
  try {
    await axios.put(
      `https://atlasbackend-px53.onrender.com/api/v1/employee/updatetask/${taskId}`,
      { status: newStatus },
      { withCredentials: true }
    );

    // update pending list
    setincompletedtasks(prev =>
      prev
        .map(t =>
          t._id === taskId ? { ...t, status: newStatus } : t
        )
        .filter(t => t.status !== "Completed")
    );

    // update completed list
    setcompletedtasks(prev => {
      const updatedTask =
        incompletedtasks.find(t => t._id === taskId);

      if (newStatus === "Completed" && updatedTask) {
        return [...prev, { ...updatedTask, status: "Completed" }];
      }

      return prev;
    });

    toast.success("Task status updated");
  } catch (err) {
    toast.error("Failed to update task");
  }
};



  if (loading) return <div className="loading">Loading employee details...</div>;
  if (!employee) return <div className="error">Employee not found</div>;

  return (
    <>
    <div className="employee-details-container">
      {/* <ManagerSidebar activeItem="Dashboard" toggler={toggleon} settoggler={setToggleon} /> */}
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-logo">
          <Menu size={24} onClick={() => { setToggleon(!toggleon); }} />
          <div className="sidebar-logo">
            {/* <HumanityFounderNavbarLogo /> */}
          </div>
        </div>
      </header>
      <div className="employee-details-name">
        <div className="name">
          <span className="empdetail-name">{employee?.name}</span>
          <span className="empdetail-designation">
  {employee.designation?.name}
</span>

        </div>
        <div className="buttons">
          <button className="edit" onClick={()=>{setShowModal(true)}}>{loading?"Sending Mail...":"Send Mail"}</button>
          <button className="schedule" onClick={()=>{setShowTaskModal(true)}}>{loading?"Scheduling Task...":"Schedule Task"}</button>
        </div>
      </div>
      <div className="employee-details-twodiv">
        <div className="employee-personal-details">
          <div className="employee-details-image">
            <img src={employee?.profilepicture} alt="/" className="personal-details-image" />
          </div>
          <span className="empdetail-name">{employee?.name}</span>
          <span className="empdetail-designation">{employee?.designation?.name}</span>
          <span className="employee-details-althree">
            <Calendar size={18} />Started {new Date(employee?.createdAt).toLocaleDateString()}
          </span>
          <div className="employee-details-email"><Mail size={20} color="purple" />{employee?.email}</div>
          {/* <div className="employee-details-email"><Phone size={20} color="purple" />{employee.phonenumber}</div>
          <div className="employee-details-email"><Send size={20} color="purple" />{employee.telegramid}</div> */}
          <div className="change-status">
            <h3>Change Status</h3>
            <select
              className="status-dropdown"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">{employee?.status}</option>
              <option value="Active & Unpaid">Active & Unpaid</option>
              <option value="Active & Paid">Active & Paid</option>
              <option value="Terminated">Terminated</option>
            </select>
            <button className="save-changes" >{loading?"Saving":"Save Changes"}</button>
          </div>
        </div>
        <div className="employee-generated-details">
 <div className="ai-generated-summary">
  <h4>
    <BotMessageSquare size={24} color="purple" /> AI Generated Summary
  </h4>
  <span className="sub-head">Performance insights and highlights</span>

  {/* ✅ Show Generate / Regenerate button */}
  {!summaryLoading && (
    <button
      className="generate-summary-btn"
      onClick={async () => {
        try {
          setSummaryLoading(true);
          const res = await axios.post(
            "https://humanity-website-91b09b541030.herokuapp.com/api/v1/manager/getaisummary",
            { id: employee._id },
            { withCredentials: true }
          );

          const newSummary =
            res.data?.data?.summary || "No summary available yet.";
          setAiSummary(newSummary);

          // ✅ Also update employee in state so next render knows summary exists
          setEmployee((prev) => ({ ...prev, aisummary: newSummary }));
        } catch (error) {
          console.error("Error generating AI summary:", error);
          setAiSummary("AI summary generation failed or quota exceeded.");
        } finally {
          setSummaryLoading(false);
        }
      }}
    >
      {employee.aisummary ? "Regenerate Summary" : "Generate Summary"}
    </button>
  )}

  <div className="summary">
    {summaryLoading ? (
      <p>Generating AI summary... ⏳</p>
    ) : employee.aisummary || aiSummary ? (
      <div className="ai-summary-markdown">
        {/* <ReactMarkdown>
          {aiSummary || employee.aisummary}
        </ReactMarkdown> */}
      </div>
    ) : (
      <p>No summary available. Click “Generate Summary” to create one.</p>
    )}
  </div>
</div>


          <div className="employee-details-tasks">
             <h4 className="employee-details-tasks-head"><Clock size={24} color="purple" />Tasks</h4>
            <span className="sub-head">{completedtasks?.length} completed , {incompletedtasks?.length} Pending</span>
            <span className="sub-head"><CircleDot size={20} color="red"/>Pending and In Progress</span>
            <div className="incompleted-tasks">
  {incompletedtasks.length > 0 ? (
    incompletedtasks.map((task, i) => (
      <div key={i} className="task-card pending" >
        <div className="task-main">
          <h4 className="task-title">{task.title}</h4>
          <span
            className={`task-status ${
              task.status==="Completed" ? "completed-badge" : "pending-badge"
            }`}
          >
            {task.status}
          </span>
        </div>

        <div className="task-sub">
          <p className="task-project">
            <a href="/" className="project-link">
              {task.linkedProject || "No Project Linked"}
            </a>
          </p>
          <p className="task-dates">
            <Calendar size={14} /> {task.assigneddate} →{" "}
            {new Date(
              new Date(task.assigneddate).getTime() +
                Number(task.duration || 0) * 24 * 60 * 60 * 1000
            ).toISOString().split("T")[0]}
          </p>
        </div>

        <div className="task-details">{task.details}</div>
      </div>
    ))
  ) : (
    <p className="empty-task">No pending tasks 🎉</p>
  )}
</div>

<span className="sub-head">
  <Clock size={16} color="green" /> Completed
</span>
<div className="completed-tasks">
  {completedtasks.length > 0 ? (
    completedtasks.map((task, i) => (
      <div key={i} className="task-card completed" >
        <div className="task-main">
          <h4 className="task-title">{task.title}</h4>
          <span className="completed-badge">Completed</span>
        </div>

        <div className="task-sub">
          <p className="task-project">
            <a href="/" className="project-link">
              {task.linkedProject || "No Project Linked"}
            </a>
          </p>
          <p className="task-dates">
            <Calendar size={14} /> {task.assigneddate} →{" "}
            {new Date(
              new Date(task.assigneddate).getTime() +
                Number(task.duration || 0) * 24 * 60 * 60 * 1000
            ).toISOString().split("T")[0]}
          </p>
        </div>

        <div className="task-details">{task.details}</div>
      </div>
    ))
  ) : (
    <p className="empty-task">No completed tasks yet</p>
  )}
</div>


          </div>
          <div className="employee-details-projects">
            <h4 className="employee-details-tasks-head"><Folder size={24} color="purple" />Projects</h4>
            <span className="sub-head">{projects.length} ongoing initiatives</span>
            <div className="projects-grid">
  {projectsWithEmployees.length > 0 ? (
    projectsWithEmployees.map((project, i) => (
      <div key={i} className="project-card-detailed">
        <div className="project-header">
          <div>
            <h3 className="project-title">{project.title}</h3>
            <p className="project-dates">
              {new Date(project.startDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}{" "}
              –{" "}
              {new Date(project.endDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          <img
            src={
              project.projectLeader?.profilepicture ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="leader"
            className="leader-avatar"
          />
        </div>

        <div className="team-section">
          <p className="team-title">
            <Send size={16} color="#9333EA" /> Team Members
          </p>
          <div className="team-list">
            {project.teamMembers.length > 0 ? (
              project.teamMembers.map((member, j) => (
                <div key={j} className="team-member">
                  <img
                    src={
                      member.profilepicture ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt={member.name}
                    className="team-avatar"
                  />
                  <div>
                    <p className="member-name">{member.name}</p>
                    <p className="member-role">{member.designation}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-members">No members assigned yet.</p>
            )}
          </div>
          <p className="project-lead">
            Led by{" "}
            <span>
              {project.projectLeader?.name || "Unassigned Leader"}
            </span>
          </p>
        </div>
      </div>
    ))
  ) : (
    <p className="empty-projects">No projects assigned yet.</p>
  )}
</div>

          </div>
          <div className="employee-details-dailyupdates">
            <h4 className="employee-details-tasks-head"><Calendar size={24} color="purple" />Daily Updates</h4>
            <span className="sub-head">
  {new Date().toLocaleString("default", { month: "long", year: "numeric" })} activity log
</span>
              <div className="calendar-container">
    <div className="calendar-weekdays">
      {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day) => (
        <div key={day} className="calendar-weekday">{day}</div>
      ))}
    </div>

   <div className="calendar-grid">
  {Array.from(
    { length: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() },
    (_, i) => {
      const date = new Date(new Date().getFullYear(), new Date().getMonth(), i + 1);
      const formatted = date.toISOString().split("T")[0];
      const hasUpdate = employee?.updates?.some(
        (u) => new Date(u.date).toISOString().split("T")[0] === formatted
      );
      const today = new Date();
      const isFuture = date > today;

      return (
        <div
          key={i}
          className={`calendar-day ${
            isFuture ? "day-future" : hasUpdate ? "day-updated" : "day-missed"
          }`}
          onClick={() => {
            if (isFuture) return; // prevent clicking future days
            const update = employee.updates.find(
              (u) => new Date(u.date).toISOString().split("T")[0] === formatted
            );
            if (update) {
              setSelectedUpdate({
                date: formatted,
                projectname: update.projectname,
                text: update.description || "No details provided",
              });
              setShowUpdateModal(true);
            }
          }}
        >
          {i + 1}
        </div>
      );
    }
  )}
</div>

  </div>

  {showUpdateModal && (
    <div className="update-modal">
      <div className="update-modal-content">
        <h4>Update on {selectedUpdate?.date}</h4>
        <p className="p1-name">{selectedUpdate?.projectname}</p>
        <p className="p2-name">{selectedUpdate?.text}</p>
        <button onClick={() => setShowUpdateModal(false)}>Close</button>
      </div>
    </div>
  )}

          </div>
        
        </div>
      </div>
    </div>
    {/* <ScheduleTaskModal
  isOpen={showTaskModal}
  onClose={() => setShowTaskModal(false)}
  employeeName={employee.name}
  taskData={taskData}
  setTaskData={setTaskData}
  projects={projects}
 
/> */}
{/* <SendMailModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  employeeName={employee.name}
  message={message}
  setMessage={setMessage}
  
/> */}

 {showModal && selectedTask && (
  <div className="modal-overlay" onClick={() => setShowModal(false)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>

      <h2 className="modal-title">{selectedTask.title}</h2>

      <p className="modal-description">{selectedTask.details}</p>

      <div className="modal-meta">
        <p><strong>Assigned:</strong> {new Date(selectedTask.assigneddate).toLocaleDateString("en-GB")}</p>
        <p><strong>Linked Project:</strong> {selectedTask.linkedProject}</p>
        <p><strong>Status:</strong> {selectedTask.status}</p>
      </div>

      <div className="modal-actions">
        <label className="status-label">Change Status:</label>
       <select
  className="status-select"
  value={selectedTask.status}
  onChange={(e) => {
    const newStatus = e.target.value;

    // Update modal instantly (UI responsiveness)
    setSelectedTask((prev) => ({ ...prev, status: newStatus }));

    // Update backend + main task list
    
  }}
>
  <option value="Pending">Pending</option>
  <option value="In Progress">In Progress</option>
  <option value="Completed">Completed</option>
</select>

      </div>

      <button className="close-modal" onClick={() =>{ setShowModal(false)
          window.location.reload();
      }}>
        Change Status
      </button>

    </div>
  </div>
)}
    </>
  );
};

export default EmployeeDetails;
