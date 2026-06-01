'use client';

/**
 * Cash/bank transaction master-detail form — shared organism for Kas Masuk (CR),
 * Kas Keluar (CD), Bank Keluar (BD)… The header layout (§2.36), Detail/Info tabs
 * and contra-CoA lines are identical across directions; callers only pass the
 * party/account labels ("Terima Dari" vs "Bayar Ke", "Akun Kas [D]" vs "[K]").
 * Status is read-only (badge) — transitions happen via list workflow actions (§2.7).
 */

import * as React from 'react';
import { Icon } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { DateInput } from '@/components/ui/date-input';
import { Badge } from '@/components/ui/badge';
import { SearchSelect } from '@/components/molecules/search-select';
import { CashBankLinesEditor } from '@/components/organisms/cash-bank-lines';
import {
  loadPartnerOptions,
  loadCashAccountOptionsCoded,
  loadLocationOptions,
  loadBranchOptions,
  loadCurrencyOptions,
} from './items-form-lookups';
import { listCurrencies, type ErpCurrency } from '@/lib/api/currencies';
import { statusBadgeVariant, statusLabel } from '@/lib/status';
import { formatNumber } from '@/lib/format';
import type { ErpDocumentStatus } from '@/lib/api/fin-cash-receipts';
import type { CashBankFormData } from './cash-bank-form-model';
import { useFormFields } from '@/lib/use-form-fields';
import { CashBankCustomFields } from '@/components/molecules/cash-bank-custom-fields';

/** Direction-specific header labels (only thing that differs CR vs CD). */
export interface CashBankFormLabels {
  /** Party picker, e.g. "Terima Dari" (CR) / "Bayar Ke" (CD). */
  partner: string;
  /** Cash/bank account picker, e.g. "Akun Kas [D]" (CR) / "Akun Kas [K]" (CD). */
  account: string;
}

