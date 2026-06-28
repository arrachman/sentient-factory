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
import { HrLeaveService } from './hr-leave.service';
import {
  CreateLeaveTypeDto,
  UpdateLeaveTypeDto,
  CreateLeaveRequestDto,
  ReviewLeaveRequestDto,
  QueryLeaveRequestDto,
} from './dto/leave.dto';

@ApiTags('HR Leave')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('hr/leave')
export class HrLeaveController {
  constructor(private readonly service: HrLeaveService) {}

  @Get('types')
  @ApiOperation({ summary: 'List leave types' })
  listTypes() {
    return this.service.listLeaveTypes();
  }

  @Post('types')
  @ApiOperation({ summary: 'Create leave type (privileged)' })
  createType(@Request() req: any, @Body() dto: CreateLeaveTypeDto) {
    return this.service.createLeaveType(req.user, dto);
  }

  @Patch('types/:id')
  @ApiOperation({ summary: 'Update leave type (privileged)' })
  updateType(@Request() req: any, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLeaveTypeDto) {
    return this.service.updateLeaveType(req.user, id, dto);
  }

  @Delete('types/:id')
  @ApiOperation({ summary: 'Delete leave type (privileged, soft)' })
  deleteType(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.service.deleteLeaveType(req.user, id);
  }

  @Get('requests')
  @ApiOperation({ summary: 'List leave requests (self or all if privileged)' })
  listRequests(@Request() req: any, @Query() query: QueryLeaveRequestDto) {
    return this.service.listLeaveRequests(req.user, query);
  }

  @Post('requests')
  @ApiOperation({ summary: 'Create a leave request for the current user' })
  createRequest(@Request() req: any, @Body() dto: CreateLeaveRequestDto) {
    return this.service.createLeaveRequest(req.user, dto);
  }

  @Post('requests/:id/approve')
  @ApiOperation({ summary: 'Approve a leave request (privileged)' })
  approve(@Request() req: any, @Param('id', ParseIntPipe) id: number, @Body() dto: ReviewLeaveRequestDto) {
    return this.service.reviewLeaveRequest(req.user, id, 'approved', dto.note);
  }

  @Post('requests/:id/reject')
  @ApiOperation({ summary: 'Reject a leave request (privileged)' })
  reject(@Request() req: any, @Param('id', ParseIntPipe) id: number, @Body() dto: ReviewLeaveRequestDto) {
    return this.service.reviewLeaveRequest(req.user, id, 'rejected', dto.note);
  }

  @Post('requests/:id/cancel')
  @ApiOperation({ summary: 'Cancel a leave request (owner or privileged)' })
  cancel(@Request() req: any, @Param('id', ParseIntPipe) id: number, @Body() dto: ReviewLeaveRequestDto) {
    return this.service.reviewLeaveRequest(req.user, id, 'cancelled', dto.note);
  }
}
