import { useState, useEffect } from 'react';
import AuthForm from '@/src/components/template/AuthForm';
import { faUserShield } from '@fortawesome/free-solid-svg-icons';
import { createRole, getRoles } from '@/services/authService';
import { toast } from 'react-toastify';

const availablePermissions = [
  "view_leads",
  "view_archive_leads",
  "view_users",
  "view_roles",
  "user_dashboard",
  "delete_leads",
  "register_user",
  "admin_dashboard"
];

export default function CreateRole() {
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [errors, setErrors] = useState({});
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({
    name: '',
    permissions: [],
  });
  const [globalError, setGlobalError] = useState('');

  const handleChange = (name, value) => setForm(f => ({ ...f, [name]: value }));

  const handleCreateRole = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setGlobalError('');
    try {
      await createRole(form);
      setForm({ name: '', permissions: [] });
      setTimer(2);
      getRoles().then(res => setRoles(res.data));
      toast.success('Role created successfully!');
      setTimeout(() => setLoading(false), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      setErrors({ form: errorMsg });
      setGlobalError(errorMsg);
      toast.error(errorMsg);
      setLoading(false);
    }
  };

  const createRoleFields = [
    {
      name: 'name',
      label: 'Role Name',
      type: 'text',
      value: form.name,
      onChange: e => handleChange('name', e.target.value),
      icon: faUserShield,
      required: true,
      placeholder: 'e.g. Admin',
    },
    {
      name: 'permissions',
      label: 'Select Permissions',
      type: 'checkbox-group',
      value: form.permissions,
      onToggle: (permission) => {
        setForm(f => ({
          ...f,
          permissions: f.permissions.includes(permission)
            ? f.permissions.filter(p => p !== permission)
            : [...f.permissions, permission],
        }));
      },
      options: availablePermissions.map(p => ({ label: p, value: p })),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-text p-4">
      <div className="w-full max-w-lg">
        {globalError && (
          <div className="mb-4 text-red-600 font-semibold text-center border border-red-200 bg-red-50 rounded p-2">
            {globalError}
          </div>
        )}
        <AuthForm
          title="Create Role"
          fields={createRoleFields}
          loading={loading}
          timer={timer}
          errors={errors}
          onSubmit={handleCreateRole}
          submitText="Create Role"
        />
      </div>
    </div>
  );
}
