// src/pages/_app.js
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getCurrentUser } from '@/utils/userApi';
import './globals.css';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Define themes for specific routes
    const themeMap = {
      '/': 'light',
    };

    const theme = themeMap[router.pathname] || 'light';
    document.documentElement.setAttribute('data-theme', theme);

    const publicPaths = ['/auth/login']; 

    async function checkAuth() {
      try {
        const user = await getCurrentUser();
        console.log('Logged-in user:', user);
      } catch (error) {
        console.warn('User not authenticated');

        if (!publicPaths.includes(router.pathname)) {
          router.replace('/auth/login');
        }
      }
    }

    checkAuth();


  }, [router.pathname]);

  return (
    <>
      <Component {...pageProps} />
      <ToastContainer />
    </>
  );
}
