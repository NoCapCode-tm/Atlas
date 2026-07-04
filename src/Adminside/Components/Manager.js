import React, { useEffect, useMemo, useState } from "react";
import styles from "../CSS/manager.module.css";
import {
  Search,
  Filter,
  Users,
  UserRoundCog,
  FolderOpen,
  MoreVertical,
  ChevronRight,
  ChevronLeft,
  User,
  X
} from "lucide-react";
import { toast } from 'react-toastify';
import axios from "axios";

export default function Manager() {

  const [search,setSearch] = useState("");
  const[overlay,setOverlay]=useState("")
  const [projects, setprojects] = useState([]);
    const [employees, setEmployees] = useState([]);
    const[selected,setSelected]=useState()
    const[selectedproject,setSelectedproject]=useState()
    const[employee,setemployee]=useState()
    const[reporting,setreporting]=useState()
   const[loading,setLoading]=useState("false")

    useEffect(() => {
        axios.get(`https://b-atlas-ncc.onrender.com/api/v1/admin/getalluser`, { withCredentials: true })
          .then(res => setEmployees(res.data.message || []));
      }, []);

     useEffect(() => {
    axios.get(`https://b-atlas-ncc.onrender.com/api/v1/admin/getallproject`)
      .then(res => setprojects(res.data.message || []));
  }, []);

  const handeladdu=async()=>{
    try {
      setLoading(true)
      const response = await axios.put("https://b-atlas-ncc.onrender.com/api/v1/admin/updateemployee",{
        id:employee,
        manager:reporting
      },{withCredentials:true})
    
      toast.success("Manager Assigned Successfully")
      setreporting()
      setemployee()
      setOverlay("")
    } catch (error) {
      console.log("Something went wrong",error)
      toast.success("Manager Cannot be Assigned")
    }finally{
      setLoading(false)
    }
  }


 const managers = employees.filter((f)=>f?.designation?.name === "Manager")

  const teams = [
  {
    name: "Engineering Team",
    members: 10,
  },
  {
    name: "Designing Team",
    members: 10,
  },
  {
    name: "Marketing Team",
    members: 10,
  },
];

  const filteredManagers = useMemo(()=>{

      return managers.filter(manager=>
      manager.name
      .toLowerCase()
      .includes(search.toLowerCase()));

  },[search]);

  return (
<>
<div className={styles.container}>

<div className={styles.header}>

<div>

<h1>Manager Mapping</h1>

<p>
Assign or update reporting managers and view team hierarchy
</p>

</div>

<button className={styles.assignBtn} onClick={()=>setOverlay('assignmanager')}>
Assign New Manager
</button>

</div>

<div className={styles.kpiGrid}>

<div className={styles.kpiCard}>

<div className={styles.kpiTop}>

<span>Total Managers</span>

<UserRoundCog size={20}/>

</div>

<h2>{managers.length}</h2>

</div>

<div className={styles.kpiCard}>

<div className={styles.kpiTop}>

<span>Total Member</span>

<Users size={20}/>

</div>

<h2>{employees.length}</h2>

</div>

<div className={styles.kpiCard}>

<div className={styles.kpiTop}>

<span>Total Projects</span>

<FolderOpen size={20}/>

</div>

<h2>{projects.length}</h2>

</div>

</div>

<div className={styles.tableWrapper}>

<div className={styles.toolbar}>

<div className={styles.searchBox}>

<Search size={18}/>

<input
placeholder="Search Employees"
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

</div>

<button className={styles.filterBtn}>

<Filter size={15}/>

Filters

</button>

</div>
<div className={styles.desktopview}>
<table className={styles.table}>

<thead>

<tr>

<th>Managers</th>

<th>Projects</th>

<th>Members</th>

<th>Action</th>

</tr>

</thead>

<tbody>

{
managers.map((manager)=>{

  const project = projects.filter((p)=>p.manager === manager._id)
  const members = employees.filter((m)=>m.managerAssigned === manager._id)
  return(
    <tr key={manager.id}>

<td>

<div className={styles.managerCell}>

<div className={styles.avatar}>
M
</div>

<span>{manager.name}</span>

</div>

</td>

<td>

{project.length}

</td>

<td>

{members.length}

</td>

<td>


<button className={styles.actionBtn}>

<MoreVertical size={18} onClick={()=>{setOverlay((prev) => (prev === `dropdown${manager._id}` ? "" : `dropdown${manager._id}`))}
}/>
<div className={overlay === `dropdown${manager._id}` ?styles.dropdown :styles.none}>
   <span className ={styles.first} onClick={()=>{setSelectedproject(project)
    setSelected(manager)
    setOverlay("managerdetails")}}>Change Manager</span>
   <span className ={styles.second}>Remove from Manager</span>
</div>

</button>
</td>

</tr>
  )})
}

</tbody>

</table>
</div>
<div className={styles.mobileView}>
  {managers.map((manager) => {
    const initials = manager.name
      .split(" ")
      .map((n) => n[0])
      .join("");

    const project = projects.filter((p)=>p.manager === manager._id)
  const members = employees.filter((m)=>m.managerAssigned === manager._id)

    return (
      <div className={styles.employeeCard} key={manager._id}>
        {/* Top */}

        <div className={styles.cardTop}>
          <div className={styles.avatar}>
            {initials}
          </div>

          <div className={styles.cardUser}>
            <h3>{manager?.name}</h3>
            <p>{manager?.email}</p>
          </div>
        </div>

        <div className={styles.cardDivider}></div>

        {/* Details */}

        <div className={styles.cardGrid}>
           <div>
            <span className={styles.cardLabel}>Projects</span>
            <h4>{project.length}</h4>
          </div>
          <div>
            <span className={styles.cardLabel}>Teams</span>
            <h4>{members?.length || "NA"}</h4>
          </div>
           <div>
            <span className={styles.cardLabel}>Action</span>
             <button className={styles.actionBtn}>

<MoreVertical size={18} onClick={()=>{setOverlay((prev) => (prev === `dropdown${manager._id}` ? "" : `dropdown${manager._id}`))}
}/>
<div className={overlay === `dropdown${manager._id}` ?styles.dropdown :styles.none}>
   <span className ={styles.first} onClick={()=>{setSelectedproject(project)
    setSelected(manager)
    setOverlay("managerdetails")}}>Change Manager</span>
   <span className ={styles.second}>Remove from Manager</span>
</div>

</button>
          </div>

        

         

          {/* <div>
            <span
              className={`${styles.mobileStatus} ${
                emp?.onboarding?.status === "Completed"
                  ? styles.active
                  : styles.inactive
              }`}
            >
              {emp?.onboarding?.status || "NA"}
            </span>
          </div> */}
        </div>
      </div>
    );
  })}
</div>


<div className={styles.pagination}>

<p>

Showing 1-6 of 20

</p>

<div className={styles.pageButtons}>

<button>{"<"}</button>

<button className={styles.activePage}>
1
</button>

<button>
2
</button>

<button>
3
</button>

<span>......</span>

<button>
6
</button>

<button>{">"}</button>

</div>

</div>

</div>

</div>

{overlay==="managerdetails"&&(
   <div className={styles.overlay} onClick={() => setOverlay(false)}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}

        <div className={styles.header}>
          <div className={styles.leftHeader}>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatar1}>M</div>
              <span className={styles.online}></span>
            </div>

            <div>
              <div className={styles.titleRow}>
                <h1>{selected?.name}</h1>

                <span className={styles.activeBadge}>Active</span>
              </div>

              <p>Reports to Senior Manager</p>
            </div>
          </div>

          <button className={styles.editBtn}>
            Edit Manager
          </button>
        </div>

        {/* Cards */}

        <div className={styles.cardsGrid}>
          {/* Teams */}

          {/* <div className={styles.card}>
            <div className={styles.cardHeader}>
              Teams
            </div>

            {teams.map((team, index) => (
              <div
                key={index}
                className={styles.cardRow}
              >
                <span>{team.name}</span>

                <div className={styles.memberCount}>
                  <Users size={17} />

                  {team.members}
                </div>
              </div>
            ))}
          </div> */}

          {/* Projects */}

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              Projects
            </div>
             
            {selectedproject.map((project, index) => {
              console.log(selectedproject)
              return (
              <div
                key={index}
                className={styles.cardRow}
              >
                <div>
                  <h3>{project?.projectname}</h3>

                 <small>
  Due: {new Date(project?.timeline?.endDate).toLocaleString()}
</small>
                </div>

                <div className={styles.memberCount}>
                  <User size={17} />

                  {project?.team?.assignedMembers?.length}
                </div>
              </div>
)})}
          </div>
        </div>

        {/* Table */}

        <div className={styles.tableCard}>
          <table>
            <thead>
              <tr>
                <th>Members</th>
                <th>Team</th>
                <th>Tasks</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

      <tbody>
  {selectedproject.flatMap((project) =>
    (project.team?.assignedMembers || []).map((assigned) => {
      const member = employees.find(
        (emp) => emp._id === assigned.userId
      );

      if (!member) return null;

      return (
        <tr key={assigned._id}>
          <td>
            <div className={styles.memberCell}>
              <div className={styles.memberAvatar}>
                {member.name?.charAt(0)}
              </div>

              <span>{member.name}</span>
            </div>
          </td>

          <td>{member?.role}</td>

          <td>{member.Tasks?.length || 0}</td>

          <td>
            <span
              className={`${styles.status} ${
                styles[member.status?.toLowerCase()]
              }`}
            >
              {member.status}
            </span>
          </td>

          <td>
            <MoreVertical
              size={18}
              className={styles.more}
            />
          </td>
        </tr>
      );
    })
  )}
</tbody>
          </table>

          <div className={styles.footer}>
            <span>
              Showing 1-4 of 24
            </span>

            <div className={styles.pagination}>
              <button>
                <ChevronLeft size={18} />
              </button>

              <button
                className={styles.activePage}
              >
                1
              </button>

              <button>2</button>

              <button>3</button>

              <span>......</span>

              <button>5</button>

              <button>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
)}

