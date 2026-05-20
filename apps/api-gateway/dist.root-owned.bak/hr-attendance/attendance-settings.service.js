"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceSettingsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const audit_user_util_1 = require("../common/utils/audit-user.util");
const prisma_service_1 = require("../prisma/prisma.service");
const hr_attendance_helpers_1 = require("./hr-attendance-helpers");
let AttendanceSettingsService = class AttendanceSettingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getBooleanSetting(settingGroup, settingKey, fallback) {
        const rows = await this.prisma.$queryRaw(client_1.Prisma.sql `
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
    async getNumberSetting(settingGroup, settingKey, fallback) {
        const rows = await this.prisma.$queryRaw(client_1.Prisma.sql `
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
    async getSettings(authUser) {
        if (!(0, hr_attendance_helpers_1.isPrivileged)(authUser.roles)) {
            throw new common_1.BadRequestException('HR settings are only available to privileged roles.');
        }
        const autoSubmitEnabled = await this.getBooleanSetting('attendance', 'auto_submit_enabled', true);
        const autoSubmitConfidenceThreshold = await this.getNumberSetting('attendance', 'auto_submit_confidence_threshold', 0.9);
        const faceIdentifyConfidenceThreshold = await this.getNumberSetting('attendance', 'face_identify_confidence_threshold', 0.82);
        const faceVerifyConfidenceThreshold = await this.getNumberSetting('attendance', 'face_verify_confidence_threshold', 0.82);
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
    async updateSetting(authUser, settingKey, value) {
        if (!(0, hr_attendance_helpers_1.isPrivileged)(authUser.roles)) {
            throw new common_1.BadRequestException('Updating HR settings is only available to privileged roles.');
        }
        const actorId = (0, audit_user_util_1.toAuditUserId)(authUser.id);
        await this.prisma.$executeRaw(client_1.Prisma.sql `
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
};
exports.AttendanceSettingsService = AttendanceSettingsService;
exports.AttendanceSettingsService = AttendanceSettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AttendanceSettingsService);
//# sourceMappingURL=attendance-settings.service.js.map