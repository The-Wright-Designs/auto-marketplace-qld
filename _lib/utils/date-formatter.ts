export function formatDate(isoString: string | undefined): string {
  if (!isoString) return "Not provided";
  return new Date(isoString).toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDateTime(isoString: string | undefined): string {
  if (!isoString) return "Not provided";
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}/${month}/${day}, ${hours}:${minutes}`;
}
