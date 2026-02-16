import { BaseEntity, ProductionStatus } from './common';

export interface ProductionOrder extends BaseEntity {
  orderNo: string;
  itemCode: string;
  itemName: string;
  targetQty: number;
  producedQty: number;
  status: ProductionStatus;
  plannedStartAt?: Date;
  plannedEndAt?: Date;
}

export interface ProductionProgress {
  orderId: string;
  timestamp: Date;
  goodQty: number;
  rejectQty: number;
  note?: string;
}
