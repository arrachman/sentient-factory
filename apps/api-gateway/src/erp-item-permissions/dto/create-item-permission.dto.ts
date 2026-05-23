import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateErpItemPermissionDto {
  @ApiProperty() @IsString()
  itemId!: string;

  @ApiProperty() @IsString()
  roleId!: string;

  @ApiPropertyOptional() @IsBoolean() @IsOptional()
  canView?: boolean;

  @ApiPropertyOptional() @IsBoolean() @IsOptional()
  canSell?: boolean;

  @ApiPropertyOptional() @IsBoolean() @IsOptional()
  canBuy?: boolean;
}
