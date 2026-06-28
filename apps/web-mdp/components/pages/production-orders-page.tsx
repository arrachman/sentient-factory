'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/atoms/button';
import { cn } from '@/lib/utils';
import {
  api,
  type MesOrderStatus,
  type ProductionOrder,
  type WorkCenter,
} from '@/lib/api';

const STATUS_STYLE: Record<MesOrderStatus, string> = {
  RELEASED: 'bg-info-soft text-info',
  IN_PROGRESS: 'bg-warn-soft text-warn',
  PAUSED: 'bg-muted text-muted-foreground',
  COMPLETED: 'bg-success-soft text-success',
  CLOSED: 'bg-muted text-muted-foreground',
  CANCELLED: 'bg-danger-soft text-danger',
};

interface FormState {
  code: string;
  itemId: string;
  plannedQty: string;
  uomCode: string;
  workCenterId: string;
  notes: string;
}

const EMPTY_FORM: FormState = {
  code: '',
  itemId: '',
  plannedQty: '',
  uomCode: 'PCS',
  workCenterId: '',
  notes: '',
};

export function ProductionOrdersPage() {
  const [rows, setRows] = useState<ProductionOrder[]>([]);
  const [workCenters, setWorkCenters] = useState<WorkCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.listProductionOrders({ sortBy: 'createdAt', sortDir: 'desc' });
      setRows(res.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    api
      .listWorkCenters()
      .then((r) => setWorkCenters(r.data))
      .catch(() => setWorkCenters([]));
  }, [load]);

  const submit = async () => {
    setSaving(true);
    setFormError(null);
    try {
      await api.createProductionOrder({
        code: form.code.trim(),
        itemId: form.itemId.trim(),
        plannedQty: Number(form.plannedQty),
        uomCode: form.uomCode.trim() || undefined,
        workCenterId: form.workCenterId || undefined,
        notes: form.notes.trim() || undefined,
      });
      setForm(EMPTY_FORM);
      setShowForm(false);
      await load();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const setField = (k: keyof FormState, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const canSave = form.code.trim() && form.itemId.trim() && Number(form.plannedQty) > 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Production Orders</h1>
          <p className="text-sm text-muted-foreground">
            MES · eksekusi produksi (entry manual). {rows.length} order.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={cn('size-4', loading && 'animate-spin')} /> Refresh
          </Button>
          <Button size="sm" onClick={() => setShowForm((s) => !s)}>
            <Plus className="size-4" /> Tambah
          </Button>
        </div>
      </div>

      {showForm && (
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Kode *">
              <input className={inputCls} value={form.code} onChange={(e) => setField('code', e.target.value)} placeholder="MO-2606-0001" />
            </Field>
            <Field label="Item ID (ERP) *">
              <input className={inputCls} value={form.itemId} onChange={(e) => setField('itemId', e.target.value)} placeholder="md_items id" />
            </Field>
            <Field label="Qty Rencana *">
              <input className={inputCls} type="number" value={form.plannedQty} onChange={(e) => setField('plannedQty', e.target.value)} placeholder="1000" />
            </Field>
            <Field label="Satuan">
              <input className={inputCls} value={form.uomCode} onChange={(e) => setField('uomCode', e.target.value)} />
            </Field>
            <Field label="Work Center">
              <select className={inputCls} value={form.workCenterId} onChange={(e) => setField('workCenterId', e.target.value)}>
                <option value="">—</option>
                {workCenters.map((wc) => (
                  <option key={wc.id} value={wc.id}>
                    {wc.code} · {wc.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Catatan">
              <input className={inputCls} value={form.notes} onChange={(e) => setField('notes', e.target.value)} />
            </Field>
          </div>
          {formError && <p className="text-xs text-danger">{formError}</p>}
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={submit} disabled={!canSave || saving}>
              {saving ? 'Menyimpan…' : 'Simpan'}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
              Batal
            </Button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/60 text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Kode</th>
              <th className="px-3 py-2 font-medium">Item</th>
              <th className="px-3 py-2 font-medium">Work Center</th>
              <th className="px-3 py-2 text-right font-medium">Qty Rencana</th>
              <th className="px-3 py-2 text-right font-medium">Good</th>
              <th className="px-3 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} className="px-3 py-6 text-center text-muted-foreground">Memuat…</td></tr>
            )}
            {!loading && error && (
              <tr><td colSpan={6} className="px-3 py-6 text-center text-danger">Gagal memuat data: {error}</td></tr>
            )}
            {!loading && !error && rows.length === 0 && (
              <tr><td colSpan={6} className="px-3 py-6 text-center text-muted-foreground">Belum ada production order</td></tr>
            )}
            {!loading && !error && rows.map((r) => (
              <tr key={r.id} className="border-t border-border hover:bg-muted/40">
                <td className="px-3 py-2 font-medium text-foreground">{r.code}</td>
                <td className="px-3 py-2 text-muted-foreground">#{r.itemId}</td>
                <td className="px-3 py-2 text-muted-foreground">{r.workCenter ? `${r.workCenter.code}` : '—'}</td>
                <td className="px-3 py-2 text-right tabular-nums">{r.plannedQty}{r.uomCode ? ` ${r.uomCode}` : ''}</td>
                <td className="px-3 py-2 text-right tabular-nums">{r.producedGoodQty}</td>
                <td className="px-3 py-2">
                  <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-medium', STATUS_STYLE[r.status])}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const inputCls =
  'h-8 w-full rounded-md border border-input bg-card px-2.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
