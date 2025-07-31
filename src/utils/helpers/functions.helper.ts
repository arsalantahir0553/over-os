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
    // Match 12-hour format like "10:40 PM" or "03:15 am"
    const timeMatch = localTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

    if (!timeMatch) {
      console.error("Invalid time format. Use HH:mm AM/PM format.");
      return "00:00:00";
    }

    let [_, hourStr, minuteStr, meridiem] = timeMatch;
    let hours = parseInt(hourStr, 10);
    const minutes = parseInt(minuteStr, 10);

    // Convert to 24-hour format
    if (meridiem.toUpperCase() === "PM" && hours !== 12) {
      hours += 12;
    } else if (meridiem.toUpperCase() === "AM" && hours === 12) {
      hours = 0;
    }

    // Create date object with local time
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    // Convert to UTC
    const utcHours = date.getUTCHours().toString().padStart(2, "0");
    const utcMinutes = date.getUTCMinutes().toString().padStart(2, "0");

    return `${utcHours}:${utcMinutes}:00`;
  } catch (error) {
    console.error("Error converting time to UTC:", error);
    return "00:00:00";
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
    case "1 month":
      newDate.setMonth(start.getMonth() + 1);
      break;
    case "2 months":
      newDate.setMonth(start.getMonth() + 2);
      break;
    case "12 weeks":
      newDate.setDate(start.getDate() + 84);
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
  if (daysDiff <= 31) return "1 month";
  if (daysDiff <= 62) return "2 months";
  if (daysDiff <= 84) return "12 weeks";
  return "Until stopped";
};
