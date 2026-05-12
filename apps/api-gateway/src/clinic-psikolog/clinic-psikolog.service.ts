import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword } from '../auth/password-hasher';
import { CreatePsikologDto } from './dto/create-psikolog.dto';
import { QueryPsikologDto } from './dto/query-psikolog.dto';
import { UpdatePsikologDto } from './dto/update-psikolog.dto';
import { PsikologDashboardService } from './psikolog-dashboard.service';
import { PsikologAvailabilityService } from './psikolog-availability.service';
import {
  buildPsikologWhereClause,
  deriveUsername,
  groupServiceIdsByUser,
  mapPsikologToResponse,
  userSelect,
  validateAvatarUrl,
} from './psikolog.utils';

const PSIKOLOG_ROLE_NAME = 'clinic-psikolog';
const DEFAULT_PASSWORD = 'Test1234!'; // TODO: replace dengan auto-generate + WA invite (Slice 8)

@Injectable()
export class ClinicPsikologService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dashboard: PsikologDashboardService,
    private readonly availability: PsikologAvailabilityService,
  ) {}

  /** Create user + ClinicPsikologProfile dalam satu transaction. */
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

    const username = (dto.username || deriveUsername(dto.email, dto.fullName)).slice(0, 120);
    const passwordHash = await hashPassword(dto.password || DEFAULT_PASSWORD);

    const created = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email,
          username,
          passwordHash,
          fullName: dto.fullName,
          phone: dto.phone ?? null,
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

      if (dto.serviceIds && dto.serviceIds.length > 0) {
        await tx.clinicPsikologService.createMany({
          data: dto.serviceIds.map((serviceId) => ({
            psikologUserId: user.id,
            serviceId,
            createdBy: actorId,
          })),
          skipDuplicates: true,
        });
      }

      return { user, profile };
    });

    return {
      success: true,
      data: mapPsikologToResponse(created.user, created.profile, dto.serviceIds ?? []),
      message: 'Psikolog created',
    };
  }

  async findAll(query: QueryPsikologDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where = buildPsikologWhereClause(query) as Prisma.ClinicPsikologProfileWhereInput;

    const [profiles, total] = await this.prisma.$transaction([
      this.prisma.clinicPsikologProfile.findMany({
        where,
        include: { user: userSelect() },
        orderBy: [{ createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.clinicPsikologProfile.count({ where }),
    ]);

    // Batch-load serviceIds junction untuk avoid N+1
    const userIds = profiles.map((p) => p.userId);
    const junctionRows =
      userIds.length === 0
        ? []
        : await this.prisma.clinicPsikologService.findMany({
            where: { psikologUserId: { in: userIds } },
            select: { psikologUserId: true, serviceId: true },
          });
    const serviceIdsByUser = groupServiceIdsByUser(junctionRows);

    return {
      success: true,
      data: profiles.map((p) =>
        mapPsikologToResponse(p.user, p, serviceIdsByUser.get(p.userId) ?? []),
      ),
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
      include: { user: userSelect() },
    });
    if (!profile) {
      throw new NotFoundException(`Psikolog with id ${id} tidak ditemukan`);
    }
    const serviceIds = await this.findServiceIds(profile.userId);
    return {
      success: true,
      data: mapPsikologToResponse(profile.user, profile, serviceIds),
    };
  }

  private async findServiceIds(psikologUserId: number): Promise<number[]> {
    const rows = await this.prisma.clinicPsikologService.findMany({
      where: { psikologUserId },
      select: { serviceId: true },
    });
    return rows.map((r) => r.serviceId);
  }

  /** Lookup psikolog by JWT userId — dipakai oleh GET /clinic/psikolog/me. */
  async findByUserId(userId: number) {
    const profile = await this.prisma.clinicPsikologProfile.findFirst({
      where: { userId, deletedAt: null },
      include: { user: userSelect() },
    });
    if (!profile) {
      throw new NotFoundException(`Psikolog profile untuk user ${userId} tidak ditemukan`);
    }
    const serviceIds = await this.findServiceIds(profile.userId);
    return {
      success: true,
      data: mapPsikologToResponse(profile.user, profile, serviceIds),
    };
  }

  /** Self-edit subset profile. Admin-only fields (email/license/etc) via update(). */
  async updateMe(
    userId: number,
    dto: {
      fullName?: string;
      title?: string;
      bio?: string;
      color?: string;
      avatarUrl?: string | null;
    },
  ) {
    const profile = await this.prisma.clinicPsikologProfile.findFirst({
      where: { userId, deletedAt: null },
      include: { user: { select: { id: true } } },
    });
    if (!profile) {
      throw new NotFoundException(`Psikolog profile untuk user ${userId} tidak ditemukan`);
    }

    validateAvatarUrl(dto.avatarUrl ?? undefined);

    await this.prisma.$transaction(async (tx) => {
      // User.fullName + avatarUrl self-update OK
      const userUpdates: Prisma.UserUpdateInput = { updatedBy: userId };
      let hasUserUpdate = false;
      if (dto.fullName !== undefined) {
        userUpdates.fullName = dto.fullName;
        hasUserUpdate = true;
      }
      if (dto.avatarUrl !== undefined) {
        userUpdates.avatarUrl = dto.avatarUrl;
        hasUserUpdate = true;
      }
      if (hasUserUpdate) {
        await tx.user.update({ where: { id: userId }, data: userUpdates });
      }

      // Profile self-editable subset
      const profileUpdates: Prisma.ClinicPsikologProfileUpdateInput = {};
      if (dto.title !== undefined) profileUpdates.title = dto.title;
      if (dto.bio !== undefined) profileUpdates.bio = dto.bio;
      if (dto.color !== undefined) profileUpdates.color = dto.color;

      if (Object.keys(profileUpdates).length > 0) {
        profileUpdates.updatedBy = userId;
        await tx.clinicPsikologProfile.update({
          where: { id: profile.id },
          data: profileUpdates,
        });
      }
    });

    return this.findByUserId(userId);
  }

  // -------------------- Delegates --------------------

  getMyStats(userId: number) { return this.dashboard.getMyStats(userId); }
  getDashboardStats(userId: number) { return this.dashboard.getDashboardStats(userId); }

  listOwnDateOverrides(userId: number, from?: string, to?: string) {
    return this.availability.listOwnDateOverrides(userId, from, to);
  }
  upsertOwnDateOverride(
    userId: number,
    input: { date: string; isOpen: boolean; slotIndices?: number[] | null; reason?: string | null },
  ) { return this.availability.upsertOwnDateOverride(userId, input); }
  deleteOwnDateOverride(userId: number, dateStr: string) {
    return this.availability.deleteOwnDateOverride(userId, dateStr);
  }
  updateOwnAvailability(
    userId: number,
    weeklyAvailability: Record<string, { isOpen: boolean; slotIndices?: number[] }>,
  ) { return this.availability.updateOwnAvailability(userId, weeklyAvailability); }
  resolveAvailabilityForDate(psikologUserId: number, dateStr: string) {
    return this.availability.resolveAvailabilityForDate(psikologUserId, dateStr);
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
      if (dto.phone !== undefined) userUpdates.phone = dto.phone || null;
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
        include: { user: userSelect() },
      });

      // undefined → skip, [] → hapus (default "handle semua"), filled → replace
      if (dto.serviceIds !== undefined) {
        await tx.clinicPsikologService.deleteMany({
          where: { psikologUserId: profile.userId },
        });
        if (dto.serviceIds.length > 0) {
          await tx.clinicPsikologService.createMany({
            data: dto.serviceIds.map((serviceId) => ({
              psikologUserId: profile.userId,
              serviceId,
              createdBy: actorId,
            })),
            skipDuplicates: true,
          });
        }
      }

      return profile;
    });

    const finalServiceIds = await this.findServiceIds(updated.userId);
    return {
      success: true,
      data: mapPsikologToResponse(updated.user, updated, finalServiceIds),
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

    const bookingCount = await this.prisma.clinicBooking.count({
      where: { psikologUserId: existing.userId, deletedAt: null },
    });
    if (bookingCount > 0) {
      throw new ConflictException(
        `Psikolog ini punya ${bookingCount} booking terkait. Tidak bisa dihapus — nonaktifkan saja lewat toggle "Aktif" di form edit.`,
      );
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
}
