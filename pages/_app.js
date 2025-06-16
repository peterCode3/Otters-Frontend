// src/pages/_app.js
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import './globals.css'; // Ensure global styles are imported
export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Define themes for specific routes
    const themeMap = {
      '/': 'light',
    };

    const theme = themeMap[router.pathname] || 'light';
    document.documentElement.setAttribute('data-theme', theme);
  }, [router.pathname]);

  return (
    <>
      <Component {...pageProps} />
      <ToastContainer />
    </>
  );
}
