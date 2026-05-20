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
exports.MasterDataRolesService = void 0;
const common_1 = require("@nestjs/common");
const duplicate_util_1 = require("../common/errors/duplicate.util");
const audit_user_util_1 = require("../common/utils/audit-user.util");
const prisma_service_1 = require("../prisma/prisma.service");
const role_permissions_service_1 = require("./role-permissions.service");
let MasterDataRolesService = class MasterDataRolesService {
    prisma;
    rolePermissionsService;
    constructor(prisma, rolePermissionsService) {
        this.prisma = prisma;
        this.rolePermissionsService = rolePermissionsService;
    }
    async create(dto, actorId) {
        const normalizedName = dto.name.trim();
        const existing = await this.prisma.role.findFirst({
            where: { name: normalizedName },
            select: { id: true, deletedAt: true },
        });
        if (existing) {
            (0, duplicate_util_1.throwDuplicate)({
                fieldLabel: 'Role name',
                value: normalizedName,
                isSoftDeleted: Boolean(existing.deletedAt),
            });
        }
        const created = await this.prisma.role.create({
            data: {
                name: normalizedName,
                description: dto.description?.trim() || null,
                isSystem: dto.isSystem ?? false,
                createdBy: this.toActor(actorId),
                updatedBy: this.toActor(actorId),
            },
        });
        return { success: true, data: created };
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;
        const q = query.search?.trim();
        const includeSystem = query.includeSystem ?? true;
        const where = {
            deletedAt: null,
            ...(includeSystem ? {} : { isSystem: false }),
            ...(q
                ? {
                    OR: [
                        { name: { contains: q, mode: 'insensitive' } },
                        { description: { contains: q, mode: 'insensitive' } },
                    ],
                }
                : {}),
        };
        const [items, total] = await this.prisma.$transaction([
            this.prisma.role.findMany({
                where,
                include: {
                    permissions: {
                        where: { deletedAt: null },
                        select: { permissionId: true },
                    },
                    menus: {
                        where: { deletedAt: null, canView: true },
                        select: { menuId: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.role.count({ where }),
        ]);
        return {
            success: true,
            data: items.map((item) => ({
                ...item,
                permissionCount: item.permissions.length,
                menuCount: item.menus.length,
            })),
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit) || 1,
            },
        };
    }
    async findOne(id) {
        const item = await this.prisma.role.findFirst({
            where: { id, deletedAt: null },
            include: {
                permissions: {
                    where: { deletedAt: null },
                    select: {
                        permission: {
                            select: {
                                id: true,
                                name: true,
                                module: true,
                                action: true,
                            },
                        },
                    },
                },
            },
        });
        if (!item) {
            throw new common_1.NotFoundException('Master data role not found');
        }
        return {
            success: true,
            data: {
                ...item,
                permissions: item.permissions.map((row) => row.permission),
            },
        };
    }
    async update(id, dto, actorId) {
        const existing = await this.prisma.role.findFirst({
            where: { id, deletedAt: null },
            select: { id: true, name: true, isSystem: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Master data role not found');
        }
        const nextName = dto.name?.trim();
        if (nextName && nextName !== existing.name) {
            const duplicate = await this.prisma.role.findFirst({
                where: { name: nextName, NOT: { id } },
                select: { id: true, deletedAt: true },
            });
            if (duplicate) {
                (0, duplicate_util_1.throwDuplicate)({
                    fieldLabel: 'Role name',
                    value: nextName,
                    isSoftDeleted: Boolean(duplicate.deletedAt),
                });
            }
        }
        if (existing.isSystem && dto.isSystem === false) {
            throw new common_1.BadRequestException('System role cannot be downgraded.');
        }
        const updated = await this.prisma.role.update({
            where: { id },
            data: {
                name: nextName,
                description: dto.description?.trim() ?? dto.description,
                isSystem: dto.isSystem,
                updatedBy: this.toActor(actorId),
            },
        });
        return { success: true, data: updated };
    }
    async remove(id, actorId) {
        const existing = await this.prisma.role.findFirst({
            where: { id, deletedAt: null },
            select: { id: true, isSystem: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Master data role not found');
        }
        if (existing.isSystem) {
            throw new common_1.BadRequestException('System role cannot be deleted.');
        }
        const activeUsers = await this.prisma.userRole.count({
            where: { roleId: id, deletedAt: null },
        });
        if (activeUsers > 0) {
            throw new common_1.BadRequestException('Role masih dipakai user. Lepaskan role dari user terlebih dahulu.');
        }
        await this.prisma.$transaction([
            this.prisma.rolePermission.updateMany({
                where: { roleId: id, deletedAt: null },
                data: {
                    deletedAt: new Date(),
                    deletedBy: this.toActor(actorId),
                    updatedBy: this.toActor(actorId),
                },
            }),
            this.prisma.roleMenu.updateMany({
                where: { roleId: id, deletedAt: null },
                data: {
                    deletedAt: new Date(),
                    deletedBy: this.toActor(actorId),
                    updatedBy: this.toActor(actorId),
                },
            }),
            this.prisma.role.update({
                where: { id },
                data: {
                    deletedAt: new Date(),
                    deletedBy: this.toActor(actorId),
                    updatedBy: this.toActor(actorId),
                },
            }),
        ]);
        return { success: true, message: 'Master data role deleted' };
    }
    async getRolePermissions(id) {
        return this.rolePermissionsService.getRolePermissions(id);
    }
    async updateRolePermissions(id, dto, actorId) {
        return this.rolePermissionsService.updateRolePermissions(id, dto, actorId);
    }
    async getRoleMenus(id) {
        return this.rolePermissionsService.getRoleMenus(id);
    }
    async updateRoleMenus(id, dto, actorId) {
        return this.rolePermissionsService.updateRoleMenus(id, dto, actorId);
    }
    toActor(actorId) {
        return (0, audit_user_util_1.toAuditUserId)(actorId);
    }
};
exports.MasterDataRolesService = MasterDataRolesService;
exports.MasterDataRolesService = MasterDataRolesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        role_permissions_service_1.RolePermissionsService])
], MasterDataRolesService);
//# sourceMappingURL=master-data-roles.service.js.map