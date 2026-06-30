import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateWorkCalendarDto {
  @ApiProperty({ example: 'CAL-DEFAULT' })
  @IsString()
  @MaxLength(50)
  code!: string;

  @ApiProperty({ example: 'Kalender Default (3 shift)' })
  @IsString()
  @MaxLength(150)
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ description: 'eam_work_centers id; null = plant-wide' })
  @IsOptional()
  @IsString()
  workCenterId?: string;

  @ApiPropertyOptional({ description: 'mdp_shifts id; null = all shifts' })
  @IsOptional()
  @IsString()
  shiftId?: string;

  @ApiProperty({
    example: 1440,
    description: 'Planned operating minutes per day (OEE availability basis)',
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  plannedMinutesPerDay!: number;

  @ApiPropertyOptional({ example: 6, default: 7 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(7)
  workingDaysPerWeek?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  effectiveFrom?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  effectiveTo?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
