import React from "react";
import styles from "../CSS/hrdashboard.module.css";
import { useSidebar } from "./SidebarContext";
import {
  Users,
  UserPlus,
  CreditCard,
  CheckCircle2,
  TrendingUp,
  Download,
  Smile,
  AlertTriangle,
  ShieldAlert,
  Clock,
  UserCog,
  Inbox,
  Loader2,
  Gauge,
  TrendingDown,
  Flag,
  BatteryLow,
} from "lucide-react";

function HRDashboard() {
  const { collapsed } = useSidebar();
  const pipeline = [
    { dept: "Engineering (12)", percent: 65 },
    { dept: "Sales (8)", percent: 75 },
    { dept: "Operations (5)", percent: 90 },
  ];

  const payrollPercent = 82;
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const payrollOffset = circumference * (1 - payrollPercent / 100);

  const cards = [
    {
      icon: <Users size={22} />,
      change: "+4.5%",
      title: "Total Active Employees",
      value: "1,248",
      subtitle: "Total workforce count",
    },
    {
      icon: <UserPlus size={22} />,
      change: "+4.5%",
      title: "New Joinees",
      value: "32",
      subtitle: "Joined this month",
    },
    {
      icon: <CreditCard size={22} />,
      change: "+4.5%",
      title: "Payroll Pending",
      value: "$45k",
      subtitle: "3 approvals remaining",
    },
    {
      icon: <CheckCircle2 size={22} />,
      change: "+4.5%",
      title: "Onboarding Completion",
      value: "87%",
      subtitle: "Average across depts",
    },
  ];

  return (
    <div className={`${styles.mainContainer} ${collapsed ? styles.mainContainerCollapsed : ""}`}>
      <div className={styles.topcontainer}>
        <div className={styles.topleft}>
          <div className={styles.topleft1}>Dashboard</div>
          <div className={styles.topleft2}>
            Real-time HR operations and organizational health.
          </div>
        </div>
        <div className={styles.topright}>
          <div className={styles.topright1}>
            <Download size={16} />
            Export Report
          </div>
        </div>
      </div>

      <div className={styles.cards}>
        {cards.map((card, i) => (
          <div className={styles.card} key={i}>
            <div className={styles.cardTopRow}>
              <div className={styles.cardIcon}>{card.icon}</div>
              <div className={styles.cardChange}>
                <TrendingUp size={14} />
                {card.change}
              </div>
            </div>
            <div className={styles.cardTitle}>{card.title}</div>
            <div className={styles.cardValue}>{card.value}</div>
            <div className={styles.cardSubtitle}>{card.subtitle}</div>
          </div>
        ))}
      </div>

      <div className={styles.healthRow}>
        {/* Organizational Health */}
        <div className={styles.healthCard}>
          <div className={styles.healthCardHeader}>
            <div>
              <div className={styles.healthTitle}>Organizational Health</div>
              <div className={styles.healthSubtitle}>Last 30 days</div>
            </div>
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.healthIcon}
            >
              <path
                d="M0 18V16L2 14V18H0ZM4 18V12L6 10V18H4ZM8 18V10L10 12.025V18H8ZM12 18V12.025L14 10.025V18H12ZM16 18V8L18 6V18H16ZM0 12.825V10L7 3L11 7L18 0V2.825L11 9.825L7 5.825L0 12.825Z"
                fill="#0056D2"
              />
            </svg>
          </div>

          <div className={styles.healthStats}>
            <div className={styles.statBlock}>
              <div className={styles.statNumberBlue}>
                85<span className={styles.statPercentSign}>%</span>
              </div>
              <div className={styles.statLabel}>Employee Satisfaction</div>
            </div>

            <div className={styles.statDivider} />

            <div className={styles.statBlock}>
              <div className={styles.statNumberRed}>4</div>
              <div className={styles.statLabel}>Open Grievances</div>
            </div>

            <div className={styles.statDivider} />

            <div className={styles.trendBlock}>
              <div className={styles.trendLabel}>Attrition Trend (-1.2%)</div>
              <div className={styles.trendBars}>
                <span className={styles.trendBar} style={{ height: "32px" }} />
                <span className={styles.trendBar} style={{ height: "26px" }} />
                <span className={styles.trendBar} style={{ height: "19px" }} />
                <span className={styles.trendBar} style={{ height: "26px" }} />
                <span
                  className={styles.trendBarActive}
                  style={{ height: "16px" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pulse Sentiment */}
        <div className={styles.pulseCard}>
          <div className={styles.pulseHeader}>
            <div className={styles.pulseTitle}>Pulse Sentiment</div>
            <Smile size={18} className={styles.pulseIcon} />
          </div>

          <div className={styles.pulseRows}>
            <div className={styles.pulseRow}>
              <div className={styles.pulseTopLine}>
                <div className={styles.pulseLabelWrap}>
                  <span className={styles.pulseDotBlue} />
                  <span className={styles.pulseLabel}>Positive</span>
                </div>
                <span className={styles.pulsePercent}>65%</span>
              </div>
              <div className={styles.pulseBarTrack}>
                <div
                  className={styles.pulseBarFillBlue}
                  style={{ width: "65%" }}
                />
              </div>
            </div>

            <div className={styles.pulseRow}>
              <div className={styles.pulseTopLine}>
                <div className={styles.pulseLabelWrap}>
                  <span className={styles.pulseDotGrey} />
                  <span className={styles.pulseLabel}>Neutral</span>
                </div>
                <span className={styles.pulsePercent}>25%</span>
              </div>
              <div className={styles.pulseBarTrack}>
                <div
                  className={styles.pulseBarFillGrey}
                  style={{ width: "25%" }}
                />
              </div>
            </div>

            <div className={styles.pulseRow}>
              <div className={styles.pulseTopLine}>
                <div className={styles.pulseLabelWrap}>
                  <span className={styles.pulseDotRed} />
                  <span className={styles.pulseLabel}>Negative</span>
                </div>
                <span className={styles.pulsePercent}>10%</span>
              </div>
              <div className={styles.pulseBarTrack}>
                <div
                  className={styles.pulseBarFillRed}
                  style={{ width: "10%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.opsRow}>
        {/* Action Center */}
        <div className={styles.actionCard}>
          <div className={styles.actionHeader}>
            <div className={styles.actionHeaderLeft}>
              <AlertTriangle size={16} className={styles.actionHeaderIcon} />
              <span className={styles.actionHeaderTitle}>Action Center</span>
            </div>
            <span className={styles.viewAllLink}>View All</span>
          </div>

          <div className={styles.actionList}>
            <div className={`${styles.actionItem} ${styles.actionItemRed}`}>
              <div className={styles.actionIconBadgeRed}>
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 23 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 19.0833V17.9167H13V19.0833H6ZM9.29583 16.2542L6 12.9583L7.225 11.7042L10.55 15L9.29583 16.2542ZM13 12.55L9.70417 9.225L10.9583 8L14.2542 11.2958L13 12.55ZM15.6833 18.5L8.07083 10.8875L8.8875 10.0708L16.5 17.6833L15.6833 18.5Z"
                    fill="#FF5447"
                  />
                </svg>
              </div>
              <div className={styles.actionItemBody}>
                <div className={styles.actionItemTopRow}>
                  <span className={styles.actionItemTitle}>Compliance Escalation</span>
                  <span className={`${styles.actionBadge} ${styles.actionBadgeRed}`}>Review</span>
                </div>
                <p className={styles.actionItemText}>
                  I-9 verification delayed for 3 new hires in EU region.
                </p>
              </div>
            </div>

            <div className={`${styles.actionItem} ${styles.actionItemOrange}`}>
              <Clock size={16} className={styles.actionItemIconOrange} />
              <div className={styles.actionItemBody}>
                <div className={styles.actionItemTopRow}>
                  <span className={styles.actionItemTitle}>SLA Breach Warning</span>
                  <span className={`${styles.actionBadge} ${styles.actionBadgeOrange}`}>Assign</span>
                </div>
                <p className={styles.actionItemText}>4 payroll tickets nearing 48h limit.</p>
              </div>
            </div>

            <div className={`${styles.actionItem} ${styles.actionItemBlue}`}>
              <UserCog size={16} className={styles.actionItemIconBlue} />
              <div className={styles.actionItemBody}>
                <div className={styles.actionItemTopRow}>
                  <span className={styles.actionItemTitle}>Onboarding Stalled</span>
                  <span className={`${styles.actionBadge} ${styles.actionBadgeBlue}`}>Nudge</span>
                </div>
                <p className={styles.actionItemText}>2 hires haven't completed day-1 tasks.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Leaves & Exits */}
        <div className={styles.leavesCard}>
          <div className={styles.leavesHeader}>Leaves &amp; Exits</div>

          <div className={styles.leavesBlock}>
            <div className={styles.leavesNumber}>12</div>
            <div className={styles.leavesLabel}>ACTIVE LEAVES</div>
          </div>

          <div className={styles.leavesDivider} />

          <div className={styles.leavesBlock}>
            <div className={styles.exitsNumber}>3</div>
            <div className={styles.leavesLabel}>PENDING EXITS</div>
          </div>

          <button className={styles.processExitsBtn}>Process Exits</button>
        </div>

        {/* Doc Verification */}
        <div className={styles.docCard}>
          <div className={styles.docHeader}>Doc Verification</div>

          <div className={styles.docList}>
            <div className={styles.docRow}>
              <span className={styles.docLabel}>Pending</span>
              <span className={styles.docValue}>18</span>
            </div>
            <div className={styles.docRow}>
              <span className={styles.docLabel}>Approved (Today)</span>
              <span className={styles.docValueGreen}>42</span>
            </div>
            <div className={`${styles.docRow} ${styles.docRowAlert}`}>
              <span className={styles.docLabel}>Re-upload Req.</span>
              <span className={styles.docValueRed}>5</span>
            </div>
          </div>

          <button className={styles.reviewQueueBtn}>Review Queue</button>
        </div>
      </div>

      <div className={styles.pipelineRow}>
        {/* Onboarding Pipeline */}
        <div className={styles.pipelineCard}>
          <div className={styles.pipelineHeader}>
            <span className={styles.pipelineTitle}>Onboarding Pipeline</span>
            <div className={styles.pipelineLegend}>
              <span className={styles.legendItem}>
                <span className={styles.legendDotGrey} /> Pending
              </span>
              <span className={styles.legendItem}>
                <span className={styles.legendDotBlue} /> In Progress
              </span>
              <span className={styles.legendItem}>
                <span className={styles.legendDotOutline} /> Completed
              </span>
            </div>
          </div>

          <div className={styles.pipelineList}>
            {pipeline.map((p, i) => (
              <div className={styles.pipelineItem} key={i}>
                <div className={styles.pipelineDept}>{p.dept}</div>
                <div className={styles.pipelineBarTrack}>
                  <div
                    className={styles.pipelineBarFill}
                    style={{ width: `${p.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payroll Cycle */}
        <div className={styles.payrollCard}>
          <div className={styles.payrollHeader}>
            <span className={styles.payrollTitle}>Payroll Cycle</span>
            <svg
              width="13"
              height="10"
              viewBox="0 0 13 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.payrollIcon}
            >
              <path
                d="M7.58333 5.25C7.09722 5.25 6.68403 5.07986 6.34375 4.73958C6.00347 4.39931 5.83333 3.98611 5.83333 3.5C5.83333 3.01389 6.00347 2.60069 6.34375 2.26042C6.68403 1.92014 7.09722 1.75 7.58333 1.75C8.06944 1.75 8.48264 1.92014 8.82292 2.26042C9.16319 2.60069 9.33333 3.01389 9.33333 3.5C9.33333 3.98611 9.16319 4.39931 8.82292 4.73958C8.48264 5.07986 8.06944 5.25 7.58333 5.25ZM3.5 7C3.17917 7 2.90451 6.88576 2.67604 6.65729C2.44757 6.42882 2.33333 6.15417 2.33333 5.83333V1.16667C2.33333 0.845833 2.44757 0.571181 2.67604 0.342708C2.90451 0.114236 3.17917 0 3.5 0H11.6667C11.9875 0 12.2622 0.114236 12.4906 0.342708C12.7191 0.571181 12.8333 0.845833 12.8333 1.16667V5.83333C12.8333 6.15417 12.7191 6.42882 12.4906 6.65729C12.2622 6.88576 11.9875 7 11.6667 7H3.5ZM4.66667 5.83333H10.5C10.5 5.5125 10.6142 5.23785 10.8427 5.00938C11.0712 4.7809 11.3458 4.66667 11.6667 4.66667V2.33333C11.3458 2.33333 11.0712 2.2191 10.8427 1.99063C10.6142 1.76215 10.5 1.4875 10.5 1.16667H4.66667C4.66667 1.4875 4.55243 1.76215 4.32396 1.99063C4.09549 2.2191 3.82083 2.33333 3.5 2.33333V4.66667C3.82083 4.66667 4.09549 4.7809 4.32396 5.00938C4.55243 5.23785 4.66667 5.5125 4.66667 5.83333ZM11.0833 9.33333H1.16667C0.845833 9.33333 0.571181 9.2191 0.342708 8.99063C0.114236 8.76215 0 8.4875 0 8.16667V1.75H1.16667V8.16667H11.0833V9.33333ZM3.5 5.83333V1.16667V5.83333Z"
                fill="#0056D2"
              />
            </svg>
          </div>

          <div className={styles.payrollRingWrap}>
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="#23262d"
                strokeWidth="10"
              />
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="#0056D2"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={payrollOffset}
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className={styles.payrollPercentLabel}>{payrollPercent}%</div>
          </div>

          <div className={styles.payrollProcessed}>Processed</div>
          <div className={styles.payrollMeta}>Total: $1.2M</div>
          <div className={styles.payrollMeta}>Scheduled: Tomorrow</div>

          <button className={styles.viewBatchBtn}>View Batch</button>
        </div>

        {/* Ticket Overview */}
        <div className={styles.ticketCard}>
          <div className={styles.ticketHeader}>
            <span className={styles.ticketTitle}>Ticket Overview</span>
            <svg
              width="12"
              height="10"
              viewBox="0 0 12 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.ticketHeaderIcon}
            >
              <path
                d="M5.83333 7.58333C5.99861 7.58333 6.13715 7.52743 6.24896 7.41563C6.36076 7.30382 6.41667 7.16528 6.41667 7C6.41667 6.83472 6.36076 6.69618 6.24896 6.58437C6.13715 6.47257 5.99861 6.41667 5.83333 6.41667C5.66806 6.41667 5.52951 6.47257 5.41771 6.58437C5.3059 6.69618 5.25 6.83472 5.25 7C5.25 7.16528 5.3059 7.30382 5.41771 7.41563C5.52951 7.52743 5.66806 7.58333 5.83333 7.58333ZM5.83333 5.25C5.99861 5.25 6.13715 5.1941 6.24896 5.08229C6.36076 4.97049 6.41667 4.83194 6.41667 4.66667C6.41667 4.50139 6.36076 4.36285 6.24896 4.25104C6.13715 4.13924 5.99861 4.08333 5.83333 4.08333C5.66806 4.08333 5.52951 4.13924 5.41771 4.25104C5.3059 4.36285 5.25 4.50139 5.25 4.66667C5.25 4.83194 5.3059 4.97049 5.41771 5.08229C5.52951 5.1941 5.66806 5.25 5.83333 5.25ZM5.83333 2.91667C5.99861 2.91667 6.13715 2.86076 6.24896 2.74896C6.36076 2.63715 6.41667 2.49861 6.41667 2.33333C6.41667 2.16806 6.36076 2.02951 6.24896 1.91771C6.13715 1.8059 5.99861 1.75 5.83333 1.75C5.66806 1.75 5.52951 1.8059 5.41771 1.91771C5.3059 2.02951 5.25 2.16806 5.25 2.33333C5.25 2.49861 5.3059 2.63715 5.41771 2.74896C5.52951 2.86076 5.66806 2.91667 5.83333 2.91667ZM10.5 9.33333H1.16667C0.845833 9.33333 0.571181 9.2191 0.342708 8.99063C0.114236 8.76215 0 8.4875 0 8.16667V5.83333C0.320833 5.83333 0.595486 5.7191 0.823958 5.49062C1.05243 5.26215 1.16667 4.9875 1.16667 4.66667C1.16667 4.34583 1.05243 4.07118 0.823958 3.84271C0.595486 3.61424 0.320833 3.5 0 3.5V1.16667C0 0.845833 0.114236 0.571181 0.342708 0.342708C0.571181 0.114236 0.845833 0 1.16667 0H10.5C10.8208 0 11.0955 0.114236 11.324 0.342708C11.5524 0.571181 11.6667 0.845833 11.6667 1.16667V3.5C11.3458 3.5 11.0712 3.61424 10.8427 3.84271C10.6142 4.07118 10.5 4.34583 10.5 4.66667C10.5 4.9875 10.6142 5.26215 10.8427 5.49062C11.0712 5.7191 11.3458 5.83333 11.6667 5.83333V8.16667C11.6667 8.4875 11.5524 8.76215 11.324 8.99063C11.0955 9.2191 10.8208 9.33333 10.5 9.33333ZM10.5 8.16667V6.67917C10.1403 6.46528 9.8559 6.1809 9.64688 5.82604C9.43785 5.47118 9.33333 5.08472 9.33333 4.66667C9.33333 4.24861 9.43785 3.86215 9.64688 3.50729C9.8559 3.15243 10.1403 2.86806 10.5 2.65417V1.16667H1.16667V2.65417C1.52639 2.86806 1.81076 3.15243 2.01979 3.50729C2.22882 3.86215 2.33333 4.24861 2.33333 4.66667C2.33333 5.08472 2.22882 5.47118 2.01979 5.82604C1.81076 6.1809 1.52639 6.46528 1.16667 6.67917V8.16667H10.5Z"
                fill="#C3C6D6"
              />
            </svg>
          </div>

          <div className={styles.ticketList}>
            <div className={styles.ticketRow}>
              <div className={styles.ticketLabelWrap}>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.ticketIconGrey}
                >
                  <path
                    d="M1.33333 12C0.966667 12 0.652778 11.8694 0.391667 11.6083C0.130556 11.3472 0 11.0333 0 10.6667V1.33333C0 0.966667 0.130556 0.652778 0.391667 0.391667C0.652778 0.130556 0.966667 0 1.33333 0H10.6667C11.0333 0 11.3472 0.130556 11.6083 0.391667C11.8694 0.652778 12 0.966667 12 1.33333V10.6667C12 11.0333 11.8694 11.3472 11.6083 11.6083C11.3472 11.8694 11.0333 12 10.6667 12H1.33333ZM1.33333 10.6667H10.6667V8.66667H8.66667C8.33333 9.08889 7.93611 9.41667 7.475 9.65C7.01389 9.88333 6.52222 10 6 10C5.47778 10 4.98611 9.88333 4.525 9.65C4.06389 9.41667 3.66667 9.08889 3.33333 8.66667H1.33333V10.6667ZM6 8.66667C6.42222 8.66667 6.80556 8.54445 7.15 8.3C7.49444 8.05556 7.73333 7.73333 7.86667 7.33333H10.6667V1.33333H1.33333V7.33333H4.13333C4.26667 7.73333 4.50556 8.05556 4.85 8.3C5.19444 8.54445 5.57778 8.66667 6 8.66667ZM1.33333 10.6667H3.33333C3.66667 10.6667 4.06389 10.6667 4.525 10.6667C4.98611 10.6667 5.47778 10.6667 6 10.6667C6.52222 10.6667 7.01389 10.6667 7.475 10.6667C7.93611 10.6667 8.33333 10.6667 8.66667 10.6667H10.6667H1.33333Z"
                    fill="#C3C6D6"
                  />
                </svg>
                <span className={styles.ticketLabel}>Open</span>
              </div>
              <span className={styles.ticketValue}>45</span>
            </div>

            <div className={`${styles.ticketRow} ${styles.ticketRowBlue}`}>
              <div className={styles.ticketLabelWrap}>
                <svg
                  width="11"
                  height="15"
                  viewBox="0 0 11 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.ticketIconBlue}
                >
                  <path
                    d="M0.733333 10.0333C0.488889 9.61111 0.305556 9.17778 0.183333 8.73333C0.0611111 8.28889 0 7.83333 0 7.36667C0 5.87778 0.516667 4.61111 1.55 3.56667C2.58333 2.52222 3.84444 2 5.33333 2H5.45L4.38333 0.933333L5.31667 0L7.98333 2.66667L5.31667 5.33333L4.38333 4.4L5.45 3.33333H5.33333C4.22222 3.33333 3.27778 3.725 2.5 4.50833C1.72222 5.29167 1.33333 6.24444 1.33333 7.36667C1.33333 7.65556 1.36667 7.93889 1.43333 8.21667C1.5 8.49444 1.6 8.76667 1.73333 9.03333L0.733333 10.0333ZM5.35 14.6667L2.68333 12L5.35 9.33333L6.28333 10.2667L5.21667 11.3333H5.33333C6.44444 11.3333 7.38889 10.9417 8.16667 10.1583C8.94444 9.375 9.33333 8.42222 9.33333 7.3C9.33333 7.01111 9.3 6.72778 9.23333 6.45C9.16667 6.17222 9.06667 5.9 8.93333 5.63333L9.93333 4.63333C10.1778 5.05556 10.3611 5.48889 10.4833 5.93333C10.6056 6.37778 10.6667 6.83333 10.6667 7.3C10.6667 8.78889 10.15 10.0556 9.11667 11.1C8.08333 12.1444 6.82222 12.6667 5.33333 12.6667H5.21667L6.28333 13.7333L5.35 14.6667Z"
                    fill="#0056D2"
                  />
                </svg>
                <span className={styles.ticketLabel}>In Progress</span>
              </div>
              <span className={styles.ticketValueBlue}>12</span>
            </div>

            <div className={`${styles.ticketRow} ${styles.ticketRowRed}`}>
              <div className={styles.ticketLabelWrap}>
                <AlertTriangle size={14} className={styles.ticketIconRed} />
                <span className={styles.ticketLabel}>SLA Risk</span>
              </div>
              <span className={styles.ticketValueRed}>4</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.riskCard}>
        <div className={styles.riskHeader}>
          <div className={styles.riskHeaderLeft}>
            <Gauge size={18} className={styles.riskHeaderIcon} />
            <span className={styles.riskTitle}>Performance Risk Monitor</span>
          </div>
          <span className={styles.riskPeriod}>Last 90 Days</span>
        </div>

        <div className={styles.riskGrid}>
          <div className={styles.riskTile}>
            <div className={styles.riskTileLabel}>
              <TrendingDown size={13} />
              BELOW THRESHOLD
            </div>
            <div className={styles.riskTileRow}>
              <span className={styles.riskTileValue}>8</span>
              <span className={styles.riskTileUnit}>Employees</span>
            </div>
            <div className={styles.riskTileDivider} />
            <div className={styles.riskTileNote}>Requires PIP review within 14 days.</div>
          </div>

          <div className={styles.riskTile}>
            <div className={styles.riskTileLabel}>
              <Flag size={13} />
              BEHAVIORAL FLAGS
            </div>
            <div className={styles.riskTileRow}>
              <span className={styles.riskTileValue}>3</span>
              <span className={styles.riskTileUnit}>Incidents</span>
            </div>
            <div className={styles.riskTileDivider} />
            <div className={styles.riskTileNote}>Peer review anomalies detected.</div>
          </div>

          <div className={styles.riskTile}>
            <div className={`${styles.riskTileLabel} ${styles.riskTileLabelGreen}`}>
              <BatteryLow size={13} />
              INACTIVITY / BURNOUT
            </div>
            <div className={styles.riskTileRow}>
              <span className={styles.riskTileValue}>15%</span>
              <span className={styles.riskTileUnit}>Of Workforce</span>
            </div>
            <div className={styles.riskTileDivider} />
            <div className={styles.riskTileNote}>Showing sustained low activity levels.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HRDashboard;
