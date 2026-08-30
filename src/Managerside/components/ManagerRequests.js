import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FolderKanban,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  X,
  ChevronDown,
  XCircle,
  Calendar,
  FileText
} from "lucide-react";
import styles from "../css/ManagerRequests.module.css";
import { toast } from "react-toastify";

export const initialRequests = [
  {
    id: "#1",
    rawId: 1,
    type: "Leave Requests",
    category: "Leave",
    employeeName: "Alex Morgan",
    employeeProfession: "Senior Developer",
    description: "Requested 3 days off for personal reasons. Coverage planned...",
    fullDescription: "Requested 3 days off for personal reasons. Coverage planned...",
    priority: "Urgent",
    status: "Pending",
    submitted: "2025-12-15 10:30 AM",
    submittedFormatted: "December 15, 2025",
    submittedTimeFormatted: "10:30 AM",
    submittedMobile: "Dec 15, 10:30 AM",
    responseFormatted: "December 16, 2025",
    responseTimeFormatted: "11:00 AM",
    reply: "Message..."
  },
  {
    id: "#2",
    rawId: 2,
    type: "Task Change Requests",
    category: "Task Change",
    employeeName: "Sarah Chen",
    employeeProfession: "Product Designer",
    description: "Transitioning UI/UX task to James Wilson due to new priorities.",
    fullDescription: "Transitioning UI/UX task to James Wilson due to new priorities.",
    priority: "Urgent",
    status: "Pending",
    submitted: "2025-12-14 14:20 PM",
    submittedFormatted: "December 14, 2025",
    submittedTimeFormatted: "02:20 PM",
    submittedMobile: "Dec 14, 02:20 PM",
    responseFormatted: "December 15, 2025",
    responseTimeFormatted: "03:00 PM",
    reply: "Message..."
  },
  {
    id: "#3",
    rawId: 3,
    type: "Resource Access",
    category: "Resource",
    employeeName: "James Wilson",
    employeeProfession: "Frontend Engineer",
    description: "Requesting access to the AWS Staging environments.",
    fullDescription: "Requesting access to the AWS Staging environments.",
    priority: "Low",
    status: "Approved",
    submitted: "2025-12-13 09:15 AM",
    submittedFormatted: "December 13, 2025",
    submittedTimeFormatted: "09:15 AM",
    submittedMobile: "Dec 13, 09:15 AM",
    responseFormatted: "December 13, 2025",
    responseTimeFormatted: "07:22 PM",
    reply: "Message..."
  },
  {
    id: "#4",
    rawId: 4,
    type: "Escalation Resolutions",
    category: "Escalation",
    employeeName: "Emily Davis",
    employeeProfession: "Marketing Specialist",
    description: "Project timeline adjustment required following stakeholder feedback.",
    fullDescription: "Project timeline adjustment required following stakeholder feedback.",
    priority: "Medium",
    status: "Pending",
    submitted: "2025-12-12 16:45 PM",
    submittedFormatted: "December 12, 2025",
    submittedTimeFormatted: "04:45 PM",
    submittedMobile: "Dec 12, 04:45 PM",
    responseFormatted: "December 13, 2025",
    responseTimeFormatted: "05:00 PM",
    reply: "Message..."
  },
  {
    id: "#5",
    rawId: 5,
    type: "Leave Requests",
    category: "Leave",
    employeeName: "Lisa Ion",
    employeeProfession: "Marketing Specialist",
    description: "Annual leave request for end-of-year vacation starting December 24.",
    fullDescription: "Annual leave request for end-of-year vacation starting December 24.",
    priority: "Urgent",
    status: "Rejected",
    submitted: "2025-12-16 08:00 AM",
    submittedFormatted: "December 16, 2025",
    submittedTimeFormatted: "08:00 AM",
    submittedMobile: "Dec 16, 08:00 AM",
    responseFormatted: "December 16, 2025",
    responseTimeFormatted: "09:30 AM",
    reply: "Message..."
  },
  {
    id: "#6",
    rawId: 6,
    type: "Task Change Requests",
    category: "Task Change",
    employeeName: "Michael Scott",
    employeeProfession: "Regional Manager",
    description: "Requesting task ownership handover for product launch QA.",
    fullDescription: "Requesting task ownership handover for product launch QA.",
    priority: "Urgent",
    status: "Pending",
    submitted: "2025-12-16 11:15 AM",
    submittedFormatted: "December 16, 2025",
    submittedTimeFormatted: "11:15 AM",
    submittedMobile: "Dec 16, 11:15 AM",
    responseFormatted: "December 17, 2025",
    responseTimeFormatted: "12:00 PM",
    reply: "Message..."
  },
  {
    id: "#7",
    rawId: 7,
    type: "Resource Access",
    category: "Resource",
    employeeName: "David Kim",
    employeeProfession: "Security Engineer",
    description: "Requesting temporary elevated permissions for cluster audit.",
    fullDescription: "Requesting temporary elevated permissions for cluster audit.",
    priority: "Medium",
    status: "Approved",
    submitted: "2025-12-16 14:00 PM",
    submittedFormatted: "December 16, 2025",
    submittedTimeFormatted: "02:00 PM",
    submittedMobile: "Dec 16, 02:00 PM",
    responseFormatted: "December 17, 2025",
    responseTimeFormatted: "03:30 PM",
    reply: "Message..."
  },
  {
    id: "#8",
    rawId: 8,
    type: "Escalation Resolutions",
    category: "Escalation",
    employeeName: "Rachel Zane",
    employeeProfession: "Legal & Compliance",
    description: "Urgent SLA review requested for vendor compliance audit.",
    fullDescription: "Urgent SLA review requested for vendor compliance audit.",
    priority: "Low",
    status: "Pending",
    submitted: "2025-12-17 09:30 AM",
    submittedFormatted: "December 17, 2025",
    submittedTimeFormatted: "09:30 AM",
    submittedMobile: "Dec 17, 09:30 AM",
    responseFormatted: "December 18, 2025",
    responseTimeFormatted: "10:00 AM",
    reply: "Message..."
  }
];

