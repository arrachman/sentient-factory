import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MdpEhsPermitType, MdpEhsPermitStatus } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateEhsPermitDto {
  @ApiProperty({ example: "PTW-0001" })
  @IsString()
  @MaxLength(50)
  code!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  name!: string;

  @ApiProperty({ enum: MdpEhsPermitType })
  @IsEnum(MdpEhsPermitType)
  type!: MdpEhsPermitType;

  @ApiPropertyOptional({ enum: MdpEhsPermitStatus })
  @IsOptional()
  @IsEnum(MdpEhsPermitStatus)
  status?: MdpEhsPermitStatus;

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

  @ApiPropertyOptional({ description: "adm_users id" })
  @IsOptional()
  @IsString()
  requestedById?: string;

  @ApiPropertyOptional({ description: "adm_users id" })
  @IsOptional()
  @IsString()
  approvedById?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  validFrom?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  validTo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
