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
exports.ErpFiscalPeriodsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const audit_user_util_1 = require("../common/utils/audit-user.util");
const prisma_service_1 = require("../prisma/prisma.service");
let ErpFiscalPeriodsService = class ErpFiscalPeriodsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, actorId) {
        const existing = await this.prisma.erpFiscalPeriod.findFirst({
            where: { year: dto.year, periodNo: dto.periodNo },
            select: { id: true, deletedAt: true },
        });
        if (existing) {
            if (existing.deletedAt) {
                throw new common_1.BadRequestException(`Fiscal period ${dto.year}/${dto.periodNo} already exists (soft-deleted).`);
            }
            throw new common_1.BadRequestException(`Fiscal period ${dto.year}/${dto.periodNo} already exists`);
        }
        const actorBigInt = (0, audit_user_util_1.toAuditUserId)(actorId) ? BigInt((0, audit_user_util_1.toAuditUserId)(actorId)) : undefined;
        const created = await this.prisma.erpFiscalPeriod.create({
            data: {
                year: dto.year,
                periodNo: dto.periodNo,
                name: dto.name,
                startDate: dto.startDate,
                endDate: dto.endDate,
                status: dto.status ?? client_1.ErpFiscalPeriodStatus.OPEN,
                createdById: actorBigInt,
                updatedById: actorBigInt,
            },
        });
        return { success: true, data: created };
    }
    async findAll(query) {
        const where = { deletedAt: null };
        if (query.year)
            where.year = query.year;
        if (query.status)
            where.status = query.status;
        const items = await this.prisma.erpFiscalPeriod.findMany({
            where,
            orderBy: [{ year: 'desc' }, { periodNo: 'asc' }],
        });
        return { success: true, data: items };
    }
    async findOne(id) {
        const item = await this.prisma.erpFiscalPeriod.findFirst({
            where: { id, deletedAt: null },
        });
        if (!item)
            throw new common_1.NotFoundException('Fiscal period not found');
        return { success: true, data: item };
    }
    async update(id, dto, actorId) {
        const existing = await this.prisma.erpFiscalPeriod.findFirst({
            where: { id, deletedAt: null },
        });
        if (!existing)
            throw new common_1.NotFoundException('Fiscal period not found');
        if ((dto.year !== undefined && dto.year !== existing.year) ||
            (dto.periodNo !== undefined && dto.periodNo !== existing.periodNo)) {
            const newYear = dto.year ?? existing.year;
            const newPeriodNo = dto.periodNo ?? existing.periodNo;
            const duplicate = await this.prisma.erpFiscalPeriod.findFirst({
                where: { year: newYear, periodNo: newPeriodNo, NOT: { id } },
                select: { id: true },
            });
            if (duplicate) {
                throw new common_1.BadRequestException(`Fiscal period ${newYear}/${newPeriodNo} already exists`);
            }
        }
        const actorBigInt = (0, audit_user_util_1.toAuditUserId)(actorId) ? BigInt((0, audit_user_util_1.toAuditUserId)(actorId)) : undefined;
        const updated = await this.prisma.erpFiscalPeriod.update({
            where: { id },
            data: {
                year: dto.year,
                periodNo: dto.periodNo,
                name: dto.name,
                startDate: dto.startDate,
                endDate: dto.endDate,
                status: dto.status,
                updatedById: actorBigInt,
            },
        });
        return { success: true, data: updated };
    }
    async remove(id, actorId) {
        const existing = await this.prisma.erpFiscalPeriod.findFirst({
            where: { id, deletedAt: null },
            select: { id: true },
        });
        if (!existing)
            throw new common_1.NotFoundException('Fiscal period not found');
        const actorBigInt = (0, audit_user_util_1.toAuditUserId)(actorId) ? BigInt((0, audit_user_util_1.toAuditUserId)(actorId)) : undefined;
        await this.prisma.erpFiscalPeriod.update({
            where: { id },
            data: { deletedAt: new Date(), updatedById: actorBigInt },
        });
        return { success: true, message: 'Fiscal period deleted' };
    }
    async openPeriod(id, actorId) {
        const existing = await this.prisma.erpFiscalPeriod.findFirst({
            where: { id, deletedAt: null },
        });
        if (!existing)
            throw new common_1.NotFoundException('Fiscal period not found');
        const allowedFromStatuses = [
            client_1.ErpFiscalPeriodStatus.SOFT_CLOSED,
            client_1.ErpFiscalPeriodStatus.CLOSED,
        ];
        if (!allowedFromStatuses.includes(existing.status)) {
            throw new common_1.BadRequestException(`Cannot open period with current status "${existing.status}". Must be SOFT_CLOSED or CLOSED.`);
        }
        const actorBigInt = (0, audit_user_util_1.toAuditUserId)(actorId) ? BigInt((0, audit_user_util_1.toAuditUserId)(actorId)) : undefined;
        const updated = await this.prisma.erpFiscalPeriod.update({
            where: { id },
            data: {
                status: client_1.ErpFiscalPeriodStatus.REOPENED,
                reopenedAt: new Date(),
                reopenedById: actorBigInt,
                updatedById: actorBigInt,
            },
        });
        return { success: true, data: updated };
    }
    async closePeriod(id, actorId) {
        const existing = await this.prisma.erpFiscalPeriod.findFirst({
            where: { id, deletedAt: null },
        });
        if (!existing)
            throw new common_1.NotFoundException('Fiscal period not found');
        const closeableStatuses = [
            client_1.ErpFiscalPeriodStatus.OPEN,
            client_1.ErpFiscalPeriodStatus.SOFT_CLOSED,
            client_1.ErpFiscalPeriodStatus.REOPENED,
        ];
        if (!closeableStatuses.includes(existing.status)) {
            throw new common_1.BadRequestException(`Cannot close period with current status "${existing.status}".`);
        }
        const actorBigInt = (0, audit_user_util_1.toAuditUserId)(actorId) ? BigInt((0, audit_user_util_1.toAuditUserId)(actorId)) : undefined;
        const updated = await this.prisma.erpFiscalPeriod.update({
            where: { id },
            data: {
                status: client_1.ErpFiscalPeriodStatus.CLOSED,
                closedAt: new Date(),
                closedById: actorBigInt,
                updatedById: actorBigInt,
            },
        });
        return { success: true, data: updated };
    }
};
exports.ErpFiscalPeriodsService = ErpFiscalPeriodsService;
exports.ErpFiscalPeriodsService = ErpFiscalPeriodsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ErpFiscalPeriodsService);
//# sourceMappingURL=erp-fiscal-periods.service.js.map