import { Controller, Sse, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Observable, map } from 'rxjs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { SkipAudit } from '../clinic-audit/decorators/skip-audit.decorator';
import { BookingEventsService, type BookingEvent } from './booking-events.service';

/**
 * Server-Sent Events stream untuk booking changes.
 * Dipakai resepsionis dashboard untuk realtime updates (replace polling).
 *
 * Client connect via:
 *   const es = new EventSource('/api/clinic/booking/stream');
 *   es.onmessage = (e) => { const event = JSON.parse(e.data); ... };
 */
/**
 * Path `/clinic/stream/booking` (bukan `/clinic/booking/stream`) untuk hindari
 * collision dengan `GET /clinic/booking/:id` ParseIntPipe ("stream" tidak numeric).
 */
@ApiTags('Clinic — Booking Stream (SSE)')
@ApiBearerAuth()
@Controller('clinic/stream')
@SkipAudit()
export class BookingStreamController {
  constructor(private readonly events: BookingEventsService) {}

  @Sse('booking')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('clinic-admin', 'clinic-resepsionis', 'clinic-psikolog', 'clinic-owner')
  @ApiOperation({ summary: 'SSE stream untuk realtime booking events' })
  stream(): Observable<{ data: BookingEvent }> {
    return this.events.asObservable().pipe(map((event) => ({ data: event })));
  }
}
