import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../CSS/organizationInsights.module.css";
import {
  ArrowUpRight,
} from "lucide-react";
function TrendUpIcon({ size = 12 }) {
  return (
    <svg
      width={size}
      height={size * (7 / 12)}
      viewBox="0 0 12 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
        <path
        d="M0.816667 7L0 6.18333L4.31667 1.8375L6.65 4.17083L9.68333 1.16667H8.16667V0H11.6667V3.5H10.5V1.98333L6.65 5.83333L4.31667 3.5L0.816667 7Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ChatIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 20L16 16H6C5.45 16 4.97917 15.8042 4.5875 15.4125C4.19583 15.0208 4 14.55 4 14V13H15C15.55 13 16.0208 12.8042 16.4125 12.4125C16.8042 12.0208 17 11.55 17 11V4H18C18.55 4 19.0208 4.19583 19.4125 4.5875C19.8042 4.97917 20 5.45 20 6V20ZM2 10.175L3.175 9H13V2H2V10.175ZM0 15V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H13C13.55 0 14.0208 0.195833 14.4125 0.5875C14.8042 0.979167 15 1.45 15 2V9C15 9.55 14.8042 10.0208 14.4125 10.4125C14.0208 10.8042 13.55 11 13 11H4L0 15ZM2 9V2V9Z"
        fill="currentColor"
      />
    </svg>
  );
}

function DashIcon({ size = 9 }) {
  return (
    <svg
      width={size}
      height={size * (1.17 / 9.33)}
      viewBox="0 0 9.33 1.17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="9.33" height="1.17" fill="currentColor" />
    </svg>
  );
}

function TrendDownIcon({ size = 12 }) {
  return (
    <svg
      width={size}
      height={size * (7 / 12)}
      viewBox="0 0 12 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.16667 7V5.83333H9.68333L6.65 2.82917L4.31667 5.1625L0 0.816667L0.816667 0L4.31667 3.5L6.65 1.16667L10.5 5.01667V3.5H11.6667V7H8.16667Z"
        fill="currentColor"
      />
    </svg>
  );
}

function HashIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size * (16 / 18)}
      viewBox="0 0 18 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 16L4 12H0L0.5 10H4.5L5.5 6H1.5L2 4H6L7 0H9L8 4H12L13 0H15L14 4H18L17.5 6H13.5L12.5 10H16.5L16 12H12L11 16H9L10 12H6L5 16H3ZM6.5 10H10.5L11.5 6H7.5L6.5 10Z"
        fill="currentColor"
      />
    </svg>
  );
}

function InsightIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 20V15.7C2.05 14.8333 1.3125 13.8208 0.7875 12.6625C0.2625 11.5042 0 10.2833 0 9C0 6.5 0.875 4.375 2.625 2.625C4.375 0.875 6.5 0 9 0C11.0833 0 12.9292 0.6125 14.5375 1.8375C16.1458 3.0625 17.1917 4.65833 17.675 6.625L18.975 11.75C19.0583 12.0667 19 12.3542 18.8 12.6125C18.6 12.8708 18.3333 13 18 13H16V16C16 16.55 15.8042 17.0208 15.4125 17.4125C15.0208 17.8042 14.55 18 14 18H12V20H10V16H14V11H16.7L15.75 7.125C15.3667 5.60833 14.55 4.375 13.3 3.425C12.05 2.475 10.6167 2 9 2C7.06667 2 5.41667 2.675 4.05 4.025C2.68333 5.375 2 7.01667 2 8.95C2 9.95 2.20417 10.9 2.6125 11.8C3.02083 12.7 3.6 13.5 4.35 14.2L5 14.8V20H3ZM8 13H10L10.15 11.75C10.2833 11.7 10.4042 11.6417 10.5125 11.575C10.6208 11.5083 10.7167 11.4333 10.8 11.35L11.95 11.85L12.95 10.15L11.95 9.4C11.9833 9.26667 12 9.13333 12 9C12 8.86667 11.9833 8.73333 11.95 8.6L12.95 7.85L11.95 6.15L10.8 6.65C10.7167 6.56667 10.6208 6.49167 10.5125 6.425C10.4042 6.35833 10.2833 6.3 10.15 6.25L10 5H8L7.85 6.25C7.71667 6.3 7.59583 6.35833 7.4875 6.425C7.37917 6.49167 7.28333 6.56667 7.2 6.65L6.05 6.15L5.05 7.85L6.05 8.6C6.01667 8.73333 6 8.86667 6 9C6 9.13333 6.01667 9.26667 6.05 9.4L5.05 10.15L6.05 11.85L7.2 11.35C7.28333 11.4333 7.37917 11.5083 7.4875 11.575C7.59583 11.6417 7.71667 11.7 7.85 11.75L8 13ZM9 10.5C8.58333 10.5 8.22917 10.3542 7.9375 10.0625C7.64583 9.77083 7.5 9.41667 7.5 9C7.5 8.58333 7.64583 8.22917 7.9375 7.9375C8.22917 7.64583 8.58333 7.5 9 7.5C9.41667 7.5 9.77083 7.64583 10.0625 7.9375C10.3542 8.22917 10.5 8.58333 10.5 9C10.5 9.41667 10.3542 9.77083 10.0625 10.0625C9.77083 10.3542 9.41667 10.5 9 10.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PulseIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size * (16 / 20)}
      viewBox="0 0 20 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 9V7H20V9H16ZM17.2 16L14 13.6L15.2 12L18.4 14.4L17.2 16ZM15.2 4L14 2.4L17.2 0L18.4 1.6L15.2 4ZM3 15V11H2C1.45 11 0.979167 10.8042 0.5875 10.4125C0.195833 10.0208 0 9.55 0 9V7C0 6.45 0.195833 5.97917 0.5875 5.5875C0.979167 5.19583 1.45 5 2 5H6L11 2V14L6 11H5V15H3ZM9 10.45V5.55L6.55 7H2V9H6.55L9 10.45ZM12 11.35V4.65C12.45 5.05 12.8125 5.5375 13.0875 6.1125C13.3625 6.6875 13.5 7.31667 13.5 8C13.5 8.68333 13.3625 9.3125 13.0875 9.8875C12.8125 10.4625 12.45 10.95 12 11.35Z"
        fill="currentColor"
      />
    </svg>
  );
}

