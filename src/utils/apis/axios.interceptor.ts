import axios from "axios";
import { refreshLinkedinToken } from "./linkedin.api";

const API_WORKFLOW_URL = import.meta.env.VITE_API_OVEROS_URL;

const api = axios.create({
  baseURL: API_WORKFLOW_URL,
});

// Attach access token before each request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("linkedin_access_token");
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
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("linkedin_refresh_token")
    ) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshLinkedinToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest); // Retry original request
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
