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
exports.OutboundValidatorsService = void 0;
const common_1 = require("@nestjs/common");
const duplicate_util_1 = require("../common/errors/duplicate.util");
const prisma_service_1 = require("../prisma/prisma.service");
const outbound_helpers_1 = require("./outbound-helpers");
let OutboundValidatorsService = class OutboundValidatorsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async ensureDoNumberAvailable(doNumber, exceptId) {
        const duplicate = await this.prisma.deliveryOrder.findFirst({
            where: {
                doNumber,
                NOT: exceptId ? { id: exceptId } : undefined,
            },
            select: { id: true, deletedAt: true },
        });
        if (duplicate) {
            (0, duplicate_util_1.throwDuplicate)({
                fieldLabel: 'DO number',
                value: doNumber,
                isSoftDeleted: Boolean(duplicate.deletedAt),
            });
        }
    }
    async ensureCustomerExists(customerId) {
        const customer = await this.prisma.masterDataContact.findFirst({
            where: {
                id: customerId,
                type: 'customer',
                deletedAt: null,
            },
            select: { id: true, city: true },
        });
        if (!customer) {
            throw new common_1.BadRequestException('Customer not found');
        }
        return customer;
    }
    async ensureWarehouseExists(warehouseId) {
        const warehouse = await this.prisma.masterDataWarehouse.findFirst({
            where: { id: warehouseId, deletedAt: null },
            select: { id: true },
        });
        if (!warehouse) {
            throw new common_1.BadRequestException('Warehouse not found');
        }
    }
    async resolveDefaultsFromCustomerCity(customerCity) {
        const normalizedCityName = String(customerCity ?? '').trim();
        if (!normalizedCityName) {
            return { destinationCityId: null };
        }
        const matchedCity = await this.prisma.masterDataCity.findFirst({
            where: {
                name: {
                    equals: normalizedCityName,
                    mode: 'insensitive',
                },
                deletedAt: null,
            },
            select: { id: true },
            orderBy: [{ createdAt: 'asc' }],
        });
        return { destinationCityId: matchedCity?.id ?? null };
    }
    async findCitySlaByCityId(cityId) {
        return this.prisma.masterDataCitySla.findFirst({
            where: {
                cityId,
                deletedAt: null,
            },
            select: {
                stdLeadTimeDays: true,
                stdReturnDoDays: true,
            },
        });
    }
    async ensureCityExists(cityId) {
        const city = await this.prisma.masterDataCity.findFirst({
            where: { id: cityId, deletedAt: null },
            select: { id: true },
        });
        if (!city) {
            throw new common_1.BadRequestException('Destination city not found');
        }
    }
    async getActiveItems(itemIds) {
        const uniqueItemIds = [...new Set(itemIds)];
        const items = await this.prisma.masterDataItem.findMany({
            where: {
                id: { in: uniqueItemIds },
                isActive: true,
                deletedAt: null,
            },
            select: {
                id: true,
                code: true,
                name: true,
                uom: { select: { id: true, code: true } },
            },
        });
        if (items.length !== uniqueItemIds.length) {
            throw new common_1.BadRequestException('One or more items are not found or inactive');
        }
        return new Map(items.map((item) => [
            item.id,
            {
                id: item.id,
                code: item.code,
                name: item.name,
                uomId: item.uom.id,
                uom: { code: item.uom.code },
            },
        ]));
    }
    async resolveWarehouseForActor(tx, actorId) {
        const parsedActorId = this.parseOptionalActorUserId(actorId);
        if (!parsedActorId) {
            return undefined;
        }
        const actor = await tx.user.findFirst({
            where: {
                id: parsedActorId,
                deletedAt: null,
            },
            select: {
                warehouse: {
                    select: {
                        id: true,
                    },
                },
            },
        });
        const mappedWarehouseId = actor?.warehouse?.id;
        if (!mappedWarehouseId || mappedWarehouseId <= 0) {
            return undefined;
        }
        return mappedWarehouseId;
    }
    async resolveActorUserId(tx, actorId) {
        const parsedActorId = this.parseOptionalActorUserId(actorId);
        if (!parsedActorId) {
            return undefined;
        }
        const actor = await tx.user.findFirst({
            where: {
                id: parsedActorId,
                deletedAt: null,
            },
            select: { id: true },
        });
        return actor?.id;
    }
    parseOptionalActorUserId(actorId) {
        if (typeof actorId === 'undefined' || actorId === null) {
            return undefined;
        }
        const normalized = String(actorId).trim();
        if (!normalized) {
            return undefined;
        }
        const parsed = Number(normalized);
        if (!Number.isInteger(parsed) || parsed <= 0) {
            return undefined;
        }
        return parsed;
    }
    async resolveWarehouseFilterForActor(actorId, requestedWarehouseId) {
        const actor = await this.getActorWarehouseAccess(actorId);
        if (actor.canAccessAllWarehouses) {
            if (requestedWarehouseId?.trim()) {
                return (0, outbound_helpers_1.parseId)(requestedWarehouseId, 'warehouseId');
            }
            return undefined;
        }
        if (typeof actor.warehouseId === 'number' && actor.warehouseId > 0) {
            return actor.warehouseId;
        }
        throw new common_1.BadRequestException('Warehouse untuk user login belum terdaftar');
    }
    async resolveInputWarehouseForActor(actorId, requestedWarehouseId, fallbackWarehouseId) {
        const actor = await this.getActorWarehouseAccess(actorId);
        if (actor.canAccessAllWarehouses) {
            if (requestedWarehouseId?.trim()) {
                return (0, outbound_helpers_1.parseId)(requestedWarehouseId, 'warehouseId');
            }
            if (typeof fallbackWarehouseId === 'number' && fallbackWarehouseId > 0) {
                return fallbackWarehouseId;
            }
            if (typeof actor.warehouseId === 'number' && actor.warehouseId > 0) {
                return actor.warehouseId;
            }
            throw new common_1.BadRequestException('warehouseId is required');
        }
        if (typeof actor.warehouseId === 'number' && actor.warehouseId > 0) {
            return actor.warehouseId;
        }
        throw new common_1.BadRequestException('Warehouse untuk user login belum terdaftar');
    }
    async getActorWarehouseAccess(actorId) {
        const actorUserId = (0, outbound_helpers_1.parseOptionalActorId)(actorId);
        if (!actorUserId) {
            throw new common_1.BadRequestException('User login tidak ditemukan');
        }
        const actor = await this.prisma.user.findFirst({
            where: {
                id: actorUserId,
                deletedAt: null,
            },
            select: {
                warehouseId: true,
                roles: {
                    where: {
                        deletedAt: null,
                        role: { deletedAt: null },
                    },
                    select: {
                        role: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
        });
        if (!actor) {
            throw new common_1.BadRequestException('User login tidak ditemukan');
        }
        const roleNames = (actor.roles ?? [])
            .map((row) => String(row.role?.name ?? '')
            .trim()
            .toLowerCase())
            .filter(Boolean);
        const canAccessAllWarehouses = roleNames.some((roleName) => roleName === 'admin' || roleName === 'super_admin');
        return {
            warehouseId: actor.warehouseId,
            canAccessAllWarehouses,
        };
    }
};
exports.OutboundValidatorsService = OutboundValidatorsService;
exports.OutboundValidatorsService = OutboundValidatorsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OutboundValidatorsService);
//# sourceMappingURL=outbound-validators.service.js.map