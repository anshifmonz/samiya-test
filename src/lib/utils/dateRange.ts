import { startOfDay, endOfDay } from 'date-fns';

/**
 * Creates an inclusive date range from the given start and end dates.
 * 
 * @param from - Start date (will be set to 00:00:00)
 * @param to - End date (will be set to 23:59:59)
 * @returns Object with inclusive start and end dates
 * 
 * @example
 * const range = createInclusiveDateRange(
 *   new Date('2024-01-15T10:30:00'), 
 *   new Date('2024-01-20T14:45:00')
 * );
 * // Returns: { 
 * //   from: 2024-01-15T00:00:00.000Z, 
 * //   to: 2024-01-20T23:59:59.999Z 
 * // }
 */
export function createInclusiveDateRange(from: Date, to: Date) {
  return {
    from: startOfDay(from),
    to: endOfDay(to)
  };
}

/**
 * Formats a date range for API queries with inclusive boundaries.
 * 
 * @param from - Start date
 * @param to - End date
 * @returns Object with ISO string formatted inclusive dates
 */
export function formatDateRangeForAPI(from: Date, to: Date) {
  const inclusive = createInclusiveDateRange(from, to);
  return {
    startDate: inclusive.from.toISOString(),
    endDate: inclusive.to.toISOString()
  };
}

/**
 * Checks if a given date falls within an inclusive date range.
 * 
 * @param date - Date to check
 * @param from - Range start date
 * @param to - Range end date
 * @returns True if date falls within the inclusive range
 */
export function isDateInInclusiveRange(date: Date, from: Date, to: Date): boolean {
  const inclusive = createInclusiveDateRange(from, to);
  return date >= inclusive.from && date <= inclusive.to;
}
