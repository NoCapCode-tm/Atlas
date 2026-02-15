import React, { useEffect, useRef, useState } from 'react';
import styles from "../CSS/ProjectDetailspage.module.css";
import {  useNavigate, useParams } from "react-router";
import axios from "axios";
import { Plus, Edit2, MoreVertical, Link, X, Image, File, LinkIcon } from "lucide-react";
import { toast } from 'react-toastify';
import ProgressDonut from './ProgressDonut';



const ProjectDetailspage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
   const [projectName, setProjectName] = useState("");
  const [managerId, setManagerId] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [team, setTeam] = useState([]); 
  const navigate = useNavigate()
   const roleSelectRef = useRef(null);
   const [showIssueModal, setShowIssueModal] = useState(false);

const [issueTitle, setIssueTitle] = useState("");
const [issueDescription, setIssueDescription] = useState("");
const [issueCategory, setIssueCategory] = useState("");
const [issueSeverity, setIssueSeverity] = useState("");
const [showIssueDetail, setShowIssueDetail] = useState(false);
const [selectedRisk, setSelectedRisk] = useState(null);

const issueCategories = [
  "Frontend",
  "Backend",
  "Deployement",
  "Access",
  "Others",
];

const issueSeverities = ["Low", "Medium", "High", "Critical"];


  const roles = [
    "Frontend Developer",
    "Backend Developer",
    "UI/UX Designer",
    "QA Tester",
    "DevOps",
    "Product Manager",
  ];


