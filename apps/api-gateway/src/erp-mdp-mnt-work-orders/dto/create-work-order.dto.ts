import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MdpMntWorkOrderType, MdpMntWorkOrderStatus, MdpMntPriority } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateMntWorkOrderDto {
  @ApiProperty({ example: "WO-2606-0001" })
  @IsString()
  @MaxLength(50)
  code!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  name!: string;

  @ApiPropertyOptional({ enum: MdpMntWorkOrderType })
  @IsOptional()
  @IsEnum(MdpMntWorkOrderType)
  type?: MdpMntWorkOrderType;

  @ApiPropertyOptional({ enum: MdpMntWorkOrderStatus })
  @IsOptional()
  @IsEnum(MdpMntWorkOrderStatus)
  status?: MdpMntWorkOrderStatus;

  @ApiPropertyOptional({ enum: MdpMntPriority })
  @IsOptional()
  @IsEnum(MdpMntPriority)
  priority?: MdpMntPriority;

  @ApiPropertyOptional({ description: "eam_assets id" })
  @IsOptional()
  @IsString()
  assetId?: string;

  @ApiPropertyOptional({ description: "eam_work_centers id" })
  @IsOptional()
  @IsString()
  workCenterId?: string;

  @ApiPropertyOptional({ description: "mnt_pm_schedules id" })
  @IsOptional()
  @IsString()
  pmScheduleId?: string;

  @ApiPropertyOptional({ description: "mnt_failure_codes id" })
  @IsOptional()
  @IsString()
  failureCodeId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  scheduledStartAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  scheduledEndAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  actualStartAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  actualEndAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  downtimeMinutes?: number;

  @ApiPropertyOptional({ description: "adm_users id" })
  @IsOptional()
  @IsString()
  reportedById?: string;

  @ApiPropertyOptional({ description: "adm_users id" })
  @IsOptional()
  @IsString()
  assignedToId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
