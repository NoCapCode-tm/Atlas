import React, { useEffect, useState } from "react";
import styles from "../CSS/BulkAssignModal.module.css";
import { X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const BulkAssignModal = ({ modal, setModal, roles }) => {
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);

  // NEW: Select All state
  const [selectAll, setSelectAll] = useState(false);

  // Fetch users
  useEffect(() => {
    const fetchemployees = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/admin/getalluser`,
          { withCredentials: true }
        );
        setUsers(response.data.message);
      } catch (error) {
        console.log("Error fetching employees:", error.message);
      }
    };

    fetchemployees();
  }, []);

  // Filter users
  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase());
    const matchesDept = filterDept ? u.role === filterDept : true;
    return matchesSearch && matchesDept;
  });

  // Toggle a single user
  const toggleUser = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((u) => u !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  // NEW: Toggle Select All for filtered users
  const toggleSelectAll = () => {
    if (selectAll) {
      // Unselect filtered users
      const remaining = selectedUsers.filter(
        (id) => !filteredUsers.some((u) => u._id === id)
      );
      setSelectedUsers(remaining);
      setSelectAll(false);
    } else {
      // Select all filtered users
      const newSelections = [
        ...new Set([...selectedUsers, ...filteredUsers.map((u) => u._id)]),
      ];
      setSelectedUsers(newSelections);
      setSelectAll(true);
    }
  };

  
  useEffect(() => {
    const allFilteredSelected = filteredUsers.every((u) =>
      selectedUsers.includes(u._id)
    );
    setSelectAll(allFilteredSelected);
  }, [selectedUsers, filteredUsers]);

 
  const assignRole = async () => {
    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }
    if (selectedUsers.length === 0) {
      toast.error("Select at least one user");
      return;
    }

    try {
        console.log(selectedRole)
        console.log(selectedUsers)
      await axios.post(
        `http://localhost:5000/api/v1/admin/assignrole`,
        { role: selectedRole, users: selectedUsers },
        { withCredentials: true }
      );

      toast.success("Role assigned successfully!");
      setModal(false);
      window.location.reload()
    } catch (err) {
      toast.error("Error assigning role");
      console.log(err.message);
    }
  };

  if (!modal) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* HEADER */}
        <div className={styles.header}>
          <h2>Bulk Role Assignment</h2>
          <button className={styles.closeBtn} onClick={() => setModal(false)}>
            <X size={22} />
          </button>
        </div>

        <p className={styles.subtitle}>
          Select and assign a role to multiple people at once
        </p>

        {/* SEARCH + FILTER GRID */}
        <div className={styles.topGrid}>
          <div className={styles.left}>
            <label className={styles.label}>Search Users</label>
            <input
              className={styles.input}
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <label className={styles.label}>Assign role</label>
            <select
              className={styles.input}
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">Select a role</option>
              {roles.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.rolename}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.right}>
            <label className={styles.label}>Filter</label>
            <select
              className={styles.input}
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
            >
              <option value="">All departments...</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="UI/UX Designer">UI/UX Designer</option>
              <option value="QA">QA</option>
              <option value="Manager">Manager</option>
              <option value="HR">HR</option>
            </select>
          </div>
        </div>

        <div className={styles.divider}></div>

        {/* SELECT ALL */}
        <div className={styles.selectAllRow}>
          <input
            type="checkbox"
            checked={selectAll}
            onChange={toggleSelectAll}
          />
          <label>Select All ({filteredUsers.length} users)</label>
        </div>

        {/* USER LIST */}
        <div className={styles.userList}>
          {filteredUsers.map((emp) => (
            <div
              key={emp._id}
              className={`${styles.userCard} ${
                selectedUsers.includes(emp._id) ? styles.selected : ""
              }`}
            >
              <input
                type="checkbox"
                checked={selectedUsers.includes(emp._id)}
                onChange={() => toggleUser(emp._id)}
              />

              <img
                src={
                  emp.profilepicture ||
                  `https://i.pravatar.cc/150?u=${emp._id}`
                }
                alt=""
                className={styles.avatar}
              />

              <div className={styles.userDetails}>
                <div className={styles.userName}>{emp.name}</div>
                <div className={styles.userRole}>{emp.role}</div>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={() => setModal(false)}>
            Cancel
          </button>
          <button className={styles.saveBtn} onClick={assignRole}>
            Assign Role
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkAssignModal;
