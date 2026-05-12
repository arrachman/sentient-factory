import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { QueryDashboardRangeDto } from './dto/query-dashboard-range.dto';

const SUPPORTED_DOMAINS = ['m1', 'm', 'm2', 'm2r', 'so'] as const;
export type SupportedDomain = (typeof SUPPORTED_DOMAINS)[number];

export const DOMAIN_FIELD_ALLOWLIST: Record<
  SupportedDomain,
  {
    groupBy: readonly string[];
    sortBy: readonly string[];
  }
> = {
  m1: {
    groupBy: [
      'sumber',
      'cabang',
      'lokasi',
      'gudang',
      'tipebarang',
      'tipehpp',
      'matauang',
      'divisi',
      'subdivisi',
    ],
    sortBy: ['id', 'tgl', 'inputtgl', 'postingtgl', 'saldojml', 'saldonilai', 'saldohpp'],
  },
  m: {
    groupBy: ['abstatus', 'abshift', 'abkaryawan', 'abtgl'],
    sortBy: ['adid', 'adtgl', 'adinputtgl', 'admodifikasitgl', 'adtotalpotongan', 'adkurs'],
  },
  m2r: {
    groupBy: ['apstatuslunas', 'apkontaknama', 'apsumber', 'apmatauang', 'aptgl'],
    sortBy: ['nmtahun', 'nmbulan', 'nmsaldo', 'nmdebit', 'nmkredit', 'nmanggaran'],
  },
  m2: {
    groupBy: ['tsumber', 'tcabang', 'tmatauang', 'tstatus', 'tstatuslunas'],
    sortBy: [
      'tid',
      'ttgl',
      'tinputtgl',
      'tpostingtgl',
      'tcabang',
      'tsumber',
      'tdebit',
      'tkredit',
      'tstatus',
      'tstatuslunas',
    ],
  },
  so: {
    groupBy: ['sostatus', 'sostatusrealisasi', 'socustomer', 'sobagianpenjualan'],
    sortBy: [
      'soid',
      'sotgl',
      'socustomer',
      'sobagianpenjualan',
      'sostatus',
      'sostatusrealisasi',
      'total_lines',
      'total_qty',
      'grand_total',
      'total_paid',
    ],
  },
};

export function assertDomain(domain: string): SupportedDomain {
  if ((SUPPORTED_DOMAINS as readonly string[]).includes(domain)) {
    return domain as SupportedDomain;
  }
  throw new BadRequestException(
    `Unsupported domain '${domain}'. Allowed domains: ${SUPPORTED_DOMAINS.join(', ')}`,
  );
}

export function normalizeRange(query: QueryDashboardRangeDto): { fromDate: string; toDate: string } {
  const now = new Date();
  const toDate = query.toDate ?? now.toISOString().slice(0, 10);

  const defaultFrom = new Date(now);
  defaultFrom.setDate(defaultFrom.getDate() - 30);
  const fromDate = query.fromDate ?? defaultFrom.toISOString().slice(0, 10);

  if (fromDate > toDate) {
    throw new BadRequestException('fromDate must be less than or equal to toDate');
  }

  return { fromDate, toDate };
}

export function resolveAllowedGroupBy(domain: SupportedDomain, input?: string): string {
  const allowed = DOMAIN_FIELD_ALLOWLIST[domain].groupBy;
  if (!input) {
    return allowed[0];
  }
  if (!allowed.includes(input)) {
    throw new BadRequestException(
      `groupBy '${input}' is not allowed for domain '${domain}'. Allowed: ${allowed.join(', ')}`,
    );
  }
  return input;
}

export function resolveAllowedSortBy(domain: SupportedDomain, input?: string): string {
  const allowed = DOMAIN_FIELD_ALLOWLIST[domain].sortBy;
  if (!input) {
    return allowed[0];
  }
  if (!allowed.includes(input)) {
    throw new BadRequestException(
      `sortBy '${input}' is not allowed for domain '${domain}'. Allowed: ${allowed.join(', ')}`,
    );
  }
  return input;
}

export function resolveM2SourceCode(domain: SupportedDomain, feature?: string): string | null {
  if (domain !== 'm2' || !feature) {
    return null;
  }

  const featureToSource: Record<string, string> = {
    m2_aj: 'AJ',
    m2_bd: 'BD',
    m2_cb: 'CB',
    m2_cr: 'CR',
    m2_cd: 'CD',
    m2_gj: 'GJ',
    m2_jm: 'JM',
    m2_rg: 'RG',
    m2_rgc: 'RGC',
    m2_rm: 'RM',
    m2_sg: 'SG',
    m2_sgc: 'SGC',
    m2_sm: 'SM',
    m2_template: 'TJ',
  };

  const normalized = feature.trim().toLowerCase();
  return featureToSource[normalized] ?? null;
}

export function wrapExecutionError(error: unknown, domain: string, endpoint: string): Error {
  if (error instanceof BadRequestException) {
    return error;
  }
  if (error instanceof InternalServerErrorException) {
    return error;
  }
  const reason = error instanceof Error ? error.message : 'unknown error';
  return new InternalServerErrorException(
    `Dashboard query failed (${domain}/${endpoint}): ${reason}`,
  );
}

export function filterExistingColumns(candidates: readonly string[], columns?: Set<string>): string[] {
  if (!columns || columns.size === 0) {
    return [...candidates];
  }
  return candidates.filter((candidate) => columns.has(candidate));
}
