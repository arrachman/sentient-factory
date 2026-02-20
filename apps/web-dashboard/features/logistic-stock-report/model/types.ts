export type WarehouseOption = {
  id?: string | number;
  uuid?: string | number;
  name: string;
};

export type SupplierOption = {
  id?: string | number;
  uuid?: string | number;
  code?: string;
  name?: string;
};

export type ItemOption = {
  id?: string | number;
  uuid?: string | number;
  code?: string;
  name?: string;
};

export type FilterState = {
  warehouseId: string;
  supplierId: string;
  itemId: string;
};

export const initialFilter: FilterState = {
  warehouseId: '',
  supplierId: '',
  itemId: '',
};

export type MutationRow = {
  itemId: string;
  warehouseId: string;
  supplierNames?: string[];
  description: string;
  batchNumber: string;
  expiryDate?: string | null;
  total: number;
  actualToday: number;
  actualThreeMonths: number;
  actualSixMonths: number;
  expire: string;
  remarks: string;
};

export type StockBatchRow = {
  uuid: string;
  item?: {
    uuid?: string;
    code?: string;
    name?: string;
    uom?: {
      code?: string;
      name?: string;
    } | null;
  } | null;
  warehouse?: {
    uuid?: string;
    code?: string;
    name?: string;
  } | null;
  batch?: {
    uuid?: string;
    batchNumber?: string;
  } | null;
  supplierNames?: string[];
  transactionDate?: string;
  mmfOrDo?: string;
  description?: string;
  inbound?: number;
  outbound?: number;
  balance?: number;
  replenish?: string;
};

export type StockReportOptions = {
  warehouses: WarehouseOption[];
  suppliers: SupplierOption[];
  items: ItemOption[];
  hasAdminRole: boolean;
  defaultWarehouseId: string;
};

export type StockReportQueryInput = {
  filters: FilterState;
  isAdminRole: boolean;
  lockedWarehouseId: string;
};
