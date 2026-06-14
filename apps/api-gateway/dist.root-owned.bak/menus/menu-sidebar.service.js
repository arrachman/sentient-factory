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
exports.MenuSidebarService = void 0;
const common_1 = require("@nestjs/common");
const audit_user_util_1 = require("../common/utils/audit-user.util");
const prisma_service_1 = require("../prisma/prisma.service");
const menu_tree_utils_1 = require("./menu-tree.utils");
let MenuSidebarService = class MenuSidebarService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSidebarByUserId(userId) {
        if (!userId) {
            return [];
        }
        const normalizedUserId = typeof userId === 'number' ? userId : Number(userId);
        if (!Number.isInteger(normalizedUserId)) {
            return [];
        }
        await this.ensureAdministratorRoleMenu();
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
        const menuRows = roleMenus.map((row) => row.menu);
        return (0, menu_tree_utils_1.buildMenuTree)(menuRows);
    }
    async assignMenuToAdminRole(menuId, actorId) {
        const adminRole = await this.prisma.role.findFirst({
            where: { name: 'admin', deletedAt: null },
            select: { id: true },
        });
        if (!adminRole) {
            return;
        }
        const existingRoleMenu = await this.prisma.roleMenu.findFirst({
            where: { roleId: adminRole.id, menuId },
            select: { id: true, deletedAt: true },
        });
        const actor = this.toActor(actorId);
        if (!existingRoleMenu) {
            await this.prisma.roleMenu.create({
                data: {
                    roleId: adminRole.id,
                    menuId,
                    canView: true,
                    createdBy: actor,
                    updatedBy: actor,
                },
            });
            return;
        }
        if (existingRoleMenu.deletedAt) {
            await this.prisma.roleMenu.update({
                where: { id: existingRoleMenu.id },
                data: {
                    canView: true,
                    deletedAt: null,
                    deletedBy: null,
                    updatedBy: actor,
                },
            });
            return;
        }
        await this.prisma.roleMenu.update({
            where: { id: existingRoleMenu.id },
            data: {
                canView: true,
                updatedBy: actor,
            },
        });
    }
    async ensureAdministratorRoleMenu() {
        const administratorParent = await this.prisma.menu.upsert({
            where: { key: 'administrator' },
            update: {
                title: 'Administrator',
                path: null,
                icon: 'ShieldUser',
                type: 'COLLAPSE',
                parentId: null,
                isVisible: true,
                isActive: true,
                deletedAt: null,
                deletedBy: null,
            },
            create: {
                key: 'administrator',
                title: 'Administrator',
                path: null,
                icon: 'ShieldUser',
                type: 'COLLAPSE',
                parentId: null,
                sortOrder: 50,
                isVisible: true,
                isActive: true,
            },
            select: { id: true },
        });
        const roleMenu = await this.prisma.menu.upsert({
            where: { key: 'administrator-role' },
            update: {
                title: 'Role',
                path: '/app/administrator/role',
                icon: 'ShieldCheck',
                type: 'ITEM',
                parentId: administratorParent.id,
                sortOrder: 34,
                isVisible: true,
                isActive: true,
                deletedAt: null,
                deletedBy: null,
            },
            create: {
                key: 'administrator-role',
                title: 'Role',
                path: '/app/administrator/role',
                icon: 'ShieldCheck',
                type: 'ITEM',
                parentId: administratorParent.id,
                sortOrder: 34,
                isVisible: true,
                isActive: true,
            },
            select: { id: true },
        });
        const adminRole = await this.prisma.role.findFirst({
            where: { name: 'admin', deletedAt: null },
            select: { id: true },
        });
        if (!adminRole) {
            return;
        }
        const existingRoleMenu = await this.prisma.roleMenu.findFirst({
            where: { roleId: adminRole.id, menuId: roleMenu.id },
            select: { id: true, deletedAt: true },
        });
        if (!existingRoleMenu) {
            await this.prisma.roleMenu.create({
                data: {
                    roleId: adminRole.id,
                    menuId: roleMenu.id,
                    canView: true,
                },
            });
            return;
        }
        if (existingRoleMenu.deletedAt) {
            await this.prisma.roleMenu.update({
                where: { id: existingRoleMenu.id },
                data: {
                    canView: true,
                    deletedAt: null,
                    deletedBy: null,
                },
            });
        }
    }
    toActor(actorId) {
        return (0, audit_user_util_1.toAuditUserId)(actorId);
    }
};
exports.MenuSidebarService = MenuSidebarService;
exports.MenuSidebarService = MenuSidebarService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MenuSidebarService);
//# sourceMappingURL=menu-sidebar.service.js.map