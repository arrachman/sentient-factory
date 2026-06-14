import { Observable } from 'rxjs';
export type BookingEvent = {
    type: 'created' | 'transition' | 'rescheduled' | 'cancelled' | 'note_added';
    bookingId: number;
    status?: string;
    at: string;
};
export declare class BookingEventsService {
    private readonly subject;
    emit(event: Omit<BookingEvent, 'at'>): void;
    asObservable(): Observable<BookingEvent>;
}
