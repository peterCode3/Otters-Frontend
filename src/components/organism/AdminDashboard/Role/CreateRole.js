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

export default function CreateRole() {
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [errors, setErrors] = useState({});
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({
    name: '',
    permissions: '',
    userId: '',
    roleId: '',
  });
  const [globalError, setGlobalError] = useState(''); // <-- Add this


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
      toast.error(errorMsg); 
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