// Helper function to convert short day names to full day names
export const getFullDayName = (shortDay: string): string => {
  const dayMap: Record<string, string> = {
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday",
    Sun: "Sunday",
  };
  return dayMap[shortDay] || shortDay; // Return as is if not found
};

// Convert local time string (HH:mm) to UTC time string (HH:mm:ss)
export const convertLocalTimeToUTC = (localTime: string): string => {
  if (!localTime) return "00:00:00";

  try {
    let hours: number;
    let minutes: number;

    // Check for 12-hour format with AM/PM
    const amPmMatch = localTime.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
    if (amPmMatch) {
      let [, hourStr, minuteStr = "00", meridiem] = amPmMatch;
      hours = parseInt(hourStr, 10);
      minutes = parseInt(minuteStr, 10);

      if (meridiem.toUpperCase() === "PM" && hours !== 12) {
        hours += 12;
      } else if (meridiem.toUpperCase() === "AM" && hours === 12) {
        hours = 0;
      }
    } else {
      // Assume 24-hour format "HH:mm"
      const [hourStr, minuteStr] = localTime.split(":");
      hours = parseInt(hourStr, 10);
      minutes = parseInt(minuteStr, 10);

      if (isNaN(hours) || isNaN(minutes)) {
        console.error("Invalid time format. Use HH:mm or HH:mm AM/PM.");
        return "00:00:00";
      }
    }

    // Create a local date and convert to UTC
    const localDate = new Date();
    localDate.setHours(hours, minutes, 0, 0);

    const utcHours = localDate.getUTCHours().toString().padStart(2, "0");
    const utcMinutes = localDate.getUTCMinutes().toString().padStart(2, "0");

    return `${utcHours}:${utcMinutes}:00`;
  } catch (error) {
    console.error("Error converting time to UTC:", error);
    return "00:00:00";
  }
};

export const convertUTCToLocalTime = (utcTime: string): string => {
  if (!utcTime) return "00:00";

  try {
    // Accept "HH:mm" or "HH:mm:ss"
    const [hourStr, minuteStr = "00"] = utcTime.split(":");
    const hours = parseInt(hourStr, 10);
    const minutes = parseInt(minuteStr, 10);

    if (isNaN(hours) || isNaN(minutes)) {
      console.error("Invalid UTC time format. Use HH:mm or HH:mm:ss");
      return "00:00";
    }

    // Create date using UTC time
    const utcDate = new Date();
    utcDate.setUTCHours(hours, minutes, 0, 0);

    // Convert to local time (based on system timezone)
    const localHours = utcDate.getHours().toString().padStart(2, "0");
    const localMinutes = utcDate.getMinutes().toString().padStart(2, "0");

    return `${localHours}:${localMinutes}`;
  } catch (error) {
    console.error("Error converting UTC to local time:", error);
    return "00:00";
  }
};

export const calculateEndDateFromDuration = (
  start: Date,
  duration: string
): Date => {
  const newDate = new Date(start);
  switch (duration) {
    case "1 week":
      newDate.setDate(start.getDate() + 7);
      break;
    case "2 weeks":
      newDate.setDate(start.getDate() + 14);
      break;
    case "4 weeks":
      newDate.setDate(start.getDate() + 28);
      break;
    case "8 weeks":
      newDate.setDate(start.getDate() + 56);
      break;
    case "Until stopped":
      newDate.setFullYear(start.getFullYear() + 10); // arbitrarily far in future
      break;
    default:
      break;
  }
  return newDate;
};

export const calculateDurationFromDates = (start: Date, end: Date): string => {
  const daysDiff = Math.round(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysDiff <= 7) return "1 week";
  if (daysDiff <= 14) return "2 weeks";
  if (daysDiff <= 31) return "4 weeks";
  if (daysDiff <= 62) return "8 weeks";
  return "Until stopped";
};

export const formatTimeToAMPM = (timeStr: string) => {
  const [hours, minutes] = timeStr.split(":");
  const date = new Date();
  date.setHours(Number(hours));
  date.setMinutes(Number(minutes));
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const normalizeTimeTo24Hour = (timeStr: string): string => {
  if (!timeStr) return "00:00";

  try {
    let hours: number;
    let minutes: number;

    // Match 12-hour format with optional minutes and AM/PM
    const amPmMatch = timeStr.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
    if (amPmMatch) {
      let [, hourStr, minuteStr = "00", meridiem] = amPmMatch;
      hours = parseInt(hourStr, 10);
      minutes = parseInt(minuteStr, 10);

      if (meridiem.toUpperCase() === "PM" && hours !== 12) {
        hours += 12;
      } else if (meridiem.toUpperCase() === "AM" && hours === 12) {
        hours = 0;
      }
    } else {
      // Assume 24-hour format "HH:mm"
      const [hourStr, minuteStr = "00"] = timeStr.split(":");
      hours = parseInt(hourStr, 10);
      minutes = parseInt(minuteStr, 10);

      if (isNaN(hours) || isNaN(minutes)) {
        console.error("Invalid time format. Use HH:mm or HH:mm AM/PM.");
        return "00:00";
      }
    }

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  } catch (error) {
    console.error("Error normalizing time:", error);
    return "00:00";
  }
};
