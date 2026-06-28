import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateRoleMenuDto {
  @ApiProperty({ description: 'ERP adm_roles id (cross-app scalar ref)' })
  @IsString()
  roleId!: string;

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
