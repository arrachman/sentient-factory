import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateWorkCenterDto {
  @ApiProperty({ example: 'WC-CUTTING-01' })
  @IsString()
  @MaxLength(50)
  code!: string;

  @ApiProperty({ example: 'Cutting Line 1' })
  @IsString()
  @MaxLength(150)
  name!: string;

  @ApiPropertyOptional({ example: '3', description: 'Asset ID (BigInt string)' })
  @IsOptional()
  @IsString()
  assetId?: string;

  @ApiPropertyOptional({ example: 12.5, description: 'Ideal cycle seconds per unit' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  idealCycleSeconds?: number;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
