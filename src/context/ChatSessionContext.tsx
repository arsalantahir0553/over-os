// ChatSessionContext.tsx
import { createContext, useContext, useState } from "react";

const ChatSessionContext = createContext<any>(null);

export const ChatSessionProvider = ({ children }: any) => {
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [sessionData, setSessionData] = useState(null);

  return (
    <ChatSessionContext.Provider
      value={{
        activeSessionId,
        setActiveSessionId,
        sessionData,
        setSessionData,
      }}
    >
      {children}
    </ChatSessionContext.Provider>
  );
};

export const useChatSession = () => useContext<any>(ChatSessionContext);
