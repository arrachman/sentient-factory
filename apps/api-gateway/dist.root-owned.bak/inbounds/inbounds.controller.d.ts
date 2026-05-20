import { CreateInboundDto } from './dto/create-inbound.dto';
import { QueryInboundDto } from './dto/query-inbound.dto';
import { UpdateInboundDto } from './dto/update-inbound.dto';
import { InboundsService } from './inbounds.service';
export declare class InboundsController {
    private readonly service;
    constructor(service: InboundsService);
    create(dto: CreateInboundDto, req: any): Promise<{
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
                    qty: import("@prisma/client/runtime/library").Decimal;
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
                qty: import("@prisma/client/runtime/library").Decimal;
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
    findAll(query: QueryInboundDto, req: any): Promise<{
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
    findOne(id: number, req: any): Promise<{
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
                    qty: import("@prisma/client/runtime/library").Decimal;
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
                qty: import("@prisma/client/runtime/library").Decimal;
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
    update(id: number, dto: UpdateInboundDto, req: any): Promise<{
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
                    qty: import("@prisma/client/runtime/library").Decimal;
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
                qty: import("@prisma/client/runtime/library").Decimal;
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
    remove(id: number, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
