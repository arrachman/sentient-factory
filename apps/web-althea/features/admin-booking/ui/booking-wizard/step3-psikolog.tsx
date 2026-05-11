import { hasWeeklyAvailability, type Psikolog } from '@/features/admin-psikolog/model/types';
import type { usePsikologList } from '@/features/admin-psikolog/hooks/use-psikolog';

/**
 * Step 3 wizard — pilih psikolog.
 *
 * Filter: items sudah filtered by selected service di parent (kosong serviceIds
 * = handle semua → tetap muncul). Tampilan disabled kalau psikolog belum set
 * jadwal mingguan (weeklyAvailability empty).
 */
export function Step3Psikolog({
  psikologList,
  filteredItems,
  selectedId,
  onChange,
  serviceFilterActive,
  totalPsikolog,
  selectedServiceName,
}: {
  psikologList: ReturnType<typeof usePsikologList>;
  filteredItems: Psikolog[];
  selectedId: number | null;
  onChange: (userId: number) => void;
  serviceFilterActive: boolean;
  totalPsikolog: number;
  selectedServiceName?: string;
}) {
  if (psikologList.isLoading) {
    return <div className="text-fg-muted">Memuat psikolog...</div>;
  }

  return (
    <div className="space-y-3">
      {serviceFilterActive && (
        <div className="caption text-fg-muted">
          {filteredItems.length === totalPsikolog ? (
            <>Semua {totalPsikolog} psikolog handle layanan ini (atau kosong = handle semua).</>
          ) : (
            <>
              {filteredItems.length} dari {totalPsikolog} psikolog menangani{' '}
              <strong className="text-teal-800">{selectedServiceName ?? 'layanan ini'}</strong>.
            </>
          )}
        </div>
      )}
      {filteredItems.length === 0 ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          ⚠ Tidak ada psikolog yang menangani layanan ini. Kembali ke step Layanan dan pilih
          layanan lain, atau atur penugasan layanan di menu <strong>Psikolog → Edit → Layanan
          yang ditangani</strong>.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {filteredItems.map((p) => {
            const active = selectedId === p.userId;
            const hasSchedule = hasWeeklyAvailability(p.weeklyAvailability);
            const initial = (p.fullName ?? p.email).slice(0, 2).toUpperCase();
            return (
              <button
                key={p.userId}
                type="button"
                onClick={() => hasSchedule && onChange(p.userId)}
                disabled={!hasSchedule}
                title={
                  hasSchedule
                    ? undefined
                    : 'Psikolog belum set jadwal mingguan. Set dulu di menu Psikolog → Edit.'
                }
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md border text-left transition-colors ${
                  !hasSchedule
                    ? 'bg-cream-100 border-border opacity-60 cursor-not-allowed'
                    : active
                      ? 'bg-sage-50 border-sage-500'
                      : 'bg-card border-border hover:border-sage-300'
                }`}
              >
                <span
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 999,
                    background: p.color ?? 'var(--sage-500)',
                    color: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 12,
                    fontWeight: 700,
                    flexShrink: 0,
                    opacity: hasSchedule ? 1 : 0.5,
                  }}
                >
                  {initial}
                </span>
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13.5px] font-semibold text-teal-800 truncate">
                      {p.fullName ?? p.email}
                    </span>
                    {!hasSchedule && (
                      <span
                        className="px-1.5 py-[1px] rounded text-[9.5px] font-medium uppercase tracking-wider"
                        style={{ background: '#fde7d3', color: '#8a4a00' }}
                      >
                        Belum ada jadwal
                      </span>
                    )}
                  </div>
                  <span className="caption truncate">
                    {p.title ?? '—'}
                    {p.specialty && p.specialty.length > 0
                      ? ` · ${p.specialty.length} spesialisasi`
                      : ''}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
      <p className="caption mt-2 text-fg-muted">
        Psikolog tanpa jadwal mingguan tidak bisa di-booking — set dulu di menu{' '}
        <strong>Psikolog → Edit → Jadwal Mingguan</strong>.
      </p>
    </div>
  );
}
