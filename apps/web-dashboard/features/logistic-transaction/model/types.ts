export type DeliveryOrderStatus = 'OPEN' | 'DELIVERY' | 'DELIVERED' | 'COMPLETED';

export type ContactOption = {
  id?: string | number;
  uuid?: string | number;
  code?: string;
  name?: string;
  city?: string | null;
};

export type CityOption = {
  id?: string | number;
  uuid?: string | number;
  name?: string;
  postalCode?: string;
};

export type CitySlaOption = {
  cityId?: string | number;
  stdLeadTimeDays: number;
  stdReturnDoDays: number;
};

export type ItemOption = {
  id?: string | number;
  uuid?: string | number;
  code?: string;
  name?: string;
  uom?: {
    id?: string | number;
    uuid?: string | number;
    code?: string;
    name?: string;
  } | null;
};

export type WarehouseOption = {
  id?: string | number;
  uuid?: string | number;
  name?: string;
  locationName?: string | null;
  city?: {
    id?: string | number;
    name?: string | null;
    postalCode?: string | null;
  } | null;
};

export type DivisionOption = {
  id?: string | number;
  uuid?: string | number;
  code: string;
  name: string;
  isActive?: boolean;
};

export type DeliveryOrderDetailForm = {
  itemId: string;
  batchNumbers: string[];
  batchQtyMap: Record<string, string>;
  qtyKg: string;
  notes: string;
};

export type DeliveryOrderForm = {
  doNumber: string;
  doDate: string;
  doReceivedDate: string;
  customerId: string;
  warehouseId: string;
  destinationCityId: string;
  stdLeadTimeDays: string;
  stdReturnDoDays: string;
  shippingDate: string;
  actualReceivedDate: string;
  receivedBy: string;
  doScanReturnDate: string;
  status: string;
  bu: string;
  notes: string;
  details: DeliveryOrderDetailForm[];
};

export type DeliveryOrderListItem = {
  id?: string | number;
  uuid: string;
  createdAt?: string;
  reportNo: string | number;
  doNumber: string;
  doDate: string;
  doReceivedDate: string;
  shippingDate?: string | null;
  standardReceivedDate?: string | null;
  actualReceivedDate?: string | null;
  stdDoReturnDate?: string | null;
  doScanReturnDate?: string | null;
  stdLeadTimeDays?: string | number;
  stdReturnDoDays?: string | number;
  kpiDeliveryStatus?: 'ONTIME' | 'LATE' | null;
  kpiDoReturnStatus?: 'ONTIME' | 'LATE' | null;
  totalItemTypes: number;
  totalBatches: number;
  totalQtyPcs: string | number;
  totalKg: string | number;
  status: DeliveryOrderStatus;
  customer?: {
    uuid: string;
    code: string;
    name: string;
  };
  warehouse?: {
    id?: string | number;
    uuid?: string | number;
    name?: string | null;
    locationName?: string | null;
  } | null;
};

export type DeliveryActionState = {
  id: string;
  shippingDate: string;
  stdLeadTimeDays: number;
};

export type DeliveredActionState = {
  id: string;
  shippingDate: string;
  stdLeadTimeDays: number;
  actualReceivedDate: string;
  receivedBy: string;
  doScanReturnDate: string;
};

export type CompletedActionState = {
  id: string;
  shippingDate: string;
  doScanReturnDate: string;
  stdReturnDoDays: number;
  stdDoReturnDate: string;
};

export const STATUS_OPTIONS = ['OPEN', 'DELIVERY', 'DELIVERED', 'COMPLETED'] as const;

export const initialDetail = (): DeliveryOrderDetailForm => ({
  itemId: '',
  batchNumbers: [],
  batchQtyMap: {},
  qtyKg: '',
  notes: '',
});

export const initialForm: DeliveryOrderForm = {
  doNumber: '',
  doDate: '',
  doReceivedDate: '',
  customerId: '',
  warehouseId: '',
  destinationCityId: '',
  stdLeadTimeDays: '0',
  stdReturnDoDays: '0',
  shippingDate: '',
  actualReceivedDate: '',
  receivedBy: '',
  doScanReturnDate: '',
  status: 'OPEN',
  bu: '',
  notes: '',
  details: [],
};

export type ApiDetailPayload = {
  itemId?: string | number;
  batchNumber?: string;
  qtyPcs?: string | number | null;
  qtyKg?: string | number | null;
  notes?: string | null;
  item?: {
    id?: string | number;
    uuid?: string | number;
  } | null;
};

export type DecimalLike = {
  s?: number;
  e?: number;
  d?: number[];
};
