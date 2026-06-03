import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

type GrnWithLines = Prisma.ErpPurGoodsReceiptGetPayload<{ include: { lines: true } }>;

/**
 * GL posting for Goods Receipts → fin_ledger_entries.
 *
 * TODO (follow-up): a posted GRN SHOULD generate inventory accrual entries:
 *   Dr Inventory (inventoryAccountId) by acceptedQty × unitCost
 *   Cr GR/IR Accrual (accruedPayableAccountId)
 * Only acceptedQty increases stock (QC-gated). This double-entry posting is
 * deferred to a dedicated pass that wires `inv_*` stock movements.
 *
 * For now `postToLedger` is a NO-OP (parity with PO/PR/PI): validates at least
 * one line, then marks status POSTED. Signature mirrors the other posting services.
 */
@Injectable()
export class PurGoodsReceiptPostingService {
  async postToLedger(
    _tx: Prisma.TransactionClient,
    grn: GrnWithLines,
    _actorId: bigint | null,
  ): Promise<void> {
    if (!grn.lines.length) {
      throw new BadRequestException('Tidak bisa posting: belum ada baris item.');
    }
    // Intentionally no fin_ledger_entries written yet — GRN posting is a follow-up.
  }

  async reverseLedger(_tx: Prisma.TransactionClient, _grnId: bigint): Promise<void> {
    // No entries to remove — GRN posts no GL entries yet.
  }
}
