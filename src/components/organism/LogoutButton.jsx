import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { logoutCurrentUser } from '@/services/authService';
import { toast } from 'react-toastify';
import { useState } from 'react';
import LogoutConfirmModal from './LogoutConfirmModal';

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutCurrentUser();
      toast.success('Logged out successfully');
      window.location.href = '/auth/login';
    } catch (e) {
      toast.error(e.response?.data?.message || 'Logout failed');
    }
    setLoading(false);
  };

  return (
    <>
      <button
        className="cursor-pointer bg-red-500 text-white px-4 py-2 rounded-full font-semibold shadow hover:bg-red-600 transition flex items-center gap-2"
        onClick={() => setOpenModal(true)}
        disabled={loading}
      >
        <FontAwesomeIcon icon={faSignOutAlt} />
        Logout
      </button>

      {/* Custom Logout Confirm Modal */}
      <LogoutConfirmModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
