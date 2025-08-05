import axios from 'axios';

// Replace with your URL
const BASE_URL = 'https://your-api.com/api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Request interceptor for attaching auth tokens
axiosInstance.interceptors.request.use(
  (config) => {
    // Example: Attach token from async storage/state
    // const token = ...;
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for global error handling
axiosInstance.interceptors.response.use(
  resp => resp,
  error => {
    // Optionally show a toast/alert or handle specific errors here
    if (error.response?.status === 401) {
      // Handle auth error, maybe log out
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;