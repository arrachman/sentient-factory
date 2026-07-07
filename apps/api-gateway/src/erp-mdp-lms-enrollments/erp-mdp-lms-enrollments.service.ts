import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLmsEnrollmentDto } from './dto/create-enrollment.dto';
import { QueryLmsEnrollmentDto } from './dto/query-enrollment.dto';
import { UpdateLmsEnrollmentDto } from './dto/update-enrollment.dto';

@Injectable()
export class ErpMdpLmsEnrollmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLmsEnrollmentDto, actorId?: string) {
    const parent = await this.prisma.mdpLmsCourse.findFirst({
      where: { id: BigInt(dto.courseId), deletedAt: null },
      select: { id: true },
    });
    if (!parent) throw new NotFoundException('Course not found');
    const actor = actorId ? BigInt(actorId) : null;
    const created = await this.prisma.mdpLmsEnrollment.create({
      data: {
        courseId: BigInt(dto.courseId),
        userId: BigInt(dto.userId),
        status: dto.status as any,
        progressPct: dto.progressPct,
        enrolledAt: new Date(dto.enrolledAt),
        completedAt: dto.completedAt ? new Date(dto.completedAt) : null,
        score: dto.score,
        certificateCode: dto.certificateCode,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        notes: dto.notes,
        createdById: actor,
        updatedById: actor,
      },
    });
    return { success: true, data: created };
  }

  async findAll(query: QueryLmsEnrollmentDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;

    const where: Prisma.MdpLmsEnrollmentWhereInput = { deletedAt: null };
    if (query.courseId) where.courseId = BigInt(query.courseId);
    if (query.status) where.status = query.status;

    const sortBy = query.sortBy ?? 'createdAt';
    const sortDir = query.sortDir ?? 'desc';

    const [items, total] = await this.prisma.$transaction([
      this.prisma.mdpLmsEnrollment.findMany({
        where,
        orderBy: [{ [sortBy]: sortDir }],
        skip,
        take: limit,
      }),
      this.prisma.mdpLmsEnrollment.count({ where }),
    ]);
    return {
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }

  async findOne(id: bigint) {
    const item = await this.prisma.mdpLmsEnrollment.findFirst({
      where: { id, deletedAt: null },
    });
    if (!item) throw new NotFoundException('Enrollment not found');
    return { success: true, data: item };
  }

  async update(id: bigint, dto: UpdateLmsEnrollmentDto, actorId?: string) {
    const existing = await this.prisma.mdpLmsEnrollment.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new NotFoundException('Enrollment not found');
    const updated = await this.prisma.mdpLmsEnrollment.update({
      where: { id },
      data: {
        userId: dto.userId !== undefined ? BigInt(dto.userId) : undefined,
        status: dto.status as any,
        progressPct: dto.progressPct,
        enrolledAt: dto.enrolledAt !== undefined ? new Date(dto.enrolledAt) : undefined,
        completedAt: dto.completedAt !== undefined ? (dto.completedAt ? new Date(dto.completedAt) : null) : undefined,
        score: dto.score,
        certificateCode: dto.certificateCode,
        expiresAt: dto.expiresAt !== undefined ? (dto.expiresAt ? new Date(dto.expiresAt) : null) : undefined,
        notes: dto.notes,
        updatedById: actorId ? BigInt(actorId) : null,
      },
    });
    return { success: true, data: updated };
  }

  async remove(id: bigint, actorId?: string) {
    const existing = await this.prisma.mdpLmsEnrollment.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Enrollment not found');
    await this.prisma.mdpLmsEnrollment.update({
      where: { id },
      data: { deletedAt: new Date(), updatedById: actorId ? BigInt(actorId) : null },
    });
    return { success: true, message: 'Enrollment deleted' };
  }
}
