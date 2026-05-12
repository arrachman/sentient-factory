/**
 * Pure utility functions for attendance clock operations.
 */

/**
 * Calculate elapsed minutes from a clock-in timestamp to now.
 * Returns 0 if clockInAt is null/undefined.
 */
export function diffMinutes(clockInAt: Date | string | null): number {
  if (!clockInAt) return 0;
  const start = new Date(clockInAt);
  const end = new Date();
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 60000));
}
