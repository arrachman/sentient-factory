import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SaveFormFieldsDto } from './dto/save-form-fields.dto';

// Default structural field configs per transaction-type code.
// Only keys that differ per type need separate entries — most fields are shared.
const CR_DEFAULTS = [
  { fieldKey: 'partnerId',     kind: 'STRUCTURAL', label: 'Terima Dari',  fieldType: 'PARTNER',   isRequired: true,  isVisible: true,  sortOrder: 0, columnSlot: 'LEFT'   },
  { fieldKey: 'bankAccountId', kind: 'STRUCTURAL', label: 'Akun Kas [D]', fieldType: 'ACCOUNT',   isRequired: true,  isVisible: true,  sortOrder: 1, columnSlot: 'LEFT'   },
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
    }

    return { code, fields };
  }

  /** Replace all fields for a transaction type (bulk save). */
  async saveFields(code: string, dto: SaveFormFieldsDto, actorId?: string) {
    const updatedById = actorId ? BigInt(actorId) : null;

    await this.prisma.$transaction(async (tx) => {
      // Soft-delete existing then upsert incoming to preserve IDs.
      await tx.erpFormField.updateMany({
        where: { transactionTypeCode: code, deletedAt: null },
        data: { deletedAt: new Date() },
      });

      await tx.erpFormField.createMany({
        data: dto.fields.map((f) => ({
          transactionTypeCode: code,
          fieldKey: f.fieldKey,
          kind: f.kind,
          label: f.label,
          fieldType: f.fieldType,
          lookupSource: f.lookupSource ?? null,
          isRequired: f.isRequired,
          isVisible: f.isVisible,
          sortOrder: f.sortOrder,
          columnSlot: f.columnSlot,
          updatedById,
          createdById: updatedById,
        })),
      });
    });

    return this.getFields(code);
  }
}
