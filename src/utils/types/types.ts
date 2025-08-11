export interface UserSchedule {
  id: number;
  user: number;
  periodic_task: number;
  prompt: string;
  status: "active" | "inactive" | string;
  frequency: "daily" | "weekly" | "monthly" | string;
  day_of_week: string | null;
  time_of_day: string; // Format: "HH:mm:ss"
  celery_task_id: string | null;
  timezone: string | null;
  end_date: string | null; // Format: "YYYY-MM-DD" or null
  description: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface ScheduleData {
  frequency: "once" | "weekly" | "monthly";
  day_of_week: string;
  time_of_day: string;
  timezone?: string;
  end_date?: string;
}
