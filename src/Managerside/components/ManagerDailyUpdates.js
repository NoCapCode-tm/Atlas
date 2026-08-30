import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Send,
  Filter,
  Plus,
  Bell,
  X,
  Check,
  FolderKanban
} from "lucide-react";
import styles from "../css/ManagerDailyUpdates.module.css";
import dashboardStyles from "../css/ManagerDashboard.module.css";

const initialReports = [
  {
    id: 1,
    name: "Name",
    initial: "M",
    dept: "Engineering",
    time: "09:15 AM",
    summary: "Completed the core API integration and resolved memory leak in the dashboard feed. Verified responsive layout for tablet view.",
    tasks: ["Task...", "Task..."],
    attachments: 2,
    status: "pending"
  },
  {
    id: 2,
    name: "Name",
    initial: "S",
    dept: "Product",
    time: "09:30 AM",
    summary: "Finalized sprint roadmap, updated SLA escalation guidelines, and coordinated with design team on updated ticket flows.",
    tasks: ["Task...", "Task..."],
    attachments: 1,
    status: "pending"
  }
];

const initialMissingMembers = [
  { id: 1, name: "Ziya", role: "Sales", initial: "Z" },
  { id: 2, name: "Priya", role: "Marketing", initial: "P" }
];

export default function ManagerDailyUpdates() {
  const navigate = useNavigate();
  const [reports, setReports] = useState(initialReports);
  const [missingMembers, setMissingMembers] = useState(initialMissingMembers);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [clarifyReport, setClarifyReport] = useState(null);
  const [clarifyMessage, setClarifyMessage] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [reminderModal, setReminderModal] = useState(null);
  const [approveModalReport, setApproveModalReport] = useState(null);
  const [approvalFeedback, setApprovalFeedback] = useState("");
  const [approvalRating, setApprovalRating] = useState(3);
  const [detailsFeedback, setDetailsFeedback] = useState("");

  // New Details Form State
  const [formData, setFormData] = useState({
    name: "",
    dept: "Engineering",
    summary: "",
    task1: "",
    task2: "",
    attachments: 1
  });

  const handleApprove = (id) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r))
    );
  };

  const handleConfirmApproval = () => {
    if (approveModalReport) {
      handleApprove(approveModalReport.id);
      setApproveModalReport(null);
      setApprovalFeedback("");
      setApprovalRating(3);
    }
  };

  const handleOpenReminder = (recipients) => {
    setReminderModal({
      recipients: recipients,
      message: ""
    });
  };

  const handleSendReminderSubmit = (e) => {
    e.preventDefault();
    setReminderModal(null);
  };

  const handleClarifySubmit = (e) => {
    e.preventDefault();
    if (!clarifyMessage.trim()) {
      return;
    }
    setClarifyReport(null);
    setClarifyMessage("");
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.summary) {
      return;
    }

    const newReport = {
      id: Date.now(),
      name: formData.name,
      initial: formData.name.charAt(0).toUpperCase(),
      dept: formData.dept,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      summary: formData.summary,
      tasks: [formData.task1 || "Task...", formData.task2 || "Task..."],
      attachments: Number(formData.attachments) || 1,
      status: "pending"
    };

    setReports([newReport, ...reports]);
    setShowAddModal(false);
    setFormData({
      name: "",
      dept: "Engineering",
      summary: "",
      task1: "",
      task2: "",
      attachments: 1
    });
  };

  const filteredReports = reports.filter((r) => {
    if (filterDept === "All") return true;
    return r.dept.toLowerCase() === filterDept.toLowerCase();
  });

  return (
    <div className={styles.dailyContainer}>
      {/* Header Row */}
      <div className={styles.headerRow}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Daily Updates</h1>
        </div>

        <div className={styles.headerRight}>
          <button
            className={styles.filterBtn}
            onClick={() => navigate("/manager/work")}
            title="Go to Team Tasks"
          >
            <FolderKanban size={14} /> Team Tasks
          </button>

          {/* Filter button */}
          <div style={{ position: "relative" }}>
            <button
              className={styles.filterBtn}
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <Filter size={14} /> Filter
            </button>
            {showFilterDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "110%",
                  right: 0,
                  background: "#151518",
                  border: "1px solid rgb(255 255 255 / 57%)",
                  borderRadius: "8px",
                  padding: "6px",
                  zIndex: 50,
                  minWidth: "120px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px"
                }}
              >
                {["All", "Engineering", "Product", "Sales", "Marketing"].map((dept) => (
                  <button
                    key={dept}
                    onClick={() => {
                      setFilterDept(dept);
                      setShowFilterDropdown(false);
                    }}
                    style={{
                      background: filterDept === dept ? "#0759D9" : "transparent",
                      color: "#fff",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "4px",
                      textAlign: "left",
                      fontSize: "12px",
                      cursor: "pointer"
                    }}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Add Details button (disabled / inactive on daily updates page) */}
          <button
            type="button"
            className={styles.assignBtn}
            style={{ cursor: "default", opacity: 0.9 }}
          >
            <Plus size={14} /> Add Details
          </button>
        </div>
      </div>

      {/* Top 2 Stats Cards */}
      <div className={styles.topCardsRow}>
        {/* Card 1: Submitted Today */}
        <div className={styles.summaryCard}>
          <div className={styles.summaryCardContent}>
            <div className={styles.summaryStatNumber}>
              <span className={styles.statGreen}>12</span>
              <span className={styles.statTotal}>/15</span>
            </div>
            <span className={styles.summaryStatLabel}>Submitted Today</span>
          </div>
          <div className={`${styles.summaryIconBox} ${styles.iconBoxGreen}`}>
            <Clock size={20} color="#00D66F" />
          </div>
        </div>

        {/* Card 2: Missing Reports */}
        <div className={styles.summaryCard}>
          <div className={styles.summaryCardContent}>
            <div className={styles.summaryStatNumber}>
              <span className={styles.statRed}>3</span>
              <span className={styles.statTotal}>/15</span>
            </div>
            <span className={styles.summaryStatLabel}>Missing Reports</span>
          </div>
          <div className={`${styles.summaryIconBox} ${styles.iconBoxRed}`}>
            <Clock size={20} color="#FF1F32" />
          </div>
        </div>
      </div>

      {/* Feed Header Row */}
      <div className={styles.feedHeaderRow}>
        <h2 className={styles.feedHeaderTitle}>Daily Report Feed</h2>
        <div className={styles.feedHeaderMeta}>
          <span className={styles.metaReportsCount}>
            {filteredReports.length} reports submitted
          </span>
          <span className={styles.metaMissingBadge}>
            <AlertCircle size={15} color="#FF1F32" /> Missing Reports{" "}
            <span className={styles.missingPill}>{missingMembers.length}</span>
          </span>
        </div>
      </div>

      {/* Main Grid: Feed Cards (Left) + Sidebar (Right) */}
      <div className={styles.mainLayoutGrid}>
        {/* Left: Report Feed List */}
        <div className={styles.feedColumn}>
          {filteredReports.map((report) => (
            <div key={report.id} className={styles.reportCard}>
              {/* Header */}
              <div className={styles.reportCardHeader}>
                <div className={styles.reportCardUser}>
                  <div className={styles.userAvatar}>{report.initial}</div>
                  <div className={styles.userInfo}>
                    <h3 className={styles.userName}>{report.name}</h3>
                    <span className={styles.userMeta}>
                      {report.dept} &nbsp;•&nbsp; <Clock size={12} /> {report.time}
                    </span>
                  </div>
                </div>

                <button
                  className={styles.viewDetailsLink}
                  onClick={() => setSelectedReport(report)}
                >
                  View Details
                </button>
              </div>

              {/* Summary Box */}
              <div className={styles.summaryBox}>
                <h4 className={styles.summaryBoxTitle}>Summary</h4>
                <p className={styles.summaryBoxText}>{report.summary || "Text..."}</p>
              </div>

              {/* Tasks Completed */}
              <div className={styles.tasksCompletedSection}>
                <h4 className={styles.tasksCompletedTitle}>Tasks Completed</h4>
                {report.tasks.map((task, idx) => (
                  <div key={idx} className={styles.taskItem}>
                    <CheckCircle2 size={15} color="#00D66F" />
                    <span>{task}</span>
                  </div>
                ))}

                <div className={styles.attachmentsText}>
                  <FileText size={14} />
                  <span>
                    {report.attachments} attachment
                    {report.attachments > 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className={styles.cardDivider} />

              {/* Action Buttons */}
              <div className={styles.cardActionsRow}>
                <button
                  className={styles.clarifyBtn}
                  onClick={() => setClarifyReport(report)}
                >
                  Ask for Clarification
                </button>
                {report.status === "approved" ? (
                  <button
                    className={`${styles.approveBtn} ${styles.approvedBadge}`}
                    disabled
                  >
                    <Check size={14} /> Approved
                  </button>
                ) : (
                  <button
                    className={styles.approveBtn}
                    onClick={() => setApproveModalReport(report)}
                  >
                    Approve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right Sidebar: Missing Reports + Summary */}
        <div className={styles.sidebarColumn}>
          {/* Card 1: Missing Reports */}
          <div className={styles.sidebarCard}>
            <p className={styles.sidebarNoticeText}>
              The following team members haven't submitted their daily reports yet:
            </p>

            <div className={styles.missingList}>
              {missingMembers.map((member) => (
                <div key={member.id} className={styles.missingMemberRow}>
                  <div className={styles.missingMemberLeft}>
                    <div className={styles.missingAvatar}>{member.initial}</div>
                    <div className={styles.missingMemberInfo}>
                      <span className={styles.missingMemberName}>
                        {member.name}
                      </span>
                      <span className={styles.missingMemberDept}>
                        {member.role}
                      </span>
                    </div>
                  </div>

                  <button
                    className={styles.sendReminderBtn}
                    onClick={() => handleOpenReminder([member])}
                    title={`Send reminder to ${member.name}`}
                  >
                    <Send size={15} color="#FF1F32" />
                  </button>
                </div>
              ))}
            </div>

            <button
              className={styles.remindAllBtn}
              onClick={() => handleOpenReminder(missingMembers)}
            >
              Send Reminder to All
            </button>
          </div>

          {/* Card 2: Report Summary */}
          <div className={styles.sidebarCard}>
            <h3 className={styles.summaryCardTitle}>Report Summary</h3>

            <div className={styles.statList}>
              <div className={styles.statRow}>
                <span className={styles.statRowLabel}>Total Team Members</span>
                <span className={styles.statRowValue}>15</span>
              </div>

              <div className={styles.statRow}>
                <span className={styles.statRowLabel}>Submitted</span>
                <span className={`${styles.statRowValue} ${styles.statValGreen}`}>
                  12
                </span>
              </div>

              <div className={styles.statRow}>
                <span className={styles.statRowLabel}>Pending</span>
                <span className={`${styles.statRowValue} ${styles.statValRed}`}>
                  3
                </span>
              </div>
            </div>

            <div className={styles.statDivider} />

            <div className={styles.completionRateRow}>
              <span>Completion Rate</span>
              <span className={styles.rateValue}>80%</span>
            </div>

            <div className={styles.progressBarTrack}>
              <div
                className={styles.progressBarFill}
                style={{ width: "80%" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* View Details Modal - Daily Report Details (Compact with no scrollbar) */}
      {selectedReport && (
        <div
          className={dashboardStyles.modalOverlay}
          onClick={() => setSelectedReport(null)}
        >
          <div
            className={dashboardStyles.modalCard}
            style={{
              maxWidth: "400px",
              borderRadius: "8px",
              padding: "12px 18px",
              boxSizing: "border-box"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className={dashboardStyles.modalHeader}
              style={{ alignItems: "center", marginBottom: "6px" }}
            >
              <h2
                className={dashboardStyles.modalTitle}
                style={{ margin: 0, fontSize: "12.5px" }}
              >
                Daily Report Details
              </h2>
              <button
                className={dashboardStyles.modalCloseBtn}
                onClick={() => setSelectedReport(null)}
                title="Close"
                style={{ width: "20px", height: "20px" }}
              >
                <X size={13} />
              </button>
            </div>

            {/* User Profile */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                marginBottom: "6px"
              }}
            >
              <div
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  border: "1px solid #818cf8",
                  background: "#1e1b4b",
                  color: "#818cf8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10.5px",
                  fontWeight: 600,
                  flexShrink: 0
                }}
              >
                {selectedReport.initial}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0px" }}>
                <div
                  style={{ fontSize: "11px", fontWeight: 600, color: "#ffffff", lineHeight: 1.2 }}
                >
                  {selectedReport.name}
                </div>
                <div
                  style={{
                    fontSize: "9px",
                    color: "#94a3b8",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <span>{selectedReport.dept}</span>
                  <span>•</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                    <Clock size={8.5} /> Submitted at {selectedReport.time}
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                height: "1px",
                background: "rgba(255, 255, 255, 0.12)",
                marginBottom: "6px"
              }}
            />

            <div className={dashboardStyles.modalForm} style={{ gap: "6px" }}>
              {/* Work Summary */}
              <div className={dashboardStyles.modalField} style={{ gap: "3px" }}>
                <label className={dashboardStyles.modalLabel} style={{ fontSize: "9.5px" }}>
                  Work Summary
                </label>
                <div
                  className={dashboardStyles.modalInput}
                  style={{
                    height: "auto",
                    minHeight: "34px",
                    lineHeight: "1.35",
                    padding: "8px 12px",
                    fontSize: "9.5px",
                    borderRadius: "4px"
                  }}
                >
                  {selectedReport.summary || "Text...."}
                </div>
              </div>

              {/* Tasks Completed Today */}
              <div className={dashboardStyles.modalField} style={{ gap: "3px" }}>
                <label className={dashboardStyles.modalLabel} style={{ fontSize: "9.5px" }}>
                  Tasks Completed Today
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {(selectedReport.tasks && selectedReport.tasks.length > 0
                    ? selectedReport.tasks
                    : ["Task..", "Task..."]
                  ).map((task, idx) => (
                    <div
                      key={idx}
                      className={dashboardStyles.modalInput}
                      style={{
                        height: "auto",
                        minHeight: "28px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "7px 12px",
                        fontSize: "9.5px",
                        borderRadius: "4px"
                      }}
                    >
                      <CheckCircle2
                        size={12}
                        color="#00D66F"
                        style={{ flexShrink: 0 }}
                      />
                      <span style={{ fontSize: "9.5px", color: "#ffffff" }}>
                        {task}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attachments */}
              <div className={dashboardStyles.modalField} style={{ gap: "3px" }}>
                <label className={dashboardStyles.modalLabel} style={{ fontSize: "9.5px" }}>
                  Attachments ({selectedReport.attachments || 2})
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {Array.from({ length: selectedReport.attachments || 2 }).map(
                    (_, idx) => (
                      <div
                        key={idx}
                        className={dashboardStyles.modalInput}
                        style={{
                          height: "auto",
                          minHeight: "28px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "7px 12px",
                          borderRadius: "4px"
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px"
                          }}
                        >
                          <FileText size={12} color="#94a3b8" />
                          <span style={{ fontSize: "9.5px", color: "#ffffff" }}>
                            Document_{idx + 1}.pdf
                          </span>
                        </div>
                        <span
                          style={{
                            color: "#3b82f6",
                            fontSize: "9.5px",
                            fontWeight: 500,
                            cursor: "pointer"
                          }}
                        >
                          Download
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Manager Feedback */}
              <div className={dashboardStyles.modalField} style={{ gap: "3px" }}>
                <label className={dashboardStyles.modalLabel} style={{ fontSize: "9.5px" }}>
                  Manager Feedback
                </label>
                <textarea
                  className={dashboardStyles.modalTextarea}
                  rows={2}
                  placeholder="Add your feedback or comments..."
                  value={detailsFeedback}
                  onChange={(e) => setDetailsFeedback(e.target.value)}
                  style={{
                    minHeight: "44px",
                    padding: "8px 12px",
                    fontSize: "9.5px",
                    lineHeight: "1.35",
                    borderRadius: "4px"
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div
                className={dashboardStyles.modalActions}
                style={{
                  justifyContent: "space-between",
                  marginTop: "2px",
                  gap: "8px"
                }}
              >
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: "6px 12px",
                    background: "transparent",
                    border: "1.5px solid #00D66F",
                    borderRadius: "4px",
                    fontFamily: '"Outfit", sans-serif',
                    fontSize: "10.5px",
                    fontWeight: 600,
                    color: "#00D66F",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onClick={() => {
                    const r = selectedReport;
                    setSelectedReport(null);
                    setApproveModalReport(r);
                  }}
                >
                  Approve Report
                </button>
                <button
                  type="button"
                  className={dashboardStyles.modalSubmitBtn}
                  style={{
                    padding: "6px 14px",
                    fontSize: "10.5px",
                    borderRadius: "4px"
                  }}
                  onClick={() => {
                    const r = selectedReport;
                    setSelectedReport(null);
                    setClarifyReport(r);
                  }}
                >
                  Ask for Clarification
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ask for Clarification Modal */}
      {clarifyReport && (
        <div
          className={dashboardStyles.modalOverlay}
          onClick={() => setClarifyReport(null)}
        >
          <div
            className={dashboardStyles.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={dashboardStyles.modalHeader}>
              <div>
                <h3 className={dashboardStyles.modalTitle}>
                  Clarification Request
                </h3>
                <p className={dashboardStyles.modalSubtitle}>
                  Ask {clarifyReport.name} about their daily submission.
                </p>
              </div>
              <button
                className={dashboardStyles.modalCloseBtn}
                onClick={() => setClarifyReport(null)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleClarifySubmit} className={dashboardStyles.modalForm}>
              <div className={dashboardStyles.modalField}>
                <label className={dashboardStyles.modalLabel}>
                  Message / Question:
                </label>
                <textarea
                  className={dashboardStyles.modalTextarea}
                  rows={4}
                  placeholder="e.g. Could you please specify blockers..."
                  value={clarifyMessage}
                  onChange={(e) => setClarifyMessage(e.target.value)}
                  autoFocus
                />
              </div>

              <div className={dashboardStyles.modalActions}>
                <button
                  type="button"
                  className={dashboardStyles.modalCancelBtn}
                  onClick={() => setClarifyReport(null)}
                >
                  Cancel
                </button>
                <button type="submit" className={dashboardStyles.modalSubmitBtn}>
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Send Reminder Modal - 100% Quick Assign Box CSS */}
      {reminderModal && (
        <div
          className={dashboardStyles.modalOverlay}
          onClick={() => setReminderModal(null)}
        >
          <div
            className={dashboardStyles.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  border: "1px solid #FF1F32",
                  background: "rgba(255, 31, 50, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}
              >
                <Send size={18} color="#FF1F32" />
              </div>
              <h2 className={dashboardStyles.modalTitle} style={{ margin: 0 }}>
                Send Reminder
              </h2>
            </div>

            <form
              className={dashboardStyles.modalForm}
              onSubmit={handleSendReminderSubmit}
            >
              {/* Recipients */}
              <div className={dashboardStyles.modalField}>
                <label className={dashboardStyles.modalLabel}>Recipients</label>
                <div
                  className={dashboardStyles.modalInput}
                  style={{
                    height: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px"
                  }}
                >
                  {reminderModal.recipients.map((rec) => (
                    <div
                      key={rec.id || rec.name}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      }}
                    >
                      <CheckCircle2 size={14} color="#00D66F" />
                      <span style={{ fontSize: "11.5px", color: "#ffffff" }}>
                        {rec.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className={dashboardStyles.modalField}>
                <label className={dashboardStyles.modalLabel}>Message</label>
                <textarea
                  className={dashboardStyles.modalTextarea}
                  rows={4}
                  value={reminderModal.message}
                  onChange={(e) =>
                    setReminderModal({
                      ...reminderModal,
                      message: e.target.value
                    })
                  }
                />
              </div>

              {/* Notice */}
              <div
                className={dashboardStyles.modalInput}
                style={{
                  height: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 12px"
                }}
              >
                <AlertCircle
                  size={14}
                  color="#ffffff"
                  style={{ flexShrink: 0 }}
                />
                <span style={{ fontSize: "11px", color: "#ffffff" }}>
                  This reminder will be sent via email.
                </span>
              </div>

              {/* Actions */}
              <div
                className={dashboardStyles.modalActions}
                style={{
                  justifyContent: "space-between",
                  marginTop: "6px"
                }}
              >
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: "9px 14px",
                    background: "#12141C",
                    border: "1.5px solid rgba(255, 255, 255, 0.22)",
                    borderRadius: "8px",
                    fontFamily: '"Outfit", sans-serif',
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#ffffff",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  Send Reminder
                </button>
                <button
                  type="button"
                  className={dashboardStyles.modalSubmitBtn}
                  onClick={() => setReminderModal(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Approve Report Modal - 100% Quick Assign Box CSS */}
      {approveModalReport && (
        <div
          className={dashboardStyles.modalOverlay}
          onClick={() => setApproveModalReport(null)}
        >
          <div
            className={dashboardStyles.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  border: "1px solid #00D66F",
                  background: "rgba(0, 214, 111, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0
                }}
              >
                <CheckCircle2 size={18} color="#00D66F" />
              </div>
              <h2 className={dashboardStyles.modalTitle} style={{ margin: 0 }}>
                Approve Report
              </h2>
            </div>

            <div className={dashboardStyles.modalForm}>
              {/* Notice Box */}
              <div
                className={dashboardStyles.modalInput}
                style={{
                  height: "auto",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  padding: "10px 12px"
                }}
              >
                <CheckCircle2 size={16} color="#00D66F" style={{ marginTop: "2px", flexShrink: 0 }} />
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <div style={{ fontSize: "11.5px", color: "#ffffff" }}>
                    You're about to approve this report
                  </div>
                  <div style={{ fontSize: "11.5px", color: "#ffffff" }}>
                    <strong>{approveModalReport.name}</strong> will be notified of your approval.
                  </div>
                </div>
              </div>

              {/* Feedback (Optional) */}
              <div className={dashboardStyles.modalField}>
                <label className={dashboardStyles.modalLabel}>Feedback (Optional)</label>
                <textarea
                  className={dashboardStyles.modalTextarea}
                  rows={3}
                  placeholder="Great work today! Keep up the excellent progress..."
                  value={approvalFeedback}
                  onChange={(e) => setApprovalFeedback(e.target.value)}
                />
              </div>

              {/* Performance Rating */}
              <div className={dashboardStyles.modalField}>
                <label className={dashboardStyles.modalLabel}>Performance Rating</label>
                <div style={{ display: "flex", gap: "6px", width: "100%" }}>
                  {[1, 2, 3, 4, 5].map((stars) => (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => setApprovalRating(stars)}
                      style={{
                        flex: 1,
                        padding: "6px 2px",
                        background: approvalRating === stars ? "rgba(99, 102, 241, 0.2)" : "#12141C",
                        border: approvalRating === stars ? "1.5px solid #6366f1" : "1.5px solid rgba(255, 255, 255, 0.22)",
                        borderRadius: "8px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "1px",
                        color: "#F59E0B"
                      }}
                    >
                      {Array.from({ length: stars }).map((_, i) => (
                        <span key={i} style={{ fontSize: "10px", lineHeight: 1 }}>★</span>
                      ))}
                    </button>
                  ))}
                </div>
                <span style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
                  Send encouragement message to the employee
                </span>
              </div>

              {/* Actions */}
              <div
                className={dashboardStyles.modalActions}
                style={{
                  justifyContent: "space-between",
                  marginTop: "6px",
                  gap: "10px"
                }}
              >
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: "9px 14px",
                    background: "transparent",
                    border: "1.5px solid #00D66F",
                    borderRadius: "8px",
                    fontFamily: '"Outfit", sans-serif',
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#00D66F",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onClick={handleConfirmApproval}
                >
                  Confirm Approval
                </button>
                <button
                  type="button"
                  className={dashboardStyles.modalSubmitBtn}
                  onClick={() => setApproveModalReport(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
