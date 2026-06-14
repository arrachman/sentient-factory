import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { QueryOutboundDto } from './dto/query-outbound.dto';
import { OutboundValidatorsService } from './outbound-validators.service';
export declare class OutboundQueryService {
    private prisma;
    private validators;
    constructor(prisma: PrismaService, validators: OutboundValidatorsService);
    findAll(query: QueryOutboundDto, actorId?: string | number): Promise<{
        success: boolean;
        data: any[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: number, actorId?: string | number): Promise<{
        success: boolean;
        data: {
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
            details: ({
                item: {
                    name: string;
                    id: number;
                    code: string;
                    category: string;
                    itemType: string;
                    uom: {
                        name: string;
                        id: number;
                        type: string;
                        code: string;
                    };
                };
                batches: {
                    id: number;
                    createdAt: Date;
                    createdBy: number | null;
                    updatedAt: Date;
                    updatedBy: number | null;
                    deletedAt: Date | null;
                    deletedBy: number | null;
                    notes: string | null;
                    qtyPcs: Prisma.Decimal;
                    qtyKg: Prisma.Decimal;
                    lineNo: number;
                    expiredDate: Date | null;
                    outboundDetailId: number;
                    batchOut: string;
                }[];
            } & {
                id: number;
                createdAt: Date;
                createdBy: number | null;
                updatedAt: Date;
                updatedBy: number | null;
                deletedAt: Date | null;
                deletedBy: number | null;
                notes: string | null;
                itemId: number;
                qtyPcs: Prisma.Decimal;
                qtyKg: Prisma.Decimal;
                lineNo: number;
                itemCodeSnapshot: string | null;
                itemNameSnapshot: string | null;
                doId: number;
                uomCodeSnapshot: string | null;
            })[];
        } & {
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
            totalItemTypes: number;
            totalBatches: number;
            totalQtyPcs: Prisma.Decimal;
            totalKg: Prisma.Decimal;
            bu: string | null;
            notes: string | null;
            status: string;
            destinationCityId: number | null;
            customerId: number;
        };
    }>;
}
