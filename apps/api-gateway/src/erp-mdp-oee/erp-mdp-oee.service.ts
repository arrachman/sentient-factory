import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { QueryOeeDto } from './dto/query-oee.dto';
import { computeRatios, OeeComponents, plannedSeconds, round4, toNum } from './oee-math';

const DEFAULT_WINDOW_DAYS = 30;
const DAY_MS = 86_400_000;

interface CalendarRow {
  workCenterId: bigint | null;
  plannedMinutesPerDay: Prisma.Decimal;
  workingDaysPerWeek: number;
  effectiveFrom: Date | null;
  effectiveTo: Date | null;
}

interface OeeRow {
  plannedSeconds: number;
  operatingSeconds: number;
  goodCount: number;
  totalCount: number;
  ncrCount: number;
  idealCycleSeconds: number | null;
}

/**
 * OEE overlay — derived metric, NOT a module (no own tables). Computed
 * on-the-fly from eam_work_centers + mdp_work_calendars + mes_downtime_events
 * + mes_production_logs + qms_nonconformances. View-first per design decision
 * #5; materialize only if this proves slow.
 */
@Injectable()
export class ErpMdpOeeService {
  constructor(private readonly prisma: PrismaService) {}

  async compute(query: QueryOeeDto) {
    const to = query.to ? new Date(query.to) : new Date();
    const from = query.from
      ? new Date(query.from)
      : new Date(to.getTime() - DEFAULT_WINDOW_DAYS * DAY_MS);
    const scopeId = query.workCenterId ? BigInt(query.workCenterId) : null;

    const workCenters = await this.prisma.mdpWorkCenter.findMany({
      where: { deletedAt: null, isActive: true, ...(scopeId ? { id: scopeId } : {}) },
      select: { id: true, code: true, name: true, idealCycleSeconds: true },
      orderBy: { code: 'asc' },
    });

    const calendars = await this.prisma.mdpWorkCalendar.findMany({
      where: { deletedAt: null, isActive: true },
      select: {
        workCenterId: true,
        plannedMinutesPerDay: true,
        workingDaysPerWeek: true,
        effectiveFrom: true,
        effectiveTo: true,
      },
    });

    const downtimeByWc = await this.sumDowntime(from, to, scopeId);
    const outputByWc = await this.sumProduction(from, to, scopeId);
    const ncrByWc = await this.countNcr(from, to, scopeId);

    const rows = workCenters.map((wc) => {
      const cal = this.pickCalendar(calendars, wc.id, from, to);
      const planned = cal
        ? plannedSeconds(from, to, toNum(cal.plannedMinutesPerDay), cal.workingDaysPerWeek)
        : 0;
      const downtime = downtimeByWc.get(wc.id) ?? 0;
      const operating = Math.max(planned - downtime, 0);
      const prod = outputByWc.get(wc.id) ?? { good: 0, scrap: 0 };
      const idealCycleSeconds = wc.idealCycleSeconds == null ? null : toNum(wc.idealCycleSeconds);

      const components: OeeComponents = {
        planned,
        downtime,
        operating,
        idealCycleSeconds,
        goodCount: prod.good,
        scrapCount: prod.scrap,
        totalCount: prod.good + prod.scrap,
      };
      const ratios = computeRatios(components);

      return {
        workCenter: { id: wc.id, code: wc.code, name: wc.name },
        plannedSeconds: round4(planned),
        downtimeSeconds: round4(downtime),
        operatingSeconds: round4(operating),
        idealCycleSeconds,
        goodCount: round4(prod.good),
        scrapCount: round4(prod.scrap),
        totalCount: round4(components.totalCount),
        ncrCount: ncrByWc.get(wc.id) ?? 0,
        ...ratios,
        flags: {
          missingCalendar: !cal || planned <= 0,
          missingIdealCycle: idealCycleSeconds == null,
        },
      };
    });

    return {
      success: true,
      data: {
        window: { from: from.toISOString(), to: to.toISOString() },
        summary: this.summarize(rows),
        workCenters: rows,
      },
    };
  }

