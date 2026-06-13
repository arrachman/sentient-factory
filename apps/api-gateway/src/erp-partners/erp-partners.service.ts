import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUniqueViolation, throwDuplicate } from '../common/errors/duplicate.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateErpPartnerDto } from './dto/create-erp-partner.dto';
import { QueryErpPartnerDto } from './dto/query-erp-partner.dto';
import { UpdateErpPartnerDto } from './dto/update-erp-partner.dto';
import { CreateErpPartnerAddressDto } from './dto/create-erp-partner-address.dto';
import { CreateErpPartnerContactDto } from './dto/create-erp-partner-contact.dto';
import { CreateErpPartnerBankAccountDto } from './dto/create-erp-partner-bank-account.dto';

// Multi-select dimension junctions (md_partner_dim_*) — selected for read so the
// edit form can prefill the chips.
const PARTNER_DIM_INCLUDE = {
  dimBranches: {
    select: { branchId: true, branch: { select: { id: true, code: true, name: true } } },
    orderBy: { id: 'asc' as const },
  },
  dimWarehouses: {
    select: { warehouseId: true, warehouse: { select: { id: true, code: true, name: true } } },
    orderBy: { id: 'asc' as const },
  },
  dimLocations: {
    select: { locationId: true, location: { select: { id: true, code: true, name: true } } },
    orderBy: { id: 'asc' as const },
  },
} as const;

const PARTNER_TRX_INCLUDE = {
  currency: { select: { id: true, code: true, name: true, symbol: true } },
  saleTerm: { select: { id: true, code: true, name: true } },
  purchaseTerm: { select: { id: true, code: true, name: true } },
} as const;

const PARTNER_REF_INCLUDE = {
  salesman: { select: { id: true, code: true, name: true } },
} as const;

/** Build junction rows for one multi-select dimension. */
function buildDimRows<K extends string>(
  ids: string[] | undefined,
  key: K,
): Record<K, bigint>[] | undefined {
  if (!ids) return undefined;
  const unique = Array.from(new Set(ids.filter((v) => v !== '')));
  return unique.map((v) => ({ [key]: BigInt(v) }) as Record<K, bigint>);
}

/**
 * Denormalized single branch column = first branch id of the array (legacy
 * fallback). Returns undefined when the array was not sent (no change).
 */
function firstBranchSync(branchIds: string[] | undefined): bigint | null | undefined {
  if (branchIds === undefined) return undefined;
  const f = branchIds.find((v) => v !== '');
  return f ? BigInt(f) : null;
}

@Injectable()
export class ErpPartnersService {
  constructor(private readonly prisma: PrismaService) {}

  // ---------------------------------------------------------------------------
  // Partner CRUD
  // ---------------------------------------------------------------------------

