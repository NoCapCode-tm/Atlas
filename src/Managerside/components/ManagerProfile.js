import React, { useState } from "react";
import { Users, Settings, Edit2, X, Check, Plus, ChevronDown, Eye, EyeOff } from "lucide-react";
import styles from "../css/ManagerProfile.module.css";
import { toast } from "react-toastify";

// Initial profile data
const initialProfile = {
  name: "Sarah Wilson",
  firstName: "Sarah",
  role: "HR Manager",
  email: "sarah.will@abc.com",
  phone: "+91 98765 43210",
  joiningDate: "03 January 2026",
  manager: "Mr Willson",
  team: "Product Development",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
};

const initialCompanyDocs = [
  { id: "cd1", name: "Offer Letter", status: "Signed", type: "signed" },
  { id: "cd2", name: "NDA", status: "Signed", type: "signed" },
  { id: "cd3", name: "Policy Handbook", status: "Acknowledged", type: "acknowledged" }
];

const initialUploadedDocs = [
  { id: "ud1", name: "Government ID (Aadhaar / PAN)", status: "Uploaded", type: "uploaded", action: "View" },
  { id: "ud2", name: "Address Proof", status: "Uploaded", type: "uploaded", action: "Replace" },
  { id: "ud3", name: "Bank Details", status: "Pending", type: "pending", action: "Upload" }
];

const initialCredentials = {
  emailAccess: {
    companyEmail: "sarah.will@nocapcode.com",
    accessLevel: "Standard User",
    twoFactor: "Yes",
    accountType: "Google Workspace",
    createdOn: "1 January 2026",
    status: "Active"
  },
  tools: [
    { id: "t1", name: "Figma", status: "Active", type: "active", action: "Editor" },
    { id: "t2", name: "Slack", status: "Active", type: "active", action: "Member" },
    { id: "t3", name: "AWS", status: "Pending", type: "pending", action: "-" }
  ],
  deviceAccess: {
    name: "MacBook Pro",
    allocatedOn: "16 January 2026",
    serialNo: "NCC-DEV-029",
    status: "Assigned"
  }
};

function ManagerProfile() {
  const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'settings'
  const [profile, setProfile] = useState(initialProfile);
  const [companyDocs, setCompanyDocs] = useState(initialCompanyDocs);
  const [uploadedDocs, setUploadedDocs] = useState(initialUploadedDocs);
  const [credentials, setCredentials] = useState(initialCredentials);

  // Reset session overrides on mount
  React.useEffect(() => {
    try {
      localStorage.removeItem("managerProfile");
      localStorage.removeItem("managerName");
      localStorage.removeItem("managerRole");
    } catch (err) {
      console.error(err);
    }
  }, []);

  // Notifications State
  const [notifications, setNotifications] = useState({
    dailyProductivity: true,
    newTeam: true,
    mobilePush: true,
    desktopNotif: true,
    emailNotif: false
  });

  // Settings Config State
  const [settingsConfig, setSettingsConfig] = useState({
    language: "English",
    twoFactor: true
  });

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ ...initialProfile });

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    newPass: "",
    confirmPass: ""
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    newPass: false,
    confirmPass: false
  });

  const [isRequestToolOpen, setIsRequestToolOpen] = useState(false);
  const [toolReq, setToolReq] = useState({ name: "", reason: "" });

  const [isRequestDeviceOpen, setIsRequestDeviceOpen] = useState(false);
  const [deviceReq, setDeviceReq] = useState({ name: "", reason: "" });

  const handleOpenEdit = () => {
    setEditForm({ ...profile });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setProfile({ ...editForm });
    // Notify header and sidebar in current session
    window.dispatchEvent(
      new CustomEvent("managerProfileUpdated", {
        detail: { name: editForm.name, role: editForm.role }
      })
    );
    setIsEditModalOpen(false);
    toast.success("Profile updated successfully!");
  };

  const handleDocAction = (docName, action) => {
    if (action === "View") {
      toast.info(`Opening preview for ${docName}...`);
    } else if (action === "Download") {
      toast.success(`Downloading ${docName}...`);
    } else if (action === "Replace" || action === "Upload") {
      setUploadedDocs((prev) =>
        prev.map((doc) =>
          doc.name === docName
            ? { ...doc, status: "Uploaded", type: "uploaded", action: "View" }
            : doc
        )
      );
      toast.success(`${docName} uploaded successfully!`);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.newPass !== passwordForm.confirmPass) {
      toast.error("New passwords do not match!");
      return;
    }
    toast.success("Password changed successfully!");
    setPasswordForm({ current: "", newPass: "", confirmPass: "" });
    setIsChangePasswordOpen(false);
  };

  const handleRequestToolSubmit = (e) => {
    e.preventDefault();
    if (!toolReq.name.trim()) return;
    setCredentials((prev) => ({
      ...prev,
      tools: [
        ...prev.tools,
        {
          id: `t${Date.now()}`,
          name: toolReq.name,
          status: "Pending",
          type: "pending",
          action: "Requested"
        }
      ]
    }));
    toast.success(`Request submitted for ${toolReq.name}!`);
    setToolReq({ name: "", reason: "" });
    setIsRequestToolOpen(false);
  };

  const handleRequestDeviceSubmit = (e) => {
    e.preventDefault();
    toast.success(`Device request submitted for ${deviceReq.name || "New Device"}!`);
    setDeviceReq({ name: "", reason: "" });
    setIsRequestDeviceOpen(false);
  };

  return (
    <div className={styles.pageContainer}>
      {/* Top Header Row */}
      <div className={styles.headerRow}>
        <h1 className={styles.accountTitle}>My Account</h1>
      </div>

      <div className={styles.mainWrapper}>
        {/* Left Vertical Sub-Navigation Pill (Desktop & Tablet) */}
        <aside className={styles.verticalNavPill}>
          <button
            className={`${styles.navIconBtn} ${
              activeTab === "profile" ? styles.navIconBtnActive : ""
            }`}
            onClick={() => setActiveTab("profile")}
            title="Profile"
          >
            <Users size={20} />
          </button>
          <button
            className={`${styles.navIconBtn} ${
              activeTab === "settings" ? styles.navIconBtnActive : ""
            }`}
            onClick={() => setActiveTab("settings")}
            title="Settings"
          >
            <Settings size={20} />
          </button>
        </aside>

        {/* Main Content Area */}
        <div className={styles.contentArea}>
          {/* Horizontal Sub-Navigation Pill (Mobile <= 425px matching Figma Image 3) */}
          <div className={styles.mobileNavPill}>
            <button
              className={`${styles.mobileNavBtn} ${
                activeTab === "profile" ? styles.mobileNavBtnActive : ""
              }`}
              onClick={() => setActiveTab("profile")}
              title="Profile"
            >
              <Users size={18} />
            </button>
            <button
              className={`${styles.mobileNavBtn} ${
                activeTab === "settings" ? styles.mobileNavBtnActive : ""
              }`}
              onClick={() => setActiveTab("settings")}
              title="Settings"
            >
              <Settings size={18} />
            </button>
          </div>

          {activeTab === "profile" ? (
            <>
              {/* Centered Page Title */}
              <h2 className={styles.sectionTitle}>My Profile</h2>

              {/* 4 Cards Grid / Stack */}
              <div className={styles.contentGrid}>
                {/* Column Left (Profile Summary + Personal Information) */}
                <div className={styles.columnLeft}>
                  {/* Card 1: Profile Summary */}
                  <div className={styles.profileCardBlock}>
                    <div className={styles.profileHeaderRow}>
                      <div className={styles.avatarAndInfo}>
                        <img
                          src={profile.avatar}
                          alt={profile.name}
                          className={styles.avatarImage}
                        />
                        <div className={styles.profileNameAndRole}>
                          <h3 className={styles.profileName}>{profile.name}</h3>
                          <p className={styles.profileRole}>{profile.role}</p>
                        </div>
                      </div>

                      <button
                        className={styles.editPillBtn}
                        onClick={handleOpenEdit}
                        title="Edit Profile"
                      >
                        <span>Edit</span>
                        <Edit2 size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Card 2: Personal Information */}
                  <div className={styles.profileCardBlock}>
                    <div className={styles.cardTitleRow}>
                      <h4 className={styles.cardTitle}>Personal Information</h4>
                      <button
                        className={styles.editPillBtn}
                        onClick={handleOpenEdit}
                        title="Edit Personal Information"
                      >
                        <span>Edit</span>
                        <Edit2 size={12} />
                      </button>
                    </div>

                    <div className={styles.personalInfoGrid}>
                      <div className={styles.infoField}>
                        <span className={styles.infoLabel}>Name</span>
                        <span className={styles.infoValue}>{profile.firstName}</span>
                      </div>

                      <div className={styles.infoField}>
                        <span className={styles.infoLabel}>Email</span>
                        <span className={styles.infoValue}>{profile.email}</span>
                      </div>

                      <div className={styles.infoField}>
                        <span className={styles.infoLabel}>Phone</span>
                        <span className={styles.infoValue}>{profile.phone}</span>
                      </div>

                      <div className={styles.infoField}>
                        <span className={styles.infoLabel}>Joining Date</span>
                        <span className={styles.infoValue}>{profile.joiningDate}</span>
                      </div>

                      <div className={styles.infoField}>
                        <span className={styles.infoLabel}>Manager</span>
                        <span className={styles.infoValue}>{profile.manager}</span>
                      </div>

                      <div className={styles.infoField}>
                        <span className={styles.infoLabel}>Team</span>
                        <span className={styles.infoValue}>{profile.team}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column Right (Company-Issued Documents + Uploaded Documents) */}
                <div className={styles.columnRight}>
                  {/* Card 3: Company-Issued Documents */}
                  <div className={styles.profileCardBlock}>
                    <div className={styles.cardTitleRow}>
                      <h4 className={styles.cardTitle}>Company-Issued Documents</h4>
                    </div>

                    <div className={styles.documentTable}>
                      <div className={styles.docHeaderRow}>
                        <div>Document</div>
                        <div>Status</div>
                        <div>Action</div>
                      </div>

                      {companyDocs.map((doc) => (
                        <div key={doc.id} className={styles.docItemRow}>
                          <div className={styles.docName}>{doc.name}</div>

                          <div>
                            {doc.type === "signed" && (
                              <span className={`${styles.statusBadge} ${styles.badgeGreen}`}>
                                <span className={styles.statusDot} />
                                Signed
                              </span>
                            )}
                            {doc.type === "acknowledged" && (
                              <span className={`${styles.statusBadge} ${styles.badgeBlue}`}>
                                <span className={styles.statusDot} />
                                Acknowledged
                              </span>
                            )}
                          </div>

                          <div className={styles.docActions}>
                            <button
                              type="button"
                              className={styles.blueAction}
                              onClick={() => handleDocAction(doc.name, "View")}
                            >
                              View
                            </button>
                            {doc.type === "signed" && (
                              <>
                                <span className={styles.actionBullet}>•</span>
                                <button
                                  type="button"
                                  className={styles.whiteAction}
                                  onClick={() => handleDocAction(doc.name, "Download")}
                                >
                                  Download
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card 4: Uploaded Documents */}
                  <div className={styles.profileCardBlock}>
                    <div className={styles.cardTitleRow}>
                      <h4 className={styles.cardTitle}>Uploaded Documents</h4>
                    </div>

                    <div className={styles.documentTable}>
                      <div className={styles.docHeaderRow}>
                        <div>Document</div>
                        <div>Status</div>
                        <div>Action</div>
                      </div>

                      {uploadedDocs.map((doc) => (
                        <div key={doc.id} className={styles.docItemRow}>
                          <div className={styles.docName}>{doc.name}</div>

                          <div>
                            {doc.type === "uploaded" && (
                              <span className={`${styles.statusBadge} ${styles.badgeGreen}`}>
                                <span className={styles.statusDot} />
                                Uploaded
                              </span>
                            )}
                            {doc.type === "pending" && (
                              <span className={`${styles.statusBadge} ${styles.badgeOrange}`}>
                                <span className={styles.statusDot} />
                                Pending
                              </span>
                            )}
                          </div>

                          <div className={styles.docActions}>
                            {doc.action === "View" && (
                              <button
                                type="button"
                                className={styles.blueAction}
                                onClick={() => handleDocAction(doc.name, "View")}
                              >
                                View
                              </button>
                            )}
                            {doc.action === "Replace" && (
                              <button
                                type="button"
                                className={styles.whiteAction}
                                onClick={() => handleDocAction(doc.name, "Replace")}
                              >
                                Replace
                              </button>
                            )}
                            {doc.action === "Upload" && (
                              <button
                                type="button"
                                className={styles.whiteAction}
                                onClick={() => handleDocAction(doc.name, "Upload")}
                              >
                                Upload
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Settings View (Exact Figma Layout for Credentials & Settings) */
            <div className={styles.settingsGrid}>
              {/* Column Left: Credentials */}
              <div className={styles.columnLeft}>
                <h2 className={styles.columnHeader}>Credentials</h2>

                {/* Card 1: Email Access */}
                <div className={styles.profileCardBlock}>
                  <div className={styles.cardTitleRow}>
                    <h4 className={styles.cardTitle}>Email Access</h4>
                  </div>

                  <div className={styles.emailGrid}>
                    <div className={styles.infoField}>
                      <span className={styles.infoLabel}>Company Email</span>
                      <span className={styles.infoValue}>
                        {credentials.emailAccess.companyEmail}
                      </span>
                    </div>

                    <div className={styles.infoField}>
                      <span className={styles.infoLabel}>Access Level</span>
                      <span className={styles.infoValue}>
                        {credentials.emailAccess.accessLevel}
                      </span>
                    </div>

                    <div className={styles.infoField}>
                      <span className={styles.infoLabel}>2FA Enabled</span>
                      <span className={styles.infoValue}>
                        {credentials.emailAccess.twoFactor}
                      </span>
                    </div>

                    <div className={styles.infoField}>
                      <span className={styles.infoLabel}>Account Type</span>
                      <span className={styles.infoValue}>
                        {credentials.emailAccess.accountType}
                      </span>
                    </div>

                    <div className={styles.infoField}>
                      <span className={styles.infoLabel}>Created On</span>
                      <span className={styles.infoValue}>
                        {credentials.emailAccess.createdOn}
                      </span>
                    </div>

                    <div className={styles.infoField}>
                      <span className={styles.infoLabel}>Status</span>
                      <span className={styles.statusActiveText}>
                        {credentials.emailAccess.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card 2: Tool Access */}
                <div className={styles.profileCardBlock}>
                  <div className={styles.cardTitleRow}>
                    <h4 className={styles.cardTitle}>Tool Access</h4>
                    <button
                      type="button"
                      className={styles.requestPillBtn}
                      onClick={() => setIsRequestToolOpen(true)}
                    >
                      <Plus size={11} />
                      <span>Request Tool</span>
                    </button>
                  </div>

                  <div className={styles.documentTable}>
                    <div className={styles.toolHeaderRow}>
                      <div>Document</div>
                      <div>Status</div>
                      <div>Action</div>
                    </div>

                    {credentials.tools.map((tool) => (
                      <div key={tool.id} className={styles.toolItemRow}>
                        <div className={styles.docName}>{tool.name}</div>

                        <div>
                          {tool.type === "active" ? (
                            <span className={`${styles.statusBadge} ${styles.badgeGreen}`}>
                              <span className={styles.statusDot} />
                              Active
                            </span>
                          ) : (
                            <span className={`${styles.statusBadge} ${styles.badgeOrange}`}>
                              <span className={styles.statusDot} />
                              Pending
                            </span>
                          )}
                        </div>

                        <div className={styles.toolRoleText}>{tool.action}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card 3: Device Access */}
                <div className={styles.profileCardBlock}>
                  <div className={styles.cardTitleRow}>
                    <h4 className={styles.cardTitle}>Device Access</h4>
                    <button
                      type="button"
                      className={styles.requestPillBtn}
                      onClick={() => setIsRequestDeviceOpen(true)}
                    >
                      <Plus size={11} />
                      <span>Request Device</span>
                    </button>
                  </div>

                  <div className={styles.deviceGrid}>
                    <div className={styles.infoField}>
                      <span className={styles.infoLabel}>Name</span>
                      <span className={styles.infoValue}>
                        {credentials.deviceAccess.name}
                      </span>
                    </div>

                    <div className={styles.infoField}>
                      <span className={styles.infoLabel}>Allocated On</span>
                      <span className={styles.infoValue}>
                        {credentials.deviceAccess.allocatedOn}
                      </span>
                    </div>

                    <div className={styles.infoField}>
                      <span className={styles.infoLabel}>Serial No</span>
                      <span className={styles.infoValue}>
                        {credentials.deviceAccess.serialNo}
                      </span>
                    </div>

                    <div className={styles.infoField}>
                      <span className={styles.infoLabel}>Status</span>
                      <span className={styles.infoValue}>
                        {credentials.deviceAccess.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column Right: Settings */}
              <div className={styles.columnRight}>
                <h2 className={styles.columnHeader}>Settings</h2>

                {/* Card 4: My Notifications */}
                <div className={styles.profileCardBlock}>
                  <div className={styles.cardTitleRow}>
                    <h4 className={styles.cardTitle}>My Notifications</h4>
                  </div>

                  <p className={styles.notificationSubhead}>Notify me when...</p>

                  <div className={styles.checkboxList}>
                    <div
                      className={styles.checkboxItem}
                      onClick={() =>
                        setNotifications((prev) => ({
                          ...prev,
                          dailyProductivity: !prev.dailyProductivity
                        }))
                      }
                    >
                      <div
                        className={`${styles.customCheckbox} ${
                          notifications.dailyProductivity
                            ? styles.customCheckboxChecked
                            : ""
                        }`}
                      >
                        {notifications.dailyProductivity && <Check size={10} />}
                      </div>
                      <span>Daily Productivity update</span>
                    </div>

                    <div
                      className={styles.checkboxItem}
                      onClick={() =>
                        setNotifications((prev) => ({
                          ...prev,
                          newTeam: !prev.newTeam
                        }))
                      }
                    >
                      <div
                        className={`${styles.customCheckbox} ${
                          notifications.newTeam
                            ? styles.customCheckboxChecked
                            : ""
                        }`}
                      >
                        {notifications.newTeam && <Check size={10} />}
                      </div>
                      <span>When added on New Team</span>
                    </div>
                  </div>

                  <div className={styles.toggleRow}>
                    <div className={styles.toggleInfo}>
                      <span className={styles.toggleTitle}>
                        Mobile push notifications
                      </span>
                      <span className={styles.toggleSub}>
                        Receive push notification whenever your organization
                        requires your attention.
                      </span>
                    </div>
                    <button
                      type="button"
                      className={`${styles.toggleSwitch} ${
                        notifications.mobilePush ? styles.toggleSwitchOn : ""
                      }`}
                      onClick={() =>
                        setNotifications((prev) => ({
                          ...prev,
                          mobilePush: !prev.mobilePush
                        }))
                      }
                    >
                      <span
                        className={`${styles.toggleKnob} ${
                          notifications.mobilePush ? styles.toggleKnobOn : ""
                        }`}
                      />
                    </button>
                  </div>

                  <div className={styles.toggleRow}>
                    <div className={styles.toggleInfo}>
                      <span className={styles.toggleTitle}>
                        Desktop notifications
                      </span>
                      <span className={styles.toggleSub}>
                        Receive desktop notification whenever your organization
                        requires your attention.
                      </span>
                    </div>
                    <button
                      type="button"
                      className={`${styles.toggleSwitch} ${
                        notifications.desktopNotif ? styles.toggleSwitchOn : ""
                      }`}
                      onClick={() =>
                        setNotifications((prev) => ({
                          ...prev,
                          desktopNotif: !prev.desktopNotif
                        }))
                      }
                    >
                      <span
                        className={`${styles.toggleKnob} ${
                          notifications.desktopNotif ? styles.toggleKnobOn : ""
                        }`}
                      />
                    </button>
                  </div>

                  <div className={styles.toggleRow}>
                    <div className={styles.toggleInfo}>
                      <span className={styles.toggleTitle}>
                        Email notifications
                      </span>
                      <span className={styles.toggleSub}>
                        Receive email whenever your organization requires your
                        attention.
                      </span>
                    </div>
                    <button
                      type="button"
                      className={`${styles.toggleSwitch} ${
                        notifications.emailNotif ? styles.toggleSwitchOn : ""
                      }`}
                      onClick={() =>
                        setNotifications((prev) => ({
                          ...prev,
                          emailNotif: !prev.emailNotif
                        }))
                      }
                    >
                      <span
                        className={`${styles.toggleKnob} ${
                          notifications.emailNotif ? styles.toggleKnobOn : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Card 5: My Settings */}
                <div className={styles.profileCardBlock}>
                  <div className={styles.cardTitleRow}>
                    <h4 className={styles.cardTitle}>My Settings</h4>
                  </div>

                  <div className={styles.toggleRow}>
                    <div className={styles.toggleInfo}>
                      <span className={styles.toggleTitle}>Language</span>
                      <span className={styles.toggleSub}>
                        Select your preferred language
                      </span>
                    </div>
                    <button
                      type="button"
                      className={styles.langBtn}
                      onClick={() => {
                        const newLang =
                          settingsConfig.language === "English"
                            ? "Spanish"
                            : "English";
                        setSettingsConfig((prev) => ({
                          ...prev,
                          language: newLang
                        }));
                        toast.info(`Language set to ${newLang}`);
                      }}
                    >
                      <span>{settingsConfig.language}</span>
                      <ChevronDown size={12} />
                    </button>
                  </div>

                  <div className={styles.toggleRow}>
                    <div className={styles.toggleInfo}>
                      <span className={styles.toggleTitle}>
                        Two Factor Authentication
                      </span>
                      <span className={styles.toggleSub}>
                        Keep your account safe by enabling 2FA via SMS or using
                        TOTP.
                      </span>
                    </div>
                    <button
                      type="button"
                      className={`${styles.toggleSwitch} ${
                        settingsConfig.twoFactor ? styles.toggleSwitchOn : ""
                      }`}
                      onClick={() => {
                        const updated = !settingsConfig.twoFactor;
                        setSettingsConfig((prev) => ({
                          ...prev,
                          twoFactor: updated
                        }));
                        toast.success(
                          `2FA ${updated ? "enabled" : "disabled"}`
                        );
                      }}
                    >
                      <span
                        className={`${styles.toggleKnob} ${
                          settingsConfig.twoFactor ? styles.toggleKnobOn : ""
                        }`}
                      />
                    </button>
                  </div>

                  <div className={styles.toggleRow}>
                    <div className={styles.toggleInfo}>
                      <span className={styles.toggleTitle}>Change Password</span>
                      <span className={styles.toggleSub}>
                        Update your account password regularly for security.
                      </span>
                    </div>
                    <button
                      type="button"
                      className={styles.changePasswordBtn}
                      onClick={() => setIsChangePasswordOpen(true)}
                    >
                      Change password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Edit Profile Information</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer"
                }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className={styles.modalForm}>
              <div className={styles.modalRow}>
                <div className={styles.modalField}>
                  <label className={styles.modalLabel}>First Name</label>
                  <input
                    type="text"
                    className={styles.modalInput}
                    value={editForm.firstName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, firstName: e.target.value })
                    }
                    required
                  />
                </div>

                <div className={styles.modalField}>
                  <label className={styles.modalLabel}>Full Name</label>
                  <input
                    type="text"
                    className={styles.modalInput}
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className={styles.modalRow}>
                <div className={styles.modalField}>
                  <label className={styles.modalLabel}>Role</label>
                  <input
                    type="text"
                    className={styles.modalInput}
                    value={editForm.role}
                    onChange={(e) =>
                      setEditForm({ ...editForm, role: e.target.value })
                    }
                    required
                  />
                </div>

                <div className={styles.modalField}>
                  <label className={styles.modalLabel}>Email</label>
                  <input
                    type="email"
                    className={styles.modalInput}
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className={styles.modalRow}>
                <div className={styles.modalField}>
                  <label className={styles.modalLabel}>Phone</label>
                  <input
                    type="text"
                    className={styles.modalInput}
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                    required
                  />
                </div>

                <div className={styles.modalField}>
                  <label className={styles.modalLabel}>Joining Date</label>
                  <input
                    type="text"
                    className={styles.modalInput}
                    value={editForm.joiningDate}
                    onChange={(e) =>
                      setEditForm({ ...editForm, joiningDate: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className={styles.modalRow}>
                <div className={styles.modalField}>
                  <label className={styles.modalLabel}>Manager</label>
                  <input
                    type="text"
                    className={styles.modalInput}
                    value={editForm.manager}
                    onChange={(e) =>
                      setEditForm({ ...editForm, manager: e.target.value })
                    }
                    required
                  />
                </div>

                <div className={styles.modalField}>
                  <label className={styles.modalLabel}>Team</label>
                  <input
                    type="text"
                    className={styles.modalInput}
                    value={editForm.team}
                    onChange={(e) =>
                      setEditForm({ ...editForm, team: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className={styles.modalActions}>
                <button type="submit" className={styles.modalSubmitBtn}>
                  Save Changes
                </button>
                <button
                  type="button"
                  className={styles.modalCancelBtn}
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsChangePasswordOpen(false)}
        >
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Change Password</h3>
              <button
                onClick={() => setIsChangePasswordOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer"
                }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className={styles.modalForm}>
              <div className={styles.modalField}>
                <label className={styles.modalLabel}>Current Password</label>
                <div className={styles.passwordInputWrapper}>
                  <input
                    type={showPassword.current ? "text" : "password"}
                    className={styles.modalInput}
                    placeholder="••••••••"
                    value={passwordForm.current}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, current: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    className={styles.passwordEyeBtn}
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        current: !prev.current
                      }))
                    }
                    title={showPassword.current ? "Hide password" : "Show password"}
                  >
                    {showPassword.current ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              <div className={styles.modalField}>
                <label className={styles.modalLabel}>New Password</label>
                <div className={styles.passwordInputWrapper}>
                  <input
                    type={showPassword.newPass ? "text" : "password"}
                    className={styles.modalInput}
                    placeholder="••••••••"
                    value={passwordForm.newPass}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, newPass: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    className={styles.passwordEyeBtn}
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        newPass: !prev.newPass
                      }))
                    }
                    title={showPassword.newPass ? "Hide password" : "Show password"}
                  >
                    {showPassword.newPass ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              <div className={styles.modalField}>
                <label className={styles.modalLabel}>Confirm New Password</label>
                <div className={styles.passwordInputWrapper}>
                  <input
                    type={showPassword.confirmPass ? "text" : "password"}
                    className={styles.modalInput}
                    placeholder="••••••••"
                    value={passwordForm.confirmPass}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPass: e.target.value
                      })
                    }
                    required
                  />
                  <button
                    type="button"
                    className={styles.passwordEyeBtn}
                    onClick={() =>
                      setShowPassword((prev) => ({
                        ...prev,
                        confirmPass: !prev.confirmPass
                      }))
                    }
                    title={showPassword.confirmPass ? "Hide password" : "Show password"}
                  >
                    {showPassword.confirmPass ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              <div className={styles.modalActions}>
                <button type="submit" className={styles.modalSubmitBtn}>
                  Update Password
                </button>
                <button
                  type="button"
                  className={styles.modalCancelBtn}
                  onClick={() => setIsChangePasswordOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Request Tool Modal */}
      {isRequestToolOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsRequestToolOpen(false)}
        >
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Request Tool Access</h3>
              <button
                onClick={() => setIsRequestToolOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer"
                }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRequestToolSubmit} className={styles.modalForm}>
              <div className={styles.modalField}>
                <label className={styles.modalLabel}>Tool Name</label>
                <input
                  type="text"
                  className={styles.modalInput}
                  placeholder="e.g. Jira, GitHub, Notion"
                  value={toolReq.name}
                  onChange={(e) =>
                    setToolReq({ ...toolReq, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className={styles.modalField}>
                <label className={styles.modalLabel}>Justification / Reason</label>
                <textarea
                  className={styles.modalTextarea}
                  placeholder="Why do you need access to this tool?"
                  value={toolReq.reason}
                  onChange={(e) =>
                    setToolReq({ ...toolReq, reason: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className={styles.modalActions}>
                <button type="submit" className={styles.modalSubmitBtn}>
                  Submit Request
                </button>
                <button
                  type="button"
                  className={styles.modalCancelBtn}
                  onClick={() => setIsRequestToolOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Request Device Modal */}
      {isRequestDeviceOpen && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsRequestDeviceOpen(false)}
        >
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Request Device Access</h3>
              <button
                onClick={() => setIsRequestDeviceOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer"
                }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRequestDeviceSubmit} className={styles.modalForm}>
              <div className={styles.modalField}>
                <label className={styles.modalLabel}>Device Type</label>
                <input
                  type="text"
                  className={styles.modalInput}
                  placeholder="e.g. MacBook Air, Monitor, iPad"
                  value={deviceReq.name}
                  onChange={(e) =>
                    setDeviceReq({ ...deviceReq, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className={styles.modalField}>
                <label className={styles.modalLabel}>Reason for Request</label>
                <textarea
                  className={styles.modalTextarea}
                  placeholder="State reason for new device or replacement..."
                  value={deviceReq.reason}
                  onChange={(e) =>
                    setDeviceReq({ ...deviceReq, reason: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className={styles.modalActions}>
                <button type="submit" className={styles.modalSubmitBtn}>
                  Submit Request
                </button>
                <button
                  type="button"
                  className={styles.modalCancelBtn}
                  onClick={() => setIsRequestDeviceOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManagerProfile;
