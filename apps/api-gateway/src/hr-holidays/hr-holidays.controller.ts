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
import { HrHolidaysService } from './hr-holidays.service';
import { CreateHolidayDto, UpdateHolidayDto, QueryHolidayDto } from './dto/holiday.dto';

@ApiTags('HR Holidays')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('hr/holidays')
export class HrHolidaysController {
  constructor(private readonly service: HrHolidaysService) {}

  @Get()
  @ApiOperation({ summary: 'List holidays (optionally filtered by year)' })
  list(@Query() query: QueryHolidayDto) {
    return this.service.list(query);
  }

  @Post()
  @ApiOperation({ summary: 'Create a holiday (privileged)' })
  create(@Request() req: any, @Body() dto: CreateHolidayDto) {
    return this.service.create(req.user, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a holiday (privileged)' })
  update(@Request() req: any, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateHolidayDto) {
    return this.service.update(req.user, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a holiday (privileged, soft)' })
  remove(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.service.remove(req.user, id);
  }
}
