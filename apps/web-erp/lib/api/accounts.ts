// ERP Account resource API — CRUD for md_accounts (Chart of Accounts)
// Endpoints: /accounts. Hierarchy via parentId (flat list, no /tree route).

import { apiGet, apiPost, apiPatch, apiPut, apiDelete } from './client';
import type { ApiResponse, PaginatedResponse, PaginationParams } from './types';

// ─── Enums (from CreateErpAccountDto / Prisma) ─────────────────────────────────

export type ErpAccountType =
  | 'ASSET'
  | 'LIABILITY'
  | 'EQUITY'
  | 'REVENUE'
  | 'EXPENSE';

export type ErpAccountKind = 'HEADER' | 'POSTABLE';

export type ErpNormalBalance = 'DEBIT' | 'CREDIT';

export type ErpCashFlowCategory = 'OPERATING' | 'INVESTING' | 'FINANCING';

export const ACCOUNT_TYPES: ErpAccountType[] = [
  'ASSET',
  'LIABILITY',
  'EQUITY',
  'REVENUE',
  'EXPENSE',
];

export const ACCOUNT_KINDS: ErpAccountKind[] = ['HEADER', 'POSTABLE'];

export const NORMAL_BALANCES: ErpNormalBalance[] = ['DEBIT', 'CREDIT'];

export const CASH_FLOW_CATEGORIES: ErpCashFlowCategory[] = [
  'OPERATING',
  'INVESTING',
  'FINANCING',
];

// ─── Types ────────────────────────────────────────────────────────────────────

// NOTE: read responses expose `type`/`kind`; create/update payload uses
// `accountType`/`accountKind` (per CreateErpAccountDto).
export interface ErpAccount {
  id: string;
  code: string;
  name: string;
  alias?: string | null;
  type: ErpAccountType;
  kind: ErpAccountKind;
  normalBalance: ErpNormalBalance;
  cashFlowCategory?: ErpCashFlowCategory | null;
  parentId?: string | null;
  currencyId?: string | null;
  level?: number | null;
  isControlAccount: boolean;
  bankName?: string | null;
  bankAccountNo?: string | null;
  notes?: string | null;
  isActive: boolean;
  legacyCode?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountPayload {
  code: string;
  name: string;
  alias?: string;
  accountType: ErpAccountType;
  accountKind: ErpAccountKind;
  normalBalance: ErpNormalBalance;
  cashFlowCategory?: ErpCashFlowCategory;
  parentId?: string | null;
  isControlAccount?: boolean;
  notes?: string;
  isActive?: boolean;
}

export type UpdateAccountPayload = Partial<CreateAccountPayload>;

// ─── API functions ────────────────────────────────────────────────────────────

export async function listAccounts(
  params?: PaginationParams & {
    accountType?: ErpAccountType;
    accountKind?: ErpAccountKind;
    normalBalance?: ErpNormalBalance;
  },
): Promise<PaginatedResponse<ErpAccount>> {
  return apiGet<PaginatedResponse<ErpAccount>>(
    '/accounts',
    params as Record<string, string | number | boolean | undefined>,
  );
}

export async function createAccount(
  payload: CreateAccountPayload,
): Promise<ErpAccount> {
  const res = await apiPost<ApiResponse<ErpAccount>>('/accounts', payload);
  return res.data;
}

export async function updateAccount(
  id: string,
  payload: UpdateAccountPayload,
): Promise<ErpAccount> {
  const res = await apiPatch<ApiResponse<ErpAccount>>(
    `/accounts/${id}`,
    payload,
  );
  return res.data;
}

export async function deleteAccount(id: string): Promise<void> {
  await apiDelete<void>(`/accounts/${id}`);
}

export async function bulkUpdateAccountStatus(
  ids: string[],
  isActive: boolean,
): Promise<{ affected: number }> {
  const res = await apiPatch<{ success: boolean; affected: number }>(
    '/accounts/bulk/status',
    { ids, isActive },
  );
  return { affected: res.affected };
}

export async function bulkDeleteAccounts(
  ids: string[],
): Promise<{ affected: number }> {
  const res = await apiDelete<{ success: boolean; affected: number }>(
    '/accounts/bulk',
    { ids },
  );
  return { affected: res.affected };
}

// ─── Account code format (sys_settings group "account-code") ──────────────────

export interface AccountCodeFormat {
  segments: number[];
  separator: string;
  patternSource: string;
  maxLength: number;
  example: string;
  accountCount: number;
  locked: boolean;
}

export async function getAccountCodeFormat(): Promise<AccountCodeFormat> {
  const res = await apiGet<ApiResponse<AccountCodeFormat>>('/accounts/code-format');
  return res.data;
}

export async function updateAccountCodeFormat(
  segments: number[],
  separator: string,
): Promise<Omit<AccountCodeFormat, 'accountCount' | 'locked'>> {
  const res = await apiPut<ApiResponse<Omit<AccountCodeFormat, 'accountCount' | 'locked'>>>(
    '/accounts/code-format',
    { segments, separator },
  );
  return res.data;
}
