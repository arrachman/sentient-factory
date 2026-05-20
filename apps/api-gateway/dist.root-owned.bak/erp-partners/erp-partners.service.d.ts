import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateErpPartnerDto } from './dto/create-erp-partner.dto';
import { QueryErpPartnerDto } from './dto/query-erp-partner.dto';
import { UpdateErpPartnerDto } from './dto/update-erp-partner.dto';
import { CreateErpPartnerAddressDto } from './dto/create-erp-partner-address.dto';
import { CreateErpPartnerContactDto } from './dto/create-erp-partner-contact.dto';
import { CreateErpPartnerBankAccountDto } from './dto/create-erp-partner-bank-account.dto';
export declare class ErpPartnersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateErpPartnerDto, actorId?: string): Promise<{
        success: boolean;
        data: {
            name: string;
            id: bigint;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            code: string;
            metadata: Prisma.JsonValue | null;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            branchId: bigint | null;
            categoryId: bigint | null;
            isCustomer: boolean;
            isSupplier: boolean;
            isSalesman: boolean;
            taxNumber: string | null;
            isTaxable: boolean;
            currencyId: bigint | null;
            receivableAccountId: bigint | null;
            payableAccountId: bigint | null;
            arCreditLimit: Prisma.Decimal | null;
            apCreditLimit: Prisma.Decimal | null;
            saleTermId: bigint | null;
            purchaseTermId: bigint | null;
            salesmanId: bigint | null;
            commissionRate: Prisma.Decimal | null;
        };
    }>;
    findAll(query: QueryErpPartnerDto): Promise<{
        success: boolean;
        data: ({
            category: {
                name: string;
                id: bigint;
                code: string;
                kind: import("@prisma/client").$Enums.ErpPartnerCategoryKind;
            } | null;
        } & {
            name: string;
            id: bigint;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            code: string;
            metadata: Prisma.JsonValue | null;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            branchId: bigint | null;
            categoryId: bigint | null;
            isCustomer: boolean;
            isSupplier: boolean;
            isSalesman: boolean;
            taxNumber: string | null;
            isTaxable: boolean;
            currencyId: bigint | null;
            receivableAccountId: bigint | null;
            payableAccountId: bigint | null;
            arCreditLimit: Prisma.Decimal | null;
            apCreditLimit: Prisma.Decimal | null;
            saleTermId: bigint | null;
            purchaseTermId: bigint | null;
            salesmanId: bigint | null;
            commissionRate: Prisma.Decimal | null;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: bigint): Promise<{
        success: boolean;
        data: {
            category: {
                name: string;
                id: bigint;
                code: string;
                kind: import("@prisma/client").$Enums.ErpPartnerCategoryKind;
            } | null;
            addresses: {
                id: bigint;
                phone: string | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                city: string | null;
                type: import("@prisma/client").$Enums.ErpAddressType;
                province: string | null;
                postalCode: string | null;
                isDefault: boolean;
                createdById: bigint | null;
                updatedById: bigint | null;
                addressLine1: string;
                addressLine2: string | null;
                fax: string | null;
                country: string | null;
                partnerId: bigint;
            }[];
            contacts: {
                name: string;
                id: bigint;
                email: string | null;
                phone: string | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                title: string | null;
                isDefault: boolean;
                createdById: bigint | null;
                updatedById: bigint | null;
                partnerId: bigint;
            }[];
            bankAccounts: {
                id: bigint;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                isDefault: boolean;
                createdById: bigint | null;
                updatedById: bigint | null;
                bankName: string;
                accountNumber: string;
                accountHolder: string | null;
                partnerId: bigint;
            }[];
        } & {
            name: string;
            id: bigint;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            code: string;
            metadata: Prisma.JsonValue | null;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            branchId: bigint | null;
            categoryId: bigint | null;
            isCustomer: boolean;
            isSupplier: boolean;
            isSalesman: boolean;
            taxNumber: string | null;
            isTaxable: boolean;
            currencyId: bigint | null;
            receivableAccountId: bigint | null;
            payableAccountId: bigint | null;
            arCreditLimit: Prisma.Decimal | null;
            apCreditLimit: Prisma.Decimal | null;
            saleTermId: bigint | null;
            purchaseTermId: bigint | null;
            salesmanId: bigint | null;
            commissionRate: Prisma.Decimal | null;
        };
    }>;
    update(id: bigint, dto: UpdateErpPartnerDto, actorId?: string): Promise<{
        success: boolean;
        data: {
            name: string;
            id: bigint;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            code: string;
            metadata: Prisma.JsonValue | null;
            legacyCode: string | null;
            createdById: bigint | null;
            updatedById: bigint | null;
            branchId: bigint | null;
            categoryId: bigint | null;
            isCustomer: boolean;
            isSupplier: boolean;
            isSalesman: boolean;
            taxNumber: string | null;
            isTaxable: boolean;
            currencyId: bigint | null;
            receivableAccountId: bigint | null;
            payableAccountId: bigint | null;
            arCreditLimit: Prisma.Decimal | null;
            apCreditLimit: Prisma.Decimal | null;
            saleTermId: bigint | null;
            purchaseTermId: bigint | null;
            salesmanId: bigint | null;
            commissionRate: Prisma.Decimal | null;
        };
    }>;
    remove(id: bigint, actorId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    addAddress(partnerId: bigint, dto: CreateErpPartnerAddressDto, actorId?: string): Promise<{
        success: boolean;
        data: {
            id: bigint;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            city: string | null;
            type: import("@prisma/client").$Enums.ErpAddressType;
            province: string | null;
            postalCode: string | null;
            isDefault: boolean;
            createdById: bigint | null;
            updatedById: bigint | null;
            addressLine1: string;
            addressLine2: string | null;
            fax: string | null;
            country: string | null;
            partnerId: bigint;
        };
    }>;
    removeAddress(addressId: bigint, actorId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    addContact(partnerId: bigint, dto: CreateErpPartnerContactDto, actorId?: string): Promise<{
        success: boolean;
        data: {
            name: string;
            id: bigint;
            email: string | null;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            title: string | null;
            isDefault: boolean;
            createdById: bigint | null;
            updatedById: bigint | null;
            partnerId: bigint;
        };
    }>;
    removeContact(contactId: bigint, actorId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    addBankAccount(partnerId: bigint, dto: CreateErpPartnerBankAccountDto, actorId?: string): Promise<{
        success: boolean;
        data: {
            id: bigint;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            isDefault: boolean;
            createdById: bigint | null;
            updatedById: bigint | null;
            bankName: string;
            accountNumber: string;
            accountHolder: string | null;
            partnerId: bigint;
        };
    }>;
    removeBankAccount(bankId: bigint, actorId?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private assertPartnerExists;
}
