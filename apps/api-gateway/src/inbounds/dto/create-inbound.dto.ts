import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CreateInboundDetailDto } from './create-inbound-detail.dto';

const INBOUND_STATUSES = ['DRAFT', 'POSTED', 'CANCELLED'] as const;

export class CreateInboundDto {
  @ApiPropertyOptional({
    example: 'INB-20260214-0001',
    description: 'Optional. Leave empty to auto-generate.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  transactionNo?: string;

  @ApiPropertyOptional({
    example: '2026-02-14',
    description: 'Optional. Defaults to current date.',
  })
  @IsOptional()
  @IsDateString()
  transactionDate?: string;

  @ApiProperty({
    example: 'cm123supplier456def',
    description: 'Supplier contact UUID (type=supplier)',
  })
  @IsString()
  @MaxLength(100)
  supplierId!: string;

  @ApiProperty({ example: 'cm123warehouse456def', description: 'Warehouse UUID' })
  @IsString()
  @MaxLength(100)
  warehouseId!: string;

  @ApiPropertyOptional({ example: 'Barang datang sesuai PO' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ enum: INBOUND_STATUSES, default: 'DRAFT' })
  @IsOptional()
  @IsString()
  @IsIn(INBOUND_STATUSES)
  status?: (typeof INBOUND_STATUSES)[number];

  @ApiProperty({ type: [CreateInboundDetailDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateInboundDetailDto)
  details!: CreateInboundDetailDto[];
}
