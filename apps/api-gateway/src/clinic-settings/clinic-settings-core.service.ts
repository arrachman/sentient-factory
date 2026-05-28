import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/clinic-settings.dto';
import { SETTINGS_ID } from './wa-device.types';

@Injectable()
export class ClinicSettingsCoreService {
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

    // Core clinic fields
    if (dto.clinicName !== undefined) data.clinicName = dto.clinicName;
    if (dto.address !== undefined) data.address = dto.address;
    if (dto.timezone !== undefined) data.timezone = dto.timezone;
    if (dto.currency !== undefined) data.currency = dto.currency;
    if (dto.slotsOfDay !== undefined) data.slotsOfDay = dto.slotsOfDay as Prisma.InputJsonValue;
    if (dto.closedDayOfWeek !== undefined)
      data.closedDayOfWeek = dto.closedDayOfWeek as Prisma.InputJsonValue;
    if (dto.holidays !== undefined) data.holidays = dto.holidays as Prisma.InputJsonValue;
    if (dto.taxEnabled !== undefined) data.taxEnabled = dto.taxEnabled;
    if (dto.taxPercentage !== undefined) data.taxPercentage = new Prisma.Decimal(dto.taxPercentage);
    if (dto.dpPercentage !== undefined) data.dpPercentage = new Prisma.Decimal(dto.dpPercentage);

    // WA master
    if (dto.waSendEnabled !== undefined) data.waSendEnabled = dto.waSendEnabled;
    if (dto.waCountryCode !== undefined) data.waCountryCode = dto.waCountryCode;
    if (dto.waSenderNumber !== undefined) data.waSenderNumber = dto.waSenderNumber;

    // WA delivery & retry
    if (dto.waRetryCount !== undefined) data.waRetryCount = dto.waRetryCount;
    if (dto.waRetryDelayMinutes !== undefined) data.waRetryDelayMinutes = dto.waRetryDelayMinutes;
    if (dto.waSendWindowStart !== undefined) data.waSendWindowStart = dto.waSendWindowStart;
    if (dto.waSendWindowEnd !== undefined) data.waSendWindowEnd = dto.waSendWindowEnd;
    if (dto.notifFailedSendEmail !== undefined) data.notifFailedSendEmail = dto.notifFailedSendEmail;

    // Email
    if (dto.emailInvoiceAfterPayment !== undefined) data.emailInvoiceAfterPayment = dto.emailInvoiceAfterPayment;
    if (dto.emailWeeklyRecap !== undefined) data.emailWeeklyRecap = dto.emailWeeklyRecap;
    if (dto.emailMonthlyPsikolog !== undefined) data.emailMonthlyPsikolog = dto.emailMonthlyPsikolog;

    // Notifikasi — timing/delay setting. Recipient routing pindah ke
    // ClinicWaTemplate.recipients (lihat /clinic/wa/template).
    if (dto.notifH1SendTime !== undefined) data.notifH1SendTime = dto.notifH1SendTime;
    if (dto.notifFollowupDelayHours !== undefined) data.notifFollowupDelayHours = dto.notifFollowupDelayHours;
    if (dto.notifFeedbackSendTime !== undefined) data.notifFeedbackSendTime = dto.notifFeedbackSendTime;

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
