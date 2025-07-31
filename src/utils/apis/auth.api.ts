import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_DJANGO_URL;

// Login API
const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await axios.post(`${API_BASE_URL}/login/`, credentials);
  return response.data;
};

export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};

// Signup API
const signupUser = async (userData: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}) => {
  const response = await axios.post(`${API_BASE_URL}/register/`, userData);
  return response.data;
};

export const useSignup = () => {
  return useMutation({
    mutationFn: signupUser,
  });
};

const verifyEmail = async (email: string) => {
  const response = await axios.post(`${API_BASE_URL}/user-check/`, {
    email,
  });
  return response.data;
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: verifyEmail,
  });
};

const verifyOtp = async ({ email, otp }: { email: string; otp: number }) => {
  const response = await axios.post(`${API_BASE_URL}/verify-email/`, {
    email,
    otp,
  });
  return response.data;
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: verifyOtp,
  });
};

export const refreshToken = async (): Promise<string> => {
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) throw new Error("No refresh token available.");

  const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
    refresh,
  });

  const { access, refresh: newRefresh } = response.data;

  // Optional: update tokens in localStorage
  localStorage.setItem("token", access);
  localStorage.setItem("refresh_token", newRefresh);

  return access; // ✅ return only the access token
};

const validateEmail = async ({
  token,
  email,
}: {
  token: string;
  email: string;
}) => {
  const response = await axios.post(`${API_BASE_URL}/user/validate-email`, {
    token,
    email,
  });
  return response.data;
};

export const useValidateEmail = () => {
  return useMutation({
    mutationFn: validateEmail,
  });
};

const getLoggedInUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/users/profile/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    localStorage.setItem(
      "is_linkedin_connected",
      response?.data?.data?.is_linkedin_connected
    );
    localStorage.setItem("user_id", response?.data?.data?.id);
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      error.response?.data?.message === "Invalid or expired token"
    ) {
      tempLogoutUser();
      window.location.href = "https://overos.xyz";
    }

    throw error; // Let React Query handle the error
  }
};

export const useLoggedInUser = () => {
  return useQuery({
    queryKey: ["loggedInUser"],
    queryFn: getLoggedInUser,
    enabled: !!localStorage.getItem("token"), // Only run if token exists
  });
};

const logoutUser = async () => {
  try {
    await axios.post(
      `${API_BASE_URL}/logout/`,
      {
        refresh: localStorage.getItem("refresh_token"),
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    tempLogoutUser();
  }
};

const tempLogoutUser = async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user_name");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("is_linkedin_connected");
  localStorage.removeItem("user_id");
};

export const useLogout = () => {
  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      window.location.href = "/signin"; // Redirect to home after logout
    },
  });
};

// Request Password Reset (send email)
const requestPasswordReset = async (email: string) => {
  const response = await axios.post(`${API_BASE_URL}/user/request-reset`, {
    email,
  });
  return response.data;
};

export const useRequestPasswordReset = () => {
  return useMutation({
    mutationFn: requestPasswordReset,
  });
};

// Reset Password (using token + new password)
// const resetPassword = async (data: { token: string; newPassword: string }) => {
//   const response = await axios.post(
//     `${API_BASE_URL}/user/reset-password`,
//     data
//   );
//   return response.data;
// };

// export const useResetPassword = () => {
//   return useMutation({
//     mutationFn: resetPassword,
//   });
// };

//new forgot password
const forgotPassword = async (email: string) => {
  const response = await axios.post(`${API_BASE_URL}/forgot-password/`, {
    email,
  });
  return response.data;
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
  });
};

const verifyPasswordOtp = async ({
  email,
  otp,
}: {
  email: string;
  otp: number;
}) => {
  const response = await axios.post(
    `${API_BASE_URL}/verify-password-reset-otp/`,
    {
      email,
      otp,
    }
  );
  return response.data;
};

export const useVerifyPasswordOtp = () => {
  return useMutation({
    mutationFn: verifyPasswordOtp,
  });
};

const resetPassword = async ({
  email,
  otp,
  new_password,
}: {
  email: string;
  otp: number;
  new_password: string;
}) => {
  const response = await axios.post(`${API_BASE_URL}/reset-password/`, {
    email,
    otp,
    new_password,
  });
  return response.data;
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
  });
};