/** Extra tab a caller injects between Detail and Info (e.g. Giro for Bank Masuk). */
export interface CashBankExtraTab {
  key: string;
  label: string;
  content: React.ReactNode;
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

export function CashBankTransactionForm({
  data,
  onChange,
  labels,
  transactionCode,
  headerExtra,
  extraTabs = [],
  saving,
  onSave,
  onSaveNew,
  onReset,
}: {
  data: CashBankFormData;
  onChange: (d: CashBankFormData) => void;
  labels: CashBankFormLabels;
  /** Kustomisasi Grid code for the detail grid, e.g. "FIN.CR". */
  transactionCode?: string;
  /** Extra field rendered atop the left header column (e.g. Cara Bayar). */
  headerExtra?: React.ReactNode;
  /** Extra tabs injected between Detail and Info (e.g. Giro). */
  extraTabs?: CashBankExtraTab[];
  saving?: boolean;
  onSave: () => void;
  onSaveNew: () => void;
  onReset: () => void;
}) {
  const [tab, setTab] = React.useState<string>('detail');
  const [currencies, setCurrencies] = React.useState<ErpCurrency[]>([]);
  const formConfig = useFormFields(transactionCode);
  const set = (p: Partial<CashBankFormData>) => onChange({ ...data, ...p });
  const locked = !EDITABLE.includes(data.status);

  // Derive labels from form builder config (fallback to prop labels if not loaded yet).
  const partnerLabel = formConfig.byKey['partnerId']?.label ?? labels.partner;
  const accountLabel = formConfig.byKey['bankAccountId']?.label ?? labels.account;
  const branchVisible = formConfig.byKey['branchId']?.isVisible ?? true;
  const locationVisible = formConfig.byKey['locationId']?.isVisible ?? true;
  const descriptionVisible = formConfig.byKey['description']?.isVisible ?? true;

  const setCustomField = (key: string, value: string | number | null) =>
    set({ customFields: { ...data.customFields, [key]: value } });
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

  // SearchSelect trigger label for the selected currency ("IDR - Rupiah").
  const currencyLabel = React.useMemo(() => {
    const c = currencies.find((x) => x.id === data.currencyId);
    return c ? `${c.code} - ${c.name}` : undefined;
  }, [currencies, data.currencyId]);

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
          {headerExtra}
          <Field label={partnerLabel} required={formConfig.byKey['partnerId']?.isRequired ?? true}>
            <SearchSelect
              placeholder="Pilih partner…"
              value={data.partnerId}
              initialLabel={data.partnerLabel}
              disabled={locked}
              onValueChange={(v) => set({ partnerId: v })}
              loadOptions={loadPartnerOptions}
            />
          </Field>
          <Field label={accountLabel} required={formConfig.byKey['bankAccountId']?.isRequired ?? true}>
            <SearchSelect
              placeholder="Pilih akun kas/bank…"
              value={data.bankAccountId}
              initialLabel={data.bankAccountLabel}
              disabled={locked}
              onValueChange={(v) => set({ bankAccountId: v })}
              loadOptions={loadCashAccountOptionsCoded}
            />
          </Field>
          {descriptionVisible && (
            <Field label={formConfig.byKey['description']?.label ?? 'Uraian'} required={formConfig.byKey['description']?.isRequired ?? true}>
              <Input
                value={data.description}
                disabled={locked}
                onChange={(e) => set({ description: e.target.value })}
              />
            </Field>
          )}
          <CashBankCustomFields
            fields={formConfig.bySlot.LEFT}
            values={data.customFields}
            onValueChange={setCustomField}
            disabled={locked}
          />
        </div>

        <div className="flex flex-col gap-3">
          {branchVisible && (
            <Field label={formConfig.byKey['branchId']?.label ?? 'Cabang'} required={formConfig.byKey['branchId']?.isRequired ?? true}>
              <SearchSelect
                placeholder="Pilih cabang…"
                value={data.branchId}
                initialLabel={data.branchLabel}
                disabled={locked}
                onValueChange={(v) => set({ branchId: v })}
                loadOptions={loadBranchOptions}
              />
            </Field>
          )}
          {locationVisible && (
            <Field label={formConfig.byKey['locationId']?.label ?? 'Lokasi'}>
              <SearchSelect
                placeholder="Pilih lokasi…"
                value={data.locationId}
                initialLabel={data.locationLabel}
                disabled={locked}
                onValueChange={(v) => set({ locationId: v })}
                loadOptions={loadLocationOptions}
              />
            </Field>
          )}
          <CashBankCustomFields
            fields={formConfig.bySlot.CENTER}
            values={data.customFields}
            onValueChange={setCustomField}
            disabled={locked}
          />
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
          <Field label={formConfig.byKey['currencyId']?.label ?? 'Uang'} required={formConfig.byKey['currencyId']?.isRequired ?? true}>
            <div className="flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <SearchSelect
                  placeholder="Mata uang"
                  value={data.currencyId}
                  initialLabel={currencyLabel}
                  disabled={locked}
                  onValueChange={(v) => set({ currencyId: v })}
                  loadOptions={loadCurrencyOptions}
                />
              </div>
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
          <CashBankCustomFields
            fields={formConfig.bySlot.RIGHT}
            values={data.customFields}
            onValueChange={setCustomField}
            disabled={locked}
          />
        </div>
      </div>

      {/* Tabs: Detail → [extra tabs] → Info */}
      <div className="flex gap-1 border-b border-border">
        {[
          { key: 'detail', label: 'Detail' },
          ...extraTabs.map((t) => ({ key: t.key, label: t.label })),
          { key: 'info', label: 'Info' },
        ].map((t) => (
          <button
            key={t.key}
            type="button"
            className={`px-3 py-1.5 text-sm border-b-2 -mb-px ${
              tab === t.key
                ? 'border-primary text-primary font-medium'
                : 'border-transparent text-muted-foreground'
            }`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'detail' && (
        <CashBankLinesEditor
          lines={data.lines}
          onChange={(lines) => set({ lines })}
          readOnly={locked}
          transactionCode={transactionCode}
        />
      )}
      {extraTabs.map((t) => (tab === t.key ? <div key={t.key}>{t.content}</div> : null))}
      {tab === 'info' && (
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
