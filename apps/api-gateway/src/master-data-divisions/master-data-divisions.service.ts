import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { throwDuplicate } from '../common/errors/duplicate.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMasterDataDivisionDto } from './dto/create-master-data-division.dto';
import { QueryMasterDataDivisionDto } from './dto/query-master-data-division.dto';
import { UpdateMasterDataDivisionDto } from './dto/update-master-data-division.dto';

type DivisionRow = {
  uuid: string;
  code: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Date;
  created_by: string | null;
  updated_at: Date;
  updated_by: string | null;
  deleted_at: Date | null;
  deleted_by: string | null;
};

function toDivision(row: DivisionRow) {
  return {
    uuid: row.uuid,
    code: row.code,
    name: row.name,
    description: row.description,
    isActive: row.is_active,
    createdAt: row.created_at,
    createdBy: row.created_by,
    updatedAt: row.updated_at,
    updatedBy: row.updated_by,
    deletedAt: row.deleted_at,
    deletedBy: row.deleted_by,
  };
}

@Injectable()
export class MasterDataDivisionsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMasterDataDivisionDto, actorId?: string) {
    const existing = await this.prisma.$queryRaw<{ uuid: string; deleted_at: Date | null }[]>`
      SELECT uuid, deleted_at
      FROM public."m1_division"
      WHERE code = ${dto.code}
      LIMIT 1
    `;

    if (existing[0]) {
      throwDuplicate({
        fieldLabel: 'Division code',
        value: dto.code,
        isSoftDeleted: Boolean(existing[0].deleted_at),
      });
    }

    const created = await this.prisma.$queryRaw<DivisionRow[]>`
      INSERT INTO public."m1_division" (uuid, code, name, description, is_active, created_by, updated_by)
      VALUES (${randomUUID()}, ${dto.code}, ${dto.name}, ${dto.description ?? null}, ${dto.isActive}, ${actorId ?? null}, ${actorId ?? null})
      RETURNING uuid, code, name, description, is_active, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by
    `;

    return { success: true, data: created[0] ? toDivision(created[0]) : null };
  }

  async findAll(query: QueryMasterDataDivisionDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const whereClauses: Prisma.Sql[] = [Prisma.sql`deleted_at IS NULL`];
    if (query.search?.trim()) {
      const q = `%${query.search.trim()}%`;
      whereClauses.push(
        Prisma.sql`(
          code ILIKE ${q}
          OR name ILIKE ${q}
          OR COALESCE(description, '') ILIKE ${q}
        )`,
      );
    }

    const whereSql = Prisma.sql`WHERE ${Prisma.join(whereClauses, ' AND ')}`;

    const items = await this.prisma.$queryRaw<DivisionRow[]>(Prisma.sql`
      SELECT uuid, code, name, description, is_active, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by
      FROM public."m1_division"
      ${whereSql}
      ORDER BY created_at DESC
      OFFSET ${skip}
      LIMIT ${limit}
    `);

    const counts = await this.prisma.$queryRaw<{ total: bigint }[]>(Prisma.sql`
      SELECT COUNT(*)::bigint AS total
      FROM public."m1_division"
      ${whereSql}
    `);

    const total = Number(counts[0]?.total ?? 0);

    return {
      success: true,
      data: items.map(toDivision),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findOne(uuid: string) {
    const rows = await this.prisma.$queryRaw<DivisionRow[]>`
      SELECT uuid, code, name, description, is_active, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by
      FROM public."m1_division"
      WHERE uuid = ${uuid} AND deleted_at IS NULL
      LIMIT 1
    `;

    if (rows.length === 0) {
      throw new NotFoundException('Master data division not found');
    }

    return { success: true, data: toDivision(rows[0]) };
  }

  async update(uuid: string, dto: UpdateMasterDataDivisionDto, actorId?: string) {
    const existingRows = await this.prisma.$queryRaw<DivisionRow[]>`
      SELECT uuid, code, name, description, is_active, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by
      FROM public."m1_division"
      WHERE uuid = ${uuid} AND deleted_at IS NULL
      LIMIT 1
    `;

    const existing = existingRows[0];
    if (!existing) {
      throw new NotFoundException('Master data division not found');
    }

    if (dto.code && dto.code !== existing.code) {
      const duplicate = await this.prisma.$queryRaw<{ uuid: string; deleted_at: Date | null }[]>`
        SELECT uuid, deleted_at
        FROM public."m1_division"
        WHERE code = ${dto.code} AND uuid <> ${uuid}
        LIMIT 1
      `;
      if (duplicate[0]) {
        throwDuplicate({
          fieldLabel: 'Division code',
          value: dto.code,
          isSoftDeleted: Boolean(duplicate[0].deleted_at),
        });
      }
    }

    const setClauses: Prisma.Sql[] = [];
    if (typeof dto.code !== 'undefined') {
      setClauses.push(Prisma.sql`code = ${dto.code}`);
    }
    if (typeof dto.name !== 'undefined') {
      setClauses.push(Prisma.sql`name = ${dto.name}`);
    }
    if (typeof dto.description !== 'undefined') {
      setClauses.push(Prisma.sql`description = ${dto.description ?? null}`);
    }
    if (typeof dto.isActive !== 'undefined') {
      setClauses.push(Prisma.sql`is_active = ${dto.isActive}`);
    }

    setClauses.push(Prisma.sql`updated_at = CURRENT_TIMESTAMP`);
    setClauses.push(Prisma.sql`updated_by = ${actorId ?? null}`);

    const updated = await this.prisma.$queryRaw<DivisionRow[]>(Prisma.sql`
      UPDATE public."m1_division"
      SET ${Prisma.join(setClauses, ', ')}
      WHERE uuid = ${uuid}
      RETURNING uuid, code, name, description, is_active, created_at, created_by, updated_at, updated_by, deleted_at, deleted_by
    `);

    return { success: true, data: updated[0] ? toDivision(updated[0]) : null };
  }

  async remove(uuid: string, actorId?: string) {
    const existing = await this.prisma.$queryRaw<{ uuid: string }[]>`
      SELECT uuid
      FROM public."m1_division"
      WHERE uuid = ${uuid} AND deleted_at IS NULL
      LIMIT 1
    `;

    if (existing.length === 0) {
      throw new NotFoundException('Master data division not found');
    }

    await this.prisma.$executeRaw`
      UPDATE public."m1_division"
      SET deleted_at = CURRENT_TIMESTAMP,
          deleted_by = ${actorId ?? null},
          updated_at = CURRENT_TIMESTAMP,
          updated_by = ${actorId ?? null}
      WHERE uuid = ${uuid}
    `;

    return { success: true, message: 'Master data division deleted' };
  }
}
