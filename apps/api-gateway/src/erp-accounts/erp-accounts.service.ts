import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUniqueViolation, throwDuplicate } from '../common/errors/duplicate.util';
import { PrismaService } from '../prisma/prisma.service';
import { toAuditUserId } from '../common/utils/audit-user.util';
import {
  AccountCodeFormat,
  buildAccountCodeFormat,
  parseSegments,
  parseSeparator,
  validateAccountCode,
} from './account-code-format';
import { BulkErpAccountDto, BulkStatusErpAccountDto } from './dto/bulk-erp-account.dto';
import { CreateErpAccountDto } from './dto/create-erp-account.dto';
import { QueryErpAccountDto } from './dto/query-erp-account.dto';
import { UpdateErpAccountDto } from './dto/update-erp-account.dto';

const SETTING_GROUP = 'account-code';
const KEY_SEGMENTS = 'account_code_segments';
const KEY_SEPARATOR = 'account_code_separator';

@Injectable()
export class ErpAccountsService {
  constructor(private prisma: PrismaService) {}

  async getCodeFormat(): Promise<{
    segments: number[];
    separator: string;
    patternSource: string;
    maxLength: number;
    example: string;
    accountCount: number;
    locked: boolean;
  }> {
    const format = await this.loadFormat();
    const accountCount = await this.prisma.erpAccount.count({
      where: { deletedAt: null },
    });
    return {
      segments: format.segments,
      separator: format.separator,
      patternSource: format.patternSource,
      maxLength: format.maxLength,
      example: format.example,
      accountCount,
      locked: accountCount > 0,
    };
  }

  async updateCodeFormat(
    segments: number[],
    separator: string,
    actorId?: string,
  ): Promise<{
    segments: number[];
    separator: string;
    patternSource: string;
    maxLength: number;
    example: string;
  }> {
    const accountCount = await this.prisma.erpAccount.count({
      where: { deletedAt: null },
    });
    if (accountCount > 0) {
      throw new ConflictException(
        `Format kode akun tidak bisa diubah: sudah ada ${accountCount} akun. Hapus semua akun dulu untuk reset format.`,
      );
    }
    const format = buildAccountCodeFormat(
      parseSegments(JSON.stringify(segments)),
      parseSeparator(separator),
    );
    const updatedById = toAuditUserId(actorId);
    const writes: Array<{ key: string; value: string; name: string }> = [
      {
        key: KEY_SEGMENTS,
        value: JSON.stringify(format.segments),
        name: 'Segmen Kode Akun',
      },
      {
        key: KEY_SEPARATOR,
        value: format.separator,
        name: 'Pemisah Segmen Kode Akun',
      },
    ];
    for (const w of writes) {
      await this.prisma.erpSetting.upsert({
        where: {
          module_group_key: {
            module: 'system',
            group: SETTING_GROUP,
            key: w.key,
          },
        },
        create: {
          module: 'system',
          group: SETTING_GROUP,
          key: w.key,
          name: w.name,
          value: w.value,
          dataType: w.key === KEY_SEGMENTS ? 'json' : 'string',
        },
        update: { value: w.value, updatedById },
      });
    }
    return {
      segments: format.segments,
      separator: format.separator,
      patternSource: format.patternSource,
      maxLength: format.maxLength,
      example: format.example,
    };
  }

  private async loadFormat(): Promise<AccountCodeFormat> {
    const rows = await this.prisma.erpSetting.findMany({
      where: {
        group: SETTING_GROUP,
        key: { in: [KEY_SEGMENTS, KEY_SEPARATOR] },
        deletedAt: null,
      },
    });
    const map = new Map(rows.map((r) => [r.key, r.value]));
    const segments = parseSegments(map.get(KEY_SEGMENTS));
    const separator = parseSeparator(map.get(KEY_SEPARATOR));
    return buildAccountCodeFormat(segments, separator);
  }

  async create(dto: CreateErpAccountDto, actorId?: string) {
    const format = await this.loadFormat();
    validateAccountCode(dto.code, format);

    const existing = await this.prisma.erpAccount.findFirst({
      where: { code: dto.code },
      select: { id: true, deletedAt: true },
    });
    if (existing) {
      throwDuplicate({
        fieldLabel: 'Account code',
        value: dto.code,
        isSoftDeleted: Boolean(existing.deletedAt),
      });
    }

    let created;
    try {
      created = await this.prisma.erpAccount.create({
        data: {
          code: dto.code,
          name: dto.name,
          alias: dto.alias,
          type: dto.accountType,
          kind: dto.accountKind,
          normalBalance: dto.normalBalance,
          cashFlowCategory: dto.cashFlowCategory,
          parentId: dto.parentId ? BigInt(dto.parentId) : null,
          currencyId: dto.currencyId ? BigInt(dto.currencyId) : null,
          level: dto.level ?? 1,
          isActive: dto.isActive ?? true,
          isControlAccount: dto.isControlAccount ?? false,
          bankName: dto.bankName,
          bankAccountNo: dto.bankAccountNo,
          notes: dto.notes,
          createdById: toAuditUserId(actorId),
          updatedById: toAuditUserId(actorId),
        },
      });
    } catch (error) {
      if (isUniqueViolation(error, ['code'])) {
        throwDuplicate({ fieldLabel: 'Account code', value: dto.code });
      }
      throw error;
    }

    return { success: true, data: created };
  }

  async findAll(query: QueryErpAccountDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ErpAccountWhereInput = { deletedAt: null };
    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { code: { equals: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
        { alias: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (query.accountType) {
      where.type = query.accountType;
    }
    if (query.accountKind) {
      where.kind = query.accountKind;
    }
    if (query.parentId !== undefined) {
      where.parentId = query.parentId === 'null' ? null : BigInt(query.parentId);
    }
    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.erpAccount.findMany({
        where,
        orderBy: [{ [query.sortBy ?? 'code']: query.sortDir ?? 'asc' }],
        skip,
        take: limit,
        include: { parent: { select: { id: true, code: true, name: true } } },
      }),
      this.prisma.erpAccount.count({ where }),
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
    const item = await this.prisma.erpAccount.findFirst({
      where: { id, deletedAt: null },
      include: {
        parent: { select: { id: true, code: true, name: true } },
        children: { where: { deletedAt: null }, select: { id: true, code: true, name: true } },
        currency: { select: { id: true, code: true, name: true, symbol: true } },
      },
    });
    if (!item) {
      throw new NotFoundException('Account not found');
    }
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdateErpAccountDto, actorId?: string) {
    const existing = await this.prisma.erpAccount.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) {
      throw new NotFoundException('Account not found');
    }

    if (dto.code && dto.code !== existing.code) {
      const format = await this.loadFormat();
      validateAccountCode(dto.code, format);
      const duplicate = await this.prisma.erpAccount.findFirst({
        where: { code: dto.code, NOT: { id } },
        select: { id: true, deletedAt: true },
      });
      if (duplicate) {
        throwDuplicate({
          fieldLabel: 'Account code',
          value: dto.code,
          isSoftDeleted: Boolean(duplicate.deletedAt),
        });
      }
    }

    let updated;
    try {
      updated = await this.prisma.erpAccount.update({
        where: { id },
        data: {
          code: dto.code,
          name: dto.name,
          alias: dto.alias,
          type: dto.accountType,
          kind: dto.accountKind,
          normalBalance: dto.normalBalance,
          cashFlowCategory: dto.cashFlowCategory,
          parentId:
            dto.parentId !== undefined ? (dto.parentId ? BigInt(dto.parentId) : null) : undefined,
          currencyId:
            dto.currencyId !== undefined
              ? dto.currencyId
                ? BigInt(dto.currencyId)
                : null
              : undefined,
          level: dto.level,
          isActive: dto.isActive,
          isControlAccount: dto.isControlAccount,
          bankName: dto.bankName,
          bankAccountNo: dto.bankAccountNo,
          notes: dto.notes,
          updatedById: toAuditUserId(actorId),
        },
      });
    } catch (error) {
      if (isUniqueViolation(error, ['code'])) {
        throwDuplicate({ fieldLabel: 'Account code', value: dto.code ?? existing.code });
      }
      throw error;
    }

    return { success: true, data: updated };
  }

  async bulkUpdateStatus(dto: BulkStatusErpAccountDto, actorId?: string) {
    const ids = dto.ids.map((id) => BigInt(id));
    const actorBigInt = actorId ? BigInt(actorId) : null;
    const { count } = await this.prisma.erpAccount.updateMany({
      where: { id: { in: ids }, deletedAt: null },
      data: { isActive: dto.isActive, updatedById: actorBigInt, updatedAt: new Date() },
    });
    return { success: true, affected: count };
  }

  async bulkDelete(dto: BulkErpAccountDto, actorId?: string) {
    const ids = dto.ids.map((id) => BigInt(id));
    const actorBigInt = actorId ? BigInt(actorId) : null;
    const { count } = await this.prisma.erpAccount.updateMany({
      where: { id: { in: ids }, deletedAt: null },
      data: { deletedAt: new Date(), updatedById: actorBigInt, updatedAt: new Date() },
    });
    return { success: true, affected: count };
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.erpAccount.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException('Account not found');
    }

    await this.prisma.erpAccount.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedById: toAuditUserId(actorId),
      },
    });

    return { success: true, message: 'Account deleted' };
  }
}
