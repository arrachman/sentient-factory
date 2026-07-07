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
import { CreateMntFailureCodeDto } from './dto/create-failure-code.dto';
import { QueryMntFailureCodeDto } from './dto/query-failure-code.dto';
import { UpdateMntFailureCodeDto } from './dto/update-failure-code.dto';
import { ErpMdpMntFailureCodesService } from './erp-mdp-mnt-failure-codes.service';

@ApiTags('MDP CMMS Failure Codes')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('mdp/mnt/failure-codes')
export class ErpMdpMntFailureCodesController {
  constructor(private readonly service: ErpMdpMntFailureCodesService) {}

  @Post()
  @ApiOperation({ summary: 'Create failure code' })
  create(@Body() dto: CreateMntFailureCodeDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List failure codes' })
  findAll(@Query() query: QueryMntFailureCodeDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one failure code' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(BigInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update failure code' })
  update(@Param('id') id: string, @Body() dto: UpdateMntFailureCodeDto, @Request() req: any) {
    return this.service.update(BigInt(id), dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete failure code (soft delete)' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(BigInt(id), req.user?.id);
  }
}
