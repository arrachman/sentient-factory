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
exports.UserWarehouseService = void 0;
const common_1 = require("@nestjs/common");
const audit_user_util_1 = require("../common/utils/audit-user.util");
const prisma_service_1 = require("../prisma/prisma.service");
const user_admin_utils_1 = require("./user-admin.utils");
let UserWarehouseService = class UserWarehouseService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async ensureWarehouseExists(warehouseId) {
        const warehouse = await this.prisma.masterDataWarehouse.findFirst({
            where: {
                id: warehouseId,
                deletedAt: null,
            },
            select: { id: true },
        });
        if (!warehouse) {
            throw new common_1.BadRequestException('Warehouse not found');
        }
    }
    async ensureRolesExist(roleIds) {
        if (roleIds.length === 0) {
            return;
        }
        const roles = await this.prisma.role.findMany({
            where: {
                id: { in: roleIds },
                deletedAt: null,
            },
            select: { id: true },
        });
        if (roles.length !== roleIds.length) {
            throw new common_1.BadRequestException('One or more roles are invalid');
        }
    }
    async syncRoles(userId, roleIds, actorId) {
        const auditActor = (0, audit_user_util_1.toAuditUserId)(actorId);
        const now = new Date();
        const roleIdSet = new Set(roleIds);
        await this.prisma.$transaction(async (tx) => {
            const existingRows = await tx.userRole.findMany({
                where: { userId },
                select: { id: true, roleId: true, deletedAt: true },
            });
            const existingByRoleId = new Map();
            existingRows.forEach((row) => {
                existingByRoleId.set(row.roleId, { id: row.id, deletedAt: row.deletedAt });
            });
            for (const nextRoleId of roleIds) {
                const existing = existingByRoleId.get(nextRoleId);
                if (!existing) {
                    await tx.userRole.create({
                        data: {
                            userId,
                            roleId: nextRoleId,
                            createdBy: auditActor,
                            updatedBy: auditActor,
                        },
                    });
                    continue;
                }
                if (existing.deletedAt) {
                    await tx.userRole.update({
                        where: { id: existing.id },
                        data: {
                            deletedAt: null,
                            deletedBy: null,
                            updatedBy: auditActor,
                        },
                    });
                }
            }
            if (roleIds.length === 0) {
                await tx.userRole.updateMany({
                    where: {
                        userId,
                        deletedAt: null,
                    },
                    data: {
                        deletedAt: now,
                        deletedBy: auditActor,
                        updatedBy: auditActor,
                    },
                });
            }
            else {
                await tx.userRole.updateMany({
                    where: {
                        userId,
                        deletedAt: null,
                        roleId: {
                            notIn: [...roleIdSet],
                        },
                    },
                    data: {
                        deletedAt: now,
                        deletedBy: auditActor,
                        updatedBy: auditActor,
                    },
                });
            }
        });
    }
    async getCurrentWarehouseId(userId) {
        const id = typeof userId === 'number' ? userId : Number(userId);
        if (!Number.isInteger(id))
            return null;
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: { warehouseId: true },
        });
        return user?.warehouseId ?? null;
    }
    async setWarehouseId(userId, warehouseId) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { warehouseId },
        });
    }
    async getWarehouseMapByUserIds(userIds) {
        if (userIds.length === 0) {
            return {};
        }
        const rows = await this.prisma.user.findMany({
            where: { id: { in: userIds } },
            select: {
                id: true,
                warehouseId: true,
                warehouse: { select: { name: true } },
            },
        });
        const map = {};
        for (const row of rows) {
            map[String(row.id)] = {
                warehouseId: row.warehouseId,
                warehouseName: row.warehouse?.name ?? null,
            };
        }
        return map;
    }
    async serializeUsersWithWarehouse(users) {
        const warehouseMap = await this.getWarehouseMapByUserIds(users.map((item) => item.id));
        return users.map((user) => (0, user_admin_utils_1.serializeUser)(user, warehouseMap[String(user.id)]));
    }
};
exports.UserWarehouseService = UserWarehouseService;
exports.UserWarehouseService = UserWarehouseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserWarehouseService);
//# sourceMappingURL=user-warehouse.service.js.map