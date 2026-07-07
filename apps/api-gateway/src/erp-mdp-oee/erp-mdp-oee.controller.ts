import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ErpJwtAuthGuard } from '../erp-auth/guards/erp-jwt-auth.guard';
import { QueryOeeDto } from './dto/query-oee.dto';
import { ErpMdpOeeService } from './erp-mdp-oee.service';

@ApiTags('MDP OEE')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('mdp/oee')
export class ErpMdpOeeController {
  constructor(private readonly service: ErpMdpOeeService) {}

  @Get()
  @ApiOperation({ summary: 'Compute OEE (Availability × Performance × Quality) per work center' })
  compute(@Query() query: QueryOeeDto) {
    return this.service.compute(query);
  }
}
