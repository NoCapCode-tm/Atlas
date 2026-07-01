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
  ChevronRight,
  ChevronLeft,
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
      `https://b-atlas-ncc.onrender.com/api/v1/admin/updateemployee`,
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
        `https://b-atlas-ncc.onrender.com/api/v1/admin/getalluser`,
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
        `https://b-atlas-ncc.onrender.com/api/v1/admin/addemployee`,
        { name:fullName, email:email, password:password, dob:dob,gender:gender ,role},
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
    if (status.includes("Paid")) return "active";
    if (status === "Full Time") return "fulltime";
    if (status === "Unpaid") return "inactive";
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
          <div className={styles.tableToolbar}>
  <div className={styles.searchBox}>
    <Search size={16} />
    <input
      type="text"
      placeholder="Search Employees"
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
      }}
    />
  </div>

  <div className={styles.toolbarRight}>
    <button
      className={styles.toolbarBtn}
      onClick={() => {
        setShowRoleDrop((p) => !p);
        setShowDesignationDrop(false);
        setShowStatusDrop(false);
      }}
    >
      Role
      <ChevronDown size={14} />
    </button>

    {showRoleDrop && (
      <div className={styles.dropdown}>
        {roleOptions.map((opt) => (
          <div
            key={opt}
            className={styles.dropdownItem}
            onClick={() => {
              setRoleFilter(opt);
              setShowRoleDrop(false);
            }}
          >
            {opt}
          </div>
        ))}
      </div>
    )}

    <button
      className={styles.toolbarBtn}
      onClick={() => {
        setShowDesignationDrop((p) => !p);
        setShowRoleDrop(false);
        setShowStatusDrop(false);
      }}
    >
      Manager
      <ChevronDown size={14} />
    </button>

    {showDesignationDrop && (
      <div className={styles.dropdown}>
        {["All Employees", "All HRs", "All Admins"].map((opt) => (
          <div
            key={opt}
            className={styles.dropdownItem}
            onClick={() => {
              setDesignationFilter(opt);
              setShowDesignationDrop(false);
            }}
          >
            {opt}
          </div>
        ))}
      </div>
    )}

    <button
      className={styles.toolbarBtn}
      onClick={() => {
        setShowStatusDrop((p) => !p);
        setShowRoleDrop(false);
        setShowDesignationDrop(false);
      }}
    >
      Filters
      <Filter size={14} />
    </button>

    {showStatusDrop && (
      <div className={styles.dropdown}>
        {statusOptions.map((opt) => (
          <div
            key={opt}
            className={styles.dropdownItem}
            onClick={() => {
              setStatusFilter(opt);
              setShowStatusDrop(false);
            }}
          >
            {opt}
          </div>
        ))}
      </div>
    )}
  </div>
</div>

<table className={styles.employeeTable}>
  <thead>
    <tr>
      <th>Employee</th>
      <th>Email</th>
      <th>Role</th>
      <th>Manager</th>
      <th>Projects</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  </thead>

  <tbody>
    {paginatedEmployees.map((emp) => {
      const initials = emp.name
        .split(" ")
        .map((n) => n[0])
        .join("");

      return (
        <tr key={emp._id}>
          <td>
            <div className={styles.employeeInfo}>
              <div className={styles.avatar}>
                {initials}
              </div>

              <span>{emp.name}</span>
            </div>
          </td>

          <td>{emp.email}</td>

          <td>{emp.role || "-"}</td>

          <td>
            {emp.managerAssigned?.name || "—"}
          </td>

          <td>
            {emp.Projects?.length || 0}
          </td>

          <td>
            <span
              className={`${styles.statusBadge} ${
                styles[mapStatus(emp.status)]
              }`}
            >
              {emp.status}
            </span>
          </td>

          <td className={styles.actionCell}>
            <MoreVertical
              size={18}
              className={styles.actionIcon}
              onClick={() => handleEdit(emp)}
            />
          </td>
        </tr>
      );
    })}
  </tbody>
