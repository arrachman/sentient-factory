import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUniqueViolation, throwDuplicate } from '../common/errors/duplicate.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEhsIncidentDto } from './dto/create-incident.dto';
import { QueryEhsIncidentDto } from './dto/query-incident.dto';
import { UpdateEhsIncidentDto } from './dto/update-incident.dto';

const CODE_TARGETS = ['code', 'ehs_incidents_code_key'];
const toBig = (v?: string | null) => (v ? BigInt(v) : null);

@Injectable()
export class ErpMdpEhsIncidentsService {
  constructor(private readonly prisma: PrismaService) {}

  private data(dto: CreateEhsIncidentDto | UpdateEhsIncidentDto, partial: boolean) {
    const d: Prisma.MdpEhsIncidentUncheckedCreateInput | Prisma.MdpEhsIncidentUncheckedUpdateInput = {
      code: dto.code,
      name: dto.name,
      type: dto.type as any,
      severity: dto.severity as any,
      status: dto.status as any,
      location: dto.location,
      description: dto.description,
      rootCause: dto.rootCause,
      correctiveAction: dto.correctiveAction,
      notes: dto.notes,
    } as any;
    const setBig = (key: string, v?: string) => {
      if (!partial || v !== undefined) (d as any)[key] = toBig(v);
    };
    setBig('assetId', dto.assetId);
    setBig('workCenterId', dto.workCenterId);
    setBig('reportedById', dto.reportedById);
    setBig('investigatedById', dto.investigatedById);
    if (!partial || dto.occurredAt !== undefined) (d as any).occurredAt = dto.occurredAt ? new Date(dto.occurredAt) : undefined;
    if (!partial || dto.closedAt !== undefined) (d as any).closedAt = dto.closedAt ? new Date(dto.closedAt) : null;
    return d;
  }

  async create(dto: CreateEhsIncidentDto, actorId?: string) {
    const existing = await this.prisma.mdpEhsIncident.findFirst({
      where: { code: dto.code },
      select: { id: true, deletedAt: true },
    });
    if (existing) {
      throwDuplicate({
        fieldLabel: 'Incident code',
        value: dto.code as string,
        isSoftDeleted: Boolean(existing.deletedAt),
      });
    }
    const actor = actorId ? BigInt(actorId) : null;
    try {
      const created = await this.prisma.mdpEhsIncident.create({
        data: {
          ...(this.data(dto, false) as Prisma.MdpEhsIncidentUncheckedCreateInput),
          createdById: actor,
          updatedById: actor,
        },
      });
      return { success: true, data: created };
    } catch (error) {
      if (isUniqueViolation(error, CODE_TARGETS))
        throwDuplicate({ fieldLabel: 'Incident code', value: dto.code as string });
      throw error;
    }
  }

  async findAll(query: QueryEhsIncidentDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;

    const where: Prisma.MdpEhsIncidentWhereInput = { deletedAt: null };
    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { code: { contains: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (query.status) where.status = query.status;
    if (query.type) where.type = query.type;
    if (query.severity) where.severity = query.severity;

    const sortBy = query.sortBy ?? 'createdAt';
    const sortDir = query.sortDir ?? 'desc';

    const [items, total] = await this.prisma.$transaction([
      this.prisma.mdpEhsIncident.findMany({
        where,
        orderBy: [{ [sortBy]: sortDir }],
        skip,
        take: limit,
      }),
      this.prisma.mdpEhsIncident.count({ where }),
    ]);
    return {
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.mdpEhsIncident.findFirst({
      where: { id, deletedAt: null },
    });
    if (!item) throw new NotFoundException('Incident not found');
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdateEhsIncidentDto, actorId?: string) {
    const existing = await this.prisma.mdpEhsIncident.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('Incident not found');
    if (dto.code && dto.code !== existing.code) {
      const dup = await this.prisma.mdpEhsIncident.findFirst({
        where: { code: dto.code, NOT: { id } },
        select: { id: true, deletedAt: true },
      });
      if (dup)
        throwDuplicate({
          fieldLabel: 'Incident code',
          value: dto.code,
          isSoftDeleted: Boolean(dup.deletedAt),
        });
    }
    try {
      const updated = await this.prisma.mdpEhsIncident.update({
        where: { id },
        data: {
          ...(this.data(dto, true) as Prisma.MdpEhsIncidentUncheckedUpdateInput),
          updatedById: actorId ? BigInt(actorId) : null,
        },
      });
      return { success: true, data: updated };
    } catch (error) {
      if (isUniqueViolation(error, CODE_TARGETS))
        throwDuplicate({ fieldLabel: 'Incident code', value: dto.code ?? existing.code });
      throw error;
    }
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.mdpEhsIncident.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Incident not found');
    await this.prisma.mdpEhsIncident.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: actorId ? BigInt(actorId) : null },
    });
    return { success: true, message: 'Incident deleted' };
  }
}
