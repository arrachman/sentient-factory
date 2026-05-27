import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { ClinicSettingsController } from './clinic-settings.controller';
import { ClinicSettingsService } from './clinic-settings.service';
import { ClinicSettingsCoreService } from './clinic-settings-core.service';
import { WaDeviceStatusService } from './wa-device-status.service';
import { WaDevicePairingService } from './wa-device-pairing.service';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [ClinicSettingsController],
  providers: [
    ClinicSettingsCoreService,
    WaDeviceStatusService,
    WaDevicePairingService,
    ClinicSettingsService,
  ],
  exports: [
    ClinicSettingsCoreService,
    WaDeviceStatusService,
    WaDevicePairingService,
    ClinicSettingsService,
  ],
})
export class ClinicSettingsModule {}
