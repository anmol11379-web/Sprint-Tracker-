import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const serverMessage = error.response?.data?.message;
    const message =
      serverMessage ||
      (error.code === 'ECONNABORTED'
        ? 'Request timed out. Please check your connection and try again.'
        : error.message === 'Network Error'
          ? 'Unable to reach the server. Please verify the backend is running.'
          : 'Something went wrong. Please try again.');

    const normalizedError = new Error(message);
    normalizedError.status = error.response?.status ?? 0;
    return Promise.reject(normalizedError);
  }
);

export default api;

