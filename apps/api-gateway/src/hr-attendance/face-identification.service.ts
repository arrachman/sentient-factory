import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as path from 'path';
import { readFile } from 'fs/promises';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { IdentifyFaceDto } from './dto/identify-face.dto';
import {
  requireHrProfileByAppUserId,
  resolveHrPrivilege,
} from './hr-attendance-helpers';
import {
  getAttendanceStorageBaseDir,
  resolveAttendanceSnapshotPath,
} from './hr-attendance-snapshot';
import { AttendanceSettingsService } from './attendance-settings.service';

type AuthUser = {
  id: number;
  roles?: string[];
};

const DEFAULT_FACE_IDENTIFY_MIN_SIMILARITY = 0.82;

@Injectable()
export class FaceIdentificationService {
  constructor(
    private prisma: PrismaService,
    private settingsService: AttendanceSettingsService,
  ) {}

  requireFaceEmbedding(faceEmbedding: unknown) {
    if (!Array.isArray(faceEmbedding) || faceEmbedding.length < 16) {
      throw new BadRequestException('Face embedding is required for face verification.');
    }

    const normalized = faceEmbedding
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value));

    if (normalized.length < 16) {
      throw new BadRequestException('Face embedding payload is invalid.');
    }

    return normalized;
  }

  compareFaceEmbedding(left: number[], right: number[]) {
    const length = Math.min(left.length, right.length);
    if (length < 16) {
      throw new BadRequestException('Face embedding dimensions do not match.');
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

  async requireActiveFaceEnrollment(hrUserId: number) {
    const rows = await this.prisma.$queryRaw<Array<{ embeddingJson: unknown }>>(Prisma.sql`
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
      throw new BadRequestException('Active face enrollment reference is missing.');
    }

    return {
      embedding: this.requireFaceEmbedding(row.embeddingJson),
    };
  }

  async identifyFace(authUser: AuthUser, dto: IdentifyFaceDto) {
    const profile = await requireHrProfileByAppUserId(this.prisma, authUser.id);
    const inputEmbedding = this.requireFaceEmbedding(dto.faceEmbedding);
    const identifyThreshold = await this.settingsService.getNumberSetting(
      'attendance',
      'face_identify_confidence_threshold',
      DEFAULT_FACE_IDENTIFY_MIN_SIMILARITY,
    );

    const rows = await this.prisma.$queryRaw<
      Array<{
        hrUserId: number;
        appUserId: number;
        employeeCode: string | null;
        username: string;
        fullName: string | null;
        embeddingJson: unknown;
      }>
    >(Prisma.sql`
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
        const similarity = this.compareFaceEmbedding(
          this.requireFaceEmbedding(row.embeddingJson),
          inputEmbedding,
        );
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
        candidate:
          matched && bestMatch
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

  async getFaceEnrollmentSnapshot(authUser: AuthUser, enrollmentId: number) {
    const privileged = await resolveHrPrivilege(this.prisma, authUser);
    const rows = await this.prisma.$queryRaw<
      Array<{ snapshot_url: string | null; app_user_id: number }>
    >(Prisma.sql`
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
      throw new NotFoundException('Face enrollment snapshot not found.');
    }

    const baseDir = getAttendanceStorageBaseDir();
    const resolvedFile = resolveAttendanceSnapshotPath(row.snapshot_url, baseDir);
    const resolvedBase = path.resolve(baseDir);

    if (!resolvedFile.startsWith(resolvedBase + path.sep) && resolvedFile !== resolvedBase) {
      throw new BadRequestException(
        'Face enrollment snapshot path is outside the allowed storage root.',
      );
    }

    const buffer = await readFile(resolvedFile).catch(() => null);
    if (!buffer) {
      throw new NotFoundException('Face enrollment snapshot file is missing.');
    }

    const extension = path.extname(resolvedFile).toLowerCase();
    const mimeType = extension === '.png' ? 'image/png' : 'image/jpeg';

    return {
      buffer,
      mimeType,
      fileName: path.basename(resolvedFile),
    };
  }
}
