import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface WaitingListPayload {
  fullName: string;
  workEmail: string;
  linkedInProfile: string;
  referralSource: string;
  interestDescription: string;
}

export const joinWaitingList = async (payload: WaitingListPayload) => {
  const response = await axios.post(`${API_BASE_URL}/waiting-list`, payload);
  return response.data;
};

export const useJoinWaitingList = () => {
  return useMutation({
    mutationFn: (payload: WaitingListPayload) => joinWaitingList(payload),
  });
};
