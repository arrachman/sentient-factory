import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { SETTINGS_ID, WaDeviceStatus } from './wa-device.types';

@Injectable()
export class WaDeviceStatusService {
  private readonly logger = new Logger(WaDeviceStatusService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Active per-device token resolver. Priority:
   *   1. ClinicSettings.waActiveDeviceToken (DB, di-set via pairing flow)
   *   2. env FONNTE_API_TOKEN (legacy fallback)
   * Return null kalau dua-duanya tidak ada → FonnteProvider akan return failed.
   */
  async getActiveDeviceToken(): Promise<string | null> {
    const settings = await this.prisma.clinicSettings.findUnique({
      where: { id: SETTINGS_ID },
      select: { waActiveDeviceToken: true },
    });
    const dbToken = settings?.waActiveDeviceToken ?? null;
    if (dbToken && dbToken.trim() !== '') return dbToken;
    const envToken = this.config.get<string>('FONNTE_API_TOKEN');
    return envToken && envToken.trim() !== '' ? envToken : null;
  }

  async getWaDeviceStatus(): Promise<WaDeviceStatus> {
    const token = await this.getActiveDeviceToken();
    const apiUrl = this.config.get<string>('FONNTE_API_URL') ?? 'https://api.fonnte.com';

    if (!token) {
      return { connected: false, raw: { reason: 'No active device token configured' } };
    }

    try {
      // POST /device pakai device token — Fonnte tolak GET dengan "Method Not Allowed".
      const res = await fetch(`${apiUrl}/device`, {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
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
        name?: string;
        device?: string;
        device_status?: string;
        quota?: number | string;
        expired?: string;
      };

      if (!res.ok || json.status === false) {
        return { connected: false, raw: json };
      }

      // Fonnte /device dengan device-token kembalikan single object (flat),
      // bukan array. Handle dua-duanya defensive.
      const flat = !Array.isArray(json.data)
        ? {
            name: json.name,
            device: json.device,
            status: json.device_status,
            quota: json.quota,
            expired: json.expired,
          }
        : json.data[0];

      if (!flat?.device) {
        return { connected: false, raw: json };
      }

      const quotaNum =
        typeof flat.quota === 'string' ? Number.parseInt(flat.quota, 10) : flat.quota;

      return {
        connected: flat.status === 'connect',
        deviceName: flat.name,
        devicePhone: flat.device,
        quota: Number.isFinite(quotaNum as number) ? (quotaNum as number) : undefined,
        expired: flat.expired,
        raw: json,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.warn(`getWaDeviceStatus failed: ${message}`);
      return { connected: false, raw: { reason: message } };
    }
  }
}
