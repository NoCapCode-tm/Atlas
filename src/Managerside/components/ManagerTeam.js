import React, { useState, useEffect, useRef } from "react";
import styles from "../css/ManagerTeam.module.css";
import headerStyles from "../css/ManagerHeader.module.css";
import {
  Users,
  TrendingUp,
  CheckCircle,
  Zap,
  Plus,
  Download,
  X,
  ChevronDown,
  AlertCircle,
  Clock,
  Briefcase,
  Upload,
  BarChart2,
  FileText,
  User
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine
} from "recharts";
import { toast } from "react-toastify";

function ManagerTeam({ mobileAction, isMobile }) {
  const [members, setMembers] = useState([
    { name: "Alex Morgan", email: "alex.m@company.com", role: "Senior Developer", score: 98, assigned: 12, status: "online", initials: "AM" },
    { name: "Sarah Chen", email: "sarah.c@company.com", role: "Product Designer", score: 92, assigned: 8, status: "offline", initials: "SC" },
    { name: "James Wilson", email: "james.w@company.com", role: "Frontend Engineer", score: 88, assigned: 15, status: "away", initials: "JW" },
    { name: "Emily Davis", email: "emily.d@company.com", role: "Marketing Specialist", score: 95, assigned: 10, status: "online", initials: "ED" },
    { name: "Michael Green", email: "michael.g@company.com", role: "Backend Developer", score: 85, assigned: 10, status: "online", initials: "MG" },
    { name: "Emily Davis", email: "emily.d@company.com", role: "Marketing Specialist", score: 95, assigned: 10, status: "online", initials: "ED" },
    { name: "Emily Davis", email: "emily.d@company.com", role: "Marketing Specialist", score: 95, assigned: 10, status: "online", initials: "ED" },
    { name: "Emily Davis", email: "emily.d@company.com", role: "Marketing Specialist", score: 95, assigned: 10, status: "online", initials: "ED" },
    { name: "Emily Davis", email: "emily.d@company.com", role: "Marketing Specialist", score: 91, assigned: 7, status: "online", initials: "ED" },
    { name: "Emily Davis", email: "emily.d@company.com", role: "Marketing Specialist", score: 87, assigned: 9, status: "offline", initials: "ED" },
    { name: "Emily Davis", email: "emily.d@company.com", role: "Marketing Specialist", score: 93, assigned: 11, status: "away", initials: "ED" },
    { name: "Emily Davis", email: "emily.d@company.com", role: "Marketing Specialist", score: 89, assigned: 6, status: "online", initials: "ED" }
  ]);

  const [activities, setActivities] = useState([
    { user: "Alex Morgan", action: "completed task", task: "API Integration", time: "10 MINS AGO", type: "success" },
    { user: "Sarah Chen", action: "updated design", task: "Dashboard UI", time: "25 MINS AGO", type: "info" },
    { user: "James Wilson", action: "flagged issue", task: "Login Bug", time: "1 HOUR AGO", type: "warning" },
    { user: "Emily Davis", action: "scheduled meeting", task: "Weekly Sync", time: "2 HOURS AGO", type: "purple" }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [timePeriod, setTimePeriod] = useState("Last 30 Days");
  const [exportFormat, setExportFormat] = useState("PDF");
  const [sections, setSections] = useState({
    performance: true,
    workload: true,
    activity: true
  });
  const [openDropdown, setOpenDropdown] = useState(null);
  const roleRef = useRef(null);
  const accessRef = useRef(null);
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (roleRef.current && !roleRef.current.contains(event.target)) &&
        (accessRef.current && !accessRef.current.contains(event.target))
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "Select role",
    access: "Member",
    score: 95,
    assigned: 10,
    status: "online"
  });

  const avgPerformance = (
    members.reduce((sum, member) => sum + member.score, 0) / members.length
  ).toFixed(1);

  const handleExport = () => {
    try {
      const headers = ["Name", "Email", "Role", "Score", "Assigned Tasks", "Status"];
      const csvRows = [
        headers.join(","),
        ...members.map(m => `"${m.name}","${m.email}","${m.role}",${m.score},${m.assigned},"${m.status}"`)
      ];
      const csvBlob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(csvBlob);
      link.setAttribute("download", `Team_Performance_Report_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("CSV Report exported successfully!");
    } catch (err) {
      toast.error("Failed to export CSV report");
    }
    setShowExportModal(false);
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email) {
      toast.error("Please enter first name, last name, and email");
      return;
    }

    const fullName = `${form.firstName} ${form.lastName}`;

    const initials = fullName
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const newMember = {
      name: fullName,
      email: form.email,
      role: form.role === "Select role" ? "Senior Developer" : form.role,
      score: Number(form.score),
      assigned: Number(form.assigned),
      status: form.status,
      initials: initials || "EE"
    };

    setMembers(prev => [...prev, newMember]);

    // Add dynamic activity timeline entry for adding the member
    const newActivity = {
      user: newMember.name,
      action: "joined the team",
      task: `as ${newMember.role}`,
      time: "JUST NOW",
      type: "info"
    };
    setActivities(prev => [newActivity, ...prev]);

    setShowAddModal(false);
    setOpenDropdown(null);
    setProfileImage(null);
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      role: "Select role",
      access: "Member",
      score: 95,
      assigned: 10,
      status: "online"
    });
    toast.success("Team member added successfully!");
  };

  useEffect(() => {
    const handleExportEvent = () => {
      handleExport();
    };
    const handleAddMemberEvent = () => {
      setShowAddModal(true);
    };

    window.addEventListener("export-team-report", handleExportEvent);
    window.addEventListener("open-add-member-modal", handleAddMemberEvent);

    return () => {
      window.removeEventListener("export-team-report", handleExportEvent);
      window.removeEventListener("open-add-member-modal", handleAddMemberEvent);
    };
  }, [members]);

  // Recharts Area Chart Data
  const workloadData = [
    { name: "Mon", workload: 65 },
    { name: "Tue", workload: 72 },
    { name: "Wed", workload: 86 },
    { name: "Thu", workload: 75 },
    { name: "Fri", workload: 60 },
    { name: "", workload: 70 }
  ];

  // Recharts Bar Chart Data (uses first 5 members dynamically)
  const barData = members.slice(0, 5).map(m => ({
    name: m.name.split(" ")[0],
    score: m.score
  }));

  const getTimelineIcon = (type) => {
    switch (type) {
      case "success":
        return (
          <div className={styles.timelineIconWrapper}>
            <CheckCircle size={14} className={styles.iconSuccessSvg} />
          </div>
        );
      case "warning":
        return (
          <div className={styles.timelineIconWrapper}>
            <AlertCircle size={14} className={styles.iconWarningSvg} />
          </div>
        );
      case "purple":
        return (
          <div className={styles.timelineIconWrapper}>
            <Clock size={14} className={styles.iconPurpleSvg} />
          </div>
        );
      case "info":
      default:
        return (
          <div className={styles.timelineIconWrapper}>
            <Briefcase size={14} className={styles.iconInfoSvg} />
          </div>
        );
    }
  };

  return (
    <>
      {/* Sub Header for Page actions (Export & Add) */}
      <div className={styles.pageHeader}>
        <div className={headerStyles.headerTitleGroup}>
          <h2 className={headerStyles.headerTitle}>My Team</h2>
          {!isMobile && <p className={headerStyles.headerSubtitle}>Manage your team's performance and workload.</p>}
        </div>
        <div className={`${headerStyles.headerActions} ${styles.teamHeaderActions}`}>
          {mobileAction}
          <button className={styles.exportBtn} onClick={() => setShowExportModal(true)}>
            <Download size={16} />
            <span>Export Report</span>
          </button>
          <button className={styles.addBtn} onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statCardTop}>
            <span className={styles.statTitle}>Total Team Members</span>
          </div>
          <div className={styles.statCardMiddle}>
            <div className={styles.statValue}>{members.length}</div>
            <div className={styles.statIconWrap}>
              <Users size={24} />
            </div>
          </div>
          <div className={styles.statCardBottom}>
            <span className={styles.statSubtext}>+2 since last month</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardTop}>
            <span className={styles.statTitle}>Avg Performance</span>
          </div>
          <div className={styles.statCardMiddle}>
            <div className={styles.statValue}>{avgPerformance}</div>
            <div className={styles.statIconWrap}>
              <Zap size={24} />
            </div>
          </div>
          <div className={styles.statCardBottom}>
            <span className={styles.statSubtext} style={{ color: "#10b981", fontWeight: "600" }}>↗ +4.1% from last review</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardTop}>
            <span className={styles.statTitle}>Tasks Completed</span>
          </div>
          <div className={styles.statCardMiddle}>
            <div className={styles.statValue}>145</div>
            <div className={styles.statIconWrap}>
              <CheckCircle size={24} />
            </div>
          </div>
          <div className={styles.statCardBottom}>
            <span className={styles.statSubtext}>85% of assigned tasks</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardTop}>
            <span className={styles.statTitle}>Team Velocity</span>
          </div>
          <div className={styles.statCardMiddle}>
            <div className={styles.statValue}>24.5</div>
            <div className={styles.statIconWrap}>
              <TrendingUp size={24} />
            </div>
          </div>
          <div className={styles.statCardBottom}>
            <span className={styles.statSubtext}>Story points per sprint</span>
          </div>
        </div>
      </section>

      {/* Main grid containing lists and charts */}
      <div className={styles.dashboardMainGrid}>
        {/* Lists Row (Members List & Activity Timeline) */}
        <div className={`${styles.gridRow} ${styles.rowEqualColumns}`}>
          {/* Left Side: Team Members List */}
          <div className={styles.cardBlock}>
            <div className={styles.memberCardHeader}>
              <h3 className={styles.cardTitle}>Team Members List</h3>
              <p className={styles.cardSubtitle}>All direct employees + interns</p>
            </div>

            <div className={styles.tableResponsive}>
              <div className={styles.listHeader}>
                <span>Name</span>
                <span>Role</span>
                <span>Score</span>
                <span>Assigned</span>
              </div>

              <div className={styles.scrollContainer}>
                {members.map((member, index) => (
                  <div key={index} className={styles.listRow}>
                    <div className={styles.memberCol}>
                      <div className={styles.avatarWrapper}>
                        <User size={isMobile ? 16 : 14} color="#94a3b8" />
                        <span className={`${styles.statusDot} ${styles[member.status]}`} />
                      </div>
                      <div className={styles.memberMeta}>
                        <span className={styles.memberName}>{member.name}</span>
                        <span className={styles.memberEmail}>{member.email}</span>
                      </div>
                    </div>

                    <div className={styles.roleCol}>
                      <span className={styles.rolePill}>{member.role}</span>
                    </div>

                    <div className={styles.scoreCol}>
                      <span className={member.score >= 90 ? styles.scoreGreen : member.score >= 80 ? styles.scorePurple : styles.scoreNormal}>
                        {member.score}
                      </span>
                    </div>

                    <div className={styles.assignedCol}>
                      {member.assigned}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Activity Timeline */}
          <div className={styles.cardBlock}>
            <div className={styles.timelineCardHeader}>
              <h3 className={styles.cardTitle}>Activity Timeline</h3>
              <p className={styles.cardSubtitle}>Log of team actions</p>
            </div>

            <div className={styles.scrollContainer}>
              <div className={styles.timelineColumns}>
                <div className={styles.timelineList}>
                  {activities.map((act, index) => (
                    <div key={index} className={styles.timelineItem}>
                      {getTimelineIcon(act.type)}
                      <div className={styles.timelineDetails}>
                        <div className={styles.timelineUser}>{act.user}</div>
                        <span className={styles.timelineAction}>{act.action}</span>
                        <div className={styles.timelineTask}>{act.task}</div>
                        <div className={styles.timelineTime}>{act.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.timelineList}>
                  {activities.map((act, index) => (
                    <div key={index} className={styles.timelineItem}>
                      {getTimelineIcon(act.type)}
                      <div className={styles.timelineDetails}>
                        <div className={styles.timelineUser}>{act.user}</div>
                        <span className={styles.timelineAction}>{act.action}</span>
                        <div className={styles.timelineTask}>{act.task}</div>
                        <div className={styles.timelineTime}>{act.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row (Charts) */}
        <div className={`${styles.gridRow} ${styles.rowEqualColumns}`}>
          {/* Role & Workload View Chart */}
          <div className={styles.cardBlock}>
            <div className={styles.memberCardHeader}>
              <h3 className={styles.cardTitle}>Role & Workload View</h3>
              <p className={styles.cardSubtitle}>Task load vs Free capacity</p>
            </div>
            <div className={styles.chartWrapper}>
              <ResponsiveContainer width="100%" height={250} minWidth={0}>
                <AreaChart data={workloadData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="workloadGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6d78ff" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#2035ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <ReferenceLine y={100} stroke="rgba(255, 255, 255, 0.08)" strokeWidth={1} />
                  <ReferenceLine segment={[{ x: 'Mon', y: 75 }, { x: 'Thu', y: 75 }]} stroke="rgba(255, 255, 255, 0.08)" strokeWidth={1} />
                  <ReferenceLine segment={[{ x: 'Mon', y: 50 }, { x: 'Thu', y: 50 }]} stroke="rgba(255, 255, 255, 0.08)" strokeWidth={1} />
                  <ReferenceLine segment={[{ x: 'Mon', y: 25 }, { x: 'Thu', y: 25 }]} stroke="rgba(255, 255, 255, 0.08)" strokeWidth={1} />
                  <ReferenceLine segment={[{ x: 'Mon', y: 0 }, { x: 'Thu', y: 0 }]} stroke="rgba(255, 255, 255, 0.08)" strokeWidth={1} />
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11, dx: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />

                  <Area type="monotone" dataKey="workload" stroke="#6d78ff" strokeWidth={3} fillOpacity={1} fill="url(#workloadGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Team Comparison Chart */}
          <div className={styles.cardBlock}>
            <div className={styles.memberCardHeader}>
              <h3 className={styles.cardTitle}>Team Comparison</h3>
              <p className={styles.cardSubtitle}>Productivity scores</p>
            </div>
            <div className={styles.chartWrapper}>
              <ResponsiveContainer width="100%" height={250} minWidth={0}>
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="rgba(255, 255, 255, 0.2)" strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />

                  <Bar dataKey="score" fill="#0052cc" radius={[6, 6, 0, 0]} barSize={56} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Add Member Modal Dialog */}
      {showAddModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>+ Add New Member</h3>
                <p className={styles.modalSubtitle}>Invite a new team member to your dashboard. They'll receive an email with login instructions.</p>
              </div>
              <button className={styles.modalCloseBtn} onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddMember} className={styles.modalForm}>
              <div className={styles.modalRow}>
                <div className={styles.modalField}>
                  <label className={styles.modalLabel}>First name</label>
                  <input
                    type="text"
                    required
                    placeholder="Alice"
                    className={styles.modalInput}
                    value={form.firstName}
                    onChange={(e) => setForm(f => ({ ...f, firstName: e.target.value }))}
                  />
                </div>

                <div className={styles.modalField}>
                  <label className={styles.modalLabel}>Last name</label>
                  <input
                    type="text"
                    required
                    placeholder="Smith"
                    className={styles.modalInput}
                    value={form.lastName}
                    onChange={(e) => setForm(f => ({ ...f, lastName: e.target.value }))}
                  />
                </div>
              </div>

              <div className={styles.modalField}>
                <label className={styles.modalLabel}>Email address</label>
                <input
                  type="email"
                  required
                  placeholder="alice.smith@company.com"
                  className={styles.modalInput}
                  value={form.email}
                  onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                />
              </div>

              <div className={styles.modalRow}>
                <div className={styles.modalField} ref={roleRef}>
                  <label className={styles.modalLabel}>Role</label>
                  <div className={styles.customSelectContainer}>
                    <div
                      className={`${styles.customSelectHeader} ${openDropdown === "role" ? styles.customSelectHeaderOpen : ""}`}
                      onClick={() => setOpenDropdown(openDropdown === "role" ? null : "role")}
                    >
                      <span style={{ color: form.role !== "Select role" ? "#ffffff" : "#94a3b8" }}>
                        {form.role}
                      </span>
                      <ChevronDown size={14} style={{ color: "#94a3b8" }} />
                    </div>
                    {openDropdown === "role" && (
                      <div className={styles.customSelectDropdown}>
                        {["Senior Developer", "Product Designer", "Frontend Engineer", "Marketing Specialist", "Data Analyst", "QA Engineer"].map((item) => (
                          <div
                            key={item}
                            className={`${styles.customSelectOption} ${form.role === item ? styles.customSelectOptionSelected : ""}`}
                            onClick={() => {
                              setForm((f) => ({ ...f, role: item }));
                              setOpenDropdown(null);
                            }}
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.modalField} ref={accessRef}>
                  <label className={styles.modalLabel}>Access Level</label>
                  <div className={styles.customSelectContainer}>
                    <div
                      className={`${styles.customSelectHeader} ${openDropdown === "access" ? styles.customSelectHeaderOpen : ""}`}
                      onClick={() => setOpenDropdown(openDropdown === "access" ? null : "access")}
                    >
                      <span style={{ color: form.access ? "#ffffff" : "#94a3b8" }}>
                        {form.access || "Member"}
                      </span>
                      <ChevronDown size={14} style={{ color: "#94a3b8" }} />
                    </div>
                    {openDropdown === "access" && (
                      <div className={styles.customSelectDropdown}>
                        {["Member", "Manager", "Admin"].map((item) => (
                          <div
                            key={item}
                            className={`${styles.customSelectOption} ${form.access === item ? styles.customSelectOptionSelected : ""}`}
                            onClick={() => {
                              setForm((f) => ({ ...f, access: item }));
                              setOpenDropdown(null);
                            }}
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.modalField}>
                <label className={styles.modalLabel}>Profile Image (Optional)</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/svg+xml,image/png,image/jpeg,image/gif"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) setProfileImage(file);
                  }}
                />
                <div
                  className={styles.uploadZone}
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                >
                  <Upload size={20} className={styles.uploadIcon} />
                  {profileImage ? (
                    <p className={styles.uploadText} style={{ color: "#818cf8" }}>
                      ✓ {profileImage.name}
                    </p>
                  ) : (
                    <>
                      <p className={styles.uploadText}>
                        <strong>Click to upload</strong> or drag and drop
                      </p>
                      <p className={styles.uploadSubtext}>
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.modalCancelBtn} onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.modalSubmitBtn}>
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Export Report Modal */}
      {showExportModal && (
        <div className={styles.modalOverlay} onClick={() => setShowExportModal(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>
                  <BarChart2 size={14} style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />
                  Export Team Data
                </h3>
                <p className={styles.modalSubtitle}>Customize and download performance reports for your team.</p>
              </div>
              <button className={styles.modalCloseBtn} onClick={() => setShowExportModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className={styles.modalForm}>
              {/* Time Period */}
              <div className={styles.modalField}>
                <label className={styles.modalLabel}>Time Period</label>
                <div className={styles.customSelectContainer}>
                  <div
                    className={`${styles.customSelectHeader} ${openDropdown === "timePeriod" ? styles.customSelectHeaderOpen : ""}`}
                    onClick={() => setOpenDropdown(openDropdown === "timePeriod" ? null : "timePeriod")}
                  >
                    <span style={{ color: "#ffffff" }}>{timePeriod}</span>
                    <ChevronDown size={14} style={{ color: "#94a3b8" }} />
                  </div>
                  {openDropdown === "timePeriod" && (
                    <div className={styles.customSelectDropdown}>
                      {["Last 7 Days", "Last 30 Days", "Last 90 Days", "This Year"].map((item) => (
                        <div
                          key={item}
                          className={`${styles.customSelectOption} ${timePeriod === item ? styles.customSelectOptionSelected : ""}`}
                          onClick={() => { setTimePeriod(item); setOpenDropdown(null); }}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Export Format */}
              <div className={styles.modalField}>
                <label className={styles.modalLabel}>Export Format</label>
                <div className={styles.modalRow}>
                  <div
                    onClick={() => setExportFormat("PDF")}
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                      gap: 6, padding: "14px 10px", borderRadius: 8, cursor: "pointer",
                      border: `1.5px solid ${exportFormat === "PDF" ? "#2563eb" : "rgba(255,255,255,0.22)"}`,
                      background: exportFormat === "PDF" ? "rgba(37,99,235,0.18)" : "transparent",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <FileText size={20} style={{ color: exportFormat === "PDF" ? "#93c5fd" : "#94a3b8" }} />
                    <span style={{ fontFamily: "Outfit,sans-serif", fontSize: 10.5, fontWeight: 600, color: exportFormat === "PDF" ? "#ffffff" : "#94a3b8" }}>PDF Report</span>
                  </div>
                  <div
                    onClick={() => setExportFormat("CSV")}
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                      gap: 6, padding: "14px 10px", borderRadius: 8, cursor: "pointer",
                      border: `1.5px solid ${exportFormat === "CSV" ? "#2563eb" : "rgba(255,255,255,0.22)"}`,
                      background: exportFormat === "CSV" ? "rgba(37,99,235,0.18)" : "transparent",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <BarChart2 size={20} style={{ color: exportFormat === "CSV" ? "#93c5fd" : "#94a3b8" }} />
                    <span style={{ fontFamily: "Outfit,sans-serif", fontSize: 10.5, fontWeight: 600, color: exportFormat === "CSV" ? "#ffffff" : "#94a3b8" }}>CSV / Excel</span>
                  </div>
                </div>
              </div>

              {/* Include Sections */}
              <div className={styles.modalField}>
                <label className={styles.modalLabel}>Include Sections</label>
                {[
                  { key: "performance", label: "Team Performance Stats" },
                  { key: "workload", label: "Workload Analysis" },
                  { key: "activity", label: "Detailed Activity Logs" }
                ].map(({ key, label }) => (
                  <div
                    key={key}
                    onClick={() => setSections(s => ({ ...s, [key]: !s[key] }))}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "8px 12px", borderRadius: 8, cursor: "pointer", marginBottom: 4,
                      border: "1.5px solid rgba(255,255,255,0.22)",
                      background: sections[key] ? "rgba(255,255,255,0.03)" : "transparent",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <CheckCircle
                      size={14}
                      style={{ color: sections[key] ? "#2563eb" : "#4f5a72", flexShrink: 0 }}
                    />
                    <span style={{ fontFamily: "Outfit,sans-serif", fontSize: 10.5, color: "#ffffff" }}>{label}</span>
                  </div>
                ))}
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.modalCancelBtn} onClick={() => setShowExportModal(false)}>
                  Cancel
                </button>
                <button type="button" className={styles.modalSubmitBtn} onClick={handleExport}>
                  Download Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ManagerTeam;
