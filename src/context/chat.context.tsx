import { createContext } from "react";

export interface UserInputContextType {
  userInput: string;
  setUserInput: React.Dispatch<React.SetStateAction<string>>;
  selectedImages: File[];
  setSelectedImages: React.Dispatch<React.SetStateAction<File[]>>;
}

export const UserInputContext = createContext<UserInputContextType>({
  userInput: "",
  setUserInput: () => {},
  selectedImages: [],
  setSelectedImages: () => {},
});