  async create(dto: CreateErpPartnerDto, actorId?: string) {
    const existing = await this.prisma.erpPartner.findFirst({
      where: { code: dto.code },
      select: { id: true, deletedAt: true },
    });
    if (existing) {
      throwDuplicate({
        fieldLabel: 'Partner code',
        value: dto.code,
        isSoftDeleted: Boolean(existing.deletedAt),
      });
    }

    const actorBigInt = actorId ? BigInt(actorId) : null;
    const categoryBigInt = dto.categoryId ? BigInt(dto.categoryId) : null;
    const customerCatBigInt = dto.customerCategoryId ? BigInt(dto.customerCategoryId) : null;
    const supplierCatBigInt = dto.supplierCategoryId ? BigInt(dto.supplierCategoryId) : null;
    const salesmanCatBigInt = dto.salesmanCategoryId ? BigInt(dto.salesmanCategoryId) : null;
    const salesmanBigInt = dto.salesmanId ? BigInt(dto.salesmanId) : null;
    const receivableBigInt = dto.receivableAccountId ? BigInt(dto.receivableAccountId) : null;
    const payableBigInt = dto.payableAccountId ? BigInt(dto.payableAccountId) : null;
    const currencyBigInt = dto.currencyId ? BigInt(dto.currencyId) : null;
    const saleTermBigInt = dto.saleTermId ? BigInt(dto.saleTermId) : null;
    const purchaseTermBigInt = dto.purchaseTermId ? BigInt(dto.purchaseTermId) : null;

    let created;
    try {
      created = await this.prisma.erpPartner.create({
        data: {
          code: dto.code,
          name: dto.name,
          categoryId: categoryBigInt,
          customerCategoryId: customerCatBigInt,
          supplierCategoryId: supplierCatBigInt,
          salesmanCategoryId: salesmanCatBigInt,
          salesmanId: salesmanBigInt,
          isCustomer: dto.isCustomer ?? false,
          isSupplier: dto.isSupplier ?? false,
          isSalesman: dto.isSalesman ?? false,
          taxNumber: dto.taxNumber,
          isTaxable: dto.isTaxable ?? false,
          receivableAccountId: receivableBigInt,
          payableAccountId: payableBigInt,
          currencyId: currencyBigInt,
          saleTermId: saleTermBigInt,
          purchaseTermId: purchaseTermBigInt,
          arCreditLimit: dto.arCreditLimit ?? undefined,
          apCreditLimit: dto.apCreditLimit ?? undefined,
          salesPriceTier: dto.salesPriceTier ?? 1,
          branchId: firstBranchSync(dto.branchIds) ?? null,
          isActive: dto.isActive ?? true,
          createdById: actorBigInt,
          updatedById: actorBigInt,
          ...(buildDimRows(dto.branchIds, 'branchId')
            ? { dimBranches: { create: buildDimRows(dto.branchIds, 'branchId') } }
            : {}),
          ...(buildDimRows(dto.warehouseIds, 'warehouseId')
            ? { dimWarehouses: { create: buildDimRows(dto.warehouseIds, 'warehouseId') } }
            : {}),
          ...(buildDimRows(dto.locationIds, 'locationId')
            ? { dimLocations: { create: buildDimRows(dto.locationIds, 'locationId') } }
            : {}),
        },
        include: { ...PARTNER_DIM_INCLUDE, ...PARTNER_TRX_INCLUDE, ...PARTNER_REF_INCLUDE },
      });
    } catch (error) {
      if (isUniqueViolation(error, ['code', 'md_partners_code_key'])) {
        throwDuplicate({ fieldLabel: 'Partner code', value: dto.code });
      }
      throw error;
    }

    return { success: true, data: created };
  }

