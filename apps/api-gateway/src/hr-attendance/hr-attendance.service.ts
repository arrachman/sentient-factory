import { Injectable } from '@nestjs/common';
import { ClockAttendanceDto } from './dto/clock-attendance.dto';
import { CreateHrWorksiteDto } from './dto/create-hr-worksite.dto';
import { CreateFaceEnrollmentDto } from './dto/create-face-enrollment.dto';
import { IdentifyFaceDto } from './dto/identify-face.dto';
import { QueryHrAttendanceHistoryDto } from './dto/query-hr-attendance-history.dto';
import { QueryHrAttendanceReviewDto } from './dto/query-hr-attendance-review.dto';
import { QueryHrWorksiteDto } from './dto/query-hr-worksite.dto';
import { ReportAttendanceFailureDto } from './dto/report-attendance-failure.dto';
import { UpdateHrWorksiteDto } from './dto/update-hr-worksite.dto';
import { AttendanceClockService } from './attendance-clock.service';
import { AttendanceFailureService } from './attendance-failure.service';
import { AttendanceQueryService } from './attendance-query.service';
import { AttendanceReviewService } from './attendance-review.service';
import { AttendanceSettingsService } from './attendance-settings.service';
import { FaceEnrollmentService } from './face-enrollment.service';
import { WorksiteService } from './worksite.service';

type AuthUser = {
  id: number;
  roles?: string[];
};

@Injectable()
export class HrAttendanceService {
  constructor(
    private clockService: AttendanceClockService,
    private failureService: AttendanceFailureService,
    private queryService: AttendanceQueryService,
    private reviewService: AttendanceReviewService,
    private settingsService: AttendanceSettingsService,
    private faceEnrollmentService: FaceEnrollmentService,
    private worksiteService: WorksiteService,
  ) {}

  // --- Worksite ---

  getAttendanceUsers(authUser: AuthUser) {
    return this.worksiteService.getAttendanceUsers(authUser);
  }

  getUserWorksites(authUser: AuthUser, targetAppUserId: number) {
    return this.worksiteService.getUserWorksites(authUser, targetAppUserId);
  }

  updateUserWorksites(authUser: AuthUser, targetAppUserId: number, dto: { worksiteIds: number[] }) {
    return this.worksiteService.updateUserWorksites(authUser, targetAppUserId, dto);
  }

  getWorksites(query: QueryHrWorksiteDto) {
    return this.worksiteService.getWorksites(query);
  }

  createWorksite(dto: CreateHrWorksiteDto, authUser: AuthUser) {
    return this.worksiteService.createWorksite(dto, authUser);
  }

  updateWorksite(id: number, dto: UpdateHrWorksiteDto, authUser: AuthUser) {
    return this.worksiteService.updateWorksite(id, dto, authUser);
  }

  removeWorksite(id: number, authUser: AuthUser) {
    return this.worksiteService.removeWorksite(id, authUser);
  }

  // --- Face Enrollment ---

  createFaceEnrollment(authUser: AuthUser, dto: CreateFaceEnrollmentDto) {
    return this.faceEnrollmentService.createFaceEnrollment(authUser, dto);
  }

  getFaceEnrollmentManagement(authUser: AuthUser) {
    return this.faceEnrollmentService.getFaceEnrollmentManagement(authUser);
  }

  identifyFace(authUser: AuthUser, dto: IdentifyFaceDto) {
    return this.faceEnrollmentService.identifyFace(authUser, dto);
  }

  getFaceEnrollmentSnapshot(authUser: AuthUser, enrollmentId: number) {
    return this.faceEnrollmentService.getFaceEnrollmentSnapshot(authUser, enrollmentId);
  }

  // --- Clock ---

  clockIn(authUser: AuthUser, dto: ClockAttendanceDto) {
    return this.clockService.clockIn(authUser, dto);
  }

  clockOut(authUser: AuthUser, dto: ClockAttendanceDto) {
    return this.clockService.clockOut(authUser, dto);
  }

  reportAttendanceFailure(authUser: AuthUser, dto: ReportAttendanceFailureDto) {
    return this.failureService.reportAttendanceFailure(authUser, dto);
  }

  // --- Query ---

  getAttendanceMe(authUser: AuthUser) {
    return this.queryService.getAttendanceMe(authUser);
  }

  getAttendanceHistory(authUser: AuthUser, query: QueryHrAttendanceHistoryDto) {
    return this.queryService.getAttendanceHistory(authUser, query);
  }

  getAttendanceDashboard(authUser: AuthUser) {
    return this.queryService.getAttendanceDashboard(authUser);
  }

  getAttendanceEventSnapshot(authUser: AuthUser, eventId: number) {
    return this.queryService.getAttendanceEventSnapshot(authUser, eventId);
  }

  // --- Review ---

  getAttendanceReviews(authUser: AuthUser, query: QueryHrAttendanceReviewDto) {
    return this.reviewService.getAttendanceReviews(authUser, query);
  }

  getAttendanceReviewDetail(authUser: AuthUser, eventId: number) {
    return this.reviewService.getAttendanceReviewDetail(authUser, eventId);
  }

  updateAttendanceReview(
    authUser: AuthUser,
    eventId: number,
    nextStatus: 'pending' | 'approved' | 'rejected' | 'needs_clarification',
    note?: string,
  ) {
    return this.reviewService.updateAttendanceReview(authUser, eventId, nextStatus, note);
  }

  // --- Settings ---

  getSettings(authUser: AuthUser) {
    return this.settingsService.getSettings(authUser);
  }

  updateSetting(authUser: AuthUser, settingKey: string, value: string) {
    return this.settingsService.updateSetting(authUser, settingKey, value);
  }
}
