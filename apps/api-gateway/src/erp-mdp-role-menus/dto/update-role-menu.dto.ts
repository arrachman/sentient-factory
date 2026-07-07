import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateRoleMenuDto } from './create-role-menu.dto';

// roleId/menuId are the natural key — only the permission flags are mutable.
export class UpdateRoleMenuDto extends PartialType(
  OmitType(CreateRoleMenuDto, ['roleId', 'menuId'] as const),
) {}
