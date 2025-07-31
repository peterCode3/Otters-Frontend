import Popup from "./Popup";
import ArchivedNotifiy from "./LeadVault/ArchivedNotifiy";

export default function LogoutConfirmModal({ open, onClose, onConfirm }) {
  return (
    <Popup open={open} onClose={onClose}>
      <ArchivedNotifiy
        onAction={onConfirm}
        onclose={onClose}
        description="Are you sure you want to log out of your account?"
        heading="Confirm Logout"
        subDescription="You will be redirected to the login page."
        primaryButtonText="Logout"
      />
    </Popup>
  );
}
