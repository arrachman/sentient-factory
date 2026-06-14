import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthRequest } from '../auth/types/auth-request';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ClinicSettingsService } from './clinic-settings.service';
import { UpdateSettingsDto } from './dto/clinic-settings.dto';
import {
  ActivateWaDeviceDto,
  CreateWaDeviceDto,
  WaDeviceQrDto,
} from './dto/wa-device.dto';

@ApiTags('Clinic — Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clinic/settings')
export class ClinicSettingsController {
  constructor(private readonly service: ClinicSettingsService) {}

  @Get()
  @Roles(
    'clinic-admin',
    'clinic-owner',
    'clinic-psikolog',
    'clinic-resepsionis',
    'clinic-marketing',
  )
  @SkipThrottle()
  @ApiOperation({
    summary: 'Get clinic settings (single row, read-only untuk semua clinic role)',
    description:
      'Semua clinic-* role butuh baca settings: admin/owner (CRUD/dashboard), psikolog (set jadwal availability — perlu lihat slot), resepsionis (booking wizard — perlu lihat slot), marketing (context). Hanya admin yang boleh PATCH.',
  })
  get() {
    return this.service.get();
  }

  @Patch()
  @Roles('clinic-admin')
  @ApiOperation({ summary: 'Update clinic settings (partial)' })
  update(@Body() dto: UpdateSettingsDto, @Request() req: AuthRequest) {
    return this.service.update(dto, req.user?.sub ?? req.user?.id);
  }

  @Get('wa-status')
  @Roles('clinic-admin')
  @ApiOperation({ summary: 'Cek status koneksi device Fonnte secara real-time' })
  getWaStatus() {
    return this.service.getWaDeviceStatus();
  }

  // ── WA device pairing endpoints (admin-only, butuh FONNTE_ACCOUNT_TOKEN) ──

  @Get('wa-devices')
  @Roles('clinic-admin')
  @ApiOperation({
    summary: 'List semua device WA di akun Fonnte (mark device yang aktif di app)',
  })
  listWaDevices() {
    return this.service.listDevices();
  }

  @Post('wa-devices')
  @Roles('clinic-admin')
  @ApiOperation({
    summary: 'Tambah device WA baru di akun Fonnte. Return device token untuk pairing /qr.',
  })
  addWaDevice(@Body() dto: CreateWaDeviceDto) {
    return this.service.addDevice(dto);
  }

  @Post('wa-devices/qr')
  @Roles('clinic-admin')
  @ApiOperation({
    summary: 'Ambil payload QR Fonnte untuk scan via WhatsApp Linked Devices',
  })
  getWaDeviceQr(@Body() dto: WaDeviceQrDto) {
    return this.service.getDeviceQr(dto);
  }

  @Post('wa-devices/check')
  @Roles('clinic-admin')
  @ApiOperation({
    summary: 'Cek status connect device (polling-friendly, tidak hit /qr Fonnte)',
  })
  checkWaDevice(@Body() dto: WaDeviceQrDto) {
    return this.service.checkDeviceConnected(dto);
  }

  @Post('wa-devices/activate')
  @Roles('clinic-admin')
  @ApiOperation({
    summary: 'Set device sebagai active sender (simpan token & nomor ke ClinicSettings)',
  })
  activateWaDevice(
    @Body() dto: ActivateWaDeviceDto,
    @Request() req: AuthRequest,
  ) {
    return this.service.activateDevice(dto, req.user?.sub ?? req.user?.id);
  }

  @Delete('wa-devices/:devicePhone')
  @Roles('clinic-admin')
  @ApiOperation({
    summary: 'Disconnect + delete device dari akun Fonnte (slot device akun kembali bebas)',
  })
  removeWaDevice(
    @Param('devicePhone') devicePhone: string,
    @Request() req: AuthRequest,
  ) {
    return this.service.removeDevice(devicePhone, req.user?.sub ?? req.user?.id);
  }
}
