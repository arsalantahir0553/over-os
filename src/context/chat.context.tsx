import { createContext } from "react";

interface UserInputContextType {
  userInput: string;
  setUserInput: (input: string) => void;
}

export const UserInputContext = createContext<UserInputContextType | undefined>(
  undefined
);
