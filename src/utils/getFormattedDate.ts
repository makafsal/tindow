export const getFormattedDate = (): string => {
  const date = new Date();

  // Get day name
  const weekday = date.toLocaleString("en-US", { weekday: "long" });

  // Get month name
  const month = date.toLocaleString("en-US", { month: "long" });

  // Get day of month
  const day = date.getDate();

  // Get time in 12-hour format with AM/PM
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  // Determine AM or PM
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // convert 0 → 12

  // Final format
  return `${weekday} | ${month} ${day} | ${hours}:${minutes}:${seconds} ${ampm}`;
};
