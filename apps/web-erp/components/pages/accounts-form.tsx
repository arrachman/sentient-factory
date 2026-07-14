'use client';

/**
 * Account create/edit form — used inside a Modal.
 * Parent-first CoA input: child account scope follows the selected parent.
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
import { Badge } from '@/components/ui/badge';
import { SearchSelect, type SearchSelectOption } from '@/components/molecules/search-select';
import { loadCurrencyOptions } from './partners-lookups';
import {
  ACCOUNT_TYPES,
  ACCOUNT_KINDS,
  CASH_FLOW_CATEGORIES,
  listAccounts,
  getAccountCodeFormat,
} from '@/lib/api/accounts';
import type {
  ErpAccount,
  ErpAccountType,
  ErpAccountKind,
  ErpNormalBalance,
  ErpCashFlowCategory,
  CreateAccountPayload,
  AccountCodeFormat,
} from '@/lib/api/accounts';
import { validateForm, type FormErrors } from '@/lib/form-validation';

const NONE = '__none__';

const TYPE_NORMAL_BALANCE_MAP: Record<ErpAccountType, ErpNormalBalance> = {
  ASSET: 'DEBIT',
  EXPENSE: 'DEBIT',
  LIABILITY: 'CREDIT',
  EQUITY: 'CREDIT',
  REVENUE: 'CREDIT',
};

function normalBalanceForAccountType(type: ErpAccountType): ErpNormalBalance {
  return TYPE_NORMAL_BALANCE_MAP[type];
}

function splitAccountCode(code: string, format: AccountCodeFormat): string[] {
  if (!format.separator) {
    let offset = 0;
    return format.segments.map((length) => {
      const part = code.slice(offset, offset + length);
      offset += length;
      return part;
    });
  }
  return code.split(format.separator);
}

function isLeafAccountCode(code: string, format: AccountCodeFormat | null): boolean {
  if (!format || !code) return false;
  const parts = splitAccountCode(code, format);
  const last = parts[parts.length - 1] ?? '';
  return /[1-9]/.test(last);
}

// ─── Account code format cache (sys_settings group "account-code") ────────────

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
  void fetchAccountCodeFormat().catch(() => {
    /* form will retry on next mount */
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
          /* keep null — server validates */
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
  parentLabel: string;
  currencyId: string;
  currencyLabel: string;
  isControlAccount: boolean;
  bankName: string;
  bankAccountNo: string;
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
  parentLabel: '',
  currencyId: '',
  currencyLabel: '',
  isControlAccount: false,
  bankName: '',
  bankAccountNo: '',
  notes: '',
  isActive: true,
});

export function fromAccount(a: ErpAccount): AccountFormData {
  return {
    code: a.code,
    name: a.name,
    alias: a.alias ?? '',
    accountType: a.type,
    accountKind: a.kind,
    normalBalance: normalBalanceForAccountType(a.type),
    cashFlowCategory: a.cashFlowCategory ?? '',
    parentId: a.parentId ?? '',
    parentLabel: a.parent ? `${a.parent.code} — ${a.parent.name}` : '',
    currencyId: a.currencyId ?? '',
    currencyLabel: a.currency ? `${a.currency.code} — ${a.currency.name}` : '',
    isControlAccount: a.isControlAccount,
    bankName: a.bankName ?? '',
    bankAccountNo: a.bankAccountNo ?? '',
    notes: a.notes ?? '',
    isActive: a.isActive,
  };
}

export function toAccountPayload(f: AccountFormData): CreateAccountPayload {
  const shouldSendLeafDetails = f.accountKind === 'POSTABLE';
  return {
    code: f.code,
    name: f.name,
    alias: f.alias || undefined,
    accountType: f.accountType,
    accountKind: f.accountKind,
    normalBalance: normalBalanceForAccountType(f.accountType),
    cashFlowCategory: (f.cashFlowCategory as ErpCashFlowCategory) || undefined,
    parentId: f.parentId || null,
    currencyId: shouldSendLeafDetails ? f.currencyId || null : null,
    isControlAccount: f.isControlAccount,
    bankName: shouldSendLeafDetails ? f.bankName || undefined : undefined,
    bankAccountNo: shouldSendLeafDetails ? f.bankAccountNo || undefined : undefined,
    notes: f.notes || undefined,
    isActive: f.isActive,
  };
}

async function loadParentOptions(
  search: string,
  page: number,
  limit: number,
): Promise<{ data: SearchSelectOption[]; total: number }> {
  const res = await listAccounts({
    search: search || undefined,
    page,
    limit,
    isActive: true,
    accountKind: 'HEADER',
  });
  return {
    data: res.data.map((a) => ({ value: a.id, label: a.name, code: a.code, meta: a.type })),
    total: res.meta?.total ?? res.data.length,
  };
}

