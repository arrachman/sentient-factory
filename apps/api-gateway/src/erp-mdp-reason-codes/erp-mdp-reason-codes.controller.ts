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
import { CreateReasonCodeDto } from './dto/create-reason-code.dto';
import { QueryReasonCodeDto } from './dto/query-reason-code.dto';
import { UpdateReasonCodeDto } from './dto/update-reason-code.dto';
import { ErpMdpReasonCodesService } from './erp-mdp-reason-codes.service';

@ApiTags('MDP Reason Codes')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('mdp/reason-codes')
export class ErpMdpReasonCodesController {
  constructor(private readonly service: ErpMdpReasonCodesService) {}

  @Post()
  @ApiOperation({ summary: 'Create reason code' })
  create(@Body() dto: CreateReasonCodeDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List reason codes' })
  findAll(@Query() query: QueryReasonCodeDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one reason code' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(BigInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update reason code' })
  update(@Param('id') id: string, @Body() dto: UpdateReasonCodeDto, @Request() req: any) {
    return this.service.update(BigInt(id), dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete reason code (soft delete)' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(BigInt(id), req.user?.id);
  }
}