  private pickCalendar(
    calendars: CalendarRow[],
    wcId: bigint,
    from: Date,
    to: Date,
  ): CalendarRow | null {
    const overlaps = (c: CalendarRow) =>
      (c.effectiveFrom == null || c.effectiveFrom <= to) &&
      (c.effectiveTo == null || c.effectiveTo >= from);
    const specific = calendars.find((c) => c.workCenterId === wcId && overlaps(c));
    if (specific) return specific;
    return calendars.find((c) => c.workCenterId == null && overlaps(c)) ?? null;
  }

  private async sumDowntime(from: Date, to: Date, scopeId: bigint | null) {
    const events = await this.prisma.mdpDowntimeEvent.findMany({
      where: {
        deletedAt: null,
        durationSeconds: { not: null },
        startedAt: { gte: from, lte: to },
        ...(scopeId ? { workCenterId: scopeId } : {}),
      },
      select: { workCenterId: true, durationSeconds: true },
    });
    const map = new Map<bigint, number>();
    for (const e of events) {
      map.set(e.workCenterId, (map.get(e.workCenterId) ?? 0) + toNum(e.durationSeconds));
    }
    return map;
  }

  private async sumProduction(from: Date, to: Date, scopeId: bigint | null) {
    const logs = await this.prisma.mdpProductionLog.findMany({
      where: {
        deletedAt: null,
        startedAt: { gte: from, lte: to },
        ...(scopeId ? { productionOrder: { workCenterId: scopeId } } : {}),
      },
      select: {
        goodQty: true,
        scrapQty: true,
        productionOrder: { select: { workCenterId: true } },
      },
    });
    const map = new Map<bigint, { good: number; scrap: number }>();
    for (const l of logs) {
      const wcId = l.productionOrder?.workCenterId;
      if (wcId == null) continue;
      const cur = map.get(wcId) ?? { good: 0, scrap: 0 };
      cur.good += toNum(l.goodQty);
      cur.scrap += toNum(l.scrapQty);
      map.set(wcId, cur);
    }
    return map;
  }

  private async countNcr(from: Date, to: Date, scopeId: bigint | null) {
    const ncrs = await this.prisma.mdpQmsNonconformance.findMany({
      where: { deletedAt: null, detectedAt: { gte: from, lte: to } },
      select: { productionOrderId: true },
    });
    const orderIds = [
      ...new Set(ncrs.map((n) => n.productionOrderId).filter((x): x is bigint => x != null)),
    ];
    if (orderIds.length === 0) return new Map<bigint, number>();

    const orders = await this.prisma.mdpProductionOrder.findMany({
      where: { id: { in: orderIds } },
      select: { id: true, workCenterId: true },
    });
    const orderToWc = new Map(orders.map((o) => [o.id, o.workCenterId]));

    const map = new Map<bigint, number>();
    for (const n of ncrs) {
      if (n.productionOrderId == null) continue;
      const wcId = orderToWc.get(n.productionOrderId);
      if (wcId == null) continue;
      if (scopeId && wcId !== scopeId) continue;
      map.set(wcId, (map.get(wcId) ?? 0) + 1);
    }
    return map;
  }

  private summarize(rows: OeeRow[]) {
    const acc = rows.reduce(
      (a, r) => {
        a.planned += r.plannedSeconds;
        a.operating += r.operatingSeconds;
        a.good += r.goodCount;
        a.total += r.totalCount;
        a.ncr += r.ncrCount;
        if (r.idealCycleSeconds != null) a.idealTime += r.idealCycleSeconds * r.totalCount;
        return a;
      },
      { planned: 0, operating: 0, good: 0, total: 0, ncr: 0, idealTime: 0 },
    );

    const availability = acc.planned > 0 ? round4(acc.operating / acc.planned) : null;
    const performance =
      acc.operating > 0 ? round4(Math.min(acc.idealTime / acc.operating, 1)) : null;
    const quality = acc.total > 0 ? round4(acc.good / acc.total) : null;
    const oee =
      availability != null && performance != null && quality != null
        ? round4(availability * performance * quality)
        : null;

    return {
      workCenterCount: rows.length,
      plannedSeconds: round4(acc.planned),
      operatingSeconds: round4(acc.operating),
      goodCount: round4(acc.good),
      totalCount: round4(acc.total),
      ncrCount: acc.ncr,
      availability,
      performance,
      quality,
      oee,
    };
  }
}
