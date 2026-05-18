import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export const SERVICE_CATEGORIES = ['konseling', 'terapi', 'tes'] as const;
export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

/**
 * Override range waktu satu slot untuk layanan ini. `index` menunjuk ke slot
 * di ClinicSettings.slotsOfDay (identitas/label slot tetap dari global) —
 * di sini cuma start/end yang digeser. Slot global tanpa entry di sini
 * dipakai apa adanya.
 */
export class SlotOverrideDto {
  @ApiProperty({ example: 0, description: 'Index slot di ClinicSettings.slotsOfDay' })
  @IsInt()
  @Min(0)
  index!: number;

  @ApiProperty({ example: '08:00', description: 'Jam mulai HH:MM (TZ klinik)' })
  @Matches(HHMM, { message: 'start harus format HH:MM' })
  start!: string;

  @ApiProperty({ example: '10:00', description: 'Jam selesai HH:MM (TZ klinik)' })
  @Matches(HHMM, { message: 'end harus format HH:MM' })
  end!: string;
}

export class CreateServiceDto {
  @ApiProperty({ example: 'Konseling Individu Dewasa' })
  @IsString()
  @MaxLength(255)
  name!: string;

  @ApiProperty({ example: 'konseling', enum: SERVICE_CATEGORIES })
  @IsIn(SERVICE_CATEGORIES)
  category!: ServiceCategory;

  @ApiProperty({ example: 1, description: 'Jumlah sesi dalam paket (1=single)' })
  @IsInt()
  @Min(1)
  @Max(100)
  sessionCount!: number;

  @ApiProperty({ example: 60, description: 'Durasi per sesi dalam menit' })
  @IsInt()
  @Min(15)
  @Max(480)
  durationMinutes!: number;

  @ApiProperty({ example: 500000, description: 'Harga paket TOTAL (bukan per sesi)' })
  @IsNumber()
  @Min(0)
  basePrice!: number;

  @ApiPropertyOptional({ example: 'Sesi konseling 1 jam tatap muka' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    type: [SlotOverrideDto],
    description:
      'Override range waktu slot khusus layanan ini. Kosong = pakai slot global apa adanya.',
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => SlotOverrideDto)
  slotOverrides?: SlotOverrideDto[];
}

export class UpdateServiceDto extends PartialType(CreateServiceDto) {}

export class QueryServiceDto {
  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 50, default: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  limit?: number = 50;

  @ApiPropertyOptional({ example: 'konseling' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'konseling', enum: SERVICE_CATEGORIES })
  @IsOptional()
  @IsIn(SERVICE_CATEGORIES)
  category?: ServiceCategory;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      const v = value.trim().toLowerCase();
      if (v === 'true') return true;
      if (v === 'false') return false;
    }
    return value;
  })
  @IsBoolean()
  isActive?: boolean;
}
