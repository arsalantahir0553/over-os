// chat.provider.tsx
import { useState, type ReactNode } from "react";
import { UserInputContext } from "./chat.context";

export const UserInputProvider = ({ children }: { children: ReactNode }) => {
  const [userInput, setUserInput] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isChat, setIsChat] = useState<boolean>(false);
  return (
    <UserInputContext.Provider
      value={{
        userInput,
        setUserInput,
        selectedImages,
        setSelectedImages,
        isChat,
        setIsChat,
      }}
    >
      {children}
    </UserInputContext.Provider>
  );
};
