import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * DTOs untuk admin endpoint /clinic/settings/wa-devices.
 *
 * Pairing flow:
 *  1. POST /wa-devices            → addDevice (return device token)
 *  2. POST /wa-devices/qr         → ambil payload QR untuk scan
 *  3. POST /wa-devices/activate   → set sebagai device aktif (simpan token ke DB)
 *  4. DELETE /wa-devices          → disconnect + delete dari Fonnte
 */

export class CreateWaDeviceDto {
  @ApiProperty({
    description: 'Nama device di Fonnte (tampil di dashboard akun).',
    example: 'Althea Klinik',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(60)
  name!: string;

  @ApiProperty({
    description:
      'Nomor WhatsApp device (format bebas — boleh +62..., 62..., 08...). Akan jadi sender nomor.',
    example: '6282211008899',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  phone!: string;

  @ApiPropertyOptional({
    description:
      'Mode autoread (Fonnte mark inbound message as read). Default off untuk klinis (jaga riwayat chat).',
    enum: ['on', 'off'],
    default: 'off',
  })
  @IsOptional()
  @IsIn(['on', 'off'])
  autoread?: 'on' | 'off';
}

export class WaDeviceQrDto {
  @ApiProperty({
    description: 'Device token (per-device) yang baru dibuat via POST /wa-devices.',
    example: 'ecUetm8Bzpx6sfTqEKPb',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(120)
  deviceToken!: string;
}

export class ActivateWaDeviceDto {
  @ApiProperty({
    description:
      'Device token (per-device) yang dipakai untuk /send. Disimpan ke ClinicSettings.waActiveDeviceToken.',
    example: 'ecUetm8Bzpx6sfTqEKPb',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(120)
  deviceToken!: string;

  @ApiPropertyOptional({
    description:
      'Nomor WhatsApp device — disimpan ke ClinicSettings.waSenderNumber supaya tampil di UI. Format Fonnte standar (62xxx atau +62xxx).',
    example: '+6282211008899',
  })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  devicePhone?: string;

  @ApiPropertyOptional({
    description:
      'Auto-hapus device lama dari akun Fonnte (disconnect + delete-device). Default true.',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  removePrevious?: boolean;
}

export class DeleteWaDeviceDto {
  @ApiProperty({
    description:
      'Phone device yang mau dihapus (sesuai field `device` di /get-devices, mis. "6285735248244").',
    example: '6285735248244',
  })
  @IsString()
  @Matches(/^[0-9+]{8,20}$/)
  devicePhone!: string;
}
