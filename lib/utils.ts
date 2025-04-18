import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateInput: string | Date) {
  try {
    // If input is already a Date object, use it directly
    let date: Date = new Date();
    if (dateInput instanceof Date) {
      date = dateInput;
    } else {
      // Try different date formats
      const formats = [
        // DD.MM.YYYY
        /^(\d{2})\.(\d{2})\.(\d{4})$/,
        // YYYY-MM-DD
        /^(\d{4})-(\d{2})-(\d{2})$/,
        // DD/MM/YYYY
        /^(\d{2})\/(\d{2})\/(\d{4})$/
      ];

      let match;
      for (const format of formats) {
        match = dateInput.match(format);
        if (match) {
          if (format === formats[0]) { // DD.MM.YYYY
            date = new Date(parseInt(match[3]), parseInt(match[2]) - 1, parseInt(match[1]));
          } else if (format === formats[1]) { // YYYY-MM-DD
            date = new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
          } else { // DD/MM/YYYY
            date = new Date(parseInt(match[3]), parseInt(match[2]) - 1, parseInt(match[1]));
          }
          break;
        }
      }

      // If no format matched, try parsing directly
      if (!match) {
        date = new Date(dateInput);
      }
    }

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
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateInput; // Return original input if formatting fails
  }
}