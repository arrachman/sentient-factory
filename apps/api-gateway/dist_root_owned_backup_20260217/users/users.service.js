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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const audit_user_util_1 = require("../common/utils/audit-user.util");
const duplicate_util_1 = require("../common/errors/duplicate.util");
const password_hasher_1 = require("../auth/password-hasher");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findOneByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
            include: {
                roles: {
                    include: {
                        role: true,
                    },
                },
            },
        });
    }
    async findOneByUsername(username) {
        return this.prisma.user.findUnique({
            where: { username },
        });
    }
    async findOneById(id) {
        const userId = typeof id === 'number' ? id : Number(id);
        if (!Number.isInteger(userId)) {
            return null;
        }
        return this.prisma.user.findUnique({
            where: { id: userId },
        });
    }
    async findOneByUuid(id) {
        return this.findOneById(id);
    }
    async hasWarehouse(id) {
        const warehouseId = await this.getCurrentWarehouseId(id);
        return Boolean(warehouseId);
    }
    async getWarehouseMetaByUserUuid(id) {
        const userId = typeof id === 'number' ? id : Number(id);
        if (!Number.isInteger(userId)) {
            return { warehouseId: null, warehouseName: null };
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                warehouse: { select: { id: true, name: true } },
            },
        });
        return {
            warehouseId: user?.warehouse?.id ?? null,
            warehouseName: user?.warehouse?.name ?? null,
        };
    }
    async create(data) {
        return this.prisma.user.create({
            data,
        });
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
        const normalizedWarehouseId = this.normalizeWarehouseId(dto.warehouseId);
        if (nextIsActive && !normalizedWarehouseId) {
            throw new common_1.BadRequestException('Active user must have warehouse assigned');
        }
        if (normalizedWarehouseId) {
            await this.ensureWarehouseExists(normalizedWarehouseId);
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
        await this.setWarehouseId(created.id, normalizedWarehouseId ?? null);
        const [serialized] = await this.serializeUsersWithWarehouse([created]);
        return {
            success: true,
            data: serialized,
        };
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
        const serializedItems = await this.serializeUsersWithWarehouse(items);
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
        const [serialized] = await this.serializeUsersWithWarehouse([item]);
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
        const normalizedWarehouseId = this.normalizeWarehouseId(dto.warehouseId);
        if (normalizedWarehouseId) {
            await this.ensureWarehouseExists(normalizedWarehouseId);
        }
        const nextIsActive = dto.isActive ?? existing.isActive;
        const nextWarehouseId = normalizedWarehouseId !== undefined
            ? normalizedWarehouseId
            : await this.getCurrentWarehouseId(id);
        if (nextIsActive && !nextWarehouseId) {
            throw new common_1.BadRequestException('Active user must have warehouse assigned');
        }
        let updated;
        try {
            updated = await this.prisma.user.update({
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
            await this.setWarehouseId(id, normalizedWarehouseId);
        }
        const [serialized] = await this.serializeUsersWithWarehouse([updated]);
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
    async updateRefreshToken(_userId, _refreshToken) {
        return;
    }
    normalizeWarehouseId(warehouseId) {
        if (warehouseId === undefined) {
            return undefined;
        }
        const normalized = warehouseId.trim();
        if (!normalized.length)
            return null;
        const parsed = Number(normalized);
        if (!Number.isInteger(parsed)) {
            throw new common_1.BadRequestException('Warehouse ID is invalid');
        }
        return parsed;
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
    async getWarehouseMapByUserUuids(userIds) {
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
        const warehouseMap = await this.getWarehouseMapByUserUuids(users.map((item) => item.id));
        return users.map((user) => this.serializeUser(user, warehouseMap[String(user.id)]));
    }
    serializeUser(user, warehouseMeta) {
        const { passwordHash: _passwordHash, ...safe } = user;
        return {
            ...safe,
            warehouseId: warehouseMeta?.warehouseId ?? null,
            warehouseName: warehouseMeta?.warehouseName ?? null,
            roles: user.roles?.map((item) => item.role.name) ?? [],
            role: user.roles?.[0]?.role?.name ?? null,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map