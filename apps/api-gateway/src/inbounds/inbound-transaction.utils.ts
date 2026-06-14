import { BadRequestException } from '@nestjs/common';
import { CreateInboundBatchDto } from './dto/create-inbound-batch.dto';
import { CreateInboundDetailDto } from './dto/create-inbound-detail.dto';

// ─── Shared types ────────────────────────────────────────────────────────────

export type NormalizedInboundBatch = {
  batchIn: string;
  qty: number;
  expiredDate?: string;
  notes?: string;
};

export type NormalizedInboundDetail = {
  itemId: number;
  qty: number;
  uomInput?: number;
  notes?: string;
  batches: NormalizedInboundBatch[];
};

// ─── Parsing ─────────────────────────────────────────────────────────────────

/** Strict integer parse — throws BadRequestException on failure. */
export function parseIntStrict(value: string, fieldLabel: string): number {
  const parsed = Number(String(value ?? '').trim());
  if (!Number.isInteger(parsed)) {
    throw new BadRequestException(`${fieldLabel} is invalid`);
  }
  return parsed;
}

// ─── Normalizers (pure — no I/O) ─────────────────────────────────────────────

export function normalizeAndValidateBatches(
  batches: CreateInboundBatchDto[],
): NormalizedInboundBatch[] {
  if (!batches.length) {
    throw new BadRequestException('At least one batch row is required for each detail');
  }

  const seenBatchNumbers = new Set<string>();

  return batches.map((rawBatch) => {
    const batchIn = rawBatch.batchIn.trim();
    if (!batchIn) {
      throw new BadRequestException('Batch number is required');
    }

    const batchKey = batchIn.toLowerCase();
    if (seenBatchNumbers.has(batchKey)) {
      throw new BadRequestException(`Duplicate batch number in one detail: ${batchIn}`);
    }
    seenBatchNumbers.add(batchKey);

    const qty = Number(rawBatch.qty);
    if (!Number.isFinite(qty) || qty <= 0) {
      throw new BadRequestException(`Batch qty must be greater than 0 for batch ${batchIn}`);
    }

    return {
      batchIn,
      qty,
      expiredDate: rawBatch.expiredDate,
      notes: rawBatch.notes?.trim() || undefined,
    };
  });
}

export function normalizeAndValidateDetails(
  details: CreateInboundDetailDto[],
): NormalizedInboundDetail[] {
  if (!details.length) {
    throw new BadRequestException('At least one detail row is required');
  }

  const seenItemIds = new Set<number>();

  return details.map((rawDetail) => {
    const itemId = parseIntStrict(String(rawDetail.itemId), 'Detail itemId');

    if (seenItemIds.has(itemId)) {
      throw new BadRequestException(`Duplicate item in detail: ${itemId}`);
    }
    seenItemIds.add(itemId);

    const batches = normalizeAndValidateBatches(rawDetail.batches);
    const qtyFromBatches = batches.reduce((total, batch) => total + batch.qty, 0);
    const detailQty = Number(rawDetail.qty);
    const detailUomInput = Number(rawDetail.uomInput);

    if (!Number.isFinite(detailQty) || detailQty <= 0) {
      throw new BadRequestException(`Detail qty for item ${itemId} must be greater than 0`);
    }

    if (!Number.isInteger(detailUomInput) || detailUomInput < 0) {
      throw new BadRequestException(
        `Detail uomInput for item ${itemId} must be an integer and cannot be negative`,
      );
    }

    if (Math.abs(detailQty - qtyFromBatches) > 0.0001) {
      throw new BadRequestException(
        `Detail qty must equal sum of batch qty for item ${itemId}. Detail qty=${detailQty}, batch total=${qtyFromBatches}`,
      );
    }

    return {
      itemId,
      qty: detailQty,
      uomInput: detailUomInput,
      notes: rawDetail.notes?.trim() || undefined,
      batches,
    };
  });
}
