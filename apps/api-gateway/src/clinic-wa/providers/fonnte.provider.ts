import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { normalizePhoneId } from '../../common/utils/phone.util';
import { DeliveryStatus, SendMessageParams, SendResult, WAProvider } from '../wa.interface';

/**
 * Fonnte WhatsApp Gateway provider.
 *
 * API: https://api.fonnte.com/send (POST)
 * Auth: header `Authorization: <TOKEN>`
 * Token didapat dari dashboard Fonnte (per-device).
 *
 * Phone format: E.164 atau dengan country code (+62...). Fonnte handle baik.
 *
 * See ADR 004 untuk strategi.
 */
@Injectable()
export class FonnteProvider implements WAProvider {
  readonly name = 'fonnte';
  private readonly logger = new Logger(FonnteProvider.name);
  private readonly token: string;
  private readonly apiUrl: string;
  private readonly deviceId?: string;

  constructor(config: ConfigService) {
    this.token = config.get<string>('FONNTE_API_TOKEN') || '';
    this.apiUrl = config.get<string>('FONNTE_API_URL') || 'https://api.fonnte.com';
    this.deviceId = config.get<string>('FONNTE_DEVICE_ID');
    if (!this.token) {
      this.logger.warn(
        'FONNTE_API_TOKEN not set — FonnteProvider akan fail saat send. Set token di .env atau pakai MockWAProvider.',
      );
    }
  }

  async send(params: SendMessageParams): Promise<SendResult> {
    if (!this.token) {
      return {
        messageId: `fonnte_unconfigured_${Date.now()}`,
        status: 'failed',
        errorReason: 'FONNTE_API_TOKEN not configured',
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
          Authorization: this.token,
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
