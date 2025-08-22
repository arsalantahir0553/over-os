import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
    enabled: !!sessionId, // Only run when sessionId exists
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

interface ChatInput {
  message: string;
  session?: number;
}

const chat = async ({ message, session }: ChatInput) => {
  try {
    const payload: any = { message };
    if (session) {
      payload.session = session;
    }

    const response = await api.post(
      `${API_WORKFLOW_URL}/chat-messages/`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw error;
  }
};

export const useChat = (sessionId?: number) => {
  return useMutation({
    mutationKey: ["chat"],
    mutationFn: (data: { message: string }) =>
      chat({ ...data, session: sessionId }),
  });
};

interface UpdateSessionTitleInput {
  messageId: number;
  title: string;
}

const updateSessionTitle = async ({
  messageId,
  title,
}: UpdateSessionTitleInput) => {
  const response = await api.patch(
    `${API_WORKFLOW_URL}/chat-sessions/${messageId}/`,
    {
      title,
    }
  );
  return response.data;
};

export const useUpdateSessionTitle = () => {
  return useMutation({
    mutationFn: (data: UpdateSessionTitleInput) => updateSessionTitle(data),
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
