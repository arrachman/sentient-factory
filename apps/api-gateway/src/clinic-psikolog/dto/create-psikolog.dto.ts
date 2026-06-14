import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreatePsikologDto {
  // ----- User account fields -----
  @ApiProperty({ example: 'farah@althea.local' })
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @ApiProperty({ example: 'Farah Rahmadhani, M.Psi' })
  @IsString()
  @MaxLength(255)
  fullName!: string;

  @ApiPropertyOptional({
    description: 'No WhatsApp psikolog (E.164 atau format lokal Indonesia)',
    example: '081234567890',
  })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  phone?: string;

  @ApiPropertyOptional({
    description: 'Username; auto-generated dari email kalau kosong',
    example: 'farah-rahmadhani',
  })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  username?: string;

  @ApiPropertyOptional({
    description: 'Initial password (min 8 chars). Auto-generate kalau kosong (TODO: send via WA)',
    example: 'Test1234!',
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(120)
  password?: string;

  // ----- Psikolog profile fields -----
  @ApiPropertyOptional({ example: 'M.Psi' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  title?: string;

  @ApiPropertyOptional({
    description: 'List spesialisasi (e.g., klinis_dewasa, anak_remaja)',
    example: ['klinis_dewasa', 'pasangan'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  specialty?: string[];

  @ApiPropertyOptional({ example: '#5b8a66', description: 'Hex color untuk avatar/badge' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  color?: string;

  @ApiPropertyOptional({ example: 'SIPP-12345', description: 'Surat Izin Praktik Psikolog' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  license?: string;

  @ApiPropertyOptional({ example: 4, default: 4 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(20)
  defaultSlots?: number;

  @ApiPropertyOptional({
    description:
      'Jadwal mingguan psikolog. Format: { "monday": { isOpen: true, slotIndices?: [0,1,2] }, ..., "sunday": { isOpen: false } }. Empty {} = belum set → admin tidak bisa booking.',
    example: { monday: { isOpen: true }, tuesday: { isOpen: true } },
  })
  @IsOptional()
  weeklyAvailability?: Record<string, { isOpen: boolean; slotIndices?: number[] }>;

  @ApiPropertyOptional({
    description:
      'Layanan yang ditangani psikolog (service IDs). Kosong/undefined = handle SEMUA layanan (default). Filled = hanya layanan yang di-list.',
    example: [1, 3, 5],
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  serviceIds?: number[];

  @ApiPropertyOptional({ example: 'Lulusan Universitas Indonesia, fokus...' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  bio?: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
