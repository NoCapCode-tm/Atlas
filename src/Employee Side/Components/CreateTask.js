import { useState } from "react";
import styles from "../CSS/CreateTask.module.css";
import { X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { API_URL } from "../../config";

const Createtask = ({ modal, setModal, user, projects }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    linkedproject: "",
    description: "",
    priority: "",
    dueAt: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    // Basic validation
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!form.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!form.priority) {
      toast.error("Priority is required");
      return;
    }
    if (!form.dueAt) {
      toast.error("Due date is required");
      return;
    }
    if (!user?._id) {
      toast.error("User not loaded yet, please try again");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${API_URL}admin/assigntask`,
        {
          title: form.title,
          description: form.description,
          priority: form.priority,
          dueAt: form.dueAt,
          employeeid: user._id,
          // send both field names so the backend accepts whichever it expects
          linkedproject: form.linkedproject,
          projectId: form.linkedproject,
        },
        { withCredentials: true }
      );
      toast.success("Task created successfully");
      setModal(false);
      // Navigate to tasks page — reload happens after navigation
      navigate("/employees/tasks");
    } catch (err) {
      console.error("Create task error:", err);
      toast.error(
        err?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={() => setModal(false)}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

        {/* HEADER */}
        <div className={styles.header}>
          <h2>Create Task</h2>
          <X
            size={20}
            style={{ cursor: "pointer" }}
            onClick={() => setModal(false)}
          />
        </div>

        {/* FORM */}
        <div className={styles.formGrid}>

          {/* TITLE */}
          <div className={styles.field}>
            <label className={styles.labelu}>Title *</label>
            <input
              name="title"
              placeholder="Task title"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          {/* PROJECT */}
          <div className={styles.field}>
            <label className={styles.labelu}>Project</label>
            <select
              name="linkedproject"
              value={form.linkedproject}
              onChange={handleChange}
            >
              <option value="">Select project</option>
              {Array.isArray(projects) && projects.length > 0 ? (
                projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.projectname}
                  </option>
                ))
              ) : (
                <option disabled>No projects available</option>
              )}
            </select>
          </div>

          {/* DESCRIPTION */}
          <div className={`${styles.field} ${styles.fullWidth}`}>
            <label className={styles.labelu}>Description *</label>
            <textarea
              name="description"
              placeholder="Describe the task clearly, including objective, expectations, and any important notes."
              value={form.description}
              onChange={handleChange}
            />
          </div>

          {/* PRIORITY */}
          <div className={styles.field}>
            <label className={styles.labelu}>Priority *</label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              <option value="">Select priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          {/* DUE DATE */}
          <div className={styles.field}>
            <label className={styles.labelu}>Due Date *</label>
            <input
              name="dueAt"
              value={form.dueAt}
              onChange={handleChange}
              type="date"
            />
          </div>

        </div>

        {/* ASSIGNED USER CARD */}
        <div className={styles.userGrid}>
          {user?._id && (
            <div className={`${styles.userCard} ${styles.active}`}>
              <img
                src={user?.profilepicture || "https://i.pravatar.cc/100"}
                alt={user?.name || "User"}
              />
              <div className={styles.namedesig}>
                <b>{user?.name}</b>
                <span>{user?.designation?.name}</span>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className={styles.footer}>
          <button onClick={() => setModal(false)}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Done →"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Createtask;
