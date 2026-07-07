import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateHrUserPreferencesDto } from './dto/update-hr-user-preferences.dto';

/**
 * Per-user appearance preferences for Senti HR (Setting → Tampilan).
 * Backed by `hr_user_preferences` (1:1 port of ERP `adm_user_preferences`).
 * PK = platform user id (m0_users.id, the `sub` of the sf_token JWT).
 */
@Injectable()
export class HrUserPreferencesService {
  constructor(private prisma: PrismaService) {}

  private toUserId(userId: string | number | undefined): number {
    if (userId === undefined || userId === null || userId === '') {
      throw new BadRequestException('Authenticated user id missing');
    }
    const n = typeof userId === 'number' ? userId : Number(userId);
    if (!Number.isInteger(n)) {
      throw new BadRequestException('Invalid user id format');
    }
    return n;
  }

  async findForUser(userId: string | number | undefined) {
    const uid = this.toUserId(userId);
    const existing = await this.prisma.hrUserPreferences.findUnique({
      where: { userId: uid },
    });
    return { success: true, data: existing };
  }

  async upsertForUser(
    userId: string | number | undefined,
    dto: UpdateHrUserPreferencesDto,
  ) {
    const uid = this.toUserId(userId);
    const metadata =
      dto.metadata === undefined
        ? undefined
        : (dto.metadata as Prisma.InputJsonValue);

    const saved = await this.prisma.hrUserPreferences.upsert({
      where: { userId: uid },
      create: {
        userId: uid,
        theme: dto.theme,
        language: dto.language,
        metadata,
      },
      update: {
        ...(dto.theme !== undefined ? { theme: dto.theme } : {}),
        ...(dto.language !== undefined ? { language: dto.language } : {}),
        ...(metadata !== undefined ? { metadata } : {}),
      },
    });

    return { success: true, data: saved };
  }
}
