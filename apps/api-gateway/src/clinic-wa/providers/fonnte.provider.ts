import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClinicSettingsService } from '../../clinic-settings/clinic-settings.service';
import { normalizePhoneId } from '../../common/utils/phone.util';
import { DeliveryStatus, SendMessageParams, SendResult, WAProvider } from '../wa.interface';

/**
 * Fonnte WhatsApp Gateway provider.
 *
 * API: https://api.fonnte.com/send (POST)
 * Auth: header `Authorization: <TOKEN>`
 *
 * Token resolution (lihat ClinicSettingsService.getActiveDeviceToken):
 *   1. DB `clinic_settings.wa_active_device_token` (di-set via pairing flow)
 *   2. env FONNTE_API_TOKEN (fallback legacy)
 *
 * Phone format: E.164 atau dengan country code (+62...). Fonnte handle baik.
 *
 * See ADR 004 untuk strategi.
 */
@Injectable()
export class FonnteProvider implements WAProvider {
  readonly name = 'fonnte';
  private readonly logger = new Logger(FonnteProvider.name);
  private readonly apiUrl: string;
  private readonly deviceId?: string;

  constructor(
    config: ConfigService,
    private readonly settings: ClinicSettingsService,
  ) {
    this.apiUrl = config.get<string>('FONNTE_API_URL') || 'https://api.fonnte.com';
    this.deviceId = config.get<string>('FONNTE_DEVICE_ID');
  }

  async send(params: SendMessageParams): Promise<SendResult> {
    const token = await this.settings.getActiveDeviceToken();
    if (!token) {
      this.logger.warn(
        'No active Fonnte device token (DB & env empty). Pair device via /admin/notif-wa atau set FONNTE_API_TOKEN.',
      );
      return {
        messageId: `fonnte_unconfigured_${Date.now()}`,
        status: 'failed',
        errorReason: 'No active Fonnte device token configured',
      };
    }

    const body = params.body || `[template:${params.templateId}]`;
    // Normalize phone — Fonnte accept multiple formats tapi webhook callback
    // selalu pakai `62xxx`, jadi standardize di sini supaya log.recipientPhone
    // match webhook.sender saat handleWebhook lookup.
    const targetPhone = normalizePhoneId(params.toPhone) ?? params.toPhone;
    const formData = new URLSearchParams();
    formData.set('target', targetPhone);
    formData.set('message', body);
    if (this.deviceId) formData.set('device', this.deviceId);
    if (params.callbackUrl) formData.set('webhook', params.callbackUrl);

    try {
      const response = await fetch(`${this.apiUrl}/send`, {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const json = (await response.json()) as {
        status?: boolean;
        // Fonnte API kembalikan id sebagai number/string/array (per target).
        id?: number | string | Array<number | string>;
        reason?: string;
        detail?: string;
      };

      if (!response.ok || json.status === false) {
        return {
          messageId: `fonnte_fail_${Date.now()}`,
          status: 'failed',
          errorReason: json.reason || json.detail || `HTTP ${response.status}`,
          providerResponse: json,
        };
      }

      // Normalisasi ke string — schema Prisma `messageId String?` reject number.
      const rawId = Array.isArray(json.id) ? json.id[0] : json.id;
      const messageId =
        rawId !== undefined && rawId !== null
          ? String(rawId)
          : `fonnte_${Date.now()}`;
      return {
        messageId,
        status: 'sent',
        providerResponse: json,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Fonnte send failed: ${message}`);
      return {
        messageId: `fonnte_error_${Date.now()}`,
        status: 'failed',
        errorReason: message,
      };
    }
  }

  async getDeliveryStatus(_messageId: string): Promise<DeliveryStatus | null> {
    // Fonnte tidak provide simple polling endpoint untuk status — pakai webhook.
    // Caller sebaiknya rely pada webhook callback untuk update status di clinic_wa_log.
    return null;
  }
}
