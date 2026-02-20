export type ProvinceOption = {
  id?: string | number;
  uuid?: string | number;
  name?: string;
};

export type CityOption = {
  id?: string | number;
  uuid?: string | number;
  name?: string;
  province?: {
    id?: string | number;
    uuid?: string | number;
    name?: string;
  } | null;
};

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

export type MonitoringRow = {
  uuid: string;
  doNumber: string;
  createdAt?: string | null;
  doReceivedDate?: string | null;
  bu?: string | null;
  destinationCity?: {
    uuid?: string;
    name?: string;
    province?: {
      uuid?: string;
      name?: string;
    } | null;
  } | null;
  stdLeadTimeDays?: number;
  shippingDate?: string | null;
  standardReceivedDate?: string | null;
  actualReceivedDate?: string | null;
  receivedBy?: string | null;
  doScanReturnDate?: string | null;
  kpiDeliveryStatus?: string | null;
  stdReturnDoDays?: number;
  stdDoReturnDate?: string | null;
  kpiDoReturnStatus?: string | null;
  totalItemTypes?: string | number | DecimalLike | null;
  totalQtyPcs?: string | number | DecimalLike | null;
  totalKg?: string | number | DecimalLike | null;
  sourceSuppliers?: Array<{ id: string; name: string }>;
  sourceWarehouses?: Array<{ id: string; name: string }>;
  status?: string | null;
  customer?: {
    name?: string;
  } | null;
};

export type DecimalLike = {
  s?: number;
  e?: number;
  d?: number[];
};

export type FilterState = {
  warehouseId: string;
  supplierId: string;
  provinceId: string;
  cityId: string;
  status: string;
  doReceivedDate: string;
};

export const initialFilter: FilterState = {
  warehouseId: '',
  supplierId: '',
  provinceId: '',
  cityId: '',
  status: '',
  doReceivedDate: '',
};

export const STATUS_OPTIONS = ['OPEN', 'DELIVERY', 'DELIVERED', 'COMPLETED'] as const;
