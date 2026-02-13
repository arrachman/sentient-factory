import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateMasterDataWarehouseDto {
  @ApiProperty({ example: 'Warehouse Surabaya' })
  @IsString()
  @MaxLength(120)
  name!: string;

  @ApiProperty({ example: 'city-id-su-medan' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  cityId!: string;

  @ApiPropertyOptional({ example: 'Rungkut Industrial Area' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  locationName?: string;

  @ApiPropertyOptional({ example: 'Jl. Rungkut Industri IV No. 18, Surabaya' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  addressDetail?: string;
}
