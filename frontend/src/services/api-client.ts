import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request Interceptors for JWT auth header injects
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptors mapping uniform backend wrappers
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      success: false,
      message: error.response?.data?.message || 'Something went wrong. Please try again.',
      data: error.response?.data || null,
    };
    return Promise.reject(customError);
  },
);
