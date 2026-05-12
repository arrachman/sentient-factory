import type { RoomGroupAgg } from '../model/aggregate';
import { ROOM_GROUP_COLOR, ROOM_GROUP_LABEL } from '../model/constants';

/**
 * Card "Utilisasi ruangan" — group by type dengan progress bar masing-masing.
 */
export function RoomUtilizationCard({
  roomGroups,
}: {
  roomGroups: Record<string, RoomGroupAgg>;
}) {
  const entries = Object.entries(roomGroups);
  return (
    <div className="card-althea" style={{ padding: 20 }}>
      <h2
        style={{
          margin: '0 0 14px',
          fontFamily: 'var(--font-serif)',
          fontSize: 17,
          fontWeight: 500,
          color: 'var(--teal-800)',
        }}
      >
        Utilisasi ruangan
      </h2>
      <div className="flex flex-col gap-2">
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
      <span style={{ fontSize: 12.5, color: 'var(--fg)', flex: 1 }}>
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
      >
        <div
          style={{ width: `${pct}%`, height: '100%', background: color }}
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
