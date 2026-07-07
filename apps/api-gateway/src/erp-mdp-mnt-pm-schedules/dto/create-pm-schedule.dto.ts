import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MdpMntPmTriggerType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateMntPmScheduleDto {
  @ApiProperty({ example: "PM-CUT-30D" })
  @IsString()
  @MaxLength(50)
  code!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  name!: string;

  @ApiPropertyOptional({ description: "eam_assets id" })
  @IsOptional()
  @IsString()
  assetId?: string;

  @ApiPropertyOptional({ description: "eam_work_centers id" })
  @IsOptional()
  @IsString()
  workCenterId?: string;

  @ApiPropertyOptional({ enum: MdpMntPmTriggerType })
  @IsOptional()
  @IsEnum(MdpMntPmTriggerType)
  triggerType?: MdpMntPmTriggerType;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  intervalDays?: number;

  @ApiPropertyOptional({ example: "RUN_HOURS" })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  meterType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  meterInterval?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  lastServiceAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  nextDueAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  taskDescription?: string;
}
