import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_OVEROS_URL;
const REDIRECT_URL = import.meta.env.VITE_REDIRECT_URL;
const WORKFLOW_API_URL = import.meta.env.VITE_API_WORKFLOW_URL;

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

type CreateWorkflowFormData = {
  userPrompt: string;
  images: File[];
  userId: string;
};

const createWorkflow = async ({
  userPrompt,
  images,
  userId,
}: CreateWorkflowFormData) => {
  const formData = new FormData();
  formData.append("user_prompt", userPrompt);

  images.forEach((file) => {
    formData.append("images", file);
  });

  const response = await axios.post(
    `${WORKFLOW_API_URL}/run-workflow`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        "X-User-ID": userId,
      },
    }
  );

  return response.data;
};

export const useCreateWorkflow = () =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useMutation<any, Error, CreateWorkflowFormData>({
    mutationFn: createWorkflow,
  });

const intent = async ({ prompt }: { prompt: string }) => {
  const params = new URLSearchParams();
  params.append("prompt", prompt);
  console.log(params.get("prompt"));
  const response = await axios.post("/api/intent", params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data;
};

export const useIntent = () =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useMutation<any, Error, { prompt: string }>({
    mutationFn: intent,
  });

const chat = async ({ prompt }: { prompt: string }) => {
  const params = new URLSearchParams();
  params.append("prompt", prompt);
  const response = await axios.post("/api/chat", params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data;
};

export const useChat = () =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useMutation<any, Error, { prompt: string }>({
    mutationFn: chat,
  });
