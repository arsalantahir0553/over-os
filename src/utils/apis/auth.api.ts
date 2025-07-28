import { useMutation } from "@tanstack/react-query";
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
  const response = await axios.get(
    `http://localhost:3000/api/user/verify-email?email=${email}`
  );
  return response.data;
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: verifyEmail,
  });
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

// const getLoggedInUser = async () => {
//   const token = localStorage.getItem("token");
//   if (!token) {
//     throw new Error("No authentication token found");
//   }

//   try {
//     const response = await axios.get(`${API_BASE_URL}/user/me`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data;
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error: any) {
//     // Check for 401 Unauthorized
//     // if (
//     //   axios.isAxiosError(error) &&
//     //   error.response?.status === 401 &&
//     //   error.response?.data?.message === "Invalid or expired token"
//     // ) {
//     //   // Remove token and optionally reload or redirect
//     //   localStorage.removeItem("token");
//     //   window.location.href = "https://overos.xyz";
//     // }

//     throw error; // Let React Query handle the error
//   }
// };

// export const useLoggedInUser = () => {
//   return useQuery({
//     queryKey: ["loggedInUser"],
//     queryFn: getLoggedInUser,
//     enabled: !!localStorage.getItem("token"), // Only run if token exists
//   });
// };

const logoutUser = async () => {
  try {
    await axios.post(
      `${API_BASE_URL}/logout/`,
      {
        refresh_token: localStorage.getItem("refresh_token"),
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
const resetPassword = async (data: { token: string; newPassword: string }) => {
  const response = await axios.post(
    `${API_BASE_URL}/user/reset-password`,
    data
  );
  return response.data;
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
  });
};
