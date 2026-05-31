'use client';

/**
 * Kas Masuk (CR) — master-detail form. Atomic tier: Page sub-part.
 * Header (Terima Dari, Akun Kas [D], Lokasi, Cabang, Tanggal, No Transaksi, Uang,
 * Kurs, Status) + tab Detail (contra CoA lines) + tab Info (audit) + Total footer.
 * Status follows the Senti state machine (§2.7): not free-edited — toolbar actions.
 */

import * as React from 'react';
import { Icon } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { DateInput } from '@/components/ui/date-input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SearchSelect } from '@/components/molecules/search-select';
import {
  CashBankLinesEditor,
  newCashLine,
  type CashLineRow,
} from '@/components/organisms/cash-bank-lines';
import {
  loadPartnerOptions,
  loadCashAccountOptionsCoded,
  loadLocationOptions,
  loadBranchOptions,
} from './items-form-lookups';
import { listCurrencies, type ErpCurrency } from '@/lib/api/currencies';
import { statusBadgeVariant, statusLabel } from '@/lib/status';
import { formatNumber } from '@/lib/format';
import type {
  CreateCashReceiptPayload,
  ErpCashReceipt,
  ErpDocumentStatus,
} from '@/lib/api/fin-cash-receipts';

export interface CashReceiptFormData {
  id?: string;
  docNumber: string;
  auto: boolean;
  transactionDate: string;
  partnerId: string;
  partnerLabel?: string;
  bankAccountId: string;
  bankAccountLabel?: string;
  locationId: string;
  locationLabel?: string;
  branchId: string;
  branchLabel?: string;
  currencyId: string;
  exchangeRate: string;
  description: string;
  notes: string;
  status: ErpDocumentStatus;
  postedAt?: string | null;
  lines: CashLineRow[];
}

const todayIso = () => new Date().toISOString().slice(0, 10);

export function defaultCashReceiptForm(): CashReceiptFormData {
  return {
    docNumber: '',
    auto: true,
    transactionDate: todayIso(),
    partnerId: '',
    bankAccountId: '',
    locationId: '',
    branchId: '',
    currencyId: '',
    exchangeRate: '1',
    description: '',
    notes: '',
    status: 'DRAFT',
    lines: [newCashLine()],
  };
}

const acctLabel = (ref?: { code: string; name: string } | null) =>
  ref ? `${ref.code} - ${ref.name}` : undefined;

export function fromCashReceipt(r: ErpCashReceipt): CashReceiptFormData {
  return {
    id: r.id,
    docNumber: r.docNumber,
    auto: !!r.autoNumber,
    transactionDate: r.transactionDate.slice(0, 10),
    partnerId: r.partnerId ?? '',
    partnerLabel: r.partner?.name,
    bankAccountId: r.bankAccountId,
    bankAccountLabel: acctLabel(r.bankAccount),
    locationId: r.locationId ?? '',
    locationLabel: r.location?.name,
    branchId: r.branchId,
    branchLabel: r.branch?.name,
    currencyId: r.currencyId,
    exchangeRate: r.exchangeRate,
    description: r.description,
    notes: r.notes ?? '',
    status: r.status,
    postedAt: r.postedAt,
    lines: r.lines.map((l) => ({
      key: `cl-${l.id ?? l.lineNo}`,
      accountId: l.accountId,
      accountLabel: acctLabel(l.account),
      amount: l.amount,
      amountFx: l.amountFx ?? undefined,
      notes: l.notes ?? undefined,
      costCenterId: l.costCenterId ?? undefined,
    })),
  };
}

export function toCashReceiptPayload(d: CashReceiptFormData): CreateCashReceiptPayload {
  return {
    auto: d.auto,
    docNumber: d.auto ? undefined : d.docNumber || undefined,
    direction: 'RECEIPT',
    branchId: d.branchId,
    locationId: d.locationId || undefined,
    transactionDate: d.transactionDate,
    bankAccountId: d.bankAccountId,
    partnerId: d.partnerId || undefined,
    description: d.description,
    notes: d.notes || undefined,
    currencyId: d.currencyId,
    exchangeRate: d.exchangeRate || '1',
    lines: d.lines
      .filter((l) => l.accountId && Number(l.amount) > 0)
      .map((l, i) => ({
        accountId: l.accountId,
        amount: l.amount,
        amountFx: l.amountFx || undefined,
        notes: l.notes || undefined,
        costCenterId: l.costCenterId || undefined,
        lineNo: i + 1,
      })),
  };
}

const EDITABLE: ErpDocumentStatus[] = ['DRAFT', 'NEED_APPROVE', 'REJECTED'];

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground w-24 shrink-0 text-left">
        {label}
        {required && <span className="text-danger">&nbsp;*</span>}
      </span>
      <div className="flex-1 min-w-0">{children}</div>
    </label>
  );
}

