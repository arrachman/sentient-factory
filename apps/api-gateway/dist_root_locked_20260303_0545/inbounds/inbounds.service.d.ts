import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInboundDto } from './dto/create-inbound.dto';
import { QueryInboundDto } from './dto/query-inbound.dto';
import { UpdateInboundDto } from './dto/update-inbound.dto';
export declare class InboundsService {
    private prisma;
    constructor(prisma: PrismaService);
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
                type: string;
                name: string;
                id: number;
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
                    lineNo: number;
                    expiredDate: Date | null;
                    inboundDetailId: number;
                    batchIn: string;
                    qty: Prisma.Decimal;
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
                itemCodeSnapshot: string | null;
                itemNameSnapshot: string | null;
                qty: Prisma.Decimal;
                inboundId: number;
                uomInput: number | null;
            })[];
        } & {
            warehouseId: number;
            id: number;
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
                type: string;
                name: string;
                id: number;
                code: string;
            };
            details: {
                _count: {
                    batches: number;
                };
            }[];
            warehouseId: number;
            id: number;
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
                type: string;
                name: string;
                id: number;
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
                    lineNo: number;
                    expiredDate: Date | null;
                    inboundDetailId: number;
                    batchIn: string;
                    qty: Prisma.Decimal;
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
                itemCodeSnapshot: string | null;
                itemNameSnapshot: string | null;
                qty: Prisma.Decimal;
                inboundId: number;
                uomInput: number | null;
            })[];
        } & {
            warehouseId: number;
            id: number;
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
                type: string;
                name: string;
                id: number;
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
                    lineNo: number;
                    expiredDate: Date | null;
                    inboundDetailId: number;
                    batchIn: string;
                    qty: Prisma.Decimal;
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
                itemCodeSnapshot: string | null;
                itemNameSnapshot: string | null;
                qty: Prisma.Decimal;
                inboundId: number;
                uomInput: number | null;
            })[];
        } & {
            warehouseId: number;
            id: number;
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
    private ensureInboundDeleteWillNotCauseNegativeStock;
    private resolveTransactionNo;
    private ensureTransactionNoAvailable;
    private ensureSupplierExists;
    private ensureWarehouseExists;
    private resolveWarehouseForActor;
    private resolveWarehouseFilterForActor;
    private getActorWarehouseAccess;
    private normalizeAndValidateDetails;
    private normalizeAndValidateBatches;
    private getActiveItems;
    private syncInboundInventoryLedger;
    private resolveActorUserId;
    private parseId;
    private parseActorId;
}
