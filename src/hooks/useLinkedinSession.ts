import { useCallback, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useChatStore } from "@/store/chat-session.store";
import { useChatSession } from "@/context/ChatSessionContext";

export const useLinkedinSession = () => {
  const { sessionId } = useParams();
  const sessionIdNum = sessionId ? Number(sessionId) : null;

  const { activeSessionId, setActiveSessionId } = useChatSession();
  const {
    sessions,
    sendMessage,
    setActiveSession,
    updateSessionData,
    setLoading,
    setLoadingMessage,
    setError,
    setGeneratedText,
    setUserPrompt,
    updateScheduleData,
    updateManualScheduleData,
    setShowManualScheduler,
    clearSession,
  } = useChatStore();

  // Get current session data
  const currentSession = useMemo(() => {
    if (!sessionIdNum) return null;
    return (
      sessions[sessionIdNum] || {
        loading: false,
        data: [],
        error: null,
        scheduleData: null,
        manualScheduleData: null,
        showManualScheduler: false,
        loadingMessage: null,
        lastUpdated: null,
      }
    );
  }, [sessionIdNum, sessions]);

  // Get user prompt and generated text from session data
  const userPrompt = useMemo(() => {
    if (!currentSession) return "";
    const userMessage = currentSession.data.find(
      (msg) => msg.message_type === "user"
    );
    return userMessage?.content || "";
  }, [currentSession]);

  const generatedText = useMemo(() => {
    if (!currentSession) return "";
    const systemMessage = currentSession.data.find(
      (msg) => msg.message_type === "system"
    );
    return systemMessage?.content || "";
  }, [currentSession]);

  // Initialize session if it doesn't exist
  useEffect(() => {
    if (sessionIdNum && !sessions[sessionIdNum]) {
      setActiveSession(sessionIdNum);
      updateSessionData(sessionIdNum, {
        loading: false,
        data: [],
        error: null,
        scheduleData: null,
        manualScheduleData: null,
        showManualScheduler: false,
        loadingMessage: null,
        lastUpdated: Date.now(),
      });
    }
  }, [sessionIdNum, sessions, setActiveSession, updateSessionData]);

  // Update user prompt
  const updateUserPrompt = useCallback(
    (prompt: string) => {
      if (!sessionIdNum) return;
      setUserPrompt(sessionIdNum, prompt);
    },
    [sessionIdNum, setUserPrompt]
  );

  // Update generated text
  const updateGeneratedText = useCallback(
    (text: string) => {
      if (!sessionIdNum) return;
      setGeneratedText(sessionIdNum, text);
    },
    [sessionIdNum, setGeneratedText]
  );

  // Send message
  const sendSessionMessage = useCallback(
    async (message: string) => {
      if (!sessionIdNum) return;
      await sendMessage(sessionIdNum, message);
    },
    [sessionIdNum, sendMessage]
  );

  // Set loading state
  const setSessionLoading = useCallback(
    (loading: boolean) => {
      if (!sessionIdNum) return;
      setLoading(sessionIdNum, loading);
    },
    [sessionIdNum, setLoading]
  );

  // Set loading message
  const setSessionLoadingMessage = useCallback(
    (message: string | null) => {
      if (!sessionIdNum) return;
      setLoadingMessage(sessionIdNum, message);
    },
    [sessionIdNum, setLoadingMessage]
  );

  // Set error
  const setSessionError = useCallback(
    (error: string | null) => {
      if (!sessionIdNum) return;
      setError(sessionIdNum, error);
    },
    [sessionIdNum, setError]
  );

  // Update schedule data
  const updateSessionScheduleData = useCallback(
    (data: any) => {
      if (!sessionIdNum) return;
      updateScheduleData(sessionIdNum, data);
    },
    [sessionIdNum, updateScheduleData]
  );

  // Update manual schedule data
  const updateSessionManualScheduleData = useCallback(
    (data: any) => {
      if (!sessionIdNum) return;
      updateManualScheduleData(sessionIdNum, data);
    },
    [sessionIdNum, updateManualScheduleData]
  );

  // Toggle manual scheduler
  const toggleManualScheduler = useCallback(
    (show: boolean) => {
      if (!sessionIdNum) return;
      setShowManualScheduler(sessionIdNum, show);
    },
    [sessionIdNum, setShowManualScheduler]
  );

  // Clear session
  const clearCurrentSession = useCallback(() => {
    if (!sessionIdNum) return;
    clearSession(sessionIdNum);
  }, [sessionIdNum, clearSession]);

  return {
    // Session info
    sessionId: sessionIdNum,
    isNewSession: !sessionIdNum,
    currentSession,

    // Data
    userPrompt,
    generatedText,

    // Actions
    updateUserPrompt,
    updateGeneratedText,
    sendSessionMessage,
    setSessionLoading,
    setSessionLoadingMessage,
    setSessionError,
    updateSessionScheduleData,
    updateSessionManualScheduleData,
    toggleManualScheduler,
    clearCurrentSession,

    // Context
    activeSessionId,
    setActiveSessionId,
    setActiveSession,
  };
};
