import { useState } from 'react';
import { useRouter } from 'next/router';
import AuthForm from '@/src/components/template/AuthForm';
import { faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { ResetPassword } from '@/services/authService';
import { toast } from 'react-toastify';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query;

  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const { data } = await ResetPassword({ token, newPassword });
      toast.success(data.message || 'Password reset successful');
      setLoading(false);
      setNewPassword('');
      setTimeout(() => router.push('/auth/login'), 2000);
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.message || 'Something went wrong';
      setErrors({ newPassword: msg });
      toast.error(msg);
    }
  };

  return (
    <AuthForm
      title="Set New Password"
      subtitle="Enter your new password below."
      fields={[
        {
          name: "newPassword",
          label: "New Password",
          type: "password",
          value: newPassword,
          onChange: e => setNewPassword(e.target.value),
          placeholder: "Enter new password",
          required: true,
          disabled: false,
          icon: faLock,
          hasToggle: true,
          showPassword: showPassword,
          onToggle: () => setShowPassword(prev => !prev),
          toggleIconShow: faEye,
          toggleIconHide: faEyeSlash,
          autoComplete: "new-password",
        }
      ]}
      loading={loading}
      errors={errors}
      onSubmit={handleSubmit}
      submitText="Reset Password"
      links={[
        {
          text: "← Back to Login",
          onClick: () => router.push('/auth/login'),
          className: "text-primary hover:underline mt-4 flex items-center justify-center w-full",
        }
      ]}
    />
  );
}