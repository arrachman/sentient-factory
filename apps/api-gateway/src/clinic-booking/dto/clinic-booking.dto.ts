import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export const BOOKING_STATUSES = [
  'checked_in',
  'in_progress',
  'completed',
  'cancelled',
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export class CreateBookingDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  clientId!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  serviceId!: number;

  @ApiProperty({ example: 147, description: 'User ID dari psikolog (clinic-psikolog role)' })
  @IsInt()
  psikologUserId!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  roomId!: number;

  @ApiProperty({ example: '2026-05-15T09:00:00+07:00', description: 'ISO datetime jadwal mulai' })
  @IsDateString()
  scheduledStart!: string;

  @ApiProperty({ example: '2026-05-15T10:00:00+07:00', description: 'ISO datetime jadwal selesai' })
  @IsDateString()
  scheduledEnd!: string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  sessionN?: number;

  @ApiPropertyOptional({ example: 1, default: 1, description: 'Total sesi paket' })
  @IsOptional()
  @IsInt()
  @Min(1)
  sessionTotal?: number;

  @ApiPropertyOptional({ description: 'Group ID untuk multi-session package (UUID)' })
  @IsOptional()
  @IsString()
  packageGroupId?: string;

  @ApiPropertyOptional({ default: false, description: 'Walk-in booking (resepsionis)' })
  @IsOptional()
  @IsBoolean()
  createdViaWalkIn?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}

export class UpdateBookingDto extends PartialType(CreateBookingDto) {}

export class RescheduleBookingDto {
  @ApiProperty({ example: '2026-05-15T11:00:00+07:00' })
  @IsDateString()
  scheduledStart!: string;

  @ApiProperty({ example: '2026-05-15T12:00:00+07:00' })
  @IsDateString()
  scheduledEnd!: string;

  @ApiPropertyOptional({ example: 1, description: 'New room (optional, default: keep existing)' })
  @IsOptional()
  @IsInt()
  roomId?: number;

  @ApiPropertyOptional({ example: 147, description: 'New psikolog (optional)' })
  @IsOptional()
  @IsInt()
  psikologUserId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;

}

export class CancelBookingDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}

export class QueryBookingDto {
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
  @Max(500)
  limit?: number = 50;

  @ApiPropertyOptional({ enum: BOOKING_STATUSES })
  @IsOptional()
  @IsIn(BOOKING_STATUSES)
  status?: BookingStatus;

  @ApiPropertyOptional({ description: 'ISO date — filter booking pada hari ini (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiPropertyOptional({ description: 'Filter booking dari tanggal (YYYY-MM-DD), inklusif' })
  @IsOptional()
  @IsString()
  dateFrom?: string;

  @ApiPropertyOptional({ description: 'Filter booking sampai tanggal (YYYY-MM-DD), inklusif' })
  @IsOptional()
  @IsString()
  dateTo?: string;

  @ApiPropertyOptional({ description: 'Filter by psikolog user id' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  psikologUserId?: number;

  @ApiPropertyOptional({ description: 'Filter by client id' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  clientId?: number;

  @ApiPropertyOptional({ description: 'Filter by room id' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  roomId?: number;

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
  includeCancelled?: boolean;
}

/**
 * Single session entry untuk multi-session package booking.
 * Optional override psikolog/room per sesi (default = base).
 */
export class PackageSessionDto {
  @ApiProperty({ example: '2026-05-15T09:00:00+07:00' })
  @IsDateString()
  scheduledStart!: string;

  @ApiProperty({ example: '2026-05-15T10:00:00+07:00' })
  @IsDateString()
  scheduledEnd!: string;

  @ApiPropertyOptional({ description: 'Override psikolog (default: base)' })
  @IsOptional()
  @IsInt()
  psikologUserId?: number;

  @ApiPropertyOptional({ description: 'Override room (default: base)' })
  @IsOptional()
  @IsInt()
  roomId?: number;
}

/**
 * Create N bookings sekaligus untuk package service (sessionCount > 1).
 * Semua share packageGroupId, sessionN auto-increment 1..N.
 *
 * Atomic — kalau salah satu sesi gagal validation, semua rollback.
 */
export class CreatePackageBookingDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  clientId!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  serviceId!: number;

  @ApiProperty({ example: 147, description: 'Default psikolog untuk semua sesi' })
  @IsInt()
  psikologUserId!: number;

  @ApiProperty({ example: 1, description: 'Default room untuk semua sesi' })
  @IsInt()
  roomId!: number;

  @ApiProperty({
    type: [PackageSessionDto],
    description: 'Array sesi (length harus = service.sessionCount)',
  })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => PackageSessionDto)
  sessions!: PackageSessionDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
