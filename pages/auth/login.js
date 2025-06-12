import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { loginUser } from '@/services/authService';
import { toast } from 'react-toastify';
import AuthForm from '@/src/components/template/AuthForm';
import { faEnvelope, faLock, faEye, faEyeSlash, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import NotifyForm from '@/src/components/template/NotifyForm';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const router = useRouter();
  const [accountLocked, setAccountLocked] = useState(false);
  const [notifyTitle, setNotifyTitle] = useState('');
  const [notifyDesc, setNotifyDesc] = useState('');
  const [notifySubDesc, setNotifySubDesc] = useState('');

  useEffect(() => {
    let interval;
    if (loading && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else if (timer === 0 && loading) {
      setLoading(false);
    }
    return () => clearInterval(interval);
  }, [loading, timer]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    setTimer(3);

    try {
      const { data } = await loginUser({ email, password });
      localStorage.setItem('token', data.token);
      await fetch('/api/auth/set-cookie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: data.token }),
      });
      toast.success('Login successful!');
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      setLoading(false);
      setTimer(0);
      if (errorMsg.toLowerCase().includes('locked')) {
        setAccountLocked(true);
        setNotifyTitle('Account Locked');
        setNotifyDesc('For your protection, your account has been temporarily locked after multiple failed login attempts.');
        setNotifySubDesc('Please try again later or contact support.');
      } else if (errorMsg.toLowerCase().includes('not active')) {
        setAccountLocked(true);
        setNotifyTitle('Your Account is Not Active');
        setNotifyDesc('Your account is not active yet.');
        setNotifySubDesc('Please contact support or try again later.');
      } else {
        setErrors({
          email: 'Please enter your email.',
          password: 'Incorrect email or password.',
          form: errorMsg
        });
        toast.error(errorMsg);
      }
      toast.error(errorMsg);
    }
  };

  if (accountLocked) {
    return (
      <NotifyForm
        icon={faTriangleExclamation}
        heading={notifyTitle}
        description={notifyDesc}
        subDescription={notifySubDesc}
        primaryButtonText="Contact Support"
        onPrimary={() => window.open('mailto:support@ottersiq.com', '_blank')}
        secondaryButtonText="Back to Login"
        secondaryButtonClass='cursor-pointer w-full border border-primary text-primary font-medium py-3 rounded-lg'
        primaryButtonClass="cursor-pointer w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-lg mb-3"
        onSecondary={() => {
          setAccountLocked(false);
          setEmail('');
          setPassword('');
          setErrors({});
        }}
      />
    );
  }

  return (
    <AuthForm
      title="Welcome to OTTERS IQ™"
      subtitle="AI-Powered Lead Intelligence Platform"
      fields={[
        {
          name: "email",
          label: "Email",
          type: "email",
          value: email,
          onChange: e => setEmail(e.target.value),
          placeholder: "name@company.com",
          required: true,
          disabled: false,
          icon: faEnvelope,
          autoComplete: "email",
        },
        {
          name: "password",
          label: "Password",
          sublabel: { text: "Forgot Password?", href: "/auth/forget-password" },
          type: "password",
          value: password,
          onChange: e => setPassword(e.target.value),
          placeholder: "••••••••",
          required: true,
          disabled: false,
          icon: faLock,
          hasToggle: true,
          showPassword: showPassword,
          onToggle: () => setShowPassword(prev => !prev),
          toggleIconShow: faEye,
          toggleIconHide: faEyeSlash,
          autoComplete: "current-password",
        }
      ]}
      loading={loading}
      timer={timer}
      errors={errors}
      onSubmit={handleLogin}
      submitText="Sign In"
      links={[]}
      bottomText="Don’t have an account?"
      bottomLinkText="Request Access"
      onBottomLink={() => router.push('/auth/request-access')}
    />
  );
}