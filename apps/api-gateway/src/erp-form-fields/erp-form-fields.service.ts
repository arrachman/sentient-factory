import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SaveFormFieldsDto } from './dto/save-form-fields.dto';

// Default structural field configs per transaction-type code.
// Only keys that differ per type need separate entries — most fields are shared.
const CR_DEFAULTS = [
  { fieldKey: 'partnerId',     kind: 'STRUCTURAL', label: 'Terima Dari',  fieldType: 'PARTNER',   isRequired: true,  isVisible: true,  sortOrder: 0, columnSlot: 'LEFT'   },
  { fieldKey: 'bankAccountId', kind: 'STRUCTURAL', label: 'Akun Kas [D]', fieldType: 'ACCOUNT',   isRequired: true,  isVisible: true,  sortOrder: 1, columnSlot: 'LEFT',   lookupDefaultFilter: { accountType: 'ASSET', accountKind: 'POSTABLE', normalBalance: 'DEBIT', isActive: true } },
  { fieldKey: 'description',   kind: 'STRUCTURAL', label: 'Uraian',       fieldType: 'TEXT',      isRequired: true,  isVisible: true,  sortOrder: 2, columnSlot: 'LEFT'   },
  { fieldKey: 'branchId',      kind: 'STRUCTURAL', label: 'Cabang',       fieldType: 'BRANCH',    isRequired: true,  isVisible: true,  sortOrder: 3, columnSlot: 'CENTER' },
  { fieldKey: 'locationId',    kind: 'STRUCTURAL', label: 'Lokasi',       fieldType: 'LOCATION',  isRequired: false, isVisible: true,  sortOrder: 4, columnSlot: 'CENTER' },
  { fieldKey: 'transactionDate', kind: 'STRUCTURAL', label: 'Tanggal',     fieldType: 'DATE',      isRequired: true,  isVisible: true,  sortOrder: 5, columnSlot: 'RIGHT'  },
  { fieldKey: 'docNumber',     kind: 'STRUCTURAL', label: 'No Transaksi', fieldType: 'TEXT',      isRequired: false, isVisible: true,  sortOrder: 6, columnSlot: 'RIGHT'  },
  { fieldKey: 'currencyId',    kind: 'STRUCTURAL', label: 'Uang',         fieldType: 'CURRENCY',  isRequired: true,  isVisible: true,  sortOrder: 7, columnSlot: 'RIGHT'  },
];

const CD_DEFAULTS = CR_DEFAULTS.map((f) => {
  if (f.fieldKey === 'partnerId')     return { ...f, label: 'Bayar Ke' };
  if (f.fieldKey === 'bankAccountId') return { ...f, label: 'Akun Kas [K]' };
  return f;
});

const BD_DEFAULTS = CR_DEFAULTS.map((f) => {
  if (f.fieldKey === 'partnerId')     return { ...f, label: 'Bayar Ke' };
  if (f.fieldKey === 'bankAccountId') return { ...f, label: 'Akun Bank [K]' };
  return f;
});

const RM_DEFAULTS = CR_DEFAULTS.map((f) => {
  if (f.fieldKey === 'bankAccountId') return { ...f, label: 'Akun Bank [D]' };
  return f;
});

const DEFAULTS_BY_CODE: Record<string, typeof CR_DEFAULTS> = {
  'FIN.CR': CR_DEFAULTS,
  'FIN.CD': CD_DEFAULTS,
  'FIN.BD': BD_DEFAULTS,
  'FIN.RM': RM_DEFAULTS,
};

@Injectable()
export class ErpFormFieldsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Get form fields for a transaction type. Lazily seeds structural defaults if none exist. */
  async getFields(code: string) {
    let fields = await this.prisma.erpFormField.findMany({
      where: { transactionTypeCode: code, deletedAt: null },
      orderBy: { sortOrder: 'asc' },
    });

    if (fields.length === 0) {
      const defaults = DEFAULTS_BY_CODE[code] ?? CR_DEFAULTS;
      await this.prisma.erpFormField.createMany({
        data: defaults.map((d) => ({ ...d, transactionTypeCode: code })),
        skipDuplicates: true,
      });
      fields = await this.prisma.erpFormField.findMany({
        where: { transactionTypeCode: code, deletedAt: null },
        orderBy: { sortOrder: 'asc' },
      });
    } else {
      // Backfill lookupDefaultFilter for existing records that were seeded before
      // filter support was added (null = never set by admin; {} = admin explicitly cleared).
      const defaults = DEFAULTS_BY_CODE[code];
      if (defaults) {
        const toBackfill = fields.filter((f) => {
          if (f.lookupDefaultFilter !== null) return false;
          const def = defaults.find((d) => d.fieldKey === f.fieldKey);
          return def && 'lookupDefaultFilter' in def && def.lookupDefaultFilter != null;
        });
        if (toBackfill.length > 0) {
          await Promise.all(
            toBackfill.map((f) => {
              const def = defaults.find((d) => d.fieldKey === f.fieldKey)!;
              return this.prisma.erpFormField.update({
                where: { id: f.id },
                data: { lookupDefaultFilter: def.lookupDefaultFilter as Prisma.InputJsonValue },
              });
            }),
          );
          fields = await this.prisma.erpFormField.findMany({
            where: { transactionTypeCode: code, deletedAt: null },
            orderBy: { sortOrder: 'asc' },
          });
        }
      }
    }

    return { code, fields };
  }

  /** Replace all fields for a transaction type (bulk save). */
  async saveFields(code: string, dto: SaveFormFieldsDto, actorId?: string) {
    const updatedById = actorId ? BigInt(actorId) : null;
    const incomingKeys = new Set(dto.fields.map((f) => f.fieldKey));

    await this.prisma.$transaction(async (tx) => {
      // Soft-delete active fields that are no longer in the incoming list.
      await tx.erpFormField.updateMany({
        where: {
          transactionTypeCode: code,
          deletedAt: null,
          NOT: { fieldKey: { in: [...incomingKeys] } },
        },
        data: { deletedAt: new Date() },
      });

      // Upsert each incoming field — updates existing (restoring if soft-deleted), creates if new.
      for (const f of dto.fields) {
        const fieldData = {
          kind: f.kind,
          label: f.label,
          fieldType: f.fieldType,
          lookupSource: f.lookupSource ?? null,
          lookupDefaultFilter: (f.lookupDefaultFilter as Prisma.InputJsonValue) ?? Prisma.DbNull,
          lookupDefaultSort: f.lookupDefaultSort ?? null,
          isRequired: f.isRequired,
          isVisible: f.isVisible,
          sortOrder: f.sortOrder,
          columnSlot: f.columnSlot,
          updatedById,
          deletedAt: null,
        };
        await tx.erpFormField.upsert({
          where: { transactionTypeCode_fieldKey: { transactionTypeCode: code, fieldKey: f.fieldKey } },
          create: { transactionTypeCode: code, fieldKey: f.fieldKey, createdById: updatedById, ...fieldData },
          update: fieldData,
        });
      }
    });

    return this.getFields(code);
  }
}
