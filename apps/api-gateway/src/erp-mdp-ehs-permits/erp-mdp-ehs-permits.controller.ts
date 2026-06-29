import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ErpJwtAuthGuard } from '../erp-auth/guards/erp-jwt-auth.guard';
import { CreateEhsPermitDto } from './dto/create-permit.dto';
import { QueryEhsPermitDto } from './dto/query-permit.dto';
import { UpdateEhsPermitDto } from './dto/update-permit.dto';
import { ErpMdpEhsPermitsService } from './erp-mdp-ehs-permits.service';

@ApiTags('MDP IMS Permits')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('mdp/ehs/permits')
export class ErpMdpEhsPermitsController {
  constructor(private readonly service: ErpMdpEhsPermitsService) {}

  @Post()
  @ApiOperation({ summary: 'Create permit' })
  create(@Body() dto: CreateEhsPermitDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List permits' })
  findAll(@Query() query: QueryEhsPermitDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one permit' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(BigInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update permit' })
  update(@Param('id') id: string, @Body() dto: UpdateEhsPermitDto, @Request() req: any) {
    return this.service.update(BigInt(id), dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete permit (soft delete)' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(BigInt(id), req.user?.id);
  }
}
