import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../CSS/people.module.css";
import {
  Download,
  Plus,
  RotateCcw,
  SlidersHorizontal,
  Mail,
  MoreVertical,
} from "lucide-react";

const AVATAR_COLORS = ["#0056d2", "#22c55e", "#ff5447", "#a855f7", "#ffae4c"];

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function colorForName(name = "") {
  if (!name) return AVATAR_COLORS[0];
  const index = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

/**
 * Universal avatar — used for both employee and manager avatars.
 * Renders initials on a color derived from the name, or an image if `src` is passed.
 */
function Avatar({ name, src, size = 36, fontSize, className = "" }) {
  const computedFontSize = fontSize ?? Math.round(size * 0.36);

  return (
    <div
      className={`${styles.avatar} ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: computedFontSize,
        background: src ? "transparent" : colorForName(name),
        backgroundImage: src ? `url(${src})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      title={name}
    >
      {!src && getInitials(name)}
    </div>
  );
}

const STATUS_CONFIG = {
  Active: { label: "Active", className: "statusActive" },
  Onboarding: { label: "Onboarding", className: "statusOnboarding" },
  "Exit Pending": { label: "Exit Pending", className: "statusExitPending" },
};

const STATUS_DOT_COLORS = {
  Active: "#10b981",
  Onboarding: "#f59e0b",
  "Exit Pending": "#ef4444",
};

function StatusPill({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.Active;
  return (
    <span className={`${styles.statusPill} ${styles[config.className]}`}>
      <span className={styles.statusDot} />
      {config.label}
    </span>
  );
}

function CustomSelect({ options, value, onChange, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`${styles.customSelectWrap} ${className}`} ref={wrapRef}>
      <button
        type="button"
        className={styles.customSelectTrigger}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{value}</span>
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className={styles.customSelectChevron}>
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.customDropdownList}>
          {options.map((option) => (
            <button
              type="button"
              key={option}
              className={option === value ? styles.customDropdownItemActive : styles.customDropdownItem}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function People() {
  const navigate = useNavigate();
  const [department, setDepartment] = useState("All Departments");
  const [roleLevel, setRoleLevel] = useState("All Levels");
  const [status, setStatus] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);

  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [timezoneOverlap, setTimezoneOverlap] = useState(6);
  const [selectedSkills, setSelectedSkills] = useState(["React"]);
  const [workStyle, setWorkStyle] = useState("Hybrid");
  const moreFiltersRef = useRef(null);

  const [openActionMenu, setOpenActionMenu] = useState(null);
  const actionMenuRef = useRef(null);

  const [openMobileActionMenu, setOpenMobileActionMenu] = useState(null);
  const mobileActionMenuRef = useRef(null);

  const skillOptions = ["React", "Python", "Product Strategy", "UI Design"];

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        moreFiltersRef.current &&
        !moreFiltersRef.current.contains(event.target)
      ) {
        setShowMoreFilters(false);
      }
      if (
        actionMenuRef.current &&
        !actionMenuRef.current.contains(event.target)
      ) {
        setOpenActionMenu(null);
      }
      if (
        mobileActionMenuRef.current &&
        !mobileActionMenuRef.current.contains(event.target)
      ) {
        setOpenMobileActionMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMoreFiltersReset = () => {
    setTimezoneOverlap(6);
    setSelectedSkills([]);
    setWorkStyle("Hybrid");
  };

  const totalEntries = 150;
  const pageSize = 10;
  const totalPages = Math.ceil(totalEntries / pageSize);

  const employees = [
    { name: "Sarah Chen", email: "sarah.c@hrsentinel.com", role: "Senior Frontend Engineer", dept: "Engineering", status: "Active", manager: "M. Johnson" },
    { name: "David Kim", email: "d.kim@hrsentinel.com", role: "Product Designer", dept: "Design", status: "Onboarding", manager: "E. Roberts" },
    { name: "Sarah Chen", email: "sarah.c@hrsentinel.com", role: "Senior Frontend Engineer", dept: "Engineering", status: "Active", manager: "M. Johnson" },
    { name: "Elena Rodriguez", email: "elena.r@hrsentinel.com", role: "Marketing Manager", dept: "Marketing", status: "Exit Pending", manager: "T. Baker" },
    { name: "David Kim", email: "d.kim@hrsentinel.com", role: "Product Designer", dept: "Design", status: "Onboarding", manager: "E. Roberts" },
    { name: "Elena Rodriguez", email: "elena.r@hrsentinel.com", role: "Marketing Manager", dept: "Marketing", status: "Exit Pending", manager: "T. Baker" },
    { name: "Sarah Chen", email: "sarah.c@hrsentinel.com", role: "Senior Frontend Engineer", dept: "Engineering", status: "Active", manager: "M. Johnson" },
    { name: "David Kim", email: "d.kim@hrsentinel.com", role: "Product Designer", dept: "Design", status: "Onboarding", manager: "E. Roberts" },
    { name: "David Kim", email: "d.kim@hrsentinel.com", role: "Product Designer", dept: "Design", status: "Onboarding", manager: "E. Roberts" },
    { name: "Elena Rodriguez", email: "elena.r@hrsentinel.com", role: "Marketing Manager", dept: "Marketing", status: "Exit Pending", manager: "T. Baker" },
  ];

  const filteredEmployees = employees.filter((emp) => {
    const matchesDept =
      department === "All Departments" || emp.dept === department;
    const matchesStatus = status === "All Status" || emp.status === status;
    return matchesDept && matchesStatus;
  });

  const rangeStart = filteredEmployees.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, filteredEmployees.length);

  const handleReset = () => {
    setDepartment("All Departments");
    setRoleLevel("All Levels");
    setStatus("All Status");
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.topcontainer}>
        <div className={styles.topleft}>
          <div className={styles.topleft1}>Employee Directory</div>
          <div className={styles.topleft2}>
            Manage and view organizational personnel data.
          </div>
        </div>
        <div className={styles.topright}>
          <button className={styles.exportBtn}>
            <Download size={15} />
            Export
          </button>
          
        </div>
      </div>

      <div className={styles.filtersCard}>
        <div className={styles.filterBlock}>
          <label className={styles.filterLabel}>DEPARTMENT</label>
          <CustomSelect
            options={["All Departments", "Engineering", "Design", "Marketing"]}
            value={department}
            onChange={setDepartment}
          />
        </div>

        <div className={styles.filterBlock}>
          <label className={styles.filterLabel}>ROLE LEVEL</label>
          <CustomSelect
            options={["All Levels", "Junior", "Mid", "Senior", "Manager"]}
            value={roleLevel}
            onChange={setRoleLevel}
          />
        </div>

        <div className={styles.filterBlock}>
          <label className={styles.filterLabel}>STATUS</label>
          <CustomSelect
            options={["All Status", "Active", "Onboarding", "Exit Pending"]}
            value={status}
            onChange={setStatus}
          />
        </div>

        <div className={styles.filterBlock} style={{ flex: "0 0 auto" }}>
          <label className={styles.filterLabel} style={{ visibility: "hidden" }}>
            RESET
          </label>
          <button className={styles.resetBtn} onClick={handleReset}>
            <RotateCcw size={13} />
            Reset
          </button>
        </div>

        <div
          className={styles.filterBlock}
          style={{ flex: "0 0 auto", position: "relative" }}
          ref={moreFiltersRef}
        >
          <label className={styles.filterLabel} style={{ visibility: "hidden" }}>
            FILTERS
          </label>
          <button
            className={styles.moreFiltersBtn}
            onClick={() => setShowMoreFilters(!showMoreFilters)}
          >
            <SlidersHorizontal size={13} />
            <span className={styles.moreFiltersLabel}>More Filters</span>
          </button>

          {showMoreFilters && (
            <div className={styles.moreFiltersPopup}>
              <div className={styles.popupBody}>
                <div className={styles.popupSection}>
                  <label className={styles.popupLabel}>TIMEZONE OVERLAP</label>
                  <div className={styles.sliderWrap}>
                    <input
                      type="range"
                      min="0"
                      max="12"
                      value={timezoneOverlap}
                      onChange={(e) => setTimezoneOverlap(e.target.value)}
                      className={styles.slider}
                    />
                    <div className={styles.sliderLabels}>
                      <span>0h</span>
                      <span>{timezoneOverlap}h</span>
                      <span>12h</span>
                    </div>
                  </div>
                </div>

                <div className={styles.popupSection}>
                  <label className={styles.popupLabel}>EXPERTISE &amp; SKILLS</label>
                  <div className={styles.tagsWrap}>
                    {skillOptions.map((skill) => (
                      <button
                        key={skill}
                        className={
                          selectedSkills.includes(skill)
                            ? styles.tagSelected
                            : styles.tag
                        }
                        onClick={() => toggleSkill(skill)}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.popupSection}>
                  <label className={styles.popupLabel}>WORK STYLE</label>
                  <div className={styles.workStyleWrap}>
                    {["Remote", "Hybrid", "Onsite"].map((style) => (
                      <button
                        key={style}
                        className={
                          workStyle === style
                            ? styles.workStyleBtnActive
                            : styles.workStyleBtn
                        }
                        onClick={() => setWorkStyle(style)}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.popupFooter}>
                <button
                  className={styles.popupResetLink}
                  onClick={handleMoreFiltersReset}
                >
                  Clear All
                </button>
                <button
                  className={styles.popupApplyBtn}
                  onClick={() => setShowMoreFilters(false)}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.desktopview}>
        <div className={styles.tableScroll}>
          <div className={styles.employeeListHead}>
            <span className={styles.tableHeadCell}>EMPLOYEE</span>
            <span className={styles.tableHeadCell}>ROLE &amp; DEPT</span>
            <span className={styles.tableHeadCell}>STATUS</span>
            <span className={styles.tableHeadCell}>MANAGER</span>
            <span className={styles.tableHeadCell}>ACTIONS</span>
          </div>

          <div className={styles.employeeList}>
            {filteredEmployees.map((emp, i) => (
              <div className={styles.tableRow} key={i}>
                <div className={styles.tableCell}>
                  <div className={styles.employeeCell}>
                    <Avatar name={emp.name} src={emp.avatarUrl} size={36} fontSize={13} />
                    <div className={styles.employeeInfo}>
                      <span className={styles.employeeName}>{emp.name}</span>
                      <span className={styles.employeeEmail}>
                        <Mail size={11} />
                        {emp.email}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.tableCell}>
                  <div className={styles.roleTitle}>{emp.role}</div>
                  <span className={styles.deptBadge}>{emp.dept}</span>
                </div>
                <div className={styles.tableCell}>
                  <StatusPill status={emp.status} />
                </div>
                <div className={styles.tableCell}>
                  <div className={styles.managerCell}>
                    <Avatar
                      name={emp.manager}
                      size={22}
                      fontSize={9.5}
                      className={styles.managerAvatar}
                    />
                    <span className={styles.managerName}>{emp.manager}</span>
                  </div>
                </div>
                <div
                  className={styles.tableCell}
                  style={{ position: "relative" }}
                  ref={openActionMenu === i ? actionMenuRef : null}
                >
                  <button
                    className={styles.actionsBtn}
                    onClick={() =>
                      setOpenActionMenu(openActionMenu === i ? null : i)
                    }
                  >
                    <MoreVertical size={16} />
                  </button>

                  {openActionMenu === i && (
                    <div className={styles.actionsMenu}>
                      <button
                        className={styles.actionsMenuItem}
                        onClick={() => {
                          setOpenActionMenu(null);
                          navigate(`/hr/employees/${i}`);
                        }}
                      >
                        View Profile
                      </button>
                      
                      <button
                        className={`${styles.actionsMenuItem} ${styles.actionsMenuItemDanger}`}
                        onClick={() => setOpenActionMenu(null)}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>

        <div className={styles.mobileView}>
          {filteredEmployees.map((emp, i) => {
            const statusInfo = STATUS_CONFIG[emp.status] || STATUS_CONFIG.Active;
            return (
              <div className={styles.employeeCard} key={i}>
                <div className={styles.cardTop}>
                  <div className={styles.cardAvatarWrap}>
                    <Avatar name={emp.name} src={emp.avatarUrl} size={56} fontSize={18} />
                    <span
                      className={styles.presenceDot}
                      style={{
                        background:
                          STATUS_DOT_COLORS[emp.status] || STATUS_DOT_COLORS.Active,
                      }}
                    />
                  </div>
                  <div className={styles.cardUser}>
                    <h3>{emp.name}</h3>
                    <p>{emp.email}</p>
                  </div>

                  <div
                    style={{ position: "relative" }}
                    ref={openMobileActionMenu === i ? mobileActionMenuRef : null}
                  >
                    <button
                      className={styles.actionsBtn}
                      onClick={() =>
                        setOpenMobileActionMenu(
                          openMobileActionMenu === i ? null : i
                        )
                      }
                    >
                      <MoreVertical size={18} />
                    </button>

                    {openMobileActionMenu === i && (
                      <div className={styles.actionsMenu}>
                        <button
                          className={styles.actionsMenuItem}
                          onClick={() => {
                            setOpenMobileActionMenu(null);
                            navigate(`/hr/employees/${i}`);
                          }}
                        >
                          View Profile
                        </button>

                        <button
                          className={`${styles.actionsMenuItem} ${styles.actionsMenuItemDanger}`}
                          onClick={() => setOpenMobileActionMenu(null)}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.cardRoleBlock}>
                  <h4 className={styles.cardRoleTitle}>{emp.role}</h4>
                  <span className={styles.cardDeptBadge}>{emp.dept}</span>
                </div>

                <div className={styles.cardDivider} />

                <div className={styles.cardBottomRow}>
                  <span
                    className={`${styles.statusPill} ${styles[statusInfo.className]}`}
                  >
                    <span className={styles.statusDot} />
                    {statusInfo.label}
                  </span>

                  <div className={styles.cardManager}>
                    <span className={styles.cardManagerLabel}>Manager:</span>
                    <Avatar
                      name={emp.manager}
                      size={22}
                      fontSize={9.5}
                      className={styles.managerAvatar}
                    />
                    <span className={styles.managerName}>{emp.manager}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.paginationRow}>
          <span className={styles.paginationInfo}>
            Showing {rangeStart} to {rangeEnd} of {filteredEmployees.length} entries
          </span>
          <div className={styles.paginationControls}>
            <button
              className={styles.pageBtnNext}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className={
                  currentPage === page ? styles.pageBtnActive : styles.pageBtn
                }
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <span className={styles.pageEllipsis}>...</span>
            <button
              className={styles.pageBtnNext}
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default People;