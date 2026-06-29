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
import { CreateDmsAcknowledgementDto } from './dto/create-acknowledgement.dto';
import { QueryDmsAcknowledgementDto } from './dto/query-acknowledgement.dto';
import { UpdateDmsAcknowledgementDto } from './dto/update-acknowledgement.dto';
import { ErpMdpDmsAcknowledgementsService } from './erp-mdp-dms-acknowledgements.service';

@ApiTags('MDP DMS Acknowledgements')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('mdp/dms/acknowledgements')
export class ErpMdpDmsAcknowledgementsController {
  constructor(private readonly service: ErpMdpDmsAcknowledgementsService) {}

  @Post()
  @ApiOperation({ summary: 'Create acknowledgement' })
  create(@Body() dto: CreateDmsAcknowledgementDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List acknowledgements' })
  findAll(@Query() query: QueryDmsAcknowledgementDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one acknowledgement' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(BigInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update acknowledgement' })
  update(@Param('id') id: string, @Body() dto: UpdateDmsAcknowledgementDto, @Request() req: any) {
    return this.service.update(BigInt(id), dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete acknowledgement (soft delete)' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(BigInt(id), req.user?.id);
  }
}
