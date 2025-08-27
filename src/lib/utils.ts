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
  return input.trim().toLowerCase().replace(/[<>'"]/g, '')
}
