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
exports.MasterDataWarehousesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const audit_user_util_1 = require("../common/utils/audit-user.util");
let MasterDataWarehousesService = class MasterDataWarehousesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, actorId) {
        const cityId = Number(dto.cityId);
        if (!Number.isInteger(cityId)) {
            throw new common_1.BadRequestException('City ID is invalid');
        }
        const city = await this.prisma.masterDataCity.findFirst({
            where: { id: cityId, deletedAt: null },
            select: { id: true },
        });
        if (!city) {
            throw new common_1.BadRequestException('City not found');
        }
        const created = await this.prisma.masterDataWarehouse.create({
            data: {
                name: dto.name,
                cityId,
                locationName: dto.locationName,
                addressDetail: dto.addressDetail,
                createdBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                updatedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
            },
        });
        return { success: true, data: created };
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;
        const where = { deletedAt: null };
        if (query.search?.trim()) {
            const q = query.search.trim();
            where.OR = [
                { name: { contains: q, mode: 'insensitive' } },
                { locationName: { contains: q, mode: 'insensitive' } },
                { addressDetail: { contains: q, mode: 'insensitive' } },
                { city: { name: { contains: q, mode: 'insensitive' } } },
            ];
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.masterDataWarehouse.findMany({
                where,
                include: {
                    city: { select: { id: true, name: true, postalCode: true } },
                },
                orderBy: [{ createdAt: 'desc' }],
                skip,
                take: limit,
            }),
            this.prisma.masterDataWarehouse.count({ where }),
        ]);
        return {
            success: true,
            data: items,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit) || 1,
            },
        };
    }
    async findOne(id) {
        const item = await this.prisma.masterDataWarehouse.findFirst({
            where: { id, deletedAt: null },
        });
        if (!item) {
            throw new common_1.NotFoundException('Master data warehouse not found');
        }
        return { success: true, data: item };
    }
    async update(id, dto, actorId) {
        const existing = await this.prisma.masterDataWarehouse.findFirst({
            where: { id, deletedAt: null },
            select: { id: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Master data warehouse not found');
        }
        let nextCityId;
        if (typeof dto.cityId !== 'undefined') {
            nextCityId = Number(dto.cityId);
            if (!Number.isInteger(nextCityId)) {
                throw new common_1.BadRequestException('City ID is invalid');
            }
            const city = await this.prisma.masterDataCity.findFirst({
                where: { id: nextCityId, deletedAt: null },
                select: { id: true },
            });
            if (!city) {
                throw new common_1.BadRequestException('City not found');
            }
        }
        const updated = await this.prisma.masterDataWarehouse.update({
            where: { id },
            data: {
                name: dto.name,
                cityId: nextCityId,
                locationName: dto.locationName,
                addressDetail: dto.addressDetail,
                updatedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
            },
        });
        return { success: true, data: updated };
    }
    async remove(id, actorId) {
        const existing = await this.prisma.masterDataWarehouse.findFirst({
            where: { id, deletedAt: null },
            select: { id: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Master data warehouse not found');
        }
        await this.prisma.masterDataWarehouse.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                deletedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
            },
        });
        return { success: true, message: 'Master data warehouse deleted' };
    }
};
exports.MasterDataWarehousesService = MasterDataWarehousesService;
exports.MasterDataWarehousesService = MasterDataWarehousesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MasterDataWarehousesService);
//# sourceMappingURL=master-data-warehouses.service.js.map