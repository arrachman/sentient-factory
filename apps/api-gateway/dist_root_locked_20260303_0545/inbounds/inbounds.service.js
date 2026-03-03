"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InboundsService = void 0;
const common_1 = require("@nestjs/common");
const duplicate_util_1 = require("../common/errors/duplicate.util");
const prisma_service_1 = require("../prisma/prisma.service");
const audit_user_util_1 = require("../common/utils/audit-user.util");
let InboundsService = class InboundsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, actorId) {
        const supplierId = this.parseId(dto.supplierId, 'Supplier ID');
        await this.ensureSupplierExists(supplierId);
        const effectiveWarehouseId = await this.resolveWarehouseForActor(actorId, dto.warehouseId);
        await this.ensureWarehouseExists(effectiveWarehouseId);
        const detailPayload = this.normalizeAndValidateDetails(dto.details);
        const itemMap = await this.getActiveItems(detailPayload.map((detail) => detail.itemId));
        const created = await this.prisma.$transaction(async (tx) => {
            const transactionNo = await this.resolveTransactionNo(tx, dto.transactionNo);
            const header = await tx.inbound.create({
                data: {
                    transactionNo,
                    transactionDate: dto.transactionDate ? new Date(dto.transactionDate) : new Date(),
                    supplierId,
                    warehouseId: effectiveWarehouseId,
                    notes: dto.notes ?? null,
                    status: 'POSTED',
                    createdBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                    updatedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                },
            });
            for (const [index, detail] of detailPayload.entries()) {
                const item = itemMap.get(detail.itemId);
                await tx.inboundDetail.create({
                    data: {
                        inboundId: header.id,
                        lineNo: index + 1,
                        itemId: detail.itemId,
                        qty: detail.qty,
                        uomInput: detail.uomInput ?? null,
                        itemCodeSnapshot: item.code,
                        itemNameSnapshot: item.name,
                        notes: detail.notes ?? null,
                        createdBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                        updatedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                        batches: {
                            create: detail.batches.map((batch, batchIndex) => ({
                                lineNo: batchIndex + 1,
                                batchIn: batch.batchIn,
                                qty: batch.qty,
                                expiredDate: batch.expiredDate ? new Date(batch.expiredDate) : null,
                                notes: batch.notes ?? null,
                                createdBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                                updatedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                            })),
                        },
                    },
                });
            }
            await this.syncInboundInventoryLedger(tx, header.id, actorId);
            return header;
        });
        return this.findOne(created.id, actorId);
    }
    async findAll(query, actorId) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;
        const where = { deletedAt: null };
        const scopedWarehouseId = await this.resolveWarehouseFilterForActor(actorId, query.warehouseId);
        if (typeof scopedWarehouseId === 'number') {
            where.warehouseId = scopedWarehouseId;
        }
        if (query.status) {
            where.status = query.status;
        }
        if (query.supplierId?.trim()) {
            const supplierId = this.parseId(query.supplierId.trim(), 'Supplier ID');
            where.supplierId = supplierId;
        }
        if (query.warehouseId?.trim() && typeof scopedWarehouseId !== 'number') {
            const warehouseId = this.parseId(query.warehouseId.trim(), 'Warehouse ID');
            where.warehouseId = warehouseId;
        }
        if (query.transactionDateFrom || query.transactionDateTo) {
            where.transactionDate = {
                gte: query.transactionDateFrom ? new Date(query.transactionDateFrom) : undefined,
                lte: query.transactionDateTo ? new Date(query.transactionDateTo) : undefined,
            };
        }
        if (query.search?.trim()) {
            const q = query.search.trim();
            where.OR = [
                { transactionNo: { contains: q, mode: 'insensitive' } },
                { notes: { contains: q, mode: 'insensitive' } },
                { supplier: { code: { contains: q, mode: 'insensitive' } } },
                { supplier: { name: { contains: q, mode: 'insensitive' } } },
                { warehouse: { name: { contains: q, mode: 'insensitive' } } },
            ];
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.inbound.findMany({
                where,
                include: {
                    supplier: { select: { id: true, code: true, name: true, type: true } },
                    warehouse: {
                        select: {
                            id: true,
                            name: true,
                            locationName: true,
                            city: { select: { id: true, name: true, postalCode: true } },
                        },
                    },
                    details: {
                        where: { deletedAt: null },
                        select: {
                            _count: {
                                select: {
                                    batches: {
                                        where: { deletedAt: null },
                                    },
                                },
                            },
                        },
                    },
                    _count: { select: { details: { where: { deletedAt: null } } } },
                },
                orderBy: [{ createdAt: 'desc' }],
                skip,
                take: limit,
            }),
            this.prisma.inbound.count({ where }),
        ]);
        return {
            success: true,
            data: items.map((item) => ({
                ...item,
                totalBatches: Array.isArray(item.details)
                    ? item.details.reduce((sum, detail) => sum + Number(detail?._count?.batches ?? 0), 0)
                    : 0,
            })),
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit) || 1,
            },
        };
    }
    async findOne(id, actorId) {
        const scopedWarehouseId = await this.resolveWarehouseFilterForActor(actorId);
        const item = await this.prisma.inbound.findFirst({
            where: {
                id,
                deletedAt: null,
                warehouseId: typeof scopedWarehouseId === 'number' ? scopedWarehouseId : undefined,
            },
            include: {
                supplier: { select: { id: true, code: true, name: true, type: true } },
                warehouse: {
                    select: {
                        id: true,
                        name: true,
                        locationName: true,
                        addressDetail: true,
                        city: {
                            select: {
                                id: true,
                                name: true,
                                postalCode: true,
                                province: { select: { id: true, name: true, isoCode: true } },
                            },
                        },
                    },
                },
                details: {
                    where: { deletedAt: null },
                    orderBy: [{ lineNo: 'asc' }],
                    include: {
                        item: {
                            select: {
                                id: true,
                                code: true,
                                name: true,
                                category: true,
                                itemType: true,
                                uom: { select: { id: true, code: true, name: true, type: true } },
                            },
                        },
                        batches: {
                            where: { deletedAt: null },
                            orderBy: [{ lineNo: 'asc' }],
                        },
                    },
                },
            },
        });
        if (!item) {
            throw new common_1.NotFoundException('Inbound not found');
        }
        return { success: true, data: item };
    }
    async update(id, dto, actorId) {
        const scopedWarehouseId = await this.resolveWarehouseFilterForActor(actorId);
        const existing = await this.prisma.inbound.findFirst({
            where: {
                id,
                deletedAt: null,
                warehouseId: typeof scopedWarehouseId === 'number' ? scopedWarehouseId : undefined,
            },
            select: { id: true, transactionNo: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Inbound not found');
        }
        if (dto.transactionNo && dto.transactionNo !== existing.transactionNo) {
            await this.ensureTransactionNoAvailable(dto.transactionNo, id);
        }
        if (dto.supplierId) {
            await this.ensureSupplierExists(this.parseId(dto.supplierId, 'Supplier ID'));
        }
        const effectiveWarehouseId = await this.resolveWarehouseForActor(actorId, dto.warehouseId);
        await this.ensureWarehouseExists(effectiveWarehouseId);
        const detailsProvided = Array.isArray(dto.details);
        let detailPayload = [];
        let itemMap = new Map();
        if (detailsProvided) {
            detailPayload = this.normalizeAndValidateDetails(dto.details);
            itemMap = await this.getActiveItems(detailPayload.map((detail) => detail.itemId));
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.inbound.update({
                where: { id },
                data: {
                    transactionNo: dto.transactionNo,
                    transactionDate: dto.transactionDate ? new Date(dto.transactionDate) : undefined,
                    supplierId: dto.supplierId ? this.parseId(dto.supplierId, 'Supplier ID') : undefined,
                    warehouseId: effectiveWarehouseId,
                    notes: dto.notes,
                    status: dto.status,
                    updatedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                },
            });
            if (detailsProvided) {
                const existingDetails = await tx.inboundDetail.findMany({
                    where: { inboundId: id },
                    select: { id: true },
                });
                const detailIds = existingDetails.map((row) => row.id);
                if (detailIds.length > 0) {
                    await tx.inboundDetailBatch.deleteMany({
                        where: { inboundDetailId: { in: detailIds } },
                    });
                }
                await tx.inboundDetail.deleteMany({ where: { inboundId: id } });
                for (const [index, detail] of detailPayload.entries()) {
                    const item = itemMap.get(detail.itemId);
                    await tx.inboundDetail.create({
                        data: {
                            inboundId: id,
                            lineNo: index + 1,
                            itemId: detail.itemId,
                            qty: detail.qty,
                            uomInput: detail.uomInput ?? null,
                            itemCodeSnapshot: item.code,
                            itemNameSnapshot: item.name,
                            notes: detail.notes ?? null,
                            createdBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                            updatedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                            batches: {
                                create: detail.batches.map((batch, batchIndex) => ({
                                    lineNo: batchIndex + 1,
                                    batchIn: batch.batchIn,
                                    qty: batch.qty,
                                    expiredDate: batch.expiredDate ? new Date(batch.expiredDate) : null,
                                    notes: batch.notes ?? null,
                                    createdBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                                    updatedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                                })),
                            },
                        },
                    });
                }
            }
            await this.syncInboundInventoryLedger(tx, id, actorId);
        });
        return this.findOne(id, actorId);
    }
    async remove(id, actorId) {
        const scopedWarehouseId = await this.resolveWarehouseFilterForActor(actorId);
        const existing = await this.prisma.inbound.findFirst({
            where: {
                id,
                deletedAt: null,
                warehouseId: typeof scopedWarehouseId === 'number' ? scopedWarehouseId : undefined,
            },
            select: { id: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Inbound not found');
        }
        await this.prisma.$transaction(async (tx) => {
            await this.ensureInboundDeleteWillNotCauseNegativeStock(tx, id);
            await tx.inbound.update({
                where: { id },
                data: {
                    deletedAt: new Date(),
                    deletedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                    status: 'CANCELLED',
                    updatedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                },
            });
            await tx.inboundDetail.updateMany({
                where: { inboundId: id, deletedAt: null },
                data: {
                    deletedAt: new Date(),
                    deletedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                    updatedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                },
            });
            await tx.inboundDetailBatch.updateMany({
                where: {
                    inboundDetail: { inboundId: id },
                    deletedAt: null,
                },
                data: {
                    deletedAt: new Date(),
                    deletedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                    updatedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                },
            });
            await this.syncInboundInventoryLedger(tx, id, actorId);
        });
        return { success: true, message: 'Inbound deleted' };
    }
    async ensureInboundDeleteWillNotCauseNegativeStock(tx, inboundId) {
        const inboundContributions = await tx.inventoryLedger.groupBy({
            by: ['itemId', 'warehouseId', 'batchId'],
            where: {
                referenceDocType: 'INBOUND',
                referenceDocId: String(inboundId),
                deletedAt: null,
            },
            _sum: {
                quantityPcs: true,
            },
        });
        if (!inboundContributions.length) {
            return;
        }
        const keySet = new Set();
        const inboundQtyByKey = new Map();
        inboundContributions.forEach((row) => {
            const key = `${row.itemId}::${row.warehouseId}::${row.batchId}`;
            keySet.add(key);
            const qty = Number(row._sum.quantityPcs ?? 0);
            inboundQtyByKey.set(key, Number.isFinite(qty) ? qty : 0);
        });
        const whereOr = [...keySet].map((key) => {
            const [itemId, warehouseId, batchId] = key.split('::').map((value) => Number(value));
            return {
                itemId,
                warehouseId,
                batchId,
            };
        });
        const currentBalances = await tx.inventoryLedger.groupBy({
            by: ['itemId', 'warehouseId', 'batchId'],
            where: {
                deletedAt: null,
                OR: whereOr,
            },
            _sum: {
                quantityPcs: true,
            },
        });
        const currentBalanceByKey = new Map();
        currentBalances.forEach((row) => {
            const key = `${row.itemId}::${row.warehouseId}::${row.batchId}`;
            const qty = Number(row._sum.quantityPcs ?? 0);
            currentBalanceByKey.set(key, Number.isFinite(qty) ? qty : 0);
        });
        const violations = [...keySet].filter((key) => {
            const currentBalance = currentBalanceByKey.get(key) ?? 0;
            const inboundQty = inboundQtyByKey.get(key) ?? 0;
            const projectedBalance = currentBalance - inboundQty;
            return projectedBalance < -0.000001;
        });
        if (!violations.length) {
            return;
        }
        const batchIds = [...new Set(violations.map((key) => Number(key.split('::')[2])))];
        const batchRows = await tx.inventoryBatch.findMany({
            where: {
                id: { in: batchIds },
            },
            select: {
                id: true,
                batchNumber: true,
            },
        });
        const batchById = new Map(batchRows.map((row) => [row.id, row.batchNumber]));
        const firstViolation = violations[0];
        const [itemId, warehouseId, batchId] = firstViolation.split('::').map((value) => Number(value));
        const batchNumber = batchById.get(batchId) ?? String(batchId);
        throw new common_1.BadRequestException(`Inbound tidak bisa dihapus karena stok akan minus. Item ${itemId}, batch ${batchNumber}, warehouse ${warehouseId} sudah dipakai outbound.`);
    }
    async resolveTransactionNo(tx, transactionNo) {
        const candidate = transactionNo?.trim();
        if (candidate) {
            await this.ensureTransactionNoAvailable(candidate);
            return candidate;
        }
        const today = new Date();
        const y = today.getFullYear();
        const m = String(today.getMonth() + 1).padStart(2, '0');
        const d = String(today.getDate()).padStart(2, '0');
        const datePart = `${y}${m}${d}`;
        const prefix = `INB-${datePart}-`;
        const latestForDate = await tx.inbound.findFirst({
            where: {
                transactionNo: {
                    startsWith: prefix,
                },
            },
            select: {
                transactionNo: true,
            },
            orderBy: {
                transactionNo: 'desc',
            },
        });
        const latestSuffixRaw = latestForDate?.transactionNo?.slice(prefix.length) ?? '';
        const latestSuffix = Number.parseInt(latestSuffixRaw, 10);
        const nextSequence = Number.isInteger(latestSuffix) && latestSuffix > 0 ? latestSuffix + 1 : 1;
        return `${prefix}${String(nextSequence).padStart(4, '0')}`;
    }
    async ensureTransactionNoAvailable(transactionNo, exceptId) {
        const duplicate = await this.prisma.inbound.findFirst({
            where: {
                transactionNo,
                NOT: exceptId ? { id: exceptId } : undefined,
            },
            select: { id: true, deletedAt: true },
        });
        if (duplicate) {
            (0, duplicate_util_1.throwDuplicate)({
                fieldLabel: 'Inbound transaction number',
                value: transactionNo,
                isSoftDeleted: Boolean(duplicate.deletedAt),
            });
        }
    }
    async ensureSupplierExists(supplierId) {
        const supplier = await this.prisma.masterDataContact.findFirst({
            where: {
                id: supplierId,
                type: 'supplier',
                deletedAt: null,
            },
            select: { id: true },
        });
        if (!supplier) {
            throw new common_1.BadRequestException('Supplier not found');
        }
    }
    async ensureWarehouseExists(warehouseId) {
        const warehouse = await this.prisma.masterDataWarehouse.findFirst({
            where: { id: warehouseId, deletedAt: null },
            select: { id: true },
        });
        if (!warehouse) {
            throw new common_1.BadRequestException('Warehouse not found');
        }
    }
    async resolveWarehouseForActor(actorId, requestedWarehouseId) {
        const actor = await this.getActorWarehouseAccess(actorId);
        if (actor.canAccessAllWarehouses && requestedWarehouseId?.trim()) {
            return this.parseId(requestedWarehouseId, 'Warehouse ID');
        }
        const mappedWarehouseId = actor.warehouseId;
        if (mappedWarehouseId && mappedWarehouseId > 0) {
            return mappedWarehouseId;
        }
        const ownedWarehouse = await this.prisma.masterDataWarehouse.findFirst({
            where: {
                deletedAt: null,
                createdBy: (0, audit_user_util_1.toAuditUserId)(actorId),
            },
            select: { id: true },
            orderBy: [{ createdAt: 'asc' }],
        });
        if (!ownedWarehouse) {
            throw new common_1.BadRequestException('Warehouse untuk user login belum terdaftar');
        }
        return ownedWarehouse.id;
    }
    async resolveWarehouseFilterForActor(actorId, requestedWarehouseId) {
        const actor = await this.getActorWarehouseAccess(actorId);
        if (actor.canAccessAllWarehouses) {
            if (requestedWarehouseId?.trim()) {
                return this.parseId(requestedWarehouseId, 'Warehouse ID');
            }
            return undefined;
        }
        const mappedWarehouseId = actor.warehouseId;
        if (mappedWarehouseId && mappedWarehouseId > 0) {
            return mappedWarehouseId;
        }
        const ownedWarehouse = await this.prisma.masterDataWarehouse.findFirst({
            where: {
                deletedAt: null,
                createdBy: (0, audit_user_util_1.toAuditUserId)(actorId),
            },
            select: { id: true },
            orderBy: [{ createdAt: 'asc' }],
        });
        if (!ownedWarehouse) {
            throw new common_1.BadRequestException('Warehouse untuk user login belum terdaftar');
        }
        return ownedWarehouse.id;
    }
    async getActorWarehouseAccess(actorId) {
        if (!actorId) {
            throw new common_1.BadRequestException('User login tidak ditemukan');
        }
        const actorUserId = this.parseActorId(actorId);
        const actor = await this.prisma.user.findFirst({
            where: {
                id: actorUserId,
                deletedAt: null,
            },
            select: {
                warehouseId: true,
                roles: {
                    where: { deletedAt: null },
                    select: {
                        role: {
                            select: {
                                name: true,
                                deletedAt: true,
                            },
                        },
                    },
                },
            },
        });
        const roleNames = (actor?.roles ?? []).map((item) => String(item.role?.name ?? '')
            .trim()
            .toLowerCase());
        const canAccessAllWarehouses = roleNames.some((roleName) => roleName === 'super_admin' || roleName === 'admin');
        return {
            warehouseId: actor?.warehouseId,
            canAccessAllWarehouses,
        };
    }
    normalizeAndValidateDetails(details) {
        if (!details.length) {
            throw new common_1.BadRequestException('At least one detail row is required');
        }
        const seenItemIds = new Set();
        return details.map((rawDetail) => {
            const itemId = this.parseId(rawDetail.itemId, 'Detail itemId');
            if (seenItemIds.has(itemId)) {
                throw new common_1.BadRequestException(`Duplicate item in detail: ${itemId}`);
            }
            seenItemIds.add(itemId);
            const batches = this.normalizeAndValidateBatches(rawDetail.batches);
            const qtyFromBatches = batches.reduce((total, batch) => total + batch.qty, 0);
            const detailQty = Number(rawDetail.qty);
            const detailUomInput = Number(rawDetail.uomInput);
            if (!Number.isFinite(detailQty) || detailQty <= 0) {
                throw new common_1.BadRequestException(`Detail qty for item ${itemId} must be greater than 0`);
            }
            if (!Number.isInteger(detailUomInput) || detailUomInput < 0) {
                throw new common_1.BadRequestException(`Detail uomInput for item ${itemId} must be an integer and cannot be negative`);
            }
            if (Math.abs(detailQty - qtyFromBatches) > 0.0001) {
                throw new common_1.BadRequestException(`Detail qty must equal sum of batch qty for item ${itemId}. Detail qty=${detailQty}, batch total=${qtyFromBatches}`);
            }
            return {
                itemId,
                qty: detailQty,
                uomInput: detailUomInput,
                notes: rawDetail.notes?.trim() || undefined,
                batches,
            };
        });
    }
    normalizeAndValidateBatches(batches) {
        if (!batches.length) {
            throw new common_1.BadRequestException('At least one batch row is required for each detail');
        }
        const seenBatchNumbers = new Set();
        return batches.map((rawBatch) => {
            const batchIn = rawBatch.batchIn.trim();
            if (!batchIn) {
                throw new common_1.BadRequestException('Batch number is required');
            }
            const batchKey = batchIn.toLowerCase();
            if (seenBatchNumbers.has(batchKey)) {
                throw new common_1.BadRequestException(`Duplicate batch number in one detail: ${batchIn}`);
            }
            seenBatchNumbers.add(batchKey);
            const qty = Number(rawBatch.qty);
            if (!Number.isFinite(qty) || qty <= 0) {
                throw new common_1.BadRequestException(`Batch qty must be greater than 0 for batch ${batchIn}`);
            }
            return {
                batchIn,
                qty,
                expiredDate: rawBatch.expiredDate,
                notes: rawBatch.notes?.trim() || undefined,
            };
        });
    }
    async getActiveItems(itemIds) {
        const uniqueItemIds = [...new Set(itemIds)];
        const items = await this.prisma.masterDataItem.findMany({
            where: {
                id: { in: uniqueItemIds },
                isActive: true,
                deletedAt: null,
            },
            select: {
                id: true,
                code: true,
                name: true,
                uom: {
                    select: {
                        id: true,
                    },
                },
            },
        });
        if (items.length !== uniqueItemIds.length) {
            throw new common_1.BadRequestException('One or more items are not found or inactive');
        }
        return new Map(items.map((item) => [
            item.id,
            {
                id: item.id,
                code: item.code,
                name: item.name,
                uomId: item.uom.id,
            },
        ]));
    }
    async syncInboundInventoryLedger(tx, inboundId, actorId) {
        const now = new Date();
        await tx.inventoryLedger.updateMany({
            where: {
                referenceDocType: 'INBOUND',
                referenceDocId: String(inboundId),
                deletedAt: null,
            },
            data: {
                deletedAt: now,
                deletedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                updatedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
            },
        });
        const inbound = await tx.inbound.findFirst({
            where: { id: inboundId },
            select: {
                id: true,
                transactionNo: true,
                transactionDate: true,
                warehouse: {
                    select: {
                        id: true,
                    },
                },
                status: true,
                deletedAt: true,
                details: {
                    where: { deletedAt: null },
                    orderBy: [{ lineNo: 'asc' }],
                    select: {
                        itemId: true,
                        item: {
                            select: {
                                id: true,
                                uom: {
                                    select: {
                                        id: true,
                                    },
                                },
                            },
                        },
                        batches: {
                            where: { deletedAt: null },
                            orderBy: [{ lineNo: 'asc' }],
                            select: {
                                batchIn: true,
                                qty: true,
                                expiredDate: true,
                            },
                        },
                    },
                },
            },
        });
        if (!inbound || inbound.deletedAt || inbound.status !== 'POSTED') {
            return;
        }
        const actorUserId = await this.resolveActorUserId(tx, actorId);
        for (const detail of inbound.details) {
            for (const batch of detail.batches) {
                const batchNumber = String(batch.batchIn ?? '').trim();
                if (!batchNumber) {
                    continue;
                }
                const inventoryBatch = await tx.inventoryBatch.upsert({
                    where: {
                        itemId_batchNumber: {
                            itemId: detail.item.id,
                            batchNumber,
                        },
                    },
                    update: {
                        expiryDate: batch.expiredDate ?? undefined,
                        deletedAt: null,
                        deletedBy: null,
                        updatedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                    },
                    create: {
                        itemId: detail.item.id,
                        batchNumber,
                        expiryDate: batch.expiredDate ?? null,
                        createdBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                        updatedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                    },
                    select: { id: true },
                });
                await tx.inventoryLedger.create({
                    data: {
                        transactionDate: inbound.transactionDate,
                        itemId: detail.item.id,
                        warehouseId: inbound.warehouse.id,
                        batchId: inventoryBatch.id,
                        transactionType: 'INBOUND',
                        referenceDocType: 'INBOUND',
                        referenceDocId: String(inbound.id),
                        referenceNumber: inbound.transactionNo,
                        quantityPcs: batch.qty,
                        quantityKg: 0,
                        uomId: detail.item.uom.id,
                        unitCost: null,
                        totalValue: 0,
                        userId: actorUserId ?? null,
                        createdBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                        updatedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                    },
                });
            }
        }
    }
    async resolveActorUserId(tx, actorId) {
        if (actorId === undefined || actorId === null || actorId === '') {
            return undefined;
        }
        const normalizedActorId = this.parseActorId(actorId);
        const actor = await tx.user.findFirst({
            where: {
                id: normalizedActorId,
                deletedAt: null,
            },
            select: { id: true },
        });
        return actor?.id;
    }
    parseId(value, fieldLabel) {
        return parseIntStrict(String(value), fieldLabel);
    }
    parseActorId(value) {
        return parseIntStrict(String(value), 'User ID');
    }
};
exports.InboundsService = InboundsService;
exports.InboundsService = InboundsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InboundsService);
function parseIntStrict(value, fieldLabel) {
    const parsed = Number(String(value ?? '').trim());
    if (!Number.isInteger(parsed)) {
        throw new common_1.BadRequestException(`${fieldLabel} is invalid`);
    }
    return parsed;
}
//# sourceMappingURL=inbounds.service.js.map