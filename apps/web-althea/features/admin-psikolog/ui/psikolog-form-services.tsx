'use client';

import { useMemo } from 'react';
import { Controller, type Control } from 'react-hook-form';
import { useServiceList } from '@/features/admin-layanan/hooks/use-service';
import type { CreatePsikologInput } from '../model/types';

export function ServicesSection({ control }: { control: Control<CreatePsikologInput> }) {
  const serviceList = useServiceList({ limit: 200, isActive: true });
  const services = serviceList.data?.data ?? [];

  const grouped = useMemo(() => {
    const map = new Map<string, typeof services>();
    for (const sv of services) {
      const arr = map.get(sv.category) ?? [];
      arr.push(sv);
      map.set(sv.category, arr);
    }
    const ORDER = ['konseling', 'terapi', 'tes'];
    const LABEL: Record<string, string> = { konseling: 'Konseling', terapi: 'Terapi', tes: 'Tes Psikologi' };
    return ORDER.filter((c) => map.has(c)).map((c) => ({ key: c, label: LABEL[c], items: map.get(c)! }));
  }, [services]);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <label className="caption">Layanan yang ditangani</label>
      </div>
      <Controller
        name="serviceIds"
        control={control}
        render={({ field }) => {
          const value = (field.value ?? []) as number[];
          const valueSet = new Set(value);
          const toggle = (id: number) => {
            if (valueSet.has(id)) field.onChange(value.filter((v) => v !== id));
            else field.onChange([...value, id]);
          };
          const allIds = services.map((s) => s.id);
          const allSelected = allIds.length > 0 && allIds.every((id) => valueSet.has(id));
          return (
            <div className="rounded-md border border-border bg-cream-50 p-3 flex flex-col gap-3">
              {serviceList.isLoading ? (
                <div className="text-fg-muted text-sm italic">Memuat layanan...</div>
              ) : services.length === 0 ? (
                <div className="text-fg-muted text-sm italic">Belum ada layanan aktif. Tambah di menu Layanan.</div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => field.onChange(allSelected ? [] : allIds)} className="btn btn-ghost btn-sm text-xs">
                      {allSelected ? 'Batal pilih semua' : 'Pilih semua'}
                    </button>
                    <span className="caption ml-auto">
                      {value.length === 0 ? 'Belum ada layanan dipilih' : `${value.length} dari ${services.length} layanan dipilih`}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {grouped.map((group) => (
                      <div key={group.key}>
                        <div className="caption font-semibold uppercase tracking-wider text-fg-muted mb-1">{group.label}</div>
                        <div className="flex flex-wrap gap-1.5">
                          {group.items.map((sv) => {
                            const active = valueSet.has(sv.id);
                            return (
                              <button
                                key={sv.id}
                                type="button"
                                onClick={() => toggle(sv.id)}
                                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${active ? 'bg-sage-500 text-white border-sage-500' : 'bg-card text-fg border-border hover:border-sage-300'}`}
                              >
                                {sv.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        }}
      />
      <p className="caption mt-1.5 text-fg-muted">
        💡 Centang chip untuk layanan yang ditangani psikolog ini. Filter ini dipakai di booking wizard untuk hide psikolog yang tidak relevan.
      </p>
    </div>
  );
}
