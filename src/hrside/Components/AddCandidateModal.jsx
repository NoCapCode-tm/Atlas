import React, { useState } from "react";
import { X, Upload, Plus } from "lucide-react";
import styles from "../CSS/activeRequisitions.module.css";

export default function AddCandidateModal({ onClose }) {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files[0]) setFileName(e.target.files[0].name);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalCard}>
        <X className={styles.modalClose} size={22} onClick={onClose} />

        <h2 className={styles.modalTitle}>Add New Candidate</h2>
        <p className={styles.modalSubtitle}>
          Enter the candidate's information to add them to the talent pool.
        </p>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              First Name <span className={styles.requiredStar}>*</span>
            </label>
            <input className={styles.formInput} type="text" />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Last Name <span className={styles.requiredStar}>*</span>
            </label>
            <input className={styles.formInput} type="text" />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup} style={{ width: "100%" }}>
            <label className={styles.formLabel}>
              Email Address <span className={styles.requiredStar}>*</span>
            </label>
            <input className={styles.formInput} type="email" />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup} style={{ width: "100%" }}>
            <label className={styles.formLabel}>Phone Number</label>
            <input className={styles.formInput} type="tel" />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Experience Level</label>
            <select className={styles.formSelect}>
              <option value="">Select</option>
              <option value="entry">Entry Level</option>
              <option value="mid">Mid Level</option>
              <option value="senior">Senior Level</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Expected Salary</label>
            <input className={styles.formInput} type="text" placeholder="$ 0.00" />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup} style={{ width: "100%" }}>
            <label className={styles.formLabel}>Resume</label>
            <div className={styles.resumeUpload}>
              <div className={styles.resumeUploadLeft}>
                <Upload size={18} className={styles.resumeUploadIcon} />
                <span className={styles.resumeUploadText}>
                  {fileName || "Upload candidate resume or drag and drop"}
                </span>
              </div>
              <span className={styles.browseBadge}>Browse</span>
              <input
                type="file"
                className={styles.hiddenFileInput}
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <span className={styles.requiredNote}>* Required fields</span>
          <button className={styles.postJobBtn}>
            <Plus size={16} />
            Add Candidate
          </button>
        </div>
      </div>
    </div>
  );
}