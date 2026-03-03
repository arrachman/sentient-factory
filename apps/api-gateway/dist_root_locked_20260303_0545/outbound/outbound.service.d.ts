import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOutboundDto } from './dto/create-outbound.dto';
import { QueryMonitoringOutboundDto } from './dto/query-monitoring-outbound.dto';
import { QueryOutboundDto } from './dto/query-outbound.dto';
import { QueryStockBatchReportDto } from './dto/query-stock-batch-report.dto';
import { QueryStockMutationReportDto } from './dto/query-stock-mutation-report.dto';
import { UpdateOutboundDto } from './dto/update-outbound.dto';
export declare class OutboundService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateOutboundDto, actorId?: string | number): Promise<{
        success: boolean;
        data: {
            customer: {
                type: string;
                name: string;
                id: number;
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
                        type: string;
                        name: string;
                        id: number;
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
                    outboundDetailId: number;
                    batchOut: string;
                    expiredDate: Date | null;
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
                doId: number;
                lineNo: number;
                itemCodeSnapshot: string | null;
                itemNameSnapshot: string | null;
                uomCodeSnapshot: string | null;
            })[];
        } & {
            warehouseId: number | null;
            id: number;
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
                type: string;
                name: string;
                id: number;
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
            warehouseId: number | null;
            id: number;
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
    findStockBatchReport(query: QueryStockBatchReportDto): Promise<{
        success: boolean;
        data: {
            id: bigint;
            item: {
                name: string;
                id: number;
                code: string;
                uom: {
                    name: string;
                    id: number;
                    code: string;
                };
            };
            warehouse: {
                name: string;
                id: number;
            };
            batch: {
                id: number;
                batchNumber: string;
            };
            supplierNames: string[];
            transactionDate: Date;
            mmfOrDo: string;
            description: string;
            inbound: number;
            outbound: number;
            balance: number;
            replenish: string;
        }[];
        meta: {
            total: number;
        };
    }>;
    private resolveWarehouseFilterForActor;
    private resolveInputWarehouseForActor;
    private getActorWarehouseAccess;
    private parseOptionalActorId;
    private isMissingWarehouseColumnError;
    findStockMutationReport(query: QueryStockMutationReportDto): Promise<{
        success: boolean;
        data: {
            itemId: number;
            warehouseId: number;
            supplierNames: string[];
            description: string;
            batchNumber: string;
            expiryDate: Date | null;
            total: number;
            actualToday: number;
            actualThreeMonths: number;
            actualSixMonths: number;
            expire: string;
            remarks: string;
        }[];
        meta: {
            total: number;
        };
    }>;
    findOne(id: number, actorId?: string | number): Promise<{
        success: boolean;
        data: {
            customer: {
                type: string;
                name: string;
                id: number;
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
                        type: string;
                        name: string;
                        id: number;
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
                    outboundDetailId: number;
                    batchOut: string;
                    expiredDate: Date | null;
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
                doId: number;
                lineNo: number;
                itemCodeSnapshot: string | null;
                itemNameSnapshot: string | null;
                uomCodeSnapshot: string | null;
            })[];
        } & {
            warehouseId: number | null;
            id: number;
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
    update(id: number, dto: UpdateOutboundDto, actorId?: string | number): Promise<{
        success: boolean;
        data: {
            customer: {
                type: string;
                name: string;
                id: number;
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
                        type: string;
                        name: string;
                        id: number;
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
                    outboundDetailId: number;
                    batchOut: string;
                    expiredDate: Date | null;
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
                doId: number;
                lineNo: number;
                itemCodeSnapshot: string | null;
                itemNameSnapshot: string | null;
                uomCodeSnapshot: string | null;
            })[];
        } & {
            warehouseId: number | null;
            id: number;
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
    remove(id: number, actorId?: string | number): Promise<{
        success: boolean;
        message: string;
    }>;
    private ensureDoNumberAvailable;
    private normalizeRequiredDoNumber;
    private ensureCustomerExists;
    private ensureWarehouseExists;
    private resolveDefaultsFromCustomerCity;
    private findCitySlaByCityId;
    private ensureCityExists;
    private normalizeAndValidateDetails;
    private getActiveItems;
    private resolveWarehouseForActor;
    private syncOutboundInventoryLedger;
    private resolveActorUserId;
    private ensureBatchAvailability;
    private parseId;
    private parseOptionalId;
    private parseOptionalActorUserId;
    private normalizeAuditActor;
}
