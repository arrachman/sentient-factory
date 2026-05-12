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
      <span className="eyebrow" style={{ color: '#2c4a60' }}>
        Catatan owner
      </span>
      <p
        style={{
          fontSize: 12.5,
          color: '#2c4a60',
          margin: '6px 0 0',
          lineHeight: 1.5,
        }}
      >
        {note}
      </p>
    </div>
  );
}
