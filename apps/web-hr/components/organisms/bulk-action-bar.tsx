'use client';

// Toolbar shown above a list table when ≥1 row is selected (§2.9.H). Ported from
// web-erp; generic — pass the batch actions for the entity. Uses the Fase-1
// `.bulk-bar` / `.ba-btn` chrome CSS.

export interface BulkAction {
  label: string;
  onClick: () => void;
  danger?: boolean;
}

export function BulkActionBar({
  count,
  actions,
  onCancel,
}: {
  count: number;
  actions: BulkAction[];
  onCancel: () => void;
}) {
  if (count <= 0) return null;
  return (
    <div className="bulk-bar">
      <span className="count">{count} baris dipilih</span>
      <div className="divider" />
      {actions.map((a, i) => (
        <button key={`${a.label}-${i}`} className={`ba-btn${a.danger ? ' danger' : ''}`} onClick={a.onClick}>
          {a.label}
        </button>
      ))}
      <div className="divider" />
      <button className="ba-btn" onClick={onCancel}>
        Batal pilihan
      </button>
    </div>
  );
}
