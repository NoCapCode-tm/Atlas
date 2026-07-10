import React, { useState } from "react";
import styles from "../CSS/CreateTaskModal.module.css";
import { X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const Createtaskmodal = ({ modal, setModal, projects, users }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const employeeUsers = users?.filter(
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
        "https://b-atlas-ncc.onrender.com/api/v1/admin/assigntask",
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
        <div
          className={styles.overlay}
          onClick={() => setModal(false)}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
      
            <button
              className={styles.closeBtn}
              onClick={() => setModal(false)}
            >
              <X size={28} strokeWidth={2} />
            </button>
      
            {/* Header */}
      
            <div className={styles.header1}>
              <h2>Create & Assign Task</h2>
      
              <p>
                Fill the details below to create and assign task
              </p>
            </div>
      
            {/* First Last */}
      
              <div className={styles.fullField}>
                <label>
                  TASK NAME <span>*</span>
                </label>
      
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                />
              </div>
      
            {/* Role */}
      
            <div className={styles.fullField}>
              <label>
                TASK BRIEF<span>*</span>
              </label>
               <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                />
              
            </div>
      
            {/* Email */}
      
            <div className={styles.fullField}>
              <label>
                SELECT PROJECT<span>*</span>
              </label>
      
               <select
               name="linkedproject"
                  value={form.linkedproject}
                  onChange={handleChange}
                >
                  <option value="">
                    Select Project
                  </option>
                 {projects?.map((p)=>{
                  return(
                     <option key={p._id} value={p._id}>
          {p.projectname}
        </option>
                  )
                })}
                </select>
            </div>

            <div className={styles.fullField}>
              <label>
                SELECT EMPLOYEE<span>*</span>
              </label>
      
               <select
               name="employeeid"
                  value={form.employeeid}
                  onChange={handleChange}
                >
                  <option value="">
                    Select Employee
                  </option>
                {employeeUsers?.map((u) => (
        <option key={u._id} value={u._id}>
          {u.name}
        </option>
      ))}
                </select>
            </div>
      
      
            {/* Bottom */}
      
            <div className={styles.rowBottom}>
              <div className={styles.field}>
                <label>DUE DATE</label>
      
                <div className={styles.dateWrapper}>
                  <input
                    type="date"
                    name="dueAt"
                    value={form.dueAt}
                    onChange={handleChange
                    }
                  />
                </div>
              </div>
              <div className={styles.field}>
              <label>
                SELECT PRIORITY<span>*</span>
              </label>
      
               <select
               name="priority"
                  value={form.priority}
                  onChange={handleChange}
                >
                  <option value="">
                    Select Priority
                  </option>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Urgent</option>
            
                </select>
            </div>
              
            </div>
      
            {/* Footer */}
      
            <div className={styles.footer}>
              <p>
                <span>*</span> Required fields
              </p>
      
              <button
                className={styles.addBtn}
                onClick={handleSubmit}
              >
                {loading
                  ? "Creating..."
                  : "Create Task"}
              </button>
            </div>
          </div>
        </div>
  );
};

export default Createtaskmodal;
