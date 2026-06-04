import axios from 'axios';

// Read a cookie value by name (used for the double-submit CSRF token).
const getCookie = (name) => {
  const match = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[2]) : null;
};

// Create an axios instance.
// `withCredentials` ensures the httpOnly auth cookie and the CSRF cookie are
// sent with every request (auth is cookie-based, not localStorage-based).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

const MUTATING_METHODS = ['post', 'put', 'patch', 'delete'];

// Request interceptor: attach the CSRF token header on state-changing requests.
api.interceptors.request.use(
  (config) => {
    if (MUTATING_METHODS.includes((config.method || '').toLowerCase())) {
      const csrfToken = getCookie('csrfToken');
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: on 401 (not authenticated), clear cached user and
// send the user to the login page. 403 (forbidden) is left to the caller.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      try {
        localStorage.removeItem('user');
      } catch (e) {
        /* ignore localStorage errors */
      }
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
