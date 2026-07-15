import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Standard shadcn/21st `cn` helper: merge + dedupe Tailwind classes. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
