import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  AlertCircle,
  Clock,
  CheckCircle2,
  Plus,
  X,
  User,
  ChevronDown
} from "lucide-react";
import styles from "../css/ManagerSupportTicket.module.css";
import { toast } from "react-toastify";

export const initialTickets = [
  {
    id: "#1001",
    rawId: 1001,
    title: "Payroll Discrepancy - November",
    status: "Open",
    priority: "High",
    assignedTo: "HR Admin",
    createdBy: "Michael Chen",
    created: "2025-12-15 10:30",
    description: "November payroll payout does not reflect the approved overtime bonus from the sprint deployment."
  },
  {
    id: "#1002",
    rawId: 1002,
    title: "Leave Balance Inquiry",
    status: "In Progress",
    priority: "Medium",
    assignedTo: "Sarah Williams",
    createdBy: "Priscilla",
    created: "2025-12-14 14:20",
    description: "Annual PTO balance is showing 12 days instead of the rolled-over 15 days from previous quarter."
  },
  {
    id: "#1003",
    rawId: 1003,
    title: "Performance Review Access",
    status: "Resolved",
    priority: "Low",
    assignedTo: "IT Support",
    createdBy: "Alex Morgan",
    created: "2025-12-13 09:15",
    description: "User unable to view team appraisal feedback forms due to SSO permission grouping on staging portal."
  },
  {
    id: "#1004",
    rawId: 1004,
    title: "Benefits Enrollment Question",
    status: "Open",
    priority: "Medium",
    assignedTo: "HR Admin",
    createdBy: "Emily Davis",
    created: "2025-12-12 16:43",
    description: "Inquiring about healthcare insurance extension for eligible dependents under the updated corporate plan."
  }
];

function ManagerSupportTicket({ isMobile }) {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState(initialTickets);
  const [activeFilter, setActiveFilter] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    priority: "Medium",
    assignedTo: "HR Admin",
    description: ""
  });

  const [openDropdown, setOpenDropdown] = useState(null); // 'priority' | 'assign' | null
  const priorityDropdownRef = useRef(null);
  const assignDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        priorityDropdownRef.current &&
        !priorityDropdownRef.current.contains(event.target) &&
        assignDropdownRef.current &&
        !assignDropdownRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculate dynamic stats
  const openCount = tickets.filter((t) => t.status === "Open").length;
  const inProgressCount = tickets.filter((t) => t.status === "In Progress").length;
  const resolvedCount = tickets.filter((t) => t.status === "Resolved").length;

  const filterTabs = isMobile
    ? ["All", "Open", "Resolved"]
    : ["All", "Open", "In Progress", "Resolved"];

  const filteredTickets = tickets.filter((ticket) => {
    if (activeFilter === "All") return true;
    return ticket.status.toLowerCase() === activeFilter.toLowerCase();
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "Open":
        return <AlertCircle size={14} color="#0759D9" />;
      case "In Progress":
        return <Clock size={14} color="#FF8A00" />;
      case "Resolved":
        return <CheckCircle2 size={14} color="#00D66F" />;
      default:
        return <AlertCircle size={14} color="#0759D9" />;
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "High":
        return styles.priorityHigh;
      case "Medium":
        return styles.priorityMedium;
      case "Low":
      default:
        return styles.priorityLow;
    }
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please enter a ticket title.");
      return;
    }

    const nextId = `#${1000 + tickets.length + 1}`;
    const newTicket = {
      id: nextId,
      rawId: 1000 + tickets.length + 1,
      title: formData.title,
      status: "Open",
      priority: formData.priority,
      assignedTo: formData.assignedTo || "HR Admin",
      createdBy: "Om Vashishtha",
      created: new Date().toISOString().replace("T", " ").slice(0, 16),
      description: formData.description || "Support ticket created by manager."
    };

    setTickets([newTicket, ...tickets]);
    setShowCreateModal(false);
    setFormData({
      title: "",
      priority: "Medium",
      assignedTo: "HR Admin",
      description: ""
    });
    toast.success("Support ticket created successfully!");
  };

  return (
    <div className={styles.ticketsContainer}>
      {/* Header Row */}
      <div className={styles.headerRow}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Ticket</h1>
          <p className={styles.subtitle}>
            Track, manage, and resolve employee support requests.
          </p>
        </div>

        <div className={styles.headerRight}>
          <button className={styles.supportBtn} title="Support Ticket">
            Support Ticket
          </button>

          <button
            className={styles.createBtn}
            onClick={() => setShowCreateModal(true)}
            title="Create Ticket"
          >
            <Plus size={16} />
            <span>{isMobile ? "Create" : "Create Ticket"}</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Switcher (Request Approvals / Support Ticket) */}
      <div className={styles.subnavRow}>
        <button
          type="button"
          className={styles.subnavLink}
          onClick={() => navigate("/manager/requests")}
        >
          Request Approvals
        </button>
        <div className={styles.subnavActivePill}>
          Support Ticket
        </div>
      </div>

      {/* Stat Cards (Exact CSS & layout from ManagerRequests) */}
      <section className={styles.statsGrid}>
        {/* Card 1: Open Tickets */}
        <div className={styles.statCard}>
          <div className={styles.statCardTop}>
            <div className={`${styles.statIconBox} ${styles.statIconBoxBlue}`}>
              <MessageSquare size={20} />
            </div>
          </div>
          <div className={styles.statCardMiddle}>
            <div className={`${styles.statValue} ${styles.statValueBlue}`}>
              {openCount}
            </div>
          </div>
          <div className={styles.statCardBottom}>
            <span className={styles.statTitle}>Open Tickets</span>
          </div>
        </div>

        {/* Card 2: In Progress */}
        <div className={styles.statCard}>
          <div className={styles.statCardTop}>
            <div className={`${styles.statIconBox} ${styles.statIconBoxOrange}`}>
              <MessageSquare size={20} />
            </div>
          </div>
          <div className={styles.statCardMiddle}>
            <div className={`${styles.statValue} ${styles.statValueOrange}`}>
              {inProgressCount}
            </div>
          </div>
          <div className={styles.statCardBottom}>
            <span className={styles.statTitle}>In Progress</span>
          </div>
        </div>

        {/* Card 3: Resolved Today */}
        <div className={styles.statCard}>
          <div className={styles.statCardTop}>
            <div className={`${styles.statIconBox} ${styles.statIconBoxGreen}`}>
              <MessageSquare size={20} />
            </div>
          </div>
          <div className={styles.statCardMiddle}>
            <div className={`${styles.statValue} ${styles.statValueGreen}`}>
              {resolvedCount}
            </div>
          </div>
          <div className={styles.statCardBottom}>
            <span className={styles.statTitle}>Resolved Today</span>
          </div>
        </div>
      </section>

      {/* All Tickets Box (Exact match to Image 1 & 2) */}
      <div className={styles.ticketsBox}>
        <div className={styles.ticketsBoxHeader}>
          <h2 className={styles.boxTitle}>All Tickets</h2>
          <div className={styles.filterPills}>
            {filterTabs.map((filter) => (
              <button
                key={filter}
                className={`${styles.filterPill} ${
                  activeFilter === filter ? styles.activeFilter : ""
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop & Tablet Table */}
        <div className={styles.tableContainer}>
          {/* Table Header */}
          <div className={styles.tableHeader}>
            <div>Ticket ID</div>
            <div>Title</div>
            <div>Status</div>
            <div>Priority</div>
            <div>Assigned To</div>
            <div>Created By</div>
            <div>Created</div>
            <div>Actions</div>
          </div>

          {/* Table Body */}
          <div className={styles.tableBody}>
            {filteredTickets.map((ticket) => (
              <div key={ticket.id} className={styles.tableRow}>
                <div className={styles.colTicketId}>{ticket.id}</div>
                <div className={styles.colTitle} title={ticket.title}>
                  {ticket.title}
                </div>
                <div className={styles.colStatus}>
                  <span className={styles.statusBadge} title={ticket.status}>
                    {getStatusIcon(ticket.status)}
                    <span className={styles.statusText}>{ticket.status}</span>
                  </span>
                </div>
                <div className={styles.colPriority}>
                  <span className={getPriorityClass(ticket.priority)}>
                    {ticket.priority}
                  </span>
                </div>
                <div className={styles.colAssigned}>{ticket.assignedTo}</div>
                <div className={styles.colCreatedBy}>{ticket.createdBy}</div>
                <div className={styles.colCreated}>{ticket.created}</div>
                <div className={styles.colActions}>
                  <button
                    className={styles.viewActionBtn}
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    View
                  </button>
                </div>
              </div>
            ))}

            {filteredTickets.length === 0 && (
              <div style={{ padding: "32px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>
                No support tickets found for "{activeFilter}".
              </div>
            )}
          </div>
        </div>

        {/* Mobile Dedicated Card List View (Matches Image 1 & 2) */}
        <div className={styles.mobileTicketList}>
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className={styles.mobileTicketCard}
              onClick={() => setSelectedTicket(ticket)}
            >
              <div className={styles.mobileCardTopRow}>
                <span className={styles.mobileTicketId}>{ticket.id}</span>
                <span className={getPriorityClass(ticket.priority)}>
                  {ticket.priority}
                </span>
              </div>

              <div className={styles.mobileTicketTitle}>
                {ticket.title}
              </div>

              <div className={styles.mobileCardMetaRow}>
                <span className={styles.mobileMetaItem}>
                  {getStatusIcon(ticket.status)}
                  <span>{ticket.status}</span>
                </span>
                <span className={styles.mobileMetaItem}>
                  <User size={13} color="#94a3b8" />
                  <span>{ticket.assignedTo}</span>
                </span>
              </div>

              <div className={styles.mobileMetaDivider} />

              <div className={styles.mobileCreatedBy}>
                Created by {ticket.createdBy}
              </div>
            </div>
          ))}

          {filteredTickets.length === 0 && (
            <div style={{ padding: "24px", textAlign: "center", color: "#94a3b8", fontSize: "12px" }}>
              No support tickets found for "{activeFilter}".
            </div>
          )}
        </div>
      </div>

      {/* Create Ticket Modal (Exact same CSS, responsive behavior & blur as Quick Assign Box) */}
      {showCreateModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className={styles.modalTitle}>Create New Support Ticket</h2>

            <form className={styles.modalForm} onSubmit={handleCreateSubmit}>
              {/* Title */}
              <div className={styles.modalField}>
                <label className={styles.modalLabel}>Title</label>
                <input
                  type="text"
                  className={styles.modalInput}
                  placeholder="Brief description of the issue"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              {/* Description */}
              <div className={styles.modalField}>
                <label className={styles.modalLabel}>Description</label>
                <textarea
                  className={styles.modalTextarea}
                  placeholder="Provide detailed information about the issue"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              {/* Priority and Assign To row (Custom sleek dropdowns) */}
              <div className={styles.modalRow}>
                {/* Priority Custom Dropdown */}
                <div className={styles.modalField} ref={priorityDropdownRef}>
                  <label className={styles.modalLabel}>Priority</label>
                  <div className={styles.customSelectContainer}>
                    <div
                      className={`${styles.customSelectHeader} ${
                        openDropdown === "priority" ? styles.customSelectHeaderOpen : ""
                      }`}
                      onClick={() =>
                        setOpenDropdown(openDropdown === "priority" ? null : "priority")
                      }
                    >
                      <span>{formData.priority}</span>
                      <ChevronDown
                        size={15}
                        style={{
                          transform: openDropdown === "priority" ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.2s ease"
                        }}
                      />
                    </div>

                    {openDropdown === "priority" && (
                      <div className={styles.customSelectDropdown}>
                        {["High", "Medium", "Low"].map((p) => (
                          <div
                            key={p}
                            className={`${styles.customSelectOption} ${
                              formData.priority === p ? styles.customSelectOptionSelected : ""
                            }`}
                            onClick={() => {
                              setFormData({ ...formData, priority: p });
                              setOpenDropdown(null);
                            }}
                          >
                            {p}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Assign To Custom Dropdown */}
                <div className={styles.modalField} ref={assignDropdownRef}>
                  <label className={styles.modalLabel}>Assign To</label>
                  <div className={styles.customSelectContainer}>
                    <div
                      className={`${styles.customSelectHeader} ${
                        openDropdown === "assign" ? styles.customSelectHeaderOpen : ""
                      }`}
                      onClick={() =>
                        setOpenDropdown(openDropdown === "assign" ? null : "assign")
                      }
                    >
                      <span>{formData.assignedTo}</span>
                      <ChevronDown
                        size={15}
                        style={{
                          transform: openDropdown === "assign" ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.2s ease"
                        }}
                      />
                    </div>

                    {openDropdown === "assign" && (
                      <div className={styles.customSelectDropdown}>
                        {["HR Admin", "IT Support", "Sarah Williams", "Michael Chen", "Operations"].map((a) => (
                          <div
                            key={a}
                            className={`${styles.customSelectOption} ${
                              formData.assignedTo === a ? styles.customSelectOptionSelected : ""
                            }`}
                            onClick={() => {
                              setFormData({ ...formData, assignedTo: a });
                              setOpenDropdown(null);
                            }}
                          >
                            {a}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className={styles.modalActions}>
                <button type="submit" className={styles.submitBtn}>
                  Create Ticket
                </button>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Ticket Details Modal */}
      {selectedTicket && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedTicket(null)}
        >
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div>
                <span style={{ fontSize: "11.5px", color: "#94a3b8" }}>{selectedTicket.id}</span>
                <h2 className={styles.modalTitle}>{selectedTicket.title}</h2>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", color: "#C6C5D0" }}>
                <span>Status: <strong style={{ color: "#ffffff" }}>{selectedTicket.status}</strong></span>
                <span>Priority: <span className={getPriorityClass(selectedTicket.priority)}>{selectedTicket.priority}</span></span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#94a3b8" }}>
                <span>Assigned: <strong style={{ color: "#ffffff" }}>{selectedTicket.assignedTo}</strong></span>
                <span>Created by: <strong style={{ color: "#ffffff" }}>{selectedTicket.createdBy}</strong></span>
              </div>

              <div
                style={{
                  background: "#12141C",
                  border: "1.5px solid rgba(255, 255, 255, 0.22)",
                  borderRadius: "8px",
                  padding: "14px",
                  color: "#F1F0FF",
                  fontSize: "13.5px",
                  lineHeight: "1.5"
                }}
              >
                {selectedTicket.description}
              </div>
            </div>

            <div className={styles.modalActions} style={{ justifyContent: "flex-end" }}>
              <button
                type="button"
                className={styles.submitBtn}
                style={{ flex: "none", padding: "9px 24px" }}
                onClick={() => setSelectedTicket(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManagerSupportTicket;
