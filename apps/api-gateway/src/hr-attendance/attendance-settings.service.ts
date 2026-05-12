import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { toAuditUserId } from '../common/utils/audit-user.util';
import { PrismaService } from '../prisma/prisma.service';
import { isPrivileged } from './hr-attendance-helpers';

type AuthUser = {
  id: number;
  roles?: string[];
};

@Injectable()
export class AttendanceSettingsService {
  constructor(private prisma: PrismaService) {}

  async getBooleanSetting(settingGroup: string, settingKey: string, fallback: boolean) {
    const rows = await this.prisma.$queryRaw<Array<{ settingValue: string | null }>>(Prisma.sql`
      SELECT setting_value AS "settingValue"
      FROM public.hr_settings
      WHERE deleted_at IS NULL
        AND setting_group = ${settingGroup}
        AND (setting_key = ${settingKey} OR setting_key = ${`${settingGroup}.${settingKey}`})
      ORDER BY id DESC
      LIMIT 1
    `);

    const raw = rows[0]?.settingValue?.trim().toLowerCase();
    if (!raw) {
      return fallback;
    }

    if (['1', 'true', 'yes', 'on'].includes(raw)) {
      return true;
    }

    if (['0', 'false', 'no', 'off'].includes(raw)) {
      return false;
    }

    return fallback;
  }

  async getNumberSetting(settingGroup: string, settingKey: string, fallback: number) {
    const rows = await this.prisma.$queryRaw<Array<{ settingValue: string | null }>>(Prisma.sql`
      SELECT setting_value AS "settingValue"
      FROM public.hr_settings
      WHERE deleted_at IS NULL
        AND setting_group = ${settingGroup}
        AND (setting_key = ${settingKey} OR setting_key = ${`${settingGroup}.${settingKey}`})
      ORDER BY id DESC
      LIMIT 1
    `);

    const raw = rows[0]?.settingValue?.trim();
    if (!raw) {
      return fallback;
    }

    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) {
      return fallback;
    }

    return parsed;
  }

  async getSettings(authUser: AuthUser) {
    if (!isPrivileged(authUser.roles)) {
      throw new BadRequestException('HR settings are only available to privileged roles.');
    }

    const autoSubmitEnabled = await this.getBooleanSetting('attendance', 'auto_submit_enabled', true);
    const autoSubmitConfidenceThreshold = await this.getNumberSetting(
      'attendance',
      'auto_submit_confidence_threshold',
      0.9,
    );
    const faceIdentifyConfidenceThreshold = await this.getNumberSetting(
      'attendance',
      'face_identify_confidence_threshold',
      0.82,
    );
    const faceVerifyConfidenceThreshold = await this.getNumberSetting(
      'attendance',
      'face_verify_confidence_threshold',
      0.82,
    );

    return {
      success: true,
      data: {
        autoSubmitEnabled,
        autoSubmitConfidenceThreshold,
        faceIdentifyConfidenceThreshold,
        faceVerifyConfidenceThreshold,
      },
    };
  }

  async updateSetting(authUser: AuthUser, settingKey: string, value: string) {
    if (!isPrivileged(authUser.roles)) {
      throw new BadRequestException('Updating HR settings is only available to privileged roles.');
    }

    const actorId = toAuditUserId(authUser.id);
    await this.prisma.$executeRaw(Prisma.sql`
      INSERT INTO public.hr_settings (
        setting_key,
        setting_value,
        setting_group,
        is_active,
        created_at,
        created_by,
        updated_at,
        updated_by
      )
      VALUES (
        ${settingKey},
        ${value},
        'attendance',
        true,
        now(),
        ${actorId},
        now(),
        ${actorId}
      )
      ON CONFLICT (setting_key)
      DO UPDATE SET
        setting_value = EXCLUDED.setting_value,
        is_active = true,
        updated_at = now(),
        updated_by = ${actorId},
        deleted_at = null,
        deleted_by = null
    `);

    return {
      success: true,
      data: {
        settingKey,
        value,
      },
    };
  }
}
