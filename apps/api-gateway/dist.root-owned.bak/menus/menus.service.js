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
const menu_sidebar_service_1 = require("./menu-sidebar.service");
const menu_tree_utils_1 = require("./menu-tree.utils");
let MenusService = class MenusService {
    prisma;
    sidebarService;
    constructor(prisma, sidebarService) {
        this.prisma = prisma;
        this.sidebarService = sidebarService;
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
        await this.sidebarService.assignMenuToAdminRole(created.id, actorId);
        return { success: true, data: (0, menu_tree_utils_1.serializeMenu)(created) };
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;
        const keyword = query.search?.trim();
        const includeInactive = query.includeInactive ?? false;
        const parentFilter = query.parentId?.trim();
        const groupFilter = query.groupId?.trim();
        const normalizedParentId = parentFilter && parentFilter !== 'null' ? Number(parentFilter) : undefined;
        const normalizedGroupId = groupFilter ? Number(groupFilter) : undefined;
        const hasParentFilter = parentFilter === 'null' ||
            (Number.isInteger(normalizedParentId) && Number(normalizedParentId) > 0);
        const hasGroupFilter = Number.isInteger(normalizedGroupId) && Number(normalizedGroupId) > 0;
        const groupMenuIds = hasGroupFilter
            ? await this.resolveGroupMenuIds(Number(normalizedGroupId))
            : null;
        const where = {
            deletedAt: null,
            ...(includeInactive ? {} : { isActive: true }),
            ...(groupMenuIds ? { id: { in: groupMenuIds } } : {}),
            ...(hasParentFilter
                ? {
                    parentId: parentFilter === 'null' ? null : Number(normalizedParentId),
                }
                : {}),
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
            data: items.map((item) => (0, menu_tree_utils_1.serializeMenu)(item)),
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
        return { success: true, data: (0, menu_tree_utils_1.serializeMenu)(item) };
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
        return { success: true, data: (0, menu_tree_utils_1.serializeMenu)(updated) };
    }
    async updateSortBatch(dto, actorId) {
        const ids = dto.items.map((item) => item.id);
        const uniqueIds = new Set(ids);
        if (uniqueIds.size !== ids.length) {
            throw new common_1.BadRequestException('Duplicate menu ID in batch update');
        }
        const existingMenus = await this.prisma.menu.findMany({
            where: {
                id: { in: ids },
                deletedAt: null,
            },
            select: { id: true },
        });
        if (existingMenus.length !== ids.length) {
            throw new common_1.NotFoundException('One or more menus were not found');
        }
        await this.prisma.$transaction(dto.items.map((item) => this.prisma.menu.update({
            where: { id: item.id },
            data: {
                sortOrder: item.sortOrder,
                path: item.path === undefined ? undefined : item.path || null,
                updatedBy: this.toActor(actorId),
            },
        })));
        return { success: true, message: 'Menu list updated' };
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
        return this.sidebarService.getSidebarByUserId(userId);
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
        const allMenus = await this.prisma.menu.findMany({
            where: { deletedAt: null },
            select: { id: true, parentId: true },
        });
        (0, menu_tree_utils_1.assertNoCircularHierarchy)(allMenus, id, candidateParentId);
    }
    async resolveGroupMenuIds(groupId) {
        const allMenus = await this.prisma.menu.findMany({
            where: { deletedAt: null },
            select: { id: true, parentId: true },
        });
        return (0, menu_tree_utils_1.resolveDescendantIds)(allMenus, groupId);
    }
    toActor(actorId) {
        return (0, audit_user_util_1.toAuditUserId)(actorId);
    }
};
exports.MenusService = MenusService;
exports.MenusService = MenusService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        menu_sidebar_service_1.MenuSidebarService])
], MenusService);
//# sourceMappingURL=menus.service.js.map