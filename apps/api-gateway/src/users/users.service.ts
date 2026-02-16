import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { toAuditUserId } from '../common/utils/audit-user.util';
import { Prisma, User } from '@prisma/client';
import { isUniqueViolation, throwDuplicate } from '../common/errors/duplicate.util';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashPassword } from '../auth/password-hasher';

type WarehouseMeta = {
  warehouseId: number | null;
  warehouseName: string | null;
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async findOneById(id: string | number): Promise<User | null> {
    const userId = typeof id === 'number' ? id : Number(id);
    if (!Number.isInteger(userId)) {
      return null;
    }
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async findOneByUuid(id: string | number): Promise<User | null> {
    return this.findOneById(id);
  }

  async hasWarehouse(id: string | number): Promise<boolean> {
    const warehouseId = await this.getCurrentWarehouseId(id);
    return Boolean(warehouseId);
  }

  async getWarehouseMetaByUserUuid(id: string | number): Promise<WarehouseMeta> {
    const userId = typeof id === 'number' ? id : Number(id);
    if (!Number.isInteger(userId)) {
      return { warehouseId: null, warehouseName: null };
    }
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        warehouse: { select: { id: true, name: true } },
      },
    });
    return {
      warehouseId: user?.warehouse?.id ?? null,
      warehouseName: user?.warehouse?.name ?? null,
    };
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
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
    const normalizedWarehouseId = this.normalizeWarehouseId(dto.warehouseId);

    if (nextIsActive && !normalizedWarehouseId) {
      throw new BadRequestException('Active user must have warehouse assigned');
    }
    if (normalizedWarehouseId) {
      await this.ensureWarehouseExists(normalizedWarehouseId);
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

    await this.setWarehouseId(created.id, normalizedWarehouseId ?? null);
    const [serialized] = await this.serializeUsersWithWarehouse([created]);

    return {
      success: true,
      data: serialized,
    };
  }

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

    const serializedItems = await this.serializeUsersWithWarehouse(items);

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

    const [serialized] = await this.serializeUsersWithWarehouse([item]);

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
    const normalizedWarehouseId = this.normalizeWarehouseId(dto.warehouseId);

    if (normalizedWarehouseId) {
      await this.ensureWarehouseExists(normalizedWarehouseId);
    }

    const nextIsActive = dto.isActive ?? existing.isActive;
    const nextWarehouseId =
      normalizedWarehouseId !== undefined
        ? normalizedWarehouseId
        : await this.getCurrentWarehouseId(id);

    if (nextIsActive && !nextWarehouseId) {
      throw new BadRequestException('Active user must have warehouse assigned');
    }

    let updated;
    try {
      updated = await this.prisma.user.update({
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
      await this.setWarehouseId(id, normalizedWarehouseId);
    }

    const [serialized] = await this.serializeUsersWithWarehouse([updated]);
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

  async updateRefreshToken(_userId: string, _refreshToken: string | null) {
    // In a real app, you might want to hash this token before saving
    // For simplicity, we assume session management handles this or we add a field to User
    // But per our schema, we have a Session model. Let's use that instead or skip for MVP.
    // For MVP B0003, standard JWT usually doesn't strictly require DB storage unless we want revocation.
    // Let's stick to standard stateless JWT for now or implement Session later.
    return;
  }

  private normalizeWarehouseId(warehouseId?: string): number | null | undefined {
    if (warehouseId === undefined) {
      return undefined;
    }
    const normalized = warehouseId.trim();
    if (!normalized.length) return null;
    const parsed = Number(normalized);
    if (!Number.isInteger(parsed)) {
      throw new BadRequestException('Warehouse ID is invalid');
    }
    return parsed;
  }

  private async ensureWarehouseExists(warehouseId: number): Promise<void> {
    const warehouse = await this.prisma.masterDataWarehouse.findFirst({
      where: {
        id: warehouseId,
        deletedAt: null,
      },
      select: { id: true },
    });
    if (!warehouse) {
      throw new BadRequestException('Warehouse not found');
    }
  }

  private async getCurrentWarehouseId(userId: string | number): Promise<number | null> {
    const id = typeof userId === 'number' ? userId : Number(userId);
    if (!Number.isInteger(id)) return null;
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { warehouseId: true },
    });
    return user?.warehouseId ?? null;
  }

  private async setWarehouseId(userId: number, warehouseId: number | null): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { warehouseId },
    });
  }

  private async getWarehouseMapByUserUuids(userIds: number[]): Promise<Record<string, WarehouseMeta>> {
    if (userIds.length === 0) {
      return {};
    }

    const rows = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        warehouseId: true,
        warehouse: { select: { name: true } },
      },
    });

    const map: Record<string, WarehouseMeta> = {};
    for (const row of rows) {
      map[String(row.id)] = {
        warehouseId: row.warehouseId,
        warehouseName: row.warehouse?.name ?? null,
      };
    }
    return map;
  }

  private async serializeUsersWithWarehouse(
    users: Array<
      User & {
        roles?: Array<{
          role: {
            name: string;
          };
        }>;
      }
    >,
  ) {
    const warehouseMap = await this.getWarehouseMapByUserUuids(users.map((item) => item.id));
    return users.map((user) => this.serializeUser(user, warehouseMap[String(user.id)]));
  }

  private serializeUser(
    user: User & {
      roles?: Array<{
        role: {
          name: string;
        };
      }>;
    },
    warehouseMeta?: WarehouseMeta,
  ) {
    const { passwordHash: _passwordHash, ...safe } = user;
    return {
      ...safe,
      warehouseId: warehouseMeta?.warehouseId ?? null,
      warehouseName: warehouseMeta?.warehouseName ?? null,
      roles: user.roles?.map((item) => item.role.name) ?? [],
      role: user.roles?.[0]?.role?.name ?? null,
    };
  }
}
