import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ErpJwtAuthGuard } from '../erp-auth/guards/erp-jwt-auth.guard';
import { ErpMdpRoleMenusService } from './erp-mdp-role-menus.service';

/**
 * Thin read-only view of ERP roles (adm_roles) for the MDP access-map admin UI.
 * MDP reuses ERP identity/roles (no own role table); web-mdp only talks to
 * /api/mdp, so this exposes the role list under the MDP namespace.
 */
@ApiTags('MDP Roles')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('mdp/roles')
export class ErpMdpRolesController {
  constructor(private readonly service: ErpMdpRoleMenusService) {}

  @Get()
  @ApiOperation({ summary: 'List ERP roles (read-only) for access mapping' })
  list() {
    return this.service.listRoles();
  }
}
