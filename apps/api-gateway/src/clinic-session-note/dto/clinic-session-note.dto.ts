import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateSessionNoteDto {
  @ApiProperty({ example: 1, description: 'Booking ID' })
  @IsInt()
  bookingId!: number;

  @ApiProperty({
    example: 'Pasien tampak lebih relaks dari sesi sebelumnya...',
    description: 'Catatan klinis (markdown supported)',
  })
  @IsString()
  @MaxLength(20000)
  noteText!: string;

  @ApiPropertyOptional({
    default: true,
    description: 'Private = hanya psikolog yang lihat. Public = admin juga bisa.',
  })
  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;
}

export class UpdateSessionNoteDto extends PartialType(CreateSessionNoteDto) {}

export class QuerySessionNoteDto {
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

  @ApiPropertyOptional({ description: 'Filter by booking ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  bookingId?: number;

  @ApiPropertyOptional({ description: 'Filter by psikolog user ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  psikologUserId?: number;

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
  isPrivate?: boolean;
}
