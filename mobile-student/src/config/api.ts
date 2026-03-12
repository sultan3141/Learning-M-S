import axios from 'axios';

// IMPORTANT: Update this with your computer's actual IP address for physical device testing
const COMPUTER_IP = '10.232.97.219';

// Determine if we're running on web or native
const isWeb = typeof window !== 'undefined' && window.location;

// Use localhost for web, computer IP for native devices
export const API_BASE_URL = isWeb
  ? 'http://localhost:4000'
  : `http://${COMPUTER_IP}:4000`;

// Log the current API URL to help with debugging
console.log('[API] Base URL:', API_BASE_URL);

// Create a centralized axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
});

// We'll inject the logout function from useAuthStore to avoid circular dependencies
let logoutFn: (() => void) | null = null;
export const setLogoutFunction = (fn: () => void) => {
  logoutFn = fn;
};

// Request interceptor to attach token
api.interceptors.request.use(
  async (config) => {
    // Dynamically import to avoid circular dependency
    const { useAuthStore } = await import('../store/useAuthStore');
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('[API] 401 Unauthorized detected - clearing session');
      if (logoutFn) {
        logoutFn();
      }
    }
    return Promise.reject(error);
  }
);
