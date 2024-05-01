import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function formatDate(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
) {
  return new Date(date).toLocaleString(
    undefined,
    options ?? {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );
}
