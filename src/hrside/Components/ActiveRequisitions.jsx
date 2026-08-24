import React from "react";
import styles from "../CSS/activeRequisitions.module.css";
import {
  Search,
  Home,
  Users,
  Briefcase,
  UserCheck,
  FileText,
  Headphones,
  User,
  MoreVertical,
  Filter,
  Plus,
  Users as UsersIcon,
  Calendar,
  Clock,
} from "lucide-react";

function ActiveRequisitions() {
  const requisitions = [
    {
      dept: "ENGINEERING",
      deptClass: styles.deptEngineering,
      title: "Senior Frontend Engineer",
      location: "San Francisco, CA",
      candidates: 24,
      open: "12d open",
    },
    {
      dept: "DESIGN",
      deptClass: styles.deptDesign,
      title: "Product Designer",
      location: "Remote",
      candidates: 42,
      open: "5d open",
    },
    {
      dept: "MARKETING",
      deptClass: styles.deptMarketing,
      title: "Growth Marketing Mgr",
      location: "New York, NY",
      candidates: 8,
      open: "2d open",
    },
    {
      dept: "MARKETING",
      deptClass: styles.deptMarketing,
      title: "Growth Marketing Mgr",
      location: "New York, NY",
      candidates: 8,
      open: "2d open",
    },
  ];

  const columns = [
    {
      key: "applied",
      label: "Applied",
      count: 3,
      candidates: [
        {
          name: "Jane Smith",
          role: "UI Designer at ACME",
          meta: "Applied 2d ago",
          match: 65,
          matchClass: styles.matchMed,
        },
        {
          name: "Michael Reed",
          role: "Freelance Designer",
          meta: "Applied 3d ago",
          match: 72,
          matchClass: styles.matchMed,
        },
      ],
    },
    {
      key: "shortlisted",
      label: "Shortlisted",
      count: 2,
      candidates: [
        {
          name: "Elena Rodriguez",
          role: "Senior UI at TechCorp",
          meta: "Moved 1d ago",
          match: 92,
          matchClass: styles.matchHigh,
        },
      ],
    },
    {
      key: "interviewing",
      label: "Interviewing",
      count: 1,
      candidates: [
        {
          name: "David Chen",
          role: "Product Designer",
          meta: "Today, 2 PM",
          match: 88,
          matchClass: styles.matchHigh,
          progress: 66,
          round: "Round 2 / 3",
        },
      ],
    },
    {
      key: "selected",
      label: "Selected / Rejected",
      count: 1,
      candidates: [
        {
          name: "Anna Brooks",
          role: "Jr Designer",
          rejected: true,
        },
      ],
    },
  ];

  const initials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("");

  return (
    <div className={styles.main}>
        <div className={styles.sectionHeaderRow}>
          <span className={styles.sectionTitle}>Active Requisitions</span>
          <a className={styles.viewAllLink}>View All</a>
        </div>

        <div className={styles.reqGrid}>
          {requisitions.map((req, i) => (
            <div className={styles.reqCard} key={i}>
              <div className={styles.reqTopRow}>
                <span className={`${styles.deptBadge} ${req.deptClass}`}>
                  {req.dept}
                </span>
                <MoreVertical size={14} className={styles.reqMenuDots} />
              </div>
              <div className={styles.reqTitle}>{req.title}</div>
              <div className={styles.reqLocation}>{req.location}</div>
              <div className={styles.reqStatsRow}>
                <span className={styles.reqStatItem}>
                  <UsersIcon size={12} />
                  {req.candidates} Candidates
                </span>
                <span className={styles.reqStatItem}>
                  <Calendar size={12} />
                  {req.open}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.pipelineHeaderRow}>
          <span className={styles.pipelineTitle}>
            Candidate Pipeline: Product Designer
          </span>
          <div className={styles.pipelineActions}>
            <button className={styles.filterBtn}>
              <Filter size={13} />
              Filter
            </button>
            <button className={styles.addCandidateBtn}>
              <Plus size={13} />
              Add Candidate
            </button>
          </div>
        </div>

        <div className={styles.kanbanBoard}>
          {columns.map((col) => (
            <div className={styles.kanbanColumn} key={col.key}>
              <div className={styles.kanbanColHeader}>
                <span>{col.label}</span>
                <span className={styles.kanbanCount}>{col.count}</span>
              </div>

              {col.candidates.map((c, i) => (
                <div
                  className={`${styles.candidateCard} ${
                    c.rejected ? styles.candidateRejected : ""
                  }`}
                  key={i}
                >
                  <div className={styles.candidateTopRow}>
                    <div className={styles.candidateAvatar}>
                      {initials(c.name)}
                    </div>
                    <div className={styles.candidateInfo}>
                      <span className={styles.candidateName}>{c.name}</span>
                      <span className={styles.candidateRole}>{c.role}</span>
                    </div>
                  </div>

                  {c.rejected ? (
                    <span className={styles.rejectedTag}>Rejected</span>
                  ) : (
                    <div className={styles.candidateMetaRow}>
                      <span className={styles.candidateMeta}>
                        <Clock size={11} />
                        {c.meta}
                      </span>
                      <span className={`${styles.matchBadge} ${c.matchClass}`}>
                        {c.match}% Match
                      </span>
                    </div>
                  )}

                  {c.progress != null && (
                    <>
                      <div className={styles.progressTrack}>
                        <div
                          className={styles.progressFill}
                          style={{ width: `${c.progress}%` }}
                        />
                      </div>
                      <span className={styles.roundLabel}>{c.round}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
    </div>
  );
}

export default ActiveRequisitions;