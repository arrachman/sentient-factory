import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

type MovementWithLines = Prisma.ErpInvStockMovementGetPayload<{
  include: { lines: true };
}>;

/**
 * Stock posting for inventory movements.
 *
 * Stock balance in Senti is a DERIVED view (`inv_stock_balances`) computed from
 * POSTED movements — there is no separate stock-ledger table to write into.
 * Therefore POST is a status flip: once status = POSTED the movement is counted
 * by the balance view. This service validates that the document has lines and
 * leaves a single seam (`postMovement` / `reverseMovement`) where future GL
 * valuation (COGS/inventory accrual for valued issues) can drop in without
 * touching the call sites — mirrors SlsOrderPostingService.
 */
@Injectable()
export class InvStockMovementPostingService {
  /**
   * Validates the movement has at least one line. No ledger rows are written —
   * the derived `inv_stock_balances` view picks up the movement once POSTED.
   */
  async postMovement(
    _tx: Prisma.TransactionClient,
    movement: MovementWithLines,
    _actorId: bigint | null,
  ): Promise<void> {
    if (!movement.lines.length) {
      throw new BadRequestException('Tidak bisa posting: belum ada baris item.');
    }
    // Intentionally no ledger rows — stock balance is derived from POSTED movements.
  }

  /**
   * NO-OP reversal. Reopening a movement flips it out of POSTED, removing it from
   * the derived balance — nothing to delete. Kept for signature parity.
   */
  async reverseMovement(_tx: Prisma.TransactionClient, _movementId: bigint): Promise<void> {
    // No entries to remove — balance is derived from POSTED status.
  }
}
