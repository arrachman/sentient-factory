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
import { CreateLmsCourseDto } from './dto/create-course.dto';
import { QueryLmsCourseDto } from './dto/query-course.dto';
import { UpdateLmsCourseDto } from './dto/update-course.dto';
import { ErpMdpLmsCoursesService } from './erp-mdp-lms-courses.service';

@ApiTags('MDP LMS Courses')
@ApiBearerAuth()
@UseGuards(ErpJwtAuthGuard)
@Controller('mdp/lms/courses')
export class ErpMdpLmsCoursesController {
  constructor(private readonly service: ErpMdpLmsCoursesService) {}

  @Post()
  @ApiOperation({ summary: 'Create course' })
  create(@Body() dto: CreateLmsCourseDto, @Request() req: any) {
    return this.service.create(dto, req.user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List courses' })
  findAll(@Query() query: QueryLmsCourseDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one course' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(BigInt(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update course' })
  update(@Param('id') id: string, @Body() dto: UpdateLmsCourseDto, @Request() req: any) {
    return this.service.update(BigInt(id), dto, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete course (soft delete)' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(BigInt(id), req.user?.id);
  }
}
