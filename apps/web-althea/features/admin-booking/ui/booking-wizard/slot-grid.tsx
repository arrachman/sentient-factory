'use client';

/**
 * Grid slot tersedia — hanya tampilkan slot yang NOT di unavailableSlotIdx.
 * Slot yang sudah taken (overlap booking, di luar window psikolog, klinik tutup)
 * di-strip dari list supaya UX bersih (no strikethrough clutter).
 */
type Slot = { start: string; end: string; label?: string };

export function SlotGrid({
  slots,
  unavailableSlotIdx,
  slotIdx,
  psikologName,
  isLoadingBookings,
  onPick,
}: {
  slots: Slot[];
  unavailableSlotIdx: Set<number>;
  slotIdx: number | null;
  psikologName: string | null;
  isLoadingBookings: boolean;
  onPick: (idx: number) => void;
}) {
  if (slots.length === 0) {
    return (
      <div>
        <label className="caption mb-1 block">Slot tersedia</label>
        <p className="caption italic text-fg-muted">
          Belum ada slot operasional. Set di Pengaturan → Slot Operasional dulu.
        </p>
      </div>
    );
  }

  const visibleSlots = slots
    .map((slot, i) => ({ slot, i }))
    .filter(({ i }) => !unavailableSlotIdx.has(i));

  return (
    <div>
      <label className="caption mb-1 block">
        Slot tersedia untuk{' '}
        <strong className="text-teal-800">{psikologName ?? 'psikolog'}</strong>
      </label>
      {visibleSlots.length === 0 ? (
        <p className="caption italic text-fg-muted px-3 py-3 rounded-md bg-amber-50 border border-amber-200">
          Tidak ada slot tersedia di tanggal ini. Pilih tanggal lain atau ganti
          psikolog. (Override hanya bypass validasi jam buka — slot yang sudah
          dibooking tetap tidak tampil.)
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {visibleSlots.map(({ slot, i }) => {
              const active = slotIdx === i;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => onPick(i)}
                  className={`px-3 py-2 rounded-md border text-sm font-medium transition-colors text-left ${
                    active
                      ? 'bg-sage-50 border-sage-500 text-teal-800'
                      : 'bg-card border-border text-fg hover:border-sage-300'
                  }`}
                >
                  <div className="font-semibold">
                    {slot.start} – {slot.end}
                  </div>
                  <div className="caption mt-0.5">{slot.label || 'tersedia'}</div>
                </button>
              );
            })}
          </div>
          {!isLoadingBookings && unavailableSlotIdx.size > 0 ? (
            <p className="caption mt-1.5 text-fg-muted">
              {visibleSlots.length} dari {slots.length} slot tersedia di tanggal ini.
            </p>
          ) : null}
        </>
      )}
      {isLoadingBookings ? (
        <p className="caption mt-1 text-fg-muted">Mengecek slot kosong…</p>
      ) : null}
    </div>
  );
}
