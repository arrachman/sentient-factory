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
const outbound_helpers_1 = require("./outbound-helpers");
const outbound_batch_service_1 = require("./outbound-batch.service");
const outbound_inventory_service_1 = require("./outbound-inventory.service");
const outbound_query_service_1 = require("./outbound-query.service");
const outbound_stock_report_service_1 = require("./outbound-stock-report.service");
const outbound_validators_service_1 = require("./outbound-validators.service");
let OutboundService = class OutboundService {
    prisma;
    batchService;
    inventoryService;
    stockReportService;
    validators;
    queryService;
    constructor(prisma, batchService, inventoryService, stockReportService, validators, queryService) {
        this.prisma = prisma;
        this.batchService = batchService;
        this.inventoryService = inventoryService;
        this.stockReportService = stockReportService;
        this.validators = validators;
        this.queryService = queryService;
    }
    async getBatchOptions(itemId, excludeDoId, warehouseId, actorId) {
        return this.batchService.getBatchOptions(itemId, excludeDoId, warehouseId, actorId);
    }
    async findMonitoringReport(query, actorId) {
        return this.batchService.findMonitoringReport(query, actorId);
    }
    async findStockBatchReport(query) {
        return this.stockReportService.findStockBatchReport(query);
    }
    async findStockMutationReport(query) {
        return this.stockReportService.findStockMutationReport(query);
    }
    async findAll(query, actorId) {
        return this.queryService.findAll(query, actorId);
    }
    async findOne(id, actorId) {
        return this.queryService.findOne(id, actorId);
    }
    async create(dto, actorId) {
        const auditActor = (0, outbound_helpers_1.normalizeAuditActor)(actorId);
        const doNumber = (0, outbound_helpers_1.normalizeRequiredDoNumber)(dto.doNumber);
        await this.validators.ensureDoNumberAvailable(doNumber);
        const customerId = (0, outbound_helpers_1.parseId)(dto.customerId, 'customerId');
        const warehouseId = await this.validators.resolveInputWarehouseForActor(actorId, dto.warehouseId);
        const customer = await this.validators.ensureCustomerExists(customerId);
        await this.validators.ensureWarehouseExists(warehouseId);
        const defaults = await this.validators.resolveDefaultsFromCustomerCity(customer.city ?? undefined);
        const requestedDestinationCityId = (0, outbound_helpers_1.parseOptionalId)(dto.destinationCityId, 'destinationCityId');
        const resolvedDestinationCityId = requestedDestinationCityId ?? defaults.destinationCityId ?? null;
        if (resolvedDestinationCityId !== null) {
            await this.validators.ensureCityExists(resolvedDestinationCityId);
        }
        const resolvedSla = resolvedDestinationCityId
            ? await this.validators.findCitySlaByCityId(resolvedDestinationCityId)
            : null;
        const resolvedStdLeadTimeDays = dto.stdLeadTimeDays ?? resolvedSla?.stdLeadTimeDays ?? 0;
        const resolvedStdReturnDoDays = dto.stdReturnDoDays ?? resolvedSla?.stdReturnDoDays ?? 0;
        const detailPayload = (0, outbound_helpers_1.normalizeAndValidateDetails)(dto.details);
        const itemMap = await this.validators.getActiveItems(detailPayload.map((d) => d.itemId));
        let created;
        try {
            created = await this.prisma.$transaction(async (tx) => {
                await this.inventoryService.ensureBatchAvailability(detailPayload, tx, undefined, warehouseId);
                const header = await tx.deliveryOrder.create({
                    data: {
                        doNumber,
                        doDate: new Date(dto.doDate),
                        doReceivedDate: new Date(dto.doReceivedDate),
                        customerId,
                        warehouseId,
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
                await this.writeDetailRows(tx, header.id, detailPayload, itemMap, auditActor);
                await this.inventoryService.syncOutboundInventoryLedger(tx, header.id, actorId);
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
        return this.findOne(created.id, actorId);
    }
    async update(id, dto, actorId) {
        const auditActor = (0, outbound_helpers_1.normalizeAuditActor)(actorId);
        const scopedWarehouseId = await this.validators.resolveWarehouseFilterForActor(actorId);
        const existing = await this.prisma.deliveryOrder.findFirst({
            where: {
                id,
                deletedAt: null,
                warehouseId: typeof scopedWarehouseId === 'number' ? scopedWarehouseId : undefined,
            },
            select: { id: true, doNumber: true, warehouseId: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('outbound not found');
        }
        if (typeof dto.doNumber !== 'undefined') {
            const normalizedDoNumber = (0, outbound_helpers_1.normalizeRequiredDoNumber)(dto.doNumber);
            dto.doNumber = normalizedDoNumber;
            if (normalizedDoNumber !== existing.doNumber) {
                await this.validators.ensureDoNumberAvailable(normalizedDoNumber, id);
            }
        }
        if (dto.customerId) {
            const customerId = (0, outbound_helpers_1.parseId)(dto.customerId, 'customerId');
            dto.customerId = String(customerId);
            await this.validators.ensureCustomerExists(customerId);
        }
        const effectiveWarehouseId = await this.validators.resolveInputWarehouseForActor(actorId, dto.warehouseId, existing.warehouseId ?? undefined);
        await this.validators.ensureWarehouseExists(effectiveWarehouseId);
        if (typeof dto.destinationCityId !== 'undefined') {
            const destinationCityId = (0, outbound_helpers_1.parseOptionalId)(dto.destinationCityId, 'destinationCityId');
            if (destinationCityId !== undefined) {
                await this.validators.ensureCityExists(destinationCityId);
            }
            dto.destinationCityId =
                typeof destinationCityId === 'number' ? String(destinationCityId) : undefined;
        }
        const detailsProvided = Array.isArray(dto.details);
        let detailPayload = [];
        let itemMap = new Map();
        if (detailsProvided) {
            detailPayload = (0, outbound_helpers_1.normalizeAndValidateDetails)(dto.details);
            itemMap = await this.validators.getActiveItems(detailPayload.map((d) => d.itemId));
        }
        try {
            await this.prisma.$transaction(async (tx) => {
                if (detailsProvided) {
                    await this.inventoryService.ensureBatchAvailability(detailPayload, tx, id, effectiveWarehouseId);
                }
                await tx.deliveryOrder.update({
                    where: { id },
                    data: {
                        doNumber: dto.doNumber,
                        doDate: dto.doDate ? new Date(dto.doDate) : undefined,
                        doReceivedDate: dto.doReceivedDate ? new Date(dto.doReceivedDate) : undefined,
                        customerId: dto.customerId ? (0, outbound_helpers_1.parseId)(dto.customerId, 'customerId') : undefined,
                        warehouseId: effectiveWarehouseId,
                        destinationCityId: typeof dto.destinationCityId !== 'undefined'
                            ? dto.destinationCityId
                                ? (0, outbound_helpers_1.parseId)(dto.destinationCityId, 'destinationCityId')
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
                    await this.writeDetailRows(tx, id, detailPayload, itemMap, auditActor);
                }
                await this.inventoryService.syncOutboundInventoryLedger(tx, id, actorId);
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
        return this.findOne(id, actorId);
    }
    async remove(id, actorId) {
        const auditActor = (0, outbound_helpers_1.normalizeAuditActor)(actorId);
        const scopedWarehouseId = await this.validators.resolveWarehouseFilterForActor(actorId);
        const existing = await this.prisma.deliveryOrder.findFirst({
            where: {
                id,
                deletedAt: null,
                warehouseId: typeof scopedWarehouseId === 'number' ? scopedWarehouseId : undefined,
            },
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
            await this.inventoryService.syncOutboundInventoryLedger(tx, id, actorId);
        });
        return { success: true, message: 'outbound deleted' };
    }
    async writeDetailRows(tx, doId, details, itemMap, auditActor) {
        for (let index = 0; index < details.length; index += 1) {
            const detail = details[index];
            const item = itemMap.get(detail.itemId);
            const createdDetail = await tx.deliveryOrderDetail.create({
                data: {
                    doId,
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
};
exports.OutboundService = OutboundService;
exports.OutboundService = OutboundService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        outbound_batch_service_1.OutboundBatchService,
        outbound_inventory_service_1.OutboundInventoryService,
        outbound_stock_report_service_1.OutboundStockReportService,
        outbound_validators_service_1.OutboundValidatorsService,
        outbound_query_service_1.OutboundQueryService])
], OutboundService);
//# sourceMappingURL=outbound.service.js.map