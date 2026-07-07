import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateLeaveTypeDto {
  @ApiProperty({ example: 'ANNUAL' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  code!: string;

  @ApiProperty({ example: 'Cuti Tahunan' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isPaid?: boolean;

  @ApiPropertyOptional({ example: 12 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  defaultQuotaDays?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateLeaveTypeDto {
  @IsOptional() @IsString() @MaxLength(40) code?: string;
  @IsOptional() @IsString() @MaxLength(120) name?: string;
  @IsOptional() @IsBoolean() isPaid?: boolean;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) defaultQuotaDays?: number;
  @IsOptional() @IsBoolean() isActive?: boolean;
}

export class CreateLeaveRequestDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  leaveTypeId!: number;

  @ApiProperty({ example: '2026-07-01' })
  @IsDateString()
  startDate!: string;

  @ApiProperty({ example: '2026-07-03' })
  @IsDateString()
  endDate!: string;

  @ApiPropertyOptional({ example: 'Acara keluarga' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}

export class ReviewLeaveRequestDto {
  @ApiPropertyOptional({ example: 'Disetujui' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}

export class QueryLeaveRequestDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;

  @ApiPropertyOptional({ example: 25 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number;

  @ApiPropertyOptional({ example: 'pending' })
  @IsOptional() @IsString() @IsIn(['pending', 'approved', 'rejected', 'cancelled'])
  status?: string;

  @ApiPropertyOptional({ example: 12, description: 'App user ID. Privileged only.' })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) userId?: number;

  @ApiPropertyOptional({ example: 'andi' })
  @IsOptional() @IsString() @MaxLength(100) search?: string;
}
