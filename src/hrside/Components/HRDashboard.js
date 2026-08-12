import React from "react";
import styles from "../CSS/hrdashboard.module.css";

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
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21.7966 9.99787C22.2532 12.2387 21.9278 14.5684 20.8746 16.5983C19.8215 18.6283 18.1042 20.2358 16.0093 21.1529C13.9143 22.07 11.5683 22.2411 9.36241 21.6379C7.15653 21.0346 5.22414 19.6933 3.8875 17.8377C2.55086 15.9821 1.89076 13.7243 2.01727 11.441C2.14379 9.15757 3.04928 6.98657 4.58273 5.29C6.11619 3.59343 8.18493 2.47383 10.444 2.11793C12.703 1.76203 15.0157 2.19132 16.9965 3.33423"
            stroke="currentColor"
            strokeWidth="1.99959"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8.99805 10.9986L11.9974 13.998L21.9954 4"
            stroke="currentColor"
            strokeWidth="1.99959"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      change: "+4.5%",
      title: "Onboarding Completion",
      value: "87%",
      subtitle: "Average across depts",
    },
  ];

  return (
    <div className={styles.mainContainer}>
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
                  width="20"
                  height="20"
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
                  <span className={styles.actionItemTitle}>
                    Compliance Escalation
                  </span>
                  <span
                    className={`${styles.actionBadge} ${styles.actionBadgeRed}`}
                  >
                    Review
                  </span>
                </div>
                <p className={styles.actionItemText}>
                  I-9 verification delayed for 3 new hires in EU region.
                </p>
              </div>
            </div>

            <div className={`${styles.actionItem} ${styles.actionItemOrange}`}>
              <div className={styles.actionIconBadgeOrange}>
                <svg
                  width="20"
                  height="22"
                  viewBox="0 0 23 27"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.5 9.16667V8H13V9.16667H9.5ZM10.6667 15.5833H11.8333V12.0833H10.6667V15.5833ZM11.25 20.25C10.5306 20.25 9.85243 20.1115 9.21563 19.8344C8.57882 19.5573 8.02222 19.1806 7.54583 18.7042C7.06944 18.2278 6.69271 17.6712 6.41563 17.0344C6.13854 16.3976 6 15.7194 6 15C6 14.2806 6.13854 13.6024 6.41563 12.9656C6.69271 12.3288 7.06944 11.7722 7.54583 11.2958C8.02222 10.8194 8.57882 10.4427 9.21563 10.1656C9.85243 9.88854 10.5306 9.75 11.25 9.75C11.8528 9.75 12.4313 9.84722 12.9854 10.0417C13.5396 10.2361 14.0597 10.5181 14.5458 10.8875L15.3625 10.0708L16.1792 10.8875L15.3625 11.7042C15.7319 12.1903 16.0139 12.7104 16.2083 13.2646C16.4028 13.8187 16.5 14.3972 16.5 15C16.5 15.7194 16.3615 16.3976 16.0844 17.0344C15.8073 17.6712 15.4306 18.2278 14.9542 18.7042C14.4778 19.1806 13.9212 19.5573 13.2844 19.8344C12.6476 20.1115 11.9694 20.25 11.25 20.25ZM11.25 19.0833C12.3778 19.0833 13.3403 18.6847 14.1375 17.8875C14.9347 17.0903 15.3333 16.1278 15.3333 15C15.3333 13.8722 14.9347 12.9097 14.1375 12.1125C13.3403 11.3153 12.3778 10.9167 11.25 10.9167C10.1222 10.9167 9.15972 11.3153 8.3625 12.1125C7.56528 12.9097 7.16667 13.8722 7.16667 15C7.16667 16.1278 7.56528 17.0903 8.3625 17.8875C9.15972 18.6847 10.1222 19.0833 11.25 19.0833Z"
                    fill="#FFAE4C"
                  />
                </svg>
              </div>
              <div className={styles.actionItemBody}>
                <div className={styles.actionItemTopRow}>
                  <span className={styles.actionItemTitle}>
                    SLA Breach Warning
                  </span>
                  <span
                    className={`${styles.actionBadge} ${styles.actionBadgeOrange}`}
                  >
                    Assign
                  </span>
                </div>
                <p className={styles.actionItemText}>
                  4 payroll tickets nearing 48h limit.
                </p>
              </div>
            </div>

            <div className={`${styles.actionItem} ${styles.actionItemBlue}`}>
              <div className={styles.actionIconBadgeBlue}>
                <svg
                  width="20"
                  height="19"
                  viewBox="0 0 26 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.2917 12.6375C13.5736 12.3264 13.7899 11.9715 13.9406 11.5729C14.0913 11.1743 14.1667 10.7611 14.1667 10.3333C14.1667 9.90556 14.0913 9.49236 13.9406 9.09375C13.7899 8.69514 13.5736 8.34028 13.2917 8.02917C13.875 8.10694 14.3611 8.36458 14.75 8.80208C15.1389 9.23958 15.3333 9.75 15.3333 10.3333C15.3333 10.9167 15.1389 11.4271 14.75 11.8646C14.3611 12.3021 13.875 12.5597 13.2917 12.6375ZM16.5 17.3333V15.5833C16.5 15.2333 16.4222 14.9003 16.2667 14.5844C16.1111 14.2684 15.9069 13.9889 15.6542 13.7458C16.15 13.9208 16.6094 14.1469 17.0323 14.424C17.4552 14.701 17.6667 15.0875 17.6667 15.5833V17.3333H16.5ZM17.6667 13.25V12.0833H16.5V10.9167H17.6667V9.75H18.8333V10.9167H20V12.0833H18.8333V13.25H17.6667ZM10.6667 12.6667C10.025 12.6667 9.47569 12.4382 9.01875 11.9813C8.56181 11.5243 8.33333 10.975 8.33333 10.3333C8.33333 9.69167 8.56181 9.14236 9.01875 8.68542C9.47569 8.22847 10.025 8 10.6667 8C11.3083 8 11.8576 8.22847 12.3146 8.68542C12.7715 9.14236 13 9.69167 13 10.3333C13 10.975 12.7715 11.5243 12.3146 11.9813C11.8576 12.4382 11.3083 12.6667 10.6667 12.6667ZM6 17.3333V15.7C6 15.3694 6.08507 15.0656 6.25521 14.7885C6.42535 14.5115 6.65139 14.3 6.93333 14.1542C7.53611 13.8528 8.14861 13.6267 8.77083 13.476C9.39306 13.3253 10.025 13.25 10.6667 13.25C11.3083 13.25 11.9403 13.3253 12.5625 13.476C13.1847 13.6267 13.7972 13.8528 14.4 14.1542C14.6819 14.3 14.908 14.5115 15.0781 14.7885C15.2483 15.0656 15.3333 15.3694 15.3333 15.7V17.3333H6ZM10.6667 11.5C10.9875 11.5 11.2622 11.3858 11.4906 11.1573C11.7191 10.9288 11.8333 10.6542 11.8333 10.3333C11.8333 10.0125 11.7191 9.73785 11.4906 9.50937C11.2622 9.2809 10.9875 9.16667 10.6667 9.16667C10.3458 9.16667 10.0712 9.2809 9.84271 9.50937C9.61424 9.73785 9.5 10.0125 9.5 10.3333C9.5 10.6542 9.61424 10.9288 9.84271 11.1573C10.0712 11.3858 10.3458 11.5 10.6667 11.5ZM7.16667 16.1667H14.1667V15.7C14.1667 15.5931 14.1399 15.4958 14.0865 15.4083C14.033 15.3208 13.9625 15.2528 13.875 15.2042C13.35 14.9417 12.8201 14.7448 12.2854 14.6135C11.7507 14.4823 11.2111 14.4167 10.6667 14.4167C10.1222 14.4167 9.58264 14.4823 9.04792 14.6135C8.51319 14.7448 7.98333 14.9417 7.45833 15.2042C7.37083 15.2528 7.30035 15.3208 7.24688 15.4083C7.1934 15.4958 7.16667 15.5931 7.16667 15.7V16.1667Z"
                    fill="#0056D2"
                  />
                </svg>
              </div>
              <div className={styles.actionItemBody}>
                <div className={styles.actionItemTopRow}>
                  <span className={styles.actionItemTitle}>
                    Onboarding Stalled
                  </span>
                  <span
                    className={`${styles.actionBadge} ${styles.actionBadgeBlue}`}
                  >
                    Nudge
                  </span>
                </div>
                <p className={styles.actionItemText}>
                  2 hires haven't completed day-1 tasks.
                </p>
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
            <div className={styles.riskTileNote}>
              Requires PIP review within 14 days.
            </div>
          </div>

          <div className={styles.riskTile}>
            <div className={styles.riskTileLabel}>
              <svg
                width="13"
                height="13"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.75 11.6667V9.15833C1.19583 8.65278 0.765625 8.06215 0.459375 7.38646C0.153125 6.71076 0 5.99861 0 5.25C0 3.79167 0.510417 2.55208 1.53125 1.53125C2.55208 0.510417 3.79167 0 5.25 0C6.46528 0 7.54201 0.357292 8.48021 1.07187C9.4184 1.78646 10.0285 2.71736 10.3104 3.86458L11.0688 6.85417C11.1174 7.03889 11.0833 7.2066 10.9667 7.35729C10.85 7.50799 10.6944 7.58333 10.5 7.58333H9.33333V9.33333C9.33333 9.65417 9.2191 9.92882 8.99063 10.1573C8.76215 10.3858 8.4875 10.5 8.16667 10.5H7V11.6667H5.83333V9.33333H8.16667V6.41667H9.74167L9.1875 4.15625C8.96389 3.27153 8.4875 2.55208 7.75833 1.99792C7.02917 1.44375 6.19306 1.16667 5.25 1.16667C4.12222 1.16667 3.15972 1.56042 2.3625 2.34792C1.56528 3.13542 1.16667 4.09306 1.16667 5.22083C1.16667 5.80417 1.28576 6.35833 1.52396 6.88333C1.76215 7.40833 2.1 7.875 2.5375 8.28333L2.91667 8.63333V11.6667H1.75ZM4.66667 7.58333H5.83333L5.92083 6.85417C5.99861 6.825 6.0691 6.79097 6.13229 6.75208C6.19549 6.71319 6.25139 6.66944 6.3 6.62083L6.97083 6.9125L7.55417 5.92083L6.97083 5.48333C6.99028 5.40556 7 5.32778 7 5.25C7 5.17222 6.99028 5.09444 6.97083 5.01667L7.55417 4.57917L6.97083 3.5875L6.3 3.87917C6.25139 3.83056 6.19549 3.78681 6.13229 3.74792C6.0691 3.70903 5.99861 3.675 5.92083 3.64583L5.83333 2.91667H4.66667L4.57917 3.64583C4.50139 3.675 4.4309 3.70903 4.36771 3.74792C4.30451 3.78681 4.24861 3.83056 4.2 3.87917L3.52917 3.5875L2.94583 4.57917L3.52917 5.01667C3.50972 5.09444 3.5 5.17222 3.5 5.25C3.5 5.32778 3.50972 5.40556 3.52917 5.48333L2.94583 5.92083L3.52917 6.9125L4.2 6.62083C4.24861 6.66944 4.30451 6.71319 4.36771 6.75208C4.4309 6.79097 4.50139 6.825 4.57917 6.85417L4.66667 7.58333ZM5.25 6.125C5.00694 6.125 4.80035 6.03993 4.63021 5.86979C4.46007 5.69965 4.375 5.49306 4.375 5.25C4.375 5.00694 4.46007 4.80035 4.63021 4.63021C4.80035 4.46007 5.00694 4.375 5.25 4.375C5.49306 4.375 5.69965 4.46007 5.86979 4.63021C6.03993 4.80035 6.125 5.00694 6.125 5.25C6.125 5.49306 6.03993 5.69965 5.86979 5.86979C5.69965 6.03993 5.49306 6.125 5.25 6.125Z"
                  fill="#A93802"
                />
              </svg>
              BEHAVIORAL FLAGS
            </div>
            <div className={styles.riskTileRow}>
              <span className={styles.riskTileValue}>3</span>
              <span className={styles.riskTileUnit}>Incidents</span>
            </div>
            <div className={styles.riskTileDivider} />
            <div className={styles.riskTileNote}>
              Peer review anomalies detected.
            </div>
          </div>

          <div className={styles.riskTile}>
            <div
              className={`${styles.riskTileLabel} ${styles.riskTileLabelGreen}`}
            >
              <svg
                width="13"
                height="12"
                viewBox="0 0 13 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.75417 7.75833H7.67083V6.88333H6.0375L7.67083 5.04583V4.25833H4.75417V5.13333H6.41667L4.75417 7V7.75833ZM6.2125 11.4625C5.48333 11.4625 4.80035 11.324 4.16354 11.0469C3.52674 10.7698 2.97257 10.3955 2.50104 9.92396C2.02951 9.45243 1.65521 8.89826 1.37812 8.26146C1.10104 7.62465 0.9625 6.94167 0.9625 6.2125C0.9625 5.48333 1.10104 4.80035 1.37812 4.16354C1.65521 3.52674 2.02951 2.97257 2.50104 2.50104C2.97257 2.02951 3.52674 1.65521 4.16354 1.37812C4.80035 1.10104 5.48333 0.9625 6.2125 0.9625C6.94167 0.9625 7.62465 1.10104 8.26146 1.37812C8.89826 1.65521 9.45243 2.02951 9.92396 2.50104C10.3955 2.97257 10.7698 3.52674 11.0469 4.16354C11.324 4.80035 11.4625 5.48333 11.4625 6.2125C11.4625 6.94167 11.324 7.62465 11.0469 8.26146C10.7698 8.89826 10.3955 9.45243 9.92396 9.92396C9.45243 10.3955 8.89826 10.7698 8.26146 11.0469C7.62465 11.324 6.94167 11.4625 6.2125 11.4625ZM2.47917 0L3.29583 0.816667L0.816667 3.29583L0 2.47917L2.47917 0ZM9.94583 0L12.425 2.47917L11.6083 3.29583L9.12917 0.816667L9.94583 0ZM6.2125 10.2958C7.35 10.2958 8.31493 9.89965 9.10729 9.10729C9.89965 8.31493 10.2958 7.35 10.2958 6.2125C10.2958 5.075 9.89965 4.11007 9.10729 3.31771C8.31493 2.52535 7.35 2.12917 6.2125 2.12917C5.075 2.12917 4.11007 2.52535 3.31771 3.31771C2.52535 4.11007 2.12917 5.075 2.12917 6.2125C2.12917 7.35 2.52535 8.31493 3.31771 9.10729C4.11007 9.89965 5.075 10.2958 6.2125 10.2958Z"
                  fill="#2E8B5A"
                />
              </svg>
              INACTIVITY / BURNOUT
            </div>
            <div className={styles.riskTileRow}>
              <span className={styles.riskTileValue}>15%</span>
              <span className={styles.riskTileUnit}>Of Workforce</span>
            </div>
            <div className={styles.riskTileDivider} />
            <div className={styles.riskTileNote}>
              Showing sustained low activity levels.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HRDashboard;
