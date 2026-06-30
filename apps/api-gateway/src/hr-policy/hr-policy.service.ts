import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { isPrivileged } from '../hr-attendance/hr-attendance-helpers';
import { UpdateOvertimePolicyDto } from './dto/overtime-policy.dto';

type AuthUser = { id: number; roles?: string[] };

type FieldType = 'boolean' | 'number';
interface FieldDef {
  key: string; // fully-qualified setting_key (snake_case)
  type: FieldType;
  fallback: boolean | number;
}

// Single source of truth: maps the API field → its hr_settings key + type.
const OVERTIME_FIELDS: Record<string, FieldDef> = {
  overtimeEnabled: { key: 'overtime.enabled', type: 'boolean', fallback: true },
  dailyRegularHours: { key: 'overtime.daily_regular_hours', type: 'number', fallback: 8 },
  weeklyRegularHours: { key: 'overtime.weekly_regular_hours', type: 'number', fallback: 40 },
  overtimeMultiplier: { key: 'overtime.multiplier', type: 'number', fallback: 1.5 },
  breakMinutes: { key: 'overtime.break_minutes', type: 'number', fallback: 60 },
  breakPaid: { key: 'overtime.break_paid', type: 'boolean', fallback: false },
  countHolidayAsOvertime: {
    key: 'overtime.count_holiday_as_overtime',
    type: 'boolean',
    fallback: true,
  },
};

const SETTING_GROUP = 'overtime';
const TRUE_TOKENS = new Set(['1', 'true', 'yes', 'on']);
const FALSE_TOKENS = new Set(['0', 'false', 'no', 'off']);

@Injectable()
export class HrPolicyService {
  constructor(private prisma: PrismaService) {}

  private coerce(def: FieldDef, raw: string | undefined): boolean | number {
    const value = raw?.trim();
    if (!value) return def.fallback;
    if (def.type === 'boolean') {
      const lowered = value.toLowerCase();
      if (TRUE_TOKENS.has(lowered)) return true;
      if (FALSE_TOKENS.has(lowered)) return false;
      return def.fallback;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : def.fallback;
  }

  async getOvertimePolicy() {
    const keys = Object.values(OVERTIME_FIELDS).map((f) => f.key);
    const rows = await this.prisma.$queryRaw<
      Array<{ settingKey: string; settingValue: string | null }>
    >(
      Prisma.sql`
        SELECT setting_key AS "settingKey", setting_value AS "settingValue"
        FROM public.hr_settings
        WHERE deleted_at IS NULL
          AND setting_group = ${SETTING_GROUP}
          AND setting_key IN (${Prisma.join(keys)})
      `,
    );
    const byKey = new Map(rows.map((r) => [r.settingKey, r.settingValue ?? undefined]));
    const data: Record<string, boolean | number> = {};
    for (const [field, def] of Object.entries(OVERTIME_FIELDS)) {
      data[field] = this.coerce(def, byKey.get(def.key));
    }
    return { success: true, data };
  }

  async updateOvertimePolicy(authUser: AuthUser, dto: UpdateOvertimePolicyDto) {
    if (!isPrivileged(authUser.roles)) {
      throw new ForbiddenException('Hanya admin/manager yang dapat mengubah kebijakan lembur.');
    }
    const updates = Object.entries(OVERTIME_FIELDS).filter(
      ([field]) => (dto as Record<string, unknown>)[field] !== undefined,
    );
    for (const [field, def] of updates) {
      const value = String((dto as Record<string, unknown>)[field]);
      await this.prisma.$executeRaw(Prisma.sql`
        INSERT INTO public.hr_settings
          (setting_key, setting_value, setting_group, is_active, created_at, created_by, updated_at, updated_by)
        VALUES (${def.key}, ${value}, ${SETTING_GROUP}, true, now(), ${authUser.id}, now(), ${authUser.id})
        ON CONFLICT (setting_key) DO UPDATE SET
          setting_value = EXCLUDED.setting_value,
          setting_group = ${SETTING_GROUP},
          is_active = true,
          updated_at = now(),
          updated_by = ${authUser.id},
          deleted_at = null,
          deleted_by = null
      `);
    }
    return this.getOvertimePolicy();
  }
}
