/**
 * Utility functions for the Arcane website
 */

/**
 * Fetches the user's public IP address using multiple fallback services
 * @returns Promise<string> - The user's IP address or 'Unknown' if detection fails
 */
export async function getUserIPAddress(): Promise<string> {
  const services = [
    'https://api.ipify.org?format=json',
    'https://api64.ipify.org?format=json',
    'https://httpbin.org/ip'
  ]
  
  for (const service of services) {
    try {
      const response = await fetch(service, { 
        method: 'GET',
        mode: 'cors'
      })
      
      if (response.ok) {
        const data = await response.json()
        return data.ip || data.origin || 'Unknown'
      }
    } catch (error) {
      console.warn(`Failed to fetch IP from ${service}:`, error)
      continue
    }
  }
  
  return 'Unknown'
}

/**
 * Formats a date for display
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  }).format(date)
}

/**
 * Sanitizes user input to prevent SQL injection
 * @param input - User input string
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>'"]/g, '')
}

/**
 * Compares the current local time with a database timestamp (timestamptz)
 * Ensures proper timezone conversion between UTC database time and local time
 * @param dbTimestamp - Database timestamp (timestamptz) from Supabase
 * @returns true if current local time is after the database timestamp
 */
export function isAfterTimestamp(dbTimestamp: Date | string | null): boolean {
  if (!dbTimestamp) return false
  
  // Convert database timestamp to Date object if it's a string
  const dbDate = typeof dbTimestamp === 'string' ? new Date(dbTimestamp) : dbTimestamp
  
  // Get current local time
  const now = new Date()
  
  // Compare timestamps - this automatically handles timezone conversion
  // since both dates are now in the same timezone context
  return now.getTime() >= dbDate.getTime()
}

/**
 * Compares the current local time with a database timestamp (timestamptz)
 * Ensures proper timezone conversion between UTC database time and local time
 * @param dbTimestamp - Database timestamp (timestamptz) from Supabase
 * @returns true if current local time is before the database timestamp
 */
export function isBeforeTimestamp(dbTimestamp: Date | string | null): boolean {
  if (!dbTimestamp) return false
  
  // Convert database timestamp to Date object if it's a string
  const dbDate = typeof dbTimestamp === 'string' ? new Date(dbTimestamp) : dbTimestamp
  
  // Get current local time
  const now = new Date()
  
  // Compare timestamps - this automatically handles timezone conversion
  // since both dates are now in the same timezone context
  return now.getTime() < dbDate.getTime()
}

/**
 * Checks if the current time is between two database timestamps (timestamptz)
 * Ensures proper timezone conversion between UTC database time and local time
 * @param startTimestamp - Start timestamp (timestamptz) from Supabase
 * @param endTimestamp - End timestamp (timestamptz) from Supabase
 * @returns true if current local time is between the start and end timestamps
 */
export function isBetweenTimestamps(
  startTimestamp: Date | string | null, 
  endTimestamp: Date | string | null
): boolean {
  if (!startTimestamp || !endTimestamp) return false
  
  // Convert database timestamps to Date objects if they're strings
  const startDate = typeof startTimestamp === 'string' ? new Date(startTimestamp) : startTimestamp
  const endDate = typeof endTimestamp === 'string' ? new Date(endTimestamp) : endTimestamp
  
  // Get current local time
  const now = new Date()
  
  // Compare timestamps - this automatically handles timezone conversion
  // since all dates are now in the same timezone context
  return now.getTime() >= startDate.getTime() && now.getTime() < endDate.getTime()
}
