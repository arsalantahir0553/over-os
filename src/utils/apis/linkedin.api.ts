import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_WORKFLOW_URL = import.meta.env.VITE_API_OVEROS_URL;

export const buildLinkedinAuthUrl = (): string => {
  const base = "https://www.linkedin.com/oauth/v2/authorization";

  const params = new URLSearchParams({
    response_type: "code",
    client_id: import.meta.env.VITE_LINKEDIN_CLIENT_ID!,
    redirect_uri: import.meta.env.VITE_LINKEDIN_REDIRECT_URI!,
    scope: import.meta.env.VITE_LINKEDIN_SCOPE!,
    // state: import.meta.env.VITE_LINKEDIN_STATE!,
  });

  return `${base}?${params.toString()}`;
};

export const getLinkedinAuthUrl = async () => {
  const response = await axios.get(`${API_WORKFLOW_URL}/linkedin/api/`);
  return response.data;
};

export const useGetLinkedinAuthUrl = () => {
  return useQuery({
    queryKey: ["linkedin-auth"],
    queryFn: () => getLinkedinAuthUrl(),
    enabled: false,
  });
};

export const getLinkedinDetails = async (code: string, state: string) => {
  const response = await axios.get(`${API_WORKFLOW_URL}/linkedin/api/getID`, {
    params: { code, state },
  });
  return response.data;
};

export const useGetLinkedinDetails = (code: string, state: string) => {
  return useQuery({
    queryKey: ["linkedin-details", code, state],
    queryFn: () => getLinkedinDetails(code, state),
    enabled: !!code && !!state,
  });
};

export interface GeneratePostPayload {
  user_id: string;
  user_prompt: string;
  image_files?: File[];
  urls?: string[];
}

export const generateLinkedinPost = async ({
  user_id,
  user_prompt,
  image_files = [],
  urls = [],
}: GeneratePostPayload) => {
  const formData = new FormData();
  formData.append("user_prompt", user_prompt);

  image_files.forEach((file) => formData.append("image_files", file));
  urls.forEach((url) => formData.append("urls", url));

  const response = await axios.post(
    `${API_WORKFLOW_URL}/linkedin/api/users/${user_id}/generate_posts`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const useGenerateLinkedinPrompt = () => {
  return useMutation({
    mutationFn: (payload: GeneratePostPayload) => generateLinkedinPost(payload),
  });
};
export interface PublishPostPayload {
  user_id: string;
  user_prompt: string;
  post: {
    text: string;
    image_path?: string | null; // Changed from string[] to string
    url?: string | null;
  };
}

export const publishLinkedinPost = async ({
  user_id,
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
    const response = await axios.post(
      `${API_WORKFLOW_URL}/linkedin/api/users/${user_id}/publish_posts`,
      formData.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
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

export const detectIntentFromPrompt = async (
  prompt: string
): Promise<"chat" | "linkedin" | "linkedin_no_topic"> => {
  const params = new URLSearchParams();
  params.append("prompt", prompt);

  const response = await axios.post(
    `${API_WORKFLOW_URL}/linkedin/api/intent`,
    params.toString(), // Send as form-urlencoded string
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return response.data.intent;
};

export const useDetectIntent = () => {
  return useMutation({
    mutationFn: (prompt: string) => detectIntentFromPrompt(prompt),
  });
};
