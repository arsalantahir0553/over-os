import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_OVEROS_URL;
const REDIRECT_URL = import.meta.env.VITE_REDIRECT_URL;

type AuthUrlResponse = {
  auth_url: string; // Update this if your backend returns something different
  state: string;
};

const getQBAuthUrl = async (): Promise<AuthUrlResponse> => {
  const response = await axios.get<AuthUrlResponse>(
    `${API_BASE_URL}/oauth/user/auth?redirect_uri=${REDIRECT_URL}`
  );
  return response.data;
};

export const useQBLogin = () =>
  useMutation<AuthUrlResponse, Error, void>({
    mutationFn: getQBAuthUrl,
  });
