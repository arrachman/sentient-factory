import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

type OpeningStockWithLines = Prisma.ErpInvOpeningStockGetPayload<{
  include: { lines: true };
}>;

/**
 * Stock posting for inventory opening balances.
 *
 * Stock balance in Senti is a DERIVED view (`inv_stock_balances`) computed from
 * POSTED transactions — there is no separate stock-ledger table to write into.
 * Therefore POST is a status flip: once status = POSTED the opening stock is
 * counted by the balance view. This service validates that the document has
 * lines and leaves a single seam (`postOpeningStock` / `reverseOpeningStock`)
 * where future GL valuation (debit inventory / credit opening-equity) can drop
 * in without touching the call sites — mirrors InvStockMovementPostingService.
 */
@Injectable()
export class InvOpeningStockPostingService {
  /**
   * Validates the opening stock has at least one line. No ledger rows are
   * written — the derived `inv_stock_balances` view picks it up once POSTED.
   * GL valuation for the opening balance journal is a future seam here.
   */
  async postOpeningStock(
    _tx: Prisma.TransactionClient,
    openingStock: OpeningStockWithLines,
    _actorId: bigint | null,
  ): Promise<void> {
    if (!openingStock.lines.length) {
      throw new BadRequestException('Tidak bisa posting: belum ada baris item.');
    }
    // Intentionally no ledger rows — stock balance is derived from POSTED status.
  }

  /**
   * NO-OP reversal. Reopening an opening stock flips it out of POSTED, removing
   * it from the derived balance — nothing to delete. Kept for signature parity.
   */
  async reverseOpeningStock(_tx: Prisma.TransactionClient, _openingStockId: bigint): Promise<void> {
    // No entries to remove — balance is derived from POSTED status.
  }
}
