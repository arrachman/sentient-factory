import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateHolidayDto {
  @ApiProperty({ example: '2026-08-17' })
  @IsDateString()
  holidayDate!: string;

  @ApiProperty({ example: 'Hari Kemerdekaan RI' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  name!: string;

  @ApiPropertyOptional({ example: true, description: 'Recurs annually on the same month/day.' })
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @ApiPropertyOptional({ example: 'Nasional' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  region?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateHolidayDto {
  @IsOptional() @IsDateString() holidayDate?: string;
  @IsOptional() @IsString() @MaxLength(160) name?: string;
  @IsOptional() @IsBoolean() isRecurring?: boolean;
  @IsOptional() @IsString() @MaxLength(120) region?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
}

export class QueryHolidayDto {
  @ApiPropertyOptional({ example: 2026, description: 'Filter to a calendar year.' })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1970) year?: number;
}
