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
exports.ErpPartnersService = void 0;
const common_1 = require("@nestjs/common");
const duplicate_util_1 = require("../common/errors/duplicate.util");
const prisma_service_1 = require("../prisma/prisma.service");
let ErpPartnersService = class ErpPartnersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, actorId) {
        const existing = await this.prisma.erpPartner.findFirst({
            where: { code: dto.code },
            select: { id: true, deletedAt: true },
        });
        if (existing) {
            (0, duplicate_util_1.throwDuplicate)({
                fieldLabel: 'Partner code',
                value: dto.code,
                isSoftDeleted: Boolean(existing.deletedAt),
            });
        }
        const actorBigInt = actorId ? BigInt(actorId) : null;
        const categoryBigInt = dto.categoryId ? BigInt(dto.categoryId) : null;
        let created;
        try {
            created = await this.prisma.erpPartner.create({
                data: {
                    code: dto.code,
                    name: dto.name,
                    categoryId: categoryBigInt,
                    isCustomer: dto.isCustomer ?? false,
                    isSupplier: dto.isSupplier ?? false,
                    isSalesman: dto.isSalesman ?? false,
                    taxNumber: dto.taxNumber,
                    isTaxable: dto.isTaxable ?? false,
                    isActive: dto.isActive ?? true,
                    createdById: actorBigInt,
                    updatedById: actorBigInt,
                },
            });
        }
        catch (error) {
            if ((0, duplicate_util_1.isUniqueViolation)(error, ['code', 'md_partners_code_key'])) {
                (0, duplicate_util_1.throwDuplicate)({ fieldLabel: 'Partner code', value: dto.code });
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
                { code: { contains: q, mode: 'insensitive' } },
                { name: { contains: q, mode: 'insensitive' } },
                { taxNumber: { contains: q, mode: 'insensitive' } },
            ];
        }
        if (query.categoryId !== undefined) {
            where.categoryId = BigInt(query.categoryId);
        }
        if (query.isCustomer !== undefined) {
            where.isCustomer = query.isCustomer;
        }
        if (query.isSupplier !== undefined) {
            where.isSupplier = query.isSupplier;
        }
        if (query.isActive !== undefined) {
            where.isActive = query.isActive;
        }
        const [items, total] = await this.prisma.$transaction([
            this.prisma.erpPartner.findMany({
                where,
                orderBy: [{ createdAt: 'desc' }],
                skip,
                take: limit,
                include: { category: { select: { id: true, code: true, name: true, kind: true } } },
            }),
            this.prisma.erpPartner.count({ where }),
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
        const item = await this.prisma.erpPartner.findFirst({
            where: { id, deletedAt: null },
            include: {
                category: { select: { id: true, code: true, name: true, kind: true } },
                addresses: { where: { deletedAt: null }, orderBy: { createdAt: 'asc' } },
                contacts: { where: { deletedAt: null }, orderBy: { createdAt: 'asc' } },
                bankAccounts: { where: { deletedAt: null }, orderBy: { createdAt: 'asc' } },
            },
        });
        if (!item) {
            throw new common_1.NotFoundException('ERP Partner not found');
        }
        return { success: true, data: item };
    }
    async update(id, dto, actorId) {
        const existing = await this.prisma.erpPartner.findFirst({
            where: { id, deletedAt: null },
        });
        if (!existing) {
            throw new common_1.NotFoundException('ERP Partner not found');
        }
        if (dto.code && dto.code !== existing.code) {
            const duplicate = await this.prisma.erpPartner.findFirst({
                where: { code: dto.code, NOT: { id } },
                select: { id: true, deletedAt: true },
            });
            if (duplicate) {
                (0, duplicate_util_1.throwDuplicate)({
                    fieldLabel: 'Partner code',
                    value: dto.code,
                    isSoftDeleted: Boolean(duplicate.deletedAt),
                });
            }
        }
        const actorBigInt = actorId ? BigInt(actorId) : null;
        const categoryBigInt = dto.categoryId !== undefined
            ? dto.categoryId
                ? BigInt(dto.categoryId)
                : null
            : undefined;
        let updated;
        try {
            updated = await this.prisma.erpPartner.update({
                where: { id },
                data: {
                    code: dto.code,
                    name: dto.name,
                    categoryId: categoryBigInt,
                    isCustomer: dto.isCustomer,
                    isSupplier: dto.isSupplier,
                    isSalesman: dto.isSalesman,
                    taxNumber: dto.taxNumber,
                    isTaxable: dto.isTaxable,
                    isActive: dto.isActive,
                    updatedById: actorBigInt,
                },
            });
        }
        catch (error) {
            if ((0, duplicate_util_1.isUniqueViolation)(error, ['code', 'md_partners_code_key'])) {
                (0, duplicate_util_1.throwDuplicate)({ fieldLabel: 'Partner code', value: dto.code ?? existing.code });
            }
            throw error;
        }
        return { success: true, data: updated };
    }
    async remove(id, actorId) {
        const existing = await this.prisma.erpPartner.findFirst({
            where: { id, deletedAt: null },
            select: { id: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('ERP Partner not found');
        }
        const actorBigInt = actorId ? BigInt(actorId) : null;
        await this.prisma.erpPartner.update({
            where: { id },
            data: { deletedAt: new Date(), updatedById: actorBigInt },
        });
        return { success: true, message: 'ERP Partner deleted' };
    }
    async addAddress(partnerId, dto, actorId) {
        await this.assertPartnerExists(partnerId);
        const actorBigInt = actorId ? BigInt(actorId) : null;
        const address = await this.prisma.erpPartnerAddress.create({
            data: {
                partnerId,
                type: dto.type,
                addressLine1: dto.addressLine1,
                addressLine2: dto.addressLine2,
                city: dto.city,
                province: dto.province,
                country: dto.country,
                postalCode: dto.postalCode,
                phone: dto.phone,
                fax: dto.fax,
                isDefault: dto.isDefault ?? false,
                createdById: actorBigInt,
                updatedById: actorBigInt,
            },
        });
        return { success: true, data: address };
    }
    async removeAddress(addressId, actorId) {
        const existing = await this.prisma.erpPartnerAddress.findFirst({
            where: { id: addressId, deletedAt: null },
            select: { id: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Partner address not found');
        }
        const actorBigInt = actorId ? BigInt(actorId) : null;
        await this.prisma.erpPartnerAddress.update({
            where: { id: addressId },
            data: { deletedAt: new Date(), updatedById: actorBigInt },
        });
        return { success: true, message: 'Partner address deleted' };
    }
    async addContact(partnerId, dto, actorId) {
        await this.assertPartnerExists(partnerId);
        const actorBigInt = actorId ? BigInt(actorId) : null;
        const contact = await this.prisma.erpPartnerContact.create({
            data: {
                partnerId,
                name: dto.name,
                title: dto.title,
                phone: dto.phone,
                email: dto.email,
                isDefault: dto.isDefault ?? false,
                createdById: actorBigInt,
                updatedById: actorBigInt,
            },
        });
        return { success: true, data: contact };
    }
    async removeContact(contactId, actorId) {
        const existing = await this.prisma.erpPartnerContact.findFirst({
            where: { id: contactId, deletedAt: null },
            select: { id: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Partner contact not found');
        }
        const actorBigInt = actorId ? BigInt(actorId) : null;
        await this.prisma.erpPartnerContact.update({
            where: { id: contactId },
            data: { deletedAt: new Date(), updatedById: actorBigInt },
        });
        return { success: true, message: 'Partner contact deleted' };
    }
    async addBankAccount(partnerId, dto, actorId) {
        await this.assertPartnerExists(partnerId);
        const actorBigInt = actorId ? BigInt(actorId) : null;
        const bankAccount = await this.prisma.erpPartnerBankAccount.create({
            data: {
                partnerId,
                bankName: dto.bankName,
                accountNumber: dto.accountNumber,
                accountHolder: dto.accountHolder,
                isDefault: dto.isDefault ?? false,
                createdById: actorBigInt,
                updatedById: actorBigInt,
            },
        });
        return { success: true, data: bankAccount };
    }
    async removeBankAccount(bankId, actorId) {
        const existing = await this.prisma.erpPartnerBankAccount.findFirst({
            where: { id: bankId, deletedAt: null },
            select: { id: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Partner bank account not found');
        }
        const actorBigInt = actorId ? BigInt(actorId) : null;
        await this.prisma.erpPartnerBankAccount.update({
            where: { id: bankId },
            data: { deletedAt: new Date(), updatedById: actorBigInt },
        });
        return { success: true, message: 'Partner bank account deleted' };
    }
    async assertPartnerExists(id) {
        const partner = await this.prisma.erpPartner.findFirst({
            where: { id, deletedAt: null },
            select: { id: true },
        });
        if (!partner) {
            throw new common_1.NotFoundException('ERP Partner not found');
        }
    }
};
exports.ErpPartnersService = ErpPartnersService;
exports.ErpPartnersService = ErpPartnersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ErpPartnersService);
//# sourceMappingURL=erp-partners.service.js.map