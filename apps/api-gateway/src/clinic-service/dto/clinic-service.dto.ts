import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export const SERVICE_CATEGORIES = ['konseling', 'terapi', 'tes'] as const;
export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

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
