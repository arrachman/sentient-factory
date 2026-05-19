'use client';

/**
 * Detail panel ruangan read-only untuk psikolog.
 * Tampilkan: nama, tipe, kapasitas, fasilitas (default per type), booking
 * pada slot terpilih (kalau ada). TIDAK ada button Edit/Hapus.
 */
import { X } from 'lucide-react';
import {
  DEFAULT_FACILITIES,
  ROOM_TYPE_STYLE,
  type SlotDef,
} from '@/features/admin-rooms/model/constants';
import { ROOM_TYPE_LABEL, type Room } from '@/features/admin-rooms/model/types';
import type { Booking } from '@/features/admin-booking/model/types';

function shortName(fullName: string | null, email: string): string {
  return fullName?.trim() || email.split('@')[0];
}

export function RoomDetailPanel({
  room,
  slot,
  booking,
  onClose,
}: {
  room: Room;
  slot: SlotDef;
  booking: Booking | null;
  onClose: () => void;
}) {
  const style = ROOM_TYPE_STYLE[room.type];
  const facilities =
    room.description?.trim() ||
    DEFAULT_FACILITIES[room.type].join(' · ');

  return (
    <aside
      className="card-althea"
      style={{
        width: 320,
        flexShrink: 0,
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        alignSelf: 'flex-start',
      }}
    >
      <div className="flex items-center justify-between">
        <span className="eyebrow">Detail Ruangan</span>
        <button
          type="button"
          onClick={onClose}
          className="btn btn-icon btn-ghost btn-sm"
          aria-label="Tutup"
          style={{ height: 24, width: 24 }}
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex flex-col" style={{ gap: 6 }}>
        <div className="flex items-center gap-2">
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 3,
              background: style.fg,
            }}
          />
          <span
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: 'var(--teal-800)',
              fontFamily: 'var(--font-serif)',
            }}
          >
            {room.name}
          </span>
        </div>
        <span className="caption">
          {ROOM_TYPE_LABEL[room.type]} · kapasitas {room.capacity}{' '}
          {room.capacity === 1 ? 'orang' : 'orang'}
        </span>
      </div>

      <div
        className="hr-althea"
        style={{ margin: 0, background: 'var(--border)' }}
      />

      <div className="flex flex-col gap-1">
        <span className="eyebrow">Slot</span>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--teal-800)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {slot.start} – {slot.end}
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <span className="eyebrow">Fasilitas</span>
        <span style={{ fontSize: 12.5, lineHeight: 1.5 }}>{facilities}</span>
      </div>

      <div
        className="hr-althea"
        style={{ margin: 0, background: 'var(--border)' }}
      />

      <div className="flex flex-col gap-1">
        <span className="eyebrow">Status</span>
        {booking ? (
          <div className="flex flex-col gap-1">
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--sage-700)',
              }}
            >
              ● Terpakai
            </span>
            <div
              className="card-althea-flat"
              style={{
                padding: 10,
                marginTop: 4,
                background:
                  (booking.psikolog.clinicPsikologProfile?.color ??
                    'var(--sage-500)') + '15',
                borderLeft: `3px solid ${
                  booking.psikolog.clinicPsikologProfile?.color ??
                  'var(--sage-500)'
                }`,
                borderRadius: 6,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--teal-800)',
                }}
              >
                {shortName(booking.psikolog.fullName, booking.psikolog.email)}
              </div>
              <div className="caption" style={{ marginTop: 2 }}>
                {booking.service.name}
              </div>
              {booking.client?.name ? (
                <div
                  className="caption"
                  style={{ marginTop: 2, fontSize: 11 }}
                >
                  Klien: {booking.client.name}
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--fg-muted)',
            }}
          >
            ○ Kosong — slot tersedia
          </span>
        )}
      </div>

      <div
        className="flex items-start gap-2"
        style={{
          padding: 10,
          background: 'var(--info-soft, #e6f0f7)',
          borderRadius: 6,
          fontSize: 11,
          color: '#2c4a60',
          lineHeight: 1.45,
          marginTop: 'auto',
        }}
      >
        <span style={{ flexShrink: 0 }}>ⓘ</span>
        <span>
          Read-only. Untuk booking ke ruangan ini, hubungi admin klinik.
        </span>
      </div>
    </aside>
  );
}

export type { SlotDef };
