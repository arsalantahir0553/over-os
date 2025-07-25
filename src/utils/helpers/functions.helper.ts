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
    // Parse the local time (HH:mm)
    const [hours, minutes] = localTime.split(":").map(Number);

    // Create a date object with today's date and the specified local time
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    // Convert to UTC and format as HH:mm:ss
    const utcHours = date.getUTCHours().toString().padStart(2, "0");
    const utcMinutes = date.getUTCMinutes().toString().padStart(2, "0");

    return `${utcHours}:${utcMinutes}:00`;
  } catch (error) {
    console.error("Error converting time to UTC:", error);
    return "00:00:00";
  }
};
