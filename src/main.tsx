import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/apis/query.client.ts";
import { UserInputProvider } from "./context/chat.provider.tsx";
import customTheme from "./assets/theme/theme.ts";
import { AuthProvider } from "./context/AuthProvider.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={customTheme}>
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <UserInputProvider>
              <App />
            </UserInputProvider>
          </GoogleOAuthProvider>
        </ChakraProvider>
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);
