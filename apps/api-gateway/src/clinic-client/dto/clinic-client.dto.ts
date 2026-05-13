import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export const GENDERS = ['L', 'P'] as const;
export type Gender = (typeof GENDERS)[number];

export const CLIENT_CATEGORIES = ['dewasa', 'remaja', 'anak', 'pasangan', 'keluarga'] as const;
export type ClientCategory = (typeof CLIENT_CATEGORIES)[number];

export const CLIENT_STATUSES = ['baru', 'aktif', 'selesai'] as const;
export type ClientStatus = (typeof CLIENT_STATUSES)[number];

export class CreateClientDto {
  @ApiProperty({ example: 'Andi Wijaya' })
  @IsString()
  @MaxLength(255)
  name!: string;

  @ApiProperty({ example: 'L', enum: GENDERS })
  @IsIn(GENDERS)
  gender!: Gender;

  @ApiPropertyOptional({ example: 28 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(120)
  age?: number;

  @ApiPropertyOptional({ enum: CLIENT_CATEGORIES, example: 'dewasa' })
  @IsOptional()
  @IsIn(CLIENT_CATEGORIES)
  category?: ClientCategory;

  @ApiProperty({ example: '+6281234567890', description: 'WhatsApp E.164' })
  @IsString()
  @MaxLength(30)
  phoneWa!: string;

  @ApiPropertyOptional({ example: 'MR-2026-0001' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  medicalRecordNumber?: string;

  @ApiPropertyOptional({ example: 'konseling' })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  preferredServiceType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  waOptedOut?: boolean;

  @ApiPropertyOptional({ default: true, description: 'False = klien dinonaktifkan (tidak muncul di pilihan booking baru, histori tetap)' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateClientDto extends PartialType(CreateClientDto) {}

export class QueryClientDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  limit?: number = 50;

  @ApiPropertyOptional({ description: 'Search nama, phone, MRN' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: GENDERS })
  @IsOptional()
  @IsIn(GENDERS)
  gender?: Gender;

  @ApiPropertyOptional({ enum: CLIENT_CATEGORIES })
  @IsOptional()
  @IsIn(CLIENT_CATEGORIES)
  category?: ClientCategory;

  @ApiPropertyOptional({ enum: CLIENT_STATUSES, description: 'Derived dari booking activity' })
  @IsOptional()
  @IsIn(CLIENT_STATUSES)
  status?: ClientStatus;

  @ApiPropertyOptional()
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
  waOptedOut?: boolean;

  @ApiPropertyOptional()
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
