import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  getHrProfileByAppUserId,
  resolveHrPrivilege,
  normalizeHrDates,
} from '../hr-attendance/hr-attendance-helpers';
import {
  CreateProjectDto,
  UpdateProjectDto,
  CreateProjectTimeDto,
  QueryProjectTimeDto,
} from './dto/workforce.dto';

type AuthUser = { id: number; roles?: string[] };

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  private async requirePrivileged(a: AuthUser) {
    if (!(await resolveHrPrivilege(this.prisma, a))) throw new ForbiddenException('Hanya admin/manager.');
  }

  async listProjects() {
    const rows = await this.prisma.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
      SELECT id, code, name, client_name AS "clientName",
             is_billable AS "isBillable", is_active AS "isActive"
      FROM public.hr_projects WHERE deleted_at IS NULL ORDER BY name`);
    return { success: true, data: normalizeHrDates(rows) };
  }

  async createProject(a: AuthUser, dto: CreateProjectDto) {
    await this.requirePrivileged(a);
    const rows = await this.prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
      INSERT INTO public.hr_projects (code, name, client_name, is_billable, is_active, created_by)
      VALUES (${dto.code}, ${dto.name}, ${dto.clientName ?? null},
              ${dto.isBillable ?? false}, ${dto.isActive ?? true}, ${a.id}) RETURNING id`);
    return { success: true, data: { id: rows[0]?.id } };
  }

  async updateProject(a: AuthUser, id: number, dto: UpdateProjectDto) {
    await this.requirePrivileged(a);
    const sets: Prisma.Sql[] = [];
    if (dto.code !== undefined) sets.push(Prisma.sql`code = ${dto.code}`);
    if (dto.name !== undefined) sets.push(Prisma.sql`name = ${dto.name}`);
    if (dto.clientName !== undefined) sets.push(Prisma.sql`client_name = ${dto.clientName}`);
    if (dto.isBillable !== undefined) sets.push(Prisma.sql`is_billable = ${dto.isBillable}`);
    if (dto.isActive !== undefined) sets.push(Prisma.sql`is_active = ${dto.isActive}`);
    if (sets.length === 0) return { success: true, data: { id } };
    sets.push(Prisma.sql`updated_at = now()`, Prisma.sql`updated_by = ${a.id}`);
    const res = await this.prisma.$executeRaw(Prisma.sql`
      UPDATE public.hr_projects SET ${Prisma.join(sets, ', ')} WHERE id = ${id} AND deleted_at IS NULL`);
    if (res === 0) throw new NotFoundException('Proyek tidak ditemukan.');
    return { success: true, data: { id } };
  }

  async deleteProject(a: AuthUser, id: number) {
    await this.requirePrivileged(a);
    const res = await this.prisma.$executeRaw(Prisma.sql`
      UPDATE public.hr_projects SET deleted_at = now(), deleted_by = ${a.id}
      WHERE id = ${id} AND deleted_at IS NULL`);
    if (res === 0) throw new NotFoundException('Proyek tidak ditemukan.');
    return { success: true };
  }

  async listTimeEntries(a: AuthUser, q: QueryProjectTimeDto) {
    const privileged = await resolveHrPrivilege(this.prisma, a);
    // Non-privileged users only ever see their own entries.
    let scopeHrUserId: number | null = null;
    if (!privileged) {
      const p = await getHrProfileByAppUserId(this.prisma, a.id);
      if (!p) return { success: true, data: [], meta: { total: 0, page: 1, limit: DEFAULT_LIMIT } };
      scopeHrUserId = Number(p.hrUserId);
    }
    const page = q.page && q.page > 0 ? q.page : 1;
    const limit = Math.min(q.limit && q.limit > 0 ? q.limit : DEFAULT_LIMIT, MAX_LIMIT);
    const offset = (page - 1) * limit;

    const scopeSql =
      scopeHrUserId !== null ? Prisma.sql`AND pte.user_id = ${scopeHrUserId}` : Prisma.empty;
    const projSql = q.projectId ? Prisma.sql`AND pte.project_id = ${q.projectId}` : Prisma.empty;
    const fromSql = q.dateFrom
      ? Prisma.sql`AND pte.work_date >= ${q.dateFrom}::date`
      : Prisma.empty;
    const toSql = q.dateTo ? Prisma.sql`AND pte.work_date <= ${q.dateTo}::date` : Prisma.empty;
    const whereSql = Prisma.sql`pte.deleted_at IS NULL ${scopeSql} ${projSql} ${fromSql} ${toSql}`;

    const countRows = await this.prisma.$queryRaw<Array<{ total: bigint }>>(Prisma.sql`
      SELECT count(*)::bigint AS total FROM public.hr_project_time_entries pte WHERE ${whereSql}`);
    const total = Number(countRows[0]?.total ?? 0);

    const rows = await this.prisma.$queryRaw<Array<Record<string, unknown>>>(Prisma.sql`
      SELECT pte.id, pte.user_id AS "userId", pte.project_id AS "projectId",
             pte.work_date AS "workDate", pte.minutes, pte.activity, pte.note,
             pr.code AS "projectCode", pr.name AS "projectName", pr.is_billable AS "isBillable",
             hu.employee_code AS "employeeCode", u.full_name AS "fullName", u.username
      FROM public.hr_project_time_entries pte
      JOIN public.hr_projects pr ON pr.id = pte.project_id
      JOIN public.hr_users hu ON hu.id = pte.user_id
      JOIN public.m0_users u ON u.id = hu.user_id
      WHERE ${whereSql}
      ORDER BY pte.work_date DESC, pte.id DESC LIMIT ${limit} OFFSET ${offset}`);
    return { success: true, data: normalizeHrDates(rows), meta: { total, page, limit } };
  }

  async createTimeEntry(a: AuthUser, dto: CreateProjectTimeDto) {
    const profile = await getHrProfileByAppUserId(this.prisma, a.id);
    if (!profile) throw new BadRequestException('Anda tidak terdaftar di HR.');
    const proj = await this.prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
      SELECT id FROM public.hr_projects WHERE id = ${dto.projectId} AND deleted_at IS NULL LIMIT 1`);
    if (!proj[0]) throw new BadRequestException('Proyek tidak ditemukan.');
    const rows = await this.prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
      INSERT INTO public.hr_project_time_entries
        (user_id, project_id, work_date, minutes, activity, note, created_by)
      VALUES (${Number(profile.hrUserId)}, ${dto.projectId}, ${dto.workDate}::date,
              ${dto.minutes}, ${dto.activity ?? null}, ${dto.note ?? null}, ${a.id}) RETURNING id`);
    return { success: true, data: { id: rows[0]?.id } };
  }

  async deleteTimeEntry(a: AuthUser, id: number) {
    const privileged = await resolveHrPrivilege(this.prisma, a);
    let scopeSql: Prisma.Sql = Prisma.empty;
    if (!privileged) {
      const p = await getHrProfileByAppUserId(this.prisma, a.id);
      if (!p) throw new NotFoundException('Entri tidak ditemukan.');
      scopeSql = Prisma.sql`AND user_id = ${Number(p.hrUserId)}`;
    }
    const res = await this.prisma.$executeRaw(Prisma.sql`
      UPDATE public.hr_project_time_entries SET deleted_at = now(), deleted_by = ${a.id}
      WHERE id = ${id} AND deleted_at IS NULL ${scopeSql}`);
    if (res === 0) throw new NotFoundException('Entri tidak ditemukan.');
    return { success: true };
  }
}
