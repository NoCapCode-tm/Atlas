import React, { useState } from "react";
import {
  Award,
  TrendingUp,
  Send,
  Plus,
  X,
  Megaphone
} from "lucide-react";
import { toast } from "react-toastify";
import styles from "../css/ManagerAnnouncements.module.css";
import useWindowWidth from "../../useWindowWidth";

const initialAnnouncements = [
  {
    id: 1,
    title: "Top Performer of the Month",
    by: "By HR Team",
    date: "2025-12-15",
    type: "award",
    message: "Recognizing outstanding engineering contributions and project milestones achieved this month."
  },
  {
    id: 2,
    title: "Team Meeting - Q4 Review",
    by: "By Management",
    date: "2025-12-14",
    type: "trend",
    message: "All-hands quarterly retrospective covering product performance, roadmap goals, and client SLA deliveries."
  },
  {
    id: 3,
    title: "Holiday Schedule Reminder",
    by: "By HR Team",
    date: "2025-12-10",
    type: "reminder",
    message: "Please review the upcoming holiday office schedule and ensure timely handover of pending pull requests and tickets."
  }
];

const initialAchievements = [
  { id: 1, name: "Name", date: "2025-12-15" },
  { id: 2, name: "Name", date: "2025-12-12" },
  { id: 3, name: "Name", date: "2025-12-09" }
];

export default function ManagerAnnouncements() {
  const width = useWindowWidth();
  const isMobile = width <= 425;

  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [achievements, setAchievements] = useState(initialAchievements);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    announcementType: "General",
    message: ""
  });

  const getIcon = (type) => {
    switch (type) {
      case "award":
        return <Award size={22} />;
      case "trend":
        return <TrendingUp size={22} />;
      case "reminder":
      default:
        return <Send size={20} style={{ transform: "rotate(-20deg)" }} />;
    }
  };

  const getIconClass = (type) => {
    switch (type) {
      case "award":
        return styles.iconBoxOrange;
      case "trend":
        return styles.iconBoxPurple;
      case "reminder":
      default:
        return styles.iconBoxBlue;
    }
  };

  const handleOpenCreateModal = () => {
    setFormData({
      title: "",
      announcementType: "General",
      message: ""
    });
    setShowCreateModal(true);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please enter an announcement title.");
      return;
    }

    const typeMapping = {
      General: { type: "reminder", by: "By Management" },
      Achievement: { type: "award", by: "By HR Team" },
      "Team Bulletin": { type: "trend", by: "By Management" }
    };

    const config = typeMapping[formData.announcementType] || {
      type: "reminder",
      by: "By Management"
    };

    const newAnnouncement = {
      id: Date.now(),
      title: formData.title,
      by: config.by,
      date: new Date().toISOString().split("T")[0],
      type: config.type,
      message: formData.message || "Announcement details and instructions."
    };

    setAnnouncements([newAnnouncement, ...announcements]);
    setShowCreateModal(false);
    toast.success("Announcement published successfully!");
  };

  return (
    <div className={styles.announcementsContainer}>
      {/* Header Row */}
      <div className={styles.headerRow}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Announcements</h1>
        </div>

        <div className={styles.headerRight}>
          <button
            className={styles.createBtn}
            onClick={handleOpenCreateModal}
            title="Create Announcement"
          >
            <Plus size={16} />
            <span>{isMobile ? "Create" : "Create Announcement"}</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className={styles.mainLayoutGrid}>
        {/* Left Column: Recent Announcements */}
        <section className={styles.announcementsColumn}>
          <h2 className={styles.sectionTitle}>Recent Announcements</h2>

          <div className={styles.cardsList}>
            {announcements.map((item) => (
              <div
                key={item.id}
                className={styles.announcementCard}
                onClick={() => setSelectedAnnouncement(item)}
                title="Click to view details"
              >
                <div className={styles.cardLeft}>
                  <div className={`${styles.iconBox} ${getIconClass(item.type)}`}>
                    {getIcon(item.type)}
                  </div>

                  <div className={styles.cardInfo}>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                    <p className={styles.cardSubtitle}>{item.by}</p>
                  </div>
                </div>

                <div className={styles.cardRight}>
                  <span className={styles.cardDate}>{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right Column: Recent Achievements */}
        <section className={styles.achievementsColumn}>
          <h2 className={styles.sectionTitle}>Recent Achievements</h2>

          <div className={styles.achievementsCard}>
            {achievements.map((item, index) => (
              <React.Fragment key={item.id}>
                <div className={styles.achievementItem}>
                  <div className={styles.achievementIcon}>
                    <Award size={18} />
                  </div>
                  <div className={styles.achievementDetails}>
                    <span className={styles.achievementName}>{item.name}</span>
                    <span className={styles.achievementDate}>{item.date}</span>
                  </div>
                </div>
                {index < achievements.length - 1 && (
                  <hr className={styles.achievementDivider} />
                )}
              </React.Fragment>
            ))}
          </div>
        </section>
      </div>

      {/* Create Announcement Modal (Exact match to user reference & Quick Assign styling) */}
      {showCreateModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className={styles.modalTitle}>Create New Announcement</h2>

            <form className={styles.modalForm} onSubmit={handleCreateSubmit}>
              <div className={styles.modalField}>
                <label className={styles.modalLabel}>Announcement Type</label>
                <div className={styles.typePillsRow}>
                  {["General", "Achievement", "Team Bulletin"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`${styles.typePill} ${
                        formData.announcementType === type
                          ? styles.typePillActive
                          : ""
                      }`}
                      onClick={() =>
                        setFormData({ ...formData, announcementType: type })
                      }
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.modalField}>
                <label className={styles.modalLabel}>Title</label>
                <input
                  type="text"
                  className={styles.modalInput}
                  placeholder="Enter announcement title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className={styles.modalField}>
                <label className={styles.modalLabel}>Content</label>
                <textarea
                  className={styles.modalTextarea}
                  placeholder="Enter announcement content"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                />
              </div>

              <div className={styles.modalActions}>
                <button type="submit" className={styles.publishBtn}>
                  Publish
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

      {/* View Announcement Details Modal */}
      {selectedAnnouncement && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedAnnouncement(null)}
        >
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  className={`${styles.iconBox} ${getIconClass(
                    selectedAnnouncement.type
                  )}`}
                  style={{ width: "34px", height: "34px" }}
                >
                  {getIcon(selectedAnnouncement.type)}
                </div>
                <h2 className={styles.modalTitle} style={{ margin: 0 }}>
                  {selectedAnnouncement.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedAnnouncement(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center"
                }}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12.5px",
                  color: "var(--text-secondary)"
                }}
              >
                <span>{selectedAnnouncement.by}</span>
                <span>{selectedAnnouncement.date}</span>
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
                {selectedAnnouncement.message}
              </div>
            </div>

            <div className={styles.modalActions} style={{ justifyContent: "flex-end" }}>
              <button
                type="button"
                className={styles.publishBtn}
                style={{ flex: "none", padding: "9px 24px" }}
                onClick={() => setSelectedAnnouncement(null)}
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
