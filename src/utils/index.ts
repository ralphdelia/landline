export const formatTime = (time: string) => {
  const [hours, minutes] = time.split(":").slice(0, 2);
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};