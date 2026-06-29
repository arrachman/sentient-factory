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
import { CreateLmsEnrollmentDto } from './dto/create-enrollment.dto';
import { QueryLmsEnrollmentDto } from './dto/query-enrollment.dto';
import { UpdateLmsEnrollmentDto } from './dto/update-enrollment.dto';
import { ErpMdpLmsEnrollmentsService } from './erp-mdp-lms-enrollments.service';

@ApiTags('MDP LMS Enrollments')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('mdp/lms/enrollments')
export class ErpMdpLmsEnrollmentsController {
  constructor(private readonly service: ErpMdpLmsEnrollmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create enrollment' })
  create(@Body() dto: CreateLmsEnrollmentDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List enrollments' })
  findAll(@Query() query: QueryLmsEnrollmentDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one enrollment' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(BigInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update enrollment' })
  update(@Param('id') id: string, @Body() dto: UpdateLmsEnrollmentDto, @Request() req: any) {
    return this.service.update(BigInt(id), dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete enrollment (soft delete)' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(BigInt(id), req.user?.id);
  }
}
