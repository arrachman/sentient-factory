import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateSettingsDto {
  @ApiPropertyOptional({ example: 'Althea Psychology' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  clinicName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  address?: string;

  @ApiPropertyOptional({ example: 'Asia/Jakarta' })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  timezone?: string;

  @ApiPropertyOptional({ example: 'IDR' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  currency?: string;

  @ApiPropertyOptional({
    description:
      'Slot operasional klinik (terdefinisi). Booking harus pas dengan salah satu slot. Format: [{ start: "HH:MM", end: "HH:MM", label?: string }, ...]',
    example: [
      { start: '08:30', end: '10:00', label: 'Pagi 1' },
      { start: '10:00', end: '11:30', label: 'Pagi 2' },
    ],
  })
  @IsOptional()
  @IsArray()
  slotsOfDay?: Array<{ start: string; end: string; label?: string }>;

  @ApiPropertyOptional({
    description:
      'Hari tutup (0=Minggu, 1=Senin, ..., 6=Sabtu). Default: [0] (Minggu tutup).',
    example: [0],
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  closedDayOfWeek?: number[];

  @ApiPropertyOptional({
    description: 'List ISO date holidays (YYYY-MM-DD) — tanggal libur ad-hoc',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  holidays?: string[];

  @ApiPropertyOptional({ example: 15 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(120)
  bufferMinutes?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  taxEnabled?: boolean;

  @ApiPropertyOptional({ example: 11.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  taxPercentage?: number;

  @ApiPropertyOptional({ example: 50.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  dpPercentage?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  waSendEnabled?: boolean;

  @ApiPropertyOptional({ example: '+62' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  waCountryCode?: string;
}
