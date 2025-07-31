// utils/withAuthorization.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getCurrentUser } from '@/utils/userApi';

const withAuthorization = (WrappedComponent, requiredPermission) => {
  return function WithAuth(props) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
      const checkAuth = async () => {
        const user = await getCurrentUser();
        if (user?.permissions.includes(requiredPermission)) {
          setAuthorized(true);
        } else {
          router.replace('/unauthorized');
        }
      };
      checkAuth();
    }, []);

    if (!authorized) return null;
    return <WrappedComponent {...props} />;
  };
};

export default withAuthorization;
