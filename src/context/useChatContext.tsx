import { useContext } from "react";
import { UserInputContext } from "./chat.context";

export const useUserInput = () => {
  const context = useContext(UserInputContext);
  if (!context) {
    throw new Error("useUserInput must be used within a UserInputProvider");
  }
  return context;
};
