import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { QueryMonitoringOutboundDto } from './dto/query-monitoring-outbound.dto';
export declare class OutboundBatchService {
    private prisma;
    constructor(prisma: PrismaService);
    private getActorWarehouseAccess;
    private resolveWarehouseFilterForActor;
    getBatchOptions(itemId?: string, excludeDoId?: string, warehouseId?: string, actorId?: string | number): Promise<{
        success: boolean;
        data: {
            batchNumber: string;
            qtyPcs: number;
        }[];
    }>;
    findMonitoringReport(query: QueryMonitoringOutboundDto, actorId?: string | number): Promise<{
        success: boolean;
        data: {
            totalItemTypes: number;
            totalQtyPcs: number;
            totalKg: number;
            sourceSuppliers: {
                id: number;
                name: string;
            }[];
            sourceWarehouses: {
                id: number;
                name: string;
            }[];
            warehouse: {
                name: string;
                id: number;
                locationName: string | null;
                city: {
                    name: string;
                    id: number;
                    postalCode: string;
                };
            } | null;
            customer: {
                name: string;
                id: number;
                type: string;
                code: string;
            };
            destinationCity: {
                name: string;
                id: number;
                province: {
                    name: string;
                    id: number;
                    isoCode: string;
                };
                postalCode: string;
            } | null;
            details: {
                itemId: number;
                qtyPcs: Prisma.Decimal;
                qtyKg: Prisma.Decimal;
                batches: {
                    batchOut: string;
                }[];
            }[];
            id: number;
            warehouseId: number | null;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            reportNo: bigint;
            doNumber: string;
            doDate: Date;
            doReceivedDate: Date;
            stdLeadTimeDays: number;
            stdReturnDoDays: number;
            shippingDate: Date | null;
            actualReceivedDate: Date | null;
            receivedBy: string | null;
            doScanReturnDate: Date | null;
            standardReceivedDate: Date | null;
            stdDoReturnDate: Date | null;
            kpiDeliveryStatus: string | null;
            kpiDoReturnStatus: string | null;
            totalBatches: number;
            bu: string | null;
            notes: string | null;
            status: string;
            destinationCityId: number | null;
            customerId: number;
        }[];
        meta: {
            total: number;
        };
    }>;
}
