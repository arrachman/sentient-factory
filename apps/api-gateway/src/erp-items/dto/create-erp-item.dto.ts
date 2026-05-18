import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ErpItemType } from '@prisma/client';

export class CreateErpItemDto {
  @ApiProperty({ example: 'ITM-001', description: 'Unique item code' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code!: string;

  @ApiProperty({ example: 'Steel Rod 10mm', description: 'Item name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @ApiProperty({ enum: ErpItemType, example: ErpItemType.INVENTORY, description: 'Item type' })
  @IsEnum(ErpItemType)
  itemType!: ErpItemType;

  @ApiProperty({ example: '1', description: 'Category ID (BigInt as string)' })
  @IsString()
  @IsNotEmpty()
  categoryId!: string;

  @ApiProperty({ example: '1', description: 'Base unit ID (BigInt as string)' })
  @IsString()
  @IsNotEmpty()
  unitId!: string;

  @ApiPropertyOptional({ example: 'D6 10mm steel rod', description: 'Item description' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({ example: '12345678', description: 'Barcode' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  barcode?: string;

  @ApiPropertyOptional({ example: '50000', description: 'Standard cost (Decimal as string)' })
  @IsOptional()
  @IsString()
  standardCost?: string;

  @ApiPropertyOptional({ example: '50000', description: 'Purchase price (Decimal as string)' })
  @IsOptional()
  @IsString()
  purchasePrice?: string;

  @ApiPropertyOptional({ example: '75000', description: 'Sale price (Decimal as string)' })
  @IsOptional()
  @IsString()
  salePrice?: string;

  @ApiPropertyOptional({ example: '10', description: 'Minimum stock level' })
  @IsOptional()
  @IsString()
  minStock?: string;

  @ApiPropertyOptional({ example: '500', description: 'Maximum stock level' })
  @IsOptional()
  @IsString()
  maxStock?: string;

  @ApiPropertyOptional({ example: '50', description: 'Reorder quantity' })
  @IsOptional()
  @IsString()
  reorderQty?: string;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  tracksSerial?: boolean = false;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  tracksBatch?: boolean = false;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  tracksBin?: boolean = false;

  @ApiPropertyOptional({
    example: '456',
    description: 'Inventory account ID (BigInt as string)',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  inventoryAccountId?: string | null;

  @ApiPropertyOptional({
    example: '457',
    description: 'Sales account ID (BigInt as string)',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  salesAccountId?: string | null;

  @ApiPropertyOptional({
    example: '458',
    description: 'COGS account ID (BigInt as string)',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  cogsAccountId?: string | null;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
