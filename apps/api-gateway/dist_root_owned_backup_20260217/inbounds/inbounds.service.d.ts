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
            supplier: {
                id: number;
                name: string;
                code: string;
                type: string;
            };
            warehouse: {
                id: number;
                name: string;
                locationName: string | null;
                addressDetail: string | null;
                city: {
                    id: number;
                    name: string;
                    province: {
                        id: number;
                        name: string;
                        isoCode: string;
                    };
                    postalCode: string;
                };
            };
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
                    qty: Prisma.Decimal;
                    inboundDetailId: number;
                    batchIn: string;
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
                inboundId: number;
                lineNo: number;
                itemId: number;
                qty: Prisma.Decimal;
                uomInput: number | null;
                itemCodeSnapshot: string | null;
                itemNameSnapshot: string | null;
            })[];
        } & {
            reportNo: bigint;
            transactionNo: string;
            transactionDate: Date;
            notes: string | null;
            status: string;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
            supplierId: number;
            warehouseId: number;
        };
    }>;
    findAll(query: QueryInboundDto): Promise<{
        success: boolean;
        data: ({
            supplier: {
                id: number;
                name: string;
                code: string;
                type: string;
            };
            warehouse: {
                id: number;
                name: string;
                locationName: string | null;
                city: {
                    id: number;
                    name: string;
                    postalCode: string;
                };
            };
            _count: {
                details: number;
            };
        } & {
            reportNo: bigint;
            transactionNo: string;
            transactionDate: Date;
            notes: string | null;
            status: string;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
            supplierId: number;
            warehouseId: number;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: number): Promise<{
        success: boolean;
        data: {
            supplier: {
                id: number;
                name: string;
                code: string;
                type: string;
            };
            warehouse: {
                id: number;
                name: string;
                locationName: string | null;
                addressDetail: string | null;
                city: {
                    id: number;
                    name: string;
                    province: {
                        id: number;
                        name: string;
                        isoCode: string;
                    };
                    postalCode: string;
                };
            };
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
                    qty: Prisma.Decimal;
                    inboundDetailId: number;
                    batchIn: string;
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
                inboundId: number;
                lineNo: number;
                itemId: number;
                qty: Prisma.Decimal;
                uomInput: number | null;
                itemCodeSnapshot: string | null;
                itemNameSnapshot: string | null;
            })[];
        } & {
            reportNo: bigint;
            transactionNo: string;
            transactionDate: Date;
            notes: string | null;
            status: string;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
            supplierId: number;
            warehouseId: number;
        };
    }>;
    update(id: number, dto: UpdateInboundDto, actorId?: string | number): Promise<{
        success: boolean;
        data: {
            supplier: {
                id: number;
                name: string;
                code: string;
                type: string;
            };
            warehouse: {
                id: number;
                name: string;
                locationName: string | null;
                addressDetail: string | null;
                city: {
                    id: number;
                    name: string;
                    province: {
                        id: number;
                        name: string;
                        isoCode: string;
                    };
                    postalCode: string;
                };
            };
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
                    qty: Prisma.Decimal;
                    inboundDetailId: number;
                    batchIn: string;
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
                inboundId: number;
                lineNo: number;
                itemId: number;
                qty: Prisma.Decimal;
                uomInput: number | null;
                itemCodeSnapshot: string | null;
                itemNameSnapshot: string | null;
            })[];
        } & {
            reportNo: bigint;
            transactionNo: string;
            transactionDate: Date;
            notes: string | null;
            status: string;
            createdAt: Date;
            createdBy: number | null;
            updatedAt: Date;
            updatedBy: number | null;
            deletedAt: Date | null;
            deletedBy: number | null;
            id: number;
            supplierId: number;
            warehouseId: number;
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
    private normalizeAndValidateDetails;
    private normalizeAndValidateBatches;
    private getActiveItems;
    private syncInboundInventoryLedger;
    private resolveActorUserId;
    private parseId;
    private parseActorId;
}