const requestTypeOptions = [
  "Leave Requests",
  "Task Change Requests",
  "Document or Resource Access",
  "Escalation resolutions"
];

function ManagerRequests({ isMobile }) {
  const navigate = useNavigate();
  const [requests, setRequests] = useState(initialRequests);
  const [activeFilter, setActiveFilter] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusModalData, setStatusModalData] = useState(null);

  // Create Request Modal Form State
  const [newType, setNewType] = useState("");
  const [newShortDesc, setNewShortDesc] = useState("");
  const [newDetailedInfo, setNewDetailedInfo] = useState("");
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Stats calculation
  const pendingCount = requests.filter((r) => r.status === "Pending").length;
  const approvedCount = requests.filter((r) => r.status === "Approved").length;
  const urgentCount = requests.filter((r) => r.priority === "Urgent").length;
  const overdueCount = 2;

  const stats = [
    {
      title: "Pending Requests",
      value: pendingCount.toString(),
      subtitle: "+12.5%",
      subtitleColor: "#07DB5F",
      icon: <FolderKanban size={24} />
    },
    {
      title: "Approved Today",
      value: (approvedCount || 12).toString(),
      subtitle: "↗ 8 %",
      subtitleColor: "#07DB5F",
      icon: <CheckCircle2 size={24} />
    },
    {
      title: "Urgent Requests",
      value: urgentCount.toString(),
      subtitle: "Critical",
      subtitleColor: "#FF1F32",
      icon: <AlertTriangle size={24} />
    },
    {
      title: "Overdue Requests",
      value: overdueCount.toString(),
      subtitle: "No Change",
      subtitleColor: "#C6C5D0",
      icon: <Clock size={24} />
    }
  ];

  // Filtering
  const filteredRequests = requests.filter((req) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Leave") return req.category === "Leave" || req.type.toLowerCase().includes("leave");
    if (activeFilter === "Task Change") return req.category === "Task Change" || req.type.toLowerCase().includes("task");
    if (activeFilter === "Resource") return req.category === "Resource" || req.type.toLowerCase().includes("resource") || req.type.toLowerCase().includes("document");
    if (activeFilter === "Escalation") return req.category === "Escalation" || req.type.toLowerCase().includes("escalation");
    return true;
  });

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "Urgent":
        return styles.priorityUrgent;
      case "Medium":
        return styles.priorityMedium;
      case "Low":
        return styles.priorityLow;
      default:
        return styles.priorityLow;
    }
  };

  const renderStatus = (status) => {
    switch (status) {
      case "Pending":
        return (
          <span className={`${styles.statusBadge} ${styles.statusPending}`}>
            <AlertTriangle size={14} /> Pending
          </span>
        );
      case "Approved":
        return (
          <span className={`${styles.statusBadge} ${styles.statusApproved}`} style={{ color: "#07DB5F" }}>
            <CheckCircle2 size={14} color="#07DB5F" /> Approved
          </span>
        );
      case "Rejected":
        return (
          <span className={`${styles.statusBadge} ${styles.statusRejected}`}>
            <XCircle size={14} /> Rejected
          </span>
        );
      default:
        return <span className={styles.statusBadge}>{status}</span>;
    }
  };

  const handleCreateRequest = (e) => {
    e.preventDefault();
    if (!newType) {
      toast.error("Please select a Request Type");
      return;
    }
    if (!newShortDesc.trim()) {
      toast.error("Please enter a short description");
      return;
    }

    let category = "Leave";
    if (newType.includes("Task")) category = "Task Change";
    else if (newType.includes("Resource") || newType.includes("Document")) category = "Resource";
    else if (newType.includes("Escalation")) category = "Escalation";

    const nextId = `#${requests.length + 1}`;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const submittedFormatted = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
    const submittedTimeFormatted = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;

    const newRequestItem = {
      id: nextId,
      rawId: requests.length + 1,
      type: newType,
      category: category,
      employeeName: "Om Vashishtha",
      employeeProfession: "Manager",
      description: newShortDesc.trim(),
      fullDescription: newDetailedInfo.trim() || newShortDesc.trim(),
      priority: "Urgent",
      status: "Approved",
      submitted: formattedDate,
      submittedFormatted: submittedFormatted,
      submittedTimeFormatted: submittedTimeFormatted,
      responseFormatted: submittedFormatted,
      responseTimeFormatted: submittedTimeFormatted,
      reply: "Message..."
    };

    setRequests([newRequestItem, ...requests]);
    setShowCreateModal(false);
    setNewType("");
    setNewShortDesc("");
    setNewDetailedInfo("");
    toast.success("Request submitted successfully!");
  };

  const handleOpenCheckStatus = () => {
    // Find approved request or first request to show
    const approvedItem = requests.find((r) => r.status === "Approved") || requests[0];
    setStatusModalData(approvedItem);
    setShowStatusModal(true);
  };

  const handleRowReview = (req, index) => {
    const itemWithIndex = { ...req, displayIndex: (index !== undefined ? index + 1 : req.rawId || 1) };
    setStatusModalData(itemWithIndex);
    setShowStatusModal(true);
  };

  const getInitials = (name) => {
    if (!name) return "AM";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatSubmitted = (req) => {
    if (req.submittedMobile) return req.submittedMobile;
    if (req.submitted) {
      const parts = req.submitted.split(" ");
      if (parts.length >= 2) {
        const dateParts = parts[0].split("-");
        if (dateParts.length === 3) {
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const mIdx = parseInt(dateParts[1], 10) - 1;
          const month = months[mIdx] || "Dec";
          const day = dateParts[2];
          const time = parts.slice(1).join(" ");
          return `${month} ${day}, ${time}`;
        }
      }
    }
    return req.submittedFormatted || "Dec 15, 10:30 AM";
  };

  return (
    <div className={styles.requestsContainer}>
      {/* Header Row */}
      <div className={styles.headerRow}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Request Approvals</h1>
          <p className={styles.subtitle}>
            Manage team requests, approvals, escalations, and response workflows.
          </p>
        </div>
        <div className={styles.headerRight}>
          <button 
            className={styles.supportBtn}
            onClick={() => navigate("/manager/support-ticket")}
          >
            Support Ticket
          </button>
          <button 
            className={styles.statusBtn}
            onClick={handleOpenCheckStatus}
          >
            Check Status
          </button>
          <button
            className={styles.createBtn}
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={14} /> Create Request
          </button>
        </div>
      </div>

      {/* Stat Cards (Same layout & CSS as ManagerPerformance with #07DB5F green) */}
      <section className={styles.statsGrid}>
        {stats.map((stat, idx) => (
          <div key={idx} className={styles.statCard}>
            <div className={styles.statCardTop}>
              <span className={styles.statTitle}>{stat.title}</span>
              {stat.icon && (
                <div className={styles.statIconWrap}>{stat.icon}</div>
              )}
            </div>
            <div className={styles.statCardMiddle}>
              <div className={styles.statValue}>{stat.value}</div>
            </div>
            <div className={styles.statCardBottom}>
              <span
                className={styles.statSubtext}
                style={{ color: stat.subtitleColor }}
              >
                {stat.subtitle}
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* All Requests Box (Matching ManagerWork list view) */}
      <div className={styles.requestsBox}>
        <div className={styles.requestsBoxHeader}>
          <h2 className={styles.boxTitle}>All Requests</h2>
          <div className={styles.filterPills}>
            {["All", "Leave", "Task Change", "Resource", "Escalation"].map(
              (tab) => (
                <button
                  key={tab}
                  className={`${styles.filterPill} ${
                    activeFilter === tab ? styles.activeFilter : ""
                  }`}
                  onClick={() => setActiveFilter(tab)}
                >
                  {tab}
                </button>
              )
            )}
          </div>
        </div>

        <div className={styles.tableContainer}>
          {/* Desktop & Tablet Table */}
          <div className={styles.tableScroll}>
            <div className={styles.tableInner}>
              <div className={styles.tableHeader}>
                <div>Ticket ID</div>
                <div>Type</div>
                <div>Employee</div>
                <div>Description</div>
                <div>Priority</div>
                <div>Status</div>
                <div>Submitted</div>
                <div>Actions</div>
              </div>

              <div className={styles.tableBody}>
                {filteredRequests.map((req, index) => (
                  <div key={req.id || index} className={styles.tableRow}>
                    <div className={styles.colTicketId}>#{index + 1}</div>
                    <div className={styles.colType}>{req.type}</div>
                    <div className={styles.colEmployee}>
                      <span className={styles.employeeName}>
                        {req.employeeName}
                      </span>
                      <span className={styles.employeeProfession}>
                        {req.employeeProfession}
                      </span>
                    </div>
                    <div className={styles.colDesc}>{req.description}</div>
                    <div className={styles.colPriority}>
                      <span className={getPriorityClass(req.priority)}>
                        {req.priority}
                      </span>
                    </div>
                    <div className={styles.colStatus}>
                      {renderStatus(req.status)}
                    </div>
                    <div className={styles.colSubmitted}>
                      <span className={styles.submittedDate}>
                        {req.submitted.split(" ")[0]}
                      </span>
                      <span className={styles.submittedTime}>
                        {req.submitted.split(" ").slice(1).join(" ")}
                      </span>
                    </div>
                    <div className={styles.colActions}>
                      <button
                        className={styles.reviewBtn}
                        onClick={() => handleRowReview(req, index)}
                      >
                        Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Figma Card List */}
          <div className={styles.mobileCardList}>
            {filteredRequests.map((req, index) => (
              <div 
                key={req.id || index} 
                className={styles.mobileCard}
                onClick={() => handleRowReview(req, index)}
              >
                <div className={styles.mobileCardHeader}>
                  <div className={styles.mobileCardTitleGroup}>
                    <span className={styles.mobileTicketNum}>#{index + 1}</span>
                    <span className={styles.mobileRequestType}>{req.type}</span>
                  </div>
                  <div className={
                    req.status === "Approved" 
                      ? styles.mobileStatusApproved 
                      : req.status === "Rejected"
                      ? styles.mobileStatusRejected
                      : styles.mobileStatusPending
                  }>
                    {req.status.toUpperCase()}
                  </div>
                </div>

                <div className={styles.mobileEmployeeRow}>
                  <div className={styles.mobileAvatar}>
                    {getInitials(req.employeeName)}
                  </div>
                  <div className={styles.mobileEmployeeInfo}>
                    <span className={styles.mobileEmployeeName}>{req.employeeName}</span>
                    <span className={styles.mobileEmployeeRole}>{req.employeeProfession}</span>
                  </div>
                </div>

                <div className={styles.mobileCardDesc}>
                  {req.fullDescription || req.description}
                </div>

                <div className={styles.mobileCardFooter}>
                  <div className={styles.mobileFooterCol}>
                    <span className={styles.mobileMetaLabel}>PRIORITY</span>
                    <span className={
                      req.priority === "Urgent" 
                        ? styles.mobilePrioUrgent 
                        : req.priority === "Medium"
                        ? styles.mobilePrioMedium
                        : styles.mobilePrioLow
                    }>
                      {req.priority.toUpperCase()}
                    </span>
                  </div>
                  <div className={`${styles.mobileFooterCol} ${styles.mobileFooterColRight}`}>
                    <span className={styles.mobileMetaLabel}>SUBMITTED</span>
                    <span className={styles.mobileMetaValue}>{formatSubmitted(req)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leave Request Status Modal (Matching user screenshot with #07DB5F green) */}
      {showStatusModal && statusModalData && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowStatusModal(false)}
        >
          <div
            className={styles.statusModalCard}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader} style={{ marginBottom: "2px" }}>
              <h2 className={styles.modalTitle} style={{ fontSize: "12px", margin: 0 }}>
                {statusModalData.type.includes("Leave") ? "Leave Request Status" : `${statusModalData.type} Status`}
              </h2>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setShowStatusModal(false)}
                title="Close"
                style={{ width: "18px", height: "18px" }}
              >
                <X size={12} />
              </button>
            </div>

            {/* Status Header Box */}
            <div className={styles.statusHeaderBox}>
              <span className={styles.statusLabelText}>Status:</span>
              <span className={
                statusModalData.status === "Approved" 
                  ? styles.statusPillApproved 
                  : statusModalData.status === "Pending"
                  ? styles.statusPillPending
                  : styles.statusPillRejected
              }>
                {statusModalData.status}
              </span>
            </div>

            {/* Date Cards Grid */}
            <div className={styles.statusDatesGrid}>
              <div className={styles.statusDateCard}>
                <div className={styles.statusCardHeader}>
                  <Calendar size={10} color="#94a3b8" />
                  <span>Submitted Date</span>
                </div>
                <div className={styles.statusDateValue}>
                  {statusModalData.submittedFormatted || "December 11, 2025"}
                </div>
                <div className={styles.statusTimeValue}>
                  {statusModalData.submittedTimeFormatted || "07:22 PM"}
                </div>
              </div>

              <div className={styles.statusDateCard}>
                <div className={styles.statusCardHeader}>
                  <Calendar size={10} color="#94a3b8" />
                  <span>Response Date</span>
                </div>
                <div className={styles.statusDateValue}>
                  {statusModalData.responseFormatted || "December 13, 2025"}
                </div>
                <div className={styles.statusTimeValue}>
                  {statusModalData.responseTimeFormatted || "07:22 PM"}
                </div>
              </div>
            </div>

            {/* Request Details */}
            <div className={styles.statusDetailsCard}>
              <div className={styles.statusCardHeader}>
                <FileText size={10} color="#94a3b8" />
                <span>Request Details</span>
              </div>
              <div className={styles.statusDetailsContent}>
                {statusModalData.fullDescription || "Message..."}
              </div>
            </div>

            {/* Reply */}
            <div className={styles.statusDetailsCard}>
              <div className={styles.statusCardHeader}>
                <FileText size={10} color="#94a3b8" />
                <span>Reply</span>
              </div>
              <div className={styles.statusDetailsContent}>
                {statusModalData.reply || "Message..."}
              </div>
            </div>

            {/* Bottom Approval Banner with #07DB5F green */}
            <div className={styles.statusApprovalBanner}>
              {statusModalData.status === "Approved" ? (
                <span>Your request has been approved!</span>
              ) : statusModalData.status === "Rejected" ? (
                <span style={{ color: "#ef4444" }}>Your request has been rejected.</span>
              ) : (
                <span style={{ color: "#f59e0b" }}>Your request is pending review.</span>
              )}
            </div>
          </div>
        </div>
      )}



      {/* Create Request Modal (Exact same CSS, background, and responsive behaviour as Quick Assign Task box) */}
      {showCreateModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Create Request</h2>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setShowCreateModal(false)}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form className={styles.modalForm} onSubmit={handleCreateRequest}>
              {/* Request Type Custom Dropdown */}
              <div className={styles.modalField} ref={dropdownRef}>
                <label className={styles.modalLabel}>Request Type *</label>
                <div className={styles.customSelectContainer}>
                  <div
                    className={`${styles.customSelectHeader} ${
                      openDropdown ? styles.customSelectHeaderOpen : ""
                    }`}
                    onClick={() => setOpenDropdown(!openDropdown)}
                  >
                    <span style={{ color: newType ? "#ffffff" : "#64748b" }}>
                      {newType || "Select Request Type"}
                    </span>
                    <ChevronDown size={14} style={{ color: "#94a3b8" }} />
                  </div>

                  {openDropdown && (
                    <div className={styles.customSelectDropdown}>
                      {requestTypeOptions.map((opt) => (
                        <div
                          key={opt}
                          className={`${styles.customSelectOption} ${
                            newType === opt ? styles.customSelectOptionSelected : ""
                          }`}
                          onClick={() => {
                            setNewType(opt);
                            setOpenDropdown(false);
                          }}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Short Description */}
              <div className={styles.modalField}>
                <label className={styles.modalLabel}>Short Description *</label>
                <input
                  type="text"
                  className={styles.modalInput}
                  placeholder="Enter short description..."
                  value={newShortDesc}
                  onChange={(e) => setNewShortDesc(e.target.value)}
                  required
                />
              </div>

              {/* Detailed Information */}
              <div className={styles.modalField}>
                <label className={styles.modalLabel}>Detailed Information</label>
                <textarea
                  className={styles.modalTextarea}
                  rows={4}
                  placeholder="Enter detailed information..."
                  value={newDetailedInfo}
                  onChange={(e) => setNewDetailedInfo(e.target.value)}
                />
              </div>

              {/* Actions: Submit Request (blue, flex-1) and Cancel */}
              <div className={styles.modalActions}>
                <button
                  type="submit"
                  className={styles.modalSubmitBtn}
                  style={{ flex: 1 }}
                >
                  Submit Request
                </button>
                <button
                  type="button"
                  className={styles.modalCancelBtn}
                  onClick={() => setShowCreateModal(false)}
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

export default ManagerRequests;
