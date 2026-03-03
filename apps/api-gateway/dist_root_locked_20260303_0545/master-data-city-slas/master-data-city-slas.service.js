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
exports.MasterDataCitySlasService = void 0;
const common_1 = require("@nestjs/common");
const duplicate_util_1 = require("../common/errors/duplicate.util");
const prisma_service_1 = require("../prisma/prisma.service");
const audit_user_util_1 = require("../common/utils/audit-user.util");
let MasterDataCitySlasService = class MasterDataCitySlasService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, actorId) {
        const cityId = this.parseCityId(dto.cityId);
        await this.ensureCityExists(cityId);
        const existing = await this.prisma.masterDataCitySla.findFirst({
            where: { cityId, deletedAt: null },
            select: { id: true },
        });
        if (existing) {
            (0, duplicate_util_1.throwDuplicate)({ fieldLabel: 'SLA for this city' });
        }
        const created = await this.prisma.masterDataCitySla.create({
            data: {
                cityId,
                stdLeadTimeDays: dto.stdLeadTimeDays,
                stdReturnDoDays: dto.stdReturnDoDays,
                createdBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                updatedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
            },
            include: {
                city: {
                    select: {
                        id: true,
                        name: true,
                        postalCode: true,
                        province: { select: { id: true, name: true, isoCode: true } },
                    },
                },
            },
        });
        return { success: true, data: created };
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;
        const where = {
            deletedAt: null,
            city: {
                deletedAt: null,
                province: {
                    deletedAt: null,
                },
            },
        };
        if (query.cityId?.trim()) {
            const cityId = Number(query.cityId.trim());
            if (Number.isInteger(cityId)) {
                where.cityId = cityId;
            }
        }
        if (query.search?.trim()) {
            const q = query.search.trim();
            where.OR = [
                { city: { name: { contains: q, mode: 'insensitive' } } },
                { city: { postalCode: { contains: q, mode: 'insensitive' } } },
                { city: { province: { name: { contains: q, mode: 'insensitive' } } } },
                { city: { province: { isoCode: { contains: q, mode: 'insensitive' } } } },
            ];
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.masterDataCitySla.findMany({
                where,
                include: {
                    city: {
                        select: {
                            id: true,
                            name: true,
                            postalCode: true,
                            province: { select: { id: true, name: true, isoCode: true } },
                        },
                    },
                },
                orderBy: [{ createdAt: 'desc' }],
                skip,
                take: limit,
            }),
            this.prisma.masterDataCitySla.count({ where }),
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
        const item = await this.prisma.masterDataCitySla.findFirst({
            where: { id, deletedAt: null },
            include: {
                city: {
                    select: {
                        id: true,
                        name: true,
                        postalCode: true,
                        province: { select: { id: true, name: true, isoCode: true } },
                    },
                },
            },
        });
        if (!item) {
            throw new common_1.NotFoundException('Master data city SLA not found');
        }
        return { success: true, data: item };
    }
    async update(id, dto, actorId) {
        const existing = await this.prisma.masterDataCitySla.findFirst({
            where: { id, deletedAt: null },
            select: { id: true, cityId: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Master data city SLA not found');
        }
        const nextCityId = dto.cityId ? this.parseCityId(dto.cityId) : existing.cityId;
        await this.ensureCityExists(nextCityId);
        if (nextCityId !== existing.cityId) {
            const duplicate = await this.prisma.masterDataCitySla.findFirst({
                where: {
                    cityId: nextCityId,
                    deletedAt: null,
                    NOT: { id },
                },
                select: { id: true },
            });
            if (duplicate) {
                (0, duplicate_util_1.throwDuplicate)({ fieldLabel: 'SLA for this city' });
            }
        }
        const updated = await this.prisma.masterDataCitySla.update({
            where: { id },
            data: {
                cityId: dto.cityId ? nextCityId : undefined,
                stdLeadTimeDays: dto.stdLeadTimeDays,
                stdReturnDoDays: dto.stdReturnDoDays,
                updatedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
            },
            include: {
                city: {
                    select: {
                        id: true,
                        name: true,
                        postalCode: true,
                        province: { select: { id: true, name: true, isoCode: true } },
                    },
                },
            },
        });
        return { success: true, data: updated };
    }
    async remove(id, actorId) {
        const existing = await this.prisma.masterDataCitySla.findFirst({
            where: { id, deletedAt: null },
            select: { id: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Master data city SLA not found');
        }
        await this.prisma.masterDataCitySla.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                deletedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
            },
        });
        return { success: true, message: 'Master data city SLA deleted' };
    }
    parseCityId(cityId) {
        const parsed = Number(cityId);
        if (!Number.isInteger(parsed)) {
            throw new common_1.BadRequestException('City ID is invalid');
        }
        return parsed;
    }
    async ensureCityExists(cityId) {
        const city = await this.prisma.masterDataCity.findFirst({
            where: { id: cityId, deletedAt: null },
            select: { id: true },
        });
        if (!city) {
            throw new common_1.BadRequestException('City not found');
        }
    }
};
exports.MasterDataCitySlasService = MasterDataCitySlasService;
exports.MasterDataCitySlasService = MasterDataCitySlasService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MasterDataCitySlasService);
//# sourceMappingURL=master-data-city-slas.service.js.map