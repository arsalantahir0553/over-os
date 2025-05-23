// src/context/auth.ts
import { createContext, useContext } from "react";

export interface User {
  name: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export const AuthCtx = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const useAuth = (): AuthContextType => useContext(AuthCtx);
