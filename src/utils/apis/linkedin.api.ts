import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import api from "./axios.interceptor";

const API_WORKFLOW_URL = import.meta.env.VITE_API_OVEROS_URL;

export const getLinkedinAuthUrl = async () => {
  const response = await api.get(`/`);
  return response.data;
};

export const useGetLinkedinAuthUrl = () => {
  return useQuery({
    queryKey: ["linkedin-auth"],
    queryFn: () => getLinkedinAuthUrl(),
    enabled: false,
  });
};

// 👇 Update the payload interface based on Swagger schema
export interface GeneratePostPayload {
  prompt: string;
}

export const generateLinkedinPost = async ({ prompt }: GeneratePostPayload) => {
  const response = await api.post(
    `/linkedin-generate-post?prompt=${encodeURIComponent(prompt)}`,
    {}, // ✅ empty body
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  console.log("checking response", response.data);
  return response.data;
};

export const useGenerateLinkedinPrompt = () => {
  return useMutation({
    mutationFn: (payload: GeneratePostPayload) => generateLinkedinPost(payload),
  });
};

export interface PublishPostPayload {
  user_prompt: string;
  post: {
    text: string;
    image_path?: string | null; // Changed from string[] to string
    url?: string | null;
  };
}

export const publishLinkedinPost = async ({
  user_prompt,
  post,
}: PublishPostPayload) => {
  const formattedPost = {
    ...post,
    image_path:
      typeof post.image_path === "string"
        ? post.image_path
        : post.image_path?.[0] || "",
  };

  const formData = new URLSearchParams();
  formData.append("post", JSON.stringify(formattedPost));
  formData.append("user_prompt", user_prompt);

  console.log("Final payload:", formData.toString());

  try {
    const response = await api.post(`/publish_posts`, formData.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const usePublishGeneratedPost = () => {
  return useMutation({
    mutationFn: (payload: PublishPostPayload) => publishLinkedinPost(payload),
  });
};

// =====================================
// Auth routes
// =====================================

export const refreshLinkedinToken = async () => {
  const refreshToken = localStorage.getItem("linkedin_refresh_token");

  if (!refreshToken) {
    throw new Error("No refresh token available.");
  }

  try {
    const response = await axios.post(
      `${API_WORKFLOW_URL}/auth/refresh`,
      { refresh_token: refreshToken },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const { access_token, refresh_token: newRefreshToken } = response.data;

    localStorage.setItem("linkedin_access_token", access_token);
    if (newRefreshToken) {
      localStorage.setItem("linkedin_refresh_token", newRefreshToken);
    }

    return access_token;
  } catch (error) {
    console.error("⚠️ Refresh token failed:", error);
    // Logout logic here if refresh fails
    localStorage.removeItem("linkedin_access_token");
    localStorage.removeItem("linkedin_refresh_token");
    localStorage.removeItem("linkedin_user_id");
    localStorage.removeItem("linkedin_status");
    localStorage.removeItem("linkedin_token_type");
    window.location.href = "/workflow/linkedin"; // or navigate("/login")
    throw error;
  }
};
