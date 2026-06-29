import { Prisma } from '@prisma/client';

const DAY_MS = 86_400_000;
const SECONDS_PER_MINUTE = 60;
const DAYS_PER_WEEK = 7;

export const round4 = (n: number): number => Math.round(n * 1e4) / 1e4;

export const toNum = (d: Prisma.Decimal | number | null | undefined): number =>
  d == null ? 0 : typeof d === 'number' ? d : Number(d);

/**
 * Planned production time (seconds) for a window given a work calendar.
 * workingDays = totalDays × (workingDaysPerWeek / 7), an even spread that
 * needs no per-date holiday table (manual-entry MVP, decision #5).
 */
export function plannedSeconds(
  from: Date,
  to: Date,
  plannedMinutesPerDay: number,
  workingDaysPerWeek: number,
): number {
  const totalDays = Math.max((to.getTime() - from.getTime()) / DAY_MS, 0);
  const workingDays = totalDays * (workingDaysPerWeek / DAYS_PER_WEEK);
  return plannedMinutesPerDay * SECONDS_PER_MINUTE * workingDays;
}

export interface OeeComponents {
  planned: number;
  downtime: number;
  operating: number;
  idealCycleSeconds: number | null;
  goodCount: number;
  scrapCount: number;
  totalCount: number;
}

export interface OeeRatios {
  availability: number | null;
  performance: number | null;
  quality: number | null;
  oee: number | null;
}

/**
 * OEE = Availability × Performance × Quality.
 * - Availability = operating / planned
 * - Performance  = (idealCycle × totalCount) / operating, capped at 1
 * - Quality      = good / total
 * Any factor whose denominator/input is missing yields null (not 0), so the
 * UI can distinguish "no data" from "genuinely zero".
 */
export function computeRatios(c: OeeComponents): OeeRatios {
  const availability = c.planned > 0 ? round4(c.operating / c.planned) : null;

  let performance: number | null = null;
  if (c.idealCycleSeconds != null && c.operating > 0) {
    performance = round4(Math.min((c.idealCycleSeconds * c.totalCount) / c.operating, 1));
  }

  const quality = c.totalCount > 0 ? round4(c.goodCount / c.totalCount) : null;

  const oee =
    availability != null && performance != null && quality != null
      ? round4(availability * performance * quality)
      : null;

  return { availability, performance, quality, oee };
}
