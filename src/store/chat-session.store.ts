import api from "@/utils/apis/axios.interceptor";
import { create } from "zustand";

interface ChatMessage {
  id: string;
  content: string;
}

interface ChatState {
  sessions: {
    [sessionId: number]: {
      loading: boolean;
      data: ChatMessage[]; // or generated text, depends on API response
      error: string | null;
    };
  };
  sendMessage: (sessionId: number, message: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  sessions: {},

  sendMessage: async (sessionId, message) => {
    // 1. Mark session as loading
    set((state) => ({
      sessions: {
        ...state.sessions,
        [sessionId]: {
          ...(state.sessions[sessionId] || { data: [], error: null }),
          loading: true,
        },
      },
    }));

    try {
      const response = await api.post(`/chat-messages/`, {
        session: sessionId,
        message,
      });

      // 2. Save result
      set((state) => ({
        sessions: {
          ...state.sessions,
          [sessionId]: {
            loading: false,
            error: null,
            data: [...(state.sessions[sessionId]?.data || []), response.data],
          },
        },
      }));
    } catch (err: any) {
      // 3. Save error
      set((state) => ({
        sessions: {
          ...state.sessions,
          [sessionId]: {
            ...(state.sessions[sessionId] || { data: [] }),
            loading: false,
            error: err.message || "Something went wrong",
          },
        },
      }));
    }
  },
}));
