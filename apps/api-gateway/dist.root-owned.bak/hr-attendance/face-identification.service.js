"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaceIdentificationService = void 0;
const common_1 = require("@nestjs/common");
const path = __importStar(require("path"));
const promises_1 = require("fs/promises");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const hr_attendance_helpers_1 = require("./hr-attendance-helpers");
const hr_attendance_snapshot_1 = require("./hr-attendance-snapshot");
const attendance_settings_service_1 = require("./attendance-settings.service");
const DEFAULT_FACE_IDENTIFY_MIN_SIMILARITY = 0.82;
let FaceIdentificationService = class FaceIdentificationService {
    prisma;
    settingsService;
    constructor(prisma, settingsService) {
        this.prisma = prisma;
        this.settingsService = settingsService;
    }
    requireFaceEmbedding(faceEmbedding) {
        if (!Array.isArray(faceEmbedding) || faceEmbedding.length < 16) {
            throw new common_1.BadRequestException('Face embedding is required for face verification.');
        }
        const normalized = faceEmbedding
            .map((value) => Number(value))
            .filter((value) => Number.isFinite(value));
        if (normalized.length < 16) {
            throw new common_1.BadRequestException('Face embedding payload is invalid.');
        }
        return normalized;
    }
    compareFaceEmbedding(left, right) {
        const length = Math.min(left.length, right.length);
        if (length < 16) {
            throw new common_1.BadRequestException('Face embedding dimensions do not match.');
        }
        let dot = 0;
        let leftNorm = 0;
        let rightNorm = 0;
        for (let index = 0; index < length; index += 1) {
            const a = Number(left[index] ?? 0);
            const b = Number(right[index] ?? 0);
            dot += a * b;
            leftNorm += a * a;
            rightNorm += b * b;
        }
        if (leftNorm <= 0 || rightNorm <= 0) {
            return 0;
        }
        return dot / (Math.sqrt(leftNorm) * Math.sqrt(rightNorm));
    }
    async requireActiveFaceEnrollment(hrUserId) {
        const rows = await this.prisma.$queryRaw(client_1.Prisma.sql `
      SELECT embedding_json AS "embeddingJson"
      FROM public.hr_face_enrollments
      WHERE user_id = ${hrUserId}
        AND deleted_at IS NULL
        AND is_active = true
      ORDER BY id DESC
      LIMIT 1
    `);
        const row = rows[0];
        if (!row?.embeddingJson) {
            throw new common_1.BadRequestException('Active face enrollment reference is missing.');
        }
        return {
            embedding: this.requireFaceEmbedding(row.embeddingJson),
        };
    }
    async identifyFace(authUser, dto) {
        const profile = await (0, hr_attendance_helpers_1.requireHrProfileByAppUserId)(this.prisma, authUser.id);
        const inputEmbedding = this.requireFaceEmbedding(dto.faceEmbedding);
        const identifyThreshold = await this.settingsService.getNumberSetting('attendance', 'face_identify_confidence_threshold', DEFAULT_FACE_IDENTIFY_MIN_SIMILARITY);
        const rows = await this.prisma.$queryRaw(client_1.Prisma.sql `
      SELECT
        hu.id AS "hrUserId",
        hu.user_id AS "appUserId",
        hu.employee_code AS "employeeCode",
        u.username,
        u.full_name AS "fullName",
        hfe.embedding_json AS "embeddingJson"
      FROM public.hr_face_enrollments hfe
      JOIN public.hr_users hu ON hu.id = hfe.user_id
      JOIN public.m0_users u ON u.id = hu.user_id
      WHERE hfe.deleted_at IS NULL
        AND hfe.is_active = true
        AND hu.deleted_at IS NULL
        AND hu.is_active = true
        AND hfe.embedding_json IS NOT NULL
    `);
        const matches = rows
            .map((row) => {
            const similarity = this.compareFaceEmbedding(this.requireFaceEmbedding(row.embeddingJson), inputEmbedding);
            return {
                hrUserId: row.hrUserId,
                appUserId: row.appUserId,
                employeeCode: row.employeeCode,
                username: row.username,
                fullName: row.fullName,
                similarity,
            };
        })
            .sort((left, right) => right.similarity - left.similarity);
        const bestMatch = matches[0] ?? null;
        const matched = !!bestMatch && bestMatch.similarity >= identifyThreshold;
        return {
            success: true,
            data: {
                matched,
                threshold: identifyThreshold,
                currentUserHrId: profile.hrUserId,
                currentUserAppId: profile.appUserId,
                candidate: matched && bestMatch
                    ? {
                        hrUserId: bestMatch.hrUserId,
                        appUserId: bestMatch.appUserId,
                        employeeCode: bestMatch.employeeCode,
                        username: bestMatch.username,
                        fullName: bestMatch.fullName,
                        similarity: Number(bestMatch.similarity.toFixed(4)),
                        isCurrentUser: bestMatch.appUserId === profile.appUserId,
                    }
                    : null,
                topMatches: matches.slice(0, 3).map((match) => ({
                    hrUserId: match.hrUserId,
                    appUserId: match.appUserId,
                    employeeCode: match.employeeCode,
                    username: match.username,
                    fullName: match.fullName,
                    similarity: Number(match.similarity.toFixed(4)),
                    isCurrentUser: match.appUserId === profile.appUserId,
                })),
            },
        };
    }
    async getFaceEnrollmentSnapshot(authUser, enrollmentId) {
        const privileged = (0, hr_attendance_helpers_1.isPrivileged)(authUser.roles);
        const rows = await this.prisma.$queryRaw(client_1.Prisma.sql `
      SELECT hfe.snapshot_url, hu.user_id AS app_user_id
      FROM public.hr_face_enrollments hfe
      JOIN public.hr_users hu ON hu.id = hfe.user_id
      WHERE hfe.id = ${enrollmentId}
        AND hfe.deleted_at IS NULL
        AND (
          ${privileged}
          OR hu.user_id = ${authUser.id}
        )
      LIMIT 1
    `);
        const row = rows[0];
        if (!row?.snapshot_url) {
            throw new common_1.NotFoundException('Face enrollment snapshot not found.');
        }
        const baseDir = (0, hr_attendance_snapshot_1.getAttendanceStorageBaseDir)();
        const resolvedFile = (0, hr_attendance_snapshot_1.resolveAttendanceSnapshotPath)(row.snapshot_url, baseDir);
        const resolvedBase = path.resolve(baseDir);
        if (!resolvedFile.startsWith(resolvedBase + path.sep) && resolvedFile !== resolvedBase) {
            throw new common_1.BadRequestException('Face enrollment snapshot path is outside the allowed storage root.');
        }
        const buffer = await (0, promises_1.readFile)(resolvedFile).catch(() => null);
        if (!buffer) {
            throw new common_1.NotFoundException('Face enrollment snapshot file is missing.');
        }
        const extension = path.extname(resolvedFile).toLowerCase();
        const mimeType = extension === '.png' ? 'image/png' : 'image/jpeg';
        return {
            buffer,
            mimeType,
            fileName: path.basename(resolvedFile),
        };
    }
};
exports.FaceIdentificationService = FaceIdentificationService;
exports.FaceIdentificationService = FaceIdentificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        attendance_settings_service_1.AttendanceSettingsService])
], FaceIdentificationService);
//# sourceMappingURL=face-identification.service.js.map