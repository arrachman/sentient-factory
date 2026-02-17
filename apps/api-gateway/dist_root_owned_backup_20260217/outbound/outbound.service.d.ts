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
                id: number;
                name: string;
                code: string;
                type: string;
            };
            destinationCity: {
                id: number;
                name: string;
                postalCode: string;
                province: {
                    id: number;
                    name: string;
                    isoCode: string;
                };
            } | null;
            details: ({
                item: {
                    id: number;
                    name: string;
                    code: string;
                    category: string;
                    itemType: string;
                    uom: {
                        id: number;
                        name: string;
                        code: string;
                        type: string;
                    };
                };
                batches: {
                    notes: string | null;
                    createdAt: Date;
                    createdBy: number | null;
                    updatedAt: Date;
                    updatedBy: number | null;
                    deletedAt: Date | null;
                    deletedBy: number | null;
                    id: number;
                    lineNo: number;
                    qtyPcs: Prisma.Decimal;
                    qtyKg: Prisma.Decimal;
                    outboundDetailId: number;
                    batchOut: string;
                    expiredDate: Date | null;
                }[];
            } & {
                notes: string | null;
                createdAt: Date;
                createdBy: number | null;
                updatedAt: Date;
                updatedBy: number | null;
                deletedAt: Date | null;
                deletedBy: number | null;
                id: number;
                doId: number;
                lineNo: number;
                itemId: number;
                qtyPcs: Prisma.Decimal;
                qtyKg: Prisma.Decimal;
                itemCodeSnapshot: string | null;
                itemNameSnapshot: string | null;
                uomCodeSnapshot: string | null;
            })[];
        } & {
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
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
            customerId: number;
            destinationCityId: number | null;
        };
    }>;
    findAll(query: QueryOutboundDto): Promise<{
        success: boolean;
        data: {
            totalItemTypes: number;
            totalBatches: number;
            totalKg: number;
            customer: {
                id: number;
                name: string;
                code: string;
                type: string;
            };
            destinationCity: {
                id: number;
                name: string;
                postalCode: string;
            } | null;
            details: {
                qtyKg: Prisma.Decimal;
                batches: {
                    id: number;
                }[];
            }[];
            _count: {
                details: number;
            };
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
            totalQtyPcs: Prisma.Decimal;
            bu: string | null;
            notes: string | null;
            status: string;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
            customerId: number;
            destinationCityId: number | null;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getBatchOptions(itemId?: string, excludeDoId?: string): Promise<{
        success: boolean;
        data: {
            batchNumber: string;
            qtyPcs: number;
        }[];
    }>;
    findMonitoringReport(query: QueryMonitoringOutboundDto): Promise<{
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
            customer: {
                id: number;
                name: string;
                code: string;
                type: string;
            };
            destinationCity: {
                id: number;
                name: string;
                postalCode: string;
                province: {
                    id: number;
                    name: string;
                    isoCode: string;
                };
            } | null;
            details: {
                itemId: number;
                qtyPcs: Prisma.Decimal;
                qtyKg: Prisma.Decimal;
                batches: {
                    batchOut: string;
                }[];
            }[];
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
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
            customerId: number;
            destinationCityId: number | null;
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
                id: number;
                name: string;
                code: string;
                uom: {
                    id: number;
                    name: string;
                    code: string;
                };
            };
            warehouse: {
                id: number;
                name: string;
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
    findOne(id: number): Promise<{
        success: boolean;
        data: {
            customer: {
                id: number;
                name: string;
                code: string;
                type: string;
            };
            destinationCity: {
                id: number;
                name: string;
                postalCode: string;
                province: {
                    id: number;
                    name: string;
                    isoCode: string;
                };
            } | null;
            details: ({
                item: {
                    id: number;
                    name: string;
                    code: string;
                    category: string;
                    itemType: string;
                    uom: {
                        id: number;
                        name: string;
                        code: string;
                        type: string;
                    };
                };
                batches: {
                    notes: string | null;
                    createdAt: Date;
                    createdBy: number | null;
                    updatedAt: Date;
                    updatedBy: number | null;
                    deletedAt: Date | null;
                    deletedBy: number | null;
                    id: number;
                    lineNo: number;
                    qtyPcs: Prisma.Decimal;
                    qtyKg: Prisma.Decimal;
                    outboundDetailId: number;
                    batchOut: string;
                    expiredDate: Date | null;
                }[];
            } & {
                notes: string | null;
                createdAt: Date;
                createdBy: number | null;
                updatedAt: Date;
                updatedBy: number | null;
                deletedAt: Date | null;
                deletedBy: number | null;
                id: number;
                doId: number;
                lineNo: number;
                itemId: number;
                qtyPcs: Prisma.Decimal;
                qtyKg: Prisma.Decimal;
                itemCodeSnapshot: string | null;
                itemNameSnapshot: string | null;
                uomCodeSnapshot: string | null;
            })[];
        } & {
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
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
            customerId: number;
            destinationCityId: number | null;
        };
    }>;
    update(id: number, dto: UpdateOutboundDto, actorId?: string | number): Promise<{
        success: boolean;
        data: {
            customer: {
                id: number;
                name: string;
                code: string;
                type: string;
            };
            destinationCity: {
                id: number;
                name: string;
                postalCode: string;
                province: {
                    id: number;
                    name: string;
                    isoCode: string;
                };
            } | null;
            details: ({
                item: {
                    id: number;
                    name: string;
                    code: string;
                    category: string;
                    itemType: string;
                    uom: {
                        id: number;
                        name: string;
                        code: string;
                        type: string;
                    };
                };
                batches: {
                    notes: string | null;
                    createdAt: Date;
                    createdBy: number | null;
                    updatedAt: Date;
                    updatedBy: number | null;
                    deletedAt: Date | null;
                    deletedBy: number | null;
                    id: number;
                    lineNo: number;
                    qtyPcs: Prisma.Decimal;
                    qtyKg: Prisma.Decimal;
                    outboundDetailId: number;
                    batchOut: string;
                    expiredDate: Date | null;
                }[];
            } & {
                notes: string | null;
                createdAt: Date;
                createdBy: number | null;
                updatedAt: Date;
                updatedBy: number | null;
                deletedAt: Date | null;
                deletedBy: number | null;
                id: number;
                doId: number;
                lineNo: number;
                itemId: number;
                qtyPcs: Prisma.Decimal;
                qtyKg: Prisma.Decimal;
                itemCodeSnapshot: string | null;
                itemNameSnapshot: string | null;
                uomCodeSnapshot: string | null;
            })[];
        } & {
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
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
            customerId: number;
            destinationCityId: number | null;
        };
    }>;
    remove(id: number, actorId?: string | number): Promise<{
        success: boolean;
        message: string;
    }>;
    private ensureDoNumberAvailable;
    private normalizeRequiredDoNumber;
    private ensureCustomerExists;
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
