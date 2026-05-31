'use client';

/**
 * Editable contra-account grid for cash/bank transactions (Kas Masuk/Keluar).
 * Atomic tier: Organism. Reusable across CR/CD/BD forms.
 *
 * Unlike a general journal, a cash/bank doc has ONE cash account in the header
 * (the debit/credit side) — these lines are the opposite-side CoA accounts, each
 * with a single Total (no per-line debit/credit). Mirrors `fin_cash_bank_lines`
 * + the legacy MyERP+ "Detail" tab (No Akun · Nama Akun · Total · Total Valas ·
 * Catatan · Cost Center).
 *
 * Full-keyboard grid (no search bar / add button / trash column):
 * - Tab / Shift+Tab — pindah antar field (native).
 * - Enter di field terakhir baris terakhir — tambah baris baru & fokus ke sana.
 * - Ctrl/Cmd+Delete — hapus baris aktif (selalu sisakan minimal satu baris).
 * Akun dipilih lewat SearchSelect per-baris (ketik untuk cari, atau ikon modal).
 */

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Kbd } from '@/components/ui/kbd';
import { NumInput } from '@/components/molecules/num-input';
import { SearchSelect } from '@/components/molecules/search-select';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/organisms/table';
import { loadAccountOptionsCoded, loadCostCenterOptions } from '@/components/pages/items-form-lookups';
import { formatNumber } from '@/lib/format';

export interface CashLineRow {
  key: string;
  accountId: string;
  accountLabel?: string;
  amount: string;
  amountFx?: string;
  notes?: string;
  costCenterId?: string;
  costCenterLabel?: string;
}

let seq = 0;
export const newCashLine = (): CashLineRow => ({
  key: `cl-${(seq += 1)}`,
  accountId: '',
  amount: '',
});

export function CashBankLinesEditor({
  lines,
  onChange,
  readOnly = false,
  showFx = false,
}: {
  lines: CashLineRow[];
  onChange: (lines: CashLineRow[]) => void;
  readOnly?: boolean;
  showFx?: boolean;
}) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  // Index baris yang harus difokus setelah render (append/remove via keyboard).
  const focusRowRef = React.useRef<number | null>(null);

  const patch = (key: string, p: Partial<CashLineRow>) =>
    onChange(lines.map((l) => (l.key === key ? { ...l, ...p } : l)));

  // Tambah baris di akhir + jadwalkan fokus ke field Akun baris baru.
  const appendRow = () => {
    focusRowRef.current = lines.length;
    onChange([...lines, newCashLine()]);
  };

  // Hapus baris; selalu sisakan minimal satu baris (kosongkan bila tinggal satu).
  const removeRow = (idx: number) => {
    if (lines.length <= 1) {
      focusRowRef.current = 0;
      onChange([newCashLine()]);
      return;
    }
    const next = lines.filter((_, i) => i !== idx);
    focusRowRef.current = Math.min(idx, next.length - 1);
    onChange(next);
  };

  React.useLayoutEffect(() => {
    if (focusRowRef.current == null) return;
    const idx = focusRowRef.current;
    focusRowRef.current = null;
    rootRef.current
      ?.querySelector<HTMLElement>(`[data-row="${idx}"] input`)
      ?.focus();
  });

  const handleGridKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (readOnly) return;
    const rowEl = (e.target as HTMLElement).closest?.('[data-row]');
    if (!rowEl) return;
    const idx = Number(rowEl.getAttribute('data-row'));

    if (e.key === 'Delete' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      removeRow(idx);
      return;
    }

    // SearchSelect selalu preventDefault Enter-nya sendiri (pilih akun/cost
    // center) — jadi defaultPrevented=false berarti Enter datang dari field
    // teks biasa (Total/Catatan). Tambah baris hanya dari baris terakhir.
    if (e.key === 'Enter' && !e.shiftKey && !e.defaultPrevented) {
      if (idx !== lines.length - 1) return;
      const last = lines[idx];
      if (!last?.accountId && !last?.amount) return; // jangan tumpuk baris kosong
      e.preventDefault();
      appendRow();
    }
  };

  const total = lines.reduce((s, l) => s + Number(l.amount || 0), 0);
  const totalFx = lines.reduce((s, l) => s + Number(l.amountFx || 0), 0);
  const colSpan = showFx ? 6 : 5;

  return (
    <div className="cashbank-lines" ref={rootRef} onKeyDown={handleGridKeyDown}>
      {!readOnly && (
        <div className="mb-2 flex items-center justify-end gap-1 text-[11px] text-muted-foreground">
          Ketik di kolom Akun untuk cari CoA · <Kbd>Enter</Kbd> baris baru ·{' '}
          <Kbd>Ctrl</Kbd>+<Kbd>Del</Kbd> hapus baris
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead style={{ width: 44 }}>No</TableHead>
            <TableHead>Akun (No · Nama)</TableHead>
            <TableHead style={{ width: 160, textAlign: 'right' }}>Total</TableHead>
            {showFx && <TableHead style={{ width: 140, textAlign: 'right' }}>Total Valas</TableHead>}
            <TableHead>Catatan</TableHead>
            <TableHead style={{ width: 220 }}>Cost Center</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lines.length === 0 ? (
            <TableRow>
              <TableCell colSpan={colSpan} className="text-center text-muted-foreground py-4">
                Belum ada baris akun.
              </TableCell>
            </TableRow>
          ) : (
            lines.map((l, i) => (
              <TableRow key={l.key} data-row={i}>
                <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                <TableCell>
                  <SearchSelect
                    placeholder="Pilih akun…"
                    value={l.accountId}
                    initialLabel={l.accountLabel}
                    disabled={readOnly}
                    onValueChange={(v) => patch(l.key, { accountId: v })}
                    loadOptions={loadAccountOptionsCoded}
                  />
                </TableCell>
                <TableCell>
                  <NumInput
                    value={l.amount}
                    decimals={2}
                    disabled={readOnly}
                    onChange={(raw) => patch(l.key, { amount: raw })}
                  />
                </TableCell>
                {showFx && (
                  <TableCell>
                    <NumInput
                      value={l.amountFx ?? ''}
                      decimals={2}
                      disabled={readOnly}
                      onChange={(raw) => patch(l.key, { amountFx: raw })}
                    />
                  </TableCell>
                )}
                <TableCell>
                  <Input
                    value={l.notes ?? ''}
                    disabled={readOnly}
                    onChange={(e) => patch(l.key, { notes: e.target.value })}
                  />
                </TableCell>
                <TableCell>
                  <SearchSelect
                    placeholder="(opsional)"
                    value={l.costCenterId ?? ''}
                    initialLabel={l.costCenterLabel}
                    disabled={readOnly}
                    onValueChange={(v) => patch(l.key, { costCenterId: v })}
                    loadOptions={loadCostCenterOptions}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex justify-end gap-6 pt-3 pr-2 text-sm">
        {showFx && (
          <span className="text-muted-foreground">
            Total Valas <strong className="tabular-nums ml-2">{formatNumber(totalFx, 2)}</strong>
          </span>
        )}
        <span>
          Total <strong className="tabular-nums ml-2">{formatNumber(total, 2)}</strong>
        </span>
      </div>
    </div>
  );
}
