/**
 * Checks if a checkout session has expired.
 * @param createdAt - The checkout creation timestamp
 * @param durationMinutes - Expiration duration in minutes
 * @returns true if expired, false otherwise
 */
export function isExpired(createdAt: string | Date, durationMinutes: number): boolean {
  const created = createdAt instanceof Date ? createdAt : new Date(createdAt);
  const expireTime = new Date(created.getTime() + durationMinutes * 60 * 1000); // add minutes
  return Date.now() > expireTime.getTime();
}
