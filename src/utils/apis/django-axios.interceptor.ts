import axios from "axios";

const API_WORKFLOW_URL = import.meta.env.VITE_DJANGO_URL;

const api = axios.create({
  baseURL: API_WORKFLOW_URL,
});

// Attach access token before each request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Refresh token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // const originalRequest = error.config;

    if (error.response?.status === 401) {
      // Clear all auth related data from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("is_linkedin_connected");
      localStorage.removeItem("user_name");

      // Redirect to login page
      window.location.href = "/signin";
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
