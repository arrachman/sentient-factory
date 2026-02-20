import { describe, expect, it } from 'vitest';
import {
  addDays,
  calculateStandardReceivedDate,
  mapApiDetails,
  normalizeNumber,
  outboundStatusBadgeVariant,
  resolveDeliveryKpiStatus,
} from '@/features/logistic-transaction/model/utils';

describe('logistic transaction utils', () => {
  it('maps status into badge variants', () => {
    expect(outboundStatusBadgeVariant('OPEN')).toBe('warning');
    expect(outboundStatusBadgeVariant('DELIVERY')).toBe('info');
    expect(outboundStatusBadgeVariant('DELIVERED')).toBe('primary');
    expect(outboundStatusBadgeVariant('COMPLETED')).toBe('success');
  });

  it('calculates standard received date', () => {
    expect(calculateStandardReceivedDate('2026-02-20', 3)).toBe('2026-02-23');
    expect(addDays('2026-02-20', '3')).not.toBe('-');
  });

  it('resolves KPI status', () => {
    expect(resolveDeliveryKpiStatus('2026-02-20', '2026-02-21')).toBe('ONTIME');
    expect(resolveDeliveryKpiStatus('2026-02-22', '2026-02-21')).toBe('LATE');
  });

  it('normalizes decimal-like payload values', () => {
    expect(normalizeNumber(10)).toBe(10);
    expect(normalizeNumber('10.5')).toBe(10.5);
    expect(normalizeNumber({ s: 1, e: 1, d: [12] })).toBeGreaterThan(0);
  });

  it('maps API details into form rows', () => {
    const mapped = mapApiDetails([
      {
        itemId: 'item-1',
        batchNumber: 'BATCH-01',
        qtyPcs: 12,
        qtyKg: '10.2',
      },
    ]);

    expect(mapped).toHaveLength(1);
    expect(mapped[0].itemId).toBe('item-1');
    expect(mapped[0].batchNumbers).toEqual(['BATCH-01']);
    expect(mapped[0].batchQtyMap['BATCH-01']).toBe('12');
  });
});
