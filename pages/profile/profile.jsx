import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faEnvelope,
  faEdit,
  faTrash,
  faLock,
  faBuilding,
  faGlobe,
  faFlag,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import {
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
  resetCurrentUserPassword
} from '@/utils/userApi';
import { toast } from 'react-toastify';
import LogoutButton from '@/src/components/organism/LogoutButton';

const detailFields = [
  { key: 'status', label: 'Status', icon: faInfoCircle },
  { key: 'init_status', label: 'Initial Status', icon: faFlag },
  { key: 'intent', label: 'Intent', icon: faLock },
  { key: 'source', label: 'Source', icon: faGlobe },
  { key: 'region', label: 'Region', icon: faGlobe },
  { key: 'company_size', label: 'Company Size', icon: faBuilding },
];

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
const IconClass = "p-1.5 text-sm rounded";
const IconStyle = { background: 'var(--bg-light-primary)', color: 'var(--color-primary)' };

  useEffect(() => {
    getCurrentUser().then(data => {
      setUser(data);
      setForm(data);
    });
  }, []);

  const handleUpdate = async () => {
    if (!form.username || !form.email) {
      toast.error('Username and Email are required.');
      return;
    }
    setLoading(true);
    try {
      const data = await updateCurrentUser(form);
      setUser(data);
      setEdit(false);
      toast.success('Profile Update Successfully')
    } catch (e) {
      toast.error(e.response?.data?.message || 'Update failed');
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account?')) return;
    setLoading(true);
    try {
      await deleteCurrentUser();
      toast.success('Account deleted');
      window.location.href = '/auth/login';
    } catch (e) {
      toast.error(e.response?.data?.message || 'Delete failed');
    }
    setLoading(false);
  };

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      await resetCurrentUserPassword(passwords);
      toast.success('Password updated');
      setPasswords({ oldPassword: '', newPassword: '' });
    } catch (e) {
      toast.error(e.response?.data?.message || 'Password reset failed');
    }
    setLoading(false);
  };

  if (!user) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center py-10">
      <div className="flex gap-8 w-full max-w-5xl relative">
        {/* Profile Card */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center relative">
          <img
            src={user.logo || '/default-avatar.png'}
            alt="User Logo"
            className="w-28 h-28 rounded-full border-4 object-cover shadow mb-4" style={{ borderColor: 'var(--color-primary)' }}
          />
          <div className="w-full">
            <h2 className="text-lg font-semibold text-gray-800 mb-1 flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} className={IconClass} style={IconStyle} />
              {edit ? (
                <div className="flex flex-col w-full">
                  <label className="text-xs text-gray-500 mb-1">Username</label>
                  <input
                    className="border-b border-gray-300 focus:outline-none px-2 py-1 w-2/3"
                    value={form.username}
                    onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                    required
                  />
                </div>
              ) : (
                user.username
              )}
            </h2>
            <div className="text-gray-500 mb-2 flex items-center gap-2">
              <FontAwesomeIcon icon={faEnvelope} className={IconClass} style={IconStyle} />
              {edit ? (
                <div className="flex flex-col w-full">
                  <label className="text-xs text-gray-500 mb-1">Email</label>
                  <input
                    className="border-b border-gray-300 focus:outline-none px-2 py-1 w-2/3"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    required
                  />
                </div>
              ) : (
                user.email
              )}
            </div>
            {edit && (
              <>
                <div className="mb-2 flex flex-col">
                  <label className="text-xs text-gray-500 mb-1">Logo URL</label>
                  <input
                    className="border-b border-gray-300 focus:outline-none px-2 py-1 w-full"
                    value={form.logo}
                    onChange={e => setForm(f => ({ ...f, logo: e.target.value }))}
                    placeholder="Logo URL"
                  />
                </div>
                <div className="mb-2 flex flex-col">
                  <label className="text-xs text-gray-500 mb-1">Industry Tag</label>
                  <input
                    className="border-b border-gray-300 focus:outline-none px-2 py-1 w-full"
                    value={form.industry_tag}
                    onChange={e => setForm(f => ({ ...f, industry_tag: e.target.value }))}
                    placeholder="Industry Tag"
                  />
                </div>
                <div className="mb-2 flex flex-col">
                  <label className="text-xs text-gray-500 mb-1">Type</label>
                  <input
                    className="border-b border-gray-300 focus:outline-none px-2 py-1 w-full"
                    value={form.type}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                    placeholder="Type"
                  />
                </div>
              </>
            )}
            <div className="flex gap-3 mt-4 absolute bottom-[40px] items-center w-full">
              {edit ? (
                <>
                  <button
                    className="bg-[#f7b731] cursor-pointer text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-[#e2a500] transition"
                    onClick={handleUpdate}
                    disabled={loading}
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    <FontAwesomeIcon icon={faEdit} /> Save
                  </button>
                  <button
                    className="bg-gray-200 cursor-pointer text-gray-700 px-6 py-2 rounded-full font-semibold shadow hover:bg-gray-300 transition"
                    onClick={() => setEdit(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="bg-[#f7b731] cursor-pointer text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-[#e2a500] transition"
                    onClick={() => setEdit(true)}
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    <FontAwesomeIcon icon={faEdit} /> Edit
                  </button>
                  <button
                    className="bg-red-500 cursor-pointer  text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-red-600 transition"
                    onClick={handleDelete}
                  >
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </button>
                  <LogoutButton/>
                </>
              )}
            </div>
          </div>
        </div>
        {/* Additional Details & Password Card */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-8 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            Additional Details
          </h3>
          <div className="flex-1 space-y-3">
            {detailFields.map(({ key, label, icon }) => (
              <div key={key} className="flex items-center gap-3">
                <FontAwesomeIcon icon={icon} className={IconClass} style={IconStyle} />
                <span className="w-40 text-gray-600">{label}:</span>
                {edit ? (
                  <div className="flex flex-col flex-1">
                    <label className="text-xs text-gray-500 mb-1">{label}</label>
                    <input
                      className="border-b border-gray-300 focus:outline-none px-2 py-1"
                      value={form[key] || ''}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    />
                  </div>
                ) : (
                  <span className="flex-1 text-gray-800">{user[key] || '-'}</span>
                )}
              </div>
            ))}
          </div>
          {/* Password Reset */}
          <div className="mt-8">
            <h4 className="text-md font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <FontAwesomeIcon icon={faLock} className={IconClass} style={IconStyle} />
              Reset Password
            </h4>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-[#00A3CF]"
              type="password"
              placeholder="Old Password"
              value={passwords.oldPassword}
              onChange={e => setPasswords(p => ({ ...p, oldPassword: e.target.value }))}
            />
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-[#00A3CF]"
              type="password"
              placeholder="New Password"
              value={passwords.newPassword}
              onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))}
            />
            <button
              className="text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-[#e2a500] transition w-full cursor-pointer" style={{ backgroundColor: 'var(--color-primary)' }}
              onClick={handleResetPassword}
              disabled={loading}
            >
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}