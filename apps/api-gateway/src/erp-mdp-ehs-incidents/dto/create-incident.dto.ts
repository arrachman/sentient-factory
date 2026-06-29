import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MdpEhsIncidentType, MdpEhsSeverity, MdpEhsIncidentStatus } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateEhsIncidentDto {
  @ApiProperty({ example: "INC-0001" })
  @IsString()
  @MaxLength(50)
  code!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  name!: string;

  @ApiProperty({ enum: MdpEhsIncidentType })
  @IsEnum(MdpEhsIncidentType)
  type!: MdpEhsIncidentType;

  @ApiPropertyOptional({ enum: MdpEhsSeverity })
  @IsOptional()
  @IsEnum(MdpEhsSeverity)
  severity?: MdpEhsSeverity;

  @ApiPropertyOptional({ enum: MdpEhsIncidentStatus })
  @IsOptional()
  @IsEnum(MdpEhsIncidentStatus)
  status?: MdpEhsIncidentStatus;

  @ApiPropertyOptional({ description: "eam_assets id" })
  @IsOptional()
  @IsString()
  assetId?: string;

  @ApiPropertyOptional({ description: "eam_work_centers id" })
  @IsOptional()
  @IsString()
  workCenterId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiProperty()
  @IsDateString()
  occurredAt!: string;

  @ApiPropertyOptional({ description: "adm_users id" })
  @IsOptional()
  @IsString()
  reportedById?: string;

  @ApiPropertyOptional({ description: "adm_users id" })
  @IsOptional()
  @IsString()
  investigatedById?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  rootCause?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  correctiveAction?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  closedAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
