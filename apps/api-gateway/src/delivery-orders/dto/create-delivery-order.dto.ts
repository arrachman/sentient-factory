import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateDeliveryOrderDetailDto } from './create-delivery-order-detail.dto';

const DELIVERY_ORDER_STATUSES = ['DRAFT', 'SHIPPED', 'RECEIVED', 'CLOSED', 'CANCELLED'] as const;

export class CreateDeliveryOrderDto {
  @ApiProperty({ example: 'DO-2026-0001' })
  @IsString()
  @MaxLength(100)
  doNumber!: string;

  @ApiProperty({ example: '2026-02-13' })
  @IsDateString()
  doDate!: string;

  @ApiProperty({ example: '2026-02-13' })
  @IsDateString()
  doReceivedDate!: string;

  @ApiProperty({ example: 'cm123abc456def' })
  @IsString()
  @MaxLength(100)
  customerId!: string;

  @ApiPropertyOptional({ example: 'cm123city456def' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  destinationCityId?: string;

  @ApiPropertyOptional({ example: 2, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stdLeadTimeDays?: number;

  @ApiPropertyOptional({ example: 7, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stdReturnDoDays?: number;

  @ApiPropertyOptional({ example: '2026-02-14' })
  @IsOptional()
  @IsDateString()
  shippingDate?: string;

  @ApiPropertyOptional({ example: '2026-02-16' })
  @IsOptional()
  @IsDateString()
  actualReceivedDate?: string;

  @ApiPropertyOptional({ example: 'Budi Santoso' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  receivedBy?: string;

  @ApiPropertyOptional({ example: '2026-02-17' })
  @IsOptional()
  @IsDateString()
  doScanReturnDate?: string;

  @ApiPropertyOptional({ example: 'EXPORT' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  bu?: string;

  @ApiPropertyOptional({ example: 'Urgent delivery' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ enum: DELIVERY_ORDER_STATUSES, default: 'DRAFT' })
  @IsOptional()
  @IsString()
  @IsIn(DELIVERY_ORDER_STATUSES)
  status?: (typeof DELIVERY_ORDER_STATUSES)[number];

  @ApiProperty({ type: [CreateDeliveryOrderDetailDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateDeliveryOrderDetailDto)
  details!: CreateDeliveryOrderDetailDto[];
}
