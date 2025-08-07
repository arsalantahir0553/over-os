import { useMutation, useQuery } from "@tanstack/react-query";
import api from "./axios.interceptor";

const API_WORKFLOW_URL = import.meta.env.VITE_DJANGO_URL;

const getAllChatSessions = async () => {
  const response = await api.get(`${API_WORKFLOW_URL}/chat-sessions/`);
  return response.data;
};

export const useGetAllChatSessions = () => {
  return useQuery({
    queryFn: () => getAllChatSessions(),
    queryKey: ["chat-sessions"],
  });
};

const getSessionChatMessages = async (sessionId: string) => {
  const response = await api.get(
    `${API_WORKFLOW_URL}/chat-sessions/${sessionId}`
  );
  return response.data;
};

export const useGetSessionChatMessages = (sessionId: string) => {
  return useQuery({
    queryFn: () => getSessionChatMessages(sessionId),
    queryKey: ["chat-sessions", sessionId],
  });
};

const createChatSession = async (title: string) => {
  const response = await api.post(`${API_WORKFLOW_URL}/chat-sessions/`, {
    title,
  });
  return response;
};

export const useCreateChatSession = () => {
  return useMutation({
    mutationFn: (title: string) => createChatSession(title),
  });
};

interface chatInput {
  session: number;
  message: string;
}

const chat = async ({ session, message }: chatInput) => {
  const response = await api.post(`${API_WORKFLOW_URL}/chat-messages/`, {
    session,
    message,
  });
  return response.data;
};

export const useChat = () => {
  return useMutation({
    mutationFn: (data: chatInput) => chat(data),
  });
};

interface UpdateChatMessageInput {
  messageId: number;
  session: number;
  message: string;
}

const updateChatMessage = async ({
  messageId,
  session,
  message,
}: UpdateChatMessageInput) => {
  const response = await api.patch(
    `${API_WORKFLOW_URL}/chat-messages/${messageId}/`,
    {
      session,
      message,
    }
  );
  return response.data;
};

export const useUpdateChatMessage = () => {
  return useMutation({
    mutationFn: (data: UpdateChatMessageInput) => updateChatMessage(data),
  });
};
