import api from "@/utils/apis/axios.interceptor";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ChatMessage {
  id: string;
  content: string;
  message_type: "user" | "system";
  timestamp?: string;
}

interface SessionState {
  loading: boolean;
  data: ChatMessage[];
  error: string | null;
  scheduleData: any | null;
  manualScheduleData: any | null;
  showManualScheduler: boolean;
  loadingMessage: string | null;
  lastUpdated: number | null;
}

interface ChatState {
  sessions: {
    [sessionId: number]: SessionState;
  };
  activeSessionId: number | null;

  // Actions
  sendMessage: (sessionId: number, message: string) => Promise<void>;
  setActiveSession: (sessionId: number | null) => void;
  updateSessionData: (
    sessionId: number,
    updates: Partial<SessionState>
  ) => void;
  clearSession: (sessionId: number) => void;
  clearAllSessions: () => void;

  // Schedule management
  updateScheduleData: (sessionId: number, scheduleData: any) => void;
  updateManualScheduleData: (sessionId: number, scheduleData: any) => void;
  setShowManualScheduler: (sessionId: number, show: boolean) => void;

  // Loading state management
  setLoading: (sessionId: number, loading: boolean) => void;
  setLoadingMessage: (sessionId: number, message: string | null) => void;
  setError: (sessionId: number, error: string | null) => void;

  // Response management
  setGeneratedText: (sessionId: number, text: string) => void;
  setUserPrompt: (sessionId: number, prompt: string) => void;
}

const API_WORKFLOW_URL = import.meta.env.VITE_DJANGO_URL;

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      sessions: {},
      activeSessionId: null,

      sendMessage: async (sessionId, message) => {
        const currentState = get();
        const session = currentState.sessions[sessionId] || {
          loading: false,
          data: [],
          error: null,
          scheduleData: null,
          manualScheduleData: null,
          showManualScheduler: false,
          loadingMessage: null,
          lastUpdated: null,
        };

        // 1. Mark session as loading
        set((state) => ({
          sessions: {
            ...state.sessions,
            [sessionId]: {
              ...session,
              loading: true,
              loadingMessage:
                "Just a moment — we're working on something great for you…",
              lastUpdated: Date.now(),
            },
          },
        }));

        try {
          const response = await api.post(
            `${API_WORKFLOW_URL}/chat-messages/`,
            {
              session: sessionId,
              message,
            }
          );

          // 2. Save result
          set((state) => ({
            sessions: {
              ...state.sessions,
              [sessionId]: {
                ...state.sessions[sessionId]!,
                loading: false,
                error: null,
                loadingMessage: null,
                data: [
                  ...session.data,
                  {
                    id: Date.now().toString(),
                    content: message,
                    message_type: "user",
                  },
                  {
                    id: (Date.now() + 1).toString(),
                    content: response.data.content,
                    message_type: "system",
                  },
                ],
                lastUpdated: Date.now(),
              },
            },
          }));
        } catch (err: any) {
          // 3. Save error
          set((state) => ({
            sessions: {
              ...state.sessions,
              [sessionId]: {
                ...state.sessions[sessionId]!,
                loading: false,
                error: err.message || "Something went wrong",
                loadingMessage: null,
                lastUpdated: Date.now(),
              },
            },
          }));
        }
      },

      setActiveSession: (sessionId) => {
        set({ activeSessionId: sessionId });
      },

      updateSessionData: (sessionId, updates) => {
        set((state) => ({
          sessions: {
            ...state.sessions,
            [sessionId]: {
              ...(state.sessions[sessionId] || {
                loading: false,
                data: [],
                error: null,
                scheduleData: null,
                manualScheduleData: null,
                showManualScheduler: false,
                loadingMessage: null,
                lastUpdated: null,
              }),
              ...updates,
              lastUpdated: Date.now(),
            },
          },
        }));
      },

      clearSession: (sessionId) => {
        set((state) => {
          const newSessions = { ...state.sessions };
          delete newSessions[sessionId];
          return { sessions: newSessions };
        });
      },

      clearAllSessions: () => {
        set({ sessions: {} });
      },

      updateScheduleData: (sessionId, scheduleData) => {
        set((state) => ({
          sessions: {
            ...state.sessions,
            [sessionId]: {
              ...(state.sessions[sessionId] || {
                loading: false,
                data: [],
                error: null,
                scheduleData: null,
                manualScheduleData: null,
                showManualScheduler: false,
                loadingMessage: null,
                lastUpdated: null,
              }),
              scheduleData,
              lastUpdated: Date.now(),
            },
          },
        }));
      },

      updateManualScheduleData: (sessionId, scheduleData) => {
        set((state) => ({
          sessions: {
            ...state.sessions,
            [sessionId]: {
              ...(state.sessions[sessionId] || {
                loading: false,
                data: [],
                error: null,
                scheduleData: null,
                manualScheduleData: null,
                showManualScheduler: false,
                loadingMessage: null,
                lastUpdated: null,
              }),
              manualScheduleData: scheduleData,
              lastUpdated: Date.now(),
            },
          },
        }));
      },

      setShowManualScheduler: (sessionId, show) => {
        set((state) => ({
          sessions: {
            ...state.sessions,
            [sessionId]: {
              ...(state.sessions[sessionId] || {
                loading: false,
                data: [],
                error: null,
                scheduleData: null,
                manualScheduleData: null,
                showManualScheduler: false,
                loadingMessage: null,
                lastUpdated: null,
              }),
              showManualScheduler: show,
              lastUpdated: Date.now(),
            },
          },
        }));
      },

      setLoading: (sessionId, loading) => {
        set((state) => ({
          sessions: {
            ...state.sessions,
            [sessionId]: {
              ...(state.sessions[sessionId] || {
                loading: false,
                data: [],
                error: null,
                scheduleData: null,
                manualScheduleData: null,
                showManualScheduler: false,
                loadingMessage: null,
                lastUpdated: null,
              }),
              loading,
              lastUpdated: Date.now(),
            },
          },
        }));
      },

      setLoadingMessage: (sessionId, message) => {
        set((state) => ({
          sessions: {
            ...state.sessions,
            [sessionId]: {
              ...(state.sessions[sessionId] || {
                loading: false,
                data: [],
                error: null,
                scheduleData: null,
                manualScheduleData: null,
                showManualScheduler: false,
                loadingMessage: null,
                lastUpdated: null,
              }),
              loadingMessage: message,
              lastUpdated: Date.now(),
            },
          },
        }));
      },

      setError: (sessionId, error) => {
        set((state) => ({
          sessions: {
            ...state.sessions,
            [sessionId]: {
              ...(state.sessions[sessionId] || {
                loading: false,
                data: [],
                error: null,
                scheduleData: null,
                manualScheduleData: null,
                showManualScheduler: false,
                loadingMessage: null,
                lastUpdated: null,
              }),
              error,
              lastUpdated: Date.now(),
            },
          },
        }));
      },

      setGeneratedText: (sessionId, text) => {
        set((state) => {
          const session = state.sessions[sessionId];
          if (!session) return state;

          const updatedData = [...session.data];
          const systemMessageIndex = updatedData.findIndex(
            (msg) => msg.message_type === "system"
          );

          if (systemMessageIndex !== -1) {
            updatedData[systemMessageIndex] = {
              ...updatedData[systemMessageIndex],
              content: text,
            };
          } else {
            updatedData.push({
              id: Date.now().toString(),
              content: text,
              message_type: "system",
            });
          }

          return {
            sessions: {
              ...state.sessions,
              [sessionId]: {
                ...session,
                data: updatedData,
                lastUpdated: Date.now(),
              },
            },
          };
        });
      },

      setUserPrompt: (sessionId, prompt) => {
        set((state) => {
          const session = state.sessions[sessionId];
          if (!session) return state;

          const updatedData = [...session.data];
          const userMessageIndex = updatedData.findIndex(
            (msg) => msg.message_type === "user"
          );

          if (userMessageIndex !== -1) {
            updatedData[userMessageIndex] = {
              ...updatedData[userMessageIndex],
              content: prompt,
            };
          } else {
            updatedData.push({
              id: Date.now().toString(),
              content: prompt,
              message_type: "user",
            });
          }

          return {
            sessions: {
              ...state.sessions,
              [sessionId]: {
                ...session,
                data: updatedData,
                lastUpdated: Date.now(),
              },
            },
          };
        });
      },
    }),
    {
      name: "chat-session-store",
      partialize: (state) => ({
        sessions: state.sessions,
        activeSessionId: state.activeSessionId,
      }),
    }
  )
);
