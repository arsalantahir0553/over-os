// chat.provider.tsx
import { useState, type ReactNode } from "react";
import { UserInputContext } from "./chat.context";

export const UserInputProvider = ({ children }: { children: ReactNode }) => {
  const [userInput, setUserInput] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  return (
    <UserInputContext.Provider
      value={{
        userInput,
        setUserInput,
        selectedImages,
        setSelectedImages,
      }}
    >
      {children}
    </UserInputContext.Provider>
  );
};
