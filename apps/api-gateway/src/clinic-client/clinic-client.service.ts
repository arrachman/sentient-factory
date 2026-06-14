import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ClinicWaService } from '../clinic-wa/clinic-wa.service';
import {
  CreateClientDto,
  QueryClientDto,
  UpdateClientDto,
} from './dto/clinic-client.dto';
import { deriveCategoryFromAge } from './clinic-client.helpers';
import { ClientValidator } from './clinic-client.validator';
import { ClinicEnricher } from './clinic-client.enricher';

@Injectable()
export class ClinicClientService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly wa: ClinicWaService,
    private readonly validator: ClientValidator,
    private readonly enricher: ClinicEnricher,
  ) {}

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
    const serviceIds = await this.validator.validateServiceIds(dto.serviceIds);
    const primaryName = await this.validator.resolvePrimaryServiceName(serviceIds);
    const category = dto.category ?? deriveCategoryFromAge(dto.age);

    const { serviceIds: _omit, preferredServiceType: _omit2, ...rest } = dto;
    const created = await this.prisma.clinicClient.create({
      data: {
        ...rest,
        category,
        preferredServiceType: primaryName,
        waOptedOut: dto.waOptedOut ?? false,
        isActive: dto.isActive ?? true,
        createdBy: actorId,
        updatedBy: actorId,
        services: {
          create: serviceIds.map((sid) => ({ serviceId: sid, createdBy: actorId })),
        },
      },
    });

    if (created.phoneWa && !created.waOptedOut) {
      void this.wa
        .dispatch({
          templateName: 'Welcome New Client',
          recipientType: 'klien',
          recipientPhone: created.phoneWa,
          variables: { nama_klien: created.name },
        })
        .catch((err) => console.error('[ClientService] welcome WA failed:', err));
    }

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
    if (typeof query.isActive === 'boolean') where.isActive = query.isActive;
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
    const enrichedAll = await this.enricher.enrichBatch(items);
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
    const [enriched] = await this.enricher.enrichBatch([client]);
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
    const { serviceIds, preferredServiceType: _ignored, ...rest } = dto;
    const data: Prisma.ClinicClientUpdateInput = { ...rest, updatedBy: actorId };
    if (dto.age !== undefined && dto.category === undefined) {
      // re-derive category kalau age berubah dan category gak di-set explicit
      data.category = deriveCategoryFromAge(dto.age);
    }
    if (serviceIds !== undefined) {
      const validIds = await this.validator.validateServiceIds(serviceIds);
      data.preferredServiceType = await this.validator.resolvePrimaryServiceName(validIds);
      // Replace strategy: hapus semua entry junction lama, insert ulang.
      // Simpler & safer dari computed diff; jumlah service per klien kecil (≤ ~18).
      data.services = {
        deleteMany: {},
        create: validIds.map((sid) => ({ serviceId: sid, createdBy: actorId })),
      };
    }
    const updated = await this.prisma.clinicClient.update({ where: { id }, data });
    return { success: true, data: updated, message: 'Client updated' };
  }

  async remove(id: number, actorId?: number) {
    await this.findOne(id);
    const bookingCount = await this.prisma.clinicBooking.count({
      where: { clientId: id, deletedAt: null },
    });
    if (bookingCount > 0) {
      throw new ConflictException(
        `Klien ini punya ${bookingCount} booking terkait. Tidak bisa dihapus — nonaktifkan saja lewat toggle "Aktif" di form edit.`,
      );
    }
    await this.prisma.clinicClient.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy: actorId, updatedBy: actorId },
    });
    return { success: true, message: 'Client deleted' };
  }
}
