import React, { useState } from "react";
import styles from "../CSS/EmployeeSubTask.module.css";
import { X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const ECreatetaskmodal = ({ modal, setModal, tasks}) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();




  const [form, setForm] = useState({
    title: "",
    relatedtask: tasks?._id,
    description: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      console.log(form)
      await axios.post(
        "https://prismbackend-27d920759150.herokuapp.com/api/v1/employee/addsubtask",
        form,
        { withCredentials: true }
      );
      toast.success("Sub Task Assigned Successfully");
      navigate("/employees/tasks")
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
          <h2>Create Sub Task</h2>
          {/* <X onClick={() => setModal(false)} /> */}
        </div>

        {/* FORM */}
        <div className={styles.formGrid}>
          <input
            name="title"
            placeholder="Title*"
            value={form.title}
            onChange={handleChange}
          />

          {tasks && (
  <input
    name="relatedtask"
    value={tasks?.title}
    onChange={handleChange}
  >
  </input>
)}


          <textarea
            name="description"
            placeholder="Describe the task clearly, including objective, expectations, and any important notes.*"
            value={form.description}
            onChange={handleChange}
          />

         {/* <select
  name="priority"
  value={form.priority}
  onChange={handleChange}
  className={styles.fullWidth}
>
  <option value="">Priority*</option>
  <option>Low</option>
  <option>Medium</option>
  <option>High</option>
  <option>Urgent</option>
</select> */}

{/* ASSIGN TO */}
{/* <select
  name="employeeid"
  value={form.employeeid}
  onChange={handleChange}
>
  <option value="">Assign to*</option>
  {employeeUsers.map((u) => (
    <option key={u._id} value={u._id}>
      {u.name}
    </option>
  ))}
</select> */}

{/* END DATE – SIDE BY SIDE */}
{/* <input
  name="dueAt"
  value={form.dueAt}
  onChange={handleChange}
  type="date"
  // placeholder="Due Date*"
/> */}
        </div>

        {/* USER CARDS */}
        {/* {!form.employeeid && (
  <p className={styles.selectHint}>
    Select an employee to preview
  </p>
)} */}

        {/* <div className={styles.userGrid}>
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
</div> */}


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

export default ECreatetaskmodal;
