'use client';

/**
 * Account create/edit form — used inside a Modal.
 * Renders enum selects (type/kind/normal balance/cash flow) and the
 * parent-account picker for the Chart of Accounts hierarchy.
 * Atomic tier: Molecule/Organism sub-part.
 */

import * as React from 'react';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BooleanRadio } from '@/components/ui/radio-group';
import { SearchSelect, type SearchSelectOption } from '@/components/molecules/search-select';
import {
  ACCOUNT_TYPES,
  ACCOUNT_KINDS,
  NORMAL_BALANCES,
  CASH_FLOW_CATEGORIES,
  listAccounts,
  getAccountCodeFormat,
} from '@/lib/api/accounts';
import type {
  ErpAccountType,
  ErpAccountKind,
  ErpNormalBalance,
  ErpCashFlowCategory,
  CreateAccountPayload,
  AccountCodeFormat,
} from '@/lib/api/accounts';
import { validateForm, type FormErrors } from '@/lib/form-validation';

const NONE = '__none__';

// ─── Account code format cache (sys_settings group "account-code") ────────────
//
// §2.24: format kode CoA dinamis dari `sys_settings`. Cache module-level supaya
// `validateAccount` (sync, dipanggil SimpleMasterPage) bisa pakai pattern aktif
// tanpa async fetch tiap submit. Hook `useAccountCodeFormat()` priming cache
// saat form pertama mount; `invalidateAccountCodeFormatCache()` di-panggil
// setelah PUT /accounts/code-format sukses agar form refresh.

let accountCodeFormatCache: AccountCodeFormat | null = null;
let inflightFormatRequest: Promise<AccountCodeFormat> | null = null;
type FormatListener = (f: AccountCodeFormat | null) => void;
const formatListeners = new Set<FormatListener>();

function buildAccountCodePattern(segments: number[], separator: string): RegExp {
  const escapedSep = separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = segments.map((n) => `\\d{${n}}`);
  return new RegExp(`^${parts.join(escapedSep)}$`);
}

async function fetchAccountCodeFormat(): Promise<AccountCodeFormat> {
  if (inflightFormatRequest) return inflightFormatRequest;
  inflightFormatRequest = getAccountCodeFormat()
    .then((f) => {
      accountCodeFormatCache = f;
      formatListeners.forEach((cb) => cb(f));
      return f;
    })
    .finally(() => {
      inflightFormatRequest = null;
    });
  return inflightFormatRequest;
}

export function invalidateAccountCodeFormatCache(): void {
  accountCodeFormatCache = null;
  inflightFormatRequest = null;
  formatListeners.forEach((cb) => cb(null));
  // Re-prime so any mounted form picks up the new format immediately.
  void fetchAccountCodeFormat().catch(() => {
    /* swallow — form will retry on next mount */
  });
}

export function useAccountCodeFormat(): AccountCodeFormat | null {
  const [format, setFormat] = React.useState<AccountCodeFormat | null>(accountCodeFormatCache);
  React.useEffect(() => {
    const listener: FormatListener = (f) => setFormat(f);
    formatListeners.add(listener);
    if (!accountCodeFormatCache) {
      void fetchAccountCodeFormat()
        .then((f) => setFormat(f))
        .catch(() => {
          /* keep null — validateAccount falls back to length-only check */
        });
    }
    return () => {
      formatListeners.delete(listener);
    };
  }, []);
  return format;
}

export interface AccountFormData {
  code: string;
  name: string;
  alias: string;
  accountType: ErpAccountType;
  accountKind: ErpAccountKind;
  normalBalance: ErpNormalBalance;
  cashFlowCategory: string;
  parentId: string;
  isControlAccount: boolean;
  notes: string;
  isActive: boolean;
}

export const defaultAccountForm = (): AccountFormData => ({
  code: '',
  name: '',
  alias: '',
  accountType: 'ASSET',
  accountKind: 'POSTABLE',
  normalBalance: 'DEBIT',
  cashFlowCategory: '',
  parentId: '',
  isControlAccount: false,
  notes: '',
  isActive: true,
});

export function fromAccount(a: { code: string; name: string; alias?: string | null; type: ErpAccountType; kind: ErpAccountKind; normalBalance: ErpNormalBalance; cashFlowCategory?: ErpCashFlowCategory | null; parentId?: string | null; isControlAccount: boolean; notes?: string | null; isActive: boolean }): AccountFormData {
  return {
    code: a.code,
    name: a.name,
    alias: a.alias ?? '',
    accountType: a.type,
    accountKind: a.kind,
    normalBalance: a.normalBalance,
    cashFlowCategory: a.cashFlowCategory ?? '',
    parentId: a.parentId ?? '',
    isControlAccount: a.isControlAccount,
    notes: a.notes ?? '',
    isActive: a.isActive,
  };
}

