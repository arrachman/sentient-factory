'use client';

/**
 * Aside kiri halaman Catatan Klinis — list sesi (timeline) + asesmen stub.
 */
import type { Booking } from '@/features/admin-booking/model/types';
import { formatSessionShort, formatTimeOnly } from '../model/format';

export function SessionsAside({
  items,
  isLoading,
  selectedId,
  onSelect,
}: {
  items: Booking[];
  isLoading: boolean;
  selectedId: number | null;
  onSelect: (id: number) => void;
}) {
  return (
    <aside
      style={{
        width: 260,
        borderRight: '1px solid var(--border)',
        padding: '20px 16px',
        background: 'var(--cream-50)',
        overflow: 'auto',
        flexShrink: 0,
      }}
    >
      <span
        className="eyebrow"
        style={{ marginBottom: 10, display: 'block' }}
      >
        Riwayat sesi
      </span>
      <div className="flex flex-col" style={{ gap: 6 }}>
        {isLoading ? (
          <span className="caption">Memuat...</span>
        ) : items.length === 0 ? (
          <span className="caption">Belum ada sesi.</span>
        ) : (
          items
            .slice(0, 20)
            .map((b) => (
              <SessionTimelineItem
                key={b.id}
                b={b}
                selected={b.id === selectedId}
                onClick={() => onSelect(b.id)}
              />
            ))
        )}
      </div>

      <AssessmentStub />
    </aside>
  );
}

function SessionTimelineItem({
  b,
  selected,
  onClick,
}: {
  b: Booking;
  selected: boolean;
  onClick: () => void;
}) {
  const isCompleted = b.status === 'completed';
  const isInProgress = b.status === 'in_progress';
  const statusLabel = isCompleted
    ? 'Selesai'
    : isInProgress
      ? 'Berlangsung'
      : b.status === 'checked_in'
        ? 'Check-in'
        : 'Akan datang';
  const statusColor = isCompleted
    ? 'var(--sage-700)'
    : isInProgress
      ? 'var(--success, #4f8c5b)'
      : 'var(--fg-muted)';

  return (
    <button
      type="button"
      onClick={onClick}
      className="card-althea-flat text-left"
      style={{
        padding: 12,
        background: selected ? 'var(--sage-50)' : 'var(--bg-elev, #fff)',
        border:
          '1px solid ' +
          (selected ? 'var(--sage-300)' : 'var(--border)'),
        cursor: 'pointer',
        width: '100%',
      }}
    >
      <span
        style={{
          fontSize: 12.5,
          fontWeight: 600,
          color: 'var(--teal-800)',
        }}
      >
        Sesi #{b.id} · {formatSessionShort(b.scheduledStart)}
      </span>
      <div className="caption" style={{ fontSize: 11, marginTop: 2 }}>
        {formatTimeOnly(b.scheduledStart)} · {b.room.name}
      </div>
      <div
        className="caption"
        style={{
          fontSize: 10.5,
          marginTop: 4,
          color: statusColor,
        }}
      >
        ● {statusLabel}
      </div>
    </button>
  );
}

const ASSESSMENT_STUBS = [
  { label: 'GAD-7', score: '— / 21', sev: '—' },
  { label: 'PHQ-9', score: '— / 27', sev: '—' },
];

function AssessmentStub() {
  return (
    <>
      <span
        className="eyebrow"
        style={{ marginTop: 18, marginBottom: 8, display: 'block' }}
      >
        Asesmen
      </span>
      <div className="flex flex-col" style={{ gap: 6 }}>
        {ASSESSMENT_STUBS.map((it) => (
          <div
            key={it.label}
            className="card-althea-flat"
            style={{
              padding: 10,
              background: 'var(--bg-elev, #fff)',
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--teal-800)',
              }}
            >
              {it.label}
            </span>
            <div
              className="flex items-center justify-between"
              style={{ marginTop: 4 }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--fg-muted)',
                  fontFamily: 'var(--font-serif)',
                }}
              >
                {it.score}
              </span>
              <span
                className="badge"
                style={{
                  background: 'var(--cream-200)',
                  color: 'var(--fg-muted)',
                  height: 18,
                  fontSize: 10,
                }}
              >
                {it.sev}
              </span>
            </div>
          </div>
        ))}
      </div>
      <p className="caption" style={{ marginTop: 8, fontSize: 10.5 }}>
        Asesmen endpoint belum tersedia (UI stub).
      </p>
    </>
  );
}
