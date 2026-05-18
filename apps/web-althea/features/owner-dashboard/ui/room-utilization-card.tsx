import { DoorOpen } from 'lucide-react';
import type { RoomGroupAgg } from '../model/aggregate';
import { ROOM_GROUP_COLOR, ROOM_GROUP_LABEL } from '../model/constants';

/**
 * Card "Utilisasi ruangan" — group by type dengan progress bar masing-masing.
 */
export function RoomUtilizationCard({
  roomGroups,
  periodLabel,
}: {
  roomGroups: Record<string, RoomGroupAgg>;
  periodLabel: string;
}) {
  const entries = Object.entries(roomGroups);
  return (
    <div className="card-althea" style={{ padding: 20 }}>
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: 14 }}
      >
        <div className="flex flex-col">
          <h2
            style={{
              margin: 0,
              fontFamily: 'var(--font-serif)',
              fontSize: 17,
              fontWeight: 500,
              color: 'var(--teal-800)',
            }}
          >
            Utilisasi ruangan
          </h2>
          <span className="caption" style={{ marginTop: 2 }}>
            Per jenis ruangan · {periodLabel}
          </span>
        </div>
        <span
          aria-hidden
          style={{
            width: 28,
            height: 28,
            borderRadius: 999,
            background: 'var(--amber-100)',
            color: '#8a4a00',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <DoorOpen size={14} strokeWidth={2.2} />
        </span>
      </div>
      <div className="flex flex-col gap-2.5">
        {entries.length === 0 ? (
          <span className="caption text-fg-muted">
            Belum ada ruangan terdaftar.
          </span>
        ) : (
          entries.map(([type, agg]) => (
            <RoomUtilizationRow
              key={type}
              label={ROOM_GROUP_LABEL[type] ?? type}
              used={agg.used}
              max={agg.max}
              color={ROOM_GROUP_COLOR[type] ?? 'var(--sage-500)'}
            />
          ))
        )}
      </div>
    </div>
  );
}

function RoomUtilizationRow({
  label,
  used,
  max,
  color,
}: {
  label: string;
  used: number;
  max: number;
  color: string;
}) {
  const pct = max > 0 ? Math.min(100, (used / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span
        style={{
          fontSize: 12.5,
          color: 'var(--fg)',
          flex: 1,
          minWidth: 0,
        }}
      >
        {label}
      </span>
      <div
        style={{
          flex: 2,
          height: 6,
          background: 'var(--cream-200)',
          borderRadius: 999,
          overflow: 'hidden',
        }}
        aria-hidden
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: color,
            transition: 'width 200ms ease',
          }}
        />
      </div>
      <span
        style={{
          fontSize: 11,
          color: 'var(--fg-muted)',
          fontVariantNumeric: 'tabular-nums',
          width: 56,
          textAlign: 'right',
        }}
      >
        {used}/{max} slot
      </span>
    </div>
  );
}
