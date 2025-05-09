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

export interface SendEmailPayload {
  to: string;
  subject: string;
  message: object;
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

export const sendEmail = async (payload: SendEmailPayload) => {
  const response = await axios.post(`${API_BASE_URL}/send-email`, payload);
  return response.data;
};

export const useSendEmail = () => {
  return useMutation({
    mutationFn: (payload: SendEmailPayload) => sendEmail(payload),
  });
};
