import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/clinic-settings.dto';

const SETTINGS_ID = 1; // Single-row config table

export type WaDeviceStatus = {
  connected: boolean;
  deviceName?: string;
  devicePhone?: string;
  quota?: number;
  expired?: string;
  raw?: unknown;
};

@Injectable()
export class ClinicSettingsService {
  private readonly logger = new Logger(ClinicSettingsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

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

    // Pengingat sesi otomatis
    if (dto.notifConfirmKlien !== undefined) data.notifConfirmKlien = dto.notifConfirmKlien;
    if (dto.notifConfirmPsikolog !== undefined) data.notifConfirmPsikolog = dto.notifConfirmPsikolog;
    if (dto.notifH1Klien !== undefined) data.notifH1Klien = dto.notifH1Klien;
    if (dto.notifH1SendTime !== undefined) data.notifH1SendTime = dto.notifH1SendTime;
    if (dto.notifM30Klien !== undefined) data.notifM30Klien = dto.notifM30Klien;
    if (dto.notifFollowupKlien !== undefined) data.notifFollowupKlien = dto.notifFollowupKlien;
    if (dto.notifFollowupDelayHours !== undefined) data.notifFollowupDelayHours = dto.notifFollowupDelayHours;
    if (dto.notifFeedbackKlien !== undefined) data.notifFeedbackKlien = dto.notifFeedbackKlien;
    if (dto.notifFeedbackSendTime !== undefined) data.notifFeedbackSendTime = dto.notifFeedbackSendTime;
    if (dto.notifSesiLanjutanKlien !== undefined) data.notifSesiLanjutanKlien = dto.notifSesiLanjutanKlien;
    if (dto.notifSesiLanjutanDays !== undefined) data.notifSesiLanjutanDays = dto.notifSesiLanjutanDays;
    if (dto.notifPaketHabisKlien !== undefined) data.notifPaketHabisKlien = dto.notifPaketHabisKlien;
    if (dto.notifMingguKosongPsikolog !== undefined) data.notifMingguKosongPsikolog = dto.notifMingguKosongPsikolog;
    if (dto.notifMingguKosongDaysBefore !== undefined) data.notifMingguKosongDaysBefore = dto.notifMingguKosongDaysBefore;
    if (dto.notifMingguKosongThreshold !== undefined) data.notifMingguKosongThreshold = dto.notifMingguKosongThreshold;

    // Perubahan jadwal
    if (dto.notifRescheduleKlien !== undefined) data.notifRescheduleKlien = dto.notifRescheduleKlien;
    if (dto.notifReschedulePsikolog !== undefined) data.notifReschedulePsikolog = dto.notifReschedulePsikolog;
    if (dto.notifCancelKlien !== undefined) data.notifCancelKlien = dto.notifCancelKlien;
    if (dto.notifCancelPsikolog !== undefined) data.notifCancelPsikolog = dto.notifCancelPsikolog;
    if (dto.notifUbahRuanganKlien !== undefined) data.notifUbahRuanganKlien = dto.notifUbahRuanganKlien;
    if (dto.notifUbahRuanganPsikolog !== undefined) data.notifUbahRuanganPsikolog = dto.notifUbahRuanganPsikolog;
    if (dto.notifUbahLayananKlien !== undefined) data.notifUbahLayananKlien = dto.notifUbahLayananKlien;
    if (dto.notifUbahLayananPsikolog !== undefined) data.notifUbahLayananPsikolog = dto.notifUbahLayananPsikolog;

    // Onboarding & pembayaran
    if (dto.notifWelcomeKlien !== undefined) data.notifWelcomeKlien = dto.notifWelcomeKlien;
    if (dto.notifWelcomePsikolog !== undefined) data.notifWelcomePsikolog = dto.notifWelcomePsikolog;
    if (dto.notifInviteStaff !== undefined) data.notifInviteStaff = dto.notifInviteStaff;
    if (dto.notifOtpUser !== undefined) data.notifOtpUser = dto.notifOtpUser;
    if (dto.notifDpKlien !== undefined) data.notifDpKlien = dto.notifDpKlien;
    if (dto.notifBuktiPembayaranKlien !== undefined) data.notifBuktiPembayaranKlien = dto.notifBuktiPembayaranKlien;
    if (dto.notifPelunasanKlien !== undefined) data.notifPelunasanKlien = dto.notifPelunasanKlien;

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

  async getWaDeviceStatus(): Promise<WaDeviceStatus> {
    const token = this.config.get<string>('FONNTE_API_TOKEN');
    const apiUrl = this.config.get<string>('FONNTE_API_URL') ?? 'https://api.fonnte.com';

    if (!token) {
      return { connected: false, raw: { reason: 'FONNTE_API_TOKEN not configured' } };
    }

    try {
      const res = await fetch(`${apiUrl}/device`, {
        method: 'GET',
        headers: { Authorization: token },
      });
      const json = (await res.json()) as {
        status?: boolean;
        data?: Array<{
          name?: string;
          device?: string;
          status?: string;
          quota?: number;
          expired?: string;
        }>;
        reason?: string;
      };

      if (!res.ok || json.status === false || !Array.isArray(json.data) || json.data.length === 0) {
        return { connected: false, raw: json };
      }

      const device = json.data[0];
      return {
        connected: device.status === 'connect',
        deviceName: device.name,
        devicePhone: device.device,
        quota: device.quota,
        expired: device.expired,
        raw: json,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.warn(`getWaDeviceStatus failed: ${message}`);
      return { connected: false, raw: { reason: message } };
    }
  }
}
