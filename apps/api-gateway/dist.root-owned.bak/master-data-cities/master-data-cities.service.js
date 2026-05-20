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
exports.MasterDataCitiesService = void 0;
const common_1 = require("@nestjs/common");
const duplicate_util_1 = require("../common/errors/duplicate.util");
const prisma_service_1 = require("../prisma/prisma.service");
const audit_user_util_1 = require("../common/utils/audit-user.util");
let MasterDataCitiesService = class MasterDataCitiesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, actorId) {
        const provinceId = Number(dto.provinceId);
        if (!Number.isInteger(provinceId)) {
            throw new common_1.BadRequestException('Province ID is invalid');
        }
        const province = await this.prisma.masterDataProvince.findFirst({
            where: { id: provinceId, deletedAt: null },
            select: { id: true },
        });
        if (!province) {
            throw new common_1.BadRequestException('Province not found');
        }
        const existing = await this.prisma.masterDataCity.findFirst({
            where: {
                provinceId,
                name: dto.name,
                postalCode: dto.postalCode,
                deletedAt: null,
            },
            select: { id: true },
        });
        if (existing) {
            (0, duplicate_util_1.throwDuplicate)({ fieldLabel: 'City with same province, name, and postal code' });
        }
        const created = await this.prisma.masterDataCity.create({
            data: {
                provinceId,
                name: dto.name,
                postalCode: dto.postalCode,
                createdBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                updatedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
            },
            include: {
                province: { select: { id: true, name: true, isoCode: true } },
            },
        });
        return { success: true, data: created };
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;
        const where = { deletedAt: null };
        if (query.provinceId?.trim()) {
            const provinceId = Number(query.provinceId.trim());
            if (Number.isInteger(provinceId)) {
                where.provinceId = provinceId;
            }
        }
        if (query.search?.trim()) {
            const q = query.search.trim();
            where.OR = [
                { name: { contains: q, mode: 'insensitive' } },
                { postalCode: { contains: q, mode: 'insensitive' } },
                { province: { name: { contains: q, mode: 'insensitive' } } },
                { province: { isoCode: { contains: q, mode: 'insensitive' } } },
            ];
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.masterDataCity.findMany({
                where,
                include: {
                    province: { select: { id: true, name: true, isoCode: true } },
                },
                orderBy: [{ createdAt: 'desc' }],
                skip,
                take: limit,
            }),
            this.prisma.masterDataCity.count({ where }),
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
        const item = await this.prisma.masterDataCity.findFirst({
            where: { id, deletedAt: null },
            include: {
                province: { select: { id: true, name: true, isoCode: true } },
            },
        });
        if (!item) {
            throw new common_1.NotFoundException('Master data city not found');
        }
        return { success: true, data: item };
    }
    async update(id, dto, actorId) {
        const existing = await this.prisma.masterDataCity.findFirst({
            where: { id, deletedAt: null },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Master data city not found');
        }
        const nextProvinceId = dto.provinceId ? Number(dto.provinceId) : existing.provinceId;
        const nextName = dto.name ?? existing.name;
        const nextPostalCode = dto.postalCode ?? existing.postalCode;
        if (dto.provinceId) {
            if (!Number.isInteger(nextProvinceId)) {
                throw new common_1.BadRequestException('Province ID is invalid');
            }
            const province = await this.prisma.masterDataProvince.findFirst({
                where: { id: nextProvinceId, deletedAt: null },
                select: { id: true },
            });
            if (!province) {
                throw new common_1.BadRequestException('Province not found');
            }
        }
        const duplicate = await this.prisma.masterDataCity.findFirst({
            where: {
                provinceId: nextProvinceId,
                name: nextName,
                postalCode: nextPostalCode,
                deletedAt: null,
                NOT: { id },
            },
            select: { id: true },
        });
        if (duplicate) {
            (0, duplicate_util_1.throwDuplicate)({ fieldLabel: 'City with same province, name, and postal code' });
        }
        const updated = await this.prisma.masterDataCity.update({
            where: { id },
            data: {
                provinceId: dto.provinceId ? nextProvinceId : undefined,
                name: dto.name,
                postalCode: dto.postalCode,
                updatedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
            },
            include: {
                province: { select: { id: true, name: true, isoCode: true } },
            },
        });
        return { success: true, data: updated };
    }
    async remove(id, actorId) {
        const existing = await this.prisma.masterDataCity.findFirst({
            where: { id, deletedAt: null },
            select: { id: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Master data city not found');
        }
        await this.prisma.masterDataCity.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                deletedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
            },
        });
        return { success: true, message: 'Master data city deleted' };
    }
};
exports.MasterDataCitiesService = MasterDataCitiesService;
exports.MasterDataCitiesService = MasterDataCitiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MasterDataCitiesService);
//# sourceMappingURL=master-data-cities.service.js.map