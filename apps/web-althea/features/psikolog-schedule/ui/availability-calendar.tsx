'use client';

/**
 * Calendar grid bulanan untuk set override availability per-tanggal.
 *
 * Layout: 7 kolom (Sen-Min) × 5-6 baris. Cell visual menunjukkan state:
 *   - Default (no override) → ikut weeklyAvailability
 *   - Override BUKA all slots → border + dot sage
 *   - Override BUKA subset → border sage + badge count "2/6"
 *   - Override TUTUP (cuti) → background amber + label
 *   - Past dates → dim 40%, non-interactive
 *
 * Mode (radio toolbar):
 *   - "lihat" (default) → click cell → buka popover edit
 *   - "cuti" → click cell → instant toggle cuti pakai catatan global
 *   - "buka" → click cell → buka popover slot picker
 *
 * Single click = 1 input. Multiple cuti dalam batch = ganti mode "cuti", click
 * berurutan, beres.
 */
import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import {
  useDeleteMyDateOverride,
  useUpsertMyDateOverride,
} from '@/features/admin-psikolog/hooks/use-psikolog';
import type { ClinicSettings } from '@/features/admin-pengaturan/api/settings.api';
import { CellEditPopover, type Override } from './cell-edit-popover';

/** Cek apakah tanggal (YYYY-MM-DD) berjarak ≤ 5 hari dari hari ini (dalam H+5). */
function isWithinHPlus5(targetDateKey: string): boolean {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(targetDateKey);
  target.setHours(0, 0, 0, 0);
  const diffDays = (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= 5;
}

const H5_ERROR = 'Jadwal tidak bisa ditutup dalam 5 hari ke depan. Hubungi admin untuk perubahan mendadak.';

type Mode = 'lihat' | 'cuti' | 'buka';

const DAY_LABELS = ['Sn', 'Sl', 'Rb', 'Km', 'Jm', 'Sb', 'Mg'];

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function monthDays(year: number, month: number): Date[] {
  // Build array of Date objects spanning calendar grid (start Monday).
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const days: Date[] = [];

  // Pad to Monday start (JS getDay: 0=Sun..6=Sat → mau 0=Mon..6=Sun)
  const firstDow = (first.getDay() + 6) % 7;
  for (let i = firstDow; i > 0; i--) {
    const d = new Date(year, month, 1 - i);
    days.push(d);
  }
  // Days in month
  for (let d = 1; d <= last.getDate(); d++) {
    days.push(new Date(year, month, d));
  }
  // Pad ke akhir minggu (multiple of 7), max 6 minggu (42 cells)
  while (days.length % 7 !== 0) {
    const last = days[days.length - 1];
    days.push(new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1));
  }
  // Tambah 1 row kosong supaya selalu 6 row (42 cells) untuk konsistensi tinggi
  while (days.length < 42) {
    const last = days[days.length - 1];
    days.push(new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1));
  }
  return days;
}


