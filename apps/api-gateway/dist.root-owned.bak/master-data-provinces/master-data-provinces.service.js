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
exports.MasterDataProvincesService = void 0;
const common_1 = require("@nestjs/common");
const duplicate_util_1 = require("../common/errors/duplicate.util");
const prisma_service_1 = require("../prisma/prisma.service");
const audit_user_util_1 = require("../common/utils/audit-user.util");
let MasterDataProvincesService = class MasterDataProvincesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, actorId) {
        const existingIso = await this.prisma.masterDataProvince.findFirst({
            where: { isoCode: dto.isoCode },
            select: { id: true, deletedAt: true },
        });
        if (existingIso) {
            (0, duplicate_util_1.throwDuplicate)({
                fieldLabel: 'Province ISO code',
                value: dto.isoCode,
                isSoftDeleted: Boolean(existingIso.deletedAt),
            });
        }
        let created;
        try {
            created = await this.prisma.masterDataProvince.create({
                data: {
                    name: dto.name,
                    isoCode: dto.isoCode,
                    createdBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                    updatedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                },
            });
        }
        catch (error) {
            if ((0, duplicate_util_1.isUniqueViolation)(error, ['isoCode', 'iso_code', 'm1_province_iso_code_key'])) {
                (0, duplicate_util_1.throwDuplicate)({ fieldLabel: 'Province ISO code', value: dto.isoCode });
            }
            throw error;
        }
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
                { isoCode: { contains: q, mode: 'insensitive' } },
            ];
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.masterDataProvince.findMany({
                where,
                orderBy: [{ createdAt: 'desc' }],
                skip,
                take: limit,
            }),
            this.prisma.masterDataProvince.count({ where }),
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
        const item = await this.prisma.masterDataProvince.findFirst({
            where: { id, deletedAt: null },
        });
        if (!item) {
            throw new common_1.NotFoundException('Master data province not found');
        }
        return { success: true, data: item };
    }
    async update(id, dto, actorId) {
        const existing = await this.prisma.masterDataProvince.findFirst({
            where: { id, deletedAt: null },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Master data province not found');
        }
        if (dto.isoCode && dto.isoCode !== existing.isoCode) {
            const duplicate = await this.prisma.masterDataProvince.findFirst({
                where: { isoCode: dto.isoCode, NOT: { id } },
                select: { id: true, deletedAt: true },
            });
            if (duplicate) {
                (0, duplicate_util_1.throwDuplicate)({
                    fieldLabel: 'Province ISO code',
                    value: dto.isoCode,
                    isSoftDeleted: Boolean(duplicate.deletedAt),
                });
            }
        }
        let updated;
        try {
            updated = await this.prisma.masterDataProvince.update({
                where: { id },
                data: {
                    name: dto.name,
                    isoCode: dto.isoCode,
                    updatedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                },
            });
        }
        catch (error) {
            if ((0, duplicate_util_1.isUniqueViolation)(error, ['isoCode', 'iso_code', 'm1_province_iso_code_key'])) {
                (0, duplicate_util_1.throwDuplicate)({ fieldLabel: 'Province ISO code', value: dto.isoCode ?? existing.isoCode });
            }
            throw error;
        }
        return { success: true, data: updated };
    }
    async remove(id, actorId) {
        const existing = await this.prisma.masterDataProvince.findFirst({
            where: { id, deletedAt: null },
            select: { id: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Master data province not found');
        }
        await this.prisma.masterDataProvince.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                deletedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
            },
        });
        return { success: true, message: 'Master data province deleted' };
    }
};
exports.MasterDataProvincesService = MasterDataProvincesService;
exports.MasterDataProvincesService = MasterDataProvincesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MasterDataProvincesService);
//# sourceMappingURL=master-data-provinces.service.js.map