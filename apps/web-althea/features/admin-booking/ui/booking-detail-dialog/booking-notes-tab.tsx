import type { ClinicalNote } from '../../api/booking.api';

/**
 * Tab "Catatan klinis" — list semua catatan untuk booking ini.
 */
export function BookingNotesTab({
  notes,
  isLoading,
}: {
  notes: ClinicalNote[];
  isLoading: boolean;
}) {
  return (
    <div className="space-y-2">
      {isLoading ? (
        <div className="caption">Memuat catatan...</div>
      ) : null}
      {notes.map((n) => (
        <div key={n.id} className="card-althea p-3 bg-cream-50">
          <div className="flex items-center justify-between mb-1">
            <span className="caption text-fg-muted">
              {new Date(n.createdAt).toLocaleString('id-ID')}
            </span>
            {n.isPrivate ? (
              <span className="badge badge-neutral">Private</span>
            ) : null}
          </div>
          <div className="whitespace-pre-wrap text-sm">{n.noteText}</div>
        </div>
      ))}
      {!isLoading && notes.length === 0 ? (
        <div className="caption text-center py-8 text-fg-muted">
          Belum ada catatan klinis untuk booking ini.
        </div>
      ) : null}
    </div>
  );
}