export function AvailabilityCalendar({
  overrides,
  slots,
  defaultReason,
  onChangeDefaultReason,
}: {
  overrides: Override[];
  slots: ClinicSettings['slotsOfDay'];
  defaultReason: string;
  onChangeDefaultReason: (s: string) => void;
}) {
  const [anchor, setAnchor] = useState<Date>(() => new Date());
  const [mode, setMode] = useState<Mode>('lihat');
  const [popover, setPopover] = useState<{ dateKey: string } | null>(null);

  const upsertMut = useUpsertMyDateOverride();
  const deleteMut = useDeleteMyDateOverride();

  const overrideMap = useMemo(() => {
    const m = new Map<string, Override>();
    for (const o of overrides) {
      m.set(o.date.slice(0, 10), o);
    }
    return m;
  }, [overrides]);

  const days = useMemo(
    () => monthDays(anchor.getFullYear(), anchor.getMonth()),
    [anchor],
  );
  const monthLabel = anchor.toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  });
  const today = todayStr();
  const currentMonth = anchor.getMonth();

  function shiftMonth(delta: number) {
    setAnchor((prev) => {
      const next = new Date(prev);
      next.setMonth(prev.getMonth() + delta);
      next.setDate(1);
      return next;
    });
  }

  function handleCellClick(d: Date) {
    const key = dateKey(d);
    if (key < today) return; // past, skip
    if (mode === 'cuti') {
      const existing = overrideMap.get(key);
      if (existing && !existing.isOpen) {
        // Hapus cuti yang sudah ada — selalu boleh
        deleteMut.mutate(key);
      } else {
        // Set cuti baru — blokir jika H+5
        if (isWithinHPlus5(key)) {
          toast.error(H5_ERROR);
          return;
        }
        upsertMut.mutate({
          date: key,
          isOpen: false,
          slotIndices: null,
          reason: defaultReason.trim() || null,
        });
      }
    } else {
      // 'lihat' atau 'buka' → buka popover detail
      setPopover({ dateKey: key });
    }
  }

  function handlePopoverSave(input: {
    date: string;
    isOpen: boolean;
    slotIndices: number[] | null;
    reason: string | null;
  }) {
    if (isWithinHPlus5(input.date)) {
      // Blokir tutup penuh (cuti)
      if (!input.isOpen) {
        toast.error(H5_ERROR);
        return;
      }
      // Blokir pengurangan slot dari override yang sudah ada
      if (input.slotIndices !== null) {
        const existing = overrideMap.get(input.date);
        if (existing?.isOpen) {
          const existingCount = existing.slotIndices
            ? existing.slotIndices.length
            : slots.length;
          if (input.slotIndices.length < existingCount) {
            toast.error(H5_ERROR);
            return;
          }
        }
      }
    }
    upsertMut.mutate(input);
    setPopover(null);
  }

  return (
    <div className="rounded-md border border-border bg-card overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border bg-cream-50 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className="btn btn-icon btn-ghost btn-sm"
            aria-label="Bulan sebelumnya"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-[14px] font-semibold text-teal-800 capitalize min-w-[140px] text-center">
            {monthLabel}
          </span>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            className="btn btn-icon btn-ghost btn-sm"
            aria-label="Bulan berikutnya"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setAnchor(new Date())}
            className="btn btn-ghost btn-sm text-[12px]"
          >
            Bulan ini
          </button>
        </div>

        <div className="flex items-center gap-1 bg-card rounded-md p-[3px] border border-border">
          {(
            [
              { key: 'lihat' as const, label: 'Lihat / Edit' },
              { key: 'cuti' as const, label: '🌴 Cuti cepat' },
              { key: 'buka' as const, label: '✏ Buka khusus' },
            ]
          ).map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setMode(opt.key)}
              className={`px-3 h-7 rounded text-[12px] font-medium transition-colors ${
                mode === opt.key
                  ? 'bg-sage-500 text-white'
                  : 'text-fg-muted hover:text-teal-800'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mode hint + reason input */}
      <div className="px-4 py-2.5 border-b border-border bg-cream-50">
        {mode === 'lihat' && (
          <p className="caption text-fg-muted">
            🔍 Klik tanggal untuk edit override (buka popover detail).
          </p>
        )}
        {mode === 'cuti' && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="caption text-fg-muted">
              ⚡ Klik tanggal = tandai cuti instant. Klik ulang = hapus cuti.
            </span>
            <input
              type="text"
              value={defaultReason}
              onChange={(e) => onChangeDefaultReason(e.target.value)}
              placeholder="Catatan untuk cuti yang di-set sekarang (opsional)"
              className="input-althea h-8 py-0 text-[12px] flex-1 min-w-[200px]"
            />
          </div>
        )}
        {mode === 'buka' && (
          <p className="caption text-fg-muted">
            ✏ Klik tanggal untuk pilih slot mana yang available di hari itu.
          </p>
        )}
      </div>

      {/* Day-of-week header */}
      <div className="grid grid-cols-7 px-2 pt-2 gap-1">
        {DAY_LABELS.map((d) => (
          <div
            key={d}
            className="text-[10.5px] font-semibold text-fg-muted uppercase tracking-wider text-center py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Cell grid */}
      <div className="grid grid-cols-7 px-2 pb-3 gap-1">
        {days.map((d, i) => {
          const key = dateKey(d);
          const inMonth = d.getMonth() === currentMonth;
          const isPast = key < today;
          const isToday = key === today;
          const ovr = overrideMap.get(key);

          // Visual style
          let bg = 'transparent';
          let borderColor = 'var(--border)';
          let textColor = inMonth ? 'var(--teal-800)' : 'var(--fg-muted)';
          let stateLabel: string | null = null;
          let stateColor: string | null = null;

          if (ovr) {
            if (ovr.isOpen) {
              bg = '#f1f5f1'; // sage-50
              borderColor = '#5b8a66'; // sage-500
              stateLabel = ovr.slotIndices ? `${ovr.slotIndices.length}/${slots.length} slot` : 'buka';
              stateColor = '#3a5b3f';
            } else {
              bg = '#fde7d3'; // amber-soft
              borderColor = '#e3a895';
              textColor = '#8a4a00';
              stateLabel = 'cuti';
              stateColor = '#8a4a00';
            }
          }

          return (
            <button
              key={i}
              type="button"
              onClick={() => handleCellClick(d)}
              disabled={isPast}
              className="relative flex flex-col items-stretch text-left rounded-md transition-all"
              style={{
                background: bg,
                border: `1.5px solid ${borderColor}`,
                color: textColor,
                opacity: isPast ? 0.35 : inMonth ? 1 : 0.45,
                minHeight: 56,
                padding: '4px 6px',
                cursor: isPast ? 'not-allowed' : mode === 'lihat' ? 'pointer' : 'crosshair',
                outline: isToday ? '2px solid #5b8a66' : 'none',
                outlineOffset: isToday ? 1 : 0,
              }}
              title={
                isPast
                  ? 'Tanggal lewat'
                  : ovr
                    ? `${ovr.isOpen ? 'BUKA' : 'CUTI'}${ovr.reason ? ' · ' + ovr.reason : ''}`
                    : mode === 'cuti'
                      ? 'Klik untuk tandai cuti'
                      : 'Klik untuk edit'
              }
            >
              <span className="text-[12.5px] font-semibold leading-tight">
                {d.getDate()}
              </span>
              {stateLabel && (
                <span
                  className="text-[9px] font-bold uppercase tracking-wide mt-auto truncate"
                  style={{ color: stateColor ?? undefined }}
                >
                  {stateLabel}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="px-4 py-2 border-t border-border bg-cream-50 flex items-center gap-3 flex-wrap">
        <Legend color="#5b8a66" bg="#f1f5f1" label="Buka khusus" />
        <Legend color="#e3a895" bg="#fde7d3" label="Cuti" />
        <Legend color="var(--border)" bg="transparent" label="Ikut jadwal mingguan" />
        <span className="caption text-fg-muted ml-auto">
          Tanggal lewat di-disable.
        </span>
      </div>

      {/* Popover detail edit */}
      {popover && (
        <CellEditPopover
          dateKey={popover.dateKey}
          existing={overrideMap.get(popover.dateKey) ?? null}
          slots={slots}
          defaultReason={defaultReason}
          presetMode={mode === 'buka' ? 'buka' : null}
          onClose={() => setPopover(null)}
          onSave={handlePopoverSave}
          onDelete={(date) => {
            deleteMut.mutate(date, { onSuccess: () => setPopover(null) });
          }}
        />
      )}
    </div>
  );
}

function Legend({ color, bg, label }: { color: string; bg: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[11px]">
      <span
        className="inline-block"
        style={{
          width: 14,
          height: 14,
          background: bg,
          border: `1.5px solid ${color}`,
          borderRadius: 3,
        }}
      />
      {label}
    </span>
  );
}

