import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  BookingSlim,
  ClientEnriched,
  ClientServiceRef,
  SELESAI_THRESHOLD_DAYS,
} from './clinic-client.helpers';
import type { ClientStatus } from './dto/clinic-client.dto';

@Injectable()
export class ClinicEnricher {
  constructor(private readonly prisma: PrismaService) {}

  async enrichBatch(
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

    // Batch fetch junction klien ↔ service (multi-select layanan)
    const serviceLinks = await this.prisma.clinicClientService.findMany({
      where: { clientId: { in: ids } },
      include: { service: { select: { id: true, name: true, category: true } } },
      orderBy: [{ clientId: 'asc' }, { serviceId: 'asc' }],
    });
    const servicesByClient = new Map<number, ClientServiceRef[]>();
    for (const link of serviceLinks) {
      const arr = servicesByClient.get(link.clientId) ?? [];
      arr.push({ id: link.service.id, name: link.service.name, category: link.service.category });
      servicesByClient.set(link.clientId, arr);
    }

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
        psikolog: b.psikolog ? { fullName: b.psikolog.fullName, email: b.psikolog.email } : null,
      };
      const arr = byClient.get(b.clientId) ?? [];
      arr.push(slim);
      byClient.set(b.clientId, arr);
    }

    return clients.map((c) => {
      const cb = c as ClientEnriched & { gender: string };
      const all = byClient.get(c.id) ?? [];
      const upcoming = all
        .filter(
          (b) => b.status !== 'cancelled' && b.status !== 'completed' && b.scheduledStart > now,
        )
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

      const services = servicesByClient.get(c.id) ?? [];
      return {
        id: cb.id,
        name: cb.name,
        gender: cb.gender,
        age: cb.age ?? null,
        category: (cb.category ?? null) as string | null,
        phoneWa: cb.phoneWa,
        medicalRecordNumber: cb.medicalRecordNumber ?? null,
        preferredServiceType: cb.preferredServiceType ?? null,
        services,
        serviceIds: services.map((s) => s.id),
        email: cb.email ?? null,
        address: cb.address ?? null,
        notes: cb.notes ?? null,
        waOptedOut: cb.waOptedOut,
        isActive: cb.isActive,
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