export function CashReceiptForm({
  data,
  onChange,
  saving,
  onSave,
  onSaveNew,
  onReset,
}: {
  data: CashReceiptFormData;
  onChange: (d: CashReceiptFormData) => void;
  saving?: boolean;
  onSave: () => void;
  onSaveNew: () => void;
  onReset: () => void;
}) {
  const [tab, setTab] = React.useState<'detail' | 'info'>('detail');
  const [currencies, setCurrencies] = React.useState<ErpCurrency[]>([]);
  const set = (p: Partial<CashReceiptFormData>) => onChange({ ...data, ...p });
  const locked = !EDITABLE.includes(data.status);
  const total = data.lines.reduce((s, l) => s + Number(l.amount || 0), 0);

  React.useEffect(() => {
    listCurrencies({ page: 1, limit: 100, isActive: true })
      .then((r) => {
        setCurrencies(r.data);
        if (!data.currencyId) {
          const idr = r.data.find((c) => c.code === 'IDR') ?? r.data[0];
          if (idr) set({ currencyId: idr.id });
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="cr-form flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <button type="button" className="btn primary" onClick={onSave} disabled={saving || locked}>
          <Icon name="save" size={13} /> Simpan
        </button>
        {!data.id && (
          <button type="button" className="btn" onClick={onSaveNew} disabled={saving || locked}>
            Simpan &amp; Baru
          </button>
        )}
        <button type="button" className="btn ghost" onClick={onReset} disabled={saving}>
          <Icon name="refresh" size={13} /> Reset
        </button>
        <div className="flex-1" />
        <Badge variant={statusBadgeVariant(data.status)} dot>
          {statusLabel(data.status)}
        </Badge>
      </div>

      {/* Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3 rounded-lg border border-border p-4">
        <div className="flex flex-col gap-3">
          <Field label="Terima Dari" required>
            <SearchSelect
              placeholder="Pilih partner…"
              value={data.partnerId}
              initialLabel={data.partnerLabel}
              disabled={locked}
              onValueChange={(v) => set({ partnerId: v })}
              loadOptions={loadPartnerOptions}
            />
          </Field>
          <Field label="Akun Kas [D]" required>
            <SearchSelect
              placeholder="Pilih akun kas/bank…"
              value={data.bankAccountId}
              initialLabel={data.bankAccountLabel}
              disabled={locked}
              onValueChange={(v) => set({ bankAccountId: v })}
              loadOptions={loadCashAccountOptionsCoded}
            />
          </Field>
          <Field label="Uraian" required>
            <Input
              value={data.description}
              disabled={locked}
              onChange={(e) => set({ description: e.target.value })}
            />
          </Field>
        </div>

        <div className="flex flex-col gap-3">
          <Field label="Cabang" required>
            <SearchSelect
              placeholder="Pilih cabang…"
              value={data.branchId}
              initialLabel={data.branchLabel}
              disabled={locked}
              onValueChange={(v) => set({ branchId: v })}
              loadOptions={loadBranchOptions}
            />
          </Field>
          <Field label="Lokasi">
            <SearchSelect
              placeholder="Pilih lokasi…"
              value={data.locationId}
              initialLabel={data.locationLabel}
              disabled={locked}
              onValueChange={(v) => set({ locationId: v })}
              loadOptions={loadLocationOptions}
            />
          </Field>
        </div>

        {/* Kolom kanan = info dokumen, urutan baku: Tanggal → No Transaksi → Uang/Kurs (§2.36) */}
        <div className="flex flex-col gap-3">
          <Field label="Tanggal" required>
            <DateInput
              value={data.transactionDate}
              disabled={locked}
              onChange={(v) => set({ transactionDate: v })}
            />
          </Field>
          <Field label="No Transaksi">
            <div className="flex items-center gap-2">
              <Input
                className="flex-1 min-w-0"
                value={data.auto ? '(otomatis saat simpan)' : data.docNumber}
                placeholder="No transaksi"
                disabled={data.auto || locked}
                onChange={(e) => set({ docNumber: e.target.value })}
              />
              <label className="flex items-center gap-1 text-xs text-muted-foreground shrink-0 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.auto}
                  disabled={locked}
                  onChange={(e) => set({ auto: e.target.checked })}
                />
                Auto
              </label>
            </div>
          </Field>
          <Field label="Uang" required>
            <div className="flex items-center gap-2">
              <Select
                value={data.currencyId}
                onValueChange={(v) => set({ currencyId: v })}
                disabled={locked}
              >
                <SelectTrigger className="flex-1 min-w-0">
                  <SelectValue placeholder="Mata uang" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span
                className="flex items-center gap-1 text-xs text-muted-foreground shrink-0 whitespace-nowrap"
                title="Kurs ke mata uang dasar (read-only)"
              >
                Kurs
                <span className="tabular-nums font-medium text-foreground">
                  {formatNumber(Number(data.exchangeRate) || 1, 2)}
                </span>
              </span>
            </div>
          </Field>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {(['detail', 'info'] as const).map((t) => (
          <button
            key={t}
            type="button"
            className={`px-3 py-1.5 text-sm border-b-2 -mb-px ${
              tab === t
                ? 'border-primary text-primary font-medium'
                : 'border-transparent text-muted-foreground'
            }`}
            onClick={() => setTab(t)}
          >
            {t === 'detail' ? 'Detail' : 'Info'}
          </button>
        ))}
      </div>

      {tab === 'detail' ? (
        <CashBankLinesEditor
          lines={data.lines}
          onChange={(lines) => set({ lines })}
          readOnly={locked}
        />
      ) : (
        <dl className="grid grid-cols-2 gap-y-2 gap-x-6 text-sm max-w-xl">
          <dt className="text-muted-foreground">No Transaksi</dt>
          <dd className="mono">{data.docNumber || '—'}</dd>
          <dt className="text-muted-foreground">Status</dt>
          <dd>{statusLabel(data.status)}</dd>
          <dt className="text-muted-foreground">Tanggal Posting</dt>
          <dd>{data.postedAt ? data.postedAt.slice(0, 19).replace('T', ' ') : '—'}</dd>
          <dt className="text-muted-foreground">Catatan</dt>
          <dd>
            <Input
              value={data.notes}
              disabled={locked}
              onChange={(e) => set({ notes: e.target.value })}
            />
          </dd>
        </dl>
      )}

      {/* Footer total */}
      <div className="flex justify-end items-center gap-3 border-t border-border pt-3">
        <span className="text-sm text-muted-foreground">Total</span>
        <span className="text-lg font-semibold tabular-nums">{formatNumber(total, 2)}</span>
      </div>
    </div>
  );
}
