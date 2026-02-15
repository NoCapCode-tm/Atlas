import React, { useEffect, useState } from "react";
import styles from "../CSS/Rolepage.module.css";
import { Search, Pencil, Users, ShieldCheck } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import BulkAssignModal from "./BulkAssignModal";
import { InfoTooltip } from "./InfoTooltip";

const Rolepage = () => {
  const [roles, setRole] = useState([]);
  const [users, setusers] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [bulkModal, setBulkModal] = useState(false);

  const [roleName, setRoleName] = useState("");
  const [roleid, setroleid] = useState("");
  const [details, setDetails] = useState("");

  const [eroleName, seteRoleName] = useState("");
  const [edetails, seteDetails] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  // loaders
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  // ---------------- FETCH ROLES ----------------
  const fetchRoles = async () => {
    try {
      setLoadingRoles(true);
      const res = await axios.get(
        `http://localhost:5000/api/v1/admin/getroles`
      );
      setRole(res.data.message);
    } catch {
      toast.error("Failed to load roles");
    } finally {
      setLoadingRoles(false);
    }
  };

  // ---------------- FETCH USERS ----------------
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await axios.get(
        `http://localhost:5000/api/v1/admin/getalluser`,
        { withCredentials: true }
      );
      setusers(res.data.message);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, []);

  // ---------------- CREATE ROLE ----------------
  const handlecreate = async () => {
    try {
      setSubmitting(true);
      await axios.post(
        `http://localhost:5000/api/v1/admin/createrole`,
        { rolename: roleName, details },
        { withCredentials: true }
      );
      toast.success("Role Added Successfully");
      setShowModal(false);
      fetchRoles();
    } catch {
      toast.error("Role not Created Successfully");
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------- UPDATE ROLE ----------------
  const handleupdate = async () => {
    try {
      setSubmitting(true);
      await axios.put(
        `http://localhost:5000/api/v1/admin/updaterole`,
        {
          roleid,
          rolename: eroleName,
          details: edetails,
          users: selectedUsers,
        },
        { withCredentials: true }
      );
      toast.success("Role Updated Successfully");
      setEditModal(false);
      fetchRoles();
      fetchUsers();
    } catch {
      toast.error("Role not Updated Successfully");
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------- TOGGLE USER ----------------
  const toggleUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const filteredRoles = roles.filter((role) =>
    role.rolename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAvatarForRole = (name) => {
    const map = {
      Administrator: "👨‍💼",
      Manager: "🧑‍💼",
      HR: "👩‍💼",
      Employee: "👨‍🔧",
      Intern: "🎓",
    };
    return map[name] || "📌";
  };

  const handledelete =async(id)=>{
     if (!window.confirm(`Delete Role "${eroleName}" ?`)) return;
    try {
      const response = await axios.delete(`http://localhost:5000/api/v1/admin/deleterole/${id}`,
      {withCredentials:true}
      )
      console.log(response)
      toast.success("Role Deleted Successfully")
      window.location.reload();

    } catch (error) {
      toast.error("Role Cannot be deleted")
    }
  }
  return (
    <>
      <div className={styles.container}>
        <div className={styles.titlesearchhead}>
          <div className={styles.titlesearch}>
            <h1 className={styles.title}>Role management
              <InfoTooltip text="Manage user roles and control system access levels" />
            </h1>

            <div className={styles.searchWrapper}>
              <Search size={18} className={styles.searchIcon} />
              <input
                className={styles.searchInput}
                placeholder="Search role"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.buttonRow}>
            <button className={styles.topBtn}>Permission Configuration</button>
            <button
              className={styles.topBtn}
              onClick={() => setBulkModal(true)}
            >
              Bulk Assign
            </button>
            <button
              className={styles.createBtn}
              onClick={() => setShowModal(true)}
            >
              Create role
            </button>
          </div>
        </div>

        {loadingRoles ? (
          <p style={{ textAlign: "center", marginTop: 40 }}>
            Loading roles...
          </p>
        ) : (
          <div className={styles.grid}>
            {filteredRoles.map((role) => (
              <div key={role._id} className={styles.card}>
                <div className={styles.cardTopRow}>
                  <div className={styles.roleInfo}>
                    <div className={styles.roleIcon}>
                      {getAvatarForRole(role.rolename)}
                    </div>
                    <div className={styles.roleText}>
                      <h3>{role.rolename}</h3>
                      <p>
  {role.details?.length > 60
    ? role.details.slice(0, 60) + "..."
    : role.details}
</p>

                    </div>
                  </div>
                </div>

                <hr className={styles.line} />

                <div className={styles.cardBottomRow}>
                  <div className={styles.bottomItem}>
                    <Users size={16} /> {role?.users?.length } users
                  </div>
                  <div className={styles.bottomItem}>
                    <ShieldCheck size={16} color="green" />{" "}
                    {role.permissions || 48} permissions
                  </div>
                  <div
                    className={styles.bottomItem}
                    onClick={() => {
                      seteRoleName(role.rolename);
                      seteDetails(role.details);
                      setroleid(role._id);

                      const assigned = users
                        .filter((u) => u.roleid === role._id)
                        .map((u) => u._id);

                      setSelectedUsers(assigned);
                      setEditModal(true);
                    }}
                  >
                    <Pencil size={16} color="green" /> Edit
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      {showModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h2>Create New Role</h2>
            <label className={styles.label}>Role Name</label>
            <input
              className={styles.roleinput}
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
            />
            <label className={styles.label}>Description</label>
            <textarea
              className={styles.textarea}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
            <div className={styles.btnRow}>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className={styles.createBtn1}
                disabled={submitting}
                onClick={handlecreate}
              >
                {submitting ? "Creating..." : "Create role"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModal && (
        <div className={styles.overlay}>
          <div className={styles.updateModal}>
            <div className={styles.modalHeader}>
            <h2>Update Role</h2>
            <button className={styles.deleteBtn} onClick={()=>handledelete(roleid)}>Delete</button>
            </div>

            <label className={styles.label}>Role Name</label>
            <input
              className={styles.roleinput}
              value={eroleName}
              onChange={(e) => seteRoleName(e.target.value)}
            />

            <label className={styles.label}>Description</label>
            <textarea
              className={styles.textarea}
              value={edetails}
              onChange={(e) => seteDetails(e.target.value)}
            />

            <label className={styles.label}>All users</label>

            {loadingUsers ? (
              <p>Loading users...</p>
            ) : (
              <div className={styles.userList}>
                {users
                  .filter((u) => u.roleid === roleid)
                  .map((user) => (
                    <div className={styles.userCard} key={user._id}>
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => toggleUser(user._id)}
                      />
                      <div>
                        <strong>{user.name}</strong>
                        <p>{user.designation?.name || ""}</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            <div className={styles.btnRow}>
              <button
                className={styles.createBtn1}
                disabled={submitting}
                onClick={handleupdate}
              >
                {submitting ? "Updating..." : "Update Role"}
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => setEditModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {bulkModal && (
        <BulkAssignModal
          modal={bulkModal}
          setModal={setBulkModal}
          roles={roles}
        />
      )}
    </>
  );
};

export default Rolepage;
