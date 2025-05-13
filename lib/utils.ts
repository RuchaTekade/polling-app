import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateUniqueId() {
  return Math.random().toString(36).substring(2, 9)
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function getShareUrl(pollId: string) {
  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

  return `${baseUrl}/poll/${pollId}`
}
