import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
} 

export function truncateString(input: unknown, maxLength: number): string {
  const str = typeof input === 'string' ? input : String(input ?? '')
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength)
}