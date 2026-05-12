import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword } from '../auth/password-hasher';
import { localDateAtMidnight, localPartsInTimezone } from '../clinic-booking/timezone.util';
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

      // Sync serviceIds junction (kosong = handle semua, filled = subset)
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
      data: this.mapToResponse(created.user, created.profile, dto.serviceIds ?? []),
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

    // Batch-load serviceIds junction untuk avoid N+1
    const userIds = profiles.map((p) => p.userId);
    const junctionRows =
      userIds.length === 0
        ? []
        : await this.prisma.clinicPsikologService.findMany({
            where: { psikologUserId: { in: userIds } },
            select: { psikologUserId: true, serviceId: true },
          });
    const serviceIdsByUser = new Map<number, number[]>();
    for (const r of junctionRows) {
      const arr = serviceIdsByUser.get(r.psikologUserId) ?? [];
      arr.push(r.serviceId);
      serviceIdsByUser.set(r.psikologUserId, arr);
    }

    return {
      success: true,
      data: profiles.map((p) =>
        this.mapToResponse(p.user, p, serviceIdsByUser.get(p.userId) ?? []),
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
      include: { user: this.userSelect() },
    });
    if (!profile) {
      throw new NotFoundException(`Psikolog with id ${id} tidak ditemukan`);
    }
    const serviceIds = await this.findServiceIds(profile.userId);
    return {
      success: true,
      data: this.mapToResponse(profile.user, profile, serviceIds),
    };
  }

  private async findServiceIds(psikologUserId: number): Promise<number[]> {
    const rows = await this.prisma.clinicPsikologService.findMany({
      where: { psikologUserId },
      select: { serviceId: true },
    });
    return rows.map((r) => r.serviceId);
  }

  /**
   * Lookup psikolog by JWT userId. Dipakai oleh GET /clinic/psikolog/me
   * sebagai self-fetch endpoint untuk `/psikolog/profile` page.
   */
  async findByUserId(userId: number) {
    const profile = await this.prisma.clinicPsikologProfile.findFirst({
      where: { userId, deletedAt: null },
      include: { user: this.userSelect() },
    });
    if (!profile) {
      throw new NotFoundException(`Psikolog profile untuk user ${userId} tidak ditemukan`);
    }
    const serviceIds = await this.findServiceIds(profile.userId);
    return {
      success: true,
      data: this.mapToResponse(profile.user, profile, serviceIds),
    };
  }

  /**
   * Self-edit subset profile (safe fields only). Psikolog tidak boleh edit
   * email/license/defaultSlots/specialty/isActive — admin-only via update().
   */
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

    // Avatar validation: kalau ada, harus data URL image atau http(s) URL.
    // Cap ukuran ~1.5MB base64 (≈ 1MB raw) supaya tidak bloat DB.
    if (dto.avatarUrl) {
      const v = dto.avatarUrl;
      const isDataUrl = v.startsWith('data:image/');
      const isHttpUrl = v.startsWith('http://') || v.startsWith('https://');
      if (!isDataUrl && !isHttpUrl) {
        throw new BadRequestException(
          'avatarUrl harus data URL (data:image/...;base64,...) atau URL absolut',
        );
      }
      if (isDataUrl && v.length > 1_500_000) {
        throw new BadRequestException('Foto terlalu besar — maksimal ~1MB setelah resize');
      }
    }

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

  /**
   * Statistik 30 hari untuk own profile page.
   * - sesi30Hari   : count completed bookings (30d window)
   * - klienAktif   : distinct clientId with booking di 90d (lebih inklusif)
   * - kehadiran    : completed / (completed + no_show + cancelled) dalam %.
   *                  No 'no_show' status di schema → pakai (cancelled / total) sebagai proxy.
   * - ratingKlien  : null (belum ada rating endpoint)
   */
  async getMyStats(userId: number) {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    const [completed30d, cancelled30d, distinctClients] = await Promise.all([
      this.prisma.clinicBooking.count({
        where: {
          psikologUserId: userId,
          status: 'completed',
          scheduledStart: { gte: thirtyDaysAgo, lte: now },
          deletedAt: null,
        },
      }),
      this.prisma.clinicBooking.count({
        where: {
          psikologUserId: userId,
          status: 'cancelled',
          scheduledStart: { gte: thirtyDaysAgo, lte: now },
          deletedAt: null,
        },
      }),
      this.prisma.clinicBooking.findMany({
        where: {
          psikologUserId: userId,
          status: { not: 'cancelled' },
          scheduledStart: { gte: ninetyDaysAgo },
          deletedAt: null,
        },
        select: { clientId: true },
        distinct: ['clientId'],
      }),
    ]);

    const total30d = completed30d + cancelled30d;
    const kehadiran = total30d > 0 ? Math.round((completed30d / total30d) * 100) : null;

    return {
      success: true,
      data: {
        sesi30Hari: completed30d,
        klienAktif: distinctClients.length,
        kehadiran, // % atau null kalau tidak ada data
        ratingKlien: null, // endpoint belum ada
      },
    };
  }

  /**
   * Dashboard psikolog stats — dipakai /psikolog/dashboard page.
   *
   * Berbeda dengan /me/stats (yang fokus 30-day profile metrics), endpoint
   * ini focus ke "today + this week + actionable queue":
   *   - today      : count by status (completed/in_progress/upcoming)
   *   - week       : 7 daily counts (Senin-Minggu, current week WIB)
   *   - klienAktif : distinct client 30d non-cancelled
   *   - pendingNotes: completed booking 7d tanpa ClinicSessionNote
   *   - packageEndingSoon: booking dengan sessionN = sessionTotal - 1, future 14d
   */
  async getDashboardStats(userId: number) {
    const tz = 'Asia/Jakarta';
    const nowLocal = localPartsInTimezone(new Date(), tz);
    const todayStr = nowLocal.dateStr; // YYYY-MM-DD di WIB
    const todayStart = localDateAtMidnight(todayStr, tz);
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    // Awal minggu = Senin (dow 1 .. 0=Minggu). Compute offset hari dari today.
    // Convert: Sen=0, Sel=1, ..., Min=6
    const isoDow = nowLocal.dow === 0 ? 6 : nowLocal.dow - 1;
    const weekStart = new Date(todayStart.getTime() - isoDow * 24 * 60 * 60 * 1000);
    const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);

    const thirtyDaysAgo = new Date(todayStart.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAhead = new Date(todayStart.getTime() + 14 * 24 * 60 * 60 * 1000);

    const [todayBookings, weekBookings, distinctClients30d, completedNoNote, packageEnding] =
      await Promise.all([
        // Today bookings — needed untuk count by status
        this.prisma.clinicBooking.findMany({
          where: {
            psikologUserId: userId,
            scheduledStart: { gte: todayStart, lt: todayEnd },
            deletedAt: null,
          },
          select: { status: true },
        }),
        // Week bookings — needed untuk daily count chart
        this.prisma.clinicBooking.findMany({
          where: {
            psikologUserId: userId,
            scheduledStart: { gte: weekStart, lt: weekEnd },
            status: { not: 'cancelled' },
            deletedAt: null,
          },
          select: { scheduledStart: true },
        }),
        // Klien aktif — distinct client 30d non-cancelled
        this.prisma.clinicBooking.findMany({
          where: {
            psikologUserId: userId,
            status: { not: 'cancelled' },
            scheduledStart: { gte: thirtyDaysAgo, lte: todayEnd },
            deletedAt: null,
          },
          select: { clientId: true },
          distinct: ['clientId'],
        }),
        // Completed bookings tanpa session note (last 7d) — pakai raw scan
        // karena Prisma tidak support left-anti-join langsung. Limit 10.
        this.prisma.clinicBooking.findMany({
          where: {
            psikologUserId: userId,
            status: 'completed',
            scheduledStart: { gte: sevenDaysAgo, lte: todayEnd },
            deletedAt: null,
          },
          select: {
            id: true,
            scheduledStart: true,
            client: { select: { name: true } },
            service: { select: { name: true } },
          },
          orderBy: { scheduledStart: 'desc' },
          take: 20,
        }),
        // Package ending soon — sessionN = sessionTotal - 1, future ≤14d
        this.prisma.clinicBooking.findMany({
          where: {
            psikologUserId: userId,
            status: { notIn: ['cancelled', 'completed'] },
            scheduledStart: { gte: todayStart, lt: fourteenDaysAhead },
            sessionTotal: { gt: 1 },
            deletedAt: null,
          },
          select: {
            id: true,
            scheduledStart: true,
            sessionN: true,
            sessionTotal: true,
            client: { select: { name: true } },
          },
          orderBy: { scheduledStart: 'asc' },
          take: 10,
        }),
      ]);

    // Filter completed-without-note via separate query (avoid raw SQL)
    const completedIds = completedNoNote.map((b) => b.id);
    const notesExisting = completedIds.length
      ? await this.prisma.clinicSessionNote.findMany({
          where: {
            bookingId: { in: completedIds },
            deletedAt: null,
          },
          select: { bookingId: true },
        })
      : [];
    const bookingsWithNote = new Set(notesExisting.map((n) => n.bookingId));
    const pendingNotes = completedNoNote
      .filter((b) => !bookingsWithNote.has(b.id))
      .map((b) => ({
        bookingId: b.id,
        clientName: b.client.name,
        serviceName: b.service.name,
        scheduledStart: b.scheduledStart.toISOString(),
      }));

    // Filter package ending soon to one-per-package (latest sessionN-1)
    const packageEndingSoon = packageEnding
      .filter((b) => b.sessionN === b.sessionTotal - 1)
      .slice(0, 5)
      .map((b) => ({
        bookingId: b.id,
        clientName: b.client.name,
        sessionN: b.sessionN,
        sessionTotal: b.sessionTotal,
        scheduledStart: b.scheduledStart.toISOString(),
      }));

    // Today buckets
    const today = {
      total: todayBookings.length,
      completed: todayBookings.filter((b) => b.status === 'completed').length,
      inProgress: todayBookings.filter((b) => b.status === 'in_progress').length,
      upcoming: todayBookings.filter((b) =>
        ['awaiting_dp', 'confirmed', 'checked_in'].includes(b.status),
      ).length,
      cancelled: todayBookings.filter((b) => b.status === 'cancelled').length,
    };

    // Week bucket: array [Sen, Sel, Rab, Kam, Jum, Sab, Min]
    const weekData = [0, 0, 0, 0, 0, 0, 0];
    for (const b of weekBookings) {
      const parts = localPartsInTimezone(b.scheduledStart, tz);
      // parts.dow: 0=Min..6=Sab → convert to 0=Sen..6=Min
      const idx = parts.dow === 0 ? 6 : parts.dow - 1;
      weekData[idx]++;
    }
    const weekTotal = weekData.reduce((a, b) => a + b, 0);

    return {
      success: true,
      data: {
        today,
        week: {
          data: weekData,
          total: weekTotal,
          startDate: localPartsInTimezone(weekStart, tz).dateStr,
        },
        klienAktif: distinctClients30d.length,
        catatanTertunda: pendingNotes.length,
        pendingNotes,
        packageEndingSoon,
        anchorDate: todayStr,
      },
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
        include: { user: this.userSelect() },
      });

      // Sync junction kalau dto.serviceIds di-provide (replace all).
      // undefined → biarkan apa adanya. [] → hapus (default "handle semua").
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
      data: this.mapToResponse(updated.user, updated, finalServiceIds),
      message: 'Psikolog updated',
    };
  }

  // -------------------- Self-service: Date overrides --------------------

  /** List override psikolog dalam range tanggal. Dipakai psikolog di dialog. */
  async listOwnDateOverrides(userId: number, from?: string, to?: string) {
    const where: Prisma.ClinicPsikologDateOverrideWhereInput = {
      psikologUserId: userId,
    };
    if (from || to) {
      where.date = {};
      if (from) (where.date as Prisma.DateTimeFilter).gte = new Date(from);
      if (to) (where.date as Prisma.DateTimeFilter).lte = new Date(to);
    }
    const items = await this.prisma.clinicPsikologDateOverride.findMany({
      where,
      orderBy: [{ date: 'asc' }],
    });
    return { success: true, data: items };
  }

  /** Upsert override (create kalau belum ada untuk (userId,date), else update). */
  async upsertOwnDateOverride(
    userId: number,
    input: {
      date: string;
      isOpen: boolean;
      slotIndices?: number[] | null;
      reason?: string | null;
    },
  ) {
    // Pastikan psikolog profile ada
    const profile = await this.prisma.clinicPsikologProfile.findFirst({
      where: { userId, deletedAt: null },
      select: { userId: true },
    });
    if (!profile) {
      throw new NotFoundException(`Profile psikolog tidak ditemukan untuk user ${userId}.`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) {
      throw new ConflictException(`Tanggal '${input.date}' bukan format ISO YYYY-MM-DD.`);
    }
    // Konversi date string ke midnight di TZ klinik (consistent dengan
    // resolveAvailabilityForDate + assertPsikologAvailable lookup).
    const settings = await this.prisma.clinicSettings.findFirst({
      where: { id: 1 },
      select: { timezone: true },
    });
    const dateObj = localDateAtMidnight(input.date, settings?.timezone || 'Asia/Jakarta');
    const slotIndicesValue: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue =
      input.slotIndices === undefined || input.slotIndices === null
        ? Prisma.DbNull
        : (input.slotIndices as Prisma.InputJsonValue);
    const upserted = await this.prisma.clinicPsikologDateOverride.upsert({
      where: { psikologUserId_date: { psikologUserId: userId, date: dateObj } },
      create: {
        psikologUserId: userId,
        date: dateObj,
        isOpen: input.isOpen,
        slotIndices: slotIndicesValue,
        reason: input.reason ?? null,
        createdBy: userId,
        updatedBy: userId,
      },
      update: {
        isOpen: input.isOpen,
        slotIndices: slotIndicesValue,
        reason: input.reason ?? null,
        updatedBy: userId,
      },
    });
    return { success: true, data: upserted, message: 'Override tersimpan' };
  }

  /** Hapus override → psikolog kembali ikut weeklyAvailability di tanggal tsb. */
  async deleteOwnDateOverride(userId: number, dateStr: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      throw new ConflictException(`Tanggal '${dateStr}' bukan format ISO YYYY-MM-DD.`);
    }
    const settings = await this.prisma.clinicSettings.findFirst({
      where: { id: 1 },
      select: { timezone: true },
    });
    const dateObj = localDateAtMidnight(dateStr, settings?.timezone || 'Asia/Jakarta');
    await this.prisma.clinicPsikologDateOverride
      .delete({
        where: { psikologUserId_date: { psikologUserId: userId, date: dateObj } },
      })
      .catch(() => {
        throw new NotFoundException(`Override tanggal ${dateStr} tidak ditemukan.`);
      });
    return { success: true, message: 'Override dihapus, kembali ke jadwal mingguan' };
  }

  /**
   * Psikolog update jadwal availability sendiri (self-service).
   * Lookup profile by userId (bukan profileId) dari JWT.
   */
  async updateOwnAvailability(
    userId: number,
    weeklyAvailability: Record<string, { isOpen: boolean; slotIndices?: number[] }>,
  ) {
    const profile = await this.prisma.clinicPsikologProfile.findFirst({
      where: { userId, deletedAt: null },
      select: { id: true },
    });
    if (!profile) {
      throw new NotFoundException(
        `Profile psikolog tidak ditemukan untuk user ${userId}. Hubungi admin.`,
      );
    }
    const updated = await this.prisma.clinicPsikologProfile.update({
      where: { id: profile.id },
      data: {
        weeklyAvailability: weeklyAvailability as Prisma.InputJsonValue,
        updatedBy: userId,
      },
      include: { user: this.userSelect() },
    });
    return {
      success: true,
      data: this.mapToResponse(updated.user, updated),
      message: 'Jadwal availability tersimpan',
    };
  }

  // -------------------- Resolve availability for booking wizard --------------------

  /**
   * Resolve effective availability untuk psikolog di tanggal tertentu.
   *
   * Priority:
   *   1. ClinicPsikologDateOverride (kalau ada untuk tanggal exact)
   *   2. weeklyAvailability[dayOfWeek] (fallback recurring)
   *   3. Belum set sama sekali → isOpen=false, source='unset'
   *
   * Dipakai oleh booking wizard untuk preview slot mana yang available
   * sebelum admin submit (mirror logic backend `assertPsikologAvailable`).
   *
   * Endpoint: GET /clinic/psikolog/:userId/availability-for-date?date=YYYY-MM-DD
   */
  async resolveAvailabilityForDate(psikologUserId: number, dateStr: string) {
    // Validate format YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      throw new ConflictException(`Tanggal '${dateStr}' bukan format ISO YYYY-MM-DD.`);
    }

    const settings = await this.prisma.clinicSettings.findFirst({
      where: { id: 1 },
      select: { timezone: true },
    });
    const tz = settings?.timezone || 'Asia/Jakarta';

    // dateOnly = midnight di TZ klinik (sebagai UTC instant). Penting karena
    // ClinicPsikologDateOverride.date di-simpan dengan asumsi clinic-local
    // midnight. dow juga dihitung di TZ klinik supaya konsisten.
    const dateObj = localDateAtMidnight(dateStr, tz);
    const dow = localPartsInTimezone(dateObj, tz).dow;

    const [override, profile] = await Promise.all([
      this.prisma.clinicPsikologDateOverride.findUnique({
        where: { psikologUserId_date: { psikologUserId, date: dateObj } },
      }),
      this.prisma.clinicPsikologProfile.findFirst({
        where: { userId: psikologUserId, deletedAt: null },
        select: {
          weeklyAvailability: true,
          user: { select: { fullName: true, email: true } },
        },
      }),
    ]);

    if (!profile) {
      throw new NotFoundException(`Profile psikolog untuk user ${psikologUserId} tidak ditemukan.`);
    }

    // 1. Override priority
    if (override) {
      return {
        success: true,
        data: {
          isOpen: override.isOpen,
          slotIndices: (override.slotIndices as number[] | null) ?? null,
          source: 'override' as const,
          reason: override.reason,
          psikologName: profile.user.fullName ?? profile.user.email,
        },
      };
    }

    // 2. Weekly fallback
    const wa = (profile.weeklyAvailability ?? {}) as Record<
      string,
      { isOpen: boolean; slotIndices?: number[] }
    >;
    if (Object.keys(wa).length === 0) {
      return {
        success: true,
        data: {
          isOpen: false,
          slotIndices: [] as number[],
          source: 'unset' as const,
          reason: null,
          psikologName: profile.user.fullName ?? profile.user.email,
        },
      };
    }

    const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayCfg = wa[DAY_KEYS[dow]];
    return {
      success: true,
      data: {
        isOpen: !!dayCfg?.isOpen,
        slotIndices: dayCfg?.slotIndices ?? null, // null = semua slot (kalau isOpen)
        source: 'weekly' as const,
        reason: null,
        psikologName: profile.user.fullName ?? profile.user.email,
      },
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

    // Block hard-delete kalau psikolog masih punya booking aktif/histori —
    // admin harus nonaktifkan (toggle isActive=false) supaya histori tidak orphan.
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
        phone: true,
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
      phone: string | null;
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
    serviceIds: number[] = [],
  ) {
    return {
      id: profile.id,
      userId: user.id,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      phone: user.phone,
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
      /**
       * Layanan yang ditangani psikolog. Kosong = handle SEMUA service
       * (default). Filled = hanya subset yang di-list.
       */
      serviceIds,
      bio: profile.bio,
      lastLogin: user.lastLogin,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
}
