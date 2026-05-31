// Shared form-data model for cash/bank transactions (CR/CD/BD…). The header
// and contra-lines are identical across directions; only `direction` (and a few
// UI labels handled by the form component) differ. Keeping the model here lets
// every direction reuse one default/from/to mapping (§3 — no duplication).

import { newCashLine, type CashLineRow } from '@/components/organisms/cash-bank-lines';
import { type GiroRow } from '@/components/organisms/cash-bank-giros';
import type {
  CashBankDirection,
  CreateCashReceiptPayload,
  ErpCashBankKind,
  ErpCashReceipt,
  ErpDocumentStatus,
  ErpPaymentMethod,
} from '@/lib/api/fin-cash-receipts';

export interface CashBankFormData {
  id?: string;
  docNumber: string;
  auto: boolean;
  kind: ErpCashBankKind;
  /** Cara Bayar — only meaningful for bank (kind=BANK) transactions. */
  paymentMethod: ErpPaymentMethod | '';
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
  giros: GiroRow[];
}

const todayIso = () => new Date().toISOString().slice(0, 10);

/** Bank transactions default Cara Bayar = Transfer; cash leave it blank. */
export function defaultCashBankForm(kind: ErpCashBankKind = 'CASH'): CashBankFormData {
  return {
    docNumber: '',
    auto: true,
    kind,
    paymentMethod: kind === 'BANK' ? 'TRANSFER' : '',
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
    giros: [],
  };
}

const acctLabel = (ref?: { code: string; name: string } | null) =>
  ref ? `${ref.code} - ${ref.name}` : undefined;

export function fromCashBankTransaction(r: ErpCashReceipt): CashBankFormData {
  return {
    id: r.id,
    docNumber: r.docNumber,
    auto: !!r.autoNumber,
    kind: r.kind,
    paymentMethod: r.paymentMethod ?? '',
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
      divisionId: l.divisionId ?? undefined,
      subdivisionId: l.subdivisionId ?? undefined,
      projectId: l.projectId ?? undefined,
      customFields: l.customFields ?? undefined,
    })),
    giros: (r.giros ?? []).map((g) => ({
      key: `g-${g.id ?? g.lineNo}`,
      id: g.id,
      giroNumber: g.giroNumber,
      bankName: g.bankName ?? '',
      bankAccountNo: g.bankAccountNo ?? '',
      amount: g.amount,
      dueDate: g.dueDate.slice(0, 10),
      notes: g.notes ?? '',
    })),
  };
}

export function toCashBankPayload(
  d: CashBankFormData,
  direction: CashBankDirection,
): CreateCashReceiptPayload {
  const isBank = d.kind === 'BANK';
  return {
    auto: d.auto,
    docNumber: d.auto ? undefined : d.docNumber || undefined,
    direction,
    kind: d.kind,
    paymentMethod: isBank && d.paymentMethod ? d.paymentMethod : undefined,
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
        divisionId: l.divisionId || undefined,
        subdivisionId: l.subdivisionId || undefined,
        projectId: l.projectId || undefined,
        customFields:
          l.customFields && Object.keys(l.customFields).length ? l.customFields : undefined,
        lineNo: i + 1,
      })),
    // Send giros only for bank transactions; omit entirely for cash so the
    // backend skips giro sync (undefined = "no change").
    giros: isBank
      ? d.giros
          .filter((g) => g.giroNumber && Number(g.amount) > 0 && g.dueDate)
          .map((g, i) => ({
            giroNumber: g.giroNumber,
            bankName: g.bankName || undefined,
            bankAccountNo: g.bankAccountNo || undefined,
            amount: g.amount,
            dueDate: g.dueDate,
            notes: g.notes || undefined,
            lineNo: i + 1,
          }))
      : undefined,
  };
}
