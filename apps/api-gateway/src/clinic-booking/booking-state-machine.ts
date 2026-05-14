import type { BookingStatus } from './dto/clinic-booking.dto';

/** Valid state machine transitions for clinic bookings. */
export const VALID_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  awaiting_dp: ['confirmed', 'cancelled'],
  confirmed: ['checked_in', 'cancelled'],
  checked_in: ['in_progress', 'cancelled'],
  in_progress: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};
