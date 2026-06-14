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
exports.ErpAccountsService = void 0;
const common_1 = require("@nestjs/common");
const duplicate_util_1 = require("../common/errors/duplicate.util");
const prisma_service_1 = require("../prisma/prisma.service");
const audit_user_util_1 = require("../common/utils/audit-user.util");
let ErpAccountsService = class ErpAccountsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, actorId) {
        const existing = await this.prisma.erpAccount.findFirst({
            where: { code: dto.code },
            select: { id: true, deletedAt: true },
        });
        if (existing) {
            (0, duplicate_util_1.throwDuplicate)({
                fieldLabel: 'Account code',
                value: dto.code,
                isSoftDeleted: Boolean(existing.deletedAt),
            });
        }
        let created;
        try {
            created = await this.prisma.erpAccount.create({
                data: {
                    code: dto.code,
                    name: dto.name,
                    alias: dto.alias,
                    type: dto.accountType,
                    kind: dto.accountKind,
                    normalBalance: dto.normalBalance,
                    cashFlowCategory: dto.cashFlowCategory,
                    parentId: dto.parentId ? BigInt(dto.parentId) : null,
                    currencyId: dto.currencyId ? BigInt(dto.currencyId) : null,
                    level: dto.level ?? 1,
                    isActive: dto.isActive ?? true,
                    isControlAccount: dto.isControlAccount ?? false,
                    bankName: dto.bankName,
                    bankAccountNo: dto.bankAccountNo,
                    notes: dto.notes,
                    createdById: (0, audit_user_util_1.toAuditUserId)(actorId),
                    updatedById: (0, audit_user_util_1.toAuditUserId)(actorId),
                },
            });
        }
        catch (error) {
            if ((0, duplicate_util_1.isUniqueViolation)(error, ['code'])) {
                (0, duplicate_util_1.throwDuplicate)({ fieldLabel: 'Account code', value: dto.code });
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
                { alias: { contains: q, mode: 'insensitive' } },
            ];
        }
        if (query.accountType) {
            where.type = query.accountType;
        }
        if (query.accountKind) {
            where.kind = query.accountKind;
        }
        if (query.parentId !== undefined) {
            where.parentId = query.parentId === 'null' ? null : BigInt(query.parentId);
        }
        if (query.isActive !== undefined) {
            where.isActive = query.isActive;
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.erpAccount.findMany({
                where,
                orderBy: [{ code: 'asc' }],
                skip,
                take: limit,
                include: { parent: { select: { id: true, code: true, name: true } } },
            }),
            this.prisma.erpAccount.count({ where }),
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
        const item = await this.prisma.erpAccount.findFirst({
            where: { id, deletedAt: null },
            include: {
                parent: { select: { id: true, code: true, name: true } },
                children: { where: { deletedAt: null }, select: { id: true, code: true, name: true } },
                currency: { select: { id: true, code: true, name: true, symbol: true } },
            },
        });
        if (!item) {
            throw new common_1.NotFoundException('Account not found');
        }
        return { success: true, data: item };
    }
    async update(id, dto, actorId) {
        const existing = await this.prisma.erpAccount.findFirst({
            where: { id, deletedAt: null },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Account not found');
        }
        if (dto.code && dto.code !== existing.code) {
            const duplicate = await this.prisma.erpAccount.findFirst({
                where: { code: dto.code, NOT: { id } },
                select: { id: true, deletedAt: true },
            });
            if (duplicate) {
                (0, duplicate_util_1.throwDuplicate)({
                    fieldLabel: 'Account code',
                    value: dto.code,
                    isSoftDeleted: Boolean(duplicate.deletedAt),
                });
            }
        }
        let updated;
        try {
            updated = await this.prisma.erpAccount.update({
                where: { id },
                data: {
                    code: dto.code,
                    name: dto.name,
                    alias: dto.alias,
                    type: dto.accountType,
                    kind: dto.accountKind,
                    normalBalance: dto.normalBalance,
                    cashFlowCategory: dto.cashFlowCategory,
                    parentId: dto.parentId !== undefined ? (dto.parentId ? BigInt(dto.parentId) : null) : undefined,
                    currencyId: dto.currencyId !== undefined ? (dto.currencyId ? BigInt(dto.currencyId) : null) : undefined,
                    level: dto.level,
                    isActive: dto.isActive,
                    isControlAccount: dto.isControlAccount,
                    bankName: dto.bankName,
                    bankAccountNo: dto.bankAccountNo,
                    notes: dto.notes,
                    updatedById: (0, audit_user_util_1.toAuditUserId)(actorId),
                },
            });
        }
        catch (error) {
            if ((0, duplicate_util_1.isUniqueViolation)(error, ['code'])) {
                (0, duplicate_util_1.throwDuplicate)({ fieldLabel: 'Account code', value: dto.code ?? existing.code });
            }
            throw error;
        }
        return { success: true, data: updated };
    }
    async remove(id, actorId) {
        const existing = await this.prisma.erpAccount.findFirst({
            where: { id, deletedAt: null },
            select: { id: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Account not found');
        }
        await this.prisma.erpAccount.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                updatedById: (0, audit_user_util_1.toAuditUserId)(actorId),
            },
        });
        return { success: true, message: 'Account deleted' };
    }
};
exports.ErpAccountsService = ErpAccountsService;
exports.ErpAccountsService = ErpAccountsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ErpAccountsService);
//# sourceMappingURL=erp-accounts.service.js.map