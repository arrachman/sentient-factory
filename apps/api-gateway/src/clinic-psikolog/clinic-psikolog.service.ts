import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword } from '../auth/password-hasher';
import { CreatePsikologDto } from './dto/create-psikolog.dto';
import { QueryPsikologDto } from './dto/query-psikolog.dto';
import { UpdatePsikologDto } from './dto/update-psikolog.dto';

const PSIKOLOG_ROLE_NAME = 'clinic-psikolog';
const DEFAULT_PASSWORD = 'Test1234!'; // TODO: replace dengan auto-generate + WA invite (Slice 8)

@Injectable()
export class ClinicPsikologService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create user dengan role clinic-psikolog + ClinicPsikologProfile.
   * Wrapped dalam transaction — semua atau tidak sama sekali.
   */
  async create(dto: CreatePsikologDto, actorId?: number) {
    // Validate email uniqueness
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: { id: true, deletedAt: true },
    });
    if (existing) {
      throw new ConflictException(
        `Email ${dto.email} sudah terdaftar${existing.deletedAt ? ' (soft-deleted)' : ''}.`,
      );
    }

    // Find clinic-psikolog role
    const role = await this.prisma.role.findUnique({
      where: { name: PSIKOLOG_ROLE_NAME },
      select: { id: true },
    });
    if (!role) {
      throw new NotFoundException(
        `Role '${PSIKOLOG_ROLE_NAME}' tidak ditemukan. Run db:seed:clinic dulu.`,
      );
    }

    const username = (dto.username || this.deriveUsername(dto.email, dto.fullName)).slice(0, 120);
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

      await tx.userRole.create({
        data: {
          userId: user.id,
          roleId: role.id,
          createdBy: actorId,
          updatedBy: actorId,
        },
      });

      const profile = await tx.clinicPsikologProfile.create({
        data: {
          userId: user.id,
          title: dto.title,
          specialty: dto.specialty ?? [],
          color: dto.color,
          license: dto.license,
          defaultSlots: dto.defaultSlots ?? 4,
          weeklyAvailability: (dto.weeklyAvailability as Prisma.InputJsonValue | undefined) ?? {},
          bio: dto.bio,
          isActive: dto.isActive ?? true,
          createdBy: actorId,
          updatedBy: actorId,
        },
      });

      return { user, profile };
    });

    return {
      success: true,
      data: this.mapToResponse(created.user, created.profile),
      message: 'Psikolog created',
    };
  }

  async findAll(query: QueryPsikologDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ClinicPsikologProfileWhereInput = {
      deletedAt: null,
      user: { deletedAt: null },
    };

    if (typeof query.isActive === 'boolean') {
      where.isActive = query.isActive;
    }

    if (query.specialty?.trim()) {
      where.specialty = { has: query.specialty.trim() };
    }

    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { license: { contains: q, mode: 'insensitive' } },
        { user: { fullName: { contains: q, mode: 'insensitive' } } },
        { user: { email: { contains: q, mode: 'insensitive' } } },
      ];
    }

    const [profiles, total] = await this.prisma.$transaction([
      this.prisma.clinicPsikologProfile.findMany({
        where,
        include: { user: this.userSelect() },
        orderBy: [{ createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.clinicPsikologProfile.count({ where }),
    ]);

    return {
      success: true,
      data: profiles.map((p) => this.mapToResponse(p.user, p)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const profile = await this.prisma.clinicPsikologProfile.findFirst({
      where: { id, deletedAt: null },
      include: { user: this.userSelect() },
    });
    if (!profile) {
      throw new NotFoundException(`Psikolog with id ${id} tidak ditemukan`);
    }
    return {
      success: true,
      data: this.mapToResponse(profile.user, profile),
    };
  }

  async update(id: number, dto: UpdatePsikologDto, actorId?: number) {
    const existing = await this.prisma.clinicPsikologProfile.findFirst({
      where: { id, deletedAt: null },
      include: { user: { select: { id: true } } },
    });
    if (!existing) {
      throw new NotFoundException(`Psikolog with id ${id} tidak ditemukan`);
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      // Update User fullName & isActive if provided
      const userUpdates: Prisma.UserUpdateInput = {};
      if (dto.fullName !== undefined) userUpdates.fullName = dto.fullName;
      if (dto.isActive !== undefined) userUpdates.isActive = dto.isActive;
      if (Object.keys(userUpdates).length > 0) {
        userUpdates.updatedBy = actorId;
        await tx.user.update({
          where: { id: existing.userId },
          data: userUpdates,
        });
      }

      // Update ClinicPsikologProfile fields
      const profileUpdates: Prisma.ClinicPsikologProfileUpdateInput = {};
      if (dto.title !== undefined) profileUpdates.title = dto.title;
      if (dto.specialty !== undefined) profileUpdates.specialty = dto.specialty;
      if (dto.color !== undefined) profileUpdates.color = dto.color;
      if (dto.license !== undefined) profileUpdates.license = dto.license;
      if (dto.defaultSlots !== undefined) profileUpdates.defaultSlots = dto.defaultSlots;
      if (dto.weeklyAvailability !== undefined)
        profileUpdates.weeklyAvailability = dto.weeklyAvailability as Prisma.InputJsonValue;
      if (dto.bio !== undefined) profileUpdates.bio = dto.bio;
      if (dto.isActive !== undefined) profileUpdates.isActive = dto.isActive;
      profileUpdates.updatedBy = actorId;

      const profile = await tx.clinicPsikologProfile.update({
        where: { id },
        data: profileUpdates,
        include: { user: this.userSelect() },
      });

      return profile;
    });

    return {
      success: true,
      data: this.mapToResponse(updated.user, updated),
      message: 'Psikolog updated',
    };
  }

  async remove(id: number, actorId?: number) {
    const existing = await this.prisma.clinicPsikologProfile.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, userId: true },
    });
    if (!existing) {
      throw new NotFoundException(`Psikolog with id ${id} tidak ditemukan`);
    }

    const now = new Date();
    await this.prisma.$transaction([
      this.prisma.clinicPsikologProfile.update({
        where: { id },
        data: {
          deletedAt: now,
          deletedBy: actorId,
          isActive: false,
          updatedBy: actorId,
        },
      }),
      this.prisma.user.update({
        where: { id: existing.userId },
        data: {
          deletedAt: now,
          deletedBy: actorId,
          isActive: false,
          updatedBy: actorId,
        },
      }),
    ]);

    return {
      success: true,
      message: 'Psikolog deleted (soft delete)',
    };
  }

  // ----- Helpers -----

  private deriveUsername(email: string, fullName: string): string {
    // Prefer slug from fullName, fallback to email local-part
    const fromName = fullName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    if (fromName.length >= 3) return fromName;
    return email.split('@')[0]?.toLowerCase() || `psikolog-${Date.now()}`;
  }

  private userSelect() {
    return {
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        avatarUrl: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
      },
    };
  }

  private mapToResponse(
    user: {
      id: number;
      email: string;
      username: string;
      fullName: string | null;
      avatarUrl: string | null;
      isActive: boolean;
      lastLogin: Date | null;
      createdAt: Date;
    },
    profile: {
      id: number;
      title: string | null;
      specialty: string[];
      color: string | null;
      license: string | null;
      defaultSlots: number;
      weeklyAvailability?: unknown;
      bio: string | null;
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
    },
  ) {
    return {
      id: profile.id,
      userId: user.id,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      isActive: profile.isActive && user.isActive,
      title: profile.title,
      specialty: profile.specialty,
      color: profile.color,
      license: profile.license,
      defaultSlots: profile.defaultSlots,
      weeklyAvailability: (profile.weeklyAvailability ?? {}) as Record<
        string,
        { isOpen: boolean; slotIndices?: number[] }
      >,
      bio: profile.bio,
      lastLogin: user.lastLogin,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
}
