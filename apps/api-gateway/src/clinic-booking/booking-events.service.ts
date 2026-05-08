import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';

/**
 * In-memory pub-sub untuk booking state changes — driver SSE.
 *
 * Single-process scope — kalau api-gateway scaled horizontal nanti,
 * ganti dengan Redis pub-sub atau message bus.
 */

export type BookingEvent = {
  type: 'created' | 'transition' | 'rescheduled' | 'cancelled' | 'note_added';
  bookingId: number;
  status?: string;
  at: string; // ISO timestamp
};

@Injectable()
export class BookingEventsService {
  private readonly subject = new Subject<BookingEvent>();

  emit(event: Omit<BookingEvent, 'at'>) {
    this.subject.next({ ...event, at: new Date().toISOString() });
  }

  asObservable(): Observable<BookingEvent> {
    return this.subject.asObservable();
  }
}
