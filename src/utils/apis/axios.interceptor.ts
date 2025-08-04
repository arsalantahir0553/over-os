import axios from "axios";
import { refreshToken } from "./auth.api";

const API_WORKFLOW_URL = import.meta.env.VITE_API_OVEROS_URL;
const SIGNIN_URL = "/signin"; // Your signin route

const api = axios.create({
  baseURL: API_WORKFLOW_URL,
});

// Attach access token before request
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

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and refresh token exists, try refreshing
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refresh_token")
    ) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest); // Retry the original request
      } catch (refreshError) {
        // Refresh failed → logout
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        window.location.href = SIGNIN_URL;
        return Promise.reject(refreshError);
      }
    }

    // If no refresh token or already retried and still failed
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      window.location.href = SIGNIN_URL;
    }

    return Promise.reject(error);
  }
);

export default api;
