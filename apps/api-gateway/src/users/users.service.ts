import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          where: {
            deletedAt: null,
            role: {
              deletedAt: null,
            },
          },
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

  async getWarehouseMetaByUserUuid(
    id: string | number,
  ): Promise<{ warehouseId: number | null; warehouseName: string | null }> {
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

  async getActiveRoleNamesByUserId(id: string | number): Promise<string[]> {
    const userId = typeof id === 'number' ? id : Number(id);
    if (!Number.isInteger(userId)) {
      return [];
    }

    const rows = await this.prisma.userRole.findMany({
      where: {
        userId,
        deletedAt: null,
        role: {
          deletedAt: null,
        },
      },
      include: {
        role: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [{ assignedAt: 'asc' }, { id: 'asc' }],
    });

    return rows
      .map((row) => row.role?.name?.trim())
      .filter((value): value is string => Boolean(value));
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async updateRefreshToken(_userId: string, _refreshToken: string | null) {
    // In a real app, you might want to hash this token before saving
    // For simplicity, we assume session management handles this or we add a field to User
    // But per our schema, we have a Session model. Let's use that instead or skip for MVP.
    // For MVP B0003, standard JWT usually doesn't strictly require DB storage unless we want revocation.
    // Let's stick to standard stateless JWT for now or implement Session later.
    return;
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
}
