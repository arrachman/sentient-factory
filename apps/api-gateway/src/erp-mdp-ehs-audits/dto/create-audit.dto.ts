import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MdpEhsAuditType, MdpEhsAuditStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateEhsAuditDto {
  @ApiProperty({ example: "AUD-0001" })
  @IsString()
  @MaxLength(50)
  code!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  name!: string;

  @ApiProperty({ enum: MdpEhsAuditType })
  @IsEnum(MdpEhsAuditType)
  type!: MdpEhsAuditType;

  @ApiPropertyOptional({ enum: MdpEhsAuditStatus })
  @IsOptional()
  @IsEnum(MdpEhsAuditStatus)
  status?: MdpEhsAuditStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  scope?: string;

  @ApiPropertyOptional({ description: "eam_work_centers id" })
  @IsOptional()
  @IsString()
  workCenterId?: string;

  @ApiPropertyOptional({ description: "adm_users id" })
  @IsOptional()
  @IsString()
  auditorId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  conductedAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  score?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  findings?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
