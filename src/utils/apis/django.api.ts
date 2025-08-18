import { useMutation, useQuery } from "@tanstack/react-query";
import api from "./axios.interceptor";

const API_WORKFLOW_URL = import.meta.env.VITE_DJANGO_URL;

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
  frequency: "once" | "weekly" | "monthly";
  days_of_week: string[];
  time_of_day: string; // format: HH:mm:ss
  chat_session?: number;
  timezone?: string;
  end_date?: string;
  flag?: 1;
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

export interface UpdateSchedulePayload {
  prompt: string;
  frequency: "once" | "weekly" | "monthly";
  days_of_week?: string[];
  time_of_day: string;
  timezone: string;
  end_date?: string;
}

export const updateSchedule = async (
  id: string,
  data: UpdateSchedulePayload
) => {
  const response = await api.patch(
    `${API_WORKFLOW_URL}/user-schedules/${id}/`,
    data
  );
  return response.data;
};

export const useUpdateSchedule = () => {
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof updateSchedule>[1];
    }) => updateSchedule(id, data),
  });
};
