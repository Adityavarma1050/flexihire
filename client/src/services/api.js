import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://flexihire-knw5.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to get token (prefers tab-isolated sessionStorage first)
const getToken = () => {
  return sessionStorage.getItem('flexihire_token') || localStorage.getItem('flexihire_token');
};

// Attach JWT token to requests automatically
API.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for session expiration
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem('flexihire_token');
      sessionStorage.removeItem('flexihire_user');
      localStorage.removeItem('flexihire_token');
      localStorage.removeItem('flexihire_user');
    }
    return Promise.reject(error);
  }
);

export default API;
