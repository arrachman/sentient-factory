import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MdpWmsHandlingUnitStatus } from '@prisma/client';
import { IsBoolean, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateWmsHandlingUnitDto {
  @ApiProperty({ example: 'HU-PLT-0001' })
  @IsString()
  @MaxLength(50)
  code!: string;

  @ApiPropertyOptional({ enum: MdpWmsHandlingUnitStatus, default: MdpWmsHandlingUnitStatus.OPEN })
  @IsOptional()
  @IsEnum(MdpWmsHandlingUnitStatus)
  status?: MdpWmsHandlingUnitStatus;

  @ApiPropertyOptional({ description: 'md_storage_bins id (ERP)' })
  @IsOptional()
  @IsString()
  currentBinId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
