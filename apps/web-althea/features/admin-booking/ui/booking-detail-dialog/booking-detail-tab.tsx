'use client';

import { Bell } from 'lucide-react';
import type { Booking } from '../../model/types';
import type { Payment } from '../../api/booking.api';
import { formatDateTime, PAYMENT_STATUS_LABEL, rp } from './format';
import { DetailRow } from './detail-row';

/**
 * Tab "Detail" — info booking + payment summary + quick actions reminder.
 */
export function BookingDetailTab({
  booking,
  payment,
  reminderMutating,
  onSendReminder,
}: {
  booking: Booking;
  payment: Payment | undefined;
  reminderMutating: boolean;
  onSendReminder: (templateName: string) => void;
}) {
  return (
    <div className="space-y-3 text-sm">
      <DetailRow
        label="Klien"
        value={
          <div>
            <div className="font-medium">{booking.client.name}</div>
            <div className="caption font-mono">{booking.client.phoneWa}</div>
          </div>
        }
      />
      <DetailRow
        label="Layanan"
        value={
          <div>
            <div>{booking.service.name}</div>
            <div className="caption">
              {booking.service.category} · {booking.service.durationMinutes}
              min · {rp(booking.service.basePrice)}
            </div>
          </div>
        }
      />
      <DetailRow
        label="Psikolog"
        value={
          <div className="flex items-center gap-2">
            <span
              className="avatar avatar-sm"
              style={
                booking.psikolog.clinicPsikologProfile?.color
                  ? {
                      backgroundColor:
                        booking.psikolog.clinicPsikologProfile.color,
                      color: '#fff',
                    }
                  : undefined
              }
            >
              {(booking.psikolog.fullName || booking.psikolog.email)
                .slice(0, 2)
                .toUpperCase()}
            </span>
            <span>
              {booking.psikolog.fullName || booking.psikolog.email}
            </span>
          </div>
        }
      />
      <DetailRow label="Ruang" value={booking.room.name} />
      <DetailRow
        label="Mulai"
        value={formatDateTime(booking.scheduledStart)}
      />
      <DetailRow
        label="Selesai"
        value={formatDateTime(booking.scheduledEnd)}
      />
      {booking.notes ? (
        <DetailRow
          label="Catatan"
          value={
            <div className="whitespace-pre-wrap">{booking.notes}</div>
          }
        />
      ) : null}

      {payment ? (
        <DetailRow
          label="Pembayaran"
          value={
            <div className="flex items-center gap-2">
              <span className="badge badge-sage">
                {PAYMENT_STATUS_LABEL[payment.status] || payment.status}
              </span>
              <span className="caption">
                {rp(payment.paidAmount)} / {rp(payment.totalAmount)}
              </span>
            </div>
          }
        />
      ) : null}

      <QuickActionsRow
        booking={booking}
        reminderMutating={reminderMutating}
        onSendReminder={onSendReminder}
      />
    </div>
  );
}

function QuickActionsRow({
  booking,
  reminderMutating,
  onSendReminder,
}: {
  booking: Booking;
  reminderMutating: boolean;
  onSendReminder: (templateName: string) => void;
}) {
  if (['cancelled', 'completed'].includes(booking.status)) return null;
  return (
    <div className="flex flex-wrap gap-2 border-t border-border pt-4">
      <button
        type="button"
        onClick={() => onSendReminder('Pengingat H-1')}
        disabled={reminderMutating}
        className="btn btn-outline btn-sm"
      >
        <Bell className="h-3.5 w-3.5" /> Reminder H-1
      </button>
      <button
        type="button"
        onClick={() => onSendReminder('Pengingat 30 Menit')}
        disabled={reminderMutating}
        className="btn btn-outline btn-sm"
      >
        <Bell className="h-3.5 w-3.5" /> Reminder 30 menit
      </button>
    </div>
  );
}
