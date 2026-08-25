import React, { useState } from "react";
import styles from "../css/ManagerPerformance.module.css";
import headerStyles from "../css/ManagerHeader.module.css";
import {
  Zap,
  TrendingUp,
  Smile,
  Plus,
  Filter,
  AlertTriangle,
  X,
  Check,
  Send,
  Bookmark
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid
} from "recharts";

function ManagerPerformance({ isMobile }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Review pull requests for the new feature", completed: false },
    { id: 2, text: "Update documentation for API endpoints", completed: false },
    { id: 3, text: "Fix navigation bug on mobile", completed: false },
  ]);
  const [newExtraTask, setNewExtraTask] = useState("");
  const [workSummary, setWorkSummary] = useState("");

  const toggleChecklistItem = (id) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleAddExtraTask = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const trimmed = newExtraTask.trim();
    if (!trimmed) return;
    setChecklist((prev) => [
      ...prev,
      { id: Date.now(), text: trimmed, completed: false },
    ]);
    setNewExtraTask("");
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    setShowAddModal(false);
  };

  const completedCount = checklist.filter((item) => item.completed).length;
  // Stat cards data
  const stats = [
    { title: "Productivity", value: "94.2%", subtitle: "+12.5% from Last Month", subtitleColor: "#10b981", icon: <Zap size={24} /> },
    { title: "Efficiency", value: "88.7%", subtitle: "↗ +4.1% from last review", subtitleColor: "#10b981", icon: <Zap size={24} /> },
    { title: "Attendance", value: "98.1%", subtitle: "- 0.4%", subtitleColor: "#ef4444", icon: null },
    { title: "Satisfaction", value: "4.8/5", subtitle: "+5.0%", subtitleColor: "#10b981", icon: <Smile size={24} /> }
  ];

  // Recharts Area Chart Data matching exact Figma curve
  const trendData = [
    { name: "MON", velocity: 26, quality: 13 },
    { name: "TUE", velocity: 34, quality: 11 },
    { name: "WED", velocity: 44, quality: 13 },
    { name: "THU", velocity: 54, quality: 17 },
    { name: "FRI", velocity: 62, quality: 22 },
    { name: "SAT", velocity: 52, quality: 24 },
    { name: "SUN", velocity: 38, quality: 25 }
  ];

  // Exact 7-row x 15-col heatmap matrix from Figma specification
  const heatmapMatrix = [
    ["#2A2A2A", "rgba(179, 197, 255, 0.6)", "#2A2A2A", "rgba(179, 197, 255, 0.2)", "#2A2A2A", "#B3C5FF", "#2A2A2A", "rgba(179, 197, 255, 0.6)", "rgba(179, 197, 255, 0.8)", "#2A2A2A", "rgba(179, 197, 255, 0.6)", "rgba(179, 197, 255, 0.8)", "rgba(179, 197, 255, 0.2)", "rgba(179, 197, 255, 0.4)", "#B3C5FF"],
    ["#2A2A2A", "rgba(179, 197, 255, 0.2)", "#B3C5FF", "rgba(179, 197, 255, 0.4)", "rgba(179, 197, 255, 0.2)", "rgba(179, 197, 255, 0.8)", "rgba(179, 197, 255, 0.2)", "rgba(179, 197, 255, 0.4)", "#B3C5FF", "rgba(179, 197, 255, 0.2)", "rgba(179, 197, 255, 0.4)", "#B3C5FF", "rgba(179, 197, 255, 0.4)", "rgba(179, 197, 255, 0.2)", "rgba(179, 197, 255, 0.8)"],
    ["rgba(179, 197, 255, 0.4)", "#2A2A2A", "rgba(179, 197, 255, 0.8)", "rgba(179, 197, 255, 0.6)", "rgba(179, 197, 255, 0.4)", "rgba(179, 197, 255, 0.6)", "rgba(179, 197, 255, 0.4)", "rgba(179, 197, 255, 0.2)", "#B3C5FF", "rgba(179, 197, 255, 0.4)", "rgba(179, 197, 255, 0.2)", "rgba(179, 197, 255, 0.8)", "rgba(179, 197, 255, 0.6)", "#2A2A2A", "rgba(179, 197, 255, 0.6)"],
    ["rgba(179, 197, 255, 0.2)", "rgba(179, 197, 255, 0.8)", "rgba(179, 197, 255, 0.2)", "rgba(179, 197, 255, 0.8)", "#2A2A2A", "rgba(179, 197, 255, 0.4)", "rgba(179, 197, 255, 0.6)", "#2A2A2A", "rgba(179, 197, 255, 0.8)", "rgba(179, 197, 255, 0.6)", "#2A2A2A", "rgba(179, 197, 255, 0.6)", "rgba(179, 197, 255, 0.8)", "rgba(179, 197, 255, 0.2)", "rgba(179, 197, 255, 0.4)"],
    ["#2A2A2A", "rgba(179, 197, 255, 0.4)", "#2A2A2A", "#B3C5FF", "rgba(179, 197, 255, 0.2)", "rgba(179, 197, 255, 0.2)", "rgba(179, 197, 255, 0.8)", "rgba(179, 197, 255, 0.2)", "rgba(179, 197, 255, 0.6)", "rgba(179, 197, 255, 0.8)", "rgba(179, 197, 255, 0.2)", "rgba(179, 197, 255, 0.4)", "#B3C5FF", "rgba(179, 197, 255, 0.4)", "rgba(179, 197, 255, 0.2)"],
    ["rgba(179, 197, 255, 0.6)", "#2A2A2A", "rgba(179, 197, 255, 0.6)", "rgba(179, 197, 255, 0.8)", "rgba(179, 197, 255, 0.6)", "#2A2A2A", "#B3C5FF", "rgba(179, 197, 255, 0.4)", "rgba(179, 197, 255, 0.4)", "#B3C5FF", "rgba(179, 197, 255, 0.4)", "rgba(179, 197, 255, 0.2)", "rgba(179, 197, 255, 0.8)", "rgba(179, 197, 255, 0.6)", "#2A2A2A"],
    ["#B3C5FF", "rgba(179, 197, 255, 0.2)", "rgba(179, 197, 255, 0.4)", "rgba(179, 197, 255, 0.6)", "rgba(179, 197, 255, 0.8)", "rgba(179, 197, 255, 0.2)", "rgba(179, 197, 255, 0.8)", "rgba(179, 197, 255, 0.6)", "rgba(179, 197, 255, 0.2)", "rgba(179, 197, 255, 0.8)", "rgba(179, 197, 255, 0.6)", "#2A2A2A", "rgba(179, 197, 255, 0.6)", "rgba(179, 197, 255, 0.8)", "rgba(179, 197, 255, 0.2)"]
  ];

  const renderCustomXAxisTick = ({ x, y, payload }) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={8}
          textAnchor="middle"
          className={styles.chartXAxisTick}
        >
          {payload.value}
        </text>
      </g>
    );
  };

  const attentionAlerts = [
    {
      id: "1102",
      badge: "INACTIVE",
      text: "No activity recorded in 48h. Behavioral anomaly detected.",
      action: "Initiate Audit"
    },
    {
      id: "1103",
      badge: "INACTIVE",
      text: "No activity recorded in 56h. Behavioral anomaly detected.",
      action: "Initiate Audit"
    },
    {
      id: "Team Gamma",
      badge: "LOW OUTPUT",
      text: "Quality score dropped below threshold (62%).",
      action: "Contact Lead"
    },
    {
      id: "Team Alpha",
      badge: "LOW OUTPUT",
      text: "Quality score dropped below threshold (62%).",
      action: "Contact Lead"
    },
    {
      id: "1105",
      badge: "INACTIVE",
      text: "No activity recorded in 72h. Behavioral anomaly detected.",
      action: "Initiate Audit"
    },
    {
      id: "Team Beta",
      badge: "LOW OUTPUT",
      text: "Quality score dropped below threshold (58%).",
      action: "Contact Lead"
    }
  ];

  const topContributors = [
    { name: "Sarah J.", role: "Level 8 Architect", score: "98.2%", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80", sparkline: "0,10 8,12 16,6 24,10 32,2 40,4" },
    { name: "Marcus K.", role: "Sr. Engineer", score: "95.4%", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80", sparkline: "0,6 8,8 16,4 24,12 32,5 40,7" },
    { name: "Elena R.", role: "DevOps Lead", score: "94.1%", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80", sparkline: "0,12 8,6 16,9 24,4 32,8 40,3" },
    { name: "David L.", role: "Product Analyst", score: "92.9%", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80", sparkline: "0,8 8,8 16,10 24,6 32,8 40,7" },
    { name: "Jessica T.", role: "Frontend Dev", score: "91.5%", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80", sparkline: "0,10 8,6 16,8 24,3 32,5 40,2" },
    { name: "Alex P.", role: "Cloud Architect", score: "89.8%", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80", sparkline: "0,7 8,9 16,5 24,8 32,4 40,6" }
  ];

  return (
    <>
      <div className={styles.pageHeader}>
        <div className={headerStyles.headerTitleGroup}>
          <h2 className={headerStyles.headerTitle}>Team Performance</h2>
          {!isMobile && <p className={headerStyles.headerSubtitle}>Real-time monitoring of engineering output and system efficiency.</p>}
        </div>
        <div className={`${headerStyles.headerActions} ${styles.teamHeaderActions}`}>
          <button className={styles.exportBtn}>
            <Filter size={16} />
            <span>Filter</span>
          </button>
          <button className={styles.addBtn} onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            <span>Add Report</span>
          </button>
        </div>
      </div>

      <section className={styles.statsGrid}>
        {stats.map((stat, idx) => (
          <div key={idx} className={styles.statCard}>
            <div className={styles.statCardTop}>
              <span className={styles.statTitle}>{stat.title}</span>
            </div>
            <div className={styles.statCardMiddle}>
              <div className={styles.statValue}>{stat.value}</div>
              {stat.icon && (
                <div className={styles.statIconWrap}>
                  {stat.icon}
                </div>
              )}
            </div>
            <div className={styles.statCardBottom}>
              <span className={styles.statSubtext} style={{ color: stat.subtitleColor, fontWeight: "600" }}>
                {stat.subtitle}
              </span>
            </div>
          </div>
        ))}
      </section>      <div className={styles.dashboardMainGrid}>
        {/* Trend Analysis Card */}
        <div className={`${styles.cardBlock} ${styles.trendCard}`}>
          <div className={styles.trendHeader}>
            <div className={styles.memberCardHeader}>
              <h3 className={styles.cardTitle}>Trend Analysis</h3>
              <p className={styles.cardSubtitle}>Comparison of Quality Assurance vs Delivery Velocity</p>
            </div>
            <div className={styles.chartHeaderActions}>
              <div className={styles.legendBadge}>
                <div className={`${styles.legendDot} ${styles.legendDotVelocity}`} />
                VELOCITY
              </div>
              <div className={styles.legendBadge}>
                <div className={`${styles.legendDot} ${styles.legendDotQuality}`} />
                QUALITY
              </div>
            </div>
          </div>
          
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 12, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid vertical={true} horizontal={true} stroke="#4446574D" />
                
                <XAxis dataKey="name" interval={0} tick={renderCustomXAxisTick} axisLine={false} tickLine={false} />
                <YAxis hide domain={[0, 100]} />

                {/* Quality line (dashed pink) */}
                <Area 
                  type="monotone" 
                  dataKey="quality" 
                  stroke="#fca5a5" 
                  strokeWidth={2} 
                  strokeDasharray="4 4"
                  fill="transparent" 
                  isAnimationActive={false}
                />
                {/* Velocity line (clean solid blue) */}
                <Area 
                  type="monotone" 
                  dataKey="velocity" 
                  stroke="#2563eb" 
                  strokeWidth={2.5} 
                  fill="transparent" 
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Heatmap Card */}
        <div className={`${styles.cardBlock} ${styles.heatmapCard}`}>
          <div className={styles.heatmapHeader}>
            <h3 className={styles.heatmapHeaderTitle}>Activity Heatmap</h3>
            <div className={styles.heatmapChangeBadge}>
              <TrendingUp size={12} color="#00E475" />
              <span className={styles.heatmapPercent}>18%</span>
              <span className={styles.heatmapChangeLabel}>vs Last Week</span>
            </div>
          </div>
          
          <div className={styles.heatmapSection}>
            <div className={styles.heatmapLeftArea}>
              <div className={styles.heatmapGridContainer}>
                <div className={styles.heatmapLabelsColumn}>
                  <span>MON</span>
                  <span>WED</span>
                  <span>FRI</span>
                  <span>SUN</span>
                </div>

                <div className={styles.heatmapGrid}>
                  {heatmapMatrix.map((row, rIdx) => (
                    <div key={rIdx} className={styles.heatmapMatrixRow}>
                      {row.map((cellColor, cIdx) => (
                        <div 
                          key={cIdx} 
                          className={styles.heatCell} 
                          style={{ background: cellColor }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className={styles.heatLegend}>
                <div className={styles.legendScale}>
                  <span className={styles.legendLabel}>Low</span>
                  <div className={styles.legendBoxes}>
                    <div className={styles.legendBox} style={{ background: "#2A2A2A" }} />
                    <div className={styles.legendBox} style={{ background: "rgba(179, 197, 255, 0.2)" }} />
                    <div className={styles.legendBox} style={{ background: "rgba(179, 197, 255, 0.4)" }} />
                    <div className={styles.legendBox} style={{ background: "rgba(179, 197, 255, 0.6)" }} />
                    <div className={styles.legendBox} style={{ background: "rgba(179, 197, 255, 0.8)" }} />
                    <div className={styles.legendBox} style={{ background: "#B3C5FF" }} />
                  </div>
                  <span className={styles.legendLabel}>High</span>
                </div>
                <div className={styles.legendTime}>
                  Sync: 5m ago
                </div>
              </div>
            </div>

            <div className={styles.insightBox}>
              <div className={styles.insightTitle}>OPTIMIZATION INSIGHT</div>
              <div className={styles.insightText}>
                Activity peaks significantly between <span className={styles.insightHighlight}>7 PM–10 PM</span> on weekdays. Thursday performance exceeded the weekly benchmark by <span className={styles.insightHighlight}>24%</span>.
              </div>
            </div>
          </div>
        </div>

        {/* Attention Required Card */}
        <div className={`${styles.cardBlock} ${styles.attentionCard}`}>
          <div className={styles.attentionHeader}>
            <AlertTriangle size={16} />
            Attention Required
          </div>
          
          <div className={styles.attentionScroll}>
            {attentionAlerts.map(alert => (
              <div key={alert.id} className={styles.attentionItem}>
                <div className={styles.attentionItemHeader}>
                  <span className={styles.attentionName}>{alert.id.includes("Team") ? alert.id : `Employee #${alert.id}`}</span>
                  <span className={styles.attentionBadge}>{alert.badge}</span>
                </div>
                <div className={styles.attentionDesc}>{alert.text}</div>
                <button className={styles.attentionAction}>{alert.action}</button>
              </div>
            ))}
          </div>
        </div>

        {/* Top Contributors Card */}
        <div className={`${styles.cardBlock} ${styles.contributorsCard}`}>
          <div className={styles.memberCardHeader}>
            <h3 className={styles.cardTitle}>Top Contributors</h3>
          </div>
          
          <div className={styles.contributorScroll}>
            {topContributors.map((user, idx) => (
              <div key={idx} className={styles.contributorItem}>
                <div className={styles.contributorLeft}>
                  <img src={user.avatar} alt={user.name} className={styles.contributorAvatar} />
                  <div className={styles.contributorInfo}>
                    <span className={styles.contributorName}>{user.name}</span>
                    <span className={styles.contributorRole}>{user.role}</span>
                  </div>
                </div>
                <div className={styles.contributorRight}>
                  <svg className={styles.contributorChart} viewBox="0 0 42 16">
                    <polyline 
                      points={user.sparkline || "0,10 8,12 16,6 24,10 32,2 40,4"} 
                      fill="none" 
                      stroke="#DDDDFF" 
                      strokeWidth="1.8" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className={styles.contributorScore}>{user.score}</span>
                </div>
              </div>
            ))}
          </div>

          <button className={styles.viewFullReportBtn}>
            View Full Report
          </button>
        </div>
      </div>

      {/* Add Report Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>Add Report</h2>
                <p className={styles.modalSubtitle}>Saturday 20 December 2025</p>
              </div>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setShowAddModal(false)}
                title="Close"
              >
                <X size={16} />
              </button>
            </div>

            <form className={styles.modalForm} onSubmit={handleReportSubmit}>
              {/* Task Checklist Section */}
              <div className={styles.modalSection}>
                <div className={styles.modalSectionHeader}>
                  <span className={styles.modalSectionTitle}>Task Checklist</span>
                  <span className={styles.checklistCounter}>
                    {completedCount}/{checklist.length}
                  </span>
                </div>

                <div className={styles.checklistCard}>
                  <div className={styles.checklistItems}>
                    {checklist.map((item) => (
                      <div
                        key={item.id}
                        className={styles.checklistItem}
                        onClick={() => toggleChecklistItem(item.id)}
                      >
                        <div
                          className={`${styles.customCheckbox} ${
                            item.completed ? styles.customCheckboxChecked : ""
                          }`}
                        >
                          {item.completed && <Check size={11} strokeWidth={3} />}
                        </div>
                        <span
                          className={`${styles.checklistText} ${
                            item.completed ? styles.checklistTextCompleted : ""
                          }`}
                        >
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className={styles.checklistDivider} />

                  <div className={styles.addExtraTaskRow}>
                    <input
                      type="text"
                      className={styles.addExtraTaskInput}
                      placeholder="Add an extra task..."
                      value={newExtraTask}
                      onChange={(e) => setNewExtraTask(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddExtraTask(e);
                        }
                      }}
                    />
                    <button
                      type="button"
                      className={styles.addExtraTaskBtn}
                      onClick={handleAddExtraTask}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Work Summary Section */}
              <div className={styles.modalSection}>
                <div className={styles.modalSectionHeader}>
                  <span className={styles.modalSectionTitle}>Work Summary</span>
                </div>

                <div className={styles.workSummaryCard}>
                  <textarea
                    className={styles.workSummaryTextarea}
                    placeholder="Describe any blockers, achievements, or notes for tomorrow..."
                    rows={4}
                    value={workSummary}
                    onChange={(e) => setWorkSummary(e.target.value)}
                  />
                </div>

                <div className={styles.workSummaryFooter}>
                  <span className={styles.markdownSupported}>Markdown supported</span>
                  <span className={styles.savedTimestamp}>
                    <Bookmark size={11} /> Saved at 20:59
                  </span>
                </div>
              </div>

              <div className={styles.modalFooterDivider} />

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.modalCancelBtn}
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.modalSubmitBtn}>
                  <Send size={13} />
                  <span>Submit Report</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default ManagerPerformance;
