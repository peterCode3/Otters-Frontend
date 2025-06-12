import { useState } from 'react';
import { useEffect } from 'react';
import AuthForm from '@/src/components/template/AuthForm';
import { faUserShield, faUser, faList } from '@fortawesome/free-solid-svg-icons';
import {
  createRole,
  getRoles,
  assignRole,
  getUsers,
} from '@/services/authService';
import { toast } from 'react-toastify';

export default function RolesPage() {
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [errors, setErrors] = useState({});
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: '',
    permissions: '',
    userId: '',
    roleId: '',
  });
  const [globalError, setGlobalError] = useState(''); // <-- Add this

 useEffect(() => {
  const fetchData = async () => {
    try {
      const rolesRes = await getRoles();
      const usersRes = await getUsers();
      setRoles(rolesRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error('API error:', err);
      setGlobalError(
        err.response?.data?.message ||
        (err.response?.status === 401
          ? 'Access Denied: Unauthorized'
          : 'Failed to fetch data')
      );
    }
  };
  fetchData();
}, []);

  // Handle input changes
  const handleChange = (name, value) => setForm(f => ({ ...f, [name]: value }));

  // Create Role
  const handleCreateRole = async (e) => {
  e.preventDefault();
  setLoading(true);
  setErrors({});
  setGlobalError('');
  try {
    await createRole({
      name: form.name,
      permissions: form.permissions
        ? form.permissions.split(',').map(p => p.trim())
        : [],
    });
    setForm(f => ({ ...f, name: '', permissions: '' }));
    setTimer(2);
    getRoles().then(res => setRoles(res.data));
    toast.success('Role created successfully!');
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  } catch (err) {
    const errorMsg = err.response?.data?.message || err.message;
    setErrors({ form: errorMsg });
    setGlobalError(errorMsg);
    toast.error(errorMsg); // Show clear error in toast
    setLoading(false);
  }
};

  // Assign Role
  const handleAssignRole = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setGlobalError('');
    if (!form.userId || !form.roleId) {
      setErrors({ assign: 'User and Role required' });
      setLoading(false);
      return;
    }
    try {
      await assignRole({ userId: form.userId, roleId: form.roleId });
      setForm(f => ({ ...f, userId: '', roleId: '' }));
      setTimer(2);
      toast.success('Assign Role Successfully!');
        setTimeout(() => {
        setLoading(false);
        }, 3000);
    } catch (err) {
      setErrors({ assign: err.response?.data?.message || err.message });
      if (err.response?.status === 401) setGlobalError('Access Denied: Unauthorized');
      else setGlobalError(err.response?.data?.message || err.message);
        toast.error(err.response?.data?.message || err.message); 
      setLoading(false);

    }
  };

  // Fields for create role
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
      label: 'Permissions (comma separated)',
      type: 'text',
      value: form.permissions,
      onChange: e => handleChange('permissions', e.target.value),
      icon: faList,
      placeholder: 'e.g. read,write,delete',
    },
  ];

  // Fields for assign role
  const assignRoleFields = [
    {
      name: 'userId',
      label: 'User',
      type: 'select',
      value: form.userId,
      onChange: e => handleChange('userId', e.target.value),
      icon: faUser,
      options: [{ value: '', label: 'Select User' }, ...users.map(u => ({
        value: u._id,
        label: u.email || u.username,
      }))],
      required: true,
    },
    {
      name: 'roleId',
      label: 'Role',
      type: 'select',
      value: form.roleId,
      onChange: e => handleChange('roleId', e.target.value),
      icon: faUserShield,
      options: [{ value: '', label: 'Select Role' }, ...roles.map(r => ({
        value: r._id,
        label: r.name,
      }))],
      required: true,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-text p-4">
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
        <div className="my-8" />
        <AuthForm
          title="Assign Role to User"
          fields={assignRoleFields}
          loading={loading}
          timer={timer}
          errors={{ userId: errors.assign, roleId: errors.assign }}
          onSubmit={handleAssignRole}
          submitText="Assign Role"
        />
      </div>
    </div>
  );
}