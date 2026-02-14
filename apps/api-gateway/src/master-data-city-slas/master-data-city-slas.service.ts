import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMasterDataCitySlaDto } from './dto/create-master-data-city-sla.dto';
import { QueryMasterDataCitySlaDto } from './dto/query-master-data-city-sla.dto';
import { UpdateMasterDataCitySlaDto } from './dto/update-master-data-city-sla.dto';

type CitySlaRow = {
  uuid: string;
  city_id: string;
  std_lead_time_days: number;
  std_return_do_days: number;
  created_at: Date;
  created_by: string | null;
  updated_at: Date;
  updated_by: string | null;
  deleted_at: Date | null;
  deleted_by: string | null;
  city_uuid: string;
  city_name: string;
  city_postal_code: string;
  province_uuid: string;
  province_name: string;
  province_iso_code: string;
};

function toCitySla(row: CitySlaRow) {
  return {
    uuid: row.uuid,
    cityId: row.city_id,
    stdLeadTimeDays: row.std_lead_time_days,
    stdReturnDoDays: row.std_return_do_days,
    createdAt: row.created_at,
    createdBy: row.created_by,
    updatedAt: row.updated_at,
    updatedBy: row.updated_by,
    deletedAt: row.deleted_at,
    deletedBy: row.deleted_by,
    city: {
      uuid: row.city_uuid,
      name: row.city_name,
      postalCode: row.city_postal_code,
      province: {
        uuid: row.province_uuid,
        name: row.province_name,
        isoCode: row.province_iso_code,
      },
    },
  };
}

@Injectable()
export class MasterDataCitySlasService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMasterDataCitySlaDto, actorId?: string) {
    await this.ensureCityExists(dto.cityId);

    const existing = await this.prisma.$queryRaw<{ uuid: string }[]>`
      SELECT uuid
      FROM public."m1_city_sla"
      WHERE city_id = ${dto.cityId} AND deleted_at IS NULL
      LIMIT 1
    `;
    if (existing.length > 0) {
      throw new BadRequestException('SLA for this city already exists');
    }

    const recycled = await this.prisma.$queryRaw<{ uuid: string }[]>`
      SELECT uuid
      FROM public."m1_city_sla"
      WHERE city_id = ${dto.cityId} AND deleted_at IS NOT NULL
      ORDER BY updated_at DESC
      LIMIT 1
    `;

    if (recycled.length > 0) {
      await this.prisma.$executeRaw`
        UPDATE public."m1_city_sla"
        SET std_lead_time_days = ${dto.stdLeadTimeDays},
            std_return_do_days = ${dto.stdReturnDoDays},
            deleted_at = NULL,
            deleted_by = NULL,
            updated_at = CURRENT_TIMESTAMP,
            updated_by = ${actorId ?? null}
        WHERE uuid = ${recycled[0].uuid}
      `;
      return this.findOne(recycled[0].uuid);
    }

    const created = await this.prisma.$queryRaw<{ uuid: string }[]>`
      INSERT INTO public."m1_city_sla" (
        uuid, city_id, std_lead_time_days, std_return_do_days, created_by, updated_by
      )
      VALUES (
        ${randomUUID()}, ${dto.cityId}, ${dto.stdLeadTimeDays}, ${dto.stdReturnDoDays}, ${actorId ?? null}, ${actorId ?? null}
      )
      RETURNING uuid
    `;

    return this.findOne(created[0].uuid);
  }

  async findAll(query: QueryMasterDataCitySlaDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const whereClauses: Prisma.Sql[] = [
      Prisma.sql`sla.deleted_at IS NULL`,
      Prisma.sql`city.deleted_at IS NULL`,
      Prisma.sql`province.deleted_at IS NULL`,
    ];

    if (query.cityId?.trim()) {
      whereClauses.push(Prisma.sql`sla.city_id = ${query.cityId.trim()}`);
    }

    if (query.search?.trim()) {
      const q = `%${query.search.trim()}%`;
      whereClauses.push(
        Prisma.sql`(
          city.name ILIKE ${q}
          OR city.postal_code ILIKE ${q}
          OR province.name ILIKE ${q}
          OR province.iso_code ILIKE ${q}
        )`,
      );
    }

    const whereSql = Prisma.sql`WHERE ${Prisma.join(whereClauses, ' AND ')}`;

    const items = await this.prisma.$queryRaw<CitySlaRow[]>(Prisma.sql`
      SELECT
        sla.uuid,
        sla.city_id,
        sla.std_lead_time_days,
        sla.std_return_do_days,
        sla.created_at,
        sla.created_by,
        sla.updated_at,
        sla.updated_by,
        sla.deleted_at,
        sla.deleted_by,
        city.uuid AS city_uuid,
        city.name AS city_name,
        city.postal_code AS city_postal_code,
        province.uuid AS province_uuid,
        province.name AS province_name,
        province.iso_code AS province_iso_code
      FROM public."m1_city_sla" sla
      JOIN public."m1_city" city ON city.uuid = sla.city_id
      JOIN public."m1_province" province ON province.uuid = city.province_id
      ${whereSql}
      ORDER BY sla.created_at DESC
      OFFSET ${skip}
      LIMIT ${limit}
    `);

    const counts = await this.prisma.$queryRaw<{ total: bigint }[]>(Prisma.sql`
      SELECT COUNT(*)::bigint AS total
      FROM public."m1_city_sla" sla
      JOIN public."m1_city" city ON city.uuid = sla.city_id
      JOIN public."m1_province" province ON province.uuid = city.province_id
      ${whereSql}
    `);

    const total = Number(counts[0]?.total ?? 0);

    return {
      success: true,
      data: items.map(toCitySla),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findOne(uuid: string) {
    const rows = await this.prisma.$queryRaw<CitySlaRow[]>`
      SELECT
        sla.uuid,
        sla.city_id,
        sla.std_lead_time_days,
        sla.std_return_do_days,
        sla.created_at,
        sla.created_by,
        sla.updated_at,
        sla.updated_by,
        sla.deleted_at,
        sla.deleted_by,
        city.uuid AS city_uuid,
        city.name AS city_name,
        city.postal_code AS city_postal_code,
        province.uuid AS province_uuid,
        province.name AS province_name,
        province.iso_code AS province_iso_code
      FROM public."m1_city_sla" sla
      JOIN public."m1_city" city ON city.uuid = sla.city_id
      JOIN public."m1_province" province ON province.uuid = city.province_id
      WHERE sla.uuid = ${uuid}
        AND sla.deleted_at IS NULL
        AND city.deleted_at IS NULL
        AND province.deleted_at IS NULL
      LIMIT 1
    `;

    if (rows.length === 0) {
      throw new NotFoundException('Master data city SLA not found');
    }

    return { success: true, data: toCitySla(rows[0]) };
  }

  async update(uuid: string, dto: UpdateMasterDataCitySlaDto, actorId?: string) {
    const existing = await this.prisma.$queryRaw<{ uuid: string; city_id: string }[]>`
      SELECT uuid, city_id
      FROM public."m1_city_sla"
      WHERE uuid = ${uuid} AND deleted_at IS NULL
      LIMIT 1
    `;

    const current = existing[0];
    if (!current) {
      throw new NotFoundException('Master data city SLA not found');
    }

    const nextCityId = dto.cityId ?? current.city_id;
    await this.ensureCityExists(nextCityId);

    if (dto.cityId && dto.cityId !== current.city_id) {
      const duplicate = await this.prisma.$queryRaw<{ uuid: string }[]>`
        SELECT uuid
        FROM public."m1_city_sla"
        WHERE city_id = ${dto.cityId} AND deleted_at IS NULL AND uuid <> ${uuid}
        LIMIT 1
      `;
      if (duplicate.length > 0) {
        throw new BadRequestException('SLA for this city already exists');
      }
    }

    const setClauses: Prisma.Sql[] = [];
    if (typeof dto.cityId !== 'undefined') {
      setClauses.push(Prisma.sql`city_id = ${dto.cityId}`);
    }
    if (typeof dto.stdLeadTimeDays !== 'undefined') {
      setClauses.push(Prisma.sql`std_lead_time_days = ${dto.stdLeadTimeDays}`);
    }
    if (typeof dto.stdReturnDoDays !== 'undefined') {
      setClauses.push(Prisma.sql`std_return_do_days = ${dto.stdReturnDoDays}`);
    }
    setClauses.push(Prisma.sql`updated_at = CURRENT_TIMESTAMP`);
    setClauses.push(Prisma.sql`updated_by = ${actorId ?? null}`);

    await this.prisma.$executeRaw(Prisma.sql`
      UPDATE public."m1_city_sla"
      SET ${Prisma.join(setClauses, ', ')}
      WHERE uuid = ${uuid}
    `);

    return this.findOne(uuid);
  }

  async remove(uuid: string, actorId?: string) {
    const existing = await this.prisma.$queryRaw<{ uuid: string }[]>`
      SELECT uuid
      FROM public."m1_city_sla"
      WHERE uuid = ${uuid} AND deleted_at IS NULL
      LIMIT 1
    `;
    if (existing.length === 0) {
      throw new NotFoundException('Master data city SLA not found');
    }

    await this.prisma.$executeRaw`
      UPDATE public."m1_city_sla"
      SET deleted_at = CURRENT_TIMESTAMP,
          deleted_by = ${actorId ?? null},
          updated_at = CURRENT_TIMESTAMP,
          updated_by = ${actorId ?? null}
      WHERE uuid = ${uuid}
    `;

    return { success: true, message: 'Master data city SLA deleted' };
  }

  private async ensureCityExists(cityId: string) {
    const city = await this.prisma.masterDataCity.findFirst({
      where: { uuid: cityId, deletedAt: null },
      select: { uuid: true },
    });
    if (!city) {
      throw new BadRequestException('City not found');
    }
  }
}
