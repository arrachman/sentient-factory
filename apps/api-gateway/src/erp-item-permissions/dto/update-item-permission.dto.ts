import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateErpItemPermissionDto {
  @ApiPropertyOptional() @IsBoolean() @IsOptional()
  canView?: boolean;

  @ApiPropertyOptional() @IsBoolean() @IsOptional()
  canSell?: boolean;

  @ApiPropertyOptional() @IsBoolean() @IsOptional()
  canBuy?: boolean;
}
