import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn, IsInt, IsNumber, IsOptional, IsString, Matches, Max, Min,
} from 'class-validator';

const PIN_RE = /^\d{4,6}$/;

export class SetKioskPinDto {
  @ApiProperty({ example: '1234', description: 'PIN 4–6 digit.' })
  @Matches(PIN_RE, { message: 'PIN harus 4–6 digit angka.' })
  pin!: string;
}

export class KioskClockDto {
  @ApiProperty({ enum: ['in', 'out'], example: 'in' })
  @IsIn(['in', 'out'])
  action!: 'in' | 'out';

  @ApiProperty({ example: 1, description: 'Worksite tempat kiosk berada.' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  worksiteId!: number;

  @ApiPropertyOptional({ example: '1234', description: 'PIN karyawan (jalur PIN).' })
  @IsOptional()
  @Matches(PIN_RE, { message: 'PIN harus 4–6 digit angka.' })
  pin?: string;

  @ApiPropertyOptional({
    example: 12,
    description: 'App user ID hasil face-identify (jalur wajah).',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  appUserId?: number;

  @ApiPropertyOptional({ example: 0.91 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1)
  faceScore?: number;
}
