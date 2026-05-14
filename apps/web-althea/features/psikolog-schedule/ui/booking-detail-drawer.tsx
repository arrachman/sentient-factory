'use client';

import { useEffect } from 'react';
import { X, User, Briefcase, DoorOpen, CalendarDays, FileText } from 'lucide-react';
import { STATUS_LABEL } from '@/features/admin-booking/model/types';
import type { Booking, BookingStatus } from '@/features/admin-booking/model/types';

const STATUS_STYLE: Record<BookingStatus, { bg: string; color: string }> = {
  checked_in: { bg: '#dbeafe', color: '#1e40af' },
  in_progress: { bg: '#5b8a66', color: '#fff' },
  completed: { bg: '#ece6d3', color: '#6b6047' },
  cancelled: { bg: '#fee2e2', color: '#991b1b' },
};

const SVC_CATEGORY_LABEL: Record<string, string> = {
  konseling: 'Konseling',
  terapi: 'Terapi Dewasa',
  anak: 'Terapi Anak',
  tes: 'Tes Psikologi',
};

function formatDatetime(iso: string) {
  return new Date(iso).toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function BookingDetailDrawer({
  booking,
  onClose,
}: {
  booking: Booking | null;
  onClose: () => void;
}) {
  // Close on Escape
  useEffect(() => {
    if (!booking) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [booking, onClose]);

  const open = !!booking;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(20,40,40,0.35)',
          zIndex: 40,
          transition: 'opacity 0.2s',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
      />

      {/* Drawer panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 380,
          maxWidth: '90vw',
          background: 'var(--cream-50)',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
          zIndex: 41,
          display: 'flex',
          flexDirection: 'column',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.22s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {booking && <DrawerContent booking={booking} onClose={onClose} />}
      </div>
    </>
  );
}

function DrawerContent({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  const statusStyle = STATUS_STYLE[booking.status] ?? STATUS_STYLE.checked_in;
  const catLabel = SVC_CATEGORY_LABEL[booking.service.category] ?? booking.service.category;

  return (
    <>
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
          background: 'var(--cream-100, #f5f0e6)',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <span className="eyebrow" style={{ display: 'block', marginBottom: 4, fontSize: 10 }}>
            Detail Sesi
          </span>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--teal-800)',
              fontFamily: 'var(--font-serif)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {booking.client.name}
          </div>
          <span
            style={{
              display: 'inline-block',
              marginTop: 6,
              padding: '2px 8px',
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.04em',
              background: statusStyle.bg,
              color: statusStyle.color,
            }}
          >
            {STATUS_LABEL[booking.status] ?? booking.status}
          </span>
          {booking.createdViaWalkIn && (
            <span
              style={{
                display: 'inline-block',
                marginTop: 6,
                marginLeft: 6,
                padding: '2px 7px',
                borderRadius: 4,
                fontSize: 11,
                fontWeight: 600,
                background: '#fef3c7',
                color: '#92400e',
              }}
            >
              Walk-in
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          style={{
            flexShrink: 0,
            width: 28,
            height: 28,
            borderRadius: 6,
            border: 'none',
            background: 'rgba(0,0,0,0.06)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--fg-muted)',
          }}
        >
          <X size={14} />
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Layanan */}
          <Row icon={<Briefcase size={14} />} label="Layanan">
            <span style={{ fontWeight: 600, color: 'var(--teal-800)' }}>
              {booking.service.name}
            </span>
            <span
              className="caption"
              style={{
                marginLeft: 6,
                padding: '1px 6px',
                borderRadius: 3,
                background: 'var(--cream-200)',
                fontSize: 10,
              }}
            >
              {catLabel}
            </span>
            {booking.sessionTotal > 1 && (
              <span className="caption" style={{ marginLeft: 4, fontSize: 11 }}>
                · Sesi {booking.sessionN}/{booking.sessionTotal}
              </span>
            )}
          </Row>

          {/* Jadwal */}
          <Row icon={<CalendarDays size={14} />} label="Jadwal">
            <span style={{ fontWeight: 600, color: 'var(--teal-800)' }}>
              {formatDatetime(booking.scheduledStart)}
            </span>
            <span className="caption" style={{ display: 'block', marginTop: 1 }}>
              s/d {formatTime(booking.scheduledEnd)} · {booking.service.durationMinutes} menit
            </span>
          </Row>

          {/* Ruangan */}
          {booking.room && (
            <Row icon={<DoorOpen size={14} />} label="Ruangan">
              <span style={{ fontWeight: 600, color: 'var(--teal-800)' }}>
                {booking.room.name}
              </span>
              <span className="caption" style={{ marginLeft: 6, fontSize: 11 }}>
                {booking.room.type}
              </span>
            </Row>
          )}

          {/* Klien */}
          <Row icon={<User size={14} />} label="Klien">
            <span style={{ fontWeight: 600, color: 'var(--teal-800)' }}>
              {booking.client.name}
            </span>
            <span className="caption" style={{ display: 'block', marginTop: 1 }}>
              {booking.client.gender === 'male'
                ? 'Laki-laki'
                : booking.client.gender === 'female'
                  ? 'Perempuan'
                  : booking.client.gender}
              {booking.client.phoneWa && (
                <> · {booking.client.phoneWa}</>
              )}
            </span>
          </Row>

          {/* Keluhan / Catatan */}
          {booking.notes ? (
            <Row icon={<FileText size={14} />} label="Keluhan / Catatan">
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: 'var(--teal-800)',
                  lineHeight: 1.55,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {booking.notes}
              </p>
            </Row>
          ) : (
            <Row icon={<FileText size={14} />} label="Keluhan / Catatan">
              <span className="caption" style={{ fontStyle: 'italic' }}>
                Tidak ada catatan
              </span>
            </Row>
          )}

        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '14px 20px',
          borderTop: '1px solid var(--border)',
          background: 'var(--cream-100, #f5f0e6)',
        }}
      >
        <span className="caption" style={{ fontSize: 11 }}>
          ID Booking #{booking.id}
        </span>
      </div>
    </>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <div
        style={{
          flexShrink: 0,
          width: 28,
          height: 28,
          borderRadius: 6,
          background: 'var(--sage-50)',
          border: '1px solid var(--sage-100, #c5d8c8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--sage-600)',
          marginTop: 1,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span className="caption" style={{ display: 'block', fontSize: 10, marginBottom: 2 }}>
          {label}
        </span>
        {children}
      </div>
    </div>
  );
}
