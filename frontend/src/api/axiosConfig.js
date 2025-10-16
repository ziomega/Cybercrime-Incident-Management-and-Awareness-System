import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach JWT token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Track if we're currently refreshing the token
let isRefreshing = false;
// Store callbacks of requests that were made during refresh
let refreshSubscribers = [];

// Helper function to retry failed requests
const retryOriginalRequest = (callback) => {
  refreshSubscribers.push(callback);
};

// Function to notify all subscribers that token is refreshed
const onRefreshed = (token) => {
  refreshSubscribers.map(callback => callback(token));
  refreshSubscribers = [];
};

// Add a response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If we're already refreshing, wait for the new token
        return new Promise(resolve => {
          retryOriginalRequest(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refresh = localStorage.getItem('refreshToken');
        if (!refresh) {
          throw new Error('No refresh token available');
        }

        // Call refresh token endpoint
        const response = await axios.post(`${BASE_URL}/auth/refresh/`, {
          refresh: refresh
        });

        const { access } = response.data;
        localStorage.setItem('accessToken', access);
        
        // Update authorization header
        originalRequest.headers.Authorization = `Bearer ${access}`;
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access}`;
        
        // Notify all subscribers about new token
        onRefreshed(access);
        isRefreshing = false;
        
        // Retry original request
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        isRefreshing = false;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    } else if (error.response?.status === 403) {
      // Handle forbidden access (403)
      console.error('Access forbidden: You do not have permission to access this resource.');
    } else if (error.response?.status === 404) {
      // Handle not found errors
      console.error('Resource not found:', error.config.url);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;