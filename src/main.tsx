import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/apis/query.client.ts";
import { UserInputProvider } from "./context/chat.provider.tsx";
import customTheme from "./assets/theme/theme.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={customTheme}>
        <UserInputProvider>
          <App />
        </UserInputProvider>
      </ChakraProvider>
    </QueryClientProvider>
  </StrictMode>
);
