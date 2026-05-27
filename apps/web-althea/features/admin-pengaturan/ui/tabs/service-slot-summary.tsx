'use client';

/**
 * Ringkasan READ-ONLY: layanan mana yang punya slot khusus
 * (range waktu di-override ATAU slot dinonaktifkan). Editor sebenarnya ada di
 * Admin → Layanan → form layanan. Slot tanpa override mewarisi waktu global
 * apa adanya.
 */
import { useServiceList } from '@/features/admin-layanan/hooks/use-service';
import { resolveServiceSlots } from '@/features/admin-layanan/model/slot';
import { useSettings } from '../../hooks/use-settings';

export function ServiceSlotSummary() {
  const settings = useSettings();
  const services = useServiceList({ limit: 200, isActive: true });

  const globalSlots = settings.data?.data.slotsOfDay ?? [];
  const list = services.data?.data ?? [];
  const withCustom = list.filter(
    (s) => (s.slotOverrides ?? []).length > 0 || (s.disabledSlotIndices ?? []).length > 0,
  );

  return (
    <section className="card-althea bg-card">
      <header className="px-5 py-4 border-b border-border">
        <h2 className="h2 m-0">Slot Khusus per Layanan</h2>
        <p className="caption mt-1">
          Layanan boleh menggeser range waktu slot atau menonaktifkan slot tertentu (nama &
          jumlah slot tetap ikut global di atas). Atur di{' '}
          <strong>Layanan → Edit → Slot yang Dipakai Layanan Ini</strong>. Daftar di bawah
          read-only.
        </p>
      </header>

      <div className="px-5 py-4">
        {withCustom.length === 0 ? (
          <p className="caption italic text-fg-muted py-2">
            Belum ada layanan dengan slot khusus — semua pakai waktu global penuh.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {withCustom.map((s) => {
              const resolved = resolveServiceSlots(
                globalSlots,
                s.slotOverrides,
                s.disabledSlotIndices,
              );
              const overridden = new Set((s.slotOverrides ?? []).map((o) => o.index));
              return (
                <div key={s.id} className="rounded-md border border-border bg-cream-50 px-3 py-2">
                  <div className="text-[13px] font-semibold text-teal-800 mb-1">{s.name}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {resolved.map((slot, i) => {
                      const isDisabled = !!slot.disabled;
                      const isOverridden = overridden.has(i);
                      return (
                        <span
                          key={i}
                          className={`px-2 py-0.5 rounded text-[12px] border ${
                            isDisabled
                              ? 'bg-cream-100 border-cream-200 text-fg-muted line-through'
                              : isOverridden
                                ? 'bg-sage-50 border-sage-300 text-sage-800 font-medium'
                                : 'bg-card border-border text-fg-muted'
                          }`}
                          title={
                            isDisabled
                              ? 'nonaktif untuk layanan ini'
                              : isOverridden
                                ? 'waktu khusus layanan'
                                : 'ikut global'
                          }
                        >
                          {slot.label ? `${slot.label}: ` : ''}
                          {slot.start}–{slot.end}
                          {isDisabled ? ' · nonaktif' : ''}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
