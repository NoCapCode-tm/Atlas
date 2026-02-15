import React, { useEffect, useMemo, useState } from "react";

import styles from "../CSS/employees.module.css";
import {
  Search,
  Filter,
  ChevronDown,
  MoreVertical,
  UserPlus,
  X,
  ChevronUp,
} from "lucide-react";
import axios from "axios";
import { useNavigate ,useLocation} from "react-router";
import { toast } from "react-toastify";

function CustomDropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label || label;

  return (
    <div className={styles.dropdownWrapper}>
      <div
        className={`${styles.dropdownHeader} ${open ? styles.activeDrop : ""}`}
        onClick={() => setOpen(!open)}
      >
        {selectedLabel}
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>

      {open && (
        <div className={styles.dropdownList}>
          {options.map((opt, i) => (
            <div
              key={i}
              className={styles.dropdownItem}
              onClick={() => {
                onChange(opt.value);   // ✅ ID save
                setOpen(false);
              }}
            >
              {opt.label}             {/* ✅ Name show */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



function EmployeePage() {
  const navigate = useNavigate();
  const location = useLocation();


  const [employees, setEmployees] = useState([]);
  const [overlay, setoverlay] = useState(false);

 const [firstName, setFirstName] = useState("");
 const [lastName, setLastName] = useState("");


 
   
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [onboardingstatus, setonboardingstatus] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const[designation,setDesignation]=useState("")
  const[start,setStart]=useState("")
  const[end,setend]=useState("")
  const[workmode,setworkmode]=useState("")
  const[department,setdepartment]=useState("")
  const [search, setSearch] = useState("");
   const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");

  const [designationFilter, setDesignationFilter] = useState("All Employees");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [roleFilter, setRoleFilter] = useState("All Roles");

  const [showDesignationDrop, setShowDesignationDrop] = useState(false);
  const [showStatusDrop, setShowStatusDrop] = useState(false);
  const [showRoleDrop, setShowRoleDrop] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;
  const [editOverlay, setEditOverlay] = useState(false);
const [selectedEmployee, setSelectedEmployee] = useState(null);
const [loadingData, setLoadingData] = useState(true);

const[manager,setManager]=useState("")
 const fullName = `${firstName} ${lastName}`.trim();


  const statusOptions = [
    "Onboarding",
    "Paid",
    "Unpaid",
    "Full Time",
    "Contractual"
  ];
  const statusOptionsFormatted = statusOptions.map(s => ({
  label: s,
  value: s
}));
const onboardingOptions = [
  { label: "Incomplete", value: "Incomplete" },
  { label: "In-Progress", value: "In-Progress" },
  { label: "Completed", value: "Completed" },
];




  const roleOptions = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "QA",
    "UI/UX Designer",
    "Devops",
    "Manager"
  ];
  const roleOptionsFormatted = roleOptions.map(r => ({
  label: r,
  value: r
}));
useEffect(() => {
  if (location.state?.status) {
    setStatusFilter(location.state.status);
    setCurrentPage(1);
  }
}, [location.state]);



  const handleManager = useMemo(() => {
  return employees
    .filter(emp => emp.designation?.name === "Manager")
    .map(emp => ({
      label: emp.name,
      value: emp._id
    }));
}, [employees]);

  const handleEdit = (emp) => {
  setSelectedEmployee(emp);
  setManager(emp?.managerAssigned?._id || "");
  setonboardingstatus(emp?.onboarding?.status || "");
  setRole(emp.role || "");
  setStatus(emp.status || "");
  setStart(emp.startedAt || "")
  setend(emp.endAt ||"")
  setDesignation(emp.designation.name || "")
  setworkmode(emp.workdetails.mode || "")
  setdepartment(emp.department || "")
  setEditOverlay(true);
};

const handleUpdate = async () => {
  try {
    setLoading(true);
  
    await axios.put(
      `https://atlasbackend-px53.onrender.com/api/v1/admin/updateemployee`,
      { id:selectedEmployee._id,manager,onboardingstatus, role, status ,workmode,start,end,department,designation },
      { withCredentials: true }
    );
    toast.success("Employee Updated Successfully");
    setEditOverlay(false);
    window.location.reload();
  } catch {
    toast.error("Update Failed");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    const fetchEmployees = async () => {
      const res = await axios.get(
        `https://atlasbackend-px53.onrender.com/api/v1/admin/getalluser`,
        { withCredentials: true }
      );
      setEmployees(res.data.message || []);
       setLoadingData(false);
    };
    fetchEmployees();
  }, []);

  const designationOptions = [
  { label: "Manager", value: "Manager" },
  { label: "Human Resource", value: "Human Resource" },
  { label: "Intern", value: "Intern" },
  { label: "Administrator", value: "Administrator" },
  { label: "Employee", value: "Employee" }
];

const workModeOptions = [
  { label: "Remote", value: "Remote" },
  { label: "Onsite", value: "OnSite" },
  { label: "Hybrid", value: "Hybrid" },
];

const departmentOptions = [
  { label: "Engineering", value: "Engineering" },
  { label: "Designing", value: "Designing" },
  { label: "Marketing", value: "Marketing" },
  { label: "Sales", value: "Sales" },
  { label: "Operations", value: "Operations"},
  { label: "Finance", value: "Finance" },
  { label: "Human Resource", value: "Human Resource" },
  { label: "Other", value: "Other" },
];


  const handleaddu = async () => {
    try {
      setLoading(true);
      await axios.post(
        `https://atlasbackend-px53.onrender.com/api/v1/admin/addemployee`,
        { name:fullName, email:email, password:password, dob:dob,gender:gender },
        { withCredentials: true }
      );
      
      setoverlay(false);
      toast.success("Employees Added Successfully");
      window.location.reload()
    } catch {
      toast.error("Something Went Wrong");
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase());

      const matchesDesignation =
        designationFilter === "All Employees" ||
        (designationFilter === "All HRs" &&
          emp.designation?.name === "HR") ||
        (designationFilter === "All Admins" &&
          emp.designation?.name === "admin");

      const matchesStatus =
        statusFilter === "All Status" || emp.status === statusFilter;

      const matchesRole =
        roleFilter === "All Roles" || emp.role === roleFilter;

      return (
        matchesSearch &&
        matchesDesignation &&
        matchesStatus &&
        matchesRole
      );
    });
  }, [
    employees,
    search,
    designationFilter,
    statusFilter,
    roleFilter,
  ]);

  const totalPages = Math.ceil(filteredEmployees.length / perPage);

  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const mapStatus = (status) => {
    if (!status) return "";
    if (status.includes("Active")) return "active";
    if (status === "Inactive") return "inactive";
    if (status === "Onboarding") return "onboarding";
    return "";
  };

  return (
    <>
      <div className={styles.employeespage}>
        <div className={styles.topbar}>
          <div>
            <h2 className={styles.title}>Employees</h2>
            <p className={styles.subtitle}>
              Manage your team members and their details
            </p>
          </div>

          <button
            className={styles.addbtn}
            onClick={() => setoverlay(true)}
          >
            <UserPlus size={18} /> Add Employee
          </button>
        </div>

        <div className={styles.filteremptable}>
          <div className={styles.filterbox}>
            <div className={styles.searchbar}>
              <Search size={18} />
              <input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div style={{width:"15%", position: "relative" }}>
              <button
                className={styles.filterbtn1}
                onClick={() => {
                  setShowDesignationDrop((p) => !p);
                  setShowStatusDrop(false);
                  setShowRoleDrop(false);
                }}
              >
                {designationFilter} <ChevronDown size={16} />
              </button>

              {showDesignationDrop && (
                <div
                  style={{
                    position: "absolute",
                    top: "45px",
                    left: 0,
                    width: "100%",
                    background: "white",
                    borderRadius: "10px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                    zIndex: 100,
                    overflow: "hidden",
                  }}
                >
                  {["All Employees", "All HRs", "All Admins"].map(
                    (opt) => (
                      <div
                        key={opt}
                        className={styles.dropdownItem}
                        onClick={() => {
                          setDesignationFilter(opt);
                          setShowDesignationDrop(false);
                          setCurrentPage(1);
                        }}
                      >
                        {opt}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            <div style={{width:"15%", position: "relative" }}>
              <button
                className={styles.filterbtn1}
                onClick={() => {
                  setShowStatusDrop((p) => !p);
                  setShowDesignationDrop(false);
                  setShowRoleDrop(false);
                }}
              >
                {statusFilter} <ChevronDown size={16} />
              </button>

              {showStatusDrop && (
                <div
                  style={{
                    position: "absolute",
                    top: "45px",
                    left: 0,
                    width: "100%",
                    background: "white",
                    borderRadius: "10px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                    zIndex: 100,
                    overflow: "hidden",
                  }}
                >
                  {statusOptions.map((opt) => (
                    <div
                      key={opt}
                      className={styles.dropdownItem}
                      onClick={() => {
                        setStatusFilter(opt);
                        setShowStatusDrop(false);
                        setCurrentPage(1);
                      }}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ width:"15%",position: "relative" }}>
              <button
                className={styles.filterbtn1}
                onClick={() => {
                  setShowRoleDrop((p) => !p);
                  setShowDesignationDrop(false);
                  setShowStatusDrop(false);
                }}
              >
                {roleFilter} <ChevronDown size={16} />
              </button>

              {showRoleDrop && (
                <div
                  style={{
                    position: "absolute",
                    top: "45px",
                    left: 0,
                    width: "100%",
                    background: "white",
                    borderRadius: "10px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                    zIndex: 100,
                    overflow: "hidden",
                  }}
                >
                  {roleOptions.map((opt) => (
                    <div
                      key={opt}
                      className={styles.dropdownItem}
                      onClick={() => {
                        setRoleFilter(opt);
                        setShowRoleDrop(false);
                        setCurrentPage(1);
                      }}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* <button className={styles.morefilters}>
              <Filter size={16} /> More Filters
            </button> */}
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Manager</th>
                <th>Role</th>
                <th>Status</th>
                <th>Onboarding</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedEmployees.map((emp, i) => {
                const initials = emp.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("");

                return (
                  <tr key={i} >
                    <td>
                      <div className={styles.usercell}>
                        <div className={styles.avatar}>
                          {initials}
                        </div>
                        {emp.name}
                      </div>
                    </td>

                    <td>{emp.email}</td>
                    <td>{employees.find(e => e._id === emp.managerAssigned)?.name || "—"}</td>
                    <td>{emp.role}</td>

                    <td>
                      <span
                        className={`${styles.status} ${
                          styles[mapStatus(emp.status)]
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`${styles.onboarding} ${
                          styles[
                            emp.onboarding?.status
                              ?.replace(" ", "")
                              .toLowerCase()
                          ]
                        }`}
                      >
                        {emp.onboarding?.status}
                      </span>
                    </td>

                    <td>
                      <MoreVertical size={18} className={styles.actionIcon}
                       onClick={() => handleEdit(emp)}/>
                       
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className={styles.pagination}>
            <span>
              Showing {paginatedEmployees.length} of{" "}
              {filteredEmployees.length}
            </span>

            <div className={styles.pagebtns}>
              <button
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((p) => p - 1)
                }
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={
                    currentPage === i + 1
                      ? styles.activepage
                      : ""
                  }
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => p + 1)
                }
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

   {overlay && (
     <div className={styles.overlay} onClick={() => setoverlay(false)}>
       <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
   
         {/* CLOSE */}
         <button className={styles.closeBtn} onClick={() => setoverlay(false)}>
           <X onClick={()=>{setoverlay(false)}}/>
         </button>
   
         {/* TITLE */}
         <div className={styles.titleRow}>
           <div className={styles.line}></div>
           <h2>Add Employee</h2>
           <div className={styles.line}></div>
         </div>
   
         {/* BASIC DETAILS */}
         <div className={styles.section}>
           <p className={styles.sectionTitle}>Basic Details<span style={{color:"red",margin:"0px 5px"}}>*</span>:</p>
   
           <div className={styles.row2}>
             <div className={styles.field}>
               <span>First name</span>
               <input
                 value={firstName}
                 onChange={(e) => setFirstName(e.target.value)}
               />
             </div>
   
             <div className={styles.field}>
               <span>Last name</span>
               <input
                 value={lastName}
                 onChange={(e) => setLastName(e.target.value)}
               />
             </div>
           </div>
   
           <div className={styles.fieldFull}>
             <span>email ID</span>
             <input
               value={email}
               onChange={(e) => setEmail(e.target.value)}
             />
           </div>
   
           <div className={styles.fieldFull}>
             <span>Password</span>
             <input
               type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
             />
           </div>
         </div>
   
         {/* OTHER DETAILS */}
         <div className={styles.section}>
           <p className={styles.sectionTitle}>Other Details<span style={{color:"red",margin:"0px 5px"}}>*</span>:</p>
           {/* <div className={styles.divider}></div> */}
   
           <div className={styles.row2}>
             <div className={styles.field}>
               <span>Date of birth</span>
               <input
                 type="date"
                 value={dob}
                 className={styles.overlaydate}
                 onChange={(e) => setDob(e.target.value)}
               />
             </div>
   
             <div className={styles.field}>
               <span>Gender</span>
               <select
                 value={gender}
                 onChange={(e) => setGender(e.target.value)}
               >
                 <option></option>
                 <option>Male</option>
                 <option>Female</option>
                 <option>Other</option>
               </select>
             </div>
           </div>
         </div>
   
         {/* SAVE */}
         <div className={styles.footer}>
           <button className={styles.saveBtn} onClick={handleaddu}>
             {loading ? "Adding..." : "Save →"}
           </button>
         </div>
   
       </div>
     </div>
   )}

      {editOverlay && (
  <div className={styles.overlay}>
    <div className={styles.editModal}>
      <button
        className={styles.closeBtn}
        onClick={() => setEditOverlay(false)}
      >
        <X size={22} />
      </button>

      <h2 className={styles.title}>Edit Details :</h2>

      <div className={styles.editCard}>
        <div className={styles.editRow}>
          <CustomDropdown
            label="Manager"
            value={manager}
            options={handleManager}
            onChange={setManager}
          />
        </div>

        <div className={styles.editRow}>
          <CustomDropdown
  label="Role"
  value={role}
  options={roleOptionsFormatted}
  onChange={setRole}
/>
        </div>

        <div className={styles.editRow}>
          <CustomDropdown
  label="Status"
  value={status}
  options={statusOptionsFormatted}
  onChange={setStatus}
/>
        </div>

        <div className={styles.editRow}>
          <CustomDropdown
  label="Onboarding Status"
  value={onboardingstatus}
  options={onboardingOptions}
  onChange={setonboardingstatus}
/>
        </div>
        <div className={styles.editRow}>
  <CustomDropdown
    label="Designation"
    value={designation}
    options={designationOptions}
    onChange={setDesignation}
  />
</div>
<div className={styles.editRow}>
  <CustomDropdown
    label="Department"
    value={department}
    options={departmentOptions}
    onChange={setdepartment}
  />
</div>
<div className={styles.editRow}>
  <CustomDropdown
    label="Work Mode"
    value={workmode}
    options={workModeOptions}
    onChange={setworkmode}
  />
</div>
<div className={styles.editRow}>
  <label className={styles.label}>Start Date</label>
  <input
    type="date"
    className={styles.input}
    value={start}
    onChange={(e) => setStart(e.target.value)}
  />
</div>

<div className={styles.editRow}>
  <label className={styles.label}>End Date</label>
  <input
    type="date"
    className={styles.input}
    value={end}
    onChange={(e) => setend(e.target.value)}
  />
</div>

      </div>

      <button
        className={styles.saveBtn}
        onClick={handleUpdate}
      >
        {loading ? "Updating..." : "Save Changes"}
      </button>
    </div>
  </div>
)}

    </>
  );
}

export default EmployeePage;
