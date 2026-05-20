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
exports.ErpBranchesService = void 0;
const common_1 = require("@nestjs/common");
const duplicate_util_1 = require("../common/errors/duplicate.util");
const prisma_service_1 = require("../prisma/prisma.service");
let ErpBranchesService = class ErpBranchesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, actorId) {
        const existing = await this.prisma.erpBranch.findFirst({
            where: { code: dto.code },
            select: { id: true, deletedAt: true },
        });
        if (existing) {
            (0, duplicate_util_1.throwDuplicate)({
                fieldLabel: 'Branch code',
                value: dto.code,
                isSoftDeleted: Boolean(existing.deletedAt),
            });
        }
        const actorBigInt = actorId ? BigInt(actorId) : null;
        let created;
        try {
            created = await this.prisma.erpBranch.create({
                data: {
                    code: dto.code,
                    name: dto.name,
                    addressLine1: dto.addressLine1,
                    addressLine2: dto.addressLine2,
                    city: dto.city,
                    postalCode: dto.postalCode,
                    phone: dto.phone,
                    fax: dto.fax,
                    notes: dto.notes,
                    isActive: dto.isActive ?? true,
                    createdById: actorBigInt,
                    updatedById: actorBigInt,
                },
            });
        }
        catch (error) {
            if ((0, duplicate_util_1.isUniqueViolation)(error, ['code', 'md_branches_code_key'])) {
                (0, duplicate_util_1.throwDuplicate)({ fieldLabel: 'Branch code', value: dto.code });
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
                { city: { contains: q, mode: 'insensitive' } },
            ];
        }
        if (query.isActive !== undefined) {
            where.isActive = query.isActive;
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.erpBranch.findMany({
                where,
                orderBy: [{ createdAt: 'desc' }],
                skip,
                take: limit,
            }),
            this.prisma.erpBranch.count({ where }),
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
        const item = await this.prisma.erpBranch.findFirst({
            where: { id, deletedAt: null },
        });
        if (!item) {
            throw new common_1.NotFoundException('ERP Branch not found');
        }
        return { success: true, data: item };
    }
    async update(id, dto, actorId) {
        const existing = await this.prisma.erpBranch.findFirst({
            where: { id, deletedAt: null },
        });
        if (!existing) {
            throw new common_1.NotFoundException('ERP Branch not found');
        }
        if (dto.code && dto.code !== existing.code) {
            const duplicate = await this.prisma.erpBranch.findFirst({
                where: { code: dto.code, NOT: { id } },
                select: { id: true, deletedAt: true },
            });
            if (duplicate) {
                (0, duplicate_util_1.throwDuplicate)({
                    fieldLabel: 'Branch code',
                    value: dto.code,
                    isSoftDeleted: Boolean(duplicate.deletedAt),
                });
            }
        }
        const actorBigInt = actorId ? BigInt(actorId) : null;
        let updated;
        try {
            updated = await this.prisma.erpBranch.update({
                where: { id },
                data: {
                    code: dto.code,
                    name: dto.name,
                    addressLine1: dto.addressLine1,
                    addressLine2: dto.addressLine2,
                    city: dto.city,
                    postalCode: dto.postalCode,
                    phone: dto.phone,
                    fax: dto.fax,
                    notes: dto.notes,
                    isActive: dto.isActive,
                    updatedById: actorBigInt,
                },
            });
        }
        catch (error) {
            if ((0, duplicate_util_1.isUniqueViolation)(error, ['code', 'md_branches_code_key'])) {
                (0, duplicate_util_1.throwDuplicate)({ fieldLabel: 'Branch code', value: dto.code ?? existing.code });
            }
            throw error;
        }
        return { success: true, data: updated };
    }
    async remove(id, actorId) {
        const existing = await this.prisma.erpBranch.findFirst({
            where: { id, deletedAt: null },
            select: { id: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('ERP Branch not found');
        }
        const actorBigInt = actorId ? BigInt(actorId) : null;
        await this.prisma.erpBranch.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                updatedById: actorBigInt,
            },
        });
        return { success: true, message: 'ERP Branch deleted' };
    }
};
exports.ErpBranchesService = ErpBranchesService;
exports.ErpBranchesService = ErpBranchesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ErpBranchesService);
//# sourceMappingURL=erp-branches.service.js.map