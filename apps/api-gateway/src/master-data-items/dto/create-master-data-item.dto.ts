import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateMasterDataItemDto {
  @ApiProperty({ example: 'ITEM-001' })
  @IsString()
  @MaxLength(100)
  code!: string;

  @ApiProperty({ example: 'Frozen Shrimp 500g' })
  @IsString()
  @MaxLength(255)
  name!: string;

  @ApiProperty({ example: 'Seafood' })
  @IsString()
  @MaxLength(120)
  category!: string;

  @ApiProperty({ example: 'cm123abc456def' })
  @IsString()
  @MaxLength(100)
  uomId!: string;

  @ApiProperty({ example: 'finished_good' })
  @IsString()
  @MaxLength(80)
  itemType!: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
