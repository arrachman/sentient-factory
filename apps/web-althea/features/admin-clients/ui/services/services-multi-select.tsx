'use client';

import { useMemo } from 'react';
import { useServiceList } from '@/features/admin-layanan/hooks/use-service';
import { type CreateClientInput } from '../../model/types';

export const SERVICE_GROUP_ORDER = ['konseling', 'terapi', 'tes'] as const;
export const SERVICE_GROUP_LABEL: Record<string, string> = {
  konseling: 'Konseling',
  terapi: 'Terapi',
  tes: 'Tes Psikologi',
};

/**
 * Multi-select layanan klien (grouped by category) — pola sama dengan
 * `ServicesSection` di form psikolog. Wajib minimal 1 chip aktif sebelum submit;
 * validation ditegakkan via hidden required input + backend DTO ArrayMinSize(1).
 *
 * Klien existing yang punya service nonaktif (dinonaktifkan setelah klien dibuat)
 * tetap ditampilkan sebagai chip "stale" dengan label "(tidak aktif)" supaya
 * tidak silently hilang saat edit.
 */
export function ServicesMultiSelect({
  form,
  onChange,
}: {
  form: CreateClientInput;
  onChange: (next: CreateClientInput) => void;
}) {
  const serviceList = useServiceList({ isActive: true, limit: 200 });
  const services = serviceList.data?.data ?? [];
  const selectedIds = form.serviceIds ?? [];
  const selectedSet = new Set(selectedIds);

  // Selected stale = id terpilih yang tidak ada di list aktif (mis. service sudah
  // dinonaktifkan setelah klien punya relasi ke service tsb). Render terpisah
  // di bawah supaya tetap bisa di-uncheck.
  const knownIds = new Set(services.map((s) => s.id));
  const staleIds = useMemo(
    () => selectedIds.filter((id) => !knownIds.has(id)),
    [selectedIds, knownIds],
  );

  const grouped = useMemo(() => {
    const map = new Map<string, typeof services>();
    for (const sv of services) {
      const arr = map.get(sv.category) ?? [];
      arr.push(sv);
      map.set(sv.category, arr);
    }
    return SERVICE_GROUP_ORDER.filter((c) => map.has(c)).map((c) => ({
      key: c,
      label: SERVICE_GROUP_LABEL[c] ?? c,
      items: map.get(c)!,
    }));
  }, [services]);

  const allIds = services.map((s) => s.id);
  const allSelected = allIds.length > 0 && allIds.every((id) => selectedSet.has(id));

  function toggle(id: number) {
    if (selectedSet.has(id)) onChange({ ...form, serviceIds: selectedIds.filter((v) => v !== id) });
    else onChange({ ...form, serviceIds: [...selectedIds, id] });
  }

  function togglePilihSemua() {
    if (allSelected) {
      // Kosongkan hanya yang aktif; biarkan stale tetap kalau ada (admin handle manual).
      onChange({ ...form, serviceIds: selectedIds.filter((id) => !knownIds.has(id)) });
    } else {
      const merged = new Set<number>([...selectedIds, ...allIds]);
      onChange({ ...form, serviceIds: Array.from(merged) });
    }
  }

  return (
    <div>
      <label className="caption mb-1 block">Layanan yang diminati *</label>
      <div className="rounded-md border border-border bg-cream-50 p-3 flex flex-col gap-3">
        {serviceList.isLoading ? (
          <div className="text-fg-muted text-sm italic">Memuat layanan…</div>
        ) : services.length === 0 ? (
          <div className="text-fg-muted text-sm italic">
            Belum ada layanan aktif. Tambah di menu Layanan.
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePilihSemua}
                className="btn btn-ghost btn-sm text-xs"
              >
                {allSelected ? 'Batal pilih semua' : 'Pilih semua'}
              </button>
              <span className="caption ml-auto">
                {selectedIds.length === 0
                  ? 'Belum ada layanan dipilih'
                  : `${selectedIds.length} dari ${services.length} layanan dipilih`}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {grouped.map((group) => (
                <div key={group.key}>
                  <div className="caption font-semibold uppercase tracking-wider text-fg-muted mb-1">
                    {group.label}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((sv) => {
                      const active = selectedSet.has(sv.id);
                      return (
                        <button
                          key={sv.id}
                          type="button"
                          onClick={() => toggle(sv.id)}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                            active
                              ? 'bg-sage-500 text-white border-sage-500'
                              : 'bg-card text-fg border-border hover:border-sage-300'
                          }`}
                        >
                          {sv.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              {staleIds.length > 0 ? (
                <div>
                  <div className="caption font-semibold uppercase tracking-wider text-fg-muted mb-1">
                    Lainnya (tidak aktif)
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {staleIds.map((id) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => toggle(id)}
                        className="px-2.5 py-1 rounded-full text-xs font-medium border bg-sage-500 text-white border-sage-500 line-through"
                      >
                        #{id}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </>
        )}
      </div>
      {/* Hidden input untuk enforce HTML `required` — value bukan string kosong
          kalau minimal 1 service terpilih. Browser native validation akan block
          submit + scroll ke section ini bila kosong. */}
      <input
        tabIndex={-1}
        aria-hidden="true"
        required
        value={selectedIds.length > 0 ? 'ok' : ''}
        onChange={() => {}}
        className="sr-only"
      />
    </div>
  );
}
