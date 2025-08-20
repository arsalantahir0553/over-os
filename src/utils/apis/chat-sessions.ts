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
}

const chat = async (sessionId: number, { message }: ChatInput) => {
  const response = await api.post(`${API_WORKFLOW_URL}/chat-messages/`, {
    session: sessionId,
    message,
  });
  return response.data;
};

export const useChat = (sessionId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["chat", sessionId],
    mutationFn: (data: ChatInput) => chat(sessionId, data),
    onMutate: async (variables) => {
      // 👀 Optimistically put something in cache so UI can show "loading"
      queryClient.setQueryData(["chat", sessionId], (old: any) => ({
        ...old,
        status: "loading",
        message: variables.message,
      }));
    },
    onSuccess: (data) => {
      // 👀 Store response in cache so it’s still there when you navigate back
      queryClient.setQueryData(["chat", sessionId], {
        status: "success",
        data,
      });
    },
    onError: (error) => {
      queryClient.setQueryData(["chat", sessionId], {
        status: "error",
        error,
      });
    },
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
