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
exports.UserAdminService = void 0;
const common_1 = require("@nestjs/common");
const audit_user_util_1 = require("../common/utils/audit-user.util");
const duplicate_util_1 = require("../common/errors/duplicate.util");
const password_hasher_1 = require("../auth/password-hasher");
const prisma_service_1 = require("../prisma/prisma.service");
const user_admin_utils_1 = require("./user-admin.utils");
const user_warehouse_service_1 = require("./user-warehouse.service");
let UserAdminService = class UserAdminService {
    prisma;
    warehouseSvc;
    constructor(prisma, warehouseSvc) {
        this.prisma = prisma;
        this.warehouseSvc = warehouseSvc;
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;
        const where = {
            deletedAt: null,
        };
        if (query.search?.trim()) {
            const q = query.search.trim();
            where.OR = [
                { email: { contains: q, mode: 'insensitive' } },
                { username: { contains: q, mode: 'insensitive' } },
                { fullName: { contains: q, mode: 'insensitive' } },
            ];
        }
        if (typeof query.isActive === 'boolean') {
            where.isActive = query.isActive;
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.user.findMany({
                where,
                include: {
                    roles: {
                        where: { deletedAt: null },
                        include: {
                            role: true,
                        },
                    },
                },
                orderBy: [{ createdAt: 'desc' }],
                skip,
                take: limit,
            }),
            this.prisma.user.count({ where }),
        ]);
        const serializedItems = await this.warehouseSvc.serializeUsersWithWarehouse(items);
        return {
            success: true,
            data: serializedItems,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit) || 1,
            },
        };
    }
    async findOne(id) {
        const item = await this.prisma.user.findFirst({
            where: { id, deletedAt: null },
            include: {
                roles: {
                    where: { deletedAt: null },
                    include: {
                        role: true,
                    },
                },
            },
        });
        if (!item) {
            throw new common_1.NotFoundException('User not found');
        }
        const [serialized] = await this.warehouseSvc.serializeUsersWithWarehouse([item]);
        return {
            success: true,
            data: serialized,
        };
    }
    async createFromAdmin(dto, actorId) {
        const duplicate = await this.prisma.user.findFirst({
            where: {
                OR: [{ email: dto.email }, { username: dto.username }],
            },
            select: { email: true, username: true, deletedAt: true },
        });
        if (duplicate?.email === dto.email) {
            (0, duplicate_util_1.throwDuplicate)({
                fieldLabel: 'Email',
                value: dto.email,
                isSoftDeleted: Boolean(duplicate.deletedAt),
            });
        }
        if (duplicate?.username === dto.username) {
            (0, duplicate_util_1.throwDuplicate)({
                fieldLabel: 'Username',
                value: dto.username,
                isSoftDeleted: Boolean(duplicate.deletedAt),
            });
        }
        const passwordHash = await (0, password_hasher_1.hashPassword)(dto.password);
        const nextIsActive = dto.isActive ?? true;
        const normalizedWarehouseId = (0, user_admin_utils_1.normalizeWarehouseId)(dto.warehouseId);
        const normalizedRoleIds = (0, user_admin_utils_1.normalizeRoleIds)(dto.roleIds, dto.roleId);
        if (nextIsActive && !normalizedWarehouseId) {
            throw new common_1.BadRequestException('Active user must have warehouse assigned');
        }
        if (normalizedWarehouseId) {
            await this.warehouseSvc.ensureWarehouseExists(normalizedWarehouseId);
        }
        if (normalizedRoleIds !== undefined) {
            await this.warehouseSvc.ensureRolesExist(normalizedRoleIds);
        }
        let created;
        try {
            created = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    username: dto.username,
                    passwordHash,
                    fullName: dto.fullName ?? null,
                    isActive: dto.isActive ?? true,
                    warehouseId: normalizedWarehouseId ?? null,
                    createdBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                    updatedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                },
                include: {
                    roles: {
                        include: {
                            role: true,
                        },
                    },
                },
            });
        }
        catch (error) {
            if ((0, duplicate_util_1.isUniqueViolation)(error, ['email'])) {
                (0, duplicate_util_1.throwDuplicate)({ fieldLabel: 'Email', value: dto.email });
            }
            if ((0, duplicate_util_1.isUniqueViolation)(error, ['username'])) {
                (0, duplicate_util_1.throwDuplicate)({ fieldLabel: 'Username', value: dto.username });
            }
            throw error;
        }
        if (normalizedRoleIds !== undefined) {
            await this.warehouseSvc.syncRoles(created.id, normalizedRoleIds, actorId);
        }
        const refreshed = await this.prisma.user.findFirst({
            where: { id: created.id, deletedAt: null },
            include: {
                roles: {
                    where: { deletedAt: null },
                    include: {
                        role: true,
                    },
                },
            },
        });
        if (!refreshed) {
            throw new common_1.NotFoundException('User not found');
        }
        const [serialized] = await this.warehouseSvc.serializeUsersWithWarehouse([refreshed]);
        return {
            success: true,
            data: serialized,
        };
    }
    async update(id, dto, actorId) {
        const existing = await this.prisma.user.findFirst({
            where: { id, deletedAt: null },
            select: { id: true, email: true, username: true, isActive: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('User not found');
        }
        if (dto.email && dto.email !== existing.email) {
            const emailExists = await this.prisma.user.findFirst({
                where: { email: dto.email, NOT: { id } },
                select: { id: true, deletedAt: true },
            });
            if (emailExists) {
                (0, duplicate_util_1.throwDuplicate)({
                    fieldLabel: 'Email',
                    value: dto.email,
                    isSoftDeleted: Boolean(emailExists.deletedAt),
                });
            }
        }
        if (dto.username && dto.username !== existing.username) {
            const usernameExists = await this.prisma.user.findFirst({
                where: { username: dto.username, NOT: { id } },
                select: { id: true, deletedAt: true },
            });
            if (usernameExists) {
                (0, duplicate_util_1.throwDuplicate)({
                    fieldLabel: 'Username',
                    value: dto.username,
                    isSoftDeleted: Boolean(usernameExists.deletedAt),
                });
            }
        }
        const passwordHash = dto.password ? await (0, password_hasher_1.hashPassword)(dto.password) : undefined;
        const normalizedWarehouseId = (0, user_admin_utils_1.normalizeWarehouseId)(dto.warehouseId);
        const normalizedRoleIds = (0, user_admin_utils_1.normalizeRoleIds)(dto.roleIds, dto.roleId);
        if (normalizedWarehouseId) {
            await this.warehouseSvc.ensureWarehouseExists(normalizedWarehouseId);
        }
        if (normalizedRoleIds !== undefined) {
            await this.warehouseSvc.ensureRolesExist(normalizedRoleIds);
        }
        const nextIsActive = dto.isActive ?? existing.isActive;
        const nextWarehouseId = normalizedWarehouseId !== undefined
            ? normalizedWarehouseId
            : await this.warehouseSvc.getCurrentWarehouseId(id);
        if (nextIsActive && !nextWarehouseId) {
            throw new common_1.BadRequestException('Active user must have warehouse assigned');
        }
        try {
            await this.prisma.user.update({
                where: { id },
                data: {
                    email: dto.email,
                    username: dto.username,
                    fullName: dto.fullName,
                    isActive: dto.isActive,
                    passwordHash,
                    updatedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                },
                include: {
                    roles: {
                        where: { deletedAt: null },
                        include: {
                            role: true,
                        },
                    },
                },
            });
        }
        catch (error) {
            if ((0, duplicate_util_1.isUniqueViolation)(error, ['email'])) {
                (0, duplicate_util_1.throwDuplicate)({ fieldLabel: 'Email', value: dto.email ?? existing.email });
            }
            if ((0, duplicate_util_1.isUniqueViolation)(error, ['username'])) {
                (0, duplicate_util_1.throwDuplicate)({ fieldLabel: 'Username', value: dto.username ?? existing.username });
            }
            throw error;
        }
        if (normalizedWarehouseId !== undefined) {
            await this.warehouseSvc.setWarehouseId(id, normalizedWarehouseId);
        }
        if (normalizedRoleIds !== undefined) {
            await this.warehouseSvc.syncRoles(id, normalizedRoleIds, actorId);
        }
        const refreshed = await this.prisma.user.findFirst({
            where: { id, deletedAt: null },
            include: {
                roles: {
                    where: { deletedAt: null },
                    include: {
                        role: true,
                    },
                },
            },
        });
        if (!refreshed) {
            throw new common_1.NotFoundException('User not found');
        }
        const [serialized] = await this.warehouseSvc.serializeUsersWithWarehouse([refreshed]);
        return {
            success: true,
            data: serialized,
        };
    }
    async remove(id, actorId) {
        const existing = await this.prisma.user.findFirst({
            where: { id, deletedAt: null },
            select: { id: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('User not found');
        }
        await this.prisma.user.update({
            where: { id },
            data: {
                isActive: false,
                deletedAt: new Date(),
                deletedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
            },
        });
        return {
            success: true,
            message: 'User deleted',
        };
    }
};
exports.UserAdminService = UserAdminService;
exports.UserAdminService = UserAdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        user_warehouse_service_1.UserWarehouseService])
], UserAdminService);
//# sourceMappingURL=user-admin.service.js.map