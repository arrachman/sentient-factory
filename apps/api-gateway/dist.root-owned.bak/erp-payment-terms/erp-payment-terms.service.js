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
exports.ErpPaymentTermsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const duplicate_util_1 = require("../common/errors/duplicate.util");
const prisma_service_1 = require("../prisma/prisma.service");
const audit_user_util_1 = require("../common/utils/audit-user.util");
let ErpPaymentTermsService = class ErpPaymentTermsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, actorId) {
        const existing = await this.prisma.erpPaymentTerm.findFirst({
            where: { code: dto.code },
            select: { id: true, deletedAt: true },
        });
        if (existing) {
            (0, duplicate_util_1.throwDuplicate)({
                fieldLabel: 'Payment term code',
                value: dto.code,
                isSoftDeleted: Boolean(existing.deletedAt),
            });
        }
        let created;
        try {
            created = await this.prisma.erpPaymentTerm.create({
                data: {
                    code: dto.code,
                    name: dto.name,
                    netDays: dto.netDays,
                    discountDays1: dto.discountDays1,
                    discountPercent1: dto.discountPercent1 ? new client_1.Prisma.Decimal(dto.discountPercent1) : null,
                    discountDays2: dto.discountDays2,
                    discountPercent2: dto.discountPercent2 ? new client_1.Prisma.Decimal(dto.discountPercent2) : null,
                    penaltyPercent: dto.penaltyPercent ? new client_1.Prisma.Decimal(dto.penaltyPercent) : null,
                    penaltyPeriod: dto.penaltyPeriod,
                    isActive: dto.isActive ?? true,
                    createdById: (0, audit_user_util_1.toAuditUserId)(actorId),
                    updatedById: (0, audit_user_util_1.toAuditUserId)(actorId),
                },
            });
        }
        catch (error) {
            if ((0, duplicate_util_1.isUniqueViolation)(error, ['code'])) {
                (0, duplicate_util_1.throwDuplicate)({ fieldLabel: 'Payment term code', value: dto.code });
            }
            throw error;
        }
        return { success: true, data: created };
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;
        const where = { deletedAt: null };
        if (query.search?.trim()) {
            const q = query.search.trim();
            where.OR = [
                { code: { contains: q, mode: 'insensitive' } },
                { name: { contains: q, mode: 'insensitive' } },
            ];
        }
        if (query.isActive !== undefined) {
            where.isActive = query.isActive;
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.erpPaymentTerm.findMany({
                where,
                orderBy: [{ createdAt: 'desc' }],
                skip,
                take: limit,
            }),
            this.prisma.erpPaymentTerm.count({ where }),
        ]);
        return {
            success: true,
            data: items,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit) || 1,
            },
        };
    }
    async findOne(id) {
        const item = await this.prisma.erpPaymentTerm.findFirst({
            where: { id, deletedAt: null },
        });
        if (!item) {
            throw new common_1.NotFoundException('Payment term not found');
        }
        return { success: true, data: item };
    }
    async update(id, dto, actorId) {
        const existing = await this.prisma.erpPaymentTerm.findFirst({
            where: { id, deletedAt: null },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Payment term not found');
        }
        if (dto.code && dto.code !== existing.code) {
            const duplicate = await this.prisma.erpPaymentTerm.findFirst({
                where: { code: dto.code, NOT: { id } },
                select: { id: true, deletedAt: true },
            });
            if (duplicate) {
                (0, duplicate_util_1.throwDuplicate)({
                    fieldLabel: 'Payment term code',
                    value: dto.code,
                    isSoftDeleted: Boolean(duplicate.deletedAt),
                });
            }
        }
        let updated;
        try {
            updated = await this.prisma.erpPaymentTerm.update({
                where: { id },
                data: {
                    code: dto.code,
                    name: dto.name,
                    netDays: dto.netDays,
                    discountDays1: dto.discountDays1,
                    discountPercent1: dto.discountPercent1 !== undefined
                        ? (dto.discountPercent1 ? new client_1.Prisma.Decimal(dto.discountPercent1) : null)
                        : undefined,
                    discountDays2: dto.discountDays2,
                    discountPercent2: dto.discountPercent2 !== undefined
                        ? (dto.discountPercent2 ? new client_1.Prisma.Decimal(dto.discountPercent2) : null)
                        : undefined,
                    penaltyPercent: dto.penaltyPercent !== undefined
                        ? (dto.penaltyPercent ? new client_1.Prisma.Decimal(dto.penaltyPercent) : null)
                        : undefined,
                    penaltyPeriod: dto.penaltyPeriod,
                    isActive: dto.isActive,
                    updatedById: (0, audit_user_util_1.toAuditUserId)(actorId),
                },
            });
        }
        catch (error) {
            if ((0, duplicate_util_1.isUniqueViolation)(error, ['code'])) {
                (0, duplicate_util_1.throwDuplicate)({ fieldLabel: 'Payment term code', value: dto.code ?? existing.code });
            }
            throw error;
        }
        return { success: true, data: updated };
    }
    async remove(id, actorId) {
        const existing = await this.prisma.erpPaymentTerm.findFirst({
            where: { id, deletedAt: null },
            select: { id: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Payment term not found');
        }
        await this.prisma.erpPaymentTerm.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                updatedById: (0, audit_user_util_1.toAuditUserId)(actorId),
            },
        });
        return { success: true, message: 'Payment term deleted' };
    }
};
exports.ErpPaymentTermsService = ErpPaymentTermsService;
exports.ErpPaymentTermsService = ErpPaymentTermsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ErpPaymentTermsService);
//# sourceMappingURL=erp-payment-terms.service.js.map