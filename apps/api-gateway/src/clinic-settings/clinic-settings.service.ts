import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/clinic-settings.dto';

const SETTINGS_ID = 1; // Single-row config table

@Injectable()
export class ClinicSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async get() {
    const settings = await this.prisma.clinicSettings.findUnique({
      where: { id: SETTINGS_ID },
    });
    if (!settings) {
      throw new NotFoundException(
        'Clinic settings not initialized. Run db:seed:clinic untuk seed default.',
      );
    }
    return { success: true, data: settings };
  }

  async update(dto: UpdateSettingsDto, actorId?: number) {
    const data: Prisma.ClinicSettingsUpdateInput = { updatedBy: actorId };
    if (dto.clinicName !== undefined) data.clinicName = dto.clinicName;
    if (dto.address !== undefined) data.address = dto.address;
    if (dto.timezone !== undefined) data.timezone = dto.timezone;
    if (dto.currency !== undefined) data.currency = dto.currency;
    if (dto.slotsOfDay !== undefined)
      data.slotsOfDay = dto.slotsOfDay as Prisma.InputJsonValue;
    if (dto.closedDayOfWeek !== undefined)
      data.closedDayOfWeek = dto.closedDayOfWeek as Prisma.InputJsonValue;
    if (dto.holidays !== undefined) data.holidays = dto.holidays as Prisma.InputJsonValue;
    if (dto.bufferMinutes !== undefined) data.bufferMinutes = dto.bufferMinutes;
    if (dto.taxEnabled !== undefined) data.taxEnabled = dto.taxEnabled;
    if (dto.taxPercentage !== undefined) data.taxPercentage = new Prisma.Decimal(dto.taxPercentage);
    if (dto.dpPercentage !== undefined) data.dpPercentage = new Prisma.Decimal(dto.dpPercentage);
    if (dto.waSendEnabled !== undefined) data.waSendEnabled = dto.waSendEnabled;
    if (dto.waCountryCode !== undefined) data.waCountryCode = dto.waCountryCode;

    const updated = await this.prisma.clinicSettings.upsert({
      where: { id: SETTINGS_ID },
      create: {
        id: SETTINGS_ID,
        clinicName: dto.clinicName ?? 'Althea Psychology',
        ...data,
      } as unknown as Prisma.ClinicSettingsCreateInput,
      update: data,
    });
    return { success: true, data: updated, message: 'Settings updated' };
  }
}
