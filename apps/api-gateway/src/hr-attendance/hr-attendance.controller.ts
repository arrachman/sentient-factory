import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Put,
  Post,
  Query,
  Res,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ClockAttendanceDto } from './dto/clock-attendance.dto';
import { CreateHrWorksiteDto } from './dto/create-hr-worksite.dto';
import { CreateFaceEnrollmentDto } from './dto/create-face-enrollment.dto';
import { IdentifyFaceDto } from './dto/identify-face.dto';
import { QueryHrAttendanceHistoryDto } from './dto/query-hr-attendance-history.dto';
import { QueryHrAttendanceReviewDto } from './dto/query-hr-attendance-review.dto';
import { QueryHrWorksiteDto } from './dto/query-hr-worksite.dto';
import { ReportAttendanceFailureDto } from './dto/report-attendance-failure.dto';
import { UpdateUserWorksitesDto } from './dto/update-user-worksites.dto';
import { UpdateHrAttendanceReviewDto } from './dto/update-hr-attendance-review.dto';
import { UpdateHrSettingDto } from './dto/update-hr-setting.dto';
import { UpdateHrWorksiteDto } from './dto/update-hr-worksite.dto';
import { HrAttendanceService } from './hr-attendance.service';

@ApiTags('HR Attendance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('hr')
export class HrAttendanceController {
  constructor(private readonly service: HrAttendanceService) {}

  @Get('attendance/me')
  @ApiOperation({ summary: 'Get current user attendance summary' })
  @ApiResponse({ status: 200, description: 'Current user attendance summary' })
  getAttendanceMe(@Request() req: any) {
    return this.service.getAttendanceMe(req.user);
  }

  @Get('attendance/history')
  @ApiOperation({ summary: 'Get attendance history' })
  @ApiResponse({ status: 200, description: 'Attendance history' })
  getAttendanceHistory(@Request() req: any, @Query() query: QueryHrAttendanceHistoryDto) {
    return this.service.getAttendanceHistory(req.user, query);
  }

  @Get('attendance/dashboard')
  @ApiOperation({ summary: 'Get attendance dashboard payload' })
  @ApiResponse({ status: 200, description: 'Attendance dashboard payload' })
  getAttendanceDashboard(@Request() req: any) {
    return this.service.getAttendanceDashboard(req.user);
  }

  @Get('users')
  @ApiOperation({ summary: 'Get HR employee list for attendance operations' })
  @ApiResponse({ status: 200, description: 'HR employee list' })
  getHrAttendanceUsers(@Request() req: any) {
    return this.service.getAttendanceUsers(req.user);
  }

  @Get('users/:appUserId/worksites')
  @ApiOperation({ summary: 'Get user worksite assignments' })
  @ApiResponse({ status: 200, description: 'User worksite assignments' })
  getUserWorksites(@Request() req: any, @Param('appUserId', ParseIntPipe) appUserId: number) {
    return this.service.getUserWorksites(req.user, appUserId);
  }

  @Put('users/:appUserId/worksites')
  @ApiOperation({ summary: 'Update user worksite assignments' })
  @ApiResponse({ status: 200, description: 'User worksite assignments updated' })
  updateUserWorksites(
    @Request() req: any,
    @Param('appUserId', ParseIntPipe) appUserId: number,
    @Body() dto: UpdateUserWorksitesDto,
  ) {
    return this.service.updateUserWorksites(req.user, appUserId, dto);
  }

  @Get('face-enrollments')
  @ApiOperation({ summary: 'Get HR face enrollment management list' })
  @ApiResponse({ status: 200, description: 'HR face enrollment management list' })
  getFaceEnrollments(@Request() req: any) {
    return this.service.getFaceEnrollmentManagement(req.user);
  }

  @Get('attendance-reviews')
  @ApiOperation({ summary: 'Get attendance review queue' })
  @ApiResponse({ status: 200, description: 'Attendance review queue' })
  getAttendanceReviews(@Request() req: any, @Query() query: QueryHrAttendanceReviewDto) {
    return this.service.getAttendanceReviews(req.user, query);
  }

  @Get('attendance-reviews/:eventId')
  @ApiOperation({ summary: 'Get attendance review detail' })
  @ApiResponse({ status: 200, description: 'Attendance review detail' })
  getAttendanceReviewDetail(@Request() req: any, @Param('eventId', ParseIntPipe) eventId: number) {
    return this.service.getAttendanceReviewDetail(req.user, eventId);
  }

  @Post('attendance-reviews/:eventId/approve')
  @ApiOperation({ summary: 'Approve attendance review item' })
  @ApiResponse({ status: 200, description: 'Attendance review approved' })
  approveAttendanceReview(
    @Request() req: any,
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() dto: UpdateHrAttendanceReviewDto,
  ) {
    return this.service.updateAttendanceReview(req.user, eventId, 'approved', dto.note);
  }

  @Post('attendance-reviews/:eventId/reject')
  @ApiOperation({ summary: 'Reject attendance review item' })
  @ApiResponse({ status: 200, description: 'Attendance review rejected' })
  rejectAttendanceReview(
    @Request() req: any,
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() dto: UpdateHrAttendanceReviewDto,
  ) {
    return this.service.updateAttendanceReview(req.user, eventId, 'rejected', dto.note);
  }

  @Post('attendance-reviews/:eventId/request-clarification')
  @ApiOperation({ summary: 'Request clarification for attendance review item' })
  @ApiResponse({ status: 200, description: 'Attendance review clarification requested' })
  requestAttendanceReviewClarification(
    @Request() req: any,
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() dto: UpdateHrAttendanceReviewDto,
  ) {
    return this.service.updateAttendanceReview(req.user, eventId, 'needs_clarification', dto.note);
  }

  @Post('attendance-reviews/:eventId/reopen')
  @ApiOperation({ summary: 'Reopen attendance review item back to pending' })
  @ApiResponse({ status: 200, description: 'Attendance review reopened' })
  reopenAttendanceReview(
    @Request() req: any,
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() dto: UpdateHrAttendanceReviewDto,
  ) {
    return this.service.updateAttendanceReview(req.user, eventId, 'pending', dto.note);
  }

  @Post('face-enrollment')
  @ApiOperation({ summary: 'Create or replace active face enrollment for current user' })
  @ApiResponse({ status: 201, description: 'Face enrollment saved' })
  createFaceEnrollment(@Body() dto: CreateFaceEnrollmentDto, @Request() req: any) {
    return this.service.createFaceEnrollment(req.user, dto);
  }

  @Post('attendance/face-identify')
  @ApiOperation({ summary: 'Identify the most likely enrolled face for current capture' })
  @ApiResponse({ status: 200, description: 'Face identification result' })
  identifyFace(@Body() dto: IdentifyFaceDto, @Request() req: any) {
    return this.service.identifyFace(req.user, dto);
  }

  @Post('attendance/clock-in')
  @ApiOperation({ summary: 'Clock in current user' })
  @ApiResponse({ status: 201, description: 'Clock in processed' })
  clockIn(@Body() dto: ClockAttendanceDto, @Request() req: any) {
    return this.service.clockIn(req.user, dto);
  }

  @Post('attendance/clock-out')
  @ApiOperation({ summary: 'Clock out current user' })
  @ApiResponse({ status: 200, description: 'Clock out processed' })
  clockOut(@Body() dto: ClockAttendanceDto, @Request() req: any) {
    return this.service.clockOut(req.user, dto);
  }

  @Post('attendance/report-failure')
  @ApiOperation({ summary: 'Report a client-side attendance failure attempt' })
  @ApiResponse({ status: 201, description: 'Attendance failure attempt recorded' })
  reportAttendanceFailure(@Body() dto: ReportAttendanceFailureDto, @Request() req: any) {
    return this.service.reportAttendanceFailure(req.user, dto);
  }

  @Get('events/:eventId/snapshot')
  @ApiOperation({ summary: 'Get attendance event snapshot image' })
  @ApiResponse({ status: 200, description: 'Attendance event snapshot file' })
  async getAttendanceEventSnapshot(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Request() req: any,
    @Res() res: Response,
  ) {
    const snapshot = await this.service.getAttendanceEventSnapshot(req.user, eventId);
    res.setHeader('Content-Type', snapshot.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${snapshot.fileName}"`);
    res.send(snapshot.buffer);
  }

  @Get('face-enrollments/:enrollmentId/snapshot')
  @ApiOperation({ summary: 'Get face enrollment snapshot image' })
  @ApiResponse({ status: 200, description: 'Face enrollment snapshot file' })
  async getFaceEnrollmentSnapshot(
    @Param('enrollmentId', ParseIntPipe) enrollmentId: number,
    @Request() req: any,
    @Res() res: Response,
  ) {
    const snapshot = await this.service.getFaceEnrollmentSnapshot(req.user, enrollmentId);
    res.setHeader('Content-Type', snapshot.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${snapshot.fileName}"`);
    res.send(snapshot.buffer);
  }

  @Get('worksites')
  @ApiOperation({ summary: 'Get HR worksites' })
  @ApiResponse({ status: 200, description: 'List of worksites' })
  getWorksites(@Query() query: QueryHrWorksiteDto) {
    return this.service.getWorksites(query);
  }

  @Get('settings')
  @ApiOperation({ summary: 'Get HR settings' })
  @ApiResponse({ status: 200, description: 'HR settings payload' })
  getSettings(@Request() req: any) {
    return this.service.getSettings(req.user);
  }

  @Patch('settings/:settingKey')
  @ApiOperation({ summary: 'Update HR setting' })
  @ApiResponse({ status: 200, description: 'HR setting updated' })
  updateSetting(
    @Param('settingKey') settingKey: string,
    @Body() dto: UpdateHrSettingDto,
    @Request() req: any,
  ) {
    return this.service.updateSetting(req.user, settingKey, dto.value);
  }

  @Post('worksites')
  @ApiOperation({ summary: 'Create HR worksite' })
  @ApiResponse({ status: 201, description: 'Worksite created' })
  createWorksite(@Body() dto: CreateHrWorksiteDto, @Request() req: any) {
    return this.service.createWorksite(dto, req.user);
  }

  @Patch('worksites/:id')
  @ApiOperation({ summary: 'Update HR worksite' })
  @ApiResponse({ status: 200, description: 'Worksite updated' })
  updateWorksite(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateHrWorksiteDto,
    @Request() req: any,
  ) {
    return this.service.updateWorksite(id, dto, req.user);
  }

  @Delete('worksites/:id')
  @ApiOperation({ summary: 'Delete HR worksite' })
  @ApiResponse({ status: 200, description: 'Worksite deleted' })
  removeWorksite(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.service.removeWorksite(id, req.user);
  }
}
