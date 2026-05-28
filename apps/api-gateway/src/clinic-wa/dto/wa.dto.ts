import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export const WA_CATEGORIES = ['pengingat', 'jadwal', 'onboarding', 'bayar'] as const;
export type WaCategory = (typeof WA_CATEGORIES)[number];

export const WA_RECIPIENTS = ['klien', 'psikolog'] as const;

export class CreateTemplateDto {
  @ApiProperty({ example: 'Konfirmasi Booking' })
  @IsString()
  @MaxLength(120)
  name!: string;

  @ApiProperty({ example: 'jadwal', enum: WA_CATEGORIES })
  @IsIn(WA_CATEGORIES)
  category!: WaCategory;

  @ApiPropertyOptional({ example: 'confirmation' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  triggerEvent?: string;

  @ApiProperty({ example: 'Hai {{nama_klien}}, sesi kamu...' })
  @IsString()
  @MaxLength(4000)
  body!: string;

  @ApiProperty({ example: ['klien'], type: [String] })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  recipients!: string[];

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateTemplateDto extends PartialType(CreateTemplateDto) {
  // Override: izinkan recipients=[] saat update (semua toggle off di drawer
  // Pengaturan WA = template aktif tapi tidak dispatch ke siapapun).
  // Create masih wajib ArrayMinSize(1) untuk cegah template "yatim".
  @ApiPropertyOptional({ example: ['klien'], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  recipients?: string[];
}

export class QueryTemplateDto {
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

  @ApiPropertyOptional({ enum: WA_CATEGORIES })
  @IsOptional()
  @IsIn(WA_CATEGORIES)
  category?: WaCategory;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

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

export class QueryWaLogDto {
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

  @ApiPropertyOptional({ enum: ['queued', 'terkirim', 'sampai', 'dibaca', 'gagal'] })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  recipientPhone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  templateId?: number;
}

export class SendTestDto {
  @ApiProperty({ example: '+6281234567890' })
  @IsString()
  @MaxLength(30)
  phone!: string;

  @ApiPropertyOptional({ description: 'Template ID (optional). Kalau kosong, pakai body raw.' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  templateId?: number;

  @ApiPropertyOptional({ description: 'Raw body kalau tidak pakai template.' })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  body?: string;

  @ApiPropertyOptional({ type: 'object', additionalProperties: true })
  @IsOptional()
  @IsObject()
  variables?: Record<string, string>;
}

export class FonnteWebhookDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  device?: string;

  @ApiPropertyOptional({
    description:
      'Message ID dari Fonnte. Fonnte kadang kirim sebagai number, kadang string — Transform paksa ke string.',
  })
  @IsOptional()
  @Transform(({ value }) => (value === undefined || value === null ? value : String(value)))
  @IsString()
  id?: string;

  @ApiPropertyOptional({ description: 'sender phone (format 62xxx)' })
  @IsOptional()
  @IsString()
  sender?: string;

  @ApiPropertyOptional({
    description: 'message status: sent/delivered/read/failed',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    description: 'Fonnte state field — some webhook types use this instead of status',
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;
}
