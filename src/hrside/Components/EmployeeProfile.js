import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../CSS/employeeProfile.module.css";
import EditEmployeeModal from "./EditEmployeeModal";
import {
  Search,
  ArrowLeft,
  Pencil,
  MoreHorizontal,
  Mail,
  Phone,
  Clock,
  MapPin,
  Calendar,
  TrendingUp,
  Plus,
  Lock,
  Check,
  Copy,
  Briefcase,
  GraduationCap,
  LogOut,
} from "lucide-react";

function ReviewScoreIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 14H6V7H4V14ZM8 14H10V4H8V14ZM12 14H14V10H12V14ZM2 18C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H16C16.55 0 17.0208 0.195833 17.4125 0.5875C17.8042 0.979167 18 1.45 18 2V16C18 16.55 17.8042 17.0208 17.4125 17.4125C17.0208 17.8042 16.55 18 16 18H2ZM2 16H16V2H2V16ZM2 2V16V2Z"
        fill="#8D90A0"
      />
    </svg>
  );
}

function FlightRiskIcon({ size = 18 }) {
  return (
    <svg
      width={size + 2.68}
      height={size + 0.15}
      viewBox="0 0 21 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 18.15V16.15H20V18.15H2ZM3.75 13.15L0 6.9L2.4 6.25L5.2 8.6L8.7 7.675L3.525 0.775L6.425 0L13.9 6.275L18.15 5.125C18.6833 4.975 19.1875 5.0375 19.6625 5.3125C20.1375 5.5875 20.45 5.99167 20.6 6.525C20.75 7.05833 20.6875 7.5625 20.4125 8.0375C20.1375 8.5125 19.7333 8.825 19.2 8.975L3.75 13.15Z"
        fill="#8D90A0"
      />
    </svg>
  );
}

function ProductivityIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size * 0.8}
      viewBox="0 0 20 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.45 11.5C8.85 11.9 9.36667 12.0958 10 12.0875C10.6333 12.0792 11.1 11.85 11.4 11.4L17 3L8.6 8.6C8.15 8.9 7.9125 9.35833 7.8875 9.975C7.8625 10.5917 8.05 11.1 8.45 11.5ZM10 0C10.9833 0 11.9292 0.1375 12.8375 0.4125C13.7458 0.6875 14.6 1.1 15.4 1.65L13.5 2.85C12.95 2.56667 12.3792 2.35417 11.7875 2.2125C11.1958 2.07083 10.6 2 10 2C7.78333 2 5.89583 2.77917 4.3375 4.3375C2.77917 5.89583 2 7.78333 2 10C2 10.7 2.09583 11.3917 2.2875 12.075C2.47917 12.7583 2.75 13.4 3.1 14H16.9C17.2833 13.3667 17.5625 12.7083 17.7375 12.025C17.9125 11.3417 18 10.6333 18 9.9C18 9.3 17.9292 8.71667 17.7875 8.15C17.6458 7.58333 17.4333 7.03333 17.15 6.5L18.35 4.6C18.85 5.38333 19.2458 6.21667 19.5375 7.1C19.8292 7.98333 19.9833 8.9 20 9.85C20.0167 10.8 19.9083 11.7083 
        19.675 12.575C19.4417 13.4417 19.1 14.2667 18.65 15.05C18.4667 15.35 18.2167 15.5833 17.9 15.75C17.5833 15.9167 17.25 16 16.9 16H3.1C2.75 16 2.41667 15.9167 2.1 15.75C1.78333 15.5833 1.53333 15.35 1.35 15.05C0.916667 14.3 0.583333 13.5042 0.35 12.6625C0.116667 11.8208 0 10.9333 0 10C0 8.61667 0.2625 7.32083 0.7875 6.1125C1.3125 4.90417 2.02917 3.84583 2.9375 2.9375C3.84583 2.02917 4.90833 1.3125 6.125 0.7875C7.34167 0.2625 8.63333 0 10 0Z"
        fill="#8D90A0"
      />
    </svg>
  );
}

function EngagementIcon({ size = 20 }) {
  return (
    <svg
      width={size - 0.99}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 20V15.7C2.05 14.8333 1.3125 13.8208 0.7875 12.6625C0.2625 11.5042 0 10.2833 0 9C0 6.5 0.875 4.375 2.625 2.625C4.375 0.875 6.5 0 9 0C11.0833 0 12.9292 0.6125 14.5375 1.8375C16.1458 3.0625 17.1917 4.65833 17.675 6.625L18.975 11.75C19.0583 12.0667 19 12.3542 18.8 12.6125C18.6 12.8708 18.3333 13 18 13H16V16C16 16.55 15.8042 17.0208 15.4125 17.4125C15.0208 17.8042 14.55 18 14 18H12V20H10V16H14V11H16.7L15.75 7.125C15.3667 5.60833 14.55 4.375 13.3 3.425C12.05 2.475 10.6167 2 9 2C7.06667 2 5.41667 2.675 4.05 4.025C2.68333 5.375 2 7.01667 2 8.95C2 9.95 2.20417 10.9 2.6125 11.8C3.02083 12.7 3.6 13.5 4.35 14.2L5 14.8V20H3ZM8 13H10L10.15 11.75C10.2833 11.7 10.4042 11.6417 10.5125 11.575C10.6208 11.5083 10.7167 11.4333 10.8 11.35L11.95 11.85L12.95 10.15L11.95 9.4C11.9833 9.26667 12 9.13333 12 9C12 8.86667 11.9833 8.73333 11.95 8.6L12.95 7.85L11.95 6.15L10.8 6.65C10.7167 6.56667 10.6208 6.49167 10.5125 6.425C10.4042 6.35833 10.2833 6.3 10.15 6.25L10 5H8L7.85 6.25C7.71667 6.3 7.59583 6.35833 7.4875 6.425C7.37917 6.49167 7.28333 6.56667 7.2 6.65L6.05 6.15L5.05 7.85L6.05 8.6C6.01667 8.73333 6 8.86667 6 9C6 9.13333 6.01667 9.26667 6.05 9.4L5.05 10.15L6.05 11.85L7.2 11.35C7.28333 11.4333 7.37917 11.5083 7.4875 11.575C7.59583 11.6417 7.71667 11.7 7.85 11.75L8 13ZM9 10.5C8.58333 10.5 8.22917 10.3542 7.9375 10.0625C7.64583 9.77083 7.5 9.41667 7.5 9C7.5 8.58333 7.64583 8.22917 7.9375 7.9375C8.22917 7.64583 8.58333 7.5 9 7.5C9.41667 7.5 9.77083 7.64583 10.0625 7.9375C10.3542 8.22917 10.5 8.58333 10.5 9C10.5 9.41667 10.3542 9.77083 10.0625 10.0625C9.77083 10.3542 9.41667 10.5 9 10.5Z"
        fill="#8D90A0"
      />
    </svg>
  );
}

function EmployeeProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [emailCopied, setEmailCopied] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(employee.email);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 1500);
  };

  const employee = {
    name: "Sarah Jenkins",
    role: "Senior Staff Engineer",
    team: "Platform Core",
    status: "Active",
    location: "Seattle, WA (Remote)",
    tenure: "4 Yrs 2 Mos",
    email: "s.jenkins@company.com",
    phone: "+1 (555) 019-2834",
    timezone: "Pacific Time (PT) - Currently 10:42 AM",
    manager: "David Chen",
    department: "Engineering > Platform",
    costCenter: "ENG-402-PLT",
    directReports: 4,
  };

  const stats = [
    {
      label: "LATEST REVIEW SCORE",
      icon: ReviewScoreIcon,
      value: "4.8",
      delta: "+0.2",
      deltaPositive: true,
      sub: "Q3 2023 Cycle",
    },
    {
      label: "FLIGHT RISK",
      icon: FlightRiskIcon,
      value: "Low",
      valueClass: styles.statValueGreen,
      sub: "Based on tenure, comp",
    },
    {
      label: "ENGAGEMENT",
      icon: EngagementIcon,
      value: "92%",
      delta: "+5%",
      deltaPositive: true,
      sub: "Last 30 Days",
    },
    {
      label: "PRODUCTIVITY",
      icon: ProductivityIcon,
      value: "High",
      sub: "Top 10% in peer group",
    },
  ];

  const lifecycleStages = [
    { label: "Onboarding", state: "done", icon: Briefcase },
    { label: "Probation", state: "done", icon: Briefcase },
    { label: "Current Role", state: "active", icon: Briefcase },
    { label: "Development", state: "pending", icon: GraduationCap },
    { label: "Exit", state: "pending", icon: LogOut },
  ];

  const notes = [
    {
      title: "Q3 Performance Review Completed",
      date: "Oct 15, 2023",
      body: "Exceeded expectations. Notable contributions to the core infrastructure migration project. Promoted to Senior Staff Engineer.",
      state: "active",
      boxed: true,
    },
    {
      title: "Compensation Adjustment",
      date: "Oct 1, 2023",
      body: "Annual merit increase and equity refresh granted.",
      state: "default",
    },
    {
      title: "HR Note Added",
      date: "Aug 22, 2023",
      body: null,
      locked: true,
      state: "default",
    },
  ];

  return (
    <div className={styles.mainContainer}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <ArrowLeft size={15} />
        Back to People
      </button>

      <div className={styles.profileHeader}>
        <div className={styles.profileHeaderLeft}>
          <div className={styles.profileAvatar}>
            {employee.name
              .split(" ")
              .map((p) => p[0])
              .join("")}
          </div>
          <div>
            <div className={styles.profileName}>{employee.name}</div>
            <div className={styles.profileRole}>
              {employee.role} &middot; {employee.team}
            </div>
            <div className={styles.profileMetaRow}>
              <span className={styles.metaPillActive}>
                <span className={styles.metaDot} />
                {employee.status}
              </span>
              <span className={styles.metaPill}>
                <MapPin size={11} />
                {employee.location}
              </span>
              <span className={styles.metaPill}>
                <Clock size={11} />
                {employee.tenure}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.profileHeaderRight}>
          <button
            className={styles.editProfileBtn}
            onClick={() => setIsEditOpen(true)}
          >
            <Pencil size={13} />
            Edit Profile
          </button>
          <button className={styles.actionsBtn}>
            <MoreHorizontal size={15} />
            Actions
          </button>
        </div>
      </div>

      <div className={styles.topGrid}>
        <div className={styles.contactCard}>
          <div className={styles.cardTitle}>Contact Details</div>
          <div className={styles.contactField}>
            <div className={styles.fieldLabel}>EMAIL</div>
            <div className={styles.fieldValueRow}>
              <div className={styles.fieldValue}>
                <Mail size={12} />
                {employee.email}
              </div>
              <button className={styles.copyBtn} onClick={handleCopyEmail}>
                <Copy size={12} />
              </button>
              {emailCopied && <span className={styles.copiedTag}>Copied</span>}
            </div>
          </div>
          <div className={styles.contactField}>
            <div className={styles.fieldLabel}>PHONE</div>
            <div className={styles.fieldValue}>{employee.phone}</div>
          </div>
          <div className={styles.contactField}>
            <div className={styles.fieldLabel}>TIMEZONE</div>
            <div className={styles.fieldValue}>{employee.timezone}</div>
          </div>
        </div>

        <div className={styles.statsGrid}>
          {stats.map((s, i) => {
            const StatIcon = s.icon;
            return (
              <div className={styles.statCard} key={i}>
                <div className={styles.statLabelRow}>
                  <span className={styles.statLabel}>{s.label}</span>
                  {StatIcon && (
                    <StatIcon size={18} className={styles.statIcon} />
                  )}
                </div>
                <div className={styles.statValueRow}>
                  <span className={s.valueClass || styles.statValue}>
                    {s.value}
                  </span>
                  {s.delta && (
                    <span
                      className={
                        s.deltaPositive
                          ? styles.statDeltaPositive
                          : styles.statDeltaNegative
                      }
                    >
                      <TrendingUp size={11} />
                      {s.delta}
                    </span>
                  )}
                </div>
                <div className={styles.statSub}>{s.sub}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.secondGrid}>
        <div
          className={styles.orgCard}
          style={{ flex: 1, cursor: "pointer" }}
          onClick={() => navigate(`/hr/employees/${id}/organization-insights`)}
        >
          <div className={styles.cardTitle}>Organization</div>
          <div className={styles.managerRow}>
            <div className={styles.managerAvatar}>
              {employee.manager
                .split(" ")
                .map((p) => p[0])
                .join("")}
            </div>
            <div>
              <div className={styles.managerLabel}>MANAGER</div>
              <div className={styles.managerName}>{employee.manager}</div>
            </div>
          </div>
          <div className={styles.contactField}>
            <div className={styles.fieldLabel}>DEPARTMENT</div>
            <div className={styles.fieldValue}>{employee.department}</div>
          </div>
          <div className={styles.contactField}>
            <div className={styles.fieldLabel}>COST CENTER</div>
            <div className={styles.fieldValue}>{employee.costCenter}</div>
          </div>
          <div className={styles.contactField}>
            <div className={styles.fieldLabel}>DIRECT REPORTS</div>
            <div className={styles.fieldValue}>
              {employee.directReports} Engineers{" "}
              <span className={styles.viewTeamLink}>View Team</span>
            </div>
          </div>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.lifecycleCard}>
            <div className={styles.cardTitle}>Lifecycle Tracking</div>
            <div className={styles.lifecycleTrack}>
              {lifecycleStages.map((stage, i) => {
                const StageIcon = stage.icon;
                return (
                  <React.Fragment key={stage.label}>
                    <div className={styles.lifecycleStage}>
                      <div
                        className={
                          stage.state === "done"
                            ? styles.lifecycleDotDone
                            : stage.state === "active"
                              ? styles.lifecycleDotActive
                              : styles.lifecycleDotPending
                        }
                      >
                        {stage.state === "done" ? (
                          <Check size={14} />
                        ) : (
                          StageIcon && <StageIcon size={14} />
                        )}
                      </div>
                      <span
                        className={
                          stage.state === "active"
                            ? styles.lifecycleLabelActive
                            : stage.state === "done"
                              ? styles.lifecycleLabelDone
                              : styles.lifecycleLabel
                        }
                      >
                        {stage.label}
                      </span>
                    </div>
                    {i < lifecycleStages.length - 1 && (
                      <div
                        className={
                          stage.state === "done"
                            ? styles.lifecycleLineDone
                            : styles.lifecycleLine
                        }
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div className={styles.notesCard}>
            <div className={styles.notesHeader}>
              <div className={styles.cardTitle}>
                HR Notes &amp; Case Records
              </div>
              <span className={styles.addNoteLink}>
                <Plus size={13} />
                Add Note
              </span>
            </div>
            <div className={styles.notesList}>
              {notes.map((note, i) => (
                <div className={styles.noteItem} key={i}>
                  <div
                    className={
                      note.state === "active"
                        ? styles.noteDotActive
                        : styles.noteDot
                    }
                  />
                  <div className={styles.noteBody}>
                    <div className={styles.noteTopRow}>
                      <span className={styles.noteTitle}>{note.title}</span>
                      <span className={styles.noteDate}>{note.date}</span>
                    </div>
                    {note.body && (
                      <p
                        className={
                          note.boxed ? styles.noteText : styles.noteTextPlain
                        }
                      >
                        {note.body}
                      </p>
                    )}
                    {note.locked && (
                      <p className={styles.noteLocked}>
                        <Lock size={11} />
                        Visible only to HR Business Partners
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isEditOpen && (
        <EditEmployeeModal
          employee={employee}
          onClose={() => setIsEditOpen(false)}
          onSave={(updated) => {
            console.log("Saved:", updated);
            setIsEditOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default EmployeeProfile;
