// src/context/AuthProvider.tsx
import { useEffect, useState, type ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthCtx, type User } from "./AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // jwt-decode default‑exports the function
        const payload = jwtDecode<{ email: string; name: string }>(token);
        setUser({ name: payload.name, email: payload.email });
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  return (
    <AuthCtx.Provider value={{ user, loading }}>{children}</AuthCtx.Provider>
  );
}