function OrganizationInsights() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [range, setRange] = useState("90D");

  const bars = [45, 52, 58, 50, 60, 55, 92]; // last bar is highlighted

  const pulseSurveys = [
    {
      title: "Q4 Engagement Pulse",
      status: "active",
      closesIn: "5d",
      participationPercent: 78,
      participationText: "342/438",
    },
    {
      title: "Engineering Tools Check-in",
      status: "draft",
      preparedBy: "Prepared by HR Automation",
    },
  ];

  const aiInsights = [
    {
      dot: "red",
      title: "Burnout Risk: Engineering",
      desc: "Sentiment dropped 12% in 2 weeks. Correlation with increased JIRA ticket load.",
      action: "Schedule Team Sync",
    },
    {
      dot: "red",
      title: "Tooling Friction: Sales",
      desc: "Recurring mentions of 'CRM lag' in recent anonymous feedback.",
      action: "Forward to IT Ops",
    },
    {
      dot: "blue",
      title: "Positive Trend: Marketing",
      desc: "High engagement following new WFH policy implementation.",
      action: "Generate Praise Report",
    },
  ];

  const trendingTopics = [
    {
      label: "Workload & Staffing",
      status: "Needs Attention",
      type: "negative",
      percent: 78,
      mentioned: "Mentioned in 42% of responses",
    },
    {
      label: "Remote Collaboration Tools",
      status: "Improving",
      type: "positive",
      percent: 45,
      mentioned: "Mentioned in 28% of responses",
    },
    {
      label: "Management Communication",
      status: "Stable",
      type: "neutral",
      percent: 24,
      mentioned: "Mentioned in 15% of responses",
    },
  ];

  const feedItems = [
    {
      tags: [
        { label: "Urgent", type: "urgent" },
        { label: "Workload", type: "neutral" },
      ],
      text: "The recent push for Q4 deliverables has severely impacted the engineering team's weekends. We need better scoping.",
      redactedId: "6A9B",
      time: "2hrs ago",
      border: "urgent",
    },
    {
      tags: [
        { label: "Positive", type: "positive" },
        { label: "Culture", type: "neutral" },
      ],
      text: "Really appreciated the transparency in yesterday's all-hands meeting regarding the new funding round.",
      redactedId: "2F4C",
      time: "5hrs ago",
      border: "positive",
    },
    {
      tags: [
        { label: "Concern", type: "concern" },
        { label: "Facilities", type: "neutral" },
      ],
      text: "Office AC on the 3rd floor has been out for a week — starting to affect focus during afternoon standups.",
      redactedId: "9C1E",
      time: "7hrs ago",
      border: "concern",
    },
  ];

  const topicStatusClass = (type) =>
    type === "negative"
      ? styles.statusNegative
      : type === "positive"
        ? styles.statusPositive
        : styles.statusNeutral;

  const topicFillClass = (type) =>
    type === "negative"
      ? styles.topicBarFillNegative
      : type === "positive"
        ? styles.topicBarFillPositive
        : styles.topicBarFillNeutral;

  const tagClass = (type) =>
    type === "urgent"
      ? styles.tagUrgent
      : type === "positive"
        ? styles.tagPositive
        : type === "concern"
          ? styles.tagConcern
          : styles.tagNeutral;

  const feedBorderClass = (border) =>
    border === "urgent"
      ? styles.borderUrgent
      : border === "positive"
        ? styles.borderPositive
        : styles.borderConcern;

  return (
    <div className={styles.mainContainer}>
      <div className={styles.rowOne}>
        <div className={`${styles.card} ${styles.sentimentCard}`}>
          <div className={styles.cardHeaderRow}>
            <div>
              <div className={styles.cardTitle}>Organizational Sentiment</div>
              <div className={styles.cardSubtitle}>
                Aggregate mood index across all active departments.
              </div>
            </div>
            <div className={styles.toggleGroup}>
              <button
                className={
                  range === "30D" ? styles.toggleBtnActive : styles.toggleBtn
                }
                onClick={() => setRange("30D")}
              >
                30D
              </button>
              <button
                className={
                  range === "90D" ? styles.toggleBtnActive : styles.toggleBtn
                }
                onClick={() => setRange("90D")}
              >
                90D
              </button>
            </div>
          </div>

          <div className={styles.barChart}>
            {bars.map((h, i) => (
              <div
                key={i}
                className={i === bars.length - 1 ? styles.barActive : styles.bar}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>

          <div className={styles.sentimentStatsRow}>
            <div className={styles.sentimentStat}>
              <span className={styles.sentimentStatLabel}>Overall Score</span>
              <span className={styles.sentimentStatValue}>
                86<span>/100</span>
              </span>
            </div>
            <div className={styles.sentimentStat}>
              <span className={styles.sentimentStatLabel}>MoM Change</span>
              <span className={styles.deltaNegative}>
                <TrendUpIcon size={12} />
                +4.2%
              </span>
            </div>
            <div className={styles.sentimentStat}>
              <span className={styles.sentimentStatLabel}>
                Highest Department
              </span>
               <span className={styles.sentimentStatValueMuted} style={{ fontSize: 16 }}>
                Product Design
              </span>
            </div>
          </div>
        </div>

        <div className={`${styles.card} ${styles.pulseCard}`}>
          <div className={styles.cardTitle}>
            <PulseIcon size={18} />
            Active Pulse Surveys
          </div>

          {pulseSurveys.map((p, i) =>
            p.status === "active" ? (
              <div className={styles.pulseItem} key={i}>
                <div className={styles.pulseTopRow}>
                  <span className={styles.pulseTitle}>{p.title}</span>
                  <span className={styles.pulseBadge}>Closes in {p.closesIn}</span>
                </div>
                <div className={styles.pulseMetaRow}>
                  <span>Participation Rate</span>
                  <span>{p.participationText}</span>
                </div>
                <div className={styles.progressTrack}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${p.participationPercent}%` }}
                  />
                </div>
                <button className={styles.reminderBtn}>Send Reminder</button>
              </div>
            ) : (
              <div className={styles.pulseItemDraft} key={i}>
                <div className={styles.pulseTopRow}>
                  <span className={styles.pulseTitle}>{p.title}</span>
                  <span className={styles.pulseBadgeDraft}>Draft</span>
                </div>
                <div className={styles.pulseSubtext}>{p.preparedBy}</div>
              </div>
            )
          )}

          <button className={styles.launchBtn}>+ Launch New Pulse</button>
        </div>
      </div>

      <div className={`${styles.card} ${styles.aiCard}`}>
        <div className={styles.cardHeaderRow}>
          <div className={styles.cardTitle}>
            <InsightIcon size={18} />
            AI Intervention Insights
          </div>
          <span className={styles.updatedTag}>Updated 10 mins ago</span>
        </div>

        <div className={styles.insightGrid}>
          {aiInsights.map((insight, i) => (
            <div className={styles.insightItem} key={i}>
              <div className={styles.insightDotRow}>
                <span
                  className={`${styles.insightDot} ${
                    insight.dot === "red" ? styles.dotRed : styles.dotBlue
                  }`}
                />
                <span className={styles.insightTitle}>{insight.title}</span>
              </div>
              <div className={styles.insightDesc}>{insight.desc}</div>
              <div className={styles.insightAction}>
                Action: {insight.action}
                <ArrowUpRight size={12} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.rowThree}>
        <div className={`${styles.card} ${styles.trendingCard}`}>
          <div className={styles.cardTitle}>
            <HashIcon size={16} />
            Trending Feedback Topics
          </div>

          <div className={styles.topicList}>
            {trendingTopics.map((t, i) => (
              <div className={styles.topicRow} key={i}>
                <div className={styles.topicTopRow}>
                  <span className={styles.topicLabel}>{t.label}</span>
                  <span
                    className={`${styles.topicStatus} ${topicStatusClass(
                      t.type
                    )}`}
                  >
                    {t.type === "negative" && <TrendDownIcon size={12} />}
                    {t.type === "positive" && <TrendUpIcon size={12} />}
                    {t.type === "neutral" && <DashIcon size={9} />}
                    {t.status}
                  </span>
                </div>
                <div className={styles.topicBarTrack}>
                  <div
                    className={topicFillClass(t.type)}
                    style={{ width: `${t.percent}%` }}
                  />
                </div>
                <span className={styles.topicMentioned}>{t.mentioned}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`${styles.card} ${styles.feedCard}`}>
          <div className={styles.cardHeaderRow}>
            <div className={styles.cardTitle}>
              <ChatIcon size={18} />
              Anonymous Feed
            </div>
            <button className={styles.filterBtn}>
              Filter
            </button>
          </div>

          <div className={styles.feedList}>
            {feedItems.map((item, i) => (
              <div
                className={`${styles.feedItem} ${feedBorderClass(item.border)}`}
                key={i}
              >
                <div className={styles.feedTagsRow}>
                  {item.tags.map((tag, j) => (
                    <span
                      className={`${styles.tagBase} ${tagClass(tag.type)}`}
                      key={j}
                    >
                      {tag.label}
                    </span>
                  ))}
                </div>
                <p className={styles.feedText}>{item.text}</p>
                <span className={styles.feedMeta}>
                  Redacted ID: {item.redactedId} &middot; {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrganizationInsights;