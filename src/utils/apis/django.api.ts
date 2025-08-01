import { useMutation, useQuery } from "@tanstack/react-query";
import api from "./axios.interceptor";

const API_WORKFLOW_URL = import.meta.env.VITE_DJANGO_URL;
const userId = localStorage.getItem("user_id");

const oAuthInit = async () => {
  const response = await api.get(`${API_WORKFLOW_URL}/linkedin/oauth/init/`);
  return response.data;
};

export const useOAuthInit = () => {
  return useQuery({
    queryFn: () => oAuthInit(),
    queryKey: ["oauth-init"],
  });
};

const createChatSession = async (title: string) => {
  const response = await api.post(`${API_WORKFLOW_URL}/chat-sessions/`, {
    title,
  });
  return response.data;
};

export const useCreateChatSession = () => {
  return useMutation({
    mutationFn: (title: string) => createChatSession(title),
  });
};

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

export interface ScheduleItem {
  frequency: "once" | "weekly" | "monthly";
  day_of_week: string;
  time_of_day: string; // format: HH:mm:ss
}

export interface UserScheduleInput {
  prompt: string;
  schedules: ScheduleItem[];
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

const getMySchedules = async () => {
  const response = await api.get(`${API_WORKFLOW_URL}/user-schedules/`);
  return response.data;
};

export const useGetMySchedules = () => {
  return useQuery({
    queryFn: () => getMySchedules(),
    queryKey: ["my-schedules"],
  });
};

const deleteSchedule = async (id: string) => {
  const response = await api.delete(
    `${API_WORKFLOW_URL}/user-schedules/${id}/`
  );
  return response.data;
};

export const useDeleteSchedule = () => {
  return useMutation({
    mutationFn: (id: string) => deleteSchedule(id),
  });
};

export interface UpdateScheduleItem {
  id: string;
  prompt: string;
  frequency: "once" | "weekly" | "monthly";
  day_of_week: string;
  time_of_day: string; // format: HH:mm:ss
  end_date: string;
}

const updateSchedule = async (data: UpdateScheduleItem) => {
  const response = await api.put(
    `${API_WORKFLOW_URL}/user-schedules/${data.id}/`,
    data
  );
  return response.data;
};

export const useUpdateSchedule = () => {
  return useMutation({
    mutationFn: (data: UpdateScheduleItem) => updateSchedule(data),
  });
};
