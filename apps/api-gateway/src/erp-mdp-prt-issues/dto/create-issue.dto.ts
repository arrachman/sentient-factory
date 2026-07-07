import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MdpPrtIssueType, MdpPrtSeverity, MdpPrtIssueStatus } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePrtIssueDto {
  @ApiProperty({ example: "ISS-2606-0001" })
  @IsString()
  @MaxLength(50)
  code!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  name!: string;

  @ApiProperty({ enum: MdpPrtIssueType })
  @IsEnum(MdpPrtIssueType)
  type!: MdpPrtIssueType;

  @ApiPropertyOptional({ enum: MdpPrtSeverity })
  @IsOptional()
  @IsEnum(MdpPrtSeverity)
  severity?: MdpPrtSeverity;

  @ApiPropertyOptional({ enum: MdpPrtIssueStatus })
  @IsOptional()
  @IsEnum(MdpPrtIssueStatus)
  status?: MdpPrtIssueStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(60)
  source?: string;

  @ApiPropertyOptional({ description: "eam_assets id" })
  @IsOptional()
  @IsString()
  assetId?: string;

  @ApiPropertyOptional({ description: "eam_work_centers id" })
  @IsOptional()
  @IsString()
  workCenterId?: string;

  @ApiPropertyOptional({ description: "mes_production_orders id" })
  @IsOptional()
  @IsString()
  productionOrderId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({ description: "adm_users id" })
  @IsOptional()
  @IsString()
  reportedById?: string;

  @ApiPropertyOptional({ description: "adm_users id" })
  @IsOptional()
  @IsString()
  assignedToId?: string;

  @ApiProperty()
  @IsDateString()
  raisedAt!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  resolvedAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  resolution?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
