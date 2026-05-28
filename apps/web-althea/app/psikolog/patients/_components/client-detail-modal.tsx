'use client';

import { useEffect, useMemo } from 'react';
import {
  X,
  Clock,
  DoorOpen,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  CalendarPlus,
  AlertCircle,
  BellOff,
  CalendarOff,
  Check,
} from 'lucide-react';
import { useClientDetail } from '@/features/admin-clients/hooks/use-client';
import {
  CATEGORY_LABEL,
  CATEGORY_PALETTE,
  GENDER_LABEL,
  STATUS_LABEL as CLIENT_STATUS_LABEL,
  type ClientCategory,
  type ClientStatus,
  type Gender,
} from '@/features/admin-clients/model/types';
import {
  useBookingList,
  useCompleteBooking,
} from '@/features/admin-booking/hooks/use-booking';
import { STATUS_LABEL } from '@/features/admin-booking/model/types';
import type { Booking, BookingStatus } from '@/features/admin-booking/model/types';

const STATUS_STYLE: Record<BookingStatus, { bg: string; color: string }> = {
  checked_in: { bg: '#dbeafe', color: '#1e40af' },
  in_progress: { bg: '#5b8a66', color: '#fff' },
  completed: { bg: '#ece6d3', color: '#6b6047' },
  cancelled: { bg: '#fee2e2', color: '#991b1b' },
};

const CLIENT_STATUS_STYLE: Record<ClientStatus, { bg: string; color: string }> = {
  aktif: { bg: '#dcebe0', color: '#385a43' },
  baru: { bg: '#fef3c7', color: '#92400e' },
  selesai: { bg: '#ece6d3', color: '#6b6047' },
};

const DEFAULT_AVATAR_PALETTE = { bg: '#dcebe0', fg: '#385a43' };

