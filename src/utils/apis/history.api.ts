import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface HistoryPayload {
  user_id: string;
  prompt: string;
  generated_post: string;
  image_url?: string;
  meta?: string;
}

export interface HistoryResponse {
  id: string;
  user_id: string;
  prompt: string;
  generated_post: string;
  image_url?: string;
  meta?: string;
  created_at: string;
  updated_at: string;
}

// Create history
export const createHistory = async (payload: HistoryPayload) => {
  const response = await axios.post(`${API_BASE_URL}/history`, payload);
  return response.data;
};

export const useCreateHistory = () => {
  return useMutation({
    mutationFn: (payload: HistoryPayload) => createHistory(payload),
  });
};

// Get all history
export const getAllHistory = async (): Promise<HistoryResponse[]> => {
  const response = await axios.get(`${API_BASE_URL}/history`);
  return response.data;
};

export const useGetAllHistory = () => {
  return useQuery({
    queryKey: ["history"],
    queryFn: getAllHistory,
  });
};

// Get single history by ID
export const getHistoryById = async (id: string): Promise<HistoryResponse> => {
  const response = await axios.get(`${API_BASE_URL}/history/${id}`);
  return response.data;
};

export const useGetHistoryById = (id: string) => {
  return useQuery({
    queryKey: ["history", id],
    queryFn: () => getHistoryById(id),
    enabled: !!id,
  });
};

// Update history
export const updateHistory = async (
  id: string,
  payload: Partial<HistoryPayload>
): Promise<HistoryResponse> => {
  const response = await axios.patch(`${API_BASE_URL}/history/${id}`, payload);
  return response.data;
};

export const useUpdateHistory = () => {
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<HistoryPayload>;
    }) => updateHistory(id, payload),
  });
};

// Delete history
export const deleteHistory = async (
  id: string
): Promise<{ message: string }> => {
  const response = await axios.delete(`${API_BASE_URL}/history/${id}`);
  return response.data;
};

export const useDeleteHistory = () => {
  return useMutation({
    mutationFn: (id: string) => deleteHistory(id),
  });
};

export const getUserHistory = async (
  user_id: number | string,
  limit = 10,
  offset = 0
) => {
  const response = await axios.get(`${API_BASE_URL}/history/user/${user_id}`, {
    params: {
      limit,
      offset,
    },
  });
  return response.data;
};

export const useGetUserHistory = (
  user_id: number | string,
  limit = 10,
  offset = 0
) => {
  return useQuery({
    queryKey: ["user-history", user_id, limit, offset],
    queryFn: () => getUserHistory(user_id, limit, offset),
    enabled: !!user_id,
  });
};