useEffect(() => {
  if (!showModal || !project) return;

  // basic fields
  setProjectName(project.projectname || "");
  setDescription(project.description || "");

  // manager
  setManagerId(project.manager || "");

  // dates (YYYY-MM-DD format)
  if (project.timeline?.startDate) {
    setStartDate(
      new Date(project.timeline.startDate).toISOString().slice(0, 10)
    );
  }

  if (project.timeline?.endDate) {
    setEndDate(
      new Date(project.timeline.endDate).toISOString().slice(0, 10)
    );
  }

  // team auto fill
  if (Array.isArray(project.team?.assignedMembers)) {
    setTeam(project.team.assignedMembers);
  } else {
    setTeam([]);
  }

  // reset selectors
  setSelectedMember("");
  setSelectedRole("");
}, [showModal, project]);



  useEffect(() => {
    (async () => {
      console.log(id)
      try {
      
        const response = await axios.get(
          `https://atlasbackend-px53.onrender.com/api/v1/admin/getprojectdetails/${id}`,
          { withCredentials: true }
        );
        console.log("Project Details",response.data.message)
        setProject(response.data.message);
      } catch (error) {
        console.log("Something Went Wrong", error.message);
      }
    })();
  }, []);

  useEffect(() => {
    const fetchemployees = async () => {
      try {
        const response = await axios.get(
          `https://atlasbackend-px53.onrender.com/api/v1/admin/getalluser`,
          { withCredentials: true }
        );

        console.log(response.data);
        console.log(response.data.message[0].status)
        setEmployees(response.data.message); 
      } catch (error) {
        console.log("Error fetching employees:", error.message);
      }
    };

    fetchemployees();
  }, [project]);

  useEffect(() => {
    if (selectedMember && roleSelectRef.current) {
      roleSelectRef.current.focus();
    }
  }, [selectedMember]);

  const addPair = () => {
    if (!selectedMember || !selectedRole) return;
    
    if (team.some((t) => t.userId === selectedMember)) {
      setSelectedMember("");
      setSelectedRole("");
      return;
    }
    setTeam((t) => [...t, { userId: selectedMember, role: selectedRole }]);
    setSelectedMember("");
    setSelectedRole("");
  };

  const removePair = (userId) => {
    setTeam((t) => t.filter((x) => x.userId !== userId));
  };

 
  const pickEmployeeQuick = (userId) => {
    if (team.some((t) => t.userId === userId)) return; 
    setSelectedMember(userId);
    setTimeout(() => {
      if (roleSelectRef.current) roleSelectRef.current.focus();
    }, 10);
  };

  const onSkillClick = (skill) => {
    if (!selectedMember) return;

    const found = roles.find((r) =>
      r.toLowerCase().includes(skill.toLowerCase())
    );
    setSelectedRole(found || skill);

    setTimeout(addPair, 250);
  };

  const handleCreateProject = async () => {
    
    const payload = {
      projectId:project._id,
      projectname: projectName,
      description,
      startdate:startDate,
      enddate:endDate,
      manager: managerId || null,
      team: team,
      progress: { percent: 0, status: "Pending" },
      risks: [],
    };

    try {
      setLoadingUsers(true)
      console.log(payload)
      const res = await axios.put(
        `https://atlasbackend-px53.onrender.com/api/v1/admin/updateproject`,
        payload,
        { withCredentials: true }
      );
      console.log("Created:", res.data.message);
      toast.success("Project Edited Successfully")
      navigate("/projects")
      window.location.reload()

    } catch (err) {
      console.error("Create project failed", err);
      toast.error("Create failed - check console");
    }finally{
      setLoadingUsers(false)
    }
  };

  // helpers
  const managers = employees.filter(
    (e) => e.designation.name === "Manager" 
  );

  const isSelected = (userId) => team.some((t) => t.userId === userId);




  const overdue = (risk) =>{
     if (risk.status === "Resolved") return "Resolved";

  const raised = new Date(risk.raisedon).getTime();
  const now = Date.now();

  const diffDays = Math.floor((now - raised) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "No Overdue";

  return `${diffDays} days overdue`;
  }

  if (!project) return <div className={styles.loading}>Loading...</div>;

  const progress = project?.progress?.percent || 0;

  return (
    <>
    <div className={styles.page}>

      {/* ================= HEADER CARD ================= */}
      <div className={`${styles.card} ${styles.headerCard}`}>
        <div className={styles.headerTop}>
          <div className={styles.headerLeft}>
            <h1>{project?.projectname}</h1>
            <span className={styles.badgeActive}>Active</span>
            <span className={styles.badgeProgress}>In Progress</span>
          </div>

          <div className={styles.headerRight}>
            <button className={styles.btnPrimary} onClick={()=>setShowModal(true)}>
              <Edit2 size={14} /> Edit Project
            </button>
          </div>
        </div>
        <div className={styles.details}>
          {project.description}
        </div>

        <div className={styles.metaRow}>
          <span>Started:
  {project?.timeline?.startDate
    ? new Date(project.timeline.startDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—"}</span>
          <span>Deadline: {project?.timeline?.startDate
    ? new Date(project.timeline.endDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—"}</span>
          <span>Client: TechCorp Solutions</span>
        </div>

        <div className={styles.progressRow}>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} />
          </div>
          <span className={styles.progressText}>78% Complete</span>
        </div>
      </div>

      {/* ================= ROW 2 ================= */}
      <div className={styles.row}>

        {/* TEAM MEMBERS */}
        <div className={styles.overloaddependency}>
        <div className={`${styles.card} ${styles.left}`}>
          <div className={styles.cardHeader}>
            <h3>Team Members</h3>
            <span className={styles.link}>View All</span>
          </div>
          <div className={styles.allmembers}>

          {project?.team?.assignedMembers?.map((t, i) => {
           const memberdetails = employees.find(e=>e._id === t.userId)

           return(
            <div key={i} className={styles.memberRow}>
              <div className={styles.memberLeft}>
                <div className={styles.avatar}>
                  <img src = {memberdetails?.profilepicture || `https://i.pravatar.cc/40?u=${t.userId}`} alt="/" height="100%" width="100%"/>
                  </div>
                <div>
                  <p className={styles.name}>{memberdetails?.name}</p>
                  <p className={styles.role}>{t?.role}</p>
                </div>
              </div>

              <div className={styles.memberRight}>
                <div>
                  <p className={styles.small}>Daily Work Time</p>
                  <p>9 hours</p>
                </div>
                <div>
                  <p className={styles.small}>Workload</p>
                  <p>78%</p>
                </div>
              </div>
            </div>
)})}
</div>
        </div>
         <div className={`${styles.card} ${styles.left1}`}>
          <h3>Work Overload Analysis</h3>
           <div className={styles.tablewrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Team Member</th>
                <th>Daily Work Time</th>
                <th>Workload</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {project?.team?.assignedMembers.map((t,index)=>{
                 const employee = employees.find(e => e._id === t.userId)

                 return(
                 <tr key={index}>
                <td><div className ={styles.colo}>{employee?.name} <span className={styles.role}>{t?.role}</span></div></td>
                <td>9 hours</td>
                <td>78%</td>
                <td><span className={styles.light}>Light</span></td>
              </tr>
              )})}
              
              {/* <tr>
                <td>Aishwarya</td>
                <td>9 hours</td>
                <td>78%</td>
                <td><span className={styles.moderate}>Moderate</span></td>
              </tr>
              <tr>
                <td>Ziya</td>
                <td>9 hours</td>
                <td>78%</td>
                <td><span className={styles.high}>High</span></td>
              </tr> */}
            </tbody>
          </table>
          </div>
        </div>
        </div>
         <div className={styles.overloaddependency1}>
        <div className={`${styles.card} ${styles.right1}`}>
          <div className={styles.cardHeader}>
            <h3>Active Issues</h3>
            <div className={styles.issueBtns}>
              <button className={styles.btnGhostSmall} onClick={()=>{setShowIssueModal(true)}}>Add Issue</button>
            </div>
          </div>

          <p className={styles.issueCount}>6 issues found</p>

          {project?.risks.map((r, i) => {
               const assign = employees.find(e => e._id === r.raisedby)
            return (
            <div key={i} className={styles.issueCard} onClick={()=>{
              setSelectedRisk(r)
              setShowIssueDetail(true)}}>
              <div className={styles.issueTop}>
                <div className={styles.bothtype}>
                <span className={`${styles.severity1} ${styles[r?.severity]}`}>{r?.severity}</span>
                <span className={styles.overdue}>2 days overdue</span>
                </div>
                <span className={styles.raised}>Raised</span>
              </div>

              <p className={styles.issueTitle}>{r?.title}</p>
              <p className={styles.issueMeta}>#3542Dx · {r?.category} · {project?.timeline?.startDate
    ? new Date(r?.raisedon).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—"}</p>

              <div className={styles.issueUser}>
                <div className={styles.avatar}>
                  <img src = {assign?.profilepicture || `https://i.pravatar.cc/40?u=${r?.raisedby}`} alt="/" height="100%" width="100%"/>
                </div>
                <span>{assign?.name}</span>
              </div>
            </div>
          )})}
        </div>
          <div className={`${styles.card} ${styles.right}`}>
          <h3>Project Assets</h3>

          {/* <div className={styles.donut}>
            <span>{progress}%</span>
            <p>Complete</p>
          </div> */}

          <div className={styles.assetRow}>
            <div className={styles.assetBox}>
              <Image color="rgba(152, 16, 250, 1)" size={28}/>
              <p>Images</p>
              <span>3 files</span>
            </div>
            <div className={styles.assetBox}>
              <File color="rgba(152, 16, 250, 1)"  size={28}/>
              <p>Files</p>
              <span>Logo</span>
            </div>
          </div>
        </div>
        <div className={`${styles.card} ${styles.dep}`}>
        <h3>Dependencies</h3>
        <div className={styles.depItem}><LinkIcon color="rgba(130, 0, 219, 1)" size={16}/>www.xyz.com</div>
        <div className={styles.depItem}><LinkIcon color="rgba(130, 0, 219, 1)" size={16}/>https://xyz.com</div>
        <div className={styles.depItem}><LinkIcon color="rgba(130, 0, 219, 1)" size={16}/>http://xyz.com</div>
      </div>
        </div>
      </div>
        
       
       

      
      </div>

      




      {showModal && (
         <div className={styles.overlay} onClick={()=>{setShowModal(false)}}>
      <div className={styles.modalWrap} onClick={(e) => e.stopPropagation()}>
        {/* LEFT - MAIN FORM */}
        <div className={styles.left2}>
          <h3 className={styles.formTitle}>Update project :</h3>

          <label className={styles.label}>Project Name :</label>
          <input
            className={styles.input}
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Project Name"
          />

          <label className={styles.label}>Project Manager :</label>
          <select
            className={styles.input}
            value={managerId}
            onChange={(e) => setManagerId(e.target.value)}
          >
            <option value="">Select Manager</option>
            {managers.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name} ({m.designation.name})
              </option>
            ))}
          </select>

          <div className={styles.row}>
            <div style={{ flex: 1 }}>
              <label className={styles.label}>Project Duration :</label>
              <input
                type="date"
                className={styles.input}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label className={styles.label}>&nbsp;</label>
              <input
                type="date"
                className={styles.input}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div style={{ flex: 1 }}>
              <label className={styles.label}>Assign Team Members :</label>
              <select
                className={styles.input}
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
              >
                <option value="">Select employee</option>
                {employees.map((emp) => (
                  <option
                    key={emp._id}
                    value={emp._id}
                    disabled={isSelected(emp._id)}
                  >
                    {emp.name} — {emp.designation.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ width: 8 }} />

            <div style={{ flex: 1 }}>
              <label className={styles.label}>Role :</label>
              <select
                ref={roleSelectRef}
                className={styles.input}
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                disabled={!selectedMember}
              >
                <option value="">Select role</option>
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className={styles.addRow}>
            <button
              className={styles.addBtn}
              onClick={addPair}
              disabled={!selectedMember || !selectedRole}
            >
              Add
            </button>
          </div>

          <label className={styles.label}>Description :</label>
          <textarea
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Project description..."
          />

          {/* Selected chips */}
          <div className={styles.selectedWrap}>
            {team.map((t) => {
              const emp = employees.find((e) => e._id === t.userId);
              return (
                <div key={t.userId} className={styles.chip}>
                  <img
                    src={emp?.profilepicture || `https://i.pravatar.cc/40?u=${t.userId}`}
                    alt=""
                    className={styles.chipAvatar}
                  />
                  <div className={styles.chipText}>
                    <div className={styles.chipName}>{emp?.name || "Unknown"}</div>
                    <div className={styles.chipRole}>{t.role}</div>
                  </div>
                  <button
                    className={styles.chipRemove}
                    onClick={() => removePair(t.userId)}
                    aria-label="remove"
                  >
                    <X/>
                  </button>
                </div>
              );
            })}
          </div>

          <div className={styles.formFooter}>
            <button className={styles.cancelBtn} onClick={()=>{setShowModal(false)}}>
              Cancel
            </button>
            <button className={styles.createBtn} onClick={handleCreateProject}>
              {loadingUsers?"Updating...":"Update"}
            </button>
          </div>
        </div>

        {/* RIGHT - employee + skills */}
        <div className={styles.right2}>
          <div className={styles.searchWrap}>
            <input className={styles.search} placeholder="Search..." />
          </div>

          <div className={styles.employeesList}>
            {loadingUsers ? (
              <div className={styles.loading}>Loading employees...</div>
            ) : (
              employees.map((emp) => (
                <div
                  key={emp._id}
                  className={`${styles.empCard} ${isSelected(emp._id) ? styles.disabled : ""}`}
                  onClick={() => pickEmployeeQuick(emp._id)}
                >
                  <img
                    src={emp.profilepicture || `https://i.pravatar.cc/40?u=${emp._id}`}
                    alt=""
                    className={styles.empAvatar}
                  />
                  <div className={styles.empInfo}>
                    <div className={styles.empName}>{emp.name}</div>
                    <div className={styles.empRoleSmall}>{emp.designation.name}</div>
                    {/* show skills */}
                    {/* <div className={styles.skillRow}>
                      {staticSkills.slice(0, 4).map((s) => (
                        <button
                          key={s}
                          className={styles.skillTag}
                          onClick={(ev) => {
                            ev.stopPropagation();
                            // set member if not set
                            if (!selectedMember) setSelectedMember(emp._id);
                            onSkillClick(s);
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div> */}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* bottom simple selected summary with custom scrollbar */}
          <div className={styles.selectedPanel}>
            <div className={styles.selectedTitle}>Selected</div>
            <div className={styles.selectedScroll}>
              {team.map((t) => {
                const emp = employees.find((e) => e._id === t.userId);
                return (
                  <div className={styles.selectedRow} key={t.userId}>
                    <img
                      src={emp?.profilepicture || `https://i.pravatar.cc/40?u=${t.userId}`}
                      alt=""
                      className={styles.smallAvatar}
                    />
                    <div className={styles.selectedName}>{emp?.name || "---"}</div>
                    <button
                      className={styles.smallRemove}
                      onClick={() => removePair(t.userId)}
                    >
                      <X/>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
    )}

    {showIssueModal && (
  <div className={styles.overlay} onClick={() => setShowIssueModal(false)}>
    <div className={styles.issueModal} onClick={(e) => e.stopPropagation()}>
      <button
        className={styles.closeBtn}
        onClick={() => setShowIssueModal(false)}
      >
      </button>

      <h2 className={styles.issueTitle}>Add New Issue</h2>

      <label className={styles.label}>Issue Title *</label>
      <input
        className={styles.input}
        placeholder="Enter issue title"
        value={issueTitle}
        onChange={(e) => setIssueTitle(e.target.value)}
      />

      <label className={styles.label}>Description</label>
      <textarea
        className={styles.textarea}
        placeholder="Describe the issue in detail..."
        value={issueDescription}
        onChange={(e) => setIssueDescription(e.target.value)}
      />

      <div className={styles.row}>
        <div style={{ flex: 1 }}>
          <label className={styles.label}>Category *</label>
          <select
            className={styles.input}
            value={issueCategory}
            onChange={(e) => setIssueCategory(e.target.value)}
          >
            <option value="">Select category</option>
            {issueCategories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div style={{ width: 12 }} />

        <div style={{ flex: 1 }}>
          <label className={styles.label}>Severity *</label>
          <select
            className={styles.input}
            value={issueSeverity}
            onChange={(e) => setIssueSeverity(e.target.value)}
          >
            <option value="">Select severity</option>
            {issueSeverities.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.issueFooter}>
        <button
          className={styles.primary}
          onClick={async() => {
            if (!issueTitle || !issueCategory || !issueSeverity) {
              toast.error("Please fill all required fields");
              return;
            }
            console.log({
              issueTitle,
              issueDescription,
              issueCategory,
              issueSeverity,
            });

            try {
              const response = await axios.post(`https://atlasbackend-px53.onrender.com/api/v1/admin/createissue`,{
                title:issueTitle,
                details:issueDescription,
                category:issueCategory,
                severity:issueSeverity,
                id:id
              },{withCredentials:true})
  
              toast.success("Issue Created");
              setShowIssueModal(false);
              window.location.reload()
            } catch (error) {
              toast.error("Issue cannot be Raised")
            }
          }}
        >
          Create Issue
        </button>

        <button
          className={styles.secondary}
          onClick={() => setShowIssueModal(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}


{showIssueDetail && selectedRisk && (
  <div className={styles.overlay} onClick={() => setShowIssueDetail(false)}>
    <div className={styles.issueDetailModal} onClick={(e) => e.stopPropagation()}>
        <X size={22} onClick={() => setShowIssueDetail(false)}/>
      

      <div className={styles.issueHeaderRow}>
        <h2>{selectedRisk.title}</h2>

        <div className={styles.issueBadges}>
          <span className={`${styles.severity} ${styles[selectedRisk.severity?.toLowerCase()]}`}>
            {selectedRisk.severity}
          </span>
          <span className={styles.overdueBadge}>
            {overdue(selectedRisk)}
          </span>
        </div>
      </div>

      <div className={styles.issueMetaBox}>
        <div>
          <span>Issue ID</span>
          <strong>{selectedRisk._id?.slice(-6)}</strong>
        </div>

        <div>
          <span>Category</span>
          <strong>{selectedRisk.category}</strong>
        </div>

        <div>
          <span>Reported</span>
          <strong>
            {new Date(selectedRisk.raisedon).toLocaleDateString()}
          </strong>
        </div>
      </div>

      <div className={styles.raisedBy}>
        {(() => {
          const emp = employees.find(
            (e) => e._id === selectedRisk.raisedby
          );
          return (
            <>
              <img
                src={emp?.profilepicture}
                className={styles.avatar}
                alt=""
              />
              <div>
                <p className={styles.name}>{emp?.name || "No User"}</p>
                <p className={styles.role}>
                  {emp?.designation?.name || "No Role Assigned"}
                </p>
              </div>
            </>
          );
        })()}
      </div>

      <label className={styles.label}>Description</label>
      <textarea
        className={styles.textarea}
        value={selectedRisk.details}
        readOnly
      />

      <div className={styles.footerRight}>
        <button
          className={styles.primary}
          onClick={() => setShowIssueDetail(false)}
        >
          Done
        </button>
      </div>

    </div>
  </div>
)}


    </>
  );
};

export default ProjectDetailspage;
