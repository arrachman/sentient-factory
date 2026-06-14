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
exports.ErpSysMenusService = void 0;
const common_1 = require("@nestjs/common");
const audit_user_util_1 = require("../common/utils/audit-user.util");
const prisma_service_1 = require("../prisma/prisma.service");
function buildTree(items, parentId = null) {
    return items
        .filter((item) => item.parentId === parentId)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((item) => ({ ...item, children: buildTree(items, item.id) }));
}
function pruneTree(nodes, allowedIds) {
    return nodes.flatMap((node) => {
        if (node.type === 'ITEM') {
            return allowedIds === null || allowedIds.has(node.id) ? [node] : [];
        }
        const prunedChildren = pruneTree(node.children, allowedIds);
        if (node.type === 'MODULE') {
            return [{ ...node, children: prunedChildren }];
        }
        return prunedChildren.length > 0 ? [{ ...node, children: prunedChildren }] : [];
    });
}
let ErpSysMenusService = class ErpSysMenusService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, actorId) {
        const existing = await this.prisma.erpMenu.findFirst({
            where: { code: dto.code },
            select: { id: true, deletedAt: true },
        });
        if (existing) {
            if (existing.deletedAt) {
                throw new common_1.BadRequestException(`Menu code "${dto.code}" already exists (soft-deleted). Restore or use a different code.`);
            }
            throw new common_1.BadRequestException(`Menu code "${dto.code}" already exists`);
        }
        const actorBigInt = (0, audit_user_util_1.toAuditUserId)(actorId) ? BigInt((0, audit_user_util_1.toAuditUserId)(actorId)) : undefined;
        const created = await this.prisma.erpMenu.create({
            data: {
                code: dto.code,
                title: dto.title,
                path: dto.path,
                icon: dto.icon,
                type: dto.type,
                parentId: dto.parentId ? BigInt(dto.parentId) : null,
                sortOrder: dto.sortOrder,
                isActive: dto.isActive,
                createdById: actorBigInt,
                updatedById: actorBigInt,
            },
        });
        return { success: true, data: created };
    }
    async findAll(query) {
        const where = { deletedAt: null };
        if (query.type)
            where.type = query.type;
        if (query.parentId === 'null') {
            where.parentId = null;
        }
        else if (query.parentId) {
            where.parentId = BigInt(query.parentId);
        }
        if (query.isActive !== undefined)
            where.isActive = query.isActive;
        const items = await this.prisma.erpMenu.findMany({
            where,
            orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
        });
        return { success: true, data: items };
    }
    async findOne(id) {
        const item = await this.prisma.erpMenu.findFirst({
            where: { id, deletedAt: null },
            include: { children: { where: { deletedAt: null }, orderBy: { sortOrder: 'asc' } } },
        });
        if (!item)
            throw new common_1.NotFoundException('ERP menu not found');
        return { success: true, data: item };
    }
    async getTree() {
        const all = await this.prisma.erpMenu.findMany({
            where: { deletedAt: null },
            orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
        });
        return { success: true, data: buildTree(all) };
    }
    async getMyMenus(userId, erpLevel) {
        let allowedIds = null;
        if (erpLevel !== 'CENTRAL') {
            const userRoles = await this.prisma.erpUserRole.findMany({
                where: { userId: BigInt(userId) },
                select: { roleId: true },
            });
            const roleIds = userRoles.map((r) => r.roleId);
            const roleMenus = await this.prisma.erpRoleMenu.findMany({
                where: { roleId: { in: roleIds }, canView: true },
                select: { menuId: true },
            });
            allowedIds = new Set(roleMenus.map((rm) => rm.menuId));
        }
        const all = await this.prisma.erpMenu.findMany({
            where: { deletedAt: null, isActive: true },
            orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
        });
        const tree = buildTree(all);
        const data = pruneTree(tree, allowedIds);
        return { success: true, data };
    }
    async update(id, dto, actorId) {
        const existing = await this.prisma.erpMenu.findFirst({
            where: { id, deletedAt: null },
        });
        if (!existing)
            throw new common_1.NotFoundException('ERP menu not found');
        if (dto.code && dto.code !== existing.code) {
            const duplicate = await this.prisma.erpMenu.findFirst({
                where: { code: dto.code, NOT: { id } },
                select: { id: true },
            });
            if (duplicate)
                throw new common_1.BadRequestException(`Menu code "${dto.code}" already exists`);
        }
        const actorBigInt = (0, audit_user_util_1.toAuditUserId)(actorId) ? BigInt((0, audit_user_util_1.toAuditUserId)(actorId)) : undefined;
        const updated = await this.prisma.erpMenu.update({
            where: { id },
            data: {
                code: dto.code,
                title: dto.title,
                path: dto.path,
                icon: dto.icon,
                type: dto.type,
                parentId: dto.parentId !== undefined ? (dto.parentId ? BigInt(dto.parentId) : null) : undefined,
                sortOrder: dto.sortOrder,
                isActive: dto.isActive,
                updatedById: actorBigInt,
            },
        });
        return { success: true, data: updated };
    }
    async remove(id, actorId) {
        const existing = await this.prisma.erpMenu.findFirst({
            where: { id, deletedAt: null },
            select: { id: true },
        });
        if (!existing)
            throw new common_1.NotFoundException('ERP menu not found');
        const actorBigInt = (0, audit_user_util_1.toAuditUserId)(actorId) ? BigInt((0, audit_user_util_1.toAuditUserId)(actorId)) : undefined;
        await this.prisma.erpMenu.update({
            where: { id },
            data: { deletedAt: new Date(), updatedById: actorBigInt },
        });
        return { success: true, message: 'ERP menu deleted' };
    }
};
exports.ErpSysMenusService = ErpSysMenusService;
exports.ErpSysMenusService = ErpSysMenusService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ErpSysMenusService);
//# sourceMappingURL=erp-sys-menus.service.js.map