// components/UsersTable.jsx
import React, { useEffect, useState } from "react";
import DynamicTable from "../../template/DynamicTable";
import AuthForm from "../../template/AuthForm";
import Popup from "../Popup";
import {
  faEye,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
  getAllUsers,
  deleteUserById,
  updateUserById,
} from "@/utils/userApi";
import { toast } from "react-toastify";

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setupLoading] = useState(false);
  const [timer, setTimer] = useState('');
  // ✅ Load users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    let interval;
    if (loading && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else if (timer === 0 && loading) {
      setupLoading(false);
    }
    return () => clearInterval(interval);
  }, [uploading, timer]);

  // ✅ Form field config
  const userFormFields = selectedUser
    ? [
        {
          name: "username",
          label: "Username",
          value: selectedUser.username || "",
          onChange: (e) => setSelectedUser({ ...selectedUser, username: e.target.value }),
          type: "text",
          disabled: !isEditing,
        },
        {
          name: "email",
          label: "Email",
          value: selectedUser.email || "",
          onChange: (e) => setSelectedUser({ ...selectedUser, email: e.target.value }),
          type: "email",
          disabled: !isEditing,
        },
        {
          name: "industry",
          label: "Industry",
          value: selectedUser.industry || "",
          onChange: (e) => setSelectedUser({ ...selectedUser, industry: e.target.value }),
          type: "text",
          disabled: !isEditing,
        },
        {
          name: "region",
          label: "Region",
          value: selectedUser.region || "",
          onChange: (e) => setSelectedUser({ ...selectedUser, region: e.target.value }),
          type: "text",
          disabled: !isEditing,
        },
        {
          name: "company_size",
          label: "Company Size",
          value: selectedUser.company_size || "",
          onChange: (e) => setSelectedUser({ ...selectedUser, company_size: e.target.value }),
          type: "text",
          disabled: !isEditing,
        },
      ]
    : [];

  // ✅ Submit handler
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setupLoading(true)
    setTimer(3)
    try {
      await updateUserById(selectedUser._id, selectedUser);
      toast.success("User updated");
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user");
    }
  };

  // ✅ Delete single
  const handleDelete = async (user) => {
    try {
      await deleteUserById(user._id);
      toast.success("User deleted");
      setUsers((prev) => prev.filter((u) => u._id !== user._id));
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // ✅ Bulk delete
  const handleBulkDelete = async (ids) => {
    try {
      await Promise.all(ids.map((id) => deleteUserById(id)));
      toast.success(`Deleted ${ids.length} user(s)`);
      setUsers((prev) => prev.filter((u) => !ids.includes(u._id)));
    } catch (err) {
      toast.error("Bulk delete failed");
    }
  };

  // ✅ Table columns
  const columns = [
    { key: "username", label: "Username" },
    { key: "email", label: "Email" },
    { key: "industry", label: "Industry" },
    { key: "region", label: "Region" },
    { key: "company_size", label: "Company Size" },
    {
      key: "createdAt",
      label: "Created At",
      render: (val) => new Date(val).toLocaleDateString(),
    },
  ];

  // ✅ Row actions
  const rowActions = [
    {
      title: "View",
      icon: faEye,
      onClick: (user) => {
        setSelectedUser(user);
        setIsEditing(false);
        setShowForm(true);
      },
    },
    {
      title: "Edit",
      icon: faEdit,
      onClick: (user) => {
        setSelectedUser(user);
        setIsEditing(true);
        setShowForm(true);
      },
    },
    {
      title: "Delete",
      icon: faTrash,
      color: "red",
      onClick: handleDelete,
    },
  ];

  const bulkActions = [
    {
      label: "Delete Selected",
      icon: faTrash,
      onClick: handleBulkDelete,
    },
  ];

  return (
    <>
      <DynamicTable
        title="Users"
        rows={users}
        columns={columns}
        pageSize={10}
        selectable
        rowActions={rowActions}
        bulkActions={bulkActions}
      />

      <Popup open={showForm} onClose={() => setShowForm(false)}>
        <AuthForm
          title={isEditing ? "Edit User" : "User Details"}
          subtitle={isEditing ? "Modify and save changes" : "Read-only view"}
          loading={uploading}
          timer={timer}
          fields={userFormFields}
          onSubmit={isEditing ? handleFormSubmit : (e) => { e.preventDefault(); setShowForm(false); }}
          submitText={isEditing ? "Update" : "Close"}
          bottomText=""
        />
      </Popup>
    </>
  );
}
