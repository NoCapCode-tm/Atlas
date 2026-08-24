import React, { useState, useEffect } from "react";
import { X, Calendar, ChevronDown } from "lucide-react";
import styles from "../CSS/editEmployeeModal.module.css";

function EditEmployeeModal({ employee, onClose, onSave }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const [firstName, setFirstName] = useState(
    employee?.name?.split(" ")[0] || ""
  );
  const [lastName, setLastName] = useState(
    employee?.name?.split(" ").slice(1).join(" ") || ""
  );
  const [role, setRole] = useState(employee?.role || "");
  const [email, setEmail] = useState(employee?.email || "");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    onSave?.({
      name: `${firstName} ${lastName}`.trim(),
      role,
      email,
      password,
      dob,
      gender,
    });
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div className={styles.overlay} onMouseDown={handleOverlayClick}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div className={styles.headerSection}>
          <h2 className={styles.heading}>Edit Employee</h2>
          <p className={styles.subheading}>
            Update the fields below to modify employee details
          </p>
        </div>

        <form className={styles.formSection} onSubmit={handleSave}>
          <div className={styles.nameRow}>
            <div className={styles.field}>
              <label className={styles.label}>First Name *</label>
              <input
                className={styles.input}
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Last Name *</label>
              <input
                className={styles.input}
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Role *</label>
            <input
              className={styles.input}
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email *</label>
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password *</label>
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className={styles.dobGenderRow}>
            <div className={styles.field}>
              <label className={styles.label}>Date of Birth</label>
              <div className={styles.inputWithIcon}>
                <input
                  className={styles.inputPlain}
                  type="text"
                  placeholder="MM/DD/YYYY"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
                <Calendar size={16} className={styles.inputIcon} />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Gender</label>
              <div className={styles.selectWrapper}>
                <select
                  className={styles.select}
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                  <option value="undisclosed">Prefer not to say</option>
                </select>
                <ChevronDown size={16} className={styles.selectIcon} />
              </div>
            </div>
          </div>

          <div className={styles.footerRow}>
            <span className={styles.requiredNote}>* Required fields</span>
            <button type="submit" className={styles.saveBtn}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditEmployeeModal;