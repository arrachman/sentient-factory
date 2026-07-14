'use client';

/**
 * Currency rates sub-panel — embedded inside the currency edit modal.
 * Lists existing dated rates and lets the user add a new dated rate.
 *
 * Input "Periode berlaku" memakai DateRangePicker (Mulai → Selesai) sesuai
 * keputusan user (UI range saja): rentang dipilih di UI lalu tanggal Mulai
 * disimpan ke field API `rateDate` (lihat apps/web-erp/CLAUDE.md §2.39).
 *
 * Atomic tier: Organism sub-part.
 */

import * as React from 'react';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { FormField } from '@/components/ui/form-field';
import { NumInput } from '@/components/molecules/num-input';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
} from '@/components/organisms/table';
import { notify } from '@/lib/feedback';
import { formatDate, parseIsoDate } from '@/lib/date-format';
import { formatNumber } from '@/lib/format';
import {
  listCurrencyRates,
  addCurrencyRate,
} from '@/lib/api/currencies';
import type { ErpCurrencyRate } from '@/lib/api/currencies';

interface AddForm {
  from: string;
  to: string;
  rate: string;
}

const emptyAddForm = (): AddForm => ({ from: '', to: '', rate: '' });

/** Periode tampil: "dd/MM/yyyy" atau "dd/MM/yyyy → dd/MM/yyyy" bila ada akhir. */
function periodeLabel(fromIso: string, toIso: string): string {
  const from = formatDate(fromIso);
  if (!from) return '—';
  if (toIso) {
    const to = formatDate(toIso);
    if (to) return `${from} → ${to}`;
  }
  return from;
}

export function CurrencyRatesPanel({ currencyId }: { currencyId: string }) {
  const [rates, setRates] = React.useState<ErpCurrencyRate[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState<AddForm>(emptyAddForm);
  const [adding, setAdding] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await listCurrencyRates(currencyId, { limit: 50 });
      setRates(res.data);
    } catch (e: unknown) {
      notify(e instanceof Error ? e.message : 'Gagal memuat rate', 'danger');
    } finally {
      setLoading(false);
    }
  }, [currencyId]);

  React.useEffect(() => {
    const task = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(task);
  }, [load]);

  const handleAdd = async () => {
    if (!form.from || !form.rate) {
      notify('Tanggal mulai dan nilai rate wajib diisi', 'danger');
      return;
    }
    if (form.to && form.from && parseIsoDate(form.to)! < parseIsoDate(form.from)!) {
      notify('Tanggal selesai tidak boleh sebelum tanggal mulai', 'danger');
      return;
    }
    setAdding(true);
    try {
      // Opsi "UI range saja": simpan tanggal Mulai ke field `rateDate`.
      await addCurrencyRate(currencyId, { rateDate: form.from, rate: form.rate });
      notify('Rate ditambahkan', 'success');
      setForm(emptyAddForm());
      load();
    } catch (e: unknown) {
      notify(e instanceof Error ? e.message : 'Gagal menambah rate', 'danger');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-col gap-3">
        <FormField label="Periode berlaku (mulai → selesai)" htmlFor="cr-from" required>
          <DateRangePicker
            id="cr-from"
            from={form.from}
            to={form.to}
            onChangeFrom={(v) => setForm((f) => ({ ...f, from: v }))}
            onChangeTo={(v) => setForm((f) => ({ ...f, to: v }))}
          />
        </FormField>

        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <FormField label="Rate / Kurs" htmlFor="cr-rate" required>
            <NumInput
              id="cr-rate"
              value={form.rate}
              onChange={(raw) => setForm((f) => ({ ...f, rate: raw }))}
              placeholder="15.750,00"
              style={{ maxWidth: 200 }}
            />
          </FormField>
          <button
            type="button"
            className="btn primary sm"
            onClick={handleAdd}
            disabled={adding}
          >
            {adding ? 'Menambah...' : 'Tambah Rate'}
          </button>
        </div>
      </div>

      <div className="lines" style={{ marginTop: 16 }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Periode berlaku</TableHead>
              <TableHead className="text-right">Rate</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="muted">
                  Memuat...
                </TableCell>
              </TableRow>
            ) : rates.length === 0 ? (
              <TableEmpty colSpan={3} />
            ) : (
              rates.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{periodeLabel(r.rateDate, '')}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatNumber(r.rate, 2)}
                  </TableCell>
                  <TableCell className="muted">
                    {r.isActive ? 'Aktif' : 'Nonaktif'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}