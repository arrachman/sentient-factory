import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateClientDto,
  QueryClientDto,
  UpdateClientDto,
  type ClientStatus,
} from './dto/clinic-client.dto';

type BookingSlim = {
  id: number;
  scheduledStart: Date;
  scheduledEnd: Date;
  sessionN: number;
  sessionTotal: number;
  packageGroupId: string | null;
  status: string;
  service: { id: number; name: string } | null;
  psikolog: { fullName: string | null; email: string } | null;
};

type ClientEnriched = {
  id: number;
  name: string;
  gender: string;
  age: number | null;
  category: string | null;
  phoneWa: string;
  medicalRecordNumber: string | null;
  preferredServiceType: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  waOptedOut: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Derived
  derivedStatus: ClientStatus;
  totalBookings: number;
  lastSession: { date: Date; serviceName: string | null; psikologName: string | null } | null;
  nextSession: { date: Date; serviceName: string | null; psikologName: string | null } | null;
  currentService: {
    name: string;
    psikologName: string | null;
    sessionN: number;
    sessionTotal: number;
  } | null;
};

const SELESAI_THRESHOLD_DAYS = 30;

@Injectable()
export class ClinicClientService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateClientDto, actorId?: number) {
    if (dto.medicalRecordNumber) {
      const existing = await this.prisma.clinicClient.findFirst({
        where: { medicalRecordNumber: dto.medicalRecordNumber, deletedAt: null },
        select: { id: true },
      });
      if (existing) {
        throw new ConflictException(`MRN ${dto.medicalRecordNumber} sudah dipakai.`);
      }
    }
    const category = dto.category ?? this.deriveCategoryFromAge(dto.age);
    const created = await this.prisma.clinicClient.create({
      data: {
        ...dto,
        category,
        waOptedOut: dto.waOptedOut ?? false,
        createdBy: actorId,
        updatedBy: actorId,
      },
    });
    return { success: true, data: created, message: 'Client created' };
  }

  async findAll(query: QueryClientDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;
    const where: Prisma.ClinicClientWhereInput = { deletedAt: null };
    if (query.gender) where.gender = query.gender;
    if (query.category) where.category = query.category;
    if (typeof query.waOptedOut === 'boolean') where.waOptedOut = query.waOptedOut;
    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { phoneWa: { contains: q, mode: 'insensitive' } },
        { medicalRecordNumber: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
      ];
    }

    // Strategy: fetch over-page, enrich, then apply status filter + pagination
    // Untuk skala MVP (<10k klien) ini cukup. Future: bikin SQL view derived status.
    const items = await this.prisma.clinicClient.findMany({
      where,
      orderBy: [{ name: 'asc' }],
    });
    const enrichedAll = await this.enrichBatch(items);
    const filteredByStatus = query.status
      ? enrichedAll.filter((c) => c.derivedStatus === query.status)
      : enrichedAll;
    const total = filteredByStatus.length;
    const paged = filteredByStatus.slice(skip, skip + limit);

    return {
      success: true,
      data: paged,
      meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
    };
  }

  async findOne(id: number) {
    const client = await this.prisma.clinicClient.findFirst({
      where: { id, deletedAt: null },
    });
    if (!client) throw new NotFoundException(`Client ${id} not found`);
    const [enriched] = await this.enrichBatch([client]);
    const history = await this.prisma.clinicBooking.findMany({
      where: { clientId: id, status: 'completed', deletedAt: null },
      orderBy: { scheduledStart: 'desc' },
      take: 5,
      include: {
        service: { select: { id: true, name: true } },
        psikolog: { select: { fullName: true, email: true } },
      },
    });
    return {
      success: true,
      data: {
        ...enriched,
        recentSessions: history.map((b) => ({
          id: b.id,
          date: b.scheduledStart,
          serviceName: b.service?.name ?? null,
          psikologName: b.psikolog?.fullName ?? b.psikolog?.email ?? null,
          status: b.status,
        })),
      },
    };
  }

  async update(id: number, dto: UpdateClientDto, actorId?: number) {
    await this.findOne(id);
    const data: Prisma.ClinicClientUpdateInput = { ...dto, updatedBy: actorId };
    if (dto.age !== undefined && dto.category === undefined) {
      // re-derive category kalau age berubah dan category gak di-set explicit
      data.category = this.deriveCategoryFromAge(dto.age);
    }
    const updated = await this.prisma.clinicClient.update({ where: { id }, data });
    return { success: true, data: updated, message: 'Client updated' };
  }

  async remove(id: number, actorId?: number) {
    await this.findOne(id);
    await this.prisma.clinicClient.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy: actorId, updatedBy: actorId },
    });
    return { success: true, message: 'Client deleted' };
  }

  // ----- helpers -----

  private deriveCategoryFromAge(age?: number | null): string | null {
    if (age === undefined || age === null) return null;
    if (age < 12) return 'anak';
    if (age < 18) return 'remaja';
    return 'dewasa';
  }

  private async enrichBatch(
    clients: { id: number }[] & { id: number; name: string }[],
  ): Promise<ClientEnriched[]> {
    if (clients.length === 0) return [];
    const ids = clients.map((c) => c.id);
    const now = new Date();

    // Fetch ALL bookings (not deleted, not cancelled) untuk batch — lebih efisien dari per-client query
    const bookings = await this.prisma.clinicBooking.findMany({
      where: {
        clientId: { in: ids },
        deletedAt: null,
      },
      orderBy: { scheduledStart: 'desc' },
      include: {
        service: { select: { id: true, name: true } },
        psikolog: { select: { fullName: true, email: true } },
      },
    });

    const byClient = new Map<number, BookingSlim[]>();
    for (const b of bookings) {
      const slim: BookingSlim = {
        id: b.id,
        scheduledStart: b.scheduledStart,
        scheduledEnd: b.scheduledEnd,
        sessionN: b.sessionN,
        sessionTotal: b.sessionTotal,
        packageGroupId: b.packageGroupId,
        status: b.status,
        service: b.service,
        psikolog: b.psikolog
          ? { fullName: b.psikolog.fullName, email: b.psikolog.email }
          : null,
      };
      const arr = byClient.get(b.clientId) ?? [];
      arr.push(slim);
      byClient.set(b.clientId, arr);
    }

    return clients.map((c) => {
      const cb = (c as ClientEnriched & { gender: string });
      const all = byClient.get(c.id) ?? [];
      const upcoming = all
        .filter((b) => b.status !== 'cancelled' && b.status !== 'completed' && b.scheduledStart > now)
        .sort((a, b) => a.scheduledStart.getTime() - b.scheduledStart.getTime());
      const past = all
        .filter((b) => b.status === 'completed')
        .sort((a, b) => b.scheduledStart.getTime() - a.scheduledStart.getTime());

      const next = upcoming[0] ?? null;
      const last = past[0] ?? null;
      const totalBookings = all.filter((b) => b.status !== 'cancelled').length;

      // Derive current package: latest active package_group_id
      let currentService: ClientEnriched['currentService'] = null;
      const activeRef = next ?? last;
      if (activeRef) {
        currentService = {
          name: activeRef.service?.name ?? '—',
          psikologName: activeRef.psikolog?.fullName ?? activeRef.psikolog?.email ?? null,
          sessionN: activeRef.sessionN,
          sessionTotal: activeRef.sessionTotal,
        };
      }

      // Derive status
      let derivedStatus: ClientStatus = 'baru';
      if (past.length === 0 && upcoming.length === 0) {
        derivedStatus = 'baru';
      } else if (upcoming.length > 0) {
        derivedStatus = past.length === 0 ? 'baru' : 'aktif';
      } else if (past.length > 0) {
        const lastDate = past[0].scheduledStart;
        const ageDays = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
        derivedStatus = ageDays <= SELESAI_THRESHOLD_DAYS ? 'aktif' : 'selesai';
      }
      // First-timer dengan upcoming = "baru"; sudah ada past = "aktif"
      if (past.length === 0 && upcoming.length > 0) derivedStatus = 'baru';

      return {
        id: cb.id,
        name: cb.name,
        gender: cb.gender,
        age: cb.age ?? null,
        category: (cb.category ?? null) as string | null,
        phoneWa: cb.phoneWa,
        medicalRecordNumber: cb.medicalRecordNumber ?? null,
        preferredServiceType: cb.preferredServiceType ?? null,
        email: cb.email ?? null,
        address: cb.address ?? null,
        notes: cb.notes ?? null,
        waOptedOut: cb.waOptedOut,
        createdAt: cb.createdAt,
        updatedAt: cb.updatedAt,
        derivedStatus,
        totalBookings,
        lastSession: last
          ? {
              date: last.scheduledStart,
              serviceName: last.service?.name ?? null,
              psikologName: last.psikolog?.fullName ?? last.psikolog?.email ?? null,
            }
          : null,
        nextSession: next
          ? {
              date: next.scheduledStart,
              serviceName: next.service?.name ?? null,
              psikologName: next.psikolog?.fullName ?? next.psikolog?.email ?? null,
            }
          : null,
        currentService,
      };
    });
  }
}
