import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for combining Tailwind CSS classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date to display in a user-friendly way
export function formatDate(date: Date | string, includeTime: boolean = false): string {
  if (!date) return "N/A";
  
  try {
    const dateObj = new Date(date);
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return "Invalid Date";
    }
    
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...(includeTime && {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    
    // Use toString to ensure consistent rendering between server and client
    return dateObj.toLocaleDateString('en-US', options);
  } catch (e) {
    console.error("Error formatting date:", e);
    return "Date Error";
  }
}

// Format date with time (maintained for backward compatibility)
export function formatDateTime(date: Date | string): string {
  return formatDate(date, true);
}

// Calculate age from date of birth
export function calculateAge(dateOfBirth: Date | string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

// Truncate text with ellipsis if longer than maxLength
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
