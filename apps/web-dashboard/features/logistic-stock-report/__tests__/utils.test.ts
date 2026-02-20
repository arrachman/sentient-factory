import { describe, expect, it } from 'vitest';
import {
  buildReportQuery,
  formatProductLabel,
  resetReportFilters,
  toEntityId,
} from '@/features/logistic-stock-report/model/utils';

describe('logistic stock report utils', () => {
  it('builds query with locked warehouse for non-admin users', () => {
    const query = buildReportQuery({
      filters: {
        warehouseId: 'warehouse-from-filter',
        supplierId: 'supplier-1',
        itemId: 'item-1',
      },
      isAdminRole: false,
      lockedWarehouseId: 'warehouse-locked',
    });

    expect(query.get('warehouseId')).toBe('warehouse-locked');
    expect(query.get('supplierId')).toBe('supplier-1');
    expect(query.get('itemId')).toBe('item-1');
  });

  it('resets filters while preserving locked warehouse for non-admin users', () => {
    const next = resetReportFilters(
      {
        warehouseId: 'warehouse-id',
        supplierId: 'supplier-id',
        itemId: 'item-id',
      },
      false,
      'locked-warehouse',
    );

    expect(next).toEqual({
      warehouseId: 'locked-warehouse',
      supplierId: '',
      itemId: '',
    });
  });

  it('formats product label from batch + item metadata', () => {
    expect(
      formatProductLabel({
        uuid: '1',
        batch: { batchNumber: 'BATCH-01' },
        item: { code: 'ITEM-01', name: 'Paracetamol', uom: { code: 'BOX' } },
      }),
    ).toBe('BATCH-01 ITEM-01 Paracetamol BOX');
  });

  it('normalizes entity id from unknown values', () => {
    expect(toEntityId('  abc  ')).toBe('abc');
    expect(toEntityId(null)).toBe('');
    expect(toEntityId('undefined')).toBe('');
  });
});
