import React, { useState } from "react";
import styles from "../CSS/DailyReports.module.css";
import { X, Send } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import ECreatetaskmodal from "./EmployeeSubTask";

export default function DailyReportModal({
  open,
  onClose,
  user,
  tasks,
  allTasks,
  allTasksSubtasks
}) {
  const [summary, setSummary] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [showTaskDropdown, setShowTaskDropdown] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [availableSubtasks, setAvailableSubtasks] = useState([]);
  const [showSubtaskModal, setShowSubtaskModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);


  if (!open) return null;

  const getSubtasksForTask = (taskId) => {
    if (!Array.isArray(allTasksSubtasks)) return [];
    return allTasksSubtasks.filter(
      st => String(st.relatedtasks) === String(taskId)
    );
  };

  const completedCount = selectedItems.length;

  const handleSubmitReport = async () => {
  try {
    setSubmitting(true);

    await axios.post(
      "https://atlasbackend-px53.onrender.com/api/v1/employee/submitreport",
      {
        user: user._id,
        summary,
        relatedtasks: selectedTaskIds
      },
      { withCredentials: true }
    );

    toast.success("Daily report submitted");
    onClose();
    window.location.reload();
  } catch {
    toast.error("Failed to submit report");
  } finally {
    setSubmitting(false);
  }
};


  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div
          className={styles.modal}
          onClick={(e) => e.stopPropagation()}
        >

          {/* HEADER */}
          <div className={styles.header1}>
            <div>
              <h2>Daily Report</h2>
              <p>
                {new Date().toLocaleString("en-IN", {
                  weekday: "long",
                  day: "2-digit",
                  month: "short",
                  year: "numeric"
                })}
              </p>
            </div>
            <X className={styles.close} onClick={onClose} />
          </div>

          {/* TASK CHECKLIST */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3>Task Checklist</h3>
              <span>{completedCount} Completed</span>
            </div>

           <div className={styles.taskBox}>
  {tasks.map(task => {
    const isCompleted = task.done;
    const isSelected = selectedTaskIds.includes(task.id);

    return (
      <label key={task.id} className={styles.task}>
        <input
          type="checkbox"
          disabled={isCompleted}
          checked={isCompleted || isSelected}
          onChange={() => {
            if (isCompleted) return;

            setSelectedTaskIds(prev =>
              prev.includes(task.id)
                ? prev.filter(id => id !== task.id)
                : [...prev, task.id]
            );
          }}
        />

        <span
          className={isCompleted ? styles.done : ""}
          style={{
            textDecoration: isCompleted ? "line-through" : "none",
            opacity: isCompleted ? 0.6 : 1
          }}
        >
          {task.text}
        </span>
      </label>
    );
  })}
</div>

          </div>

          {/* SUMMARY */}
          <div className={styles.section}>
            <h3>Work Summary</h3>
            <textarea
              placeholder="Describe any blockers, achievements, or notes for tomorrow..."
              value={summary}
              onChange={(e) =>
                setSummary(e.target.value)
              }
            />
          </div>

          {/* ACTIONS */}
          <div className={styles.actions}>
            <button
              className={styles.cancel}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className={styles.submit}
              onClick={handleSubmitReport}
              disabled={submitting}
            >
              <Send size={16} />
              {submitting
                ? "Submitting..."
                : "Submit Report"}
            </button>
          </div>
        </div>
      </div>

      {/* SUBTASK MODAL */}
      {showSubtaskModal && (
        <ECreatetaskmodal
          modal={showSubtaskModal}
          setModal={setShowSubtaskModal}
          tasks={allTasks}             
          parentTask={activeTask}

        />
      )}
    </>
  );
}
