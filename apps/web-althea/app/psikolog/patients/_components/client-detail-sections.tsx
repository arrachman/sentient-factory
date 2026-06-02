import { X, Clock, DoorOpen, BellOff, Check } from 'lucide-react';
import {
  CATEGORY_LABEL,
  STATUS_LABEL as CLIENT_STATUS_LABEL,
  type ClientCategory,
  type Gender,
} from '@/features/admin-clients/model/types';
import { useCompleteBooking } from '@/features/admin-booking/hooks/use-booking';
import { STATUS_LABEL } from '@/features/admin-booking/model/types';
import type { Booking } from '@/features/admin-booking/model/types';
import type { ClientWithHistory } from '@/features/admin-clients/model/types';
import {
  STATUS_STYLE,
  CLIENT_STATUS_STYLE,
  genderLabel,
  formatLongDate,
  formatTime,
} from './detail-modal-utils';
import { Field, FieldGrid, NoteBlock, Pill } from './detail-modal-primitives';

export function ClientModalHeader({
  client,
  name,
  initials,
  avatarPalette,
  onClose,
}: {
  client: ClientWithHistory | undefined;
  name: string;
  initials: string;
  avatarPalette: { bg: string; fg: string };
  onClose: () => void;
}) {
  return (
    <header
      style={{
        position: 'relative',
        padding: '28px 32px 24px',
        background: `linear-gradient(135deg, ${avatarPalette.bg} 0%, var(--cream-100, #f5f0e6) 70%)`,
        borderBottom: '1px solid var(--border)',
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Tutup"
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          width: 32,
          height: 32,
          borderRadius: 8,
          border: 'none',
          background: 'rgba(255,255,255,0.7)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--teal-800)',
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#fff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.7)';
        }}
      >
        <X size={16} />
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <div
          aria-hidden
          style={{
            flexShrink: 0,
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: '#fff',
            color: avatarPalette.fg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-serif)',
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: '0.02em',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            border: `3px solid ${avatarPalette.bg}`,
          }}
        >
          {initials}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--fg-muted)',
              marginBottom: 4,
            }}
          >
            Detail Klien
          </div>
          <h2
            id="client-detail-title"
            style={{
              margin: 0,
              fontFamily: 'var(--font-serif)',
              fontSize: 22,
              fontWeight: 700,
              color: 'var(--teal-800)',
              lineHeight: 1.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {name}
          </h2>
          {client && (
            <div
              style={{
                marginTop: 6,
                fontSize: 13,
                color: 'var(--teal-800)',
                opacity: 0.85,
              }}
            >
              {genderLabel(client.gender as Gender)}
              {client.age != null && <> · {client.age} tahun</>}
              {client.category && (
                <> · {CATEGORY_LABEL[client.category as ClientCategory]}</>
              )}
              {client.medicalRecordNumber && (
                <>
                  {' · '}
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: 12 }}>
                    {client.medicalRecordNumber}
                  </span>
                </>
              )}
            </div>
          )}
          <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {client && (
              <Pill
                bg={CLIENT_STATUS_STYLE[client.derivedStatus].bg}
                color={CLIENT_STATUS_STYLE[client.derivedStatus].color}
              >
                Klien {CLIENT_STATUS_LABEL[client.derivedStatus]}
              </Pill>
            )}
            {client && (
              <Pill bg="var(--cream-200, #ece6d3)" color="#6b6047">
                {client.totalBookings} sesi total
              </Pill>
            )}
            {client?.waOptedOut && (
              <Pill bg="#fee2e2" color="#991b1b" icon={<BellOff size={11} />}>
                Opt-out WA
              </Pill>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export function NextSessionBlock({ booking }: { booking: Booking }) {
  const statusStyle = STATUS_STYLE[booking.status] ?? STATUS_STYLE.checked_in;
  const isInProgress = booking.status === 'in_progress';
  const completeMut = useCompleteBooking();

  const handleComplete = () => {
    if (!window.confirm('Tandai sesi ini selesai? Tindakan ini akan mengirim WA Follow-up ke klien.')) return;
    completeMut.mutate(booking.id);
  };

  return (
    <>
      <div
        style={{
          padding: '16px 18px',
          borderRadius: 10,
          background: isInProgress ? '#dcfce7' : 'var(--sage-50)',
          border: `1px solid ${isInProgress ? '#86efac' : 'var(--sage-100, #c5d8c8)'}`,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 17,
            fontWeight: 700,
            color: 'var(--teal-800)',
            marginBottom: 4,
          }}
        >
          {formatLongDate(booking.scheduledStart)}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 14,
            color: 'var(--teal-800)',
            flexWrap: 'wrap',
          }}
        >
          <Clock size={14} style={{ opacity: 0.7 }} />
          <span>
            {formatTime(booking.scheduledStart)} – {formatTime(booking.scheduledEnd)}
          </span>
          <span style={{ opacity: 0.55 }}>·</span>
          <span style={{ opacity: 0.75 }}>{booking.service.durationMinutes} menit</span>
          <span style={{ flex: 1 }} />
          <Pill bg={statusStyle.bg} color={statusStyle.color} size="sm">
            {STATUS_LABEL[booking.status] ?? booking.status}
          </Pill>
        </div>
      </div>

      <FieldGrid>
        <Field label="Layanan">
          <div style={{ fontWeight: 600, color: 'var(--teal-800)', fontSize: 14 }}>
            {booking.service.name}
          </div>
          {booking.sessionTotal > 1 && (
            <div className="caption" style={{ fontSize: 11, marginTop: 2 }}>
              Sesi {booking.sessionN}/{booking.sessionTotal}
            </div>
          )}
        </Field>

        {booking.room && (
          <Field label="Ruangan" icon={<DoorOpen size={13} />}>
            <div style={{ fontWeight: 600, color: 'var(--teal-800)', fontSize: 14 }}>
              {booking.room.name}
            </div>
            <div className="caption" style={{ fontSize: 12, marginTop: 2 }}>
              {booking.room.type}
            </div>
          </Field>
        )}
      </FieldGrid>

      {booking.notes && (
        <NoteBlock label="Keluhan / Catatan sesi">{booking.notes}</NoteBlock>
      )}

      {isInProgress && (
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={handleComplete}
            disabled={completeMut.isPending}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 8,
              border: 'none',
              background: completeMut.isPending ? '#9ca3af' : 'var(--sage-500, #5b8a66)',
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              cursor: completeMut.isPending ? 'wait' : 'pointer',
              transition: 'background 0.15s',
            }}
          >
            <Check size={14} />
            {completeMut.isPending ? 'Menyelesaikan…' : 'Selesaikan sesi'}
          </button>
        </div>
      )}
    </>
  );
}
