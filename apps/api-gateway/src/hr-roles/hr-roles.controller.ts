import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { HrRolesService } from './hr-roles.service';
import { CreateRoleDto, UpdateRoleDto, SetUserRolesDto } from './dto/role.dto';

@ApiTags('HR Roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('hr')
export class HrRolesController {
  constructor(private readonly service: HrRolesService) {}

  @Get('roles')
  @ApiOperation({ summary: 'List HR roles' })
  listRoles() {
    return this.service.listRoles();
  }

  @Post('roles')
  @ApiOperation({ summary: 'Create an HR role (privileged)' })
  createRole(@Request() req: any, @Body() dto: CreateRoleDto) {
    return this.service.createRole(req.user, dto);
  }

  @Patch('roles/:id')
  @ApiOperation({ summary: 'Update an HR role (privileged)' })
  updateRole(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.service.updateRole(req.user, id, dto);
  }

  @Delete('roles/:id')
  @ApiOperation({ summary: 'Delete an HR role (privileged, soft; system roles blocked)' })
  deleteRole(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.service.deleteRole(req.user, id);
  }

  @Get('users/:appUserId/roles')
  @ApiOperation({ summary: 'List roles assigned to a user (privileged)' })
  getUserRoles(@Request() req: any, @Param('appUserId', ParseIntPipe) appUserId: number) {
    return this.service.getUserRoles(req.user, appUserId);
  }

  @Put('users/:appUserId/roles')
  @ApiOperation({ summary: 'Replace the roles assigned to a user (privileged)' })
  setUserRoles(
    @Request() req: any,
    @Param('appUserId', ParseIntPipe) appUserId: number,
    @Body() dto: SetUserRolesDto,
  ) {
    return this.service.setUserRoles(req.user, appUserId, dto.roleIds);
  }
}