export const validateAccount = (form: AccountFormData) => {
  const fmt = accountCodeFormatCache;
  const isLeaf = isLeafAccountCode(form.code, fmt);
  return validateForm(form, [
    {
      field: 'code',
      label: 'Kode',
      required: true,
      validate: (value) => {
        if (typeof value !== 'string') return undefined;
        if (!fmt) return undefined;
        const re = buildAccountCodePattern(fmt.segments, fmt.separator);
        return re.test(value)
          ? undefined
          : `Format wajib ${fmt.patternSource} (contoh: ${fmt.example})`;
      },
    },
    { field: 'name', label: 'Nama', required: true },
    {
      field: 'currencyId',
      label: 'Mata Uang',
      validate: () => {
        const hasDetails = Boolean(form.currencyId || form.bankName || form.bankAccountNo);
        return fmt && hasDetails && !isLeaf
          ? 'Mata uang/bank hanya boleh untuk kode segmen terakhir'
          : undefined;
      },
    },
    {
      field: 'bankName',
      label: 'Bank',
      validate: () => {
        if (form.bankAccountNo && !form.bankName) return 'Bank wajib diisi bila No. Rekening diisi';
        if (form.bankName && !form.bankAccountNo) return 'No. Rekening wajib diisi bila Bank diisi';
        return undefined;
      },
    },
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
  const format = useAccountCodeFormat();
  const codePlaceholder = format?.example ?? '1101.01.001';
  const codeMaxLength = format?.maxLength ?? 30;
  const isChild = Boolean(data.parentId);
  const isLeaf = isLeafAccountCode(data.code, format);
  const canShowPostingDetails = data.accountKind === 'POSTABLE' && isLeaf;

  const set = (k: keyof AccountFormData, v: string | boolean) => {
    onChange({ ...data, [k]: v });
  };

  const setAccountType = (type: ErpAccountType) => {
    onChange({ ...data, accountType: type, normalBalance: normalBalanceForAccountType(type) });
  };

  const setAccountKind = (kind: ErpAccountKind) => {
    const patch: AccountFormData = { ...data, accountKind: kind };
    if (kind === 'HEADER') {
      patch.currencyId = '';
      patch.currencyLabel = '';
      patch.bankName = '';
      patch.bankAccountNo = '';
    }
    onChange(patch);
  };

  const handleParentPick = (opt: { value: string; label: string; meta?: string }) => {
    const parentType = opt.meta as ErpAccountType | undefined;
    if (!parentType) return;
    onChange({
      ...data,
      parentId: opt.value,
      parentLabel: `${opt.label}`,
      accountType: parentType,
      normalBalance: normalBalanceForAccountType(parentType),
    });
  };

  const clearParent = (value: string) => {
    if (value) {
      set('parentId', value);
      return;
    }
    onChange({ ...data, parentId: '', parentLabel: '' });
  };

  return (
    <div className="p-4">
      <FormField label="Parent" htmlFor="ac-parent">
        <SearchSelect
          id="ac-parent"
          placeholder="— Root —"
          value={data.parentId}
          initialLabel={data.parentLabel}
          onValueChange={clearParent}
          onPick={handleParentPick}
          loadOptions={loadParentOptions}
        />
      </FormField>
      <FormField label="Kode" htmlFor="ac-code" required error={errors.code}>
        <Input id="ac-code" value={data.code} onChange={(e) => set('code', e.target.value)} placeholder={codePlaceholder} aria-invalid={!!errors.code} maxLength={codeMaxLength} />
      </FormField>
      <FormField label="Nama" htmlFor="ac-name" required error={errors.name}>
        <Input id="ac-name" value={data.name} onChange={(e) => set('name', e.target.value)} placeholder="Kas Kecil" aria-invalid={!!errors.name} />
      </FormField>
      <FormField label="Alias" htmlFor="ac-alias">
        <Input id="ac-alias" value={data.alias} onChange={(e) => set('alias', e.target.value)} placeholder="Petty Cash" />
      </FormField>
      <FormField label="Tipe Akun" htmlFor="ac-type" required>
        <Select value={data.accountType} onValueChange={(v) => setAccountType(v as ErpAccountType)} disabled={isChild}>
          <SelectTrigger id="ac-type"><SelectValue /></SelectTrigger>
          <SelectContent>
            {ACCOUNT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        {isChild ? <p className="mt-1 text-xs text-muted-foreground italic">Mengikuti tipe parent.</p> : null}
      </FormField>
      <FormField label="Jenis" htmlFor="ac-kind" required>
        <Select value={data.accountKind} onValueChange={(v) => setAccountKind(v as ErpAccountKind)}>
          <SelectTrigger id="ac-kind"><SelectValue /></SelectTrigger>
          <SelectContent>
            {ACCOUNT_KINDS.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
          </SelectContent>
        </Select>
      </FormField>
      <FormField label="Saldo Normal" htmlFor="ac-nb">
        <div className="flex items-center h-10">
          <Badge variant={data.normalBalance === 'DEBIT' ? 'success' : 'info'}>{data.normalBalance}</Badge>
          <span className="text-xs text-muted-foreground ml-3 italic">* Ditentukan otomatis dari Tipe Akun</span>
        </div>
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

      {canShowPostingDetails ? (
        <div className="my-3 rounded-md border border-border bg-muted/20 p-3">
          <p className="mb-3 text-sm font-medium text-foreground">Detail Akun Posting</p>
          <FormField label="Mata Uang" htmlFor="ac-currency" error={errors.currencyId}>
            <SearchSelect
              id="ac-currency"
              placeholder="Pilih mata uang"
              value={data.currencyId}
              initialLabel={data.currencyLabel}
              onValueChange={(v) => set('currencyId', v)}
              loadOptions={loadCurrencyOptions}
              error={!!errors.currencyId}
            />
          </FormField>
          <FormField label="Bank" htmlFor="ac-bank" error={errors.bankName}>
            <Input id="ac-bank" value={data.bankName} onChange={(e) => set('bankName', e.target.value)} placeholder="Bank BCA" aria-invalid={!!errors.bankName} />
          </FormField>
          <FormField label="No. Rekening" htmlFor="ac-bank-no">
            <Input id="ac-bank-no" value={data.bankAccountNo} onChange={(e) => set('bankAccountNo', e.target.value)} placeholder="123-456-7890" />
          </FormField>
        </div>
      ) : (
        <p className="mb-3 text-xs text-muted-foreground italic">
          Mata uang, no. rekening, dan bank hanya tersedia untuk akun POSTABLE pada segmen kode terakhir.
        </p>
      )}

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
