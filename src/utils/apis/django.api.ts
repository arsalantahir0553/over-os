import { useMutation } from "@tanstack/react-query";
import api from "./django-axios.interceptor";

const API_WORKFLOW_URL = import.meta.env.VITE_DJANGO_URL;

const chat = async (prompt: string) => {
  const response = await api.post(`${API_WORKFLOW_URL}/chat/`, {
    prompt,
  });
  return response.data;
};

export const useChat = () => {
  return useMutation({
    mutationFn: (prompt: string) => chat(prompt),
  });
};

const extractSchedule = async (prompt: string) => {
  const response = await api.post(`${API_WORKFLOW_URL}/extract-schedule/`, {
    prompt,
  });
  return response.data;
};

export const useExtractSchedule = () => {
  return useMutation({
    mutationFn: (prompt: string) => extractSchedule(prompt),
  });
};

const postToLinkedin = async (text: string) => {
  const response = await api.post(`${API_WORKFLOW_URL}/linkedin/post/`, {
    text,
  });
  return response.data;
};

export const usePostToLinkedin = () => {
  return useMutation({
    mutationFn: (text: string) => postToLinkedin(text),
  });
};

export interface UserScheduleInput {
  prompt: string;
  frequency: "once" | "weekly" | "monthly"; // adjust values as needed
  day_of_week: string; // could use enum for stricter typing
  time_of_day: string; // format: HH:mm:ss
}

const createUserSchedules = async (data: UserScheduleInput) => {
  const response = await api.post(`${API_WORKFLOW_URL}/user-schedules/`, data);
  return response.data;
};

export const useCreateUserSchedules = () => {
  return useMutation({
    mutationFn: (data: UserScheduleInput) => createUserSchedules(data),
  });
};
