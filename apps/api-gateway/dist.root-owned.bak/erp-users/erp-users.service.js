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
exports.ErpUsersService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../prisma/prisma.service");
function hashPassword(password) {
    const salt = (0, crypto_1.randomBytes)(16).toString('hex');
    const hash = (0, crypto_1.pbkdf2Sync)(password, salt, 310000, 32, 'sha256').toString('hex');
    return `${salt}:${hash}`;
}
let ErpUsersService = class ErpUsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, actorId) {
        const actorBigInt = actorId ? BigInt(actorId) : null;
        const created = await this.prisma.erpUser.create({
            data: {
                code: dto.username,
                name: dto.fullName,
                email: dto.email ?? null,
                passwordHash: hashPassword(dto.password),
                level: dto.erpLevel,
                isActive: dto.isActive ?? true,
                homeBranchId: dto.branchId ? BigInt(dto.branchId) : null,
                createdById: actorBigInt,
                updatedById: actorBigInt,
            },
        });
        return { success: true, data: created };
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;
        const where = { deletedAt: null };
        if (query.erpLevel !== undefined) {
            where.level = query.erpLevel;
        }
        if (query.isActive !== undefined) {
            where.isActive = query.isActive;
        }
        if (query.search?.trim()) {
            const q = query.search.trim();
            where.OR = [
                { code: { contains: q, mode: 'insensitive' } },
                { name: { contains: q, mode: 'insensitive' } },
                { email: { contains: q, mode: 'insensitive' } },
            ];
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.erpUser.findMany({
                where,
                orderBy: [{ createdAt: 'desc' }],
                skip,
                take: limit,
                select: {
                    id: true,
                    code: true,
                    name: true,
                    email: true,
                    level: true,
                    language: true,
                    isActive: true,
                    homeBranchId: true,
                    expiresAt: true,
                    createdAt: true,
                    updatedAt: true,
                    createdById: true,
                    updatedById: true,
                },
            }),
            this.prisma.erpUser.count({ where }),
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
        const item = await this.prisma.erpUser.findFirst({
            where: { id: id, deletedAt: null },
            select: {
                id: true,
                code: true,
                name: true,
                email: true,
                level: true,
                language: true,
                isActive: true,
                homeBranchId: true,
                defaultMenuId: true,
                homeWarehouseId: true,
                expiresAt: true,
                createdAt: true,
                updatedAt: true,
                createdById: true,
                updatedById: true,
                roles: {
                    select: {
                        role: { select: { id: true, code: true, name: true } },
                    },
                },
            },
        });
        if (!item) {
            throw new common_1.NotFoundException('ERP User not found');
        }
        return { success: true, data: item };
    }
    async update(id, dto, actorId) {
        const existing = await this.prisma.erpUser.findFirst({
            where: { id: id, deletedAt: null },
            select: { id: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('ERP User not found');
        }
        const actorBigInt = actorId ? BigInt(actorId) : null;
        const updateData = {
            updatedById: actorBigInt,
        };
        if (dto.username !== undefined)
            updateData.code = dto.username;
        if (dto.fullName !== undefined)
            updateData.name = dto.fullName;
        if (dto.email !== undefined)
            updateData.email = dto.email;
        if (dto.erpLevel !== undefined)
            updateData.level = dto.erpLevel;
        if (dto.isActive !== undefined)
            updateData.isActive = dto.isActive;
        if (dto.branchId !== undefined)
            updateData.homeBranchId = BigInt(dto.branchId);
        if (dto.password !== undefined)
            updateData.passwordHash = hashPassword(dto.password);
        const updated = await this.prisma.erpUser.update({
            where: { id: id },
            data: updateData,
            select: {
                id: true,
                code: true,
                name: true,
                email: true,
                level: true,
                isActive: true,
                updatedAt: true,
            },
        });
        return { success: true, data: updated };
    }
    async remove(id, actorId) {
        const existing = await this.prisma.erpUser.findFirst({
            where: { id: id, deletedAt: null },
            select: { id: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('ERP User not found');
        }
        const actorBigInt = actorId ? BigInt(actorId) : null;
        await this.prisma.erpUser.update({
            where: { id: id },
            data: {
                deletedAt: new Date(),
                updatedById: actorBigInt,
            },
        });
        return { success: true, message: 'ERP User deleted' };
    }
};
exports.ErpUsersService = ErpUsersService;
exports.ErpUsersService = ErpUsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ErpUsersService);
//# sourceMappingURL=erp-users.service.js.map