import type {
  FilterState,
  ItemOption,
  StockBatchRow,
  StockReportQueryInput,
  SupplierOption,
  WarehouseOption,
} from '@/features/logistic-stock-report/model/types';

export function fmtDate(value?: string | null): string {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function fmtExcelDate(value?: string | null): string {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());
  return `${day}/${month}/${year}`;
}

export function fmtNumber(value?: number): string {
  const n = Number(value ?? 0);
  if (Number.isNaN(n)) {
    return '0';
  }

  return n.toLocaleString('id-ID');
}

export function downloadBufferAsXlsx(buffer: ArrayBuffer, filename: string): void {
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function toEntityId(value: unknown): string {
  if (value == null) {
    return '';
  }

  const id = String(value).trim();
  if (!id || id === 'null' || id === 'undefined') {
    return '';
  }

  return id;
}

export function pickEntityId(entity?: { id?: string | number; uuid?: string | number } | null): string {
  return toEntityId(entity?.id ?? entity?.uuid);
}

export function extractRoleNames(values: unknown[]): string[] {
  return values
    .map((value) => {
      if (!value) {
        return '';
      }

      if (typeof value === 'string') {
        return value;
      }

      if (typeof value === 'object') {
        const roleName = (value as { name?: unknown })?.name;
        if (typeof roleName === 'string') {
          return roleName;
        }

        const nestedRoleName = (value as { role?: { name?: unknown } })?.role?.name;
        if (typeof nestedRoleName === 'string') {
          return nestedRoleName;
        }
      }

      return '';
    })
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export function formatProductLabel(row?: StockBatchRow | null): string {
  const parts = [
    String(row?.batch?.batchNumber ?? '').trim(),
    String(row?.item?.code ?? '').trim(),
    String(row?.item?.name ?? '').trim(),
    String(row?.item?.uom?.code ?? '').trim(),
  ].filter(Boolean);

  return parts.join(' ');
}

export function buildReportQuery({ filters, isAdminRole, lockedWarehouseId }: StockReportQueryInput): URLSearchParams {
  const query = new URLSearchParams();

  if (!isAdminRole && lockedWarehouseId) {
    query.set('warehouseId', lockedWarehouseId);
  } else if (filters.warehouseId) {
    query.set('warehouseId', filters.warehouseId);
  }

  if (filters.supplierId) {
    query.set('supplierId', filters.supplierId);
  }

  if (filters.itemId) {
    query.set('itemId', filters.itemId);
  }

  return query;
}

export function resetReportFilters(current: FilterState, isAdminRole: boolean, lockedWarehouseId: string): FilterState {
  return {
    ...current,
    warehouseId: isAdminRole ? '' : lockedWarehouseId,
    supplierId: '',
    itemId: '',
  };
}

export function toWarehouseSelectOptions(warehouses: WarehouseOption[]): Array<{ value: string; label: string }> {
  return warehouses.flatMap((warehouse) => {
    const value = pickEntityId(warehouse);
    if (!value) {
      return [];
    }

    return {
      value,
      label: warehouse.name,
    };
  });
}

export function toSupplierSelectOptions(suppliers: SupplierOption[]): Array<{ value: string; label: string }> {
  return suppliers.flatMap((supplier) => {
    const value = pickEntityId(supplier);
    if (!value) {
      return [];
    }

    const code = String(supplier.code ?? '').trim();
    const name = String(supplier.name ?? '').trim();
    return {
      value,
      label: [code, name].filter(Boolean).join(' - ') || value,
    };
  });
}

export function toItemSelectOptions(items: ItemOption[]): Array<{ value: string; label: string }> {
  return items.flatMap((item) => {
    const value = pickEntityId(item);
    if (!value) {
      return [];
    }

    const code = String(item.code ?? '').trim();
    const name = String(item.name ?? '').trim();
    return {
      value,
      label: [code, name].filter(Boolean).join(' - ') || value,
    };
  });
}

export function createExportFilename(prefix: string): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${prefix}-${y}${m}${d}.xlsx`;
}
