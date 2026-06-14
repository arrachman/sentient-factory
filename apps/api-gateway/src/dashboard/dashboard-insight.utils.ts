import { BadRequestException, InternalServerErrorException } from '@nestjs/common';

type SupportedDomain = 'm1' | 'm' | 'm2' | 'm2r' | 'so';

export function extractConfidenceAverage(response: unknown): number | null {
  if (!response || typeof response !== 'object') {
    return null;
  }
  const items = (response as { insightItems?: Array<{ confidence?: number }> }).insightItems;
  if (!Array.isArray(items) || items.length === 0) {
    const direct = (response as { confidence?: number }).confidence;
    return typeof direct === 'number' ? direct : null;
  }
  const nums = items
    .map((item) => (typeof item?.confidence === 'number' ? item.confidence : null))
    .filter((value): value is number => value !== null);
  if (nums.length === 0) {
    return null;
  }
  return nums.reduce((acc, value) => acc + value, 0) / nums.length;
}

export function normalizeRange(query: { fromDate?: string; toDate?: string }): {
  fromDate: string;
  toDate: string;
} {
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
