import { BadRequestException } from '@nestjs/common';
import { toAuditUserId } from '../common/utils/audit-user.util';

export function normalizeRequiredDoNumber(value?: string): string {
  const doNumber = String(value ?? '').trim();
  if (!doNumber) {
    throw new BadRequestException('DO number is required');
  }
  return doNumber;
}

export function parseId(value: string | number, label: string): number {
  if (typeof value === 'number') {
    if (Number.isInteger(value) && value > 0) {
      return value;
    }
    throw new BadRequestException(`${label} must be a valid integer`);
  }

  const normalized = String(value ?? '').trim();
  if (!normalized) {
    throw new BadRequestException(`${label} is required`);
  }

  const parsed = Number(normalized);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new BadRequestException(`${label} must be a valid integer`);
  }

  return parsed;
}

export function parseOptionalId(
  value: string | number | null | undefined,
  label: string,
): number | undefined {
  if (typeof value === 'undefined' || value === null) {
    return undefined;
  }
  if (typeof value === 'string' && !value.trim()) {
    return undefined;
  }
  return parseId(value, label);
}

export function parseOptionalActorUserId(actorId?: string | number): number | undefined {
  if (typeof actorId === 'undefined' || actorId === null) {
    return undefined;
  }
  const normalized = String(actorId).trim();
  if (!normalized) {
    return undefined;
  }
  const parsed = Number(normalized);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return undefined;
  }
  return parsed;
}

export function parseOptionalActorId(actorId?: string | number): number | undefined {
  if (typeof actorId === 'number') {
    return Number.isInteger(actorId) ? actorId : undefined;
  }
  const parsed = Number(String(actorId ?? '').trim());
  return Number.isInteger(parsed) ? parsed : undefined;
}

export function normalizeAuditActor(actorId?: string | number): number | undefined {
  const normalized = toAuditUserId(actorId);
  return normalized ?? undefined;
}

export function isMissingWarehouseColumnError(error: unknown): boolean {
  const code = String((error as any)?.code ?? '').trim();
  const metaText = JSON.stringify((error as any)?.meta ?? {})
    .toLowerCase()
    .trim();
  return code === 'P2022' && metaText.includes('warehouse_id');
}

export function normalizeAndValidateDetails<
  T extends { itemId: string | number; batchNumber: string; qtyPcs?: number | null; qtyKg: number; notes?: string | null },
>(
  details: T[],
): (Omit<T, 'itemId' | 'batchNumber'> & { itemId: number; batchNumber: string })[] {
  if (!details.length) {
    throw new BadRequestException('At least one detail row is required');
  }

  const seen = new Set<string>();

  return details.map((raw) => {
    const itemId = parseId(raw.itemId, 'detail.itemId');
    const batchNumber = raw.batchNumber.trim();

    if (!itemId) {
      throw new BadRequestException('Detail itemId is required');
    }

    if (!batchNumber) {
      throw new BadRequestException('Detail batchNumber is required');
    }

    const compositeKey = `${String(itemId)}::${batchNumber.toLowerCase()}`;
    if (seen.has(compositeKey)) {
      throw new BadRequestException(
        `Duplicate item and batch combination: ${itemId} - ${batchNumber}`,
      );
    }
    seen.add(compositeKey);

    return {
      ...raw,
      itemId,
      batchNumber,
    };
  });
}
