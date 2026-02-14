import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { isUniqueViolation, throwDuplicate } from '../common/errors/duplicate.util';
import { CreateMasterDataContactDto } from './dto/create-master-data-contact.dto';
import { QueryMasterDataContactDto } from './dto/query-master-data-contact.dto';
import { UpdateMasterDataContactDto } from './dto/update-master-data-contact.dto';

@Injectable()
export class MasterDataContactsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMasterDataContactDto, actorId?: string) {
    const existing = await this.prisma.masterDataContact.findFirst({
      where: { code: dto.code },
      select: { uuid: true, deletedAt: true },
    });
    if (existing) {
      throwDuplicate({
        fieldLabel: 'Contact code',
        value: dto.code,
        isSoftDeleted: Boolean(existing.deletedAt),
      });
    }

    const data: Prisma.MasterDataContactCreateInput = {
      code: dto.code,
      name: dto.name,
      tax: dto.tax ?? null,
      website: dto.website ?? null,
      address: dto.address ?? null,
      street: dto.street ?? null,
      city: dto.city ?? null,
      province: dto.province ?? null,
      zipCode: dto.zipCode ?? null,
      type: dto.type,
      contactFirstName: dto.contactFirstName ?? null,
      contactEmail: dto.contactEmail ?? null,
      contactPhone: dto.contactPhone ?? null,
      createdBy: actorId ?? null,
      updatedBy: actorId ?? null,
    };

    let created;
    try {
      created = await this.prisma.masterDataContact.create({ data });
    } catch (error) {
      if (isUniqueViolation(error, ['code', 'm1_contact_code_key'])) {
        throwDuplicate({
          fieldLabel: 'Contact code',
          value: dto.code,
        });
      }
      throw error;
    }
    return { success: true, data: created };
  }

  async findAll(query: QueryMasterDataContactDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.MasterDataContactWhereInput = {
      deletedAt: null,
    };

    if (query.type) {
      where.type = query.type;
    }

    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { code: { contains: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } },
        { city: { contains: q, mode: 'insensitive' } },
        { province: { contains: q, mode: 'insensitive' } },
        { contactFirstName: { contains: q, mode: 'insensitive' } },
        { contactEmail: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.masterDataContact.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.masterDataContact.count({ where }),
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

  async findOne(uuid: string) {
    const item = await this.prisma.masterDataContact.findFirst({
      where: { uuid, deletedAt: null },
    });
    if (!item) {
      throw new NotFoundException('Master data contact not found');
    }
    return { success: true, data: item };
  }

  async update(uuid: string, dto: UpdateMasterDataContactDto, actorId?: string) {
    const existing = await this.prisma.masterDataContact.findFirst({
      where: { uuid, deletedAt: null },
    });
    if (!existing) {
      throw new NotFoundException('Master data contact not found');
    }

    if (dto.code && dto.code !== existing.code) {
      const duplicate = await this.prisma.masterDataContact.findFirst({
        where: { code: dto.code, NOT: { uuid } },
        select: { uuid: true, deletedAt: true },
      });
      if (duplicate) {
        throwDuplicate({
          fieldLabel: 'Contact code',
          value: dto.code,
          isSoftDeleted: Boolean(duplicate.deletedAt),
        });
      }
    }

    let updated;
    try {
      updated = await this.prisma.masterDataContact.update({
        where: { uuid },
        data: {
          code: dto.code,
          name: dto.name,
          tax: dto.tax,
          website: dto.website,
          address: dto.address,
          street: dto.street,
          city: dto.city,
          province: dto.province,
          zipCode: dto.zipCode,
          type: dto.type,
          contactFirstName: dto.contactFirstName,
          contactEmail: dto.contactEmail,
          contactPhone: dto.contactPhone,
          updatedBy: actorId ?? null,
        },
      });
    } catch (error) {
      if (isUniqueViolation(error, ['code', 'm1_contact_code_key'])) {
        throwDuplicate({
          fieldLabel: 'Contact code',
          value: dto.code ?? existing.code,
        });
      }
      throw error;
    }

    return { success: true, data: updated };
  }

  async remove(uuid: string, actorId?: string) {
    const existing = await this.prisma.masterDataContact.findFirst({
      where: { uuid, deletedAt: null },
      select: { uuid: true },
    });
    if (!existing) {
      throw new NotFoundException('Master data contact not found');
    }

    await this.prisma.masterDataContact.update({
      where: { uuid },
      data: {
        deletedAt: new Date(),
        deletedBy: actorId ?? null,
      },
    });

    return { success: true, message: 'Master data contact deleted' };
  }
}