{overlay==="assignmanager" && (
  <div
    className={styles.overlay1}
    onClick={() => setOverlay(false)}
  >
    <div
      className={styles.modal1}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close */}

      <button
        className={styles.closeBtn}
        onClick={() => setOverlay(false)}
      >
        <X size={28} strokeWidth={2} />
      </button>

      {/* Header */}

      <div className={styles.header1}>
        <h2>Assign Manager</h2>

        <p>
          Choose how you'd like to assign a manager
        </p>
      </div>

      {/* Role */}

      <div className={styles.fullField}>
        <label>
          Select Employee <span>*</span>
        </label>
           <select
            value={employee}
            onChange={(e) =>
              setemployee(e.target.value)
            }
          >
             <option value="">
              Select
            </option>
            {employees.map((e)=>{
              return (
                  <option key={e._id} value={e._id}>{e?.name}</option>
              )
            })}
          </select>
        
      </div>

       <div className={styles.fullField}>
        <label>
          Select Manager <span>*</span>
        </label>
           <select
            value={reporting}
            onChange={(e) =>
              setreporting(e.target.value)
            }
          >
             <option value="">
              Select
            </option>
            {managers.map((e)=>{
              return (
                  <option key={e._id} value={e._id}>{e?.name}</option>
              )
            })}
          </select>
        
      </div>

      {/* Footer */}

      <div className={styles.footer}>
        <p>
          <span>*</span> Required fields
        </p>

        <button
          className={styles.addBtn}
          onClick={handeladdu}
        >
          {loading=== true
            ? "Assigning..."
            : "Assign Manager"}
        </button>
      </div>
    </div>
  </div>
)}

</>

);

}