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
exports.ErpRolesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ErpRolesService = class ErpRolesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, actorId) {
        const actorBigInt = actorId ? BigInt(actorId) : null;
        const created = await this.prisma.erpRole.create({
            data: {
                code: dto.code,
                name: dto.name,
                description: dto.description ?? null,
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
        if (query.search?.trim()) {
            const q = query.search.trim();
            where.OR = [
                { code: { contains: q, mode: 'insensitive' } },
                { name: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
            ];
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.erpRole.findMany({
                where,
                orderBy: [{ createdAt: 'desc' }],
                skip,
                take: limit,
            }),
            this.prisma.erpRole.count({ where }),
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
        const item = await this.prisma.erpRole.findFirst({
            where: { id: id, deletedAt: null },
        });
        if (!item) {
            throw new common_1.NotFoundException('ERP Role not found');
        }
        return { success: true, data: item };
    }
    async update(id, dto, actorId) {
        const existing = await this.prisma.erpRole.findFirst({
            where: { id: id, deletedAt: null },
            select: { id: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('ERP Role not found');
        }
        const actorBigInt = actorId ? BigInt(actorId) : null;
        const updateData = { updatedById: actorBigInt };
        if (dto.code !== undefined)
            updateData.code = dto.code;
        if (dto.name !== undefined)
            updateData.name = dto.name;
        if (dto.description !== undefined)
            updateData.description = dto.description;
        const updated = await this.prisma.erpRole.update({
            where: { id: id },
            data: updateData,
        });
        return { success: true, data: updated };
    }
    async remove(id, actorId) {
        const existing = await this.prisma.erpRole.findFirst({
            where: { id: id, deletedAt: null },
            select: { id: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('ERP Role not found');
        }
        const actorBigInt = actorId ? BigInt(actorId) : null;
        await this.prisma.erpRole.update({
            where: { id: id },
            data: {
                deletedAt: new Date(),
                updatedById: actorBigInt,
            },
        });
        return { success: true, message: 'ERP Role deleted' };
    }
    async assignPermissions(id, dto, actorId) {
        const role = await this.prisma.erpRole.findFirst({
            where: { id: id, deletedAt: null },
            select: { id: true },
        });
        if (!role) {
            throw new common_1.NotFoundException('ERP Role not found');
        }
        const permissionBigIntIds = dto.permissionIds.map((p) => BigInt(p));
        await this.prisma.$transaction([
            this.prisma.erpRolePermission.deleteMany({
                where: { roleId: id },
            }),
            ...permissionBigIntIds.map((permissionId) => this.prisma.erpRolePermission.create({
                data: { roleId: id, permissionId },
            })),
        ]);
        return { success: true, message: 'Permissions assigned to role' };
    }
    async getPermissions(id) {
        const role = await this.prisma.erpRole.findFirst({
            where: { id: id, deletedAt: null },
            select: { id: true },
        });
        if (!role) {
            throw new common_1.NotFoundException('ERP Role not found');
        }
        const rows = await this.prisma.erpRolePermission.findMany({
            where: { roleId: id },
            include: {
                permission: {
                    select: { id: true, code: true, name: true, group: true, description: true },
                },
            },
        });
        return { success: true, data: rows.map((r) => r.permission) };
    }
    async assignMenus(id, dto, actorId) {
        const role = await this.prisma.erpRole.findFirst({
            where: { id: id, deletedAt: null },
            select: { id: true },
        });
        if (!role) {
            throw new common_1.NotFoundException('ERP Role not found');
        }
        const menuBigIntIds = dto.menuIds.map((m) => BigInt(m));
        await this.prisma.$transaction([
            this.prisma.erpRoleMenu.deleteMany({
                where: { roleId: id },
            }),
            ...menuBigIntIds.map((menuId) => this.prisma.erpRoleMenu.create({
                data: { roleId: id, menuId },
            })),
        ]);
        return { success: true, message: 'Menus assigned to role' };
    }
    async getMenus(id) {
        const role = await this.prisma.erpRole.findFirst({
            where: { id: id, deletedAt: null },
            select: { id: true },
        });
        if (!role) {
            throw new common_1.NotFoundException('ERP Role not found');
        }
        const rows = await this.prisma.erpRoleMenu.findMany({
            where: { roleId: id },
            include: {
                menu: {
                    select: {
                        id: true,
                        code: true,
                        title: true,
                        path: true,
                        icon: true,
                        type: true,
                        sortOrder: true,
                    },
                },
            },
        });
        return {
            success: true,
            data: rows.map((r) => ({
                ...r.menu,
                canView: r.canView,
                canCreate: r.canCreate,
                canEdit: r.canEdit,
                canDelete: r.canDelete,
                canApprove: r.canApprove,
                canPrint: r.canPrint,
                canExport: r.canExport,
                canImport: r.canImport,
                isFavorite: r.isFavorite,
            })),
        };
    }
};
exports.ErpRolesService = ErpRolesService;
exports.ErpRolesService = ErpRolesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ErpRolesService);
//# sourceMappingURL=erp-roles.service.js.map