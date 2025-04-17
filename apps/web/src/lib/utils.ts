import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string, options?: Intl.DateTimeFormatOptions) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    ...options,
  });
}

const videoExtensions = [
  ".mp4",
  ".mov",
  ".avi",
  ".wmv",
  ".flv",
  ".mpeg",
  ".mpg",
  ".m4v",
  ".webm",
  ".ogg",
  ".m3u8",
  ".ts",
  ".m3u8",
  ".m3u8",
];
const imageExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".bmp",
  ".webp",
  ".svg",
  ".ico",
  ".heic",
  ".heif",
  ".hevc",
  ".heif",
];

export function getMediaType(url: string): "video" | "image" {
  if (url.includes("youtube.com")) {
    return "video";
  }
  // ends in video extension
  if (videoExtensions.some((ext) => url.endsWith(ext))) {
    return "video";
  }
  // ends in image extension
  if (imageExtensions.some((ext) => url.endsWith(ext))) {
    return "image";
  }
  return "image";
}

// Utility function to format bytes
export function formatBytes(bytes?: number | null, decimals = 1) {
  if (!bytes || bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
