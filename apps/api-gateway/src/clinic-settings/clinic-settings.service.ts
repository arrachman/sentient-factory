/**
 * Facade service — delegates to focused sub-services.
 * Retained for backward compatibility with external consumers
 * (e.g. clinic-wa/providers/fonnte.provider.ts).
 *
 * New code should inject the specific service directly:
 *   - ClinicSettingsCoreService   → get() / update()
 *   - WaDeviceStatusService       → getActiveDeviceToken() / getWaDeviceStatus()
 *   - WaDevicePairingService      → device pairing CRUD
 */
import { Injectable } from '@nestjs/common';
import { UpdateSettingsDto } from './dto/clinic-settings.dto';
import {
  ActivateWaDeviceDto,
  CreateWaDeviceDto,
  WaDeviceQrDto,
} from './dto/wa-device.dto';
import { ClinicSettingsCoreService } from './clinic-settings-core.service';
import { WaDeviceStatusService } from './wa-device-status.service';
import { WaDevicePairingService } from './wa-device-pairing.service';
import { WaDeviceStatus, WaDeviceListResponse } from './wa-device.types';

export type { WaDeviceStatus, FonnteDevice, WaDeviceListResponse } from './wa-device.types';
export { SETTINGS_ID } from './wa-device.types';

@Injectable()
export class ClinicSettingsService {
  constructor(
    private readonly core: ClinicSettingsCoreService,
    private readonly waStatus: WaDeviceStatusService,
    private readonly waPairing: WaDevicePairingService,
  ) {}

  get() {
    return this.core.get();
  }

  update(dto: UpdateSettingsDto, actorId?: number) {
    return this.core.update(dto, actorId);
  }

  getActiveDeviceToken(): Promise<string | null> {
    return this.waStatus.getActiveDeviceToken();
  }

  getWaDeviceStatus(): Promise<WaDeviceStatus> {
    return this.waStatus.getWaDeviceStatus();
  }

  listDevices(): Promise<WaDeviceListResponse> {
    return this.waPairing.listDevices();
  }

  addDevice(dto: CreateWaDeviceDto) {
    return this.waPairing.addDevice(dto);
  }

  getDeviceQr(dto: WaDeviceQrDto) {
    return this.waPairing.getDeviceQr(dto);
  }

  checkDeviceConnected(dto: WaDeviceQrDto) {
    return this.waPairing.checkDeviceConnected(dto);
  }

  activateDevice(dto: ActivateWaDeviceDto, actorId?: number) {
    return this.waPairing.activateDevice(dto, actorId);
  }

  removeDevice(devicePhone: string, actorId?: number) {
    return this.waPairing.removeDevice(devicePhone, actorId);
  }
}
