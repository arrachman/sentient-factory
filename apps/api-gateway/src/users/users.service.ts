import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { isUniqueViolation, throwDuplicate } from '../common/errors/duplicate.util';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashPassword } from '../auth/password-hasher';

type WarehouseMeta = {
  warehouseId: string | null;
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

  async findOneById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { uuid: id },
    });
  }

  async findOneByUuid(uuid: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { uuid },
    });
  }

  async hasWarehouse(uuid: string): Promise<boolean> {
    const warehouseId = await this.getCurrentWarehouseId(uuid);
    return Boolean(warehouseId);
  }

  async getWarehouseMetaByUserUuid(uuid: string): Promise<WarehouseMeta> {
    const rows = await this.prisma.$queryRaw<
      Array<{ warehouse_id: string | null; warehouse_name: string | null }>
    >`
      SELECT u.warehouse_id, w.name AS warehouse_name
      FROM "m0_users" u
      LEFT JOIN "m1_warehouse" w ON w.uuid = u.warehouse_id AND w.deleted_at IS NULL
      WHERE u.uuid = ${uuid}
      LIMIT 1
    `;

    return {
      warehouseId: rows[0]?.warehouse_id ?? null,
      warehouseName: rows[0]?.warehouse_name ?? null,
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
          createdBy: actorId ?? null,
          updatedBy: actorId ?? null,
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

    await this.setWarehouseId(created.uuid, normalizedWarehouseId ?? null);
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

  async findOne(uuid: string) {
    const item = await this.prisma.user.findFirst({
      where: { uuid, deletedAt: null },
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

  async update(uuid: string, dto: UpdateUserDto, actorId?: string) {
    const existing = await this.prisma.user.findFirst({
      where: { uuid, deletedAt: null },
      select: { uuid: true, email: true, username: true, isActive: true },
    });
    if (!existing) {
      throw new NotFoundException('User not found');
    }

    if (dto.email && dto.email !== existing.email) {
      const emailExists = await this.prisma.user.findFirst({
        where: { email: dto.email, NOT: { uuid } },
        select: { uuid: true, deletedAt: true },
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
        where: { username: dto.username, NOT: { uuid } },
        select: { uuid: true, deletedAt: true },
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
        : await this.getCurrentWarehouseId(uuid);

    if (nextIsActive && !nextWarehouseId) {
      throw new BadRequestException('Active user must have warehouse assigned');
    }

    let updated;
    try {
      updated = await this.prisma.user.update({
        where: { uuid },
        data: {
          email: dto.email,
          username: dto.username,
          fullName: dto.fullName,
          isActive: dto.isActive,
          passwordHash,
          updatedBy: actorId ?? null,
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
      await this.setWarehouseId(uuid, normalizedWarehouseId);
    }

    const [serialized] = await this.serializeUsersWithWarehouse([updated]);
    return {
      success: true,
      data: serialized,
    };
  }

  async remove(uuid: string, actorId?: string) {
    const existing = await this.prisma.user.findFirst({
      where: { uuid, deletedAt: null },
      select: { uuid: true },
    });
    if (!existing) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.update({
      where: { uuid },
      data: {
        isActive: false,
        deletedAt: new Date(),
        deletedBy: actorId ?? null,
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

  private normalizeWarehouseId(warehouseId?: string): string | null | undefined {
    if (warehouseId === undefined) {
      return undefined;
    }
    const normalized = warehouseId.trim();
    return normalized.length > 0 ? normalized : null;
  }

  private async ensureWarehouseExists(warehouseId: string): Promise<void> {
    const warehouse = await this.prisma.masterDataWarehouse.findFirst({
      where: {
        uuid: warehouseId,
        deletedAt: null,
      },
      select: { uuid: true },
    });
    if (!warehouse) {
      throw new BadRequestException('Warehouse not found');
    }
  }

  private async getCurrentWarehouseId(userUuid: string): Promise<string | null> {
    const rows = await this.prisma.$queryRaw<Array<{ warehouse_id: string | null }>>`
      SELECT warehouse_id
      FROM "m0_users"
      WHERE uuid = ${userUuid}
      LIMIT 1
    `;
    return rows[0]?.warehouse_id ?? null;
  }

  private async setWarehouseId(userUuid: string, warehouseId: string | null): Promise<void> {
    await this.prisma.$executeRaw`
      UPDATE "m0_users"
      SET warehouse_id = ${warehouseId}
      WHERE uuid = ${userUuid}
    `;
  }

  private async getWarehouseMapByUserUuids(userUuids: string[]): Promise<Record<string, WarehouseMeta>> {
    if (userUuids.length === 0) {
      return {};
    }

    const rows = await this.prisma.$queryRaw<
      Array<{ user_uuid: string; warehouse_id: string | null; warehouse_name: string | null }>
    >(
      Prisma.sql`
        SELECT u.uuid AS user_uuid, u.warehouse_id, w.name AS warehouse_name
        FROM "m0_users" u
        LEFT JOIN "m1_warehouse" w ON w.uuid = u.warehouse_id AND w.deleted_at IS NULL
        WHERE u.uuid IN (${Prisma.join(userUuids)})
      `,
    );

    const map: Record<string, WarehouseMeta> = {};
    for (const row of rows) {
      map[row.user_uuid] = {
        warehouseId: row.warehouse_id,
        warehouseName: row.warehouse_name,
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
    const warehouseMap = await this.getWarehouseMapByUserUuids(users.map((item) => item.uuid));
    return users.map((user) => this.serializeUser(user, warehouseMap[user.uuid]));
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
