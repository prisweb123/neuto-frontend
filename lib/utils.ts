import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateInput: string) {
  // Create a Date object if the input is a string
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  
  // Check if date is valid
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('Invalid date input');
  }
  
  // Get components with leading zeros where needed
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
  const year = date.getFullYear().toString().slice(-2); // Get last 2 digits of year
  
  // Return formatted date string
  return `${day}/${month}/${year}`;
}