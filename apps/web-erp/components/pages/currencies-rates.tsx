'use client';

/**
 * Currency rates sub-panel — embedded inside the currency edit modal.
 * Lists existing dated rates and lets the user add a new dated rate.
 * Atomic tier: Organism sub-part.
 */

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
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
import {
  listCurrencyRates,
  addCurrencyRate,
} from '@/lib/api/currencies';
import type { ErpCurrencyRate } from '@/lib/api/currencies';

function formatDate(iso: string): string {
  return iso.slice(0, 10);
}

export function CurrencyRatesPanel({ currencyId }: { currencyId: string }) {
  const [rates, setRates] = React.useState<ErpCurrencyRate[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [rateDate, setRateDate] = React.useState('');
  const [rate, setRate] = React.useState('');
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
    load();
  }, [load]);

  const handleAdd = async () => {
    if (!rateDate || !rate) {
      notify('Tanggal dan nilai rate wajib diisi', 'danger');
      return;
    }
    setAdding(true);
    try {
      await addCurrencyRate(currencyId, { rateDate, rate });
      notify('Rate ditambahkan', 'success');
      setRateDate('');
      setRate('');
      load();
    } catch (e: unknown) {
      notify(e instanceof Error ? e.message : 'Gagal menambah rate', 'danger');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="p-4">
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
        <FormField label="Tanggal" htmlFor="cr-date">
          <Input
            id="cr-date"
            type="date"
            value={rateDate}
            onChange={(e) => setRateDate(e.target.value)}
          />
        </FormField>
        <FormField label="Rate" htmlFor="cr-rate">
          <Input
            id="cr-rate"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="15750.00"
          />
        </FormField>
        <button
          className="btn primary sm"
          onClick={handleAdd}
          disabled={adding}
        >
          {adding ? 'Menambah...' : 'Tambah Rate'}
        </button>
      </div>

      <div className="lines" style={{ marginTop: 12 }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Rate</TableHead>
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
                  <TableCell>{formatDate(r.rateDate)}</TableCell>
                  <TableCell className="mono">{String(r.rate)}</TableCell>
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
