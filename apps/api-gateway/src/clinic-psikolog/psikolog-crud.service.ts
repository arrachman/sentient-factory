import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword } from '../auth/password-hasher';
import { ClinicWaService } from '../clinic-wa/clinic-wa.service';
import { CreatePsikologDto } from './dto/create-psikolog.dto';
import { QueryPsikologDto } from './dto/query-psikolog.dto';
import { PsikologListStatsService } from './psikolog-list-stats.service';
import { buildPsikologWhereClause, deriveUsername, mapPsikologToResponse, userSelect } from './psikolog.utils';

const PSIKOLOG_ROLE_NAME = 'clinic-psikolog';
const DEFAULT_PASSWORD = 'Test1234!';

@Injectable()
export class PsikologCrudService {
  private readonly logger = new Logger(PsikologCrudService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly wa: ClinicWaService,
    private readonly listStats: PsikologListStatsService,
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

    // Welcome WA — fire-and-forget. Skip kalau psikolog tidak ada phone (admin
    // bisa lengkapi via Update). Error tidak block create.
    if (created.user.phone) {
      void this.wa
        .dispatch({
          templateName: 'Welcome Psikolog Baru',
          recipientType: 'psikolog',
          recipientPhone: created.user.phone,
          variables: {
            nama_psikolog: created.user.fullName ?? created.user.email,
            username: created.user.username ?? created.user.email,
            login_url: process.env.WEB_ALTHEA_URL ?? 'https://althea.fr-labs.my.id',
          },
        })
        .catch((err) =>
          this.logger.warn(
            `[psikolog-welcome] dispatch failed userId=${created.user.id}: ${err instanceof Error ? err.message : err}`,
          ),
        );
    }

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

    // Batch-load semua list stats (junction + booking-existence + today/week/client)
    const userIds = profiles.map((p) => p.userId);
    const { serviceIdsByUser, hasBookingsSet, todayMap, weekMap, clientMap } =
      await this.listStats.loadListStats(userIds);

    return {
      success: true,
      data: profiles.map((p) => ({
        ...mapPsikologToResponse(p.user, p, serviceIdsByUser.get(p.userId) ?? []),
        hasBookings: hasBookingsSet.has(p.userId),
        todayCount: todayMap.get(p.userId) ?? 0,
        weekCount: weekMap.get(p.userId) ?? 0,
        clientCount: clientMap.get(p.userId) ?? 0,
      })),
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

  async findServiceIds(psikologUserId: number): Promise<number[]> {
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
}
