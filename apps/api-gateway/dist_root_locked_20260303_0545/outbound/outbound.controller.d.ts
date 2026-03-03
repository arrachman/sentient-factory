import { CreateOutboundDto } from './dto/create-outbound.dto';
import { QueryMonitoringOutboundDto } from './dto/query-monitoring-outbound.dto';
import { QueryOutboundDto } from './dto/query-outbound.dto';
import { QueryStockBatchReportDto } from './dto/query-stock-batch-report.dto';
import { QueryStockMutationReportDto } from './dto/query-stock-mutation-report.dto';
import { UpdateOutboundDto } from './dto/update-outbound.dto';
import { OutboundService } from './outbound.service';
export declare class OutboundController {
    private readonly service;
    constructor(service: OutboundService);
    create(dto: CreateOutboundDto, req: any): Promise<{
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
                    qtyPcs: import("@prisma/client/runtime/library").Decimal;
                    qtyKg: import("@prisma/client/runtime/library").Decimal;
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
                qtyPcs: import("@prisma/client/runtime/library").Decimal;
                qtyKg: import("@prisma/client/runtime/library").Decimal;
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
            totalQtyPcs: import("@prisma/client/runtime/library").Decimal;
            totalKg: import("@prisma/client/runtime/library").Decimal;
            bu: string | null;
            notes: string | null;
            status: string;
            destinationCityId: number | null;
            customerId: number;
        };
    }>;
    findAll(query: QueryOutboundDto, req: any): Promise<{
        success: boolean;
        data: any[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getBatchOptions(itemId: string, excludeDoId?: string, warehouseId?: string, req?: any): Promise<{
        success: boolean;
        data: {
            batchNumber: string;
            qtyPcs: number;
        }[];
    }>;
    getMonitoringReport(query: QueryMonitoringOutboundDto, req: any): Promise<{
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
                qtyPcs: import("@prisma/client/runtime/library").Decimal;
                qtyKg: import("@prisma/client/runtime/library").Decimal;
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
    getStockBatchReport(query: QueryStockBatchReportDto): Promise<{
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
    getStockMutationReport(query: QueryStockMutationReportDto): Promise<{
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
    findOne(id: number, req: any): Promise<{
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
                    qtyPcs: import("@prisma/client/runtime/library").Decimal;
                    qtyKg: import("@prisma/client/runtime/library").Decimal;
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
                qtyPcs: import("@prisma/client/runtime/library").Decimal;
                qtyKg: import("@prisma/client/runtime/library").Decimal;
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
            totalQtyPcs: import("@prisma/client/runtime/library").Decimal;
            totalKg: import("@prisma/client/runtime/library").Decimal;
            bu: string | null;
            notes: string | null;
            status: string;
            destinationCityId: number | null;
            customerId: number;
        };
    }>;
    update(id: number, dto: UpdateOutboundDto, req: any): Promise<{
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
                    qtyPcs: import("@prisma/client/runtime/library").Decimal;
                    qtyKg: import("@prisma/client/runtime/library").Decimal;
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
                qtyPcs: import("@prisma/client/runtime/library").Decimal;
                qtyKg: import("@prisma/client/runtime/library").Decimal;
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
            totalQtyPcs: import("@prisma/client/runtime/library").Decimal;
            totalKg: import("@prisma/client/runtime/library").Decimal;
            bu: string | null;
            notes: string | null;
            status: string;
            destinationCityId: number | null;
            customerId: number;
        };
    }>;
    remove(id: number, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
