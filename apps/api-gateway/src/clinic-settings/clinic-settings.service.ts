import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/clinic-settings.dto';
import {
  ActivateWaDeviceDto,
  CreateWaDeviceDto,
  WaDeviceQrDto,
} from './dto/wa-device.dto';

const SETTINGS_ID = 1; // Single-row config table

export type WaDeviceStatus = {
  connected: boolean;
  deviceName?: string;
  devicePhone?: string;
  quota?: number;
  expired?: string;
  raw?: unknown;
};

export type FonnteDevice = {
  name?: string;
  device?: string;
  status?: string;
  token?: string;
  quota?: number | string;
  expired?: string;
  expiredDate?: string;
  package?: string;
  autoread?: string;
  isActive: boolean;
};

export type WaDeviceListResponse = {
  devices: FonnteDevice[];
  activeDeviceToken: string | null;
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

  // ── WA device pairing (account-token endpoints) ─────────────────────────

  private requireAccountToken(): string {
    const token = this.config.get<string>('FONNTE_ACCOUNT_TOKEN');
    if (!token || token.trim() === '') {
      throw new ServiceUnavailableException(
        'FONNTE_ACCOUNT_TOKEN belum di-set. Minta account token ke owner akun Fonnte (Profile → API Key Account), lalu set di .env / Vault.',
      );
    }
    return token;
  }

  private apiUrl(): string {
    return this.config.get<string>('FONNTE_API_URL') ?? 'https://api.fonnte.com';
  }

  private async fonntePost(
    path: string,
    authToken: string,
    body: Record<string, string>,
  ): Promise<{ ok: boolean; status: number; json: Record<string, unknown> }> {
    const form = new URLSearchParams();
    for (const [k, v] of Object.entries(body)) form.set(k, v);
    const res = await fetch(`${this.apiUrl()}${path}`, {
      method: 'POST',
      headers: {
        Authorization: authToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form.toString(),
    });
    let json: Record<string, unknown> = {};
    try {
      json = (await res.json()) as Record<string, unknown>;
    } catch {
      // ignore parse error, leave json empty
    }
    return { ok: res.ok && json.status !== false, status: res.status, json };
  }

  /**
   * GET /clinic/settings/wa-devices — list semua device di akun Fonnte
   * (pakai account token), tandai mana yang sedang aktif di app.
   */
  async listDevices(): Promise<WaDeviceListResponse> {
    const accountToken = this.requireAccountToken();
    const { ok, json } = await this.fonntePost('/get-devices', accountToken, {});

    const rawList = Array.isArray((json as { data?: unknown }).data)
      ? ((json as { data: Array<Record<string, unknown>> }).data)
      : [];

    const active = await this.getActiveDeviceToken();

    const devices: FonnteDevice[] = rawList.map((d) => {
      const token = typeof d.token === 'string' ? d.token : undefined;
      const quotaRaw = d.quota;
      const quota =
        typeof quotaRaw === 'number'
          ? quotaRaw
          : typeof quotaRaw === 'string'
            ? Number.parseInt(quotaRaw, 10)
            : undefined;
      return {
        name: typeof d.name === 'string' ? d.name : undefined,
        device: typeof d.device === 'string' ? d.device : undefined,
        status: typeof d.status === 'string' ? d.status : undefined,
        token,
        quota: Number.isFinite(quota as number) ? (quota as number) : undefined,
        expired: typeof d.expired === 'string' ? d.expired : undefined,
        expiredDate: typeof d['expired-date'] === 'string' ? (d['expired-date'] as string) : undefined,
        package: typeof d.package === 'string' ? d.package : undefined,
        autoread: typeof d.autoread === 'string' ? d.autoread : undefined,
        isActive: !!active && token === active,
      };
    });

    if (!ok && devices.length === 0) {
      throw new BadRequestException(
        `Fonnte /get-devices gagal: ${typeof json.reason === 'string' ? json.reason : 'unknown'}`,
      );
    }
    return { devices, activeDeviceToken: active, raw: json };
  }

  /**
   * POST /clinic/settings/wa-devices — bikin device baru di akun Fonnte.
   * Return device token baru (per-device) untuk dipakai di /qr & /activate.
   */
  async addDevice(dto: CreateWaDeviceDto): Promise<{
    deviceToken: string;
    devicePhone: string;
    raw: unknown;
  }> {
    const accountToken = this.requireAccountToken();
    // Fonnte /add-device autoread field accepted values: 'true'/'false'/'on'/empty.
    // Value 'off' di-reject dengan reason "invalid/empty body value" → map ke 'false'.
    const autoreadBody =
      dto.autoread === 'on' ? 'true' : 'false';
    const { ok, json } = await this.fonntePost('/add-device', accountToken, {
      name: dto.name,
      device: dto.phone,
      autoread: autoreadBody,
    });

    const token = typeof json.token === 'string' ? json.token : undefined;
    if (ok && token) {
      const devicePhone =
        typeof json.device === 'string' ? json.device : dto.phone;
      return { deviceToken: token, devicePhone, raw: json };
    }

    // Fallback: kalau Fonnte balas "device already exist" → device sudah pernah
    // dibuat di akun Fonnte sebelumnya. Lookup token existing supaya admin bisa
    // langsung re-pair tanpa harus hapus device manual di dashboard Fonnte dulu.
    const reason = typeof json.reason === 'string' ? json.reason : '';
    if (/already exist/i.test(reason)) {
      const list = await this.fonntePost('/get-devices', accountToken, {});
      const rawList = Array.isArray((list.json as { data?: unknown }).data)
        ? ((list.json as { data: Array<Record<string, unknown>> }).data)
        : [];
      const existing = rawList.find(
        (d) =>
          d.device === dto.phone ||
          d.device === `+${dto.phone}` ||
          d.device === dto.phone.replace(/^\+/, ''),
      );
      const existingToken =
        existing && typeof existing.token === 'string' ? existing.token : undefined;
      const existingPhone =
        existing && typeof existing.device === 'string' ? existing.device : dto.phone;
      if (existingToken) {
        this.logger.log(
          `Device ${dto.phone} sudah ada di akun Fonnte → re-use token existing untuk re-pair.`,
        );
        return {
          deviceToken: existingToken,
          devicePhone: existingPhone,
          raw: { ...json, reused: true },
        };
      }
    }

    throw new BadRequestException(
      `Fonnte /add-device gagal: ${reason || 'tidak menerima token device baru'}`,
    );
  }

  /**
   * POST /clinic/settings/wa-devices/qr — ambil QR pairing dari Fonnte.
   *
   * Authoritative status check via GET /device (BUKAN regex match terhadap
   * reason). Sebelumnya regex `/already connected/i` salah match
   * `"free device already connected"` — itu artinya **device LAIN di akun
   * Fonnte Free sedang connect & memblokir generate QR untuk device ini**,
   * BUKAN bahwa device ini sudah connect.
   *
   * Sekarang:
   *  1. Cek GET /device dengan device token → kalau `device_status === 'connect'`
   *     → `alreadyConnected: true`, tidak perlu QR.
   *  2. Kalau belum connect → call POST /qr → return url.
   *  3. Kalau Fonnte balas `"free device already connected"` di /qr →
   *     return error jelas (admin harus disconnect device lain dulu).
   */
  async getDeviceQr(dto: WaDeviceQrDto): Promise<{
    qrUrl?: string;
    alreadyConnected: boolean;
    raw: unknown;
  }> {
    // Step 1: cek status aktual device via POST /device (Fonnte tolak GET).
    try {
      const status = await this.fonntePost('/device', dto.deviceToken, {});
      if (
        status.json.status === true &&
        status.json.device_status === 'connect'
      ) {
        return { alreadyConnected: true, raw: status.json };
      }
    } catch {
      // network error → lanjut coba /qr saja
    }

    // Step 2: device belum connect → minta QR baru.
    const { ok, json } = await this.fonntePost('/qr', dto.deviceToken, {});
    const reason = typeof json.reason === 'string' ? json.reason : '';
    const rawUrl = typeof json.url === 'string' ? json.url : undefined;

    if (!ok && !rawUrl) {
      throw new BadRequestException(
        `Fonnte /qr gagal: ${reason || 'tidak menerima QR payload'}. ` +
          (/free device already connected/i.test(reason)
            ? 'Akun Fonnte Free hanya boleh 1 device connect bersamaan. Disconnect device lama dulu (admin Fonnte dashboard) sebelum pair device baru.'
            : ''),
      );
    }
    // Fonnte balas QR sebagai **raw base64 PNG** (tanpa scheme `data:image/png;base64,`).
    // Tambahkan prefix supaya frontend bisa langsung pakai sebagai `<img src>`.
    const qrUrl = rawUrl
      ? rawUrl.startsWith('data:')
        ? rawUrl
        : `data:image/png;base64,${rawUrl}`
      : undefined;
    return { qrUrl, alreadyConnected: false, raw: json };
  }

  /**
   * POST /clinic/settings/wa-devices/check — cek apakah device sudah `connect`.
   *
   * Endpoint terpisah dari /qr supaya frontend bisa polling tiap beberapa detik
   * tanpa kena rate limit Fonnte /qr (yang restricted di paket Free). Backend
   * hanya hit POST /device (status saja, tanpa generate QR baru).
   */
  async checkDeviceConnected(dto: WaDeviceQrDto): Promise<{
    connected: boolean;
    devicePhone?: string;
    deviceName?: string;
    raw: unknown;
  }> {
    try {
      const { json } = await this.fonntePost('/device', dto.deviceToken, {});
      const j = json as {
        status?: boolean;
        device_status?: string;
        device?: string;
        name?: string;
      };
      return {
        connected: j.status === true && j.device_status === 'connect',
        devicePhone: j.device,
        deviceName: j.name,
        raw: j,
      };
    } catch (err) {
      return {
        connected: false,
        raw: { reason: err instanceof Error ? err.message : String(err) },
      };
    }
  }

  /**
   * POST /clinic/settings/wa-devices/activate — set device sebagai active sender
   * (simpan token + nomor ke ClinicSettings). Bila removePrevious=true, disconnect+delete
   * device lama dari akun Fonnte supaya kuota slot device tidak overflow.
   */
  async activateDevice(
    dto: ActivateWaDeviceDto,
    actorId?: number,
  ): Promise<{ success: true; data: { waActiveDeviceToken: string; waSenderNumber?: string } }> {
    // Pre-flight: verify device benar-benar connect via POST /device.
    // Tanpa check ini, admin bisa activate device disconnect (salah skip step scan QR).
    try {
      const status = await this.fonntePost('/device', dto.deviceToken, {});
      const json = status.json as {
        status?: boolean;
        device_status?: string;
      };
      if (json.status !== true || json.device_status !== 'connect') {
        throw new BadRequestException(
          `Device belum terhubung (Fonnte status: ${json.device_status ?? 'unknown'}). ` +
            'Scan QR via WhatsApp Linked Devices dulu, lalu coba aktifkan ulang.',
        );
      }
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      throw new BadRequestException(
        `Gagal verifikasi status device: ${err instanceof Error ? err.message : String(err)}`,
      );
    }

    // Optional: bersihkan device lama dari Fonnte.
    // Fonnte auth model:
    //   /disconnect    → butuh DEVICE token (per-device), TANPA body
    //   /delete-device → butuh ACCOUNT token + body { device: <phone> }
    const removePrev = dto.removePrevious ?? true;
    if (removePrev) {
      const accountToken = this.config.get<string>('FONNTE_ACCOUNT_TOKEN');
      const prevToken = await this.getActiveDeviceToken();
      if (
        accountToken &&
        prevToken &&
        prevToken.trim() !== '' &&
        prevToken !== dto.deviceToken
      ) {
        try {
          // Lookup phone lama via /get-devices supaya bisa /delete-device.
          const list = await this.fonntePost('/get-devices', accountToken, {});
          const rawList = Array.isArray((list.json as { data?: unknown }).data)
            ? ((list.json as { data: Array<Record<string, unknown>> }).data)
            : [];
          const prevDevice = rawList.find((d) => d.token === prevToken);
          const prevPhone =
            prevDevice && typeof prevDevice.device === 'string'
              ? prevDevice.device
              : undefined;
          // disconnect dulu via DEVICE token (boleh fail kalau token tidak valid lagi)
          await this.fonntePost('/disconnect', prevToken, {}).catch(() => undefined);
          if (prevPhone) {
            await this.fonntePost('/delete-device', accountToken, { device: prevPhone });
            this.logger.log(`Previous Fonnte device ${prevPhone} disconnected + deleted`);
          }
        } catch (err) {
          // Tidak block aktivasi kalau cleanup gagal — admin bisa hapus manual via UI.
          this.logger.warn(
            `Cleanup previous Fonnte device failed: ${err instanceof Error ? err.message : String(err)}`,
          );
        }
      }
    }

    const data: Prisma.ClinicSettingsUpdateInput = {
      waActiveDeviceToken: dto.deviceToken,
      updatedBy: actorId,
    };
    if (dto.devicePhone !== undefined) data.waSenderNumber = dto.devicePhone;

    const updated = await this.prisma.clinicSettings.upsert({
      where: { id: SETTINGS_ID },
      create: {
        id: SETTINGS_ID,
        clinicName: 'Althea Psychology',
        waActiveDeviceToken: dto.deviceToken,
        waSenderNumber: dto.devicePhone ?? '',
      } as unknown as Prisma.ClinicSettingsCreateInput,
      update: data,
    });

    return {
      success: true,
      data: {
        waActiveDeviceToken: updated.waActiveDeviceToken ?? dto.deviceToken,
        waSenderNumber: updated.waSenderNumber,
      },
    };
  }

  /**
   * DELETE /clinic/settings/wa-devices — disconnect + delete device dari akun Fonnte.
   * Bila device yang dihapus = active device, kosongkan waActiveDeviceToken.
   */
  async removeDevice(devicePhone: string, actorId?: number): Promise<{ success: true }> {
    const accountToken = this.requireAccountToken();
    // Lookup device token by phone supaya bisa /disconnect (yang butuh device token).
    const list = await this.fonntePost('/get-devices', accountToken, {});
    const rawList = Array.isArray((list.json as { data?: unknown }).data)
      ? ((list.json as { data: Array<Record<string, unknown>> }).data)
      : [];
    const target = rawList.find(
      (d) => d.device === devicePhone || d.device === `+${devicePhone}`,
    );
    const targetToken =
      target && typeof target.token === 'string' ? target.token : undefined;

    if (targetToken) {
      await this.fonntePost('/disconnect', targetToken, {}).catch(() => undefined);
    }
    const del = await this.fonntePost('/delete-device', accountToken, { device: devicePhone });
    if (!del.ok) {
      throw new BadRequestException(
        `Fonnte /delete-device gagal: ${typeof del.json.reason === 'string' ? del.json.reason : 'unknown'}`,
      );
    }

    // Bila device aktif yang dihapus → reset waActiveDeviceToken.
    const settings = await this.prisma.clinicSettings.findUnique({
      where: { id: SETTINGS_ID },
      select: { waActiveDeviceToken: true, waSenderNumber: true },
    });
    if (settings?.waSenderNumber === devicePhone || settings?.waSenderNumber === `+${devicePhone}`) {
      await this.prisma.clinicSettings.update({
        where: { id: SETTINGS_ID },
        data: {
          waActiveDeviceToken: null,
          waSenderNumber: '',
          updatedBy: actorId,
        },
      });
    }
    return { success: true };
  }
}
