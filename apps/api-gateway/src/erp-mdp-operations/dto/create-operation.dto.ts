import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MdpMesOperationStatus } from '@prisma/client';
import {
  IsEnum,
  IsISO8601,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateOperationDto {
  @ApiProperty({
    example: '7',
    description: 'Production order ID (mes_production_orders, BigInt string)',
  })
  @IsString()
  productionOrderId!: string;

  @ApiProperty({ example: 10, description: 'Step order within the routing' })
  @IsInt()
  @Min(1)
  sequence!: number;

  @ApiProperty({ example: 'Cutting' })
  @IsString()
  @MaxLength(120)
  name!: string;

  @ApiProperty({ example: '5', description: 'Work center ID (eam_work_centers)' })
  @IsString()
  workCenterId!: string;

  @ApiPropertyOptional({ enum: MdpMesOperationStatus, default: MdpMesOperationStatus.PENDING })
  @IsOptional()
  @IsEnum(MdpMesOperationStatus)
  status?: MdpMesOperationStatus;

  @ApiPropertyOptional({ example: 1000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  plannedQty?: number;

  @ApiPropertyOptional({ example: 0, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  goodQty?: number;

  @ApiPropertyOptional({ example: 0, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  scrapQty?: number;

  @ApiPropertyOptional({ example: '2026-06-28T01:00:00.000Z' })
  @IsOptional()
  @IsISO8601()
  startedAt?: string;

  @ApiPropertyOptional({ example: '2026-06-28T02:00:00.000Z' })
  @IsOptional()
  @IsISO8601()
  completedAt?: string;
}
