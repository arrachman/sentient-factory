export type SupplierOption = {
  id?: string | number;
  uuid?: string | number;
  code?: string;
  name?: string;
};

export type WarehouseOption = {
  id?: string | number;
  uuid?: string | number;
  name?: string;
  createdBy?: string | null;
  locationName?: string | null;
  city?: {
    name?: string | null;
  } | null;
};

export type ItemOption = {
  id?: string | number;
  uuid?: string | number;
  code?: string;
  name?: string;
  uom?: {
    name?: string | null;
    code?: string | null;
  } | null;
};

export type InboundBatchForm = {
  batchIn: string;
  qty: string;
  expiredDate: string;
  notes: string;
};

export type InboundDetailForm = {
  itemId: string;
  uomInput: string;
  notes: string;
  batches: InboundBatchForm[];
};

export type InboundForm = {
  transactionNo: string;
  transactionDate: string;
  supplierId: string;
  warehouseId: string;
  status: 'POSTED' | 'CANCELLED';
  notes: string;
  details: InboundDetailForm[];
};

export type InboundListItem = {
  id?: string | number;
  uuid: string;
  reportNo: string | number;
  transactionNo: string;
  transactionDate: string;
  createdAt?: string;
  status: 'DRAFT' | 'POSTED' | 'CANCELLED';
  supplier?: {
    uuid: string;
    code: string;
    name: string;
  };
  warehouse?: {
    uuid: string;
    name: string;
  };
  _count?: {
    details?: number;
  };
};

export type DecimalLike = {
  s?: number;
  e?: number;
  d?: number[];
};

export type InboundDetailApi = {
  itemId?: string;
  uomInput?: number | null;
  qty?: string | number | DecimalLike;
  notes?: string | null;
  batches?: Array<{
    batchIn?: string;
    batchNumber?: string;
    batchOut?: string;
    batchNo?: string;
    qty?: string | number | DecimalLike;
    qtyPcs?: string | number | DecimalLike;
    qty_pcs?: string | number | DecimalLike;
    quantity?: string | number | DecimalLike;
    quantityPcs?: string | number | DecimalLike;
    expiredDate?: string | null;
    expiryDate?: string | null;
    expired_date?: string | null;
    notes?: string | null;
    note?: string | null;
  }>;
  [key: string]: unknown;
};

export const REQUIRED_FIELD_CLASS =
  'border-blue-500/70 focus-visible:border-blue-600 focus-visible:ring-blue-100';

export const REQUIRED_SELECT_TRIGGER_CLASS =
  'border-blue-500/70 focus-visible:border-blue-600 focus-visible:ring-blue-100';
