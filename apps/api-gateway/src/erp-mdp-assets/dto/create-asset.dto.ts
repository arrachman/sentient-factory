import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateAssetDto {
  @ApiProperty({ example: 'AST-PRESS-01' })
  @IsString()
  @MaxLength(50)
  code!: string;

  @ApiProperty({ example: 'Hydraulic Press 01' })
  @IsString()
  @MaxLength(150)
  name!: string;

  @ApiPropertyOptional({
    example: '42',
    description: 'ERP fa_assets ID (BigInt string) — financial twin, optional',
  })
  @IsOptional()
  @IsString()
  erpFixedAssetId?: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
