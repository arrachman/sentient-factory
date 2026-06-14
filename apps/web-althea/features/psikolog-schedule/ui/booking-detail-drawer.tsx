'use client';

import { useEffect, useMemo } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  CalendarPlus,
  AlertCircle,
} from 'lucide-react';
import { useClientDetail } from '@/features/admin-clients/hooks/use-client';
import {
  CATEGORY_PALETTE,
  type ClientCategory,
} from '@/features/admin-clients/model/types';
import { useBookingList } from '@/features/admin-booking/hooks/use-booking';
import { STATUS_LABEL } from '@/features/admin-booking/model/types';
import type { Booking } from '@/features/admin-booking/model/types';
import {
  STATUS_STYLE,
  DEFAULT_AVATAR_PALETTE,
  SVC_CATEGORY_LABEL,
  getInitials,
  formatTime,
  formatDateMedium,
} from './booking-detail-utils';
import {
  Card,
  FieldGrid,
  Field,
  FieldLabel,
  NoteBlock,
  Pill,
  SessionRow,
  Loading,
  EmptyState,
  ErrorRow,
  Muted,
  Footnote,
} from './booking-detail-primitives';
import { BookingModalHeader, SesiIniCard } from './booking-detail-sections';

export function BookingDetailDrawer({
  booking,
  onClose,
}: {
  booking: Booking | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!booking) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [booking, onClose]);

  useEffect(() => {
    if (!booking) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [booking]);

  const open = !!booking;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(20,40,40,0.45)',
        backdropFilter: 'blur(2px)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity 0.2s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-detail-title"
        style={{
          width: 720,
          maxWidth: '100%',
          maxHeight: '90vh',
          background: 'var(--cream-50)',
          borderRadius: 16,
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transform: open ? 'scale(1)' : 'scale(0.96)',
          transition: 'transform 0.22s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {booking && <ModalContent booking={booking} onClose={onClose} />}
      </div>
    </div>
  );
}

function ModalContent({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  const clientQ = useClientDetail(booking.client.id);
  const client = clientQ.data?.data;

  const clientBookingsQ = useBookingList({
    clientId: booking.client.id,
    limit: 100,
    includeCancelled: false,
  });

  const { upcoming } = useMemo(() => {
    const all = clientBookingsQ.data?.data ?? [];
    const now = Date.now();
    const future = all
      .filter((b) => {
        if (b.id === booking.id) return false;
        const status = b.status as string;
        if (status === 'cancelled' || status === 'completed') return false;
        return new Date(b.scheduledStart).getTime() > now;
      })
      .sort(
        (a, b) =>
          new Date(a.scheduledStart).getTime() - new Date(b.scheduledStart).getTime(),
      );
    return { upcoming: future };
  }, [clientBookingsQ.data, booking.id]);

  const recent = client?.recentSessions ?? [];

  const avatarPalette = client?.category
    ? CATEGORY_PALETTE[client.category as ClientCategory]
    : DEFAULT_AVATAR_PALETTE;
  const initials = getInitials(booking.client.name);
  const catLabel = SVC_CATEGORY_LABEL[booking.service.category] ?? booking.service.category;

  return (
    <>
      <BookingModalHeader
        booking={booking}
        client={client}
        initials={initials}
        avatarPalette={avatarPalette}
        onClose={onClose}
      />

      {/* BODY — plain block layout (flex column + gap caused first cards to shrink to zero) */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 32px 28px',
        }}
      >
        <SesiIniCard booking={booking} catLabel={catLabel} onClose={onClose} />

        {/* PROFIL KLIEN CARD */}
        <Card title="Profil klien" spacing>
          {clientQ.isLoading && <Loading>Memuat profil klien...</Loading>}
          {clientQ.isError && (
            <ErrorRow>
              <AlertCircle size={14} /> Tidak bisa ambil profil klien. Coba refresh.
            </ErrorRow>
          )}
          {client && (
            <>
              <FieldGrid>
                <Field label="WhatsApp" icon={<Phone size={13} />}>
                  {booking.client.phoneWa ? (
                    <span style={{ fontSize: 14, color: 'var(--teal-800)' }}>
                      {booking.client.phoneWa}
                    </span>
                  ) : (
                    <Muted>—</Muted>
                  )}
                </Field>

                {client.email && (
                  <Field label="Email" icon={<Mail size={13} />}>
                    <span
                      style={{
                        fontSize: 14,
                        color: 'var(--teal-800)',
                        wordBreak: 'break-all',
                      }}
                    >
                      {client.email}
                    </span>
                  </Field>
                )}
              </FieldGrid>

              {client.services && client.services.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <FieldLabel>Layanan terdaftar</FieldLabel>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                    {client.services.map((svc) => (
                      <Pill
                        key={svc.id}
                        bg="var(--sage-50)"
                        color="var(--sage-700, #385a43)"
                        border="var(--sage-100, #c5d8c8)"
                      >
                        {svc.name}
                      </Pill>
                    ))}
                  </div>
                </div>
              )}

              {client.address && (
                <NoteBlock label="Alamat" icon={<MapPin size={13} />}>
                  {client.address}
                </NoteBlock>
              )}

              {client.notes && (
                <NoteBlock label="Catatan klien" tone="warning">
                  {client.notes}
                </NoteBlock>
              )}
            </>
          )}
        </Card>

        {/* RIWAYAT & MENDATANG — 2-column grid */}
        <div
          style={{
            display: 'grid',
            gap: 16,
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          }}
        >
          {/* RIWAYAT */}
          <Card
            title="Riwayat sesi"
            subtitle={client ? `${client.totalBookings} sesi total` : null}
          >
            {clientQ.isLoading && <Loading>Memuat riwayat...</Loading>}
            {client && recent.length === 0 && !clientQ.isLoading && (
              <EmptyState>Belum ada sesi selesai.</EmptyState>
            )}
            {recent.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {recent.map((s) => (
                  <SessionRow
                    key={s.id}
                    tone="neutral"
                    icon={<CheckCircle2 size={14} />}
                    date={formatDateMedium(s.date)}
                    time={formatTime(s.date)}
                    title={s.serviceName ?? 'Layanan tidak diketahui'}
                    subtitle={s.psikologName ?? null}
                  />
                ))}
                {client && client.totalBookings > recent.length && (
                  <Footnote>
                    Menampilkan {recent.length} dari {client.totalBookings}. Buka halaman Klien untuk riwayat lengkap.
                  </Footnote>
                )}
              </div>
            )}
          </Card>

          {/* MENDATANG */}
          <Card
            title="Sesi mendatang"
            subtitle={upcoming.length > 0 ? `${upcoming.length} terjadwal` : null}
          >
            {clientBookingsQ.isLoading && <Loading>Memuat jadwal...</Loading>}
            {!clientBookingsQ.isLoading && upcoming.length === 0 && (
              <EmptyState>Tidak ada sesi terjadwal setelah ini.</EmptyState>
            )}
            {upcoming.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {upcoming.slice(0, 6).map((b) => (
                  <SessionRow
                    key={b.id}
                    tone="upcoming"
                    icon={<CalendarPlus size={14} />}
                    date={formatDateMedium(b.scheduledStart)}
                    time={formatTime(b.scheduledStart)}
                    title={b.service.name}
                    subtitle={b.psikolog.fullName ?? b.psikolog.email}
                    rightBadge={STATUS_LABEL[b.status] ?? b.status}
                    rightBadgeStyle={STATUS_STYLE[b.status]}
                  />
                ))}
                {upcoming.length > 6 && (
                  <Footnote>+{upcoming.length - 6} sesi mendatang lainnya.</Footnote>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* FOOTER */}
      <footer
        style={{
          padding: '12px 32px',
          borderTop: '1px solid var(--border)',
          background: 'var(--cream-100, #f5f0e6)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 11,
          color: 'var(--fg-muted)',
        }}
      >
        <span>Booking #{booking.id}</span>
        {client && <span>Klien #{client.id}</span>}
      </footer>
    </>
  );
}
