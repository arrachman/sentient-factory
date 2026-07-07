import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLaborLogDto } from './dto/create-labor-log.dto';
import { QueryLaborLogDto } from './dto/query-labor-log.dto';
import { UpdateLaborLogDto } from './dto/update-labor-log.dto';

const OPERATION_SELECT = { select: { id: true, name: true, sequence: true } } as const;
const SHIFT_SELECT = { select: { id: true, code: true, name: true } } as const;

/**
 * Operator time per operation (manual clock-in/out). operatorId is a cross-app
 * scalar FK to ERP adm_users — not asserted. durationSeconds derived on close.
 */
@Injectable()
export class ErpMdpLaborLogsService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertOperation(operationId: string) {
    const op = await this.prisma.mdpOperation.findFirst({
      where: { id: BigInt(operationId), deletedAt: null },
      select: { id: true },
    });
    if (!op) throw new NotFoundException(`Operation '${operationId}' not found`);
    return op.id;
  }

  private async assertShift(shiftId?: string) {
    if (!shiftId) return;
    const shift = await this.prisma.mdpShift.findFirst({
      where: { id: BigInt(shiftId), deletedAt: null },
      select: { id: true },
    });
    if (!shift) throw new NotFoundException(`Shift '${shiftId}' not found`);
  }

  private deriveDuration(startedAt: Date, endedAt: Date | null): Prisma.Decimal | null {
    if (!endedAt) return null;
    const seconds = (endedAt.getTime() - startedAt.getTime()) / 1000;
    if (seconds < 0) throw new BadRequestException('endedAt must be after startedAt');
    return new Prisma.Decimal(seconds);
  }

  async create(dto: CreateLaborLogDto, actorId?: string) {
    const operationId = await this.assertOperation(dto.operationId);
    await this.assertShift(dto.shiftId);
    const startedAt = new Date(dto.startedAt);
    const endedAt = dto.endedAt ? new Date(dto.endedAt) : null;
    const actor = actorId ? BigInt(actorId) : null;

    const created = await this.prisma.mdpLaborLog.create({
      data: {
        operationId,
        operatorId: BigInt(dto.operatorId),
        shiftId: dto.shiftId ? BigInt(dto.shiftId) : null,
        startedAt,
        endedAt,
        durationSeconds: this.deriveDuration(startedAt, endedAt),
        createdById: actor,
        updatedById: actor,
      },
      include: { operation: OPERATION_SELECT, shift: SHIFT_SELECT },
    });
    return { success: true, data: created };
  }

  async findAll(query: QueryLaborLogDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.MdpLaborLogWhereInput = { deletedAt: null };
    if (query.operationId) where.operationId = BigInt(query.operationId);
    if (query.shiftId) where.shiftId = BigInt(query.shiftId);
    if (query.operatorId) where.operatorId = BigInt(query.operatorId);

    const sortBy = query.sortBy ?? 'startedAt';
    const sortDir = query.sortDir ?? 'desc';

    const [items, total] = await this.prisma.$transaction([
      this.prisma.mdpLaborLog.findMany({
        where,
        orderBy: [{ [sortBy]: sortDir }],
        skip,
        take: limit,
        include: { operation: OPERATION_SELECT, shift: SHIFT_SELECT },
      }),
      this.prisma.mdpLaborLog.count({ where }),
    ]);

    return {
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.mdpLaborLog.findFirst({
      where: { id, deletedAt: null },
      include: { operation: OPERATION_SELECT, shift: SHIFT_SELECT },
    });
    if (!item) throw new NotFoundException('Labor log not found');
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdateLaborLogDto, actorId?: string) {
    const existing = await this.prisma.mdpLaborLog.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) throw new NotFoundException('Labor log not found');

    const operationId = dto.operationId ? await this.assertOperation(dto.operationId) : undefined;
    await this.assertShift(dto.shiftId);

    const startedAt = dto.startedAt ? new Date(dto.startedAt) : existing.startedAt;
    const endedAt =
      dto.endedAt !== undefined ? (dto.endedAt ? new Date(dto.endedAt) : null) : existing.endedAt;
    const actor = actorId ? BigInt(actorId) : null;

    const updated = await this.prisma.mdpLaborLog.update({
      where: { id },
      data: {
        operationId,
        operatorId: dto.operatorId ? BigInt(dto.operatorId) : undefined,
        shiftId: dto.shiftId !== undefined ? (dto.shiftId ? BigInt(dto.shiftId) : null) : undefined,
        startedAt: dto.startedAt ? startedAt : undefined,
        endedAt: dto.endedAt !== undefined ? endedAt : undefined,
        durationSeconds: this.deriveDuration(startedAt, endedAt),
        updatedById: actor,
      },
      include: { operation: OPERATION_SELECT, shift: SHIFT_SELECT },
    });
    return { success: true, data: updated };
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.mdpLaborLog.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Labor log not found');
    await this.prisma.mdpLaborLog.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: actorId ? BigInt(actorId) : null },
    });
    return { success: true, message: 'Labor log deleted' };
  }
}
