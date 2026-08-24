import React, { useState, useRef, useEffect } from "react";
import ManagerHeader from "../components/ManagerHeader";
import ManagerSidebar from "../components/ManagerSidebar";
import ManagerTeam from "../components/ManagerTeam";
import styles from "../css/ManagerDashboard.module.css";
import useWindowWidth from "../../useWindowWidth";
import { Plus, X, ChevronDown } from "lucide-react";

function ManagerTeamPage() {
  const width = useWindowWidth();
  const isMobile = width <= 425;

  const storedName = localStorage.getItem("managerName") || "Om Vashishtha";
  const initials = storedName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const [collapsed, setCollapsed] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalForm, setModalForm] = useState({ title: "", assignee: "", priority: "", description: "" });
  const [openDropdown, setOpenDropdown] = useState(null);
  const assigneeRef = useRef(null);
  const priorityRef = useRef(null);

  const handleModalClose = () => {
    setShowModal(false);
    setOpenDropdown(null);
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (!modalForm.assignee || !modalForm.priority) {
      alert("Please select both Assignee and Priority.");
      return;
    }
    setShowModal(false);
    setOpenDropdown(null);
    setModalForm({ title: "", assignee: "", priority: "", description: "" });
  };

  const prevWidthRef = useRef(width);
  useEffect(() => {
    if (prevWidthRef.current > 768 && width <= 768) {
      setCollapsed(true);
    }
    prevWidthRef.current = width;
  }, [width]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (assigneeRef.current && !assigneeRef.current.contains(event.target)) &&
        (priorityRef.current && !priorityRef.current.contains(event.target))
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <ManagerHeader
        title=""
        subtitle=""
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
        userName={storedName}
        initials={initials}
      >
        {!isMobile && (
          <button className={styles.quickAssignBtn} onClick={() => setShowModal(true)}>
            <Plus size={16} />
            <span>Quick Assign</span>
          </button>
        )}
      </ManagerHeader>

      <div className={styles.dashboardBody}>
        <ManagerSidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <main className={styles.mainContent}>
          <ManagerTeam mobileAction={isMobile ? (
            <button className={`${styles.quickAssignBtn} ${styles.quickAssignBtnSmall}`} onClick={() => setShowModal(true)}>
              <Plus size={16} />
              <span>Quick Assign</span>
            </button>
          ) : null} isMobile={isMobile} />
        </main>
      </div>

      {showModal && (
        <div className={styles.modalOverlay} onClick={handleModalClose}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>Quick Assign Task</h2>
                <p className={styles.modalSubtitle}>Assign a new task to a team member instantly.</p>
              </div>
              <button className={styles.modalCloseBtn} onClick={handleModalClose} title="Close">
                <X size={18} />
              </button>
            </div>

            <form className={styles.modalForm} onSubmit={handleModalSubmit}>
              <div className={styles.modalField}>
                <label className={styles.modalLabel}>Task Title</label>
                <input
                  className={styles.modalInput}
                  type="text"
                  placeholder="eg. make the dashboard"
                  value={modalForm.title}
                  onChange={(e) => setModalForm(f => ({ ...f, title: e.target.value }))}
                  required
                />
              </div>

              <div className={styles.modalRow}>
                <div className={styles.modalField} ref={assigneeRef}>
                  <label className={styles.modalLabel}>Assignee</label>
                  <div className={styles.customSelectContainer}>
                    <div
                      className={`${styles.customSelectHeader} ${openDropdown === "assignee" ? styles.customSelectHeaderOpen : ""}`}
                      onClick={() => setOpenDropdown(openDropdown === "assignee" ? null : "assignee")}
                    >
                      <span style={{ color: modalForm.assignee ? "#ffffff" : "#94a3b8" }}>
                        {modalForm.assignee || "Select"}
                      </span>
                      <ChevronDown size={14} style={{ color: "#94a3b8" }} />
                    </div>
                    {openDropdown === "assignee" && (
                      <div className={styles.customSelectDropdown}>
                        {["Alice Freeman", "Bob Smith", "Charlie Day", "Diana Prince", "Evan Wright"].map((item) => (
                          <div
                            key={item}
                            className={`${styles.customSelectOption} ${modalForm.assignee === item ? styles.customSelectOptionSelected : ""}`}
                            onClick={() => {
                              setModalForm((f) => ({ ...f, assignee: item }));
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

                <div className={styles.modalField} ref={priorityRef}>
                  <label className={styles.modalLabel}>Priority</label>
                  <div className={styles.customSelectContainer}>
                    <div
                      className={`${styles.customSelectHeader} ${openDropdown === "priority" ? styles.customSelectHeaderOpen : ""}`}
                      onClick={() => setOpenDropdown(openDropdown === "priority" ? null : "priority")}
                    >
                      <span style={{ color: modalForm.priority ? "#ffffff" : "#94a3b8" }}>
                        {modalForm.priority || "Select"}
                      </span>
                      <ChevronDown size={14} style={{ color: "#94a3b8" }} />
                    </div>
                    {openDropdown === "priority" && (
                      <div className={styles.customSelectDropdown}>
                        {["High", "Medium", "Low"].map((item) => (
                          <div
                            key={item}
                            className={`${styles.customSelectOption} ${modalForm.priority === item ? styles.customSelectOptionSelected : ""}`}
                            onClick={() => {
                              setModalForm((f) => ({ ...f, priority: item }));
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
                <label className={styles.modalLabel}>Description :</label>
                <textarea
                  className={styles.modalTextarea}
                  rows={4}
                  value={modalForm.description}
                  onChange={(e) => setModalForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>

              <div className={styles.modalActions}>
                <button type="button" className={styles.modalCancelBtn} onClick={handleModalClose}>Cancel</button>
                <button type="submit" className={styles.modalSubmitBtn}>Assign Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManagerTeamPage;
