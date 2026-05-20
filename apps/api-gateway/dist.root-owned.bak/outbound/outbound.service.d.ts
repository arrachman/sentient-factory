import { PrismaService } from '../prisma/prisma.service';
import { CreateOutboundDto } from './dto/create-outbound.dto';
import { QueryMonitoringOutboundDto } from './dto/query-monitoring-outbound.dto';
import { QueryOutboundDto } from './dto/query-outbound.dto';
import { QueryStockBatchReportDto } from './dto/query-stock-batch-report.dto';
import { QueryStockMutationReportDto } from './dto/query-stock-mutation-report.dto';
import { UpdateOutboundDto } from './dto/update-outbound.dto';
import { OutboundBatchService } from './outbound-batch.service';
import { OutboundInventoryService } from './outbound-inventory.service';
import { OutboundQueryService } from './outbound-query.service';
import { OutboundStockReportService } from './outbound-stock-report.service';
import { OutboundValidatorsService } from './outbound-validators.service';
export declare class OutboundService {
    private prisma;
    private batchService;
    private inventoryService;
    private stockReportService;
    private validators;
    private queryService;
    constructor(prisma: PrismaService, batchService: OutboundBatchService, inventoryService: OutboundInventoryService, stockReportService: OutboundStockReportService, validators: OutboundValidatorsService, queryService: OutboundQueryService);
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
                qtyPcs: import("@prisma/client/runtime/library").Decimal;
                qtyKg: import("@prisma/client/runtime/library").Decimal;
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
                    qtyPcs: import("@prisma/client/runtime/library").Decimal;
                    qtyKg: import("@prisma/client/runtime/library").Decimal;
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
                qtyPcs: import("@prisma/client/runtime/library").Decimal;
                qtyKg: import("@prisma/client/runtime/library").Decimal;
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
            totalQtyPcs: import("@prisma/client/runtime/library").Decimal;
            totalKg: import("@prisma/client/runtime/library").Decimal;
            bu: string | null;
            notes: string | null;
            status: string;
            destinationCityId: number | null;
            customerId: number;
        };
    }>;
    create(dto: CreateOutboundDto, actorId?: string | number): Promise<{
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
                    qtyPcs: import("@prisma/client/runtime/library").Decimal;
                    qtyKg: import("@prisma/client/runtime/library").Decimal;
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
                qtyPcs: import("@prisma/client/runtime/library").Decimal;
                qtyKg: import("@prisma/client/runtime/library").Decimal;
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
            totalQtyPcs: import("@prisma/client/runtime/library").Decimal;
            totalKg: import("@prisma/client/runtime/library").Decimal;
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
                    qtyPcs: import("@prisma/client/runtime/library").Decimal;
                    qtyKg: import("@prisma/client/runtime/library").Decimal;
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
                qtyPcs: import("@prisma/client/runtime/library").Decimal;
                qtyKg: import("@prisma/client/runtime/library").Decimal;
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
            totalQtyPcs: import("@prisma/client/runtime/library").Decimal;
            totalKg: import("@prisma/client/runtime/library").Decimal;
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
    private writeDetailRows;
}
