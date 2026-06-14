import { Injectable } from '@nestjs/common';
import { CreatePsikologDto } from './dto/create-psikolog.dto';
import { QueryPsikologDto } from './dto/query-psikolog.dto';
import { UpdatePsikologDto } from './dto/update-psikolog.dto';
import { PsikologDashboardService } from './psikolog-dashboard.service';
import { PsikologAvailabilityService } from './psikolog-availability.service';
import { PsikologCrudService } from './psikolog-crud.service';
import { PsikologMutationService } from './psikolog-mutation.service';

@Injectable()
export class ClinicPsikologService {
  constructor(
    private readonly crud: PsikologCrudService,
    private readonly mutation: PsikologMutationService,
    private readonly dashboard: PsikologDashboardService,
    private readonly availability: PsikologAvailabilityService,
  ) {}

  // -------------------- CRUD delegates --------------------

  create(dto: CreatePsikologDto, actorId?: number) {
    return this.crud.create(dto, actorId);
  }

  findAll(query: QueryPsikologDto) {
    return this.crud.findAll(query);
  }

  findOne(id: number) {
    return this.crud.findOne(id);
  }

  findByUserId(userId: number) {
    return this.crud.findByUserId(userId);
  }

  // -------------------- Mutation delegates --------------------

  update(id: number, dto: UpdatePsikologDto, actorId?: number) {
    return this.mutation.update(id, dto, actorId);
  }

  updateMe(
    userId: number,
    dto: {
      fullName?: string;
      title?: string;
      bio?: string;
      color?: string;
      phone: string;
      avatarUrl?: string | null;
    },
  ) {
    return this.mutation.updateMe(userId, dto);
  }

  remove(id: number, actorId?: number) {
    return this.mutation.remove(id, actorId);
  }

  // -------------------- Dashboard delegates --------------------

  getMyStats(userId: number) { return this.dashboard.getMyStats(userId); }
  getDashboardStats(userId: number) { return this.dashboard.getDashboardStats(userId); }

  // -------------------- Availability delegates --------------------

  listOwnDateOverrides(userId: number, from?: string, to?: string) {
    return this.availability.listOwnDateOverrides(userId, from, to);
  }
  listDateOverridesByUser(userId: number, from?: string, to?: string) {
    return this.availability.listDateOverridesByUser(userId, from, to);
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
}
