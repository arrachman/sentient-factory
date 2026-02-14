import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashPassword } from '../auth/password-hasher';

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

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async createFromAdmin(dto: CreateUserDto, actorId?: string) {
    const duplicate = await this.prisma.user.findFirst({
      where: {
        deletedAt: null,
        OR: [{ email: dto.email }, { username: dto.username }],
      },
      select: { email: true, username: true },
    });

    if (duplicate?.email === dto.email) {
      throw new BadRequestException(`Email '${dto.email}' already exists`);
    }
    if (duplicate?.username === dto.username) {
      throw new BadRequestException(`Username '${dto.username}' already exists`);
    }

    const passwordHash = await hashPassword(dto.password);

    const created = await this.prisma.user.create({
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

    return {
      success: true,
      data: this.serializeUser(created),
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

    return {
      success: true,
      data: items.map((item) => this.serializeUser(item)),
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

    return {
      success: true,
      data: this.serializeUser(item),
    };
  }

  async update(uuid: string, dto: UpdateUserDto, actorId?: string) {
    const existing = await this.prisma.user.findFirst({
      where: { uuid, deletedAt: null },
      select: { uuid: true, email: true, username: true },
    });
    if (!existing) {
      throw new NotFoundException('User not found');
    }

    if (dto.email && dto.email !== existing.email) {
      const emailExists = await this.prisma.user.findFirst({
        where: { email: dto.email, deletedAt: null, NOT: { uuid } },
        select: { uuid: true },
      });
      if (emailExists) {
        throw new BadRequestException(`Email '${dto.email}' already exists`);
      }
    }

    if (dto.username && dto.username !== existing.username) {
      const usernameExists = await this.prisma.user.findFirst({
        where: { username: dto.username, deletedAt: null, NOT: { uuid } },
        select: { uuid: true },
      });
      if (usernameExists) {
        throw new BadRequestException(`Username '${dto.username}' already exists`);
      }
    }

    const passwordHash = dto.password ? await hashPassword(dto.password) : undefined;

    const updated = await this.prisma.user.update({
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

    return {
      success: true,
      data: this.serializeUser(updated),
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

  private serializeUser(
    user: User & {
      roles?: Array<{
        role: {
          name: string;
        };
      }>;
    },
  ) {
    const { passwordHash: _passwordHash, ...safe } = user;
    return {
      ...safe,
      roles: user.roles?.map((item) => item.role.name) ?? [],
      role: user.roles?.[0]?.role?.name ?? null,
    };
  }
}
