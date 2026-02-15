import React, { useState } from "react";
import styles from "../CSS/CreateTaskModal.module.css";
import { X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const Createtaskmodal = ({ modal, setModal, projects, users }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const employeeUsers = users.filter(
  u => u.designation?.name !== "Administrator"
);


  const [form, setForm] = useState({
    title: "",
    linkedproject: "",
    description: "",
    priority: "",
    employeeid: "",
    dueAt: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await axios.post(
        "http://localhost:5000/api/v1/admin/assigntask",
        form,
        { withCredentials: true }
      );
      toast.success("Task Assigned Successfully");
      navigate("/tasks");
      window.location.reload()
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      setModal(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={() => setModal(false)}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className={styles.header}>
          <h2>Create & Assign Task</h2>
          {/* <X onClick={() => setModal(false)} /> */}
        </div>

        {/* FORM */}
        <div className={styles.formGrid}>

  {/* TITLE */}
  <div className={styles.field}>
    <label className={styles.labelu}>Title *</label>
    <input
      name="title"
      placeholder="Title"
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
      {projects.map((p) => (
        <option key={p._id} value={p._id}>
          {p.projectname}
        </option>
      ))}
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
      <option>Low</option>
      <option>Medium</option>
      <option>High</option>
      <option>Urgent</option>
    </select>
  </div>

  {/* ASSIGN TO */}
  <div className={styles.field}>
    <label className={styles.labelu}>Assign To *</label>
    <select
      name="employeeid"
      value={form.employeeid}
      onChange={handleChange}
    >
      <option value="">Select employee</option>
      {employeeUsers.map((u) => (
        <option key={u._id} value={u._id}>
          {u.name}
        </option>
      ))}
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


        {/* USER CARDS */}
        {!form.employeeid && (
  <p className={styles.selectHint}>
    Select an employee to preview
  </p>
)}

        <div className={styles.userGrid}>
  {form.employeeid &&
    employeeUsers
      .filter(u => u._id === form.employeeid)
      .map((u) => (
        <div
          key={u._id}
          className={`${styles.userCard} ${styles.active}`}
        >
          <img
            src={u.profilepicture || "https://i.pravatar.cc/100"}
            alt=""
          />
          <div className={styles.namedesig}>
            <b>{u.name}</b>
            <span>{u.designation?.name}</span>
          </div>
        </div>
      ))}
</div>


        {/* FOOTER */}
        <div className={styles.footer}>
          <button onClick={() => setModal(false)}>Cancel</button>
          <button onClick={handleSubmit}>
            {loading ? "Assigning..." : "Done →"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Createtaskmodal;
