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
exports.OutboundService = void 0;
const common_1 = require("@nestjs/common");
const duplicate_util_1 = require("../common/errors/duplicate.util");
const prisma_service_1 = require("../prisma/prisma.service");
const audit_user_util_1 = require("../common/utils/audit-user.util");
let OutboundService = class OutboundService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, actorId) {
        const auditActor = this.normalizeAuditActor(actorId);
        const doNumber = this.normalizeRequiredDoNumber(dto.doNumber);
        await this.ensureDoNumberAvailable(doNumber);
        const customerId = this.parseId(dto.customerId, 'customerId');
        const customer = await this.ensureCustomerExists(customerId);
        const defaults = await this.resolveDefaultsFromCustomerCity(customer.city ?? undefined);
        const requestedDestinationCityId = this.parseOptionalId(dto.destinationCityId, 'destinationCityId');
        const resolvedDestinationCityId = requestedDestinationCityId ?? defaults.destinationCityId ?? null;
        if (resolvedDestinationCityId !== null) {
            await this.ensureCityExists(resolvedDestinationCityId);
        }
        const resolvedSla = resolvedDestinationCityId
            ? await this.findCitySlaByCityId(resolvedDestinationCityId)
            : null;
        const resolvedStdLeadTimeDays = dto.stdLeadTimeDays ?? resolvedSla?.stdLeadTimeDays ?? 0;
        const resolvedStdReturnDoDays = dto.stdReturnDoDays ?? resolvedSla?.stdReturnDoDays ?? 0;
        const detailPayload = this.normalizeAndValidateDetails(dto.details);
        const itemMap = await this.getActiveItems(detailPayload.map((detail) => detail.itemId));
        let created;
        try {
            created = await this.prisma.$transaction(async (tx) => {
                await this.ensureBatchAvailability(detailPayload, tx, undefined);
                const header = await tx.deliveryOrder.create({
                    data: {
                        doNumber,
                        doDate: new Date(dto.doDate),
                        doReceivedDate: new Date(dto.doReceivedDate),
                        customerId,
                        destinationCityId: resolvedDestinationCityId,
                        stdLeadTimeDays: resolvedStdLeadTimeDays,
                        stdReturnDoDays: resolvedStdReturnDoDays,
                        shippingDate: dto.shippingDate ? new Date(dto.shippingDate) : null,
                        actualReceivedDate: dto.actualReceivedDate ? new Date(dto.actualReceivedDate) : null,
                        receivedBy: dto.receivedBy ?? null,
                        doScanReturnDate: dto.doScanReturnDate ? new Date(dto.doScanReturnDate) : null,
                        bu: dto.bu ?? null,
                        notes: dto.notes ?? null,
                        status: dto.status ?? 'OPEN',
                        createdBy: auditActor ?? null,
                        updatedBy: auditActor ?? null,
                    },
                });
                for (let index = 0; index < detailPayload.length; index += 1) {
                    const detail = detailPayload[index];
                    const item = itemMap.get(detail.itemId);
                    const createdDetail = await tx.deliveryOrderDetail.create({
                        data: {
                            doId: header.id,
                            lineNo: index + 1,
                            itemId: detail.itemId,
                            qtyPcs: detail.qtyPcs ?? 0,
                            qtyKg: detail.qtyKg,
                            itemCodeSnapshot: item.code,
                            itemNameSnapshot: item.name,
                            uomCodeSnapshot: item.uom.code,
                            notes: detail.notes ?? null,
                            createdBy: auditActor ?? null,
                            updatedBy: auditActor ?? null,
                        },
                        select: { id: true },
                    });
                    await tx.outboundDetailBatch.create({
                        data: {
                            outboundDetailId: createdDetail.id,
                            lineNo: 1,
                            batchOut: detail.batchNumber,
                            qtyPcs: detail.qtyPcs ?? 0,
                            qtyKg: detail.qtyKg,
                            notes: detail.notes ?? null,
                            createdBy: auditActor ?? null,
                            updatedBy: auditActor ?? null,
                        },
                    });
                }
                await this.syncOutboundInventoryLedger(tx, header.id, actorId);
                return header;
            });
        }
        catch (error) {
            if ((0, duplicate_util_1.isUniqueViolation)(error, [
                'do_number',
                'doNumber',
                'm2_outbound_do_number_key',
                'ux_m2_outbound_number_active',
            ])) {
                (0, duplicate_util_1.throwDuplicate)({ fieldLabel: 'DO number', value: doNumber });
            }
            throw error;
        }
        return this.findOne(created.id);
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;
        const where = { deletedAt: null };
        if (query.status) {
            where.status = query.status;
        }
        if (query.customerId?.trim()) {
            where.customerId = this.parseId(query.customerId, 'customerId');
        }
        if (query.doDateFrom || query.doDateTo) {
            where.doDate = {
                gte: query.doDateFrom ? new Date(query.doDateFrom) : undefined,
                lte: query.doDateTo ? new Date(query.doDateTo) : undefined,
            };
        }
        if (query.search?.trim()) {
            const q = query.search.trim();
            where.OR = [
                { doNumber: { contains: q, mode: 'insensitive' } },
                { bu: { contains: q, mode: 'insensitive' } },
                { customer: { code: { contains: q, mode: 'insensitive' } } },
                { customer: { name: { contains: q, mode: 'insensitive' } } },
            ];
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.deliveryOrder.findMany({
                where,
                include: {
                    customer: { select: { id: true, code: true, name: true, type: true } },
                    destinationCity: { select: { id: true, name: true, postalCode: true } },
                    _count: { select: { details: { where: { deletedAt: null } } } },
                    details: {
                        where: { deletedAt: null },
                        select: {
                            qtyKg: true,
                            batches: {
                                where: { deletedAt: null },
                                select: { id: true },
                            },
                        },
                    },
                },
                orderBy: [{ createdAt: 'desc' }],
                skip,
                take: limit,
            }),
            this.prisma.deliveryOrder.count({ where }),
        ]);
        const data = items.map((item) => {
            const totalItemTypes = item._count?.details ?? 0;
            const totalBatches = item.details.reduce((sum, detail) => sum + detail.batches.length, 0);
            const totalKg = item.details.reduce((sum, detail) => {
                const qtyKg = Number(detail.qtyKg ?? 0);
                return sum + (Number.isFinite(qtyKg) ? qtyKg : 0);
            }, 0);
            return {
                ...item,
                totalItemTypes,
                totalBatches,
                totalKg,
            };
        });
        return {
            success: true,
            data,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit) || 1,
            },
        };
    }
    async getBatchOptions(itemId, excludeDoId) {
        if (!String(itemId ?? '').trim()) {
            throw new common_1.BadRequestException('itemId is required');
        }
        const normalizedItemId = this.parseId(itemId, 'itemId');
        const normalizedExcludeDoId = this.parseOptionalId(excludeDoId, 'excludeDoId');
        const [inboundRows, usedRows] = await this.prisma.$transaction([
            this.prisma.inboundDetailBatch.groupBy({
                by: ['batchIn'],
                where: {
                    deletedAt: null,
                    inboundDetail: {
                        deletedAt: null,
                        itemId: normalizedItemId,
                        inbound: {
                            deletedAt: null,
                            status: 'POSTED',
                        },
                    },
                },
                _sum: {
                    qty: true,
                },
                orderBy: {
                    batchIn: 'asc',
                },
            }),
            this.prisma.outboundDetailBatch.groupBy({
                by: ['batchOut'],
                where: {
                    deletedAt: null,
                    outboundDetail: {
                        deletedAt: null,
                        itemId: normalizedItemId,
                        deliveryOrder: {
                            deletedAt: null,
                            id: normalizedExcludeDoId ? { not: normalizedExcludeDoId } : undefined,
                        },
                    },
                },
                _sum: {
                    qtyPcs: true,
                },
                orderBy: {
                    batchOut: 'asc',
                },
            }),
        ]);
        const usedByBatch = new Map();
        usedRows.forEach((row) => {
            const key = String(row.batchOut ?? '')
                .trim()
                .toLowerCase();
            if (!key) {
                return;
            }
            const qty = Number(row._sum?.qtyPcs ?? 0);
            usedByBatch.set(key, (usedByBatch.get(key) ?? 0) + (Number.isFinite(qty) ? qty : 0));
        });
        return {
            success: true,
            data: inboundRows
                .map((row) => {
                const inboundQty = Number(row._sum?.qty ?? 0);
                const usedQty = usedByBatch.get(String(row.batchIn ?? '')
                    .trim()
                    .toLowerCase()) ?? 0;
                const remainingQty = Math.max(inboundQty - usedQty, 0);
                return {
                    batchNumber: row.batchIn,
                    qtyPcs: remainingQty,
                };
            })
                .filter((row) => row.qtyPcs > 0),
        };
    }
    async findMonitoringReport(query) {
        const where = { deletedAt: null };
        if (query.cityId?.trim()) {
            where.destinationCityId = this.parseId(query.cityId, 'cityId');
        }
        if (query.provinceId?.trim()) {
            where.destinationCity = {
                provinceId: this.parseId(query.provinceId, 'provinceId'),
            };
        }
        if (query.doReceivedDateFrom || query.doReceivedDateTo) {
            where.doReceivedDate = {
                gte: query.doReceivedDateFrom ? new Date(query.doReceivedDateFrom) : undefined,
                lte: query.doReceivedDateTo ? new Date(query.doReceivedDateTo) : undefined,
            };
        }
        const items = await this.prisma.deliveryOrder.findMany({
            where,
            include: {
                customer: { select: { id: true, code: true, name: true, type: true } },
                destinationCity: {
                    select: {
                        id: true,
                        name: true,
                        postalCode: true,
                        province: { select: { id: true, name: true, isoCode: true } },
                    },
                },
                details: {
                    where: { deletedAt: null },
                    select: {
                        itemId: true,
                        qtyPcs: true,
                        qtyKg: true,
                        batches: {
                            where: { deletedAt: null },
                            select: { batchOut: true },
                        },
                    },
                },
            },
            orderBy: [{ doReceivedDate: 'desc' }, { createdAt: 'desc' }],
        });
        const pairKeys = new Set();
        const batchNumbers = new Set();
        const itemIds = new Set();
        items.forEach((row) => {
            row.details.forEach((detail) => {
                const itemId = Number(detail.itemId ?? 0);
                detail.batches.forEach((batch) => {
                    const batchNumber = String(batch.batchOut ?? '').trim();
                    if (!Number.isInteger(itemId) || itemId <= 0 || !batchNumber) {
                        return;
                    }
                    pairKeys.add(`${itemId}::${batchNumber}`);
                    itemIds.add(itemId);
                    batchNumbers.add(batchNumber);
                });
            });
        });
        const sourceByPair = new Map();
        if (pairKeys.size > 0) {
            const sourceRows = await this.prisma.inboundDetailBatch.findMany({
                where: {
                    deletedAt: null,
                    batchIn: { in: [...batchNumbers] },
                    inboundDetail: {
                        deletedAt: null,
                        itemId: { in: [...itemIds] },
                        inbound: { deletedAt: null },
                    },
                },
                select: {
                    batchIn: true,
                    inboundDetail: {
                        select: {
                            itemId: true,
                            inbound: {
                                select: {
                                    supplierId: true,
                                    warehouseId: true,
                                    supplier: { select: { name: true } },
                                    warehouse: { select: { name: true } },
                                },
                            },
                        },
                    },
                },
            });
            sourceRows.forEach((row) => {
                const itemId = String(row.inboundDetail?.itemId ?? '').trim();
                const batchNumber = String(row.batchIn ?? '').trim();
                const pairKey = `${itemId}::${batchNumber}`;
                if (!pairKeys.has(pairKey)) {
                    return;
                }
                const next = sourceByPair.get(pairKey) ?? [];
                next.push({
                    supplierId: row.inboundDetail?.inbound?.supplierId ?? null,
                    supplierName: row.inboundDetail?.inbound?.supplier?.name ?? null,
                    warehouseId: row.inboundDetail?.inbound?.warehouseId ?? null,
                    warehouseName: row.inboundDetail?.inbound?.warehouse?.name ?? null,
                });
                sourceByPair.set(pairKey, next);
            });
        }
        const supplierFilter = this.parseOptionalId(query.supplierId, 'supplierId');
        const warehouseFilter = this.parseOptionalId(query.warehouseId, 'warehouseId');
        const enriched = items
            .map((row) => {
            const supplierSet = new Map();
            const warehouseSet = new Map();
            const totalItemTypes = row.details.length;
            const totalQtyPcs = row.details.reduce((sum, detail) => {
                const qty = Number(detail.qtyPcs ?? 0);
                return sum + (Number.isFinite(qty) ? qty : 0);
            }, 0);
            const totalKg = row.details.reduce((sum, detail) => {
                const qty = Number(detail.qtyKg ?? 0);
                return sum + (Number.isFinite(qty) ? qty : 0);
            }, 0);
            row.details.forEach((detail) => {
                detail.batches.forEach((batch) => {
                    const pairKey = `${detail.itemId}::${batch.batchOut}`;
                    const sources = sourceByPair.get(pairKey) ?? [];
                    sources.forEach((source) => {
                        if (source.supplierId) {
                            supplierSet.set(source.supplierId, source.supplierName || String(source.supplierId));
                        }
                        if (source.warehouseId) {
                            warehouseSet.set(source.warehouseId, source.warehouseName || String(source.warehouseId));
                        }
                    });
                });
            });
            return {
                ...row,
                totalItemTypes,
                totalQtyPcs,
                totalKg,
                sourceSuppliers: [...supplierSet.entries()].map(([id, name]) => ({ id, name })),
                sourceWarehouses: [...warehouseSet.entries()].map(([id, name]) => ({ id, name })),
            };
        })
            .filter((row) => {
            if (supplierFilter !== undefined) {
                const hasSupplier = row.sourceSuppliers.some((supplier) => supplier.id === supplierFilter);
                if (!hasSupplier) {
                    return false;
                }
            }
            if (warehouseFilter !== undefined) {
                const hasWarehouse = row.sourceWarehouses.some((warehouse) => warehouse.id === warehouseFilter);
                if (!hasWarehouse) {
                    return false;
                }
            }
            return true;
        });
        return {
            success: true,
            data: enriched,
            meta: {
                total: enriched.length,
            },
        };
    }
    async findStockBatchReport(query) {
        const minimumStockPcs = 0;
        const warehouseFilter = this.parseOptionalId(query.warehouseId, 'warehouseId');
        const supplierFilter = this.parseOptionalId(query.supplierId, 'supplierId');
        const itemFilter = this.parseOptionalId(query.itemId, 'itemId');
        const [warehouseFilterRow, itemFilterRow] = await Promise.all([
            warehouseFilter !== undefined
                ? this.prisma.masterDataWarehouse.findFirst({
                    where: { id: warehouseFilter, deletedAt: null },
                    select: { id: true },
                })
                : Promise.resolve(null),
            itemFilter !== undefined
                ? this.prisma.masterDataItem.findFirst({
                    where: { id: itemFilter, deletedAt: null },
                    select: { id: true },
                })
                : Promise.resolve(null),
        ]);
        const ledgerRows = await this.prisma.inventoryLedger.findMany({
            where: {
                deletedAt: null,
                warehouseId: warehouseFilterRow?.id,
                itemId: itemFilterRow?.id,
            },
            include: {
                item: {
                    select: {
                        id: true,
                        code: true,
                        name: true,
                        uom: { select: { id: true, code: true, name: true } },
                    },
                },
                warehouse: { select: { id: true, name: true } },
                batch: { select: { id: true, batchNumber: true } },
            },
            orderBy: [{ transactionDate: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }],
        });
        const pairKeys = new Set();
        const itemIds = new Set();
        const batchNumbers = new Set();
        const warehouseIds = new Set();
        ledgerRows.forEach((row) => {
            const itemId = Number(row.item?.id ?? 0);
            const batchNumber = String(row.batch?.batchNumber ?? '').trim();
            const warehouseId = Number(row.warehouse?.id ?? 0);
            if (!Number.isInteger(itemId) || itemId <= 0 || !batchNumber || !warehouseId) {
                return;
            }
            pairKeys.add(`${itemId}::${batchNumber}::${warehouseId}`);
            itemIds.add(itemId);
            batchNumbers.add(batchNumber);
            warehouseIds.add(warehouseId);
        });
        const suppliersByPair = new Map();
        if (pairKeys.size > 0) {
            const inboundSources = await this.prisma.inboundDetailBatch.findMany({
                where: {
                    deletedAt: null,
                    batchIn: { in: [...batchNumbers] },
                    inboundDetail: {
                        deletedAt: null,
                        itemId: { in: [...itemIds] },
                        inbound: {
                            deletedAt: null,
                            warehouseId: { in: [...warehouseIds] },
                        },
                    },
                },
                select: {
                    batchIn: true,
                    inboundDetail: {
                        select: {
                            itemId: true,
                            inbound: {
                                select: {
                                    warehouseId: true,
                                    supplierId: true,
                                    supplier: { select: { name: true } },
                                },
                            },
                        },
                    },
                },
            });
            inboundSources.forEach((row) => {
                const itemId = String(row.inboundDetail?.itemId ?? '').trim();
                const batchNumber = String(row.batchIn ?? '').trim();
                const warehouseId = Number(row.inboundDetail?.inbound?.warehouseId ?? 0);
                const supplierId = Number(row.inboundDetail?.inbound?.supplierId ?? 0);
                if (!itemId || !batchNumber || !warehouseId || !supplierId) {
                    return;
                }
                const pairKey = `${itemId}::${batchNumber}::${warehouseId}`;
                if (!pairKeys.has(pairKey)) {
                    return;
                }
                const current = suppliersByPair.get(pairKey) ?? [];
                if (!current.some((supplier) => supplier.id === supplierId)) {
                    current.push({
                        id: supplierId,
                        name: row.inboundDetail?.inbound?.supplier?.name ?? String(supplierId),
                    });
                }
                suppliersByPair.set(pairKey, current);
            });
        }
        const balancesByKey = new Map();
        const data = ledgerRows
            .filter((row) => {
            if (supplierFilter === undefined) {
                return true;
            }
            const pairKey = `${row.item?.id ?? ''}::${row.batch?.batchNumber ?? ''}::${row.warehouse?.id ?? ''}`;
            const suppliers = suppliersByPair.get(pairKey) ?? [];
            return suppliers.some((supplier) => supplier.id === supplierFilter);
        })
            .map((row) => {
            const qtyPcs = Number(row.quantityPcs ?? 0);
            const numericQty = Number.isFinite(qtyPcs) ? qtyPcs : 0;
            const inbound = numericQty > 0 ? numericQty : 0;
            const outbound = numericQty < 0 ? Math.abs(numericQty) : 0;
            const balanceKey = `${row.itemId}::${row.batchId}::${row.warehouseId}`;
            const prevBalance = balancesByKey.get(balanceKey) ?? 0;
            const nextBalance = prevBalance + numericQty;
            balancesByKey.set(balanceKey, nextBalance);
            const pairKey = `${row.item?.id ?? ''}::${row.batch?.batchNumber ?? ''}::${row.warehouse?.id ?? ''}`;
            const suppliers = suppliersByPair.get(pairKey) ?? [];
            return {
                id: row.id,
                item: row.item,
                warehouse: row.warehouse,
                batch: row.batch,
                supplierNames: suppliers.map((supplier) => supplier.name),
                transactionDate: row.transactionDate,
                mmfOrDo: row.referenceNumber ?? '',
                description: row.notes ?? row.transactionType ?? '',
                inbound,
                outbound,
                balance: nextBalance,
                replenish: nextBalance <= minimumStockPcs ? 'YES' : '',
            };
        });
        return {
            success: true,
            data,
            meta: {
                total: data.length,
            },
        };
    }
    async findStockMutationReport(query) {
        const warehouseFilter = this.parseOptionalId(query.warehouseId, 'warehouseId');
        const supplierFilter = this.parseOptionalId(query.supplierId, 'supplierId');
        const itemFilter = this.parseOptionalId(query.itemId, 'itemId');
        const [warehouseFilterRow, itemFilterRow] = await Promise.all([
            warehouseFilter !== undefined
                ? this.prisma.masterDataWarehouse.findFirst({
                    where: { id: warehouseFilter, deletedAt: null },
                    select: { id: true },
                })
                : Promise.resolve(null),
            itemFilter !== undefined
                ? this.prisma.masterDataItem.findFirst({
                    where: { id: itemFilter, deletedAt: null },
                    select: { id: true },
                })
                : Promise.resolve(null),
        ]);
        const ledgerRows = await this.prisma.inventoryLedger.findMany({
            where: {
                deletedAt: null,
                warehouseId: warehouseFilterRow?.id,
                itemId: itemFilterRow?.id,
            },
            include: {
                item: {
                    select: {
                        id: true,
                        code: true,
                        name: true,
                    },
                },
                warehouse: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                batch: {
                    select: {
                        id: true,
                        batchNumber: true,
                        expiryDate: true,
                    },
                },
            },
            orderBy: [{ transactionDate: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }],
        });
        const batchBalanceMap = new Map();
        ledgerRows.forEach((row) => {
            const itemId = String(row.itemId ?? '').trim();
            const warehouseId = Number(row.warehouseId ?? 0);
            const batchId = Number(row.batchId ?? 0);
            if (!itemId || !warehouseId || !batchId) {
                return;
            }
            const key = `${itemId}::${warehouseId}::${batchId}`;
            const current = batchBalanceMap.get(key) ?? {
                itemId: row.item?.id ?? itemId,
                itemCode: row.item?.code ?? '',
                itemName: row.item?.name ?? '',
                warehouseId: row.warehouse?.id ?? warehouseId,
                warehouseName: row.warehouse?.name ?? '',
                batchNumber: row.batch?.batchNumber ?? '',
                expiryDate: row.batch?.expiryDate ?? null,
                total: 0,
            };
            const qty = Number(row.quantityPcs ?? 0);
            current.total += Number.isFinite(qty) ? qty : 0;
            if (!current.expiryDate && row.batch?.expiryDate) {
                current.expiryDate = row.batch.expiryDate;
            }
            batchBalanceMap.set(key, current);
        });
        const balances = [...batchBalanceMap.values()].filter((row) => Math.abs(row.total) > 0.000001);
        const pairKeys = new Set();
        const itemIds = new Set();
        const batchNumbers = new Set();
        const warehouseIds = new Set();
        balances.forEach((row) => {
            if (!row.itemId || !row.batchNumber || !row.warehouseId) {
                return;
            }
            pairKeys.add(`${row.itemId}::${row.batchNumber}::${row.warehouseId}`);
            itemIds.add(row.itemId);
            batchNumbers.add(row.batchNumber);
            warehouseIds.add(row.warehouseId);
        });
        const suppliersByPair = new Map();
        if (pairKeys.size > 0) {
            const inboundSources = await this.prisma.inboundDetailBatch.findMany({
                where: {
                    deletedAt: null,
                    batchIn: { in: [...batchNumbers] },
                    inboundDetail: {
                        deletedAt: null,
                        itemId: { in: [...itemIds] },
                        inbound: {
                            deletedAt: null,
                            warehouseId: { in: [...warehouseIds] },
                        },
                    },
                },
                select: {
                    batchIn: true,
                    inboundDetail: {
                        select: {
                            itemId: true,
                            inbound: {
                                select: {
                                    warehouseId: true,
                                    supplierId: true,
                                    supplier: { select: { name: true } },
                                },
                            },
                        },
                    },
                },
            });
            inboundSources.forEach((row) => {
                const itemId = String(row.inboundDetail?.itemId ?? '').trim();
                const batchNumber = String(row.batchIn ?? '').trim();
                const warehouseId = Number(row.inboundDetail?.inbound?.warehouseId ?? 0);
                const supplierId = Number(row.inboundDetail?.inbound?.supplierId ?? 0);
                if (!itemId || !batchNumber || !warehouseId || !supplierId) {
                    return;
                }
                const pairKey = `${itemId}::${batchNumber}::${warehouseId}`;
                if (!pairKeys.has(pairKey)) {
                    return;
                }
                const current = suppliersByPair.get(pairKey) ?? [];
                if (!current.some((supplier) => supplier.id === supplierId)) {
                    current.push({
                        id: supplierId,
                        name: row.inboundDetail?.inbound?.supplier?.name ?? String(supplierId),
                    });
                }
                suppliersByPair.set(pairKey, current);
            });
        }
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const plusThreeMonths = new Date(startOfToday);
        plusThreeMonths.setMonth(plusThreeMonths.getMonth() + 3);
        const plusSixMonths = new Date(startOfToday);
        plusSixMonths.setMonth(plusSixMonths.getMonth() + 6);
        const data = balances
            .filter((row) => {
            if (supplierFilter === undefined) {
                return true;
            }
            const pairKey = `${row.itemId}::${row.batchNumber}::${row.warehouseId}`;
            const suppliers = suppliersByPair.get(pairKey) ?? [];
            return suppliers.some((supplier) => supplier.id === supplierFilter);
        })
            .map((row) => {
            const exp = row.expiryDate ? new Date(row.expiryDate) : null;
            const expDateOnly = exp ? new Date(exp.getFullYear(), exp.getMonth(), exp.getDate()) : null;
            const isExpiredOrToday = expDateOnly
                ? expDateOnly.getTime() <= startOfToday.getTime()
                : false;
            const isInThreeMonths = expDateOnly
                ? expDateOnly.getTime() > startOfToday.getTime() &&
                    expDateOnly.getTime() <= plusThreeMonths.getTime()
                : false;
            const isInSixMonths = expDateOnly
                ? expDateOnly.getTime() > plusThreeMonths.getTime() &&
                    expDateOnly.getTime() <= plusSixMonths.getTime()
                : false;
            let expireLabel = '-';
            let remarks = '';
            if (expDateOnly) {
                const diffMs = expDateOnly.getTime() - startOfToday.getTime();
                const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
                if (diffDays < 0) {
                    expireLabel = `EXPIRED ${Math.abs(diffDays)} DAY`;
                    remarks = 'Expired';
                }
                else if (diffDays === 0) {
                    expireLabel = 'EXPIRED TODAY';
                    remarks = 'Expired Today';
                }
                else {
                    expireLabel = `${diffDays} DAY`;
                    if (diffDays <= 90) {
                        remarks = 'Near Expire <= 3 Mth';
                    }
                    else if (diffDays <= 180) {
                        remarks = 'Near Expire <= 6 Mth';
                    }
                }
            }
            return {
                itemId: row.itemId,
                warehouseId: row.warehouseId,
                supplierNames: suppliersByPair
                    .get(`${row.itemId}::${row.batchNumber}::${row.warehouseId}`)
                    ?.map((supplier) => supplier.name) ?? [],
                description: `${row.itemCode} ${row.itemName}`.trim(),
                batchNumber: row.batchNumber,
                expiryDate: row.expiryDate,
                total: row.total,
                actualToday: isExpiredOrToday ? row.total : 0,
                actualThreeMonths: isInThreeMonths ? row.total : 0,
                actualSixMonths: isInSixMonths ? row.total : 0,
                expire: expireLabel,
                remarks,
            };
        })
            .sort((a, b) => {
            if (a.description !== b.description) {
                return a.description.localeCompare(b.description);
            }
            return a.batchNumber.localeCompare(b.batchNumber);
        });
        return {
            success: true,
            data,
            meta: {
                total: data.length,
            },
        };
    }
    async findOne(id) {
        const item = await this.prisma.deliveryOrder.findFirst({
            where: { id, deletedAt: null },
            include: {
                customer: { select: { id: true, code: true, name: true, type: true } },
                destinationCity: {
                    select: {
                        id: true,
                        name: true,
                        postalCode: true,
                        province: { select: { id: true, name: true, isoCode: true } },
                    },
                },
                details: {
                    where: { deletedAt: null },
                    orderBy: [{ lineNo: 'asc' }],
                    include: {
                        batches: {
                            where: { deletedAt: null },
                            orderBy: [{ lineNo: 'asc' }],
                        },
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
                    },
                },
            },
        });
        if (!item) {
            throw new common_1.NotFoundException('outbound not found');
        }
        return { success: true, data: item };
    }
    async update(id, dto, actorId) {
        const auditActor = this.normalizeAuditActor(actorId);
        const existing = await this.prisma.deliveryOrder.findFirst({
            where: { id, deletedAt: null },
            select: { id: true, doNumber: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('outbound not found');
        }
        if (typeof dto.doNumber !== 'undefined') {
            const normalizedDoNumber = this.normalizeRequiredDoNumber(dto.doNumber);
            dto.doNumber = normalizedDoNumber;
            if (normalizedDoNumber !== existing.doNumber) {
                await this.ensureDoNumberAvailable(normalizedDoNumber, id);
            }
        }
        if (dto.customerId) {
            const customerId = this.parseId(dto.customerId, 'customerId');
            dto.customerId = String(customerId);
            await this.ensureCustomerExists(customerId);
        }
        if (typeof dto.destinationCityId !== 'undefined') {
            const destinationCityId = this.parseOptionalId(dto.destinationCityId, 'destinationCityId');
            if (destinationCityId !== undefined) {
                await this.ensureCityExists(destinationCityId);
            }
            dto.destinationCityId =
                typeof destinationCityId === 'number' ? String(destinationCityId) : undefined;
        }
        const detailsProvided = Array.isArray(dto.details);
        let detailPayload = [];
        let itemMap = new Map();
        if (detailsProvided) {
            detailPayload = this.normalizeAndValidateDetails(dto.details);
            itemMap = await this.getActiveItems(detailPayload.map((detail) => detail.itemId));
        }
        try {
            await this.prisma.$transaction(async (tx) => {
                if (detailsProvided) {
                    await this.ensureBatchAvailability(detailPayload, tx, id);
                }
                await tx.deliveryOrder.update({
                    where: { id },
                    data: {
                        doNumber: dto.doNumber,
                        doDate: dto.doDate ? new Date(dto.doDate) : undefined,
                        doReceivedDate: dto.doReceivedDate ? new Date(dto.doReceivedDate) : undefined,
                        customerId: dto.customerId ? this.parseId(dto.customerId, 'customerId') : undefined,
                        destinationCityId: typeof dto.destinationCityId !== 'undefined'
                            ? dto.destinationCityId
                                ? this.parseId(dto.destinationCityId, 'destinationCityId')
                                : null
                            : undefined,
                        stdLeadTimeDays: dto.stdLeadTimeDays,
                        stdReturnDoDays: dto.stdReturnDoDays,
                        shippingDate: dto.shippingDate ? new Date(dto.shippingDate) : undefined,
                        actualReceivedDate: dto.actualReceivedDate
                            ? new Date(dto.actualReceivedDate)
                            : undefined,
                        receivedBy: dto.receivedBy,
                        doScanReturnDate: dto.doScanReturnDate ? new Date(dto.doScanReturnDate) : undefined,
                        bu: dto.bu,
                        notes: dto.notes,
                        status: dto.status,
                        updatedBy: auditActor ?? null,
                    },
                });
                if (detailsProvided) {
                    const existingDetailRows = await tx.deliveryOrderDetail.findMany({
                        where: { doId: id },
                        select: { id: true },
                    });
                    const existingDetailIds = existingDetailRows.map((row) => row.id);
                    if (existingDetailIds.length > 0) {
                        await tx.outboundDetailBatch.deleteMany({
                            where: { outboundDetailId: { in: existingDetailIds } },
                        });
                    }
                    await tx.deliveryOrderDetail.deleteMany({ where: { doId: id } });
                    for (let index = 0; index < detailPayload.length; index += 1) {
                        const detail = detailPayload[index];
                        const item = itemMap.get(detail.itemId);
                        const createdDetail = await tx.deliveryOrderDetail.create({
                            data: {
                                doId: id,
                                lineNo: index + 1,
                                itemId: detail.itemId,
                                qtyPcs: detail.qtyPcs ?? 0,
                                qtyKg: detail.qtyKg,
                                itemCodeSnapshot: item.code,
                                itemNameSnapshot: item.name,
                                uomCodeSnapshot: item.uom.code,
                                notes: detail.notes ?? null,
                                createdBy: auditActor ?? null,
                                updatedBy: auditActor ?? null,
                            },
                            select: { id: true },
                        });
                        await tx.outboundDetailBatch.create({
                            data: {
                                outboundDetailId: createdDetail.id,
                                lineNo: 1,
                                batchOut: detail.batchNumber,
                                qtyPcs: detail.qtyPcs ?? 0,
                                qtyKg: detail.qtyKg,
                                notes: detail.notes ?? null,
                                createdBy: auditActor ?? null,
                                updatedBy: auditActor ?? null,
                            },
                        });
                    }
                }
                await this.syncOutboundInventoryLedger(tx, id, actorId);
            });
        }
        catch (error) {
            if ((0, duplicate_util_1.isUniqueViolation)(error, [
                'do_number',
                'doNumber',
                'm2_outbound_do_number_key',
                'ux_m2_outbound_number_active',
            ])) {
                (0, duplicate_util_1.throwDuplicate)({
                    fieldLabel: 'DO number',
                    value: dto.doNumber ?? existing.doNumber,
                });
            }
            throw error;
        }
        return this.findOne(id);
    }
    async remove(id, actorId) {
        const auditActor = this.normalizeAuditActor(actorId);
        const existing = await this.prisma.deliveryOrder.findFirst({
            where: { id, deletedAt: null },
            select: { id: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('outbound not found');
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.deliveryOrder.update({
                where: { id },
                data: {
                    deletedAt: new Date(),
                    deletedBy: auditActor ?? null,
                    status: 'COMPLETED',
                    updatedBy: auditActor ?? null,
                },
            });
            await tx.outboundDetailBatch.updateMany({
                where: {
                    deletedAt: null,
                    outboundDetail: {
                        doId: id,
                        deletedAt: null,
                    },
                },
                data: {
                    deletedAt: new Date(),
                    deletedBy: auditActor ?? null,
                    updatedBy: auditActor ?? null,
                },
            });
            await tx.deliveryOrderDetail.updateMany({
                where: { doId: id, deletedAt: null },
                data: {
                    deletedAt: new Date(),
                    deletedBy: auditActor ?? null,
                    updatedBy: auditActor ?? null,
                },
            });
            await this.syncOutboundInventoryLedger(tx, id, actorId);
        });
        return { success: true, message: 'outbound deleted' };
    }
    async ensureDoNumberAvailable(doNumber, exceptId) {
        const duplicate = await this.prisma.deliveryOrder.findFirst({
            where: {
                doNumber,
                NOT: exceptId ? { id: exceptId } : undefined,
            },
            select: { id: true, deletedAt: true },
        });
        if (duplicate) {
            (0, duplicate_util_1.throwDuplicate)({
                fieldLabel: 'DO number',
                value: doNumber,
                isSoftDeleted: Boolean(duplicate.deletedAt),
            });
        }
    }
    normalizeRequiredDoNumber(value) {
        const doNumber = String(value ?? '').trim();
        if (!doNumber) {
            throw new common_1.BadRequestException('DO number is required');
        }
        return doNumber;
    }
    async ensureCustomerExists(customerId) {
        const customer = await this.prisma.masterDataContact.findFirst({
            where: {
                id: customerId,
                type: 'customer',
                deletedAt: null,
            },
            select: { id: true, city: true },
        });
        if (!customer) {
            throw new common_1.BadRequestException('Customer not found');
        }
        return customer;
    }
    async resolveDefaultsFromCustomerCity(customerCity) {
        const normalizedCityName = String(customerCity ?? '').trim();
        if (!normalizedCityName) {
            return { destinationCityId: null };
        }
        const matchedCity = await this.prisma.masterDataCity.findFirst({
            where: {
                name: {
                    equals: normalizedCityName,
                    mode: 'insensitive',
                },
                deletedAt: null,
            },
            select: { id: true },
            orderBy: [{ createdAt: 'asc' }],
        });
        return { destinationCityId: matchedCity?.id ?? null };
    }
    async findCitySlaByCityId(cityId) {
        return this.prisma.masterDataCitySla.findFirst({
            where: {
                cityId,
                deletedAt: null,
            },
            select: {
                stdLeadTimeDays: true,
                stdReturnDoDays: true,
            },
        });
    }
    async ensureCityExists(cityId) {
        const city = await this.prisma.masterDataCity.findFirst({
            where: { id: cityId, deletedAt: null },
            select: { id: true },
        });
        if (!city) {
            throw new common_1.BadRequestException('Destination city not found');
        }
    }
    normalizeAndValidateDetails(details) {
        if (!details.length) {
            throw new common_1.BadRequestException('At least one detail row is required');
        }
        const seen = new Set();
        return details.map((raw) => {
            const itemId = this.parseId(raw.itemId, 'detail.itemId');
            const batchNumber = raw.batchNumber.trim();
            if (!itemId) {
                throw new common_1.BadRequestException('Detail itemId is required');
            }
            if (!batchNumber) {
                throw new common_1.BadRequestException('Detail batchNumber is required');
            }
            const compositeKey = `${String(itemId)}::${batchNumber.toLowerCase()}`;
            if (seen.has(compositeKey)) {
                throw new common_1.BadRequestException(`Duplicate item and batch combination: ${itemId} - ${batchNumber}`);
            }
            seen.add(compositeKey);
            return {
                ...raw,
                itemId,
                batchNumber,
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
                uom: { select: { id: true, code: true } },
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
                uom: { code: item.uom.code },
            },
        ]));
    }
    async resolveWarehouseForActor(tx, actorId) {
        const parsedActorId = this.parseOptionalActorUserId(actorId);
        if (!parsedActorId) {
            return undefined;
        }
        const actor = await tx.user.findFirst({
            where: {
                id: parsedActorId,
                deletedAt: null,
            },
            select: {
                warehouse: {
                    select: {
                        id: true,
                    },
                },
            },
        });
        const mappedWarehouseId = actor?.warehouse?.id;
        if (!mappedWarehouseId || mappedWarehouseId <= 0) {
            return undefined;
        }
        return mappedWarehouseId;
    }
    async syncOutboundInventoryLedger(tx, deliveryOrderId, actorId) {
        const auditActor = this.normalizeAuditActor(actorId);
        const now = new Date();
        await tx.inventoryLedger.updateMany({
            where: {
                referenceDocType: 'OUTBOUND',
                referenceDocId: String(deliveryOrderId),
                deletedAt: null,
            },
            data: {
                deletedAt: now,
                deletedBy: auditActor ?? null,
                updatedBy: auditActor ?? null,
            },
        });
        const outbound = await tx.deliveryOrder.findFirst({
            where: { id: deliveryOrderId },
            select: {
                id: true,
                doNumber: true,
                doDate: true,
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
                                batchOut: true,
                                qtyPcs: true,
                                qtyKg: true,
                                expiredDate: true,
                                notes: true,
                            },
                        },
                    },
                },
            },
        });
        if (!outbound || outbound.deletedAt) {
            return;
        }
        const actorWarehouseId = await this.resolveWarehouseForActor(tx, actorId);
        const actorUserId = await this.resolveActorUserId(tx, actorId);
        const itemIds = new Set();
        const batchNumbers = new Set();
        outbound.details.forEach((detail) => {
            const itemId = Number(detail.itemId ?? 0);
            if (!itemId) {
                return;
            }
            itemIds.add(itemId);
            detail.batches.forEach((batch) => {
                const batchNumber = String(batch.batchOut ?? '').trim();
                if (batchNumber) {
                    batchNumbers.add(batchNumber);
                }
            });
        });
        const sourceByPair = new Map();
        if (itemIds.size > 0 && batchNumbers.size > 0) {
            const inboundSources = await tx.inboundDetailBatch.findMany({
                where: {
                    deletedAt: null,
                    batchIn: { in: [...batchNumbers] },
                    inboundDetail: {
                        deletedAt: null,
                        itemId: { in: [...itemIds] },
                        inbound: {
                            deletedAt: null,
                            status: 'POSTED',
                        },
                    },
                },
                select: {
                    batchIn: true,
                    expiredDate: true,
                    inboundDetail: {
                        select: {
                            itemId: true,
                            inbound: {
                                select: {
                                    warehouse: {
                                        select: {
                                            id: true,
                                        },
                                    },
                                    transactionDate: true,
                                },
                            },
                        },
                    },
                },
                orderBy: [{ inboundDetail: { inbound: { transactionDate: 'asc' } } }, { createdAt: 'asc' }],
            });
            inboundSources.forEach((source) => {
                const itemId = String(source.inboundDetail?.itemId ?? '').trim();
                const batchNumber = String(source.batchIn ?? '').trim();
                const warehouseId = Number(source.inboundDetail?.inbound?.warehouse?.id ?? 0);
                if (!itemId || !batchNumber || !warehouseId) {
                    return;
                }
                const key = `${itemId}::${batchNumber.toLowerCase()}`;
                if (!sourceByPair.has(key)) {
                    sourceByPair.set(key, {
                        warehouseId,
                        expiryDate: source.expiredDate ?? null,
                    });
                }
            });
        }
        for (const detail of outbound.details) {
            for (const batch of detail.batches) {
                const batchNumber = String(batch.batchOut ?? '').trim();
                if (!batchNumber) {
                    continue;
                }
                const pairKey = `${detail.itemId}::${batchNumber.toLowerCase()}`;
                const source = sourceByPair.get(pairKey);
                const warehouseId = source?.warehouseId || actorWarehouseId;
                if (!warehouseId) {
                    throw new common_1.BadRequestException(`Warehouse source is not found for item ${detail.itemId} batch ${batchNumber}`);
                }
                const inventoryBatch = await tx.inventoryBatch.upsert({
                    where: {
                        itemId_batchNumber: {
                            itemId: detail.item.id,
                            batchNumber,
                        },
                    },
                    update: {
                        expiryDate: source?.expiryDate ?? batch.expiredDate ?? undefined,
                        deletedAt: null,
                        deletedBy: null,
                        updatedBy: auditActor ?? null,
                    },
                    create: {
                        itemId: detail.item.id,
                        batchNumber,
                        expiryDate: source?.expiryDate ?? batch.expiredDate ?? null,
                        createdBy: auditActor ?? null,
                        updatedBy: auditActor ?? null,
                    },
                    select: { id: true },
                });
                const qtyPcs = Number(batch.qtyPcs ?? 0);
                const qtyKg = Number(batch.qtyKg ?? 0);
                await tx.inventoryLedger.create({
                    data: {
                        transactionDate: outbound.doDate ?? now,
                        itemId: detail.item.id,
                        warehouseId,
                        batchId: inventoryBatch.id,
                        transactionType: 'OUTBOUND',
                        referenceDocType: 'OUTBOUND',
                        referenceDocId: String(outbound.id),
                        referenceNumber: outbound.doNumber,
                        quantityPcs: -Math.abs(Number.isFinite(qtyPcs) ? qtyPcs : 0),
                        quantityKg: -Math.abs(Number.isFinite(qtyKg) ? qtyKg : 0),
                        uomId: detail.item.uom.id,
                        unitCost: null,
                        totalValue: 0,
                        userId: actorUserId ?? null,
                        notes: batch.notes ?? null,
                        createdBy: auditActor ?? null,
                        updatedBy: auditActor ?? null,
                    },
                });
            }
        }
    }
    async resolveActorUserId(tx, actorId) {
        const parsedActorId = this.parseOptionalActorUserId(actorId);
        if (!parsedActorId) {
            return undefined;
        }
        const actor = await tx.user.findFirst({
            where: {
                id: parsedActorId,
                deletedAt: null,
            },
            select: { id: true },
        });
        return actor?.id;
    }
    async ensureBatchAvailability(details, tx, excludeDoId) {
        const requestedByPair = new Map();
        const pairLabelByKey = new Map();
        const itemIds = new Set();
        const batchNumbers = new Set();
        details.forEach((detail) => {
            const itemId = detail.itemId;
            const batchNumber = String(detail.batchNumber ?? '').trim();
            const qty = Number(detail.qtyPcs ?? 0);
            const qtyPcs = Number.isFinite(qty) ? qty : 0;
            const key = `${String(itemId)}::${batchNumber.toLowerCase()}`;
            requestedByPair.set(key, (requestedByPair.get(key) ?? 0) + qtyPcs);
            if (!pairLabelByKey.has(key)) {
                pairLabelByKey.set(key, { itemId, batchNumber });
            }
            itemIds.add(itemId);
            batchNumbers.add(batchNumber);
        });
        if (pairLabelByKey.size === 0) {
            return;
        }
        const normalizedExcludeDoId = excludeDoId;
        const [inboundRows, usedRows] = await Promise.all([
            tx.inboundDetailBatch.findMany({
                where: {
                    deletedAt: null,
                    batchIn: { in: [...batchNumbers] },
                    inboundDetail: {
                        deletedAt: null,
                        itemId: { in: [...itemIds] },
                        inbound: {
                            deletedAt: null,
                            status: 'POSTED',
                        },
                    },
                },
                select: {
                    batchIn: true,
                    qty: true,
                    inboundDetail: {
                        select: {
                            itemId: true,
                        },
                    },
                },
            }),
            tx.outboundDetailBatch.findMany({
                where: {
                    deletedAt: null,
                    batchOut: { in: [...batchNumbers] },
                    outboundDetail: {
                        deletedAt: null,
                        itemId: { in: [...itemIds] },
                        deliveryOrder: {
                            deletedAt: null,
                            id: normalizedExcludeDoId ? { not: normalizedExcludeDoId } : undefined,
                        },
                    },
                },
                select: {
                    batchOut: true,
                    qtyPcs: true,
                    outboundDetail: {
                        select: {
                            itemId: true,
                        },
                    },
                },
            }),
        ]);
        const inboundByPair = new Map();
        inboundRows.forEach((row) => {
            const itemId = String(row.inboundDetail?.itemId ?? '').trim();
            const batchNumber = String(row.batchIn ?? '').trim();
            if (!itemId || !batchNumber) {
                return;
            }
            const key = `${itemId}::${batchNumber.toLowerCase()}`;
            const qty = Number(row.qty ?? 0);
            inboundByPair.set(key, (inboundByPair.get(key) ?? 0) + (Number.isFinite(qty) ? qty : 0));
        });
        const usedByPair = new Map();
        usedRows.forEach((row) => {
            const itemId = String(row.outboundDetail?.itemId ?? '').trim();
            const batchNumber = String(row.batchOut ?? '').trim();
            if (!itemId || !batchNumber) {
                return;
            }
            const key = `${itemId}::${batchNumber.toLowerCase()}`;
            const qty = Number(row.qtyPcs ?? 0);
            usedByPair.set(key, (usedByPair.get(key) ?? 0) + (Number.isFinite(qty) ? qty : 0));
        });
        requestedByPair.forEach((requestedQty, key) => {
            const pair = pairLabelByKey.get(key);
            if (!pair) {
                return;
            }
            const inboundQty = inboundByPair.get(key) ?? 0;
            const usedQty = usedByPair.get(key) ?? 0;
            const availableQty = Math.max(inboundQty - usedQty, 0);
            if (requestedQty > availableQty) {
                throw new common_1.BadRequestException(`Insufficient stock for item ${pair.itemId} batch ${pair.batchNumber}. Remaining ${availableQty.toLocaleString('en-US')} pcs, requested ${requestedQty.toLocaleString('en-US')} pcs.`);
            }
        });
    }
    parseId(value, label) {
        if (typeof value === 'number') {
            if (Number.isInteger(value) && value > 0) {
                return value;
            }
            throw new common_1.BadRequestException(`${label} must be a valid integer`);
        }
        const normalized = String(value ?? '').trim();
        if (!normalized) {
            throw new common_1.BadRequestException(`${label} is required`);
        }
        const parsed = Number(normalized);
        if (!Number.isInteger(parsed) || parsed <= 0) {
            throw new common_1.BadRequestException(`${label} must be a valid integer`);
        }
        return parsed;
    }
    parseOptionalId(value, label) {
        if (typeof value === 'undefined' || value === null) {
            return undefined;
        }
        if (typeof value === 'string' && !value.trim()) {
            return undefined;
        }
        return this.parseId(value, label);
    }
    parseOptionalActorUserId(actorId) {
        if (typeof actorId === 'undefined' || actorId === null) {
            return undefined;
        }
        const normalized = String(actorId).trim();
        if (!normalized) {
            return undefined;
        }
        const parsed = Number(normalized);
        if (!Number.isInteger(parsed) || parsed <= 0) {
            return undefined;
        }
        return parsed;
    }
    normalizeAuditActor(actorId) {
        const normalized = (0, audit_user_util_1.toAuditUserId)(actorId);
        return normalized ?? undefined;
    }
};
exports.OutboundService = OutboundService;
exports.OutboundService = OutboundService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OutboundService);
//# sourceMappingURL=outbound.service.js.map