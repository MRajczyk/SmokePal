import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const SUBMIT_DEBOUNCE_MS = 500;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetcher = async (...props: Parameters<typeof fetch>) => {
  const response = await fetch(...props);

  if (!response.ok) {
    const { message } = (await response.json()) as { message: string };
    throw new Error(message);
  }

  return response.json();
};
