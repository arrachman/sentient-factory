'use client';

/**
 * Section: Override per-tanggal di AvailabilityDialog.
 *
 * UX baru (post-feedback): calendar bulanan sebagai input utama supaya
 * psikolog bisa set banyak tanggal cepat tanpa bolak-balik form.
 *
 *  - Calendar grid: click cell → instant cuti (mode cuti) atau open popover
 *  - Color coding per cell: sage (buka), amber (cuti), default (ikut weekly)
 *  - List override tersimpan tetap ada untuk reference + delete cepat
 *
 * Lihat `AvailabilityCalendar` untuk implementasi grid + popover.
 */
import { useMemo, useState } from 'react';
import { Trash2 } from 'lucide-react';
import {
  useDeleteMyDateOverride,
  useMyDateOverrides,
} from '@/features/admin-psikolog/hooks/use-psikolog';
import { useSettings } from '@/features/admin-pengaturan/hooks/use-settings';
import { AvailabilityCalendar } from './availability-calendar';

function todayDateStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatDateLabel(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export function AvailabilityOverridesSection() {
  const settingsQuery = useSettings();
  const slots = settingsQuery.data?.data.slotsOfDay ?? [];
  const overrides = useMyDateOverrides();
  const deleteMut = useDeleteMyDateOverride();

  const [defaultReason, setDefaultReason] = useState<string>('');

  const items = overrides.data?.data ?? [];
  const sorted = useMemo(() => {
    const today = todayDateStr();
    return [...items].sort((a, b) => {
      const aF = a.date.slice(0, 10) >= today;
      const bF = b.date.slice(0, 10) >= today;
      if (aF !== bF) return aF ? -1 : 1;
      return a.date.localeCompare(b.date);
    });
  }, [items]);

  function handleDelete(date: string) {
    if (!confirm(`Hapus override tanggal ${formatDateLabel(date)}? Akan kembali ke jadwal mingguan.`)) return;
    deleteMut.mutate(date.slice(0, 10));
  }

  if (settingsQuery.isLoading) {
    return <div className="caption text-fg-muted py-6">Memuat slot operasional…</div>;
  }
  if (slots.length === 0) {
    return (
      <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-800">
        Klinik belum mengatur slot operasional. Override per-tanggal tidak bisa di-set sampai
        admin set slot di Pengaturan → Slot Operasional.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <AvailabilityCalendar
        overrides={items}
        slots={slots}
        defaultReason={defaultReason}
        onChangeDefaultReason={setDefaultReason}
      />

      {/* List compact untuk reference + bulk delete */}
      {sorted.length > 0 && (
        <details className="rounded-md border border-border bg-card" open>
          <summary className="px-4 py-2.5 cursor-pointer text-[13px] font-semibold text-teal-800 uppercase tracking-wider hover:bg-cream-50">
            Override Tersimpan ({sorted.length})
          </summary>
          <div className="px-2 pb-2 flex flex-col gap-1.5">
            {sorted.map((o) => {
              const dateOnly = o.date.slice(0, 10);
              const isPast = dateOnly < todayDateStr();
              const slotsLabel = o.slotIndices
                ? `${o.slotIndices.length}/${slots.length} slot`
                : 'semua slot';
              return (
                <div
                  key={o.id}
                  className={`flex items-center gap-3 px-3 py-1.5 rounded-md ${
                    isPast ? 'bg-cream-50 opacity-60' : 'bg-cream-50'
                  }`}
                >
                  <div
                    className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider"
                    style={
                      o.isOpen
                        ? { background: '#dde9d8', color: '#3a5b3f' }
                        : { background: '#f7d9b7', color: '#8a4a00' }
                    }
                  >
                    {o.isOpen ? 'Buka' : 'Cuti'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] font-medium text-teal-800 truncate">
                      {formatDateLabel(o.date)}
                    </div>
                    {(o.reason || o.isOpen) && (
                      <div className="caption truncate">
                        {o.isOpen ? slotsLabel : 'libur'}
                        {o.reason ? ` · ${o.reason}` : ''}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(o.date)}
                    className="btn btn-ghost btn-icon btn-sm text-danger"
                    aria-label="Hapus override"
                    title="Hapus override (kembali ke jadwal mingguan)"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </details>
      )}

      <p className="caption text-fg-muted">
        💡 <strong>Tips:</strong> Untuk set cuti banyak tanggal sekaligus, ganti mode toolbar ke{' '}
        <em>🌴 Cuti cepat</em> dan klik tanggal-tanggal yang mau ditutup. Klik ulang = hapus cuti.
      </p>
    </div>
  );
}
