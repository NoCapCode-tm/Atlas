import React, { useState, useEffect } from "react";
import styles from "../CSS/EmployeeProfile.module.css";
import { User, Mail, Phone, Calendar, Users, Briefcase, FileText, Shield, Settings, Edit, Download, Eye, Upload, Plus, Pencil } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

export default function EmployeeProfile() {
  const [user, setUser] = useState(null);
  const[employees,setEmployees]=useState([])
  const [activeTab, setActiveTab] = useState("profile");
  const [pageLoading, setPageLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const[overlay,setOverlay]=useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });


  // Handler for Password Submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    try {
      // Pointing to the correct backend route /updateuser
      const response = await axios.put(
        "https://b-atlas-ncc.onrender.com/api/v1/employee/updateuser", 
        {
          id: user._id, // The backend controller requires the user id 
          password: passwordForm.newPassword // The backend expects the key to be 'password'
        }, 
        { withCredentials: true }
      );
      
      toast.success("Password changed successfully!");
      setIsPasswordModalOpen(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    }
  };

  useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://b-atlas-ncc.onrender.com/api/v1/admin/getalluser",
        {
          withCredentials: true,
        }
      );

      setEmployees(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  fetchData();
}, []);

  useEffect(() => {
    const loadProfile = async () => {
      setPageLoading(true);
      try {
        const res = await axios.get(
          "https://b-atlas-ncc.onrender.com/api/v1/admin/getuser",
          { withCredentials: true }
        );
        setUser(res.data.message);
        setEditForm({
          name: res.data.message.name || "",
          email: res.data.message.email || "",
          phone: res.data.message.phone || ""
        });
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setPageLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (!editMode) {
      setEditForm({
        id:user._id,
        name: user.name || "",
        email: user.Emails.email || "",
        phone: user.phone.permanent || "NA"
      });
    }
  };

  const handleManager = (id) =>{
    console.log(id)
    const manager = employees.find((e)=> e._id === id)
    return manager?.name
  }

  const handleSaveProfile = async () => {
    try {
     const response = await axios.put("https://b-atlas-ncc.onrender.com/api/v1/employee/updateuser",editForm,{withCredentials:true})
     console.log(response.data.message)
      window.location.reload()
      setUser({ ...user, ...editForm });
      setEditMode(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const PageLoader = () => (
    <div className={styles.pageLoader}>
      <div className={styles.loaderCard}>
        <div className={styles.spinner}></div>
        <p>Loading your profile…</p>
      </div>
    </div>
  );

  if (pageLoading) {
    return <PageLoader />;
  }


  return (
    <>
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>My Account</h1>
      </div>

      <div className={styles.container}>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <button
            className={`${styles.sidebarBtn} ${
              activeTab === "profile" ? styles.activeSidebarBtn : ""
            }`}
            onClick={() => setActiveTab("profile")}
          >
            <User size={18} />
            My Profile
          </button>
          <button
            className={`${styles.sidebarBtn} ${
              activeTab === "documents" ? styles.activeSidebarBtn : ""
            }`}
            onClick={() => setActiveTab("documents")}
          >
            <FileText size={18} />
            Documents
          </button>
          <button
            className={`${styles.sidebarBtn} ${
              activeTab === "credentials" ? styles.activeSidebarBtn : ""
            }`}
            onClick={() => setActiveTab("credentials")}
          >
            <Shield size={18} />
            Credentials
          </button>
          <button
            className={`${styles.sidebarBtn} ${
              activeTab === "settings" ? styles.activeSidebarBtn : ""
            }`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings size={18} />
            Settings
          </button>
        </div>

        {/* Main Content */}
        <div className={styles.content}>
          {activeTab === "profile" && (
            <>
              <div className={styles.sectionHeader}>
                <div className={styles.indicator}></div>
                <h2>My Profile</h2>
              </div>

              {/* Profile Card */}
              <div className={styles.profileCard}>
                <div className={styles.profileHeader}>
                  <div className={styles.avatarSection}>
                    {user?.profilepicture ? (
                      <img
                        src={user?.profilepicture}
                        alt={user?.name}
                        className={styles.avatar}
                      />
                    ) : (
                      <div className={styles.avatarPlaceholder}>
                        {user?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                    )}
                    <div className={styles.profileInfo}>
                      <h3>{user?.name}</h3>
                      <p>{user?.designation?.name || "Employee"}</p>
                    </div>
                  </div>
                  <button className={styles.editBtn} onClick={handleEditToggle}>
                    <Edit size={16} />
                    {editMode ? "Cancel" : "Edit"}
                  </button>
                </div>
              </div>

              {/* Personal Information */}
              <div className={styles.infoCard}>
                <div className={styles.infoHeader}>
                  <h3>Personal Information</h3>
                  {editMode && (
                    <button className={styles.saveBtn} onClick={handleSaveProfile}>
                      Save Changes
                    </button>
                  )}
                </div>

                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <label>Name</label>
                    {editMode ? (
                      <input
                        type="text"
                        className={styles.input}
                        value={editForm?.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                      />
                    ) : (
                      <p>{user?.name}</p>
                    )}
                  </div>

                  <div className={styles.infoItem}>
                    <label>Email</label>
                    {editMode ? (
                      <input
                        type="email"
                        className={styles.input}
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                      />
                    ) : (
                      <p>{user?.Emails?.email || "No Email"}</p>
                    )}
                  </div>

                  <div className={styles.infoItem}>
                    <label>Phone</label>
                    {editMode ? (
                      <input
                        type="tel"
                        className={styles.input}
                        value={editForm.phone}
                        onChange={(e) =>
                          setEditForm({ ...editForm, phone: e.target.value })
                        }
                      />
                    ) : (
                      <p>{user?.phone?.permanent || "NA"}</p>
                    )}
                  </div>

                  <div className={styles.infoItem}>
                    <label>Joining Date</label>
                    <p>
                      {user?.joiningdate
                        ? new Date(user?.onboarding?.completedAt).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                          })
                        : "NA"}
                    </p>
                  </div>

                  <div className={styles.infoItem}>
                    <label>Manager</label>
                    <p>{handleManager(user?.managerAssigned)}</p>
                  </div>

                  <div className={styles.infoItem}>
                    <label>Team</label>
                    <p>{user?.role || "NA"}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "documents" && (
            <>
              <div className={styles.sectionHeader}>
                <div className={styles.indicator}></div>
                <h2>Documents</h2>
              </div>

  
              {/* Company-Issued Documents */}
              <div className={styles.documentSection}>
                <h3 className={styles.documentSectionTitle}>Company-Issued Documents</h3>
                
                {/* Desktop View */}
                <div className={styles.desktopview}>
                  <div className={styles.documentTable}>
                    <div className={styles.documentTableHeader}>
                      <div>Document</div>
                      <div>Status</div>
                      <div>Action</div>
                    </div>

                    <div className={styles.documentRow}>
                      <div>Offer Letter</div>
                      <div>
                        <span className={`${styles.statusBadge} ${styles.signed}`}>
                          ● Signed
                        </span>
                      </div>
                      <div className={styles.actionButtons}>
                        <button 
                          className={styles.actionBtn} 
                          onClick={() => window.open('https://dox.nocapcode.cloud/legal-agreements', '_blank')}
                        >
                          <Eye size={16} /> View
                        </button>
                      </div>
                    </div>

                    <div className={styles.documentRow}>
                      <div>NDA</div>
                      <div>
                        <span className={`${styles.statusBadge} ${styles.signed}`}>
                          ● Signed
                        </span>
                      </div>
                      <div className={styles.actionButtons}>
                        <button 
                          className={styles.actionBtn}
                          onClick={() => window.open('https://dox.nocapcode.cloud/legal-agreements', '_blank')}
                        >
                          <Eye size={16} /> View
                        </button>
                      </div>
                    </div>

                    <div className={styles.documentRow}>
                      <div>Policy Handbook</div>
                      <div>
                        <span className={`${styles.statusBadge} ${styles.acknowledged}`}>
                          ● Acknowledged
                        </span>
                      </div>
                      <div className={styles.actionButtons}>
                        <button 
                          className={styles.actionBtn}
                          onClick={() => window.open('https://dox.nocapcode.cloud/company-docs', '_blank')}
                        >
                          <Eye size={16} /> View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile View */}
                <div className={styles.mobileView}>
                  <div className={styles.employeeCard}>
                    <div className={styles.cardTop}>
                      <div className={styles.namemenu}>
                        <div className={styles.cardUser}>
                          <h3>Offer Letter</h3>
                          <p>{user?.name}</p>
                        </div>
                      </div>
                    </div>
                    <div className={styles.cardDivider}></div>
                    <div className={styles.cardGrid}>
                      <div>
                        <span className={`${styles.statusBadge} ${styles.acknowledged}`}>
                          ● Acknowledged
                        </span>
                      </div>
                      <div className={styles.actionButtons}>
                        <button 
                          className={styles.actionBtn}
                          onClick={() => window.open('https://dox.nocapcode.cloud/legal-agreements', '_blank')}
                        >
                          <Eye size={16} /> View
                        </button>
                        <button className={styles.actionBtn}>
                          <Download size={16} /> Download
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className={styles.employeeCard}>
                    <div className={styles.cardTop}>
                      <div className={styles.namemenu}>
                        <div className={styles.cardUser}>
                          <h3>NDA</h3>
                          <p>{user?.name}</p>
                        </div>
                      </div>
                    </div>
                    <div className={styles.cardDivider}></div>
                    <div className={styles.cardGrid}>
                      <div>
                        <span className={`${styles.statusBadge} ${styles.acknowledged}`}>
                          ● Acknowledged
                        </span>
                      </div>
                      <div className={styles.actionButtons}>
                        <button 
                          className={styles.actionBtn}
                          onClick={() => window.open('https://dox.nocapcode.cloud/legal-agreements', '_blank')}
                        >
                          <Eye size={16} /> View
                        </button>
                        <button className={styles.actionBtn}>
                          <Download size={16} /> Download
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className={styles.employeeCard}>
                    <div className={styles.cardTop}>
                      <div className={styles.namemenu}>
                        <div className={styles.cardUser}>
                          <h3>Policy Handbook</h3>
                          <p>{user?.name}</p>
                        </div>
                      </div>
                    </div>
                    <div className={styles.cardDivider}></div>
                    <div className={styles.cardGrid}>
                      <div>
                        <span className={`${styles.statusBadge} ${styles.acknowledged}`}>
                          ● Acknowledged
                        </span>
                      </div>
                      <div className={styles.actionButtons}>
                        <button 
                          className={styles.actionBtn}
                          onClick={() => window.open('https://dox.nocapcode.cloud/company-docs', '_blank')}
                        >
                          <Eye size={16} /> View
                        </button>
                        <button className={styles.actionBtn}>
                          <Download size={16} /> Download
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Uploaded Documents */}
              
              <div className={styles.documentSection}>
                <h3 className={styles.documentSectionTitle}>Uploaded Documents</h3>
                
                {/* Desktop View */}
                <div className={styles.desktopview}>
                  <div className={styles.documentTable}>
                    <div className={styles.documentTableHeader}>
                      <div>Document</div>
                      <div>Status</div>
                      <div>Action</div>
                    </div>

                    <div className={styles.documentRow}>
                      <div>
                        <div>Government ID</div>
                        <div className={styles.documentSubtext}>(Aadhaar / PAN)</div>
                      </div>
                      <div>
                        <span className={`${styles.statusBadge} ${user?.documents?.govid1?.image || user?.documents?.govid2?.image ? styles.uploaded :styles.pending}`}>
                          {user?.documents?.govid1?.image || user?.documents?.govid2?.image?"Uploaded":"Pending"}
                        </span>
                      </div>
                      <div className={styles.actionButtons}>
                        <a
                          href={user?.documents?.govid1?.image}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.actionBtn}
                          style={{textDecorationLine:"none"}}
                        >
                          <Eye size={16} /> View
                        </a>
                        <button 
                          className={styles.actionBtn}
                          onClick={() => window.open('https://dox.nocapcode.cloud/onboarding/step3', '_blank')}
                        >
                          <Pencil size={16} /> Update
                        </button>
                      </div>
                    </div>

                    <div className={styles.documentRow}>
                      <div>Address Proof</div>
                      <div>
                        <span className={`${styles.statusBadge} ${user?.documents?.govid1?.image ? styles.uploaded :styles.pending}`}>
                          {user?.documents?.govid1?.image ?"Uploaded":"Pending"}
                        </span>
                      </div>
                      <div className={styles.actionButtons}>
                        <a
                          href={user?.documents?.govid1?.image}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.actionBtn}
                          style={{textDecorationLine:"none"}}
                        >
                          <Eye size={16} /> View
                        </a>
                        <button 
                          className={styles.actionBtn}
                          onClick={() => window.open('https://dox.nocapcode.cloud/onboarding/step3', '_blank')}
                        >
                          <Pencil size={16} /> Update
                        </button>
                      </div>
                    </div>

                    <div className={styles.documentRow}>
                      <div>Bank Details</div>
                      <div>
                        <span className={`${styles.statusBadge} ${user?.bankdetails?.upi ? styles.uploaded :styles.pending}`}>
                          {user?.bankdetails?.upi ?"Uploaded":"Pending"}
                        </span>
                      </div>
                      <div className={styles.actionButtons}>
                        <button className={styles.actionBtn}>
                          <Eye size={16} /> View
                        </button>
                        <button 
                          className={styles.actionBtn}
                          onClick={() => window.open('https://dox.nocapcode.cloud/onboarding/step6', '_blank')}
                        >
                          <Pencil size={16} /> Update
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Mobile View */}
                <div className={styles.mobileView}>
                  <div className={styles.employeeCard}>
                    <div className={styles.cardTop}>
                      <div className={styles.namemenu}>
                        <div className={styles.cardUser}>
                          <h3>Government ID</h3>
                          <p>(Aadhaar / PAN)</p>
                        </div>
                      </div>
                    </div>
                    <div className={styles.cardDivider}></div>
                    <div className={styles.cardGrid}>
                      <div>
                        <span className={`${styles.statusBadge} ${user?.documents?.aadhar || user?.documents?.pan ? styles.uploaded :styles.pending}`}>
                          {user?.documents?.aadhar || user?.documents?.pan ?"Uploaded":"Pending"}
                        </span>
                      </div>
                      <div className={styles.actionButtons}>
                        <button className={styles.actionBtn}>
                          <Eye size={16} /> View
                        </button>
                        <button 
                          className={styles.actionBtn}
                          onClick={() => window.open('https://dox.nocapcode.cloud/onboarding/step3', '_blank')}
                        >
                          <Pencil size={16} /> Update
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className={styles.employeeCard}>
                    <div className={styles.cardTop}>
                      <div className={styles.namemenu}>
                        <div className={styles.cardUser}>
                          <h3>Address Proof</h3>
                          <p>(Aadhaar)</p>
                        </div>
                      </div>
                    </div>
                    <div className={styles.cardDivider}></div>
                    <div className={styles.cardGrid}>
                      <div>
                        <span className={`${styles.statusBadge} ${user?.documents?.aadhar || user?.documents?.pan ? styles.uploaded :styles.pending}`}>
                          {user?.documents?.aadhar || user?.documents?.pan ?"Uploaded":"Pending"}
                        </span>
                      </div>
                      <div className={styles.actionButtons}>
                        <button className={styles.actionBtn}>
                          <Eye size={16} /> View
                        </button>
                        <button 
                          className={styles.actionBtn}
                          onClick={() => window.open('https://dox.nocapcode.cloud/onboarding/step3', '_blank')}
                        >
                          <Pencil size={16} /> Update
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className={styles.employeeCard}>
                    <div className={styles.cardTop}>
                      <div className={styles.namemenu}>
                        <div className={styles.cardUser}>
                          <h3>Bank Details</h3>
                        </div>
                      </div>
                    </div>
                    <div className={styles.cardDivider}></div>
                    <div>
                      <span className={`${styles.statusBadge} ${user?.bankdetails?.upi ? styles.uploaded :styles.pending}`}>
                        {user?.bankdetails?.upi ?"Uploaded":"Pending"}
                      </span>
                    </div>
                    <div className={styles.actionButtons}>
                      <button 
                        className={styles.actionBtn}
                        onClick={() => window.open('https://dox.nocapcode.cloud/onboarding/step6', '_blank')}
                      >
                        <Pencil size={16} /> Update
                      </button>
                    </div>
                  </div>
                </div>
              </div>
             
            </>
          )}

          {activeTab === "credentials" && (
            <>
              <div className={styles.sectionHeader}>
                <div className={styles.indicator}></div>
                <h2>Credentials</h2>
              </div>

              {/* Email Access */}
              <div className={styles.credentialCard}>
                <h3>Email Access</h3>
                
                <div className={styles.credentialGrid}>
                  <div className={styles.credentialItem}>
                    <label>Company Email</label>
                    <p>{user?.email || "sarah@nocapcode.cloud"}</p>
                  </div>

                  <div className={styles.credentialItem}>
                    <label>Access Level</label>
                    <p>Standard User</p>
                  </div>

                  <div className={styles.credentialItem}>
                    <label>2FA Enabled</label>
                    <p>N/A</p>
                  </div>

                  <div className={styles.credentialItem}>
                    <label>Account Type</label>
                    <p>Atlas Workspace</p>
                  </div>

                  <div className={styles.credentialItem}>
                    <label>Created On</label>
                    <p>1 January 2026</p>
                  </div>

                  <div className={styles.credentialItem}>
                    <label>Status</label>
                    <p className={styles.activeStatus}>Active</p>
                  </div>
                </div>
              </div>

              {/* Tools Access */}
              <div className={styles.credentialCard}>
                <div className={styles.credentialCardHeader}>
                  <h3>Tools Access</h3>
                  {/* <button className={styles.requestBtn}>
                    <Plus size={16} /> Request Device
                  </button> */}
                </div>
                <div className={styles.desktopview}>
                <div className={styles.documentTable}>
                  <div className={styles.documentTableHeader}>
                    <div>Document</div>
                    <div>Status</div>
                    <div>Action</div>
                  </div>

                  <div className={styles.documentRow}>
                    <div>Figma</div>
                    <div>
                      <span className={`${styles.statusBadge} ${styles.active}`}>
                        ● Active
                      </span>
                    </div>
                    <div className={styles.actionButtons}>
                      <button className={styles.actionBtn}>Editor</button>
                      <button className={styles.actionBtn}>Request</button>
                    </div>
                  </div>

                  <div className={styles.documentRow}>
                    <div>Slack</div>
                    <div>
                      <span className={`${styles.statusBadge} ${styles.active}`}>
                        ● Active
                      </span>
                    </div>
                    <div className={styles.actionButtons}>
                      <button className={styles.actionBtn}>Editor</button>
                      <button className={styles.actionBtn}>Request</button>
                    </div>
                  </div>

                  <div className={styles.documentRow}>
                    <div>AWS</div>
                    <div>
                      <span className={`${styles.statusBadge} ${styles.pending}`}>
                        ● Pending
                      </span>
                    </div>
                    <div className={styles.actionButtons}>
                      <button className={styles.actionBtn}>Editor</button>
                      <button className={styles.actionBtn}>Request</button>
                    </div>
                  </div>
                </div>
                </div>
                <div className={styles.mobileView}>
      <div className={styles.employeeCard}>
        {/* Top */}

        <div className={styles.cardTop}>
          
          <div className={styles.namemenu}>
          <div className={styles.cardUser}>
            <h3>Figma</h3>
            {/* <p>(Aadhaar / PAN)</p> */}
          </div>
          {/* <EllipsisVertical  color="white" onClick={()=>{setEditOverlay(true)
            handleEdit(emp)
            setselected(emp._id)
          }}/> */}
          </div>
        </div>

        <div className={styles.cardDivider}></div>

        {/* Details */}

        <div>
                      <span className={`${styles.statusBadge} ${styles.active}`}>
                        ● Active
                      </span>
                    </div>

         <div className={styles.actionButtons}>
                      <button className={styles.actionBtn}>Editor</button>
                      <button className={styles.actionBtn}>Request</button>
                    </div>
        </div>
      <div className={styles.employeeCard}>
        {/* Top */}

        <div className={styles.cardTop}>
          
          <div className={styles.namemenu}>
          <div className={styles.cardUser}>
            <h3>AWS</h3>
            {/* <p>(Aadhaar / PAN)</p> */}
          </div>
          {/* <EllipsisVertical  color="white" onClick={()=>{setEditOverlay(true)
            handleEdit(emp)
            setselected(emp._id)
          }}/> */}
          </div>
        </div>

        <div className={styles.cardDivider}></div>

        {/* Details */}

        <div>
                      <span className={`${styles.statusBadge} ${styles.active}`}>
                        ● Active
                      </span>
                    </div>

         <div className={styles.actionButtons}>
                      <button className={styles.actionBtn}>Editor</button>
                      <button className={styles.actionBtn}>Request</button>
                    </div>
        </div>
      <div className={styles.employeeCard}>
        {/* Top */}

        <div className={styles.cardTop}>
          
          <div className={styles.namemenu}>
          <div className={styles.cardUser}>
            <h3>Slack</h3>
            {/* <p>(Aadhaar / PAN)</p> */}
          </div>
          {/* <EllipsisVertical  color="white" onClick={()=>{setEditOverlay(true)
            handleEdit(emp)
            setselected(emp._id)
          }}/> */}
          </div>
        </div>

        <div className={styles.cardDivider}></div>

        {/* Details */}

        <div>
                      <span className={`${styles.statusBadge} ${styles.pending}`}>
                        ● Pending
                      </span>
                    </div>

         <div className={styles.actionButtons}>
                      <button className={styles.actionBtn}>Editor</button>
                      <button className={styles.actionBtn}>Request</button>
                    </div>
        </div>
                 </div>
              </div>

              {/* Device Access */}
              <div className={styles.credentialCard} style={{display:"none"}}>
                <div className={styles.credentialCardHeader}>
                  <h3>Device Access</h3>
                  <button className={styles.requestBtn}>
                    <Plus size={16} /> Request Device
                  </button>
                </div>
                
                <div className={styles.credentialGrid}>
                  <div className={styles.credentialItem}>
                    <label>Name</label>
                    <p>MacBook Pro</p>
                  </div>

                  <div className={styles.credentialItem}>
                    <label>Allocated On</label>
                    <p>10 January 2026</p>
                  </div>

                  <div className={styles.credentialItem}>
                    <label>Serial No</label>
                    <p>NOC-DEV-026</p>
                  </div>

                  <div className={styles.credentialItem}>
                    <label>Status</label>
                    <p className={styles.assignedStatus}>Assigned</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "settings" && (
            <>
              <div className={styles.sectionHeader}>
                <div className={styles.indicator}></div>
                <h2>Settings</h2>
              </div>

              {/* My Notifications */}
              <div className={styles.settingsCard}>
                <h3>My Notifications</h3>
                
                <div className={styles.settingsSection}>
                  <div className={styles.settingsLabel}>Notify me when...</div>
                  
                  <div className={styles.checkboxGroup}>
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" defaultChecked />
                      <span>Daily Productivity update</span>
                    </label>
                    <label className={styles.checkboxLabel}>
                      <input type="checkbox" defaultChecked />
                      <span>When added on New task</span>
                    </label>
                  </div>
                </div>

                <div className={styles.settingsToggleSection}>
                  <div>
                    <div className={styles.settingsToggleTitle}>Mobile push notifications</div>
                    <div className={styles.settingsToggleDesc}>
                      Receive push notifications whenever your organization requires your attention
                    </div>
                  </div>
                  <label className={styles.toggle}>
                    <input type="checkbox" defaultChecked />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>

                <div className={styles.settingsToggleSection}>
                  <div>
                    <div className={styles.settingsToggleTitle}>Desktop notifications</div>
                    <div className={styles.settingsToggleDesc}>
                      Receive desktop notifications whenever your organization requires your attention
                    </div>
                  </div>
                  <label className={styles.toggle}>
                    <input type="checkbox" defaultChecked />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>

                <div className={styles.settingsToggleSection}>
                  <div>
                    <div className={styles.settingsToggleTitle}>Email notifications</div>
                    <div className={styles.settingsToggleDesc}>
                      Receive email whenever your organization requires your attention
                    </div>
                  </div>
                  <label className={styles.toggle}>
                    <input type="checkbox" />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>
              </div>

              {/* My Settings */}
              <div className={styles.settingsCard}>
                <h3>My Settings</h3>
                
                <div className={styles.settingsRow}>
                  <div>
                    <div className={styles.settingsToggleTitle}>Language</div>
                    <div className={styles.settingsToggleDesc}>
                      Select your preferred language
                    </div>
                  </div>
                  <button className={styles.settingsButton}>English</button>
                </div>

                <div className={styles.settingsToggleSection}>
                  <div>
                    <div className={styles.settingsToggleTitle}>Two Factor Authentication</div>
                    <div className={styles.settingsToggleDesc}>
                      Keep your account safe by enabling 2FA via SMS or using temporary one-time passwords
                    </div>
                  </div>
                  <label className={styles.toggle}>
                    <input type="checkbox" defaultChecked />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>

                <div className={styles.settingsRow}>
                  <div>
                    <div className={styles.settingsToggleTitle}>Change Password</div>
                    <div className={styles.settingsToggleDesc}>
                      Update your account password regularly for security
                    </div>
                  </div>
                  <button className={styles.settingsButton} onClick={() => setIsPasswordModalOpen(true)}>
                    Change Password
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>

    {/* Existing Overlay */}
      {overlay && (
        <div className={styles.overlay}>
        </div>
      )}

      {/* New Password Change Modal */}
      {isPasswordModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Change Password</h2>
              <button 
                className={styles.modalClose} 
                onClick={() => setIsPasswordModalOpen(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handlePasswordSubmit}>
              <div className={styles.formGroup}>
                <label>Current Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="Enter current password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>New Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="Enter new password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Confirm New Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="Confirm new password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                />
              </div>
              
              <button type="submit" className={styles.submitBtn}>
                Change Password
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
