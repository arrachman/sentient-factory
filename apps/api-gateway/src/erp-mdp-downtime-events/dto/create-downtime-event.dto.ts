import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MdpDowntimeType } from '@prisma/client';
import { IsEnum, IsISO8601, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateDowntimeEventDto {
  @ApiProperty({ example: '5', description: 'Work center ID (eam_work_centers, BigInt string)' })
  @IsString()
  workCenterId!: string;

  @ApiProperty({
    example: '9',
    description: 'Reason code ID (mdp_reason_codes, category=DOWNTIME)',
  })
  @IsString()
  reasonId!: string;

  @ApiPropertyOptional({ example: '7', description: 'Production order ID (mes_production_orders)' })
  @IsOptional()
  @IsString()
  productionOrderId?: string;

  @ApiPropertyOptional({ example: '3', description: 'Operation ID (mes_operations)' })
  @IsOptional()
  @IsString()
  operationId?: string;

  @ApiPropertyOptional({ example: '4', description: 'Asset ID (eam_assets) that is down' })
  @IsOptional()
  @IsString()
  assetId?: string;

  @ApiPropertyOptional({ enum: MdpDowntimeType, default: MdpDowntimeType.UNPLANNED })
  @IsOptional()
  @IsEnum(MdpDowntimeType)
  type?: MdpDowntimeType;

  @ApiProperty({ example: '2026-06-28T03:00:00.000Z' })
  @IsISO8601()
  startedAt!: string;

  @ApiPropertyOptional({ example: '2026-06-28T03:30:00.000Z', description: 'Null = ongoing' })
  @IsOptional()
  @IsISO8601()
  endedAt?: string;

  @ApiPropertyOptional({ example: '15', description: 'Reporter user ID (ERP adm_users)' })
  @IsOptional()
  @IsString()
  reportedById?: string;

  @ApiPropertyOptional({ example: 'Ganti tooling' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
