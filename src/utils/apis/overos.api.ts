import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_OVEROS_URL;
const REDIRECT_URL = import.meta.env.VITE_REDIRECT_URL;

type AuthUrlResponse = {
  auth_url: string;
  state: string;
};

export const getQBAuthUrl = async (): Promise<AuthUrlResponse> => {
  const response = await axios.get<AuthUrlResponse>(
    `${API_BASE_URL}/oauth/user/auth?redirect_uri=${REDIRECT_URL}`
  );
  return response.data;
};

export const useQBLogin = () =>
  useMutation<AuthUrlResponse, Error, void>({
    mutationFn: getQBAuthUrl,
  });

type CallbackResponse = {
  user_id: string;
  realm_id: string;
};

type CallbackParams = {
  code: string;
  state: string;
  realmId: string;
};

const getCallbackData = async ({
  code,
  state,
  realmId,
}: CallbackParams): Promise<CallbackResponse> => {
  const response = await axios.get<CallbackResponse>(
    `${API_BASE_URL}/oauth/user/callback`,
    {
      params: {
        code,
        state,
        realmId,
        redirect_uri: REDIRECT_URL,
      },
    }
  );
  return response.data;
};

export const useGetUserId = () =>
  useMutation<CallbackResponse, Error, CallbackParams>({
    mutationFn: getCallbackData,
  });
