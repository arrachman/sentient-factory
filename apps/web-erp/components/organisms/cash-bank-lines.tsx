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
 */

import * as React from 'react';
import { Icon } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
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
  const patch = (key: string, p: Partial<CashLineRow>) =>
    onChange(lines.map((l) => (l.key === key ? { ...l, ...p } : l)));
  const remove = (key: string) => onChange(lines.filter((l) => l.key !== key));
  const addLine = () => onChange([...lines, newCashLine()]);

  const total = lines.reduce((s, l) => s + Number(l.amount || 0), 0);
  const totalFx = lines.reduce((s, l) => s + Number(l.amountFx || 0), 0);

  return (
    <div className="cashbank-lines">
      {!readOnly && (
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-muted-foreground w-28">Pencarian CoA</span>
          <div className="flex-1">
            <SearchSelect
              placeholder="Cari akun untuk tambah baris…"
              value=""
              onValueChange={(v) => {
                if (!v) return;
                onChange([...lines, { ...newCashLine(), accountId: v }]);
              }}
              loadOptions={loadAccountOptionsCoded}
            />
          </div>
          <button type="button" className="btn sm" onClick={addLine}>
            <Icon name="plus" size={12} /> Tambah
          </button>
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
            {!readOnly && <TableHead style={{ width: 44 }} />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {lines.length === 0 ? (
            <TableRow>
              <TableCell colSpan={readOnly ? 6 : 7} className="text-center text-muted-foreground py-4">
                Belum ada baris akun. Cari CoA di atas atau klik Tambah.
              </TableCell>
            </TableRow>
          ) : (
            lines.map((l, i) => (
              <TableRow key={l.key}>
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
                {!readOnly && (
                  <TableCell>
                    <button
                      type="button"
                      className="iconbtn danger"
                      title="Hapus baris"
                      onClick={() => remove(l.key)}
                    >
                      <Icon name="trash" size={13} />
                    </button>
                  </TableCell>
                )}
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