  async findAll(query: QueryErpPartnerDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ErpPartnerWhereInput = { deletedAt: null };

    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { code: { equals: q, mode: 'insensitive' } },
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

    if (query.isSalesman !== undefined) {
      where.isSalesman = query.isSalesman;
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    const sortBy = query.sortBy ?? 'createdAt';
    const sortDir = query.sortDir ?? 'desc';

    const [items, total] = await this.prisma.$transaction([
      this.prisma.erpPartner.findMany({
        where,
        orderBy: [{ [sortBy]: sortDir }],
        skip,
        take: limit,
        include: {
          category: { select: { id: true, code: true, name: true, kind: true, salesTier: true } },
          customerCategory: { select: { id: true, code: true, name: true } },
          supplierCategory: { select: { id: true, code: true, name: true } },
          salesmanCategory: { select: { id: true, code: true, name: true } },
          receivableAccount: { select: { id: true, code: true, name: true } },
          payableAccount: { select: { id: true, code: true, name: true } },
          ...PARTNER_DIM_INCLUDE,
          ...PARTNER_TRX_INCLUDE,
          ...PARTNER_REF_INCLUDE,
        },
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

  async findOne(id: bigint) {
    const item = await this.prisma.erpPartner.findFirst({
      where: { id, deletedAt: null },
      include: {
        category: { select: { id: true, code: true, name: true, kind: true, salesTier: true } },
        customerCategory: { select: { id: true, code: true, name: true } },
        supplierCategory: { select: { id: true, code: true, name: true } },
        salesmanCategory: { select: { id: true, code: true, name: true } },
        receivableAccount: { select: { id: true, code: true, name: true } },
        payableAccount: { select: { id: true, code: true, name: true } },
        addresses: { where: { deletedAt: null }, orderBy: { createdAt: 'asc' } },
        contacts: { where: { deletedAt: null }, orderBy: { createdAt: 'asc' } },
        bankAccounts: { where: { deletedAt: null }, orderBy: { createdAt: 'asc' } },
        ...PARTNER_DIM_INCLUDE,
        ...PARTNER_TRX_INCLUDE,
        ...PARTNER_REF_INCLUDE,
      },
    });
    if (!item) {
      throw new NotFoundException('ERP Partner not found');
    }
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdateErpPartnerDto, actorId?: string) {
    const existing = await this.prisma.erpPartner.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) {
      throw new NotFoundException('ERP Partner not found');
    }

    if (dto.code && dto.code !== existing.code) {
      const duplicate = await this.prisma.erpPartner.findFirst({
        where: { code: dto.code, NOT: { id } },
        select: { id: true, deletedAt: true },
      });
      if (duplicate) {
        throwDuplicate({
          fieldLabel: 'Partner code',
          value: dto.code,
          isSoftDeleted: Boolean(duplicate.deletedAt),
        });
      }
    }

    const actorBigInt = actorId ? BigInt(actorId) : null;
    const categoryBigInt =
      dto.categoryId !== undefined ? (dto.categoryId ? BigInt(dto.categoryId) : null) : undefined;
    const customerCatBigInt =
      dto.customerCategoryId !== undefined
        ? dto.customerCategoryId
          ? BigInt(dto.customerCategoryId)
          : null
        : undefined;
    const supplierCatBigInt =
      dto.supplierCategoryId !== undefined
        ? dto.supplierCategoryId
          ? BigInt(dto.supplierCategoryId)
          : null
        : undefined;
    const salesmanCatBigInt =
      dto.salesmanCategoryId !== undefined
        ? dto.salesmanCategoryId
          ? BigInt(dto.salesmanCategoryId)
          : null
        : undefined;
    const salesmanBigInt =
      dto.salesmanId !== undefined ? (dto.salesmanId ? BigInt(dto.salesmanId) : null) : undefined;
    const receivableBigInt =
      dto.receivableAccountId !== undefined
        ? dto.receivableAccountId
          ? BigInt(dto.receivableAccountId)
          : null
        : undefined;
    const payableBigInt =
      dto.payableAccountId !== undefined
        ? dto.payableAccountId
          ? BigInt(dto.payableAccountId)
          : null
        : undefined;
    const currencyBigInt =
      dto.currencyId !== undefined ? (dto.currencyId ? BigInt(dto.currencyId) : null) : undefined;
    const saleTermBigInt =
      dto.saleTermId !== undefined ? (dto.saleTermId ? BigInt(dto.saleTermId) : null) : undefined;
    const purchaseTermBigInt =
      dto.purchaseTermId !== undefined
        ? dto.purchaseTermId
          ? BigInt(dto.purchaseTermId)
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
          customerCategoryId: customerCatBigInt,
          supplierCategoryId: supplierCatBigInt,
          salesmanCategoryId: salesmanCatBigInt,
          salesmanId: salesmanBigInt,
          isCustomer: dto.isCustomer,
          isSupplier: dto.isSupplier,
          isSalesman: dto.isSalesman,
          taxNumber: dto.taxNumber,
          isTaxable: dto.isTaxable,
          receivableAccountId: receivableBigInt,
          payableAccountId: payableBigInt,
          currencyId: currencyBigInt,
          saleTermId: saleTermBigInt,
          purchaseTermId: purchaseTermBigInt,
          arCreditLimit: dto.arCreditLimit !== undefined ? dto.arCreditLimit : undefined,
          apCreditLimit: dto.apCreditLimit !== undefined ? dto.apCreditLimit : undefined,
          salesPriceTier: dto.salesPriceTier !== undefined ? dto.salesPriceTier : undefined,
          branchId: firstBranchSync(dto.branchIds),
          isActive: dto.isActive,
          updatedById: actorBigInt,
          ...(dto.branchIds !== undefined
            ? { dimBranches: { deleteMany: {}, create: buildDimRows(dto.branchIds, 'branchId') } }
            : {}),
          ...(dto.warehouseIds !== undefined
            ? {
                dimWarehouses: {
                  deleteMany: {},
                  create: buildDimRows(dto.warehouseIds, 'warehouseId'),
                },
              }
            : {}),
          ...(dto.locationIds !== undefined
            ? {
                dimLocations: {
                  deleteMany: {},
                  create: buildDimRows(dto.locationIds, 'locationId'),
                },
              }
            : {}),
        },
        include: { ...PARTNER_DIM_INCLUDE, ...PARTNER_TRX_INCLUDE, ...PARTNER_REF_INCLUDE },
      });
    } catch (error) {
      if (isUniqueViolation(error, ['code', 'md_partners_code_key'])) {
        throwDuplicate({ fieldLabel: 'Partner code', value: dto.code ?? existing.code });
      }
      throw error;
    }

    return { success: true, data: updated };
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.erpPartner.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException('ERP Partner not found');
    }

    const actorBigInt = actorId ? BigInt(actorId) : null;

    await this.prisma.erpPartner.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: actorBigInt },
    });

    return { success: true, message: 'ERP Partner deleted' };
  }

  // ---------------------------------------------------------------------------
  // Addresses
  // ---------------------------------------------------------------------------

  async addAddress(partnerId: bigint, dto: CreateErpPartnerAddressDto, actorId?: string) {
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
        email: dto.email,
        website: dto.website,
        isDefault: dto.isDefault ?? false,
        createdById: actorBigInt,
        updatedById: actorBigInt,
      },
    });

    return { success: true, data: address };
  }

  async removeAddress(addressId: bigint, actorId?: string) {
    const existing = await this.prisma.erpPartnerAddress.findFirst({
      where: { id: addressId, deletedAt: null },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException('Partner address not found');
    }

    const actorBigInt = actorId ? BigInt(actorId) : null;

    await this.prisma.erpPartnerAddress.update({
      where: { id: addressId },
      data: { deletedAt: new Date(), updatedById: actorBigInt },
    });

    return { success: true, message: 'Partner address deleted' };
  }

  // ---------------------------------------------------------------------------
  // Contacts
  // ---------------------------------------------------------------------------

  async addContact(partnerId: bigint, dto: CreateErpPartnerContactDto, actorId?: string) {
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

  async removeContact(contactId: bigint, actorId?: string) {
    const existing = await this.prisma.erpPartnerContact.findFirst({
      where: { id: contactId, deletedAt: null },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException('Partner contact not found');
    }

    const actorBigInt = actorId ? BigInt(actorId) : null;

    await this.prisma.erpPartnerContact.update({
      where: { id: contactId },
      data: { deletedAt: new Date(), updatedById: actorBigInt },
    });

    return { success: true, message: 'Partner contact deleted' };
  }

  // ---------------------------------------------------------------------------
  // Bank Accounts
  // ---------------------------------------------------------------------------

  async addBankAccount(partnerId: bigint, dto: CreateErpPartnerBankAccountDto, actorId?: string) {
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

  async removeBankAccount(bankId: bigint, actorId?: string) {
    const existing = await this.prisma.erpPartnerBankAccount.findFirst({
      where: { id: bankId, deletedAt: null },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException('Partner bank account not found');
    }

    const actorBigInt = actorId ? BigInt(actorId) : null;

    await this.prisma.erpPartnerBankAccount.update({
      where: { id: bankId },
      data: { deletedAt: new Date(), updatedById: actorBigInt },
    });

    return { success: true, message: 'Partner bank account deleted' };
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private async assertPartnerExists(id: bigint): Promise<void> {
    const partner = await this.prisma.erpPartner.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!partner) {
      throw new NotFoundException('ERP Partner not found');
    }
  }
}
