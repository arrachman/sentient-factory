import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SaveGridColumnsDto } from './dto/save-grid-columns.dto';

@Injectable()
export class ErpSysTransactionGridsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Flat list of active transaction types (FE builds the module→transaction tree). */
  listTypes() {
    return this.prisma.erpTransactionType.findMany({
      where: { isActive: true, deletedAt: null },
      orderBy: { sortOrder: 'asc' },
    });
  }

  private async typeByCode(code: string) {
    const type = await this.prisma.erpTransactionType.findFirst({
      where: { code, deletedAt: null },
    });
    if (!type) throw new NotFoundException(`Jenis transaksi "${code}" tidak ditemukan`);
    return type;
  }

  async getColumns(code: string) {
    const type = await this.typeByCode(code);
    const columns = await this.prisma.erpTransactionGridColumn.findMany({
      where: { transactionTypeId: type.id, deletedAt: null },
      orderBy: { sortOrder: 'asc' },
    });
    return { type, columns };
  }

  /** Replace the full column set for a transaction type (bulk save from the editor). */
  async saveColumns(code: string, dto: SaveGridColumnsDto, actorId?: string) {
    const type = await this.typeByCode(code);
    const createdById = actorId ? BigInt(actorId) : null;
    await this.prisma.$transaction([
      this.prisma.erpTransactionGridColumn.deleteMany({ where: { transactionTypeId: type.id } }),
      this.prisma.erpTransactionGridColumn.createMany({
        data: dto.columns.map((c) => ({
          transactionTypeId: type.id,
          sortOrder: c.sortOrder,
          headerText: c.headerText,
          dataField: c.dataField,
          width: c.width,
          isVisible: c.isVisible,
          isRequired: c.isRequired,
          isEditable: c.isEditable,
          kind: c.kind,
          dataType: c.dataType,
          lookupSource: c.lookupSource ?? null,
          createdById,
          updatedById: createdById,
        })),
      }),
    ]);
    return this.getColumns(code);
  }
}
