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

export interface SmartPostPayload {
  user_id: string;
  user_prompt: string;
  image_files?: File[];
  urls?: string[];
}

export const createSmartPost = async ({
  user_id,
  user_prompt,
  image_files,
  urls,
}: SmartPostPayload) => {
  const formData = new FormData();
  formData.append("user_prompt", user_prompt);

  if (image_files?.length) {
    image_files.forEach((file) => formData.append("image_files", file));
  }

  if (urls?.length) {
    urls.forEach((url) => formData.append("urls", url));
  }

  const response = await axios.post(
    `${API_WORKFLOW_URL}/linkedin/api/users/${user_id}/smart_post`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const useCreateSmartPost = () => {
  return useMutation({
    mutationFn: (payload: SmartPostPayload) => createSmartPost(payload),
  });
};
