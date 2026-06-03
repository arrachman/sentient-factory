import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

type AdjustmentWithLines = Prisma.ErpInvStockAdjustmentGetPayload<{
  include: { lines: true };
}>;

/**
 * Stock posting for inventory adjustments.
 *
 * Stock balance in Senti is a DERIVED view (`inv_stock_balances`) computed from
 * POSTED transactions — there is no separate stock-ledger table to write into.
 * Therefore POST is a status flip: once status = POSTED the adjustment is counted
 * by the balance view. This service validates that the document has lines and
 * leaves a single seam (`postAdjustment` / `reverseAdjustment`) where future GL
 * valuation (the inventory/contra journal for each adjustment line) can drop in
 * without touching the call sites — mirrors InvStockMovementPostingService.
 */
@Injectable()
export class InvStockAdjustmentPostingService {
  /**
   * Validates the adjustment has at least one line. No ledger rows are written —
   * the derived `inv_stock_balances` view picks up the adjustment once POSTED.
   * GL valuation (Dr/Cr inventory vs contra per line.direction) is a future seam.
   */
  async postAdjustment(
    _tx: Prisma.TransactionClient,
    adjustment: AdjustmentWithLines,
    _actorId: bigint | null,
  ): Promise<void> {
    if (!adjustment.lines.length) {
      throw new BadRequestException('Tidak bisa posting: belum ada baris item.');
    }
    // Intentionally no ledger rows — stock balance is derived from POSTED adjustments.
  }

  /**
   * NO-OP reversal. Reopening an adjustment flips it out of POSTED, removing it
   * from the derived balance — nothing to delete. Kept for signature parity.
   */
  async reverseAdjustment(_tx: Prisma.TransactionClient, _adjustmentId: bigint): Promise<void> {
    // No entries to remove — balance is derived from POSTED status.
  }
}
