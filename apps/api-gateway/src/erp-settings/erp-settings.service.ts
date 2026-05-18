import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { toAuditUserId } from '../common/utils/audit-user.util';
import { QueryErpSettingDto } from './dto/query-erp-setting.dto';
import { UpdateErpSettingDto } from './dto/update-erp-setting.dto';

@Injectable()
export class ErpSettingsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryErpSettingDto) {
    const where: {
      deletedAt: null;
      group?: string;
      key?: string;
    } = { deletedAt: null };

    if (query.group?.trim()) {
      where.group = query.group.trim();
    }
    if (query.key?.trim()) {
      where.key = query.key.trim();
    }

    const items = await this.prisma.erpSetting.findMany({
      where,
      orderBy: [{ group: 'asc' }, { sortOrder: 'asc' }, { key: 'asc' }],
    });

    return { success: true, data: items };
  }

  async findOne(key: string) {
    const item = await this.prisma.erpSetting.findFirst({
      where: { key, deletedAt: null },
    });
    if (!item) {
      throw new NotFoundException(`ERP setting with key "${key}" not found`);
    }
    return { success: true, data: item };
  }

  async upsert(key: string, dto: UpdateErpSettingDto, actorId?: string) {
    const existing = await this.prisma.erpSetting.findFirst({
      where: { key, deletedAt: null },
    });

    if (!existing) {
      throw new NotFoundException(`ERP setting with key "${key}" not found`);
    }

    const updated = await this.prisma.erpSetting.update({
      where: { id: existing.id },
      data: {
        value: dto.value ?? existing.value,
        updatedById: toAuditUserId(actorId)
          ? BigInt(toAuditUserId(actorId) as number)
          : undefined,
      },
    });

    return { success: true, data: updated };
  }
}
