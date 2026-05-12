import { Plus } from 'lucide-react';

/**
 * Slot kosong placeholder — dashed border + ikon plus.
 * Klik buka BookingWizard.
 */
export function EmptySlot({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        height: '100%',
        width: '100%',
        borderRadius: 8,
        border: '1px dashed var(--border-strong, #d8d3c3)',
        display: 'grid',
        placeItems: 'center',
        cursor: 'pointer',
        color: 'var(--fg-subtle, #b8b3a3)',
        background: 'transparent',
      }}
      aria-label="Slot kosong — klik untuk booking baru"
    >
      <Plus size={16} />
    </button>
  );
}
