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
exports.InboundWarehouseResolverService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const audit_user_util_1 = require("../common/utils/audit-user.util");
const inbound_transaction_utils_1 = require("./inbound-transaction.utils");
let InboundWarehouseResolverService = class InboundWarehouseResolverService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async resolveForActor(actorId, requestedWarehouseId) {
        const actor = await this.getActorAccess(actorId);
        if (actor.canAccessAllWarehouses && requestedWarehouseId?.trim()) {
            return (0, inbound_transaction_utils_1.parseIntStrict)(requestedWarehouseId, 'Warehouse ID');
        }
        if (actor.warehouseId && actor.warehouseId > 0) {
            return actor.warehouseId;
        }
        const ownedWarehouse = await this.prisma.masterDataWarehouse.findFirst({
            where: { deletedAt: null, createdBy: (0, audit_user_util_1.toAuditUserId)(actorId) },
            select: { id: true },
            orderBy: [{ createdAt: 'asc' }],
        });
        if (!ownedWarehouse) {
            throw new common_1.BadRequestException('Warehouse untuk user login belum terdaftar');
        }
        return ownedWarehouse.id;
    }
    async resolveFilterForActor(actorId, requestedWarehouseId) {
        const actor = await this.getActorAccess(actorId);
        if (actor.canAccessAllWarehouses) {
            return requestedWarehouseId?.trim()
                ? (0, inbound_transaction_utils_1.parseIntStrict)(requestedWarehouseId, 'Warehouse ID')
                : undefined;
        }
        if (actor.warehouseId && actor.warehouseId > 0) {
            return actor.warehouseId;
        }
        const ownedWarehouse = await this.prisma.masterDataWarehouse.findFirst({
            where: { deletedAt: null, createdBy: (0, audit_user_util_1.toAuditUserId)(actorId) },
            select: { id: true },
            orderBy: [{ createdAt: 'asc' }],
        });
        if (!ownedWarehouse) {
            throw new common_1.BadRequestException('Warehouse untuk user login belum terdaftar');
        }
        return ownedWarehouse.id;
    }
    async getActorAccess(actorId) {
        if (!actorId) {
            throw new common_1.BadRequestException('User login tidak ditemukan');
        }
        const actorUserId = (0, inbound_transaction_utils_1.parseIntStrict)(String(actorId), 'User ID');
        const actor = await this.prisma.user.findFirst({
            where: { id: actorUserId, deletedAt: null },
            select: {
                warehouseId: true,
                roles: {
                    where: { deletedAt: null },
                    select: { role: { select: { name: true, deletedAt: true } } },
                },
            },
        });
        const roleNames = (actor?.roles ?? []).map((item) => String(item.role?.name ?? '').trim().toLowerCase());
        const canAccessAllWarehouses = roleNames.some((r) => r === 'super_admin' || r === 'admin');
        return { warehouseId: actor?.warehouseId, canAccessAllWarehouses };
    }
};
exports.InboundWarehouseResolverService = InboundWarehouseResolverService;
exports.InboundWarehouseResolverService = InboundWarehouseResolverService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InboundWarehouseResolverService);
//# sourceMappingURL=inbound-warehouse-resolver.service.js.map