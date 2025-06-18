import { useQuery } from "@tanstack/react-query";
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
