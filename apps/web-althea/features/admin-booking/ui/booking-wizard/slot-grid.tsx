'use client';

/**
 * Grid slot tersedia.
 *
 * Default: slot di `unavailableSlotIdx` di-hide (booking wizard pattern — UX bersih).
 *
 * Bila `slotBookings` di-pass (mode reschedule): slot terbooking tetap **tampil**
 * sebagai card disabled dengan info klien + status, supaya admin paham slot mana
 * yang penuh dan oleh siapa. Slot lain di unavailableSlotIdx (past/psikolog-off)
 * tetap di-hide.
 */
type Slot = { start: string; end: string; label?: string };

export type SlotBookingInfo = {
  clientName: string;
  statusLabel: string;
};

export function SlotGrid({
  slots,
  unavailableSlotIdx,
  slotIdx,
  psikologName,
  isLoadingBookings,
  onPick,
  slotBookings,
}: {
  slots: Slot[];
  unavailableSlotIdx: Set<number>;
  slotIdx: number | null;
  psikologName: string | null;
  isLoadingBookings: boolean;
  onPick: (idx: number) => void;
  slotBookings?: Map<number, SlotBookingInfo>;
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

  // Slot ditampilkan jika:
  //   - tidak unavailable, ATAU
  //   - punya info booking (mode reschedule: tampil disabled dengan info klien)
  // Slot unavailable tanpa info booking (past time, di luar window psikolog) tetap di-hide.
  const visibleSlots = slots
    .map((slot, i) => ({ slot, i }))
    .filter(({ i }) => !unavailableSlotIdx.has(i) || slotBookings?.has(i));
  const availableCount = visibleSlots.filter(
    ({ i }) => !unavailableSlotIdx.has(i),
  ).length;

  return (
    <div>
      <label className="caption mb-1 block">
        Slot tersedia untuk{' '}
        <strong className="text-teal-800">{psikologName ?? 'psikolog'}</strong>
      </label>
      {availableCount === 0 ? (
        <p className="caption italic text-fg-muted px-3 py-3 rounded-md bg-amber-50 border border-amber-200">
          Tidak ada slot tersedia di tanggal ini. Pilih tanggal lain atau ganti
          psikolog. (Override hanya bypass validasi jam buka — slot yang sudah
          dibooking tetap tidak bisa dipilih.)
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {visibleSlots.map(({ slot, i }) => {
              const active = slotIdx === i;
              const booking = slotBookings?.get(i);
              const disabled = unavailableSlotIdx.has(i);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => !disabled && onPick(i)}
                  disabled={disabled}
                  title={
                    booking
                      ? `Sudah dibooking: ${booking.clientName} — ${booking.statusLabel}`
                      : undefined
                  }
                  className={`px-3 py-2 rounded-md border text-sm font-medium transition-colors text-left ${
                    active
                      ? 'bg-sage-50 border-sage-500 text-teal-800'
                      : disabled
                        ? 'bg-cream-100 border-cream-200 text-fg-muted cursor-not-allowed opacity-80'
                        : 'bg-card border-border text-fg hover:border-sage-300'
                  }`}
                >
                  <div
                    className={`font-semibold ${disabled ? 'line-through' : ''}`}
                  >
                    {slot.start} – {slot.end}
                  </div>
                  <div className="caption mt-0.5 truncate">
                    {booking
                      ? `🔒 ${booking.clientName} · ${booking.statusLabel}`
                      : slot.label || 'tersedia'}
                  </div>
                </button>
              );
            })}
          </div>
          {!isLoadingBookings && availableCount < slots.length ? (
            <p className="caption mt-1.5 text-fg-muted">
              {availableCount} dari {slots.length} slot tersedia di tanggal ini.
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
