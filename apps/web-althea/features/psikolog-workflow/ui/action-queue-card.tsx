import { ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type QueueItem = {
  icon: LucideIcon;
  title: string;
  sub: string;
  href?: string;
};

/**
 * Card "Perlu tindakan" — list reminder action untuk psikolog.
 * Item dibuat dari endpoint dashboard-stats (pendingNotes + packageEndingSoon).
 * Klik baris → navigate ke halaman terkait (sessions / schedule).
 */
export function ActionQueueCard({ queue }: { queue: QueueItem[] }) {
  return (
    <div className="card-althea" style={{ padding: 20 }}>
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: 12 }}
      >
        <h2
          style={{
            margin: 0,
            fontFamily: 'var(--font-serif)',
            fontSize: 17,
            fontWeight: 500,
            color: 'var(--teal-800)',
          }}
        >
          Perlu tindakan
        </h2>
        <span
          className="badge"
          style={{
            background: 'var(--warn-soft, #fbf3dc)',
            color: '#7a5a1f',
            height: 20,
          }}
        >
          {queue.length}
        </span>
      </div>
      {queue.length === 0 ? (
        <div
          className="caption"
          style={{ padding: 12, textAlign: 'center' }}
        >
          Belum ada tindakan tertunda.
        </div>
      ) : (
        <div className="flex flex-col" style={{ gap: 0 }}>
          {queue.map((q, i) => (
            <QueueRow key={i} item={q} hasBorderTop={i > 0} />
          ))}
        </div>
      )}
    </div>
  );
}

function QueueRow({
  item: q,
  hasBorderTop,
}: {
  item: QueueItem;
  hasBorderTop: boolean;
}) {
  const Ic = q.icon;
  const Wrapper: React.ElementType = q.href ? 'a' : 'div';
  const wrapperProps = q.href
    ? { href: q.href, style: { textDecoration: 'none', color: 'inherit' } }
    : {};
  return (
    <Wrapper
      {...wrapperProps}
      className="flex items-center gap-2"
      style={{
        padding: '10px 4px',
        borderTop: hasBorderTop ? '1px solid var(--border)' : 'none',
        cursor: q.href ? 'pointer' : 'default',
        ...(wrapperProps as { style?: object }).style,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          background: 'var(--cream-100)',
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
        }}
      >
        <Ic size={13} style={{ color: 'var(--teal-700)' }} />
      </div>
      <div className="flex flex-col" style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg)' }}
        >
          {q.title}
        </span>
        <span
          className="caption"
          style={{
            fontSize: 11,
            marginTop: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {q.sub}
        </span>
      </div>
      {q.href ? (
        <ChevronRight size={14} style={{ color: 'var(--fg-muted)', flexShrink: 0 }} />
      ) : null}
    </Wrapper>
  );
}
