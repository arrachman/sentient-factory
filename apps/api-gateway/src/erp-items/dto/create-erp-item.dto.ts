import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ErpCostingMethod, ErpItemType } from '@prisma/client';

export class CreateErpItemDto {
  // ─── Core identity ────────────────────────────────────────────────
  @ApiProperty({ example: 'ITM-001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code!: string;

  @ApiProperty({ example: 'Steel Rod 10mm' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @ApiProperty({ enum: ErpItemType, example: ErpItemType.INVENTORY })
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

  @ApiPropertyOptional({ example: 'D6 10mm steel rod' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({ example: '12345678' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  barcode?: string;

  // ─── Costing method (HPP) ─────────────────────────────────────────
  @ApiPropertyOptional({ enum: ErpCostingMethod, default: ErpCostingMethod.AVG })
  @IsOptional()
  @IsEnum(ErpCostingMethod)
  costMethod?: ErpCostingMethod;

  // ─── Classification (lookups) ─────────────────────────────────────
  @ApiPropertyOptional({ description: 'Item kind ID (md_item_types) — legacy "Tipe"' })
  @IsOptional()
  @IsString()
  kindId?: string | null;

  @ApiPropertyOptional({ description: 'Product class ID (md_product_classes) — legacy "Kelas Produk"' })
  @IsOptional()
  @IsString()
  productClassId?: string | null;

  @ApiPropertyOptional() @IsOptional() @IsString() brandId?: string | null;
  @ApiPropertyOptional() @IsOptional() @IsString() materialId?: string | null;
  @ApiPropertyOptional() @IsOptional() @IsString() itemModelId?: string | null;
  @ApiPropertyOptional() @IsOptional() @IsString() sizeId?: string | null;
  @ApiPropertyOptional() @IsOptional() @IsString() colorId?: string | null;
  @ApiPropertyOptional() @IsOptional() @IsString() sectionId?: string | null;

  // ─── GL / organizational dimensions ───────────────────────────────
  @ApiPropertyOptional() @IsOptional() @IsString() divisionId?: string | null;
  @ApiPropertyOptional() @IsOptional() @IsString() subdivisionId?: string | null;
  @ApiPropertyOptional() @IsOptional() @IsString() departmentId?: string | null;
  @ApiPropertyOptional() @IsOptional() @IsString() subDepartmentId?: string | null;
  @ApiPropertyOptional() @IsOptional() @IsString() branchId?: string | null;
  @ApiPropertyOptional() @IsOptional() @IsString() defaultLocationId?: string | null;
  @ApiPropertyOptional() @IsOptional() @IsString() defaultWarehouseId?: string | null;
  @ApiPropertyOptional() @IsOptional() @IsString() projectId?: string | null;
  @ApiPropertyOptional() @IsOptional() @IsString() costCenterId?: string | null;

  // ─── Costs & prices ───────────────────────────────────────────────
  @ApiPropertyOptional({ example: '50000' }) @IsOptional() @IsString() standardCost?: string;
  @ApiPropertyOptional({ example: '50000' }) @IsOptional() @IsString() purchasePrice?: string;
  @ApiPropertyOptional({ example: '75000' }) @IsOptional() @IsString() salePrice?: string;

  // ─── Stock levels ─────────────────────────────────────────────────
  @ApiPropertyOptional({ example: '10' }) @IsOptional() @IsString() minStock?: string;
  @ApiPropertyOptional({ example: '500' }) @IsOptional() @IsString() maxStock?: string;
  @ApiPropertyOptional({ example: '50' }) @IsOptional() @IsString() reorderQty?: string;
  @ApiPropertyOptional({ example: '5' }) @IsOptional() @IsString() minOrderQty?: string;

  // ─── Tracking flags ───────────────────────────────────────────────
  @ApiPropertyOptional({ default: false }) @IsOptional() @IsBoolean() tracksSerial?: boolean = false;
  @ApiPropertyOptional({ default: false }) @IsOptional() @IsBoolean() tracksBatch?: boolean = false;
  @ApiPropertyOptional({ default: false }) @IsOptional() @IsBoolean() tracksBin?: boolean = false;

  // ─── GL accounts ──────────────────────────────────────────────────
  @ApiPropertyOptional({ nullable: true }) @IsOptional() @IsString() inventoryAccountId?: string | null;
  @ApiPropertyOptional({ nullable: true }) @IsOptional() @IsString() salesAccountId?: string | null;
  @ApiPropertyOptional({ nullable: true }) @IsOptional() @IsString() cogsAccountId?: string | null;

  // ─── Tax ──────────────────────────────────────────────────────────
  @ApiPropertyOptional({ nullable: true }) @IsOptional() @IsString() purchaseTaxId?: string | null;
  @ApiPropertyOptional({ nullable: true }) @IsOptional() @IsString() saleTaxId?: string | null;

  // ─── Supplier & physical ──────────────────────────────────────────
  @ApiPropertyOptional({ nullable: true }) @IsOptional() @IsString() primarySupplierId?: string | null;
  @ApiPropertyOptional({ example: '1.5' }) @IsOptional() @IsString() weight?: string;

  // ─── Validity & flags (legacy parity) ─────────────────────────────
  @ApiPropertyOptional({ description: 'Kategori Umur (freetext)' })
  @IsOptional() @IsString() ageCategory?: string | null;

  @ApiPropertyOptional({ description: 'Berlaku s.d (ISO date YYYY-MM-DD)' })
  @IsOptional() @IsDateString() validUntil?: string | null;

  @ApiPropertyOptional({ default: true, description: 'BKP — Barang Kena Pajak (VATable)' })
  @IsOptional() @IsBoolean() isVatable?: boolean = true;

  @ApiPropertyOptional({ default: false, description: 'Spesial' })
  @IsOptional() @IsBoolean() isSpecial?: boolean = false;

  @ApiPropertyOptional({ default: true }) @IsOptional() @IsBoolean() isActive?: boolean = true;
}
