import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Global response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 && typeof window !== 'undefined') {
      // Auto redirect to login
    //   window.location.href = '/auth/login';
      return Promise.reject({ message: 'You do not have permission to access this resource.' });

    } else if (status === 403) {
      // Handle permissions
      return Promise.reject({ message: 'You do not have permission to access this resource.' });
    } else {
      return Promise.reject(error);
    }
  }
);

export default apiClient;
