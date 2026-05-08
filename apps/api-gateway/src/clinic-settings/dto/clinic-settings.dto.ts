import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
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
    description: 'Operating hours per day { monday: { open, close, isOpen }, ... }',
    type: 'object',
    additionalProperties: true,
  })
  @IsOptional()
  @IsObject()
  operatingHours?: Record<string, { open: string | null; close: string | null; isOpen: boolean }>;

  @ApiPropertyOptional({
    description: 'List ISO date holidays (YYYY-MM-DD)',
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
