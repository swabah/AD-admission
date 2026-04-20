/**
 * Format Utilities
 * Handles date and text formatting
 */

export const formatDate = (
  date: string | Date | undefined | null,
  format: "full" | "short" = "short",
): string => {
  if (!date) return "N/A";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (format === "full") {
    return dateObj.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  return dateObj.toLocaleDateString("en-IN");
};

export const formatFileSizeMB = (sizeInBytes: number): string => {
  return (sizeInBytes / (1024 * 1024)).toFixed(2);
};

export const formatApplicationNo = (): string => {
  return "AS" + Date.now().toString().slice(-6);
};
