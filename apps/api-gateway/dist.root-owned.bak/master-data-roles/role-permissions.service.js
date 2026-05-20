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
exports.RolePermissionsService = void 0;
const common_1 = require("@nestjs/common");
const audit_user_util_1 = require("../common/utils/audit-user.util");
const prisma_service_1 = require("../prisma/prisma.service");
let RolePermissionsService = class RolePermissionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getRolePermissions(id) {
        const role = await this.prisma.role.findFirst({
            where: { id, deletedAt: null },
            select: { id: true },
        });
        if (!role) {
            throw new common_1.NotFoundException('Master data role not found');
        }
        const rows = await this.prisma.rolePermission.findMany({
            where: {
                roleId: id,
                deletedAt: null,
                permission: {
                    deletedAt: null,
                },
            },
            select: { permissionId: true },
            orderBy: { permissionId: 'asc' },
        });
        return {
            success: true,
            data: {
                roleId: id,
                permissionIds: rows.map((row) => row.permissionId),
            },
        };
    }
    async updateRolePermissions(id, dto, actorId) {
        const role = await this.prisma.role.findFirst({
            where: { id, deletedAt: null },
            select: { id: true },
        });
        if (!role) {
            throw new common_1.NotFoundException('Master data role not found');
        }
        const nextPermissionIds = Array.from(new Set(dto.permissionIds ?? []));
        if (nextPermissionIds.length > 0) {
            const availablePermissions = await this.prisma.permission.findMany({
                where: { id: { in: nextPermissionIds }, deletedAt: null },
                select: { id: true },
            });
            if (availablePermissions.length !== nextPermissionIds.length) {
                throw new common_1.BadRequestException('One or more permission IDs are invalid.');
            }
        }
        const currentRows = await this.prisma.rolePermission.findMany({
            where: { roleId: id },
            select: { id: true, permissionId: true, deletedAt: true },
        });
        const currentByPermissionId = new Map();
        currentRows.forEach((row) => {
            currentByPermissionId.set(row.permissionId, { id: row.id, deletedAt: row.deletedAt });
        });
        const now = new Date();
        const toActivate = nextPermissionIds.filter((permissionId) => {
            const found = currentByPermissionId.get(permissionId);
            return !found || Boolean(found.deletedAt);
        });
        const toDeactivate = currentRows
            .filter((row) => !row.deletedAt && !nextPermissionIds.includes(row.permissionId))
            .map((row) => row.permissionId);
        await this.prisma.$transaction(async (tx) => {
            for (const permissionId of toActivate) {
                const existing = currentByPermissionId.get(permissionId);
                if (!existing) {
                    await tx.rolePermission.create({
                        data: {
                            roleId: id,
                            permissionId,
                            createdBy: this.toActor(actorId),
                            updatedBy: this.toActor(actorId),
                        },
                    });
                    continue;
                }
                await tx.rolePermission.update({
                    where: { id: existing.id },
                    data: {
                        deletedAt: null,
                        deletedBy: null,
                        updatedAt: now,
                        updatedBy: this.toActor(actorId),
                    },
                });
            }
            for (const permissionId of toDeactivate) {
                const existing = currentByPermissionId.get(permissionId);
                if (!existing) {
                    continue;
                }
                await tx.rolePermission.update({
                    where: { id: existing.id },
                    data: {
                        deletedAt: now,
                        deletedBy: this.toActor(actorId),
                        updatedBy: this.toActor(actorId),
                    },
                });
            }
        });
        return this.getRolePermissions(id);
    }
    async getRoleMenus(id) {
        const role = await this.prisma.role.findFirst({
            where: { id, deletedAt: null },
            select: { id: true },
        });
        if (!role) {
            throw new common_1.NotFoundException('Master data role not found');
        }
        const rows = await this.prisma.roleMenu.findMany({
            where: {
                roleId: id,
                deletedAt: null,
                menu: {
                    deletedAt: null,
                },
            },
            select: { menuId: true },
            orderBy: { menuId: 'asc' },
        });
        return {
            success: true,
            data: {
                roleId: id,
                menuIds: rows.map((row) => row.menuId),
            },
        };
    }
    async updateRoleMenus(id, dto, actorId) {
        const role = await this.prisma.role.findFirst({
            where: { id, deletedAt: null },
            select: { id: true },
        });
        if (!role) {
            throw new common_1.NotFoundException('Master data role not found');
        }
        const nextMenuIds = Array.from(new Set(dto.menuIds ?? []));
        if (nextMenuIds.length > 0) {
            const availableMenus = await this.prisma.menu.findMany({
                where: { id: { in: nextMenuIds }, deletedAt: null },
                select: { id: true },
            });
            if (availableMenus.length !== nextMenuIds.length) {
                throw new common_1.BadRequestException('One or more menu IDs are invalid.');
            }
        }
        const currentRows = await this.prisma.roleMenu.findMany({
            where: { roleId: id },
            select: { id: true, menuId: true, deletedAt: true },
        });
        const currentByMenuId = new Map();
        currentRows.forEach((row) => {
            currentByMenuId.set(row.menuId, { id: row.id, deletedAt: row.deletedAt });
        });
        const now = new Date();
        const toActivate = nextMenuIds.filter((menuId) => {
            const found = currentByMenuId.get(menuId);
            return !found || Boolean(found.deletedAt);
        });
        const toDeactivate = currentRows
            .filter((row) => !row.deletedAt && !nextMenuIds.includes(row.menuId))
            .map((row) => row.menuId);
        await this.prisma.$transaction(async (tx) => {
            for (const menuId of toActivate) {
                const existing = currentByMenuId.get(menuId);
                if (!existing) {
                    await tx.roleMenu.create({
                        data: {
                            roleId: id,
                            menuId,
                            canView: true,
                            createdBy: this.toActor(actorId),
                            updatedBy: this.toActor(actorId),
                        },
                    });
                    continue;
                }
                await tx.roleMenu.update({
                    where: { id: existing.id },
                    data: {
                        canView: true,
                        deletedAt: null,
                        deletedBy: null,
                        updatedAt: now,
                        updatedBy: this.toActor(actorId),
                    },
                });
            }
            for (const menuId of toDeactivate) {
                const existing = currentByMenuId.get(menuId);
                if (!existing) {
                    continue;
                }
                await tx.roleMenu.update({
                    where: { id: existing.id },
                    data: {
                        canView: false,
                        deletedAt: now,
                        deletedBy: this.toActor(actorId),
                        updatedBy: this.toActor(actorId),
                    },
                });
            }
        });
        return this.getRoleMenus(id);
    }
    toActor(actorId) {
        return (0, audit_user_util_1.toAuditUserId)(actorId);
    }
};
exports.RolePermissionsService = RolePermissionsService;
exports.RolePermissionsService = RolePermissionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RolePermissionsService);
//# sourceMappingURL=role-permissions.service.js.map