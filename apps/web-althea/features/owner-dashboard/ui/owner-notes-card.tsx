import { Lightbulb } from 'lucide-react';

/**
 * Card "Catatan owner" — auto-generated note dari psikolog underutilized.
 */
export function OwnerNotesCard({ note }: { note: string }) {
  return (
    <div
      className="card-althea"
      style={{
        padding: 16,
        background: 'var(--info-soft)',
        borderColor: '#cfdde8',
      }}
    >
      <div className="flex items-start gap-2.5">
        <span
          aria-hidden
          style={{
            width: 26,
            height: 26,
            borderRadius: 999,
            background: '#ffffff80',
            color: '#2c4a60',
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
        >
          <Lightbulb size={14} strokeWidth={2.2} />
        </span>
        <div className="flex flex-col" style={{ gap: 4, minWidth: 0 }}>
          <span className="eyebrow" style={{ color: '#2c4a60' }}>
            Catatan owner
          </span>
          <p
            style={{
              fontSize: 12.5,
              color: '#2c4a60',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {note}
          </p>
        </div>
      </div>
    </div>
  );
}
