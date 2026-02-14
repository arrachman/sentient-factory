import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateMasterDataDivisionDto {
  @ApiProperty({ example: 'F&B' })
  @IsString()
  @MaxLength(50)
  code!: string;

  @ApiProperty({ example: 'Food & Beverage' })
  @IsString()
  @MaxLength(120)
  name!: string;

  @ApiPropertyOptional({ example: 'Divisi penjualan makanan dan minuman retail' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @ApiProperty({ example: true, default: true })
  @IsBoolean()
  isActive!: boolean;
}