export function toAccountPayload(f: AccountFormData): CreateAccountPayload {
  return {
    code: f.code,
    name: f.name,
    alias: f.alias || undefined,
    accountType: f.accountType,
    accountKind: f.accountKind,
    normalBalance: f.normalBalance,
    cashFlowCategory:
      (f.cashFlowCategory as ErpCashFlowCategory) || undefined,
    parentId: f.parentId || null,
    isControlAccount: f.isControlAccount,
    notes: f.notes || undefined,
    isActive: f.isActive,
  };
}

async function loadParentOptions(
  search: string,
  _page: number,
  limit: number,
): Promise<{ data: SearchSelectOption[]; total: number }> {
  const res = await listAccounts({ search: search || undefined, limit, isActive: true });
  return {
    data: res.data.map((a) => ({ value: a.id, label: a.name, code: a.code })),
    total: res.meta?.total ?? res.data.length,
  };
}

export const validateAccount = (form: AccountFormData) => {
  const fmt = accountCodeFormatCache;
  return validateForm(form, [
    {
      field: 'code',
      label: 'Kode',
      required: true,
      validate: (value) => {
        if (typeof value !== 'string') return undefined;
        if (!fmt) return undefined; // server akan validasi; cache belum terisi
        const re = buildAccountCodePattern(fmt.segments, fmt.separator);
        return re.test(value)
          ? undefined
          : `Format wajib ${fmt.patternSource} (contoh: ${fmt.example})`;
      },
    },
    { field: 'name', label: 'Nama', required: true },
  ]);
};

export function AccountFormFields({
  data,
  onChange,
  errors = {},
}: {
  data: AccountFormData;
  onChange: (d: AccountFormData) => void;
  errors?: FormErrors<AccountFormData>;
}) {
  const set = (k: keyof AccountFormData, v: string | boolean) =>
    onChange({ ...data, [k]: v });
  const format = useAccountCodeFormat();
  const codePlaceholder = format?.example ?? '1101.01.001';
  const codeMaxLength = format?.maxLength ?? 11;

  return (
    <div className="p-4">
      <FormField label="Kode" htmlFor="ac-code" required error={errors.code}>
        <Input id="ac-code" value={data.code} onChange={(e) => set('code', e.target.value)} placeholder={codePlaceholder} aria-invalid={!!errors.code} maxLength={codeMaxLength} />
      </FormField>
      <FormField label="Nama" htmlFor="ac-name" required error={errors.name}>
        <Input id="ac-name" value={data.name} onChange={(e) => set('name', e.target.value)} placeholder="Cash on Hand" aria-invalid={!!errors.name} />
      </FormField>
      <FormField label="Alias" htmlFor="ac-alias">
        <Input id="ac-alias" value={data.alias} onChange={(e) => set('alias', e.target.value)} placeholder="Kas Besar" />
      </FormField>
      <FormField label="Tipe Akun" htmlFor="ac-type" required>
        <Select value={data.accountType} onValueChange={(v) => set('accountType', v as ErpAccountType)}>
          <SelectTrigger id="ac-type"><SelectValue /></SelectTrigger>
          <SelectContent>
            {ACCOUNT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </FormField>
      <FormField label="Jenis" htmlFor="ac-kind" required>
        <Select value={data.accountKind} onValueChange={(v) => set('accountKind', v as ErpAccountKind)}>
          <SelectTrigger id="ac-kind"><SelectValue /></SelectTrigger>
          <SelectContent>
            {ACCOUNT_KINDS.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
          </SelectContent>
        </Select>
      </FormField>
      <FormField label="Saldo Normal" htmlFor="ac-nb" required>
        <Select value={data.normalBalance} onValueChange={(v) => set('normalBalance', v as ErpNormalBalance)}>
          <SelectTrigger id="ac-nb"><SelectValue /></SelectTrigger>
          <SelectContent>
            {NORMAL_BALANCES.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
          </SelectContent>
        </Select>
      </FormField>
      <FormField label="Kategori Arus Kas" htmlFor="ac-cf">
        <Select value={data.cashFlowCategory || NONE} onValueChange={(v) => set('cashFlowCategory', v === NONE ? '' : v)}>
          <SelectTrigger id="ac-cf"><SelectValue placeholder="— Tidak ada —" /></SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE}>— Tidak ada —</SelectItem>
            {CASH_FLOW_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </FormField>
      <FormField label="Parent" htmlFor="ac-parent">
        <SearchSelect
          id="ac-parent"
          placeholder="— Root —"
          value={data.parentId}
          onValueChange={(v) => set('parentId', v)}
          loadOptions={loadParentOptions}
        />
      </FormField>
      <FormField label="Control Account" htmlFor="ac-ctrl">
        <BooleanRadio id="ac-ctrl" value={data.isControlAccount} onValueChange={(v) => set('isControlAccount', v)} trueLabel="Ya" falseLabel="Tidak" />
      </FormField>
      <FormField label="Catatan" htmlFor="ac-notes">
        <Input id="ac-notes" value={data.notes} onChange={(e) => set('notes', e.target.value)} />
      </FormField>
      <FormField label="Status" htmlFor="ac-active">
        <BooleanRadio id="ac-active" value={data.isActive} onValueChange={(v) => set('isActive', v)} />
      </FormField>
    </div>
  );
}