function genderLabel(g: string | null | undefined): string {
  if (!g) return '—';
  if (g === 'L' || g === 'P') return GENDER_LABEL[g];
  if (g === 'male') return 'Laki-laki';
  if (g === 'female') return 'Perempuan';
  return g;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatLongDate(iso: string) {
  return new Date(iso).toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDateMedium(iso: string) {
  return new Date(iso).toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function ClientDetailModal({
  clientId,
  onClose,
}: {
  clientId: number | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (clientId == null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [clientId, onClose]);

  useEffect(() => {
    if (clientId == null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [clientId]);

  const open = clientId != null;

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
        aria-labelledby="client-detail-title"
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
        {clientId != null && <ModalContent clientId={clientId} onClose={onClose} />}
      </div>
    </div>
  );
}

function ModalContent({ clientId, onClose }: { clientId: number; onClose: () => void }) {
  const clientQ = useClientDetail(clientId);
  const client = clientQ.data?.data;

  const clientBookingsQ = useBookingList({
    clientId,
    limit: 100,
    includeCancelled: false,
  });

  const { upcoming, nextBooking } = useMemo(() => {
    const all = clientBookingsQ.data?.data ?? [];
    const now = Date.now();
    const active = all
      .filter((b) => {
        const status = b.status as string;
        if (status === 'cancelled' || status === 'completed') return false;
        return new Date(b.scheduledEnd).getTime() > now;
      })
      .sort(
        (a, b) =>
          new Date(a.scheduledStart).getTime() - new Date(b.scheduledStart).getTime(),
      );
    return { upcoming: active, nextBooking: active[0] ?? null };
  }, [clientBookingsQ.data]);

  const recent = client?.recentSessions ?? [];
  const restUpcoming = nextBooking ? upcoming.slice(1) : upcoming;

  const avatarPalette = client?.category
    ? CATEGORY_PALETTE[client.category as ClientCategory]
    : DEFAULT_AVATAR_PALETTE;
  const name = client?.name ?? 'Memuat…';
  const initials = client ? getInitials(client.name) : '…';

  return (
    <>
      {/* HERO HEADER */}
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
          {/* Avatar */}
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

          {/* Title block */}
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
            <div
              style={{
                marginTop: 10,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6,
              }}
            >
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

      {/* BODY */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 32px 28px',
        }}
      >
        {/* SESI BERIKUTNYA CARD */}
        <Card title="Sesi berikutnya" spacing>
          {clientBookingsQ.isLoading && <Loading>Memuat jadwal…</Loading>}
          {!clientBookingsQ.isLoading && !nextBooking && (
            <EmptyHero>
              <CalendarOff size={18} style={{ opacity: 0.6 }} />
              <div>
                <div style={{ fontWeight: 600, color: 'var(--teal-800)', fontSize: 14 }}>
                  Belum ada sesi terjadwal
                </div>
                <div className="caption" style={{ marginTop: 2 }}>
                  Hubungi admin untuk menjadwalkan sesi berikutnya.
                </div>
              </div>
            </EmptyHero>
          )}
          {nextBooking && <NextSessionBlock booking={nextBooking} />}
        </Card>

        {/* PROFIL KLIEN CARD */}
        <Card title="Profil klien" spacing>
          {clientQ.isLoading && <Loading>Memuat profil klien…</Loading>}
          {clientQ.isError && (
            <ErrorRow>
              <AlertCircle size={14} /> Tidak bisa ambil profil klien. Coba refresh.
            </ErrorRow>
          )}
          {client && (
            <>
              <FieldGrid>
                <Field label="WhatsApp" icon={<Phone size={13} />}>
                  {client.phoneWa ? (
                    <span style={{ fontSize: 14, color: 'var(--teal-800)' }}>
                      {client.phoneWa}
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
            {clientQ.isLoading && <Loading>Memuat riwayat…</Loading>}
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
                    Menampilkan {recent.length} dari {client.totalBookings} sesi total.
                  </Footnote>
                )}
              </div>
            )}
          </Card>

          {/* MENDATANG (selain "Sesi berikutnya" di atas) */}
          <Card
            title="Sesi mendatang lain"
            subtitle={restUpcoming.length > 0 ? `${restUpcoming.length} terjadwal` : null}
          >
            {clientBookingsQ.isLoading && <Loading>Memuat jadwal…</Loading>}
            {!clientBookingsQ.isLoading && restUpcoming.length === 0 && (
              <EmptyState>
                {nextBooking ? 'Tidak ada sesi lain setelah yang berikutnya.' : 'Tidak ada sesi terjadwal.'}
              </EmptyState>
            )}
            {restUpcoming.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {restUpcoming.slice(0, 6).map((b) => (
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
                {restUpcoming.length > 6 && (
                  <Footnote>+{restUpcoming.length - 6} sesi mendatang lainnya.</Footnote>
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
        <span>Klien #{clientId}</span>
        {client?.medicalRecordNumber && <span>MRN {client.medicalRecordNumber}</span>}
      </footer>
    </>
  );
}

function NextSessionBlock({ booking }: { booking: Booking }) {
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
        <div
          style={{
            marginTop: 16,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
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

/* ---------------- Primitives (mirror booking-detail-drawer) ---------------- */

function Card({
  title,
  subtitle,
  spacing = false,
  children,
}: {
  title: string;
  subtitle?: string | null;
  spacing?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid var(--border)',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        overflow: 'hidden',
        marginBottom: spacing ? 20 : 0,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 8,
          borderBottom: '1px solid var(--border)',
          background: 'rgba(245,240,230,0.4)',
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--teal-800)',
            letterSpacing: '0.01em',
          }}
        >
          {title}
        </h3>
        {subtitle && (
          <span style={{ fontSize: 11, color: 'var(--fg-muted)', fontWeight: 500 }}>
            {subtitle}
          </span>
        )}
      </div>
      <div style={{ padding: '16px 18px' }}>{children}</div>
    </div>
  );
}

function FieldGrid({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gap: 14,
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      }}
    >
      {children}
    </div>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <FieldLabel icon={icon}>{label}</FieldLabel>
      <div style={{ marginTop: 4 }}>{children}</div>
    </div>
  );
}

function FieldLabel({
  icon,
  children,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: 'var(--fg-muted)',
      }}
    >
      {icon && <span style={{ display: 'inline-flex' }}>{icon}</span>}
      {children}
    </div>
  );
}

function NoteBlock({
  label,
  icon,
  tone = 'default',
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  tone?: 'default' | 'warning';
  children: React.ReactNode;
}) {
  const bg = tone === 'warning' ? '#fff7ed' : 'var(--cream-50, #fbfaf6)';
  const border = tone === 'warning' ? '#fed7aa' : 'var(--border)';
  return (
    <div style={{ marginTop: 16 }}>
      <FieldLabel icon={icon}>{label}</FieldLabel>
      <div
        style={{
          marginTop: 4,
          padding: '10px 12px',
          borderRadius: 8,
          background: bg,
          border: `1px solid ${border}`,
          fontSize: 13,
          lineHeight: 1.55,
          color: 'var(--teal-800)',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Pill({
  bg,
  color,
  border,
  icon,
  size = 'md',
  children,
}: {
  bg: string;
  color: string;
  border?: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'md';
  children: React.ReactNode;
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: size === 'sm' ? '1px 7px' : '3px 9px',
        borderRadius: 999,
        fontSize: size === 'sm' ? 10 : 11,
        fontWeight: 600,
        letterSpacing: '0.02em',
        background: bg,
        color,
        border: border ? `1px solid ${border}` : 'none',
        lineHeight: 1.4,
      }}
    >
      {icon}
      {children}
    </span>
  );
}

function SessionRow({
  icon,
  tone,
  date,
  time,
  title,
  subtitle,
  rightBadge,
  rightBadgeStyle,
}: {
  icon: React.ReactNode;
  tone: 'neutral' | 'upcoming';
  date: string;
  time: string;
  title: string;
  subtitle: string | null;
  rightBadge?: string;
  rightBadgeStyle?: { bg: string; color: string };
}) {
  const iconBg = tone === 'upcoming' ? 'var(--sage-50)' : 'var(--cream-100, #f5f0e6)';
  const iconColor = tone === 'upcoming' ? 'var(--sage-700, #385a43)' : '#6b6047';
  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        padding: '10px 12px',
        borderRadius: 8,
        background: 'var(--cream-50, #fbfaf6)',
        border: '1px solid var(--border)',
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: iconBg,
          color: iconColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 1,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 6,
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--teal-800)',
            }}
          >
            {date}
          </span>
          <span
            style={{
              fontSize: 11,
              color: 'var(--fg-muted)',
              fontWeight: 500,
            }}
          >
            {time}
          </span>
        </div>
        <div
          style={{
            fontSize: 12,
            color: 'var(--teal-800)',
            marginTop: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: 11,
              color: 'var(--fg-muted)',
              marginTop: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
      {rightBadge && rightBadgeStyle && (
        <Pill bg={rightBadgeStyle.bg} color={rightBadgeStyle.color} size="sm">
          {rightBadge}
        </Pill>
      )}
    </div>
  );
}

function Loading({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: '12px 0',
        fontSize: 12,
        color: 'var(--fg-muted)',
        fontStyle: 'italic',
      }}
    >
      {children}
    </div>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: '12px 0',
        fontSize: 12,
        color: 'var(--fg-muted)',
        fontStyle: 'italic',
        textAlign: 'center',
      }}
    >
      {children}
    </div>
  );
}

function EmptyHero({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: '20px 18px',
        borderRadius: 10,
        background: 'var(--cream-50, #fbfaf6)',
        border: '1px dashed var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        color: 'var(--fg-muted)',
      }}
    >
      {children}
    </div>
  );
}

function ErrorRow({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '10px 12px',
        borderRadius: 8,
        background: '#fee2e2',
        color: '#991b1b',
        fontSize: 12,
      }}
    >
      {children}
    </div>
  );
}

function Muted({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontStyle: 'italic', color: 'var(--fg-muted)', fontSize: 13 }}>
      {children}
    </span>
  );
}

function Footnote({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        marginTop: 2,
        fontSize: 11,
        color: 'var(--fg-muted)',
        fontStyle: 'italic',
        padding: '0 4px',
      }}
    >
      {children}
    </div>
  );
}
