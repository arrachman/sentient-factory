import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, Max, Min } from 'class-validator';

/**
 * Overtime & break rules (jibble Overtime Tracker). Persisted in hr_settings
 * under setting_group='overtime' with fully-qualified snake_case keys, so reads
 * and writes round-trip on the same key (no camelCase mismatch).
 */
export class UpdateOvertimePolicyDto {
  @ApiPropertyOptional({ example: true, description: 'Hitung jam di atas reguler sebagai lembur.' })
  @IsOptional()
  @IsBoolean()
  overtimeEnabled?: boolean;

  @ApiPropertyOptional({ example: 8, description: 'Jam reguler per hari sebelum lembur.' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(24)
  dailyRegularHours?: number;

  @ApiPropertyOptional({ example: 40, description: 'Jam reguler per minggu sebelum lembur.' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(168)
  weeklyRegularHours?: number;

  @ApiPropertyOptional({ example: 1.5, description: 'Pengali upah untuk jam lembur.' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(10)
  overtimeMultiplier?: number;

  @ApiPropertyOptional({ example: 60, description: 'Durasi istirahat default per shift (menit).' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(480)
  breakMinutes?: number;

  @ApiPropertyOptional({ example: false, description: 'Apakah waktu istirahat dibayar.' })
  @IsOptional()
  @IsBoolean()
  breakPaid?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Kerja di hari libur (kalender) dihitung lembur.',
  })
  @IsOptional()
  @IsBoolean()
  countHolidayAsOvertime?: boolean;
}
