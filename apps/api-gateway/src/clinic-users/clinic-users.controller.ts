import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ClinicUsersService } from './clinic-users.service';
import {
  CreateClinicUserDto,
  QueryClinicUserDto,
  UpdateClinicUserDto,
} from './dto/clinic-users.dto';

@ApiTags('Clinic — Users & Roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clinic/users')
export class ClinicUsersController {
  constructor(private readonly service: ClinicUsersService) {}

  @Post()
  @Roles('clinic-admin')
  @ApiOperation({ summary: 'Create clinic user with roles' })
  create(@Body() dto: CreateClinicUserDto, @Request() req: any) {
    return this.service.create(dto, req.user?.sub ?? req.user?.id);
  }

  @Get()
  @Roles('clinic-admin')
  findAll(@Query() query: QueryClinicUserDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @Roles('clinic-admin')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Roles('clinic-admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateClinicUserDto,
    @Request() req: any,
  ) {
    return this.service.update(id, dto, req.user?.sub ?? req.user?.id);
  }

  @Delete(':id')
  @Roles('clinic-admin')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.service.remove(id, req.user?.sub ?? req.user?.id);
  }
}
