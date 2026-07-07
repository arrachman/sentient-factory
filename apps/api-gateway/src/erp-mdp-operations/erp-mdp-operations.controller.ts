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
import { CreateOperationDto } from './dto/create-operation.dto';
import { QueryOperationDto } from './dto/query-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';
import { ErpMdpOperationsService } from './erp-mdp-operations.service';

@ApiTags('MDP Operations')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('mdp/operations')
export class ErpMdpOperationsController {
  constructor(private readonly service: ErpMdpOperationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create operation (routing step)' })
  create(@Body() dto: CreateOperationDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List operations' })
  findAll(@Query() query: QueryOperationDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one operation' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(BigInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update operation' })
  update(@Param('id') id: string, @Body() dto: UpdateOperationDto, @Request() req: any) {
    return this.service.update(BigInt(id), dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete operation (soft delete)' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(BigInt(id), req.user?.id);
  }
}
