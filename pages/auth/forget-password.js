import { useState } from 'react';
import { useRouter } from 'next/router';
import AuthForm from '@/src/components/template/AuthForm';
import NotifyForm from '@/src/components/template/NotifyForm';
import { faEnvelope, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { ForgetPassword } from '@/services/authService';
import { toast } from 'react-toastify';

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const { data } = await ForgetPassword({ email });
      toast.success(data.message || 'Password reset link sent to email');
      setLoading(false);
      setEmail('');
      setSent(true); // Show notify form
    } catch (err) {
      setLoading(false);
      if (err.response?.data?.message) {
        setErrors({ email: err.response.data.message });
        toast.error(err.response.data.message);
      } else {
        setErrors({ email: 'Something went wrong' });
        toast.error('Something went wrong');
      }
    }
  };

  if (sent) {
    return (
      <NotifyForm
        icon={faCheckCircle}
        iconClass="text-primary text-3xl"
        title="OTTERS IQ™"
        heading="Reset Link Sent"
        description="Check your inbox for instructions to reset your password."
        primaryButtonText="Back to Login"
        onPrimary={() => router.push('/auth/login')}
        primaryButtonClass="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg"
        secondaryButtonText=""
      />
    );
  }

  return (
    <AuthForm
      title="Reset Your Password"
      subtitle="We'll send a link to reset your password."
      fields={[
        {
          name: "email",
          label: "Email Address",
          type: "email",
          value: email,
          onChange: e => setEmail(e.target.value),
          placeholder: "name@company.com",
          required: true,
          disabled: false,
          icon: faEnvelope,
          autoComplete: "email",
        }
      ]}
      loading={loading}
      errors={errors}
      onSubmit={handleSubmit}
      submitText="Send Reset Link"
      links={[
        {
          text: "← Back to Login",
          onClick: () => router.push('/auth/login'),
          className: "cursor-pointer text-primary hover:underline mt-4 flex items-center justify-center w-full",
        }
      ]}
    />
  );
}