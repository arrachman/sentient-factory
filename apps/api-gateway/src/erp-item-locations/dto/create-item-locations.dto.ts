import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateErpItemLocationDto {
  @ApiProperty({ example: 'ILC-001' })
  @IsString()
  @MaxLength(50)
  code!: string;

  @ApiProperty({ example: 'Item Location Sample' })
  @IsString()
  @MaxLength(150)
  name!: string;

  @ApiPropertyOptional({ example: "1", description: "Warehouse id" })
  @IsOptional()
  @IsString()
  warehouseId?: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
