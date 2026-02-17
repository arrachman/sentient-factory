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
exports.MenusService = void 0;
const common_1 = require("@nestjs/common");
const duplicate_util_1 = require("../common/errors/duplicate.util");
const audit_user_util_1 = require("../common/utils/audit-user.util");
const prisma_service_1 = require("../prisma/prisma.service");
let MenusService = class MenusService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, actorId) {
        const existing = await this.prisma.menu.findFirst({
            where: { key: dto.key },
            select: { id: true, deletedAt: true },
        });
        if (existing) {
            (0, duplicate_util_1.throwDuplicate)({
                fieldLabel: 'Menu key',
                value: dto.key,
                isSoftDeleted: Boolean(existing.deletedAt),
            });
        }
        if (dto.parentId) {
            await this.ensureParentExists(dto.parentId);
        }
        const created = await this.prisma.menu.create({
            data: {
                key: dto.key,
                title: dto.title,
                path: dto.path ?? null,
                icon: dto.icon ?? null,
                type: dto.type ?? 'ITEM',
                parentId: dto.parentId ?? null,
                sortOrder: dto.sortOrder ?? 0,
                isVisible: dto.isVisible ?? true,
                isActive: dto.isActive ?? true,
                permissionName: dto.permissionName ?? null,
                createdBy: this.toActor(actorId),
                updatedBy: this.toActor(actorId),
            },
            include: {
                parent: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });
        return { success: true, data: this.serializeMenu(created) };
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;
        const keyword = query.search?.trim();
        const includeInactive = query.includeInactive ?? false;
        const where = {
            deletedAt: null,
            ...(includeInactive ? {} : { isActive: true }),
            ...(keyword
                ? {
                    OR: [
                        { key: { contains: keyword, mode: 'insensitive' } },
                        { title: { contains: keyword, mode: 'insensitive' } },
                        { path: { contains: keyword, mode: 'insensitive' } },
                        { icon: { contains: keyword, mode: 'insensitive' } },
                        { permissionName: { contains: keyword, mode: 'insensitive' } },
                    ],
                }
                : {}),
        };
        const [items, total] = await this.prisma.$transaction([
            this.prisma.menu.findMany({
                where,
                include: {
                    parent: {
                        select: {
                            id: true,
                            title: true,
                        },
                    },
                },
                orderBy: [{ parentId: 'asc' }, { sortOrder: 'asc' }, { title: 'asc' }],
                skip,
                take: limit,
            }),
            this.prisma.menu.count({ where }),
        ]);
        return {
            success: true,
            data: items.map((item) => this.serializeMenu(item)),
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit) || 1,
            },
        };
    }
    async findOne(id) {
        const item = await this.prisma.menu.findFirst({
            where: { id, deletedAt: null },
            include: {
                parent: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });
        if (!item) {
            throw new common_1.NotFoundException('Menu not found');
        }
        return { success: true, data: this.serializeMenu(item) };
    }
    async update(id, dto, actorId) {
        const existing = await this.prisma.menu.findFirst({
            where: { id, deletedAt: null },
            select: { id: true, key: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Menu not found');
        }
        if (dto.key && dto.key !== existing.key) {
            const duplicate = await this.prisma.menu.findFirst({
                where: { key: dto.key, NOT: { id } },
                select: { id: true, deletedAt: true },
            });
            if (duplicate) {
                (0, duplicate_util_1.throwDuplicate)({
                    fieldLabel: 'Menu key',
                    value: dto.key,
                    isSoftDeleted: Boolean(duplicate.deletedAt),
                });
            }
        }
        if (dto.parentId !== undefined) {
            if (dto.parentId === id) {
                throw new common_1.BadRequestException('Menu cannot be its own parent');
            }
            if (dto.parentId !== null) {
                await this.ensureParentExists(dto.parentId);
                await this.ensureParentNotDescendant(id, dto.parentId);
            }
        }
        const updated = await this.prisma.menu.update({
            where: { id },
            data: {
                key: dto.key,
                title: dto.title,
                path: dto.path,
                icon: dto.icon,
                type: dto.type,
                parentId: dto.parentId,
                sortOrder: dto.sortOrder,
                isVisible: dto.isVisible,
                isActive: dto.isActive,
                permissionName: dto.permissionName,
                updatedBy: this.toActor(actorId),
            },
            include: {
                parent: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });
        return { success: true, data: this.serializeMenu(updated) };
    }
    async remove(id, actorId) {
        const existing = await this.prisma.menu.findFirst({
            where: { id, deletedAt: null },
            select: { id: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Menu not found');
        }
        const activeChildren = await this.prisma.menu.count({
            where: {
                parentId: id,
                deletedAt: null,
            },
        });
        if (activeChildren > 0) {
            throw new common_1.BadRequestException('Menu has child items. Remove children first.');
        }
        await this.prisma.menu.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                deletedBy: this.toActor(actorId),
                updatedBy: this.toActor(actorId),
            },
        });
        return { success: true, message: 'Menu deleted' };
    }
    async getSidebarByUserId(userId) {
        if (!userId) {
            return [];
        }
        const normalizedUserId = typeof userId === 'number' ? userId : Number(userId);
        if (!Number.isInteger(normalizedUserId)) {
            return [];
        }
        const userRoles = await this.prisma.userRole.findMany({
            where: {
                userId: normalizedUserId,
                deletedAt: null,
                role: {
                    deletedAt: null,
                },
            },
            select: {
                roleId: true,
            },
        });
        const roleIds = userRoles.map((item) => item.roleId);
        if (roleIds.length === 0) {
            return [];
        }
        const roleMenus = await this.prisma.roleMenu.findMany({
            where: {
                roleId: { in: roleIds },
                canView: true,
                deletedAt: null,
                menu: {
                    deletedAt: null,
                    isActive: true,
                    isVisible: true,
                },
            },
            include: {
                menu: {
                    select: {
                        id: true,
                        key: true,
                        title: true,
                        path: true,
                        icon: true,
                        type: true,
                        parentId: true,
                        sortOrder: true,
                    },
                },
            },
            orderBy: {
                menu: {
                    sortOrder: 'asc',
                },
            },
        });
        const dedupedMap = new Map();
        for (const row of roleMenus) {
            const menu = row.menu;
            if (!dedupedMap.has(menu.id)) {
                dedupedMap.set(menu.id, {
                    id: menu.id,
                    key: menu.key,
                    title: menu.title,
                    path: menu.path,
                    icon: menu.icon,
                    type: menu.type,
                    parentId: menu.parentId,
                    sortOrder: menu.sortOrder,
                    children: [],
                });
            }
        }
        const items = Array.from(dedupedMap.values());
        const byId = new Map(items.map((item) => [item.id, item]));
        const roots = [];
        for (const item of items) {
            if (item.parentId && byId.has(item.parentId)) {
                byId.get(item.parentId).children.push(item);
            }
            else {
                roots.push(item);
            }
        }
        const sortRecursively = (list) => {
            list.sort((a, b) => a.sortOrder - b.sortOrder);
            for (const entry of list) {
                sortRecursively(entry.children);
            }
        };
        sortRecursively(roots);
        return roots;
    }
    async ensureParentExists(parentId) {
        const parent = await this.prisma.menu.findFirst({
            where: { id: parentId, deletedAt: null },
            select: { id: true },
        });
        if (!parent) {
            throw new common_1.NotFoundException('Parent menu not found');
        }
    }
    async ensureParentNotDescendant(id, candidateParentId) {
        const children = await this.prisma.menu.findMany({
            where: { deletedAt: null },
            select: { id: true, parentId: true },
        });
        const parentMap = new Map(children.map((item) => [item.id, item.parentId]));
        let cursor = candidateParentId;
        while (cursor !== null) {
            if (cursor === id) {
                throw new common_1.BadRequestException('Invalid parent menu. Circular hierarchy detected.');
            }
            cursor = parentMap.get(cursor) ?? null;
        }
    }
    toActor(actorId) {
        return (0, audit_user_util_1.toAuditUserId)(actorId);
    }
    serializeMenu(item) {
        return {
            id: item.id,
            key: item.key,
            title: item.title,
            path: item.path,
            icon: item.icon,
            type: item.type,
            parentId: item.parentId,
            parentTitle: item.parent?.title ?? null,
            sortOrder: item.sortOrder,
            isVisible: item.isVisible,
            isActive: item.isActive,
            permissionName: item.permissionName,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        };
    }
};
exports.MenusService = MenusService;
exports.MenusService = MenusService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MenusService);
//# sourceMappingURL=menus.service.js.map