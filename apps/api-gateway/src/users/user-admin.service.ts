import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { toAuditUserId } from '../common/utils/audit-user.util';
import { isUniqueViolation, throwDuplicate } from '../common/errors/duplicate.util';
import { hashPassword } from '../auth/password-hasher';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { normalizeWarehouseId, normalizeRoleIds } from './user-admin.utils';
import { UserWarehouseService } from './user-warehouse.service';

@Injectable()
export class UserAdminService {
  constructor(
    private prisma: PrismaService,
    private warehouseSvc: UserWarehouseService,
  ) {}

  async findAll(query: QueryUserDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      deletedAt: null,
    };

    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { email: { contains: q, mode: 'insensitive' } },
        { username: { contains: q, mode: 'insensitive' } },
        { fullName: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (typeof query.isActive === 'boolean') {
      where.isActive = query.isActive;
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        include: {
          roles: {
            where: { deletedAt: null },
            include: {
              role: true,
            },
          },
        },
        orderBy: [{ createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    const serializedItems = await this.warehouseSvc.serializeUsersWithWarehouse(items);

    return {
      success: true,
      data: serializedItems,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async findOne(id: number) {
    const item = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      include: {
        roles: {
          where: { deletedAt: null },
          include: {
            role: true,
          },
        },
      },
    });

    if (!item) {
      throw new NotFoundException('User not found');
    }

    const [serialized] = await this.warehouseSvc.serializeUsersWithWarehouse([item]);

    return {
      success: true,
      data: serialized,
    };
  }

  async createFromAdmin(dto: CreateUserDto, actorId?: string) {
    const duplicate = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { username: dto.username }],
      },
      select: { email: true, username: true, deletedAt: true },
    });

    if (duplicate?.email === dto.email) {
      throwDuplicate({
        fieldLabel: 'Email',
        value: dto.email,
        isSoftDeleted: Boolean(duplicate.deletedAt),
      });
    }
    if (duplicate?.username === dto.username) {
      throwDuplicate({
        fieldLabel: 'Username',
        value: dto.username,
        isSoftDeleted: Boolean(duplicate.deletedAt),
      });
    }

    const passwordHash = await hashPassword(dto.password);
    const nextIsActive = dto.isActive ?? true;
    const normalizedWarehouseId = normalizeWarehouseId(dto.warehouseId);
    const normalizedRoleIds = normalizeRoleIds(dto.roleIds, dto.roleId);

    if (nextIsActive && !normalizedWarehouseId) {
      throw new BadRequestException('Active user must have warehouse assigned');
    }
    if (normalizedWarehouseId) {
      await this.warehouseSvc.ensureWarehouseExists(normalizedWarehouseId);
    }
    if (normalizedRoleIds !== undefined) {
      await this.warehouseSvc.ensureRolesExist(normalizedRoleIds);
    }

    let created;
    try {
      created = await this.prisma.user.create({
        data: {
          email: dto.email,
          username: dto.username,
          passwordHash,
          fullName: dto.fullName ?? null,
          isActive: dto.isActive ?? true,
          warehouseId: normalizedWarehouseId ?? null,
          createdBy: toAuditUserId(actorId),
          updatedBy: toAuditUserId(actorId),
        },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });
    } catch (error) {
      if (isUniqueViolation(error, ['email'])) {
        throwDuplicate({ fieldLabel: 'Email', value: dto.email });
      }
      if (isUniqueViolation(error, ['username'])) {
        throwDuplicate({ fieldLabel: 'Username', value: dto.username });
      }
      throw error;
    }

    if (normalizedRoleIds !== undefined) {
      await this.warehouseSvc.syncRoles(created.id, normalizedRoleIds, actorId);
    }
    const refreshed = await this.prisma.user.findFirst({
      where: { id: created.id, deletedAt: null },
      include: {
        roles: {
          where: { deletedAt: null },
          include: {
            role: true,
          },
        },
      },
    });
    if (!refreshed) {
      throw new NotFoundException('User not found');
    }
    const [serialized] = await this.warehouseSvc.serializeUsersWithWarehouse([refreshed]);

    return {
      success: true,
      data: serialized,
    };
  }

  async update(id: number, dto: UpdateUserDto, actorId?: string) {
    const existing = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, email: true, username: true, isActive: true },
    });
    if (!existing) {
      throw new NotFoundException('User not found');
    }

    if (dto.email && dto.email !== existing.email) {
      const emailExists = await this.prisma.user.findFirst({
        where: { email: dto.email, NOT: { id } },
        select: { id: true, deletedAt: true },
      });
      if (emailExists) {
        throwDuplicate({
          fieldLabel: 'Email',
          value: dto.email,
          isSoftDeleted: Boolean(emailExists.deletedAt),
        });
      }
    }

    if (dto.username && dto.username !== existing.username) {
      const usernameExists = await this.prisma.user.findFirst({
        where: { username: dto.username, NOT: { id } },
        select: { id: true, deletedAt: true },
      });
      if (usernameExists) {
        throwDuplicate({
          fieldLabel: 'Username',
          value: dto.username,
          isSoftDeleted: Boolean(usernameExists.deletedAt),
        });
      }
    }

    const passwordHash = dto.password ? await hashPassword(dto.password) : undefined;
    const normalizedWarehouseId = normalizeWarehouseId(dto.warehouseId);
    const normalizedRoleIds = normalizeRoleIds(dto.roleIds, dto.roleId);

    if (normalizedWarehouseId) {
      await this.warehouseSvc.ensureWarehouseExists(normalizedWarehouseId);
    }
    if (normalizedRoleIds !== undefined) {
      await this.warehouseSvc.ensureRolesExist(normalizedRoleIds);
    }

    const nextIsActive = dto.isActive ?? existing.isActive;
    const nextWarehouseId =
      normalizedWarehouseId !== undefined
        ? normalizedWarehouseId
        : await this.warehouseSvc.getCurrentWarehouseId(id);

    if (nextIsActive && !nextWarehouseId) {
      throw new BadRequestException('Active user must have warehouse assigned');
    }

    try {
      await this.prisma.user.update({
        where: { id },
        data: {
          email: dto.email,
          username: dto.username,
          fullName: dto.fullName,
          isActive: dto.isActive,
          passwordHash,
          updatedBy: toAuditUserId(actorId),
        },
        include: {
          roles: {
            where: { deletedAt: null },
            include: {
              role: true,
            },
          },
        },
      });
    } catch (error) {
      if (isUniqueViolation(error, ['email'])) {
        throwDuplicate({ fieldLabel: 'Email', value: dto.email ?? existing.email });
      }
      if (isUniqueViolation(error, ['username'])) {
        throwDuplicate({ fieldLabel: 'Username', value: dto.username ?? existing.username });
      }
      throw error;
    }

    if (normalizedWarehouseId !== undefined) {
      await this.warehouseSvc.setWarehouseId(id, normalizedWarehouseId);
    }
    if (normalizedRoleIds !== undefined) {
      await this.warehouseSvc.syncRoles(id, normalizedRoleIds, actorId);
    }

    const refreshed = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      include: {
        roles: {
          where: { deletedAt: null },
          include: {
            role: true,
          },
        },
      },
    });
    if (!refreshed) {
      throw new NotFoundException('User not found');
    }

    const [serialized] = await this.warehouseSvc.serializeUsersWithWarehouse([refreshed]);
    return {
      success: true,
      data: serialized,
    };
  }

  async remove(id: number, actorId?: string) {
    const existing = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.update({
      where: { id },
      data: {
        isActive: false,
        deletedAt: new Date(),
        deletedBy: toAuditUserId(actorId),
      },
    });

    return {
      success: true,
      message: 'User deleted',
    };
  }
}
