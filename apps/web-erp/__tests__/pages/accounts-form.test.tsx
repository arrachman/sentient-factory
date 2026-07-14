import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/api/accounts', async () => {
  const actual = await vi.importActual<typeof import('@/lib/api/accounts')>('@/lib/api/accounts');
  return {
    ...actual,
    getAccountCodeFormat: vi.fn(),
    listAccounts: vi.fn(),
  };
});

vi.mock('@/lib/api/currencies', () => ({
  listCurrencies: vi.fn(),
}));

import {
  defaultAccountForm,
  fromAccount,
  toAccountPayload,
  validateAccount,
} from '@/components/pages/accounts-form';
import type { ErpAccount } from '@/lib/api/accounts';

describe('accounts form mapping', () => {
  it('includes posting details for postable accounts', () => {
    const form = {
      ...defaultAccountForm(),
      code: '1110.01.001',
      name: 'Bank BCA - Giro IDR',
      accountKind: 'POSTABLE' as const,
      currencyId: '1',
      bankName: 'Bank BCA',
      bankAccountNo: '123-456-7890',
    };

    expect(toAccountPayload(form)).toMatchObject({
      currencyId: '1',
      bankName: 'Bank BCA',
      bankAccountNo: '123-456-7890',
    });
  });

  it('clears posting details from header payloads', () => {
    const form = {
      ...defaultAccountForm(),
      code: '1100.00.000',
      name: 'Aset Lancar',
      accountKind: 'HEADER' as const,
      currencyId: '1',
      bankName: 'Bank BCA',
      bankAccountNo: '123-456-7890',
    };

    expect(toAccountPayload(form)).toMatchObject({
      currencyId: null,
      bankName: undefined,
      bankAccountNo: undefined,
    });
  });

  it('hydrates parent and currency labels from an account record', () => {
    const account: ErpAccount = {
      id: '10',
      code: '1110.01.001',
      name: 'Bank BCA - Giro IDR',
      type: 'ASSET',
      kind: 'POSTABLE',
      normalBalance: 'DEBIT',
      parentId: '2',
      parent: { id: '2', code: '1100.00.000', name: 'Aset Lancar' },
      currencyId: '1',
      currency: { id: '1', code: 'IDR', name: 'Rupiah', symbol: 'Rp' },
      isControlAccount: false,
      bankName: 'Bank BCA',
      bankAccountNo: '123-456-7890',
      isActive: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    };

    expect(fromAccount(account)).toMatchObject({
      parentLabel: '1100.00.000 — Aset Lancar',
      currencyLabel: 'IDR — Rupiah',
      bankName: 'Bank BCA',
      bankAccountNo: '123-456-7890',
    });
  });

  it('validates paired bank fields', () => {
    const errors = validateAccount({
      ...defaultAccountForm(),
      code: '1110.01.001',
      name: 'Bank BCA',
      bankAccountNo: '123-456-7890',
    });

    expect(errors.bankName).toBe('Bank wajib diisi bila No. Rekening diisi');
  });
});
