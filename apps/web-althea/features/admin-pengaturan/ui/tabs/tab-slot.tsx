'use client';

/**
 * Tab "Slot Operasional"
 *
 * Mengganti tab "Jam Operasional" lama (per-day open/close window) dengan
 * konsep slot terdefinisi:
 *   - List slot waktu (mis. 08:30-10:00 "Pagi 1") — booking harus pas dengan
 *     salah satu slot
 *   - Toggle hari tutup (mis. Minggu off)
 *   - Buffer minutes (default 15) — jeda antar booking
 *   - Holidays ad-hoc (tanggal libur tambahan)
 *
 * Sumber default seed: mockup `apps/psychology-design/althea-data.jsx`
 * (6 slot 90 menit, 08:30-18:15) — sudah disetujui klien (PRD #6).
 */
import { Plus, Trash2 } from 'lucide-react';
import type { SlotDef, UpdateSettingsInput } from '../../api/settings.api';
import { DEFAULT_SLOT, HARI } from '../../model/constants';

type Props = {
  form: UpdateSettingsInput;
  set: <K extends keyof UpdateSettingsInput>(key: K, value: UpdateSettingsInput[K]) => void;
  addSlot: (slot: SlotDef) => void;
  updateSlot: (idx: number, partial: Partial<SlotDef>) => void;
  removeSlot: (idx: number) => void;
  toggleClosedDay: (dayIndex: number) => void;
};

export function TabSlot({
  form,
  set,
  addSlot,
  updateSlot,
  removeSlot,
  toggleClosedDay,
}: Props) {
  const slots = form.slotsOfDay ?? [];
  const closed = form.closedDayOfWeek ?? [];

  return (
    <div className="flex flex-col gap-6">
      {/* Section: Slot harian */}
      <section className="card-althea bg-card">
        <header className="px-5 py-4 border-b border-border">
          <h2 className="h2 m-0">Slot Operasional</h2>
          <p className="caption mt-1">
            Jam slot yang tersedia untuk booking. Setiap booking harus pas dengan salah satu
            slot di bawah. Default 6 slot × 90 menit (sesuai standar klinik).
          </p>
        </header>

        <div className="px-5 py-4">
          {slots.length === 0 ? (
            <div className="caption italic text-fg-muted py-6 text-center">
              Belum ada slot — tambah minimal 1 slot supaya admin bisa booking.
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div
                className="grid items-center px-3 py-1.5 text-[11px] font-semibold text-fg-muted uppercase tracking-wider"
                style={{ gridTemplateColumns: '1fr 1fr 2fr 36px' }}
              >
                <span>Mulai</span>
                <span>Selesai</span>
                <span>Label (opsional)</span>
                <span />
              </div>
              {slots.map((s, i) => (
                <div
                  key={i}
                  className="grid items-center gap-2 px-3 py-2 rounded-md bg-cream-50 border border-border"
                  style={{ gridTemplateColumns: '1fr 1fr 2fr 36px' }}
                >
                  <input
                    type="time"
                    value={s.start}
                    onChange={(e) => updateSlot(i, { start: e.target.value })}
                    className="input-althea h-9 py-0 text-[13px]"
                  />
                  <input
                    type="time"
                    value={s.end}
                    onChange={(e) => updateSlot(i, { end: e.target.value })}
                    className="input-althea h-9 py-0 text-[13px]"
                  />
                  <input
                    type="text"
                    placeholder="Pagi 1, Sore, dll"
                    value={s.label ?? ''}
                    onChange={(e) => updateSlot(i, { label: e.target.value })}
                    className="input-althea h-9 py-0 text-[13px]"
                  />
                  <button
                    type="button"
                    onClick={() => removeSlot(i)}
                    className="btn btn-ghost btn-icon btn-sm w-[30px] text-danger"
                    aria-label="Hapus slot"
                    title="Hapus slot"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => addSlot(DEFAULT_SLOT)}
            className="btn btn-outline btn-sm mt-3"
          >
            <Plus className="h-3.5 w-3.5" /> Tambah slot
          </button>

          <p className="caption mt-3 text-fg-muted">
            💡 Slot harus tidak overlap. Booking harus sesuai dengan salah satu slot di atas.
          </p>
        </div>
      </section>

      {/* Section: Hari tutup */}
      <section className="card-althea bg-card">
        <header className="px-5 py-4 border-b border-border">
          <h2 className="h2 m-0">Hari Tutup Klinik</h2>
          <p className="caption mt-1">
            Hari dalam seminggu klinik tidak menerima booking. Booking di hari tutup ditolak
            sistem (kecuali pakai override).
          </p>
        </header>

        <div className="px-5 py-4">
          <div className="flex flex-wrap gap-2">
            {HARI.map((h) => {
              const isClosed = closed.includes(h.index);
              return (
                <button
                  key={h.index}
                  type="button"
                  onClick={() => toggleClosedDay(h.index)}
                  className={`px-4 h-9 rounded-md text-sm font-medium border transition-colors ${
                    isClosed
                      ? 'bg-amber-50 border-amber-300 text-amber-800'
                      : 'bg-card border-border text-teal-800 hover:border-sage-300'
                  }`}
                >
                  {h.label}
                  {isClosed && <span className="ml-1.5 text-[10.5px]">· Tutup</span>}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section: Buffer + Holidays ad-hoc */}
      <section className="card-althea bg-card">
        <header className="px-5 py-4 border-b border-border">
          <h2 className="h2 m-0">Konfigurasi Lain</h2>
        </header>

        <div className="px-5 py-4">
          <div>
            <label className="caption mb-1 block">Tanggal libur (ad-hoc)</label>
            <textarea
              rows={3}
              placeholder="2026-12-25, 2026-12-26, 2027-01-01"
              value={(form.holidays ?? []).join(', ')}
              onChange={(e) => {
                const arr = e.target.value
                  .split(/[,\n]/)
                  .map((s) => s.trim())
                  .filter(Boolean);
                set('holidays', arr);
              }}
              className="input-althea h-auto py-2 text-[13px]"
            />
            <p className="caption mt-1">
              Format ISO YYYY-MM-DD, pisah dengan koma atau baris baru. Tanggal di sini
              ditolak walaupun bukan hari tutup rutin.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
