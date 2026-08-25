import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../CSS/hiringModule.module.css";
import {
  Rocket,
  Plus,
  Maximize2,
  MoreVertical,
  Star,
  CheckCircle2,
  MapPin,
  X,
  ChevronDown,
} from "lucide-react";

function MatchCheckIcon({ size = 22 }) {
  return (
    <svg
      width={size}
      height={size * (21 / 22)}
      viewBox="0 0 22 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.6 21L5.7 17.8L2.1 17L2.45 13.3L0 10.5L2.45 7.7L2.1 4L5.7 3.2L7.6 0L11 1.45L14.4 0L16.3 3.2L19.9 4L19.55 7.7L22 10.5L19.55 13.3L19.9 17L16.3 17.8L14.4 21L11 19.55L7.6 21ZM8.45 18.45L11 17.35L13.6 18.45L15 16.05L17.75 15.4L17.5 12.6L19.35 10.5L17.5 8.35L17.75 5.55L15 4.95L13.55 2.55L11 3.65L8.4 2.55L7 4.95L4.25 5.55L4.5 8.35L2.65 10.5L4.5 12.6L4.25 15.45L7 16.05L8.45 18.45ZM9.95 14.05L15.6 8.4L14.2 6.95L9.95 11.2L7.8 9.1L6.4 10.5L9.95 14.05Z"
        fill="#81C995"
      />
    </svg>
  );
}
function FilterIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size * (13 / 17.5)}
      viewBox="0 0 17.5 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.25 9V7.5H8.25V9H5.25ZM2.25 5.25V3.75H11.25V5.25H2.25ZM0 1.5V0H13.5V1.5H0Z"
        fill="#A5A5A5"
      />
    </svg>
  );
}
function PipelineIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 14H6V4H4V14ZM12 12H14V4H12V12ZM8 9H10V4H8V9ZM2 18C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H16C16.55 0 17.0208 0.195833 17.4125 0.5875C17.8042 0.979167 18 1.45 18 2V16C18 16.55 17.8042 17.0208 17.4125 17.4125C17.0208 17.8042 16.55 18 16 18H2ZM2 16H16V2H2V16ZM2 2V16V2Z"
        fill="#0050B8"
      />
    </svg>
  );
}
function BriefcaseIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size * (19 / 20)}
      viewBox="0 0 20 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 19C1.45 19 0.979167 18.8042 0.5875 18.4125C0.195833 18.0208 0 17.55 0 17V6C0 5.45 0.195833 4.97917 0.5875 4.5875C0.979167 4.19583 1.45 4 2 4H6V2C6 1.45 6.19583 0.979167 6.5875 0.5875C6.97917 0.195833 7.45 0 8 0H12C12.55 0 13.0208 0.195833 13.4125 0.5875C13.8042 0.979167 14 1.45 14 2V4H18C18.55 4 19.0208 4.19583 19.4125 4.5875C19.8042 4.97917 20 5.45 20 6V17C20 17.55 19.8042 18.0208 19.4125 18.4125C19.0208 18.8042 18.55 19 18 19H2ZM2 17H18V6H2V17ZM8 4H12V2H8V4ZM2 17V6V17Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CreateJobModal({ onClose }) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <X className={styles.modalClose} size={20} onClick={onClose} />
        <h2 className={styles.modalTitle}>Create New Job</h2>
        <p className={styles.modalSubtitle}>
          Fill the fields below to post a new job opening
        </p>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <div className={styles.formLabel}>
              JOB TITLE <span className={styles.requiredStar}>*</span>
            </div>
            <input
              className={styles.formInput}
              placeholder="e.g. Senior Frontend Engineer"
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <div className={styles.formLabel}>
              DEPARTMENT <span className={styles.requiredStar}>*</span>
            </div>
            <div style={{ position: "relative" }}>
              <select className={styles.formSelect} defaultValue="">
                <option value="" disabled>
                  Select
                </option>
                <option>Engineering</option>
                <option>Design</option>
                <option>Marketing</option>
                <option>Finance</option>
              </select>
              <ChevronDown
                size={16}
                style={{
                  position: "absolute",
                  right: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#6B7280",
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <div className={styles.formLabel}>
              LOCATION <span className={styles.requiredStar}>*</span>
            </div>
            <input
              className={styles.formInput}
              placeholder="City, Country or Remote"
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <div className={styles.formLabel}>
              EMPLOYMENT TYPE <span className={styles.requiredStar}>*</span>
            </div>
            <div style={{ position: "relative" }}>
              <select className={styles.formSelect} defaultValue="">
                <option value="" disabled>
                  Select
                </option>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
              <ChevronDown
                size={16}
                style={{
                  position: "absolute",
                  right: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#6B7280",
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <div className={styles.formLabel}>SALARY RANGE</div>
            <input
              className={styles.formInput}
              placeholder="e.g. $80,000 - $120,000"
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <div className={styles.formLabel}>
              JOB DESCRIPTION <span className={styles.requiredStar}>*</span>
            </div>
            <textarea
              className={styles.formTextarea}
              placeholder="Detail the responsibilities, requirements, and benefits..."
            />
          </div>
        </div>

        <div className={styles.modalFooter}>
          <span className={styles.requiredNote}>* Required fields</span>
          <button className={styles.postJobBtn}>Post Job</button>
        </div>
      </div>
    </div>
  );
}

function HiringModule() {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const requisitions = [
    {
      id: "ENG-042",
      status: "OPEN",
      statusType: "open",
      title: "Senior Backend Engineer",
      location: "San Francisco, CA • Remote",
      leftValue: "42",
      leftLabel: "APPLICANTS",
      rightValue: "14",
      rightLabel: "DAYS OPEN",
    },
    {
      id: "DES-018",
      status: "OPEN",
      statusType: "open",
      title: "Product Designer",
      location: "New York, NY • Hybrid",
      leftValue: "128",
      leftLabel: "APPLICANTS",
      rightValue: "5",
      rightLabel: "DAYS OPEN",
    },
    {
      id: "MKT-099",
      status: "DRAFT",
      statusType: "draft",
      title: "Growth Marketing Lead",
      location: "London, UK • On-site",
      leftValue: "0",
      leftLabel: "APPLICANTS",
      rightValue: "—",
      rightLabel: "DAYS OPEN",
    },
    {
      id: "FIN-003",
      status: "FILLED",
      statusType: "filled",
      title: "Financial Analyst",
      location: "Chicago, IL • Hybrid",
      leftValue: "86",
      leftLabel: "TOTAL",
      rightValue: "Hired",
      rightLabel: "STATUS",
    },
  ];

  const pipeline = {
    applied: [
      {
        name: "Sarah Jenkins",
        time: "2hr ago",
        meta: "Stripe • 5 YOE",
        tags: ["Python", "AWS"],
      },
      {
        name: "Michael Chang",
        time: "1d ago",
        meta: "Netflix • 3 YOE",
        tags: ["Java"],
      },
    ],
    shortlisted: [
      {
        name: "Elena Rodriguez",
        time: "3d ago",
        meta: "Google • 7 YOE",
        tags: ["Go", "k8s"],
        starred: true,
      },
    ],
    selected: [
      {
        name: "David Kim",
        meta: "Airbnb • 6 YOE",
        note: "Approved by Tech",
      },
    ],
  };

  const candidate = {
    name: "David Kim",
    role: "Senior Backend Engineer",
    location: "SEATTLE, WA",
    match: 94,
    notes: [
      {
        text: "Exceptional system design skills. Navigated the distributed cache problem perfectly.",
        author: "Sarah L. (Tech Lead)",
      },
      {
        text: "Strong communication. Good cultural add for the platform team.",
        author: "Mike T. (Engineering Mgr)",
      },
    ],
    skills: ["Golang", "System Architecture", "Kubernetes", "gRPC"],
  };

  const statusClass = (type) =>
    type === "open"
      ? styles.statusOpen
      : type === "draft"
        ? styles.statusDraft
        : styles.statusFilled;

  return (
    <div className={styles.mainContainer}>
      <div className={styles.pageHeaderRow}>
        <div className={styles.pageHeaderLeft}>
          <h1 className={styles.pageTitle}>Hiring Module</h1>
          <p className={styles.pageSubtitle}>
            Manage active requisitions and candidate pipelines.
          </p>
        </div>
        <button
          className={styles.createBtn}
          onClick={() => setShowCreateModal(true)}
        >
          <Plus size={16} />
          Create New Job
        </button>
      </div>

      <div className={styles.sectionHeaderRow}>
        <div
          className={styles.sectionTitle}
          onClick={() => navigate("/hr/hiring/active-requisitions")}
        >
          <BriefcaseIcon size={18} />
          Active Requisitions
        </div>
        <a className={styles.viewAllLink} href="#">
          View All Postings →
        </a>
      </div>

      <div className={styles.reqGrid}>
        {requisitions.map((req) => (
          <div className={styles.reqCard} key={req.id}>
            <div className={styles.reqTopRow}>
              <span className={styles.reqId}>{req.id}</span>
              <span
                className={`${styles.reqStatus} ${statusClass(
                  req.statusType
                )}`}
              >
                {req.status}
              </span>
            </div>
            <div className={styles.reqTitle}>{req.title}</div>
            <div className={styles.reqLocation}>
              <MapPin size={12} />
              {req.location}
            </div>
            <div className={styles.reqStatsRow}>
              <div className={styles.reqStat}>
                <span className={styles.reqStatValue}>{req.leftValue}</span>
                <span className={styles.reqStatLabel}>{req.leftLabel}</span>
              </div>
              <div className={styles.reqStat}>
                <span className={styles.reqStatValue}>{req.rightValue}</span>
                <span className={styles.reqStatLabel}>{req.rightLabel}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.bottomGrid}>
        <div className={styles.pipelineCard}>
          <div className={styles.pipelineHeader}>
  <div className={styles.pipelineTitle}>
    <PipelineIcon size={18} />
    Pipeline: Senior Backend Eng
  </div>
  <div className={styles.pipelineActions}>
    <FilterIcon size={16} />
    <MoreVertical size={16} className={styles.pipelineMenuIcon} />
  </div>
</div>

          <div className={styles.pipelineColumns}>
            <div className={styles.pipelineColumn}>
              <div className={styles.pipelineColHeader}>
                <span>Applied</span>
                <span className={styles.pipelineCount}>24</span>
              </div>
              {pipeline.applied.map((c, i) => (
                <div className={styles.candidateCard} key={i}>
                  <div className={styles.candidateTopRow}>
                    <span className={styles.candidateName}>{c.name}</span>
                    <span className={styles.candidateTime}>{c.time}</span>
                  </div>
                  <div className={styles.candidateMeta}>{c.meta}</div>
                  <div className={styles.candidateTagsRow}>
                    {c.tags.map((t, j) => (
                      <span className={styles.candidateTag} key={j}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.pipelineColumn}>
              <div className={styles.pipelineColHeader}>
                <span>Shortlisted</span>
                <span
                  className={`${styles.pipelineCount} ${styles.pipelineCountBlue}`}
                >
                  8
                </span>
              </div>
              {pipeline.shortlisted.map((c, i) => (
                <div
                  className={`${styles.candidateCard} ${styles.candidateCardShortlisted}`}
                  key={i}
                >
                  <div className={styles.candidateTopRow}>
                    <span className={styles.candidateName}>{c.name}</span>
                    <span className={styles.candidateTime}>{c.time}</span>
                  </div>
                  <div className={styles.candidateMeta}>{c.meta}</div>
                  <div className={styles.candidateTagsRow}>
                    {c.tags.map((t, j) => (
                      <span className={styles.candidateTag} key={j}>
                        {t}
                      </span>
                    ))}
                    {c.starred && (
                      <Star
                        size={13}
                        className={styles.candidateStar}
                        fill="#FFB04C"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.pipelineColumn}>
              <div className={styles.pipelineColHeader}>
                <span>Selected</span>
              </div>
              {pipeline.selected.map((c, i) => (
                <div
                  className={`${styles.candidateCard} ${styles.candidateCardSelected}`}
                  key={i}
                >
                  <div className={styles.candidateTopRow}>
                    <span className={styles.candidateName}>{c.name}</span>
                  </div>
                  <div className={styles.candidateMeta}>{c.meta}</div>
                  <div className={styles.candidateNoteRow}>
                    <CheckCircle2 size={12} />
                    {c.note}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.previewCard}>
          <div className={styles.previewHeader}>
            <span>Candidate Preview</span>
            <Maximize2 size={15} className={styles.previewExpandIcon} />
          </div>

          <div className={styles.previewProfileRow}>
            <div className={styles.previewAvatar}>
              {candidate.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className={styles.previewProfileInfo}>
              <div className={styles.previewName}>{candidate.name}</div>
              <div className={styles.previewRole}>{candidate.role}</div>
              <div className={styles.previewLocation}>
                <MapPin size={11} />
                {candidate.location}
              </div>
            </div>
          </div>

          <div className={styles.matchRow}>
            <span className={styles.matchLabel}>
              <MatchCheckIcon size={16} />
              Overall Match
            </span>
            <span className={styles.matchValue}>{candidate.match}%</span>
          </div>

          <div className={styles.previewSectionLabel}>Evaluation Notes</div>
          <div className={styles.notesList}>
            {candidate.notes.map((n, i) => (
  <div className={styles.noteItem} key={i}>
    <span className={styles.noteDot} style={{ background: i === 0 ? "#0050B8" : "#343439" }} />
    <p className={styles.noteText}>"{n.text}"</p>
    <span className={styles.noteAuthor}>- {n.author}</span>
  </div>
))}
          </div>

          <div className={styles.previewSectionLabel}>Key Skills</div>
          <div className={styles.skillsRow}>
            {candidate.skills.map((s, i) => (
              <span className={styles.skillTag} key={i}>
                {s}
              </span>
            ))}
          </div>

          <button className={styles.onboardBtn}>
            <Rocket size={14} />
            Initiate Onboarding
          </button>
          <button className={styles.rejectBtn}>Reject Candidate</button>
        </div>
      </div>

      {showCreateModal && (
        <CreateJobModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}

export default HiringModule;