import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInboundDto } from './dto/create-inbound.dto';
import { QueryInboundDto } from './dto/query-inbound.dto';
import { UpdateInboundDto } from './dto/update-inbound.dto';
import { InboundLedgerSyncService } from './inbound-ledger-sync.service';
import { InboundStockGuardService } from './inbound-stock-guard.service';
import { InboundWarehouseResolverService } from './inbound-warehouse-resolver.service';
export declare class InboundsService {
    private prisma;
    private stockGuard;
    private ledgerSync;
    private warehouseResolver;
    constructor(prisma: PrismaService, stockGuard: InboundStockGuardService, ledgerSync: InboundLedgerSyncService, warehouseResolver: InboundWarehouseResolverService);
    create(dto: CreateInboundDto, actorId?: string | number): Promise<{
        success: boolean;
        data: {
            warehouse: {
                name: string;
                id: number;
                locationName: string | null;
                addressDetail: string | null;
                city: {
                    name: string;
                    id: number;
                    province: {
                        name: string;
                        id: number;
                        isoCode: string;
                    };
                    postalCode: string;
                };
            };
            supplier: {
                name: string;
                id: number;
                type: string;
                code: string;
            };
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
                    inboundDetailId: number;
                    lineNo: number;
                    batchIn: string;
                    qty: Prisma.Decimal;
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
                lineNo: number;
                qty: Prisma.Decimal;
                inboundId: number;
                uomInput: number | null;
                itemCodeSnapshot: string | null;
                itemNameSnapshot: string | null;
            })[];
        } & {
            id: number;
            warehouseId: number;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            reportNo: bigint;
            notes: string | null;
            status: string;
            transactionNo: string;
            transactionDate: Date;
            supplierId: number;
        };
    }>;
    findAll(query: QueryInboundDto, actorId?: string | number): Promise<{
        success: boolean;
        data: {
            totalBatches: number;
            warehouse: {
                name: string;
                id: number;
                locationName: string | null;
                city: {
                    name: string;
                    id: number;
                    postalCode: string;
                };
            };
            _count: {
                details: number;
            };
            supplier: {
                name: string;
                id: number;
                type: string;
                code: string;
            };
            details: {
                _count: {
                    batches: number;
                };
            }[];
            id: number;
            warehouseId: number;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            reportNo: bigint;
            notes: string | null;
            status: string;
            transactionNo: string;
            transactionDate: Date;
            supplierId: number;
        }[];
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
            warehouse: {
                name: string;
                id: number;
                locationName: string | null;
                addressDetail: string | null;
                city: {
                    name: string;
                    id: number;
                    province: {
                        name: string;
                        id: number;
                        isoCode: string;
                    };
                    postalCode: string;
                };
            };
            supplier: {
                name: string;
                id: number;
                type: string;
                code: string;
            };
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
                    inboundDetailId: number;
                    lineNo: number;
                    batchIn: string;
                    qty: Prisma.Decimal;
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
                lineNo: number;
                qty: Prisma.Decimal;
                inboundId: number;
                uomInput: number | null;
                itemCodeSnapshot: string | null;
                itemNameSnapshot: string | null;
            })[];
        } & {
            id: number;
            warehouseId: number;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            reportNo: bigint;
            notes: string | null;
            status: string;
            transactionNo: string;
            transactionDate: Date;
            supplierId: number;
        };
    }>;
    update(id: number, dto: UpdateInboundDto, actorId?: string | number): Promise<{
        success: boolean;
        data: {
            warehouse: {
                name: string;
                id: number;
                locationName: string | null;
                addressDetail: string | null;
                city: {
                    name: string;
                    id: number;
                    province: {
                        name: string;
                        id: number;
                        isoCode: string;
                    };
                    postalCode: string;
                };
            };
            supplier: {
                name: string;
                id: number;
                type: string;
                code: string;
            };
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
                    inboundDetailId: number;
                    lineNo: number;
                    batchIn: string;
                    qty: Prisma.Decimal;
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
                lineNo: number;
                qty: Prisma.Decimal;
                inboundId: number;
                uomInput: number | null;
                itemCodeSnapshot: string | null;
                itemNameSnapshot: string | null;
            })[];
        } & {
            id: number;
            warehouseId: number;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            reportNo: bigint;
            notes: string | null;
            status: string;
            transactionNo: string;
            transactionDate: Date;
            supplierId: number;
        };
    }>;
    remove(id: number, actorId?: string | number): Promise<{
        success: boolean;
        message: string;
    }>;
    private buildWhereFilter;
}
