import { CreateOutboundDetailDto } from './create-outbound-detail.dto';
declare const DELIVERY_ORDER_STATUSES: readonly ["OPEN", "DELIVERY", "DELIVERED", "COMPLETED"];
export declare class CreateOutboundDto {
    doNumber: string;
    doDate: string;
    doReceivedDate: string;
    customerId: string;
    destinationCityId?: string;
    stdLeadTimeDays?: number;
    stdReturnDoDays?: number;
    shippingDate?: string;
    actualReceivedDate?: string;
    receivedBy?: string;
    doScanReturnDate?: string;
    bu?: string;
    notes?: string;
    status?: (typeof DELIVERY_ORDER_STATUSES)[number];
    details: CreateOutboundDetailDto[];
}
export {};
