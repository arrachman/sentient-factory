import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsOptional, IsString, ValidateNested } from 'class-validator';

export class RoleMenuEntryDto {
  @ApiProperty({ description: 'mdp_menus id' })
  @IsString()
  menuId!: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  canView?: boolean = true;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  canEdit?: boolean = false;
}

/**
 * Full desired permission set for one role. The endpoint reconciles the live
 * mappings against this list: missing menus are created, present ones updated,
 * and live mappings absent from the list are soft-deleted — all atomically.
 */
export class SetRoleMenusDto {
  @ApiProperty({ type: [RoleMenuEntryDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoleMenuEntryDto)
  entries!: RoleMenuEntryDto[];
}
