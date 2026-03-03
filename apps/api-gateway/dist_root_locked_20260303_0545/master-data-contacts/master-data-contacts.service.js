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
exports.MasterDataContactsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const audit_user_util_1 = require("../common/utils/audit-user.util");
const duplicate_util_1 = require("../common/errors/duplicate.util");
let MasterDataContactsService = class MasterDataContactsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, actorId) {
        const existing = await this.prisma.masterDataContact.findFirst({
            where: { code: dto.code },
            select: { id: true, deletedAt: true },
        });
        if (existing) {
            (0, duplicate_util_1.throwDuplicate)({
                fieldLabel: 'Contact code',
                value: dto.code,
                isSoftDeleted: Boolean(existing.deletedAt),
            });
        }
        const data = {
            code: dto.code,
            name: dto.name,
            tax: dto.tax ?? null,
            website: dto.website ?? null,
            address: dto.address ?? null,
            street: dto.street ?? null,
            city: dto.city ?? null,
            province: dto.province ?? null,
            zipCode: dto.zipCode ?? null,
            type: dto.type,
            contactFirstName: dto.contactFirstName ?? null,
            contactEmail: dto.contactEmail ?? null,
            contactPhone: dto.contactPhone ?? null,
            createdBy: (0, audit_user_util_1.toAuditUserId)(actorId),
            updatedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
        };
        let created;
        try {
            created = await this.prisma.masterDataContact.create({ data });
        }
        catch (error) {
            if ((0, duplicate_util_1.isUniqueViolation)(error, ['code', 'm1_contact_code_key'])) {
                (0, duplicate_util_1.throwDuplicate)({
                    fieldLabel: 'Contact code',
                    value: dto.code,
                });
            }
            throw error;
        }
        return { success: true, data: created };
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const skip = (page - 1) * limit;
        const where = {
            deletedAt: null,
        };
        if (query.type) {
            where.type = query.type;
        }
        if (query.search?.trim()) {
            const q = query.search.trim();
            where.OR = [
                { code: { contains: q, mode: 'insensitive' } },
                { name: { contains: q, mode: 'insensitive' } },
                { city: { contains: q, mode: 'insensitive' } },
                { province: { contains: q, mode: 'insensitive' } },
                { contactFirstName: { contains: q, mode: 'insensitive' } },
                { contactEmail: { contains: q, mode: 'insensitive' } },
            ];
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.masterDataContact.findMany({
                where,
                orderBy: [{ createdAt: 'desc' }],
                skip,
                take: limit,
            }),
            this.prisma.masterDataContact.count({ where }),
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
        const item = await this.prisma.masterDataContact.findFirst({
            where: { id, deletedAt: null },
        });
        if (!item) {
            throw new common_1.NotFoundException('Master data contact not found');
        }
        return { success: true, data: item };
    }
    async update(id, dto, actorId) {
        const existing = await this.prisma.masterDataContact.findFirst({
            where: { id, deletedAt: null },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Master data contact not found');
        }
        if (dto.code && dto.code !== existing.code) {
            const duplicate = await this.prisma.masterDataContact.findFirst({
                where: { code: dto.code, NOT: { id } },
                select: { id: true, deletedAt: true },
            });
            if (duplicate) {
                (0, duplicate_util_1.throwDuplicate)({
                    fieldLabel: 'Contact code',
                    value: dto.code,
                    isSoftDeleted: Boolean(duplicate.deletedAt),
                });
            }
        }
        let updated;
        try {
            updated = await this.prisma.masterDataContact.update({
                where: { id },
                data: {
                    code: dto.code,
                    name: dto.name,
                    tax: dto.tax,
                    website: dto.website,
                    address: dto.address,
                    street: dto.street,
                    city: dto.city,
                    province: dto.province,
                    zipCode: dto.zipCode,
                    type: dto.type,
                    contactFirstName: dto.contactFirstName,
                    contactEmail: dto.contactEmail,
                    contactPhone: dto.contactPhone,
                    updatedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                },
            });
        }
        catch (error) {
            if ((0, duplicate_util_1.isUniqueViolation)(error, ['code', 'm1_contact_code_key'])) {
                (0, duplicate_util_1.throwDuplicate)({
                    fieldLabel: 'Contact code',
                    value: dto.code ?? existing.code,
                });
            }
            throw error;
        }
        return { success: true, data: updated };
    }
    async remove(id, actorId) {
        const existing = await this.prisma.masterDataContact.findFirst({
            where: { id, deletedAt: null },
            select: { id: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Master data contact not found');
        }
        await this.prisma.masterDataContact.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                deletedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
            },
        });
        return { success: true, message: 'Master data contact deleted' };
    }
};
exports.MasterDataContactsService = MasterDataContactsService;
exports.MasterDataContactsService = MasterDataContactsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MasterDataContactsService);
//# sourceMappingURL=master-data-contacts.service.js.map