import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword } from '../auth/password-hasher';
import {
  CreateClinicUserDto,
  QueryClinicUserDto,
  UpdateClinicUserDto,
} from './dto/clinic-users.dto';

const DEFAULT_PASSWORD = 'Test1234!';

@Injectable()
export class ClinicUsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateClinicUserDto, actorId?: number) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: { id: true },
    });
    if (existing) throw new ConflictException(`Email ${dto.email} sudah terdaftar.`);

    const validRoles = await this.prisma.role.findMany({
      where: { name: { in: dto.roles }, deletedAt: null },
      select: { id: true, name: true },
    });
    if (validRoles.length !== dto.roles.length) {
      const found = validRoles.map((r) => r.name);
      const missing = dto.roles.filter((r) => !found.includes(r));
      throw new NotFoundException(`Role tidak ditemukan: ${missing.join(', ')}`);
    }

    const username = (dto.username || dto.email.split('@')[0]).slice(0, 120);
    const passwordHash = await hashPassword(dto.password || DEFAULT_PASSWORD);

    const created = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email,
          username,
          passwordHash,
          fullName: dto.fullName,
          isActive: dto.isActive ?? true,
          createdBy: actorId,
          updatedBy: actorId,
        },
      });
      for (const role of validRoles) {
        await tx.userRole.create({
          data: {
            userId: user.id,
            roleId: role.id,
            createdBy: actorId,
            updatedBy: actorId,
          },
        });
      }
      return user;
    });

    return { success: true, data: await this.fetchOne(created.id), message: 'User created' };
  }

  async findAll(query: QueryClinicUserDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      deletedAt: null,
      // Hanya tampilkan user yang punya minimal 1 clinic-* role
      roles: {
        some: {
          deletedAt: null,
          role: {
            name: { startsWith: 'clinic-' },
            deletedAt: null,
          },
        },
      },
    };

    if (typeof query.isActive === 'boolean') where.isActive = query.isActive;
    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { email: { contains: q, mode: 'insensitive' } },
        { fullName: { contains: q, mode: 'insensitive' } },
        { username: { contains: q, mode: 'insensitive' } },
      ];
    }
    if (query.role) {
      where.roles = {
        some: {
          deletedAt: null,
          role: { name: query.role, deletedAt: null },
        },
      };
    }

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        include: {
          roles: {
            where: { deletedAt: null },
            include: { role: { select: { id: true, name: true, description: true } } },
          },
        },
        orderBy: [{ createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      success: true,
      data: users.map((u) => this.toResponse(u)),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number) {
    return { success: true, data: await this.fetchOne(id) };
  }

  async update(id: number, dto: UpdateClinicUserDto, actorId?: number) {
    const existing = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException(`User ${id} not found`);

    await this.prisma.$transaction(async (tx) => {
      const userUpdates: Prisma.UserUpdateInput = { updatedBy: actorId };
      if (dto.fullName !== undefined) userUpdates.fullName = dto.fullName;
      if (dto.isActive !== undefined) userUpdates.isActive = dto.isActive;
      if (dto.password) userUpdates.passwordHash = await hashPassword(dto.password);
      await tx.user.update({ where: { id }, data: userUpdates });

      if (dto.roles && dto.roles.length > 0) {
        // Strategy: soft-delete current clinic-* roles, then add new ones
        const currentRoles = await tx.userRole.findMany({
          where: {
            userId: id,
            deletedAt: null,
            role: { name: { startsWith: 'clinic-' } },
          },
          select: { id: true, roleId: true, role: { select: { name: true } } },
        });
        const currentRoleNames = currentRoles.map((r) => r.role.name);
        const targetRoles = await tx.role.findMany({
          where: { name: { in: dto.roles } },
          select: { id: true, name: true },
        });

        // Soft-delete roles tidak dipakai lagi
        const toRemove = currentRoles.filter((r) => !dto.roles!.includes(r.role.name));
        for (const r of toRemove) {
          await tx.userRole.update({
            where: { id: r.id },
            data: { deletedAt: new Date(), deletedBy: actorId },
          });
        }
        // Add roles baru
        const toAdd = targetRoles.filter((r) => !currentRoleNames.includes(r.name));
        for (const r of toAdd) {
          await tx.userRole.upsert({
            where: { userId_roleId: { userId: id, roleId: r.id } },
            update: { deletedAt: null, deletedBy: null, updatedBy: actorId },
            create: { userId: id, roleId: r.id, createdBy: actorId, updatedBy: actorId },
          });
        }
      }
    });

    return { success: true, data: await this.fetchOne(id), message: 'User updated' };
  }

  async remove(id: number, actorId?: number) {
    const existing = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException(`User ${id} not found`);
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy: actorId, isActive: false, updatedBy: actorId },
    });
    return { success: true, message: 'User deleted' };
  }

  // ----- Helper -----

  private async fetchOne(id: number) {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      include: {
        roles: {
          where: { deletedAt: null },
          include: { role: { select: { id: true, name: true, description: true } } },
        },
      },
    });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return this.toResponse(user);
  }

  private toResponse(user: {
    id: number;
    email: string;
    username: string;
    fullName: string | null;
    avatarUrl: string | null;
    isActive: boolean;
    lastLogin: Date | null;
    createdAt: Date;
    roles: Array<{ role: { id: number; name: string; description: string | null } }>;
  }) {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      roles: user.roles.map((r) => r.role).filter((r) => r.name.startsWith('clinic-')),
    };
  }
}
