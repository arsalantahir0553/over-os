import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Types
export interface WorkflowPayload {
  title: string;
  description: string;
  prompt: string;
  tags: string[];
  longDescription: string;
  bannerImage: string;
  sampleImages: string[];
  whoIsItFor: string[];
  keyBenefits: string[];
  isActive: boolean;
}

export interface Workflow extends WorkflowPayload {
  id: string;
}

// Create workflow
export const createWorkflow = async (payload: WorkflowPayload) => {
  const response = await axios.post(`${API_BASE_URL}/workflow`, payload);
  return response.data;
};

export const useCreateWorkflow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createWorkflow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
    },
  });
};

// Get all workflows
export const getAllWorkflows = async (): Promise<Workflow[]> => {
  const response = await axios.get(`${API_BASE_URL}/workflow`);
  return response.data;
};

export const useGetAllWorkflows = () => {
  return useQuery({
    queryKey: ["workflows"],
    queryFn: getAllWorkflows,
  });
};

// Get single workflow
export const getWorkflowById = async (id: string): Promise<Workflow> => {
  const response = await axios.get(`${API_BASE_URL}/workflow/${id}`);
  return response.data;
};

export const useGetWorkflowById = (id: string) => {
  return useQuery({
    queryKey: ["workflow", id],
    queryFn: () => getWorkflowById(id),
    enabled: !!id,
  });
};

// Update workflow
export const updateWorkflow = async (
  id: string,
  payload: Partial<WorkflowPayload>
) => {
  const response = await axios.patch(`${API_BASE_URL}/workflow/${id}`, payload);
  return response.data;
};

export const useUpdateWorkflow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<WorkflowPayload>;
    }) => updateWorkflow(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
    },
  });
};

// Delete workflow
export const deleteWorkflow = async (id: string) => {
  const response = await axios.delete(`${API_BASE_URL}/workflow/${id}`);
  return response.data;
};

export const useDeleteWorkflow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteWorkflow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
    },
  });
};

export const getTrendingWorkflows = async (): Promise<{
  trendingWorkflows: Workflow[];
  workflowsByCategory: Record<string, Workflow[]>;
}> => {
  const response = await axios.get(
    `${API_BASE_URL}/workflow/trending-workflows`
  );
  return response.data;
};

// Hook to fetch dashboard workflows
export const useTrendingWorkflows = () => {
  return useQuery({
    queryKey: ["trendingWorkflows"],
    queryFn: getTrendingWorkflows,
  });
};

export const getDashboardWorkflows = async (): Promise<{
  trendingWorkflows: Workflow[];
  workflowsByCategory: Record<string, Workflow[]>;
}> => {
  const response = await axios.get(
    `${API_BASE_URL}/workflow/dashboard-workflows`
  );
  return response.data;
};

// Hook to fetch dashboard workflows
export const useDashboardWorkflows = () => {
  return useQuery({
    queryKey: ["dashboardWorkflows"],
    queryFn: getDashboardWorkflows,
  });
};

export const getWorkflowCategories = async (): Promise<string[]> => {
  const response = await axios.get(`${API_BASE_URL}/workflow/categories`);
  return response.data;
};

export const useWorkflowCategories = () => {
  return useQuery({
    queryKey: ["workflowCategories"],
    queryFn: getWorkflowCategories,
  });
};
