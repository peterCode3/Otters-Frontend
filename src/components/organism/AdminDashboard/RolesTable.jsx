// components/RolesTable.jsx
import React, { useEffect, useState } from "react";
import {
  getAllRoles,
  updateRoleById,
  deleteRoleById,
} from "@/utils/roleApi";
import DynamicTable from "../../template/DynamicTable";
import Popup from "../Popup";
import AuthForm from "../../template/AuthForm";
import { toast } from "react-toastify";
import AssignRole from "./Role/AssignRole";
import NotifyForm from "../../template/NotifyForm";
import {
  faEye,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

export default function RolesTable() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [timer, setTimer] = useState();
  const [open, setOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [bulkToDelete, setBulkToDelete] = useState([]);

  const fetchRoles = async () => {
    try {
      const data = await getAllRoles();
      setRoles(data);
    } catch (err) {
      toast.error("Failed to load roles");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchRoles();
    let interval;
    if (loading && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else if (timer === 0 && loading) {
      setLoading(false);
    }
    return () => clearInterval(interval);
  }, [loading, timer]);

  const handleDeleteConfirmed = async (role) => {
    try {
      setLoading(true);
      const res = await deleteRoleById(role._id);
      toast.success("Role deleted");
      setRoles((prev) => prev.filter((r) => r._id !== role._id));
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err.message);
      toast.error("Failed to delete role");
    } finally {
      setLoading(false);
    }
  };


  const handleBulkDeleteConfirmed = async () => {
    try {
      setLoading(true);
      await Promise.all(bulkToDelete.map(deleteRoleById));
      toast.success(`Deleted ${bulkToDelete.length} roles`);
      setRoles((prev) => prev.filter((r) => !bulkToDelete.includes(r._id)));
      setShowBulkConfirm(false);
    } catch (err) {
      toast.error("Bulk delete failed");
      console.error(err);
    } finally {
      setLoading(false);
      setShowBulkConfirm(false);
      setBulkToDelete([]);
      setSelectedRole([]); 
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimer(3)
    try {
      await updateRoleById(selectedRole._id, selectedRole);
      toast.success("Role updated");
      setShowForm(false);
      fetchRoles();
    } catch (err) {
      toast.error("Update Failed");
      setLoading(false);
    }
  };

  const roleFormFields = selectedRole
    ? [
      {
        name: "name",
        label: "Role Name",
        type: "text",
        value: selectedRole.name,
        onChange: (e) =>
          setSelectedRole({ ...selectedRole, name: e.target.value }),
        disabled: !isEditing,
      },
      {
        name: "permissions",
        label: "Permissions",
        type: "checkbox-group",
        value: selectedRole.permissions || [],
        onToggle: (permission) => {
          setSelectedRole((prev) => ({
            ...prev,
            permissions: prev.permissions.includes(permission)
              ? prev.permissions.filter((p) => p !== permission)
              : [...prev.permissions, permission],
          }));
        },
        options: [
          { label: "Admin Dashboard", value: "admin_dashboard" },
          { label: "User Dashboard", value: "user_dashboard" },
          { label: "View Leads", value: "view_leads" },
          { label: "View Archive Leads", value: "view_archive_leads" },
          { label: "View Users", value: "view_users" },
          { label: "View Roles", value: "view_roles" },
          { label: "Delete Leads", value: "delete_leads" },
          { label: "Register User", value: "register_user" },
        ],
        disabled: !isEditing,
      }

    ]
    : [];

  const columns = [
    { key: "name", label: "Role Name" },
    {
      key: "permissions",
      label: "Permissions",
      render: (val) => (
        <ul className="list-disc pl-4 text-xs text-gray-600">
          {val.map((perm, i) => (
            <li key={i}>{perm}</li>
          ))}
        </ul>
      ),
    },
  ];

  const actions = [
    {
      title: "View",
      icon: faEye,
      onClick: (role) => {
        setSelectedRole(role);
        setIsEditing(false);
        setShowForm(true);
      },
    },
    {
      title: "Edit",
      icon: faEdit,
      onClick: (role) => {
        setSelectedRole(role);
        setIsEditing(true);
        setShowForm(true);
      },
    },
    {
      title: "Delete",
      icon: faTrash,
      color: "red",
      onClick: (role) => {
        setRoleToDelete(role);
        setShowDeleteConfirm(true);
      }
    }

  ];

  const bulkActions = [
    {
      label: "Delete Selected",
      icon: faTrash,
      onClick: (ids) => {
        setBulkToDelete(ids);
        setShowBulkConfirm(true);
      },
    },
  ];


  return (
    <>
      <DynamicTable
        title="Roles"
        columns={columns}
        rows={roles}
        selectable
        pageSize={8}
        rowActions={actions}
        bulkActions={bulkActions}
        extraButtons={'Assign Role'}
        extrabuttonOnClcik={() => setOpen(true)}
        loading={loading}
      />

      <Popup open={showForm} onClose={() => setShowForm(false)}>
        <AuthForm
          title={isEditing ? "Edit Role" : "View Role"}
          subtitle={isEditing ? "Update role info below" : "Details (read-only)"}
          loading={loading}
          timer={timer}
          fields={roleFormFields}
          onSubmit={isEditing ? handleFormSubmit : (e) => { e.preventDefault(); setShowForm(false); }}
          submitText={isEditing ? "Update Role" : "Close"}
        />
      </Popup>
      <Popup open={open} onClose={() => setOpen(false)}>
        <AssignRole />
      </Popup>
      <Popup open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
        <NotifyForm
          icon={faTrash}
          heading="Confirm Deletion"
          title="Delete Role"
          description={`Are you sure you want to delete the role "${roleToDelete?.name}"?`}
          subDescription="This action cannot be undone."
          primaryButtonText="Delete"
          onPrimary={handleDeleteConfirmed}
          secondaryButtonText="Cancel"
          onSecondary={() => setShowDeleteConfirm(false)}
          iconClass="text-red-500 text-3xl"
          primaryButtonClass="cursor-pointer w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg mb-3"
        />
      </Popup>

      <Popup open={showBulkConfirm} onClose={() => setShowBulkConfirm(false)}>
        <NotifyForm
          icon={faTrash}
          heading="Confirm Deletion"
          title="Delete Multiple Roles"
          description={`Are you sure you want to delete ${bulkToDelete.length} roles?`}
          subDescription="This action cannot be undone."
          primaryButtonText="Delete"
          onPrimary={handleBulkDeleteConfirmed}
          secondaryButtonText="Cancel"
          onSecondary={() => setShowBulkConfirm(false)}
          iconClass="text-red-500 text-3xl"
          primaryButtonClass="cursor-pointer w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg mb-3"
        />
      </Popup>


    </>
  );
}
