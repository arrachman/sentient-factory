'use client';

import { useMemo } from 'react';
import { Check } from 'lucide-react';
import type { useServiceList } from '@/features/admin-layanan/hooks/use-service';

type Service = NonNullable<
  ReturnType<typeof useServiceList>['data']
>['data'][number];

const CAT_LABEL: Record<string, string> = {
  konseling: 'Konseling',
  terapi: 'Terapi',
  tes: 'Tes Psikologi',
};
const CAT_ORDER = ['konseling', 'terapi', 'tes'];

/**
 * Section "Layanan" — button grid grouped by category.
 * 1 klik langsung pilih, no dropdown open-close.
 *
 * `serviceIdWhitelist` (optional): kalau di-set ke array non-empty, hanya
 * service dengan id ∈ whitelist yang ditampilkan. Dipakai di edit mode
 * untuk filter ke layanan yang psikolog terassign handle (junction).
 * `undefined` atau array kosong → tampilkan semua (junction kosong di
 * domain = handle semua service).
 */
export function Step2Service({
  serviceList,
  selectedId,
  selectedService,
  onChange,
  serviceIdWhitelist,
}: {
  serviceList: ReturnType<typeof useServiceList>;
  selectedId: number | null;
  selectedService: Service | undefined;
  onChange: (id: number | null) => void;
  serviceIdWhitelist?: number[];
}) {
  const all = serviceList.data?.data ?? [];
  const grouped = useMemo(() => {
    const whitelist =
      serviceIdWhitelist && serviceIdWhitelist.length > 0
        ? new Set(serviceIdWhitelist)
        : null;
    const filtered = whitelist ? all.filter((sv) => whitelist.has(sv.id)) : all;
    const map = new Map<string, Service[]>();
    for (const sv of filtered) {
      const arr = map.get(sv.category) ?? [];
      arr.push(sv);
      map.set(sv.category, arr);
    }
    return CAT_ORDER.filter((c) => map.has(c)).map((c) => ({
      category: c,
      items: map.get(c) ?? [],
    }));
  }, [all, serviceIdWhitelist]);

  if (serviceList.isLoading) {
    return <div className="text-fg-muted text-sm">Memuat layanan...</div>;
  }

  return (
    <div className="space-y-3">
      {grouped.map((group) => (
        <div key={group.category}>
          <div className="caption mb-1.5 font-semibold uppercase tracking-wider text-fg-muted">
            {CAT_LABEL[group.category] ?? group.category}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {group.items.map((sv) => {
              const active = selectedId === sv.id;
              return (
                <button
                  key={sv.id}
                  type="button"
                  onClick={() => onChange(sv.id)}
                  className={`flex items-start gap-2 px-3 py-2 rounded-md border text-left transition-colors ${
                    active
                      ? 'bg-sage-50 border-sage-500'
                      : 'bg-card border-border hover:border-sage-300'
                  }`}
                >
                  {active ? (
                    <Check className="h-4 w-4 text-sage-700 mt-0.5 flex-shrink-0" />
                  ) : (
                    <span className="h-4 w-4 flex-shrink-0" />
                  )}
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-[13.5px] font-semibold text-teal-800 truncate">
                      {sv.name}
                    </span>
                    <span className="caption truncate">
                      {sv.sessionCount}× {sv.durationMinutes}min · Rp{' '}
                      {Number(sv.basePrice).toLocaleString('id-ID')}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {selectedService ? (
        <div className="caption text-fg-muted">
          ✓ {selectedService.name} · {selectedService.durationMinutes} menit per sesi
        </div>
      ) : null}
    </div>
  );
}
