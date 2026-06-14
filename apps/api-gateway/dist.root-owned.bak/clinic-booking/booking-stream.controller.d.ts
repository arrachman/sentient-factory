import { Observable } from 'rxjs';
import { BookingEventsService, type BookingEvent } from './booking-events.service';
export declare class BookingStreamController {
    private readonly events;
    constructor(events: BookingEventsService);
    stream(): Observable<{
        data: BookingEvent;
    }>;
}