</table>

         <div className={styles.pagination}>
  <span>
    Showing {(currentPage - 1) * perPage + 1}–
    {Math.min(currentPage * perPage, filteredEmployees.length)} of{" "}
    {filteredEmployees.length}
  </span>

  <div className={styles.pagebtns1}>
    {/* Previous */}
    <button
      className={styles.arrowBtn}
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((p) => p - 1)}
    >
      <ChevronLeft size={18} />
    </button>

    {/* First 3 Pages */}
    {Array.from(
      { length: Math.min(3, totalPages) },
      (_, i) => i + 1
    ).map((page) => (
      <button
        key={page}
        className={`${styles.pageNumber1} ${
          currentPage === page ? styles.activepage : ""
        }`}
        onClick={() => setCurrentPage(page)}
      >
        {page}
      </button>
    ))}

    {/* Ellipsis */}
    {totalPages > 4 && (
      <>
        <span className={styles.dots}>.....</span>

        <button
          className={`${styles.pageNumber} ${
            currentPage === totalPages
              ? styles.activepage
              : ""
          }`}
          onClick={() => setCurrentPage(totalPages)}
        >
          {totalPages}
        </button>
      </>
    )}

    {/* Next */}
    <button
      className={styles.arrowBtn}
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage((p) => p + 1)}
    >
      <ChevronRight size={18} />
    </button>
  </div>
</div>
        </div>
      </div>

  {overlay && (
    <div
      className={styles.overlay}
      onClick={() => setoverlay(false)}
    >
      <div
        className={styles.modal1}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
  
        <button
          className={styles.closeBtn}
          onClick={() => setoverlay(false)}
        >
          <X size={28} strokeWidth={2} />
        </button>
  
        {/* Header */}
  
        <div className={styles.header1}>
          <h2>Employee Details</h2>
  
          <p>
            Fill the fields below to add new members
          </p>
        </div>
  
        {/* First Last */}
  
        <div className={styles.row}>
          <div className={styles.field}>
            <label>
              FIRST NAME <span>*</span>
            </label>
  
            <input
              type="text"
              value={firstName}
              onChange={(e) =>
                setFirstName(e.target.value)
              }
            />
          </div>
  
          <div className={styles.field}>
            <label>
              LAST NAME <span>*</span>
            </label>
  
            <input
              type="text"
              value={lastName}
              onChange={(e) =>
                setLastName(e.target.value)
              }
            />
          </div>
        </div>
  
        {/* Role */}
  
        <div className={styles.fullField}>
          <label>
            ROLE <span>*</span>
          </label>
           <input
              type="text"
              value={role}
              onChange={(e) =>
                setRole(e.target.value)
              }
            />
          
        </div>
  
        {/* Email */}
  
        <div className={styles.fullField}>
          <label>
            EMAIL <span>*</span>
          </label>
  
          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />
        </div>
  
        {/* Password */}
  
        <div className={styles.fullField}>
          <label>
            PASSWORD <span>*</span>
          </label>
  
          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />
        </div>
  
        {/* Bottom */}
  
        <div className={styles.rowBottom}>
          <div className={styles.field}>
            <label>DATE OF BIRTH</label>
  
            <div className={styles.dateWrapper}>
              <input
                type="date"
                value={dob}
                onChange={(e) =>
                  setDob(e.target.value)
                }
              />
            </div>
          </div>
  
          <div className={styles.field}>
            <label>GENDER</label>
  
            <select
              value={gender}
              onChange={(e) =>
                setGender(e.target.value)
              }
            >
              <option value="">
                Select
              </option>
  
              <option>Male</option>
  
              <option>Female</option>
  
              <option>Other</option>
            </select>
          </div>
        </div>
  
        {/* Footer */}
  
        <div className={styles.footer}>
          <p>
            <span>*</span> Required fields
          </p>
  
          <button
            className={styles.addBtn}
            onClick={handleaddu}
          >
            {loading
              ? "Adding..."
              : "Add Employee"}
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
