import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePsikologDto } from './dto/update-psikolog.dto';
import { PsikologCrudService } from './psikolog-crud.service';
import { mapPsikologToResponse, userSelect, validateAvatarUrl } from './psikolog.utils';

@Injectable()
export class PsikologMutationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly crud: PsikologCrudService,
  ) {}

  /** Self-edit subset profile. Admin-only fields (email/license/etc) via update(). */
  async updateMe(
    userId: number,
    dto: {
      fullName?: string;
      title?: string;
      bio?: string;
      color?: string;
      phone: string;
      avatarUrl?: string | null;
    },
  ) {
    const profile = await this.prisma.clinicPsikologProfile.findFirst({
      where: { userId, deletedAt: null },
      include: { user: { select: { id: true } } },
    });
    if (!profile) {
      throw new NotFoundException(`Psikolog profile untuk user ${userId} tidak ditemukan`);
    }

    validateAvatarUrl(dto.avatarUrl ?? undefined);

    await this.prisma.$transaction(async (tx) => {
      // User.fullName + avatarUrl self-update OK
      const userUpdates: Prisma.UserUpdateInput = { updatedBy: userId };
      let hasUserUpdate = false;
      if (dto.fullName !== undefined) {
        userUpdates.fullName = dto.fullName;
        hasUserUpdate = true;
      }
      if (dto.avatarUrl !== undefined) {
        userUpdates.avatarUrl = dto.avatarUrl;
        hasUserUpdate = true;
      }
      userUpdates.phone = dto.phone.trim() || null;
      hasUserUpdate = true;
      if (hasUserUpdate) {
        await tx.user.update({ where: { id: userId }, data: userUpdates });
      }

      // Profile self-editable subset
      const profileUpdates: Prisma.ClinicPsikologProfileUpdateInput = {};
      if (dto.title !== undefined) profileUpdates.title = dto.title;
      if (dto.bio !== undefined) profileUpdates.bio = dto.bio;
      if (dto.color !== undefined) profileUpdates.color = dto.color;

      if (Object.keys(profileUpdates).length > 0) {
        profileUpdates.updatedBy = userId;
        await tx.clinicPsikologProfile.update({
          where: { id: profile.id },
          data: profileUpdates,
        });
      }
    });

    return this.crud.findByUserId(userId);
  }

  async update(id: number, dto: UpdatePsikologDto, actorId?: number) {
    const existing = await this.prisma.clinicPsikologProfile.findFirst({
      where: { id, deletedAt: null },
      include: { user: { select: { id: true } } },
    });
    if (!existing) {
      throw new NotFoundException(`Psikolog with id ${id} tidak ditemukan`);
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      // Update User fullName & isActive if provided
      const userUpdates: Prisma.UserUpdateInput = {};
      if (dto.fullName !== undefined) userUpdates.fullName = dto.fullName;
      if (dto.phone !== undefined) userUpdates.phone = dto.phone || null;
      if (dto.isActive !== undefined) userUpdates.isActive = dto.isActive;
      if (Object.keys(userUpdates).length > 0) {
        userUpdates.updatedBy = actorId;
        await tx.user.update({
          where: { id: existing.userId },
          data: userUpdates,
        });
      }

      // Update ClinicPsikologProfile fields
      const profileUpdates: Prisma.ClinicPsikologProfileUpdateInput = {};
      if (dto.title !== undefined) profileUpdates.title = dto.title;
      if (dto.specialty !== undefined) profileUpdates.specialty = dto.specialty;
      if (dto.color !== undefined) profileUpdates.color = dto.color;
      if (dto.license !== undefined) profileUpdates.license = dto.license;
      if (dto.defaultSlots !== undefined) profileUpdates.defaultSlots = dto.defaultSlots;
      if (dto.weeklyAvailability !== undefined)
        profileUpdates.weeklyAvailability = dto.weeklyAvailability as Prisma.InputJsonValue;
      if (dto.bio !== undefined) profileUpdates.bio = dto.bio;
      if (dto.isActive !== undefined) profileUpdates.isActive = dto.isActive;
      profileUpdates.updatedBy = actorId;

      const profile = await tx.clinicPsikologProfile.update({
        where: { id },
        data: profileUpdates,
        include: { user: userSelect() },
      });

      // undefined → skip, [] → hapus (default "handle semua"), filled → replace
      if (dto.serviceIds !== undefined) {
        await tx.clinicPsikologService.deleteMany({
          where: { psikologUserId: profile.userId },
        });
        if (dto.serviceIds.length > 0) {
          await tx.clinicPsikologService.createMany({
            data: dto.serviceIds.map((serviceId) => ({
              psikologUserId: profile.userId,
              serviceId,
              createdBy: actorId,
            })),
            skipDuplicates: true,
          });
        }
      }

      return profile;
    });

    const finalServiceIds = await this.crud.findServiceIds(updated.userId);
    return {
      success: true,
      data: mapPsikologToResponse(updated.user, updated, finalServiceIds),
      message: 'Psikolog updated',
    };
  }

  async remove(id: number, actorId?: number) {
    const existing = await this.prisma.clinicPsikologProfile.findFirst({
      where: { id, deletedAt: null },
      select: { id: true, userId: true },
    });
    if (!existing) {
      throw new NotFoundException(`Psikolog with id ${id} tidak ditemukan`);
    }

    const bookingCount = await this.prisma.clinicBooking.count({
      where: { psikologUserId: existing.userId, deletedAt: null },
    });
    if (bookingCount > 0) {
      throw new ConflictException(
        `Psikolog ini punya ${bookingCount} booking terkait. Tidak bisa dihapus — nonaktifkan saja lewat toggle "Aktif" di form edit.`,
      );
    }

    const now = new Date();
    await this.prisma.$transaction([
      this.prisma.clinicPsikologProfile.update({
        where: { id },
        data: {
          deletedAt: now,
          deletedBy: actorId,
          isActive: false,
          updatedBy: actorId,
        },
      }),
      this.prisma.user.update({
        where: { id: existing.userId },
        data: {
          deletedAt: now,
          deletedBy: actorId,
          isActive: false,
          updatedBy: actorId,
        },
      }),
    ]);

    return {
      success: true,
      message: 'Psikolog deleted (soft delete)',
    };
  }
}
