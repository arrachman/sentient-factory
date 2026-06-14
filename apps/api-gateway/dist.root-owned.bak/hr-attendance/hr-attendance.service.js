"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HrAttendanceService = void 0;
const common_1 = require("@nestjs/common");
const attendance_clock_service_1 = require("./attendance-clock.service");
const attendance_failure_service_1 = require("./attendance-failure.service");
const attendance_query_service_1 = require("./attendance-query.service");
const attendance_review_service_1 = require("./attendance-review.service");
const attendance_settings_service_1 = require("./attendance-settings.service");
const face_enrollment_service_1 = require("./face-enrollment.service");
const worksite_service_1 = require("./worksite.service");
let HrAttendanceService = class HrAttendanceService {
    clockService;
    failureService;
    queryService;
    reviewService;
    settingsService;
    faceEnrollmentService;
    worksiteService;
    constructor(clockService, failureService, queryService, reviewService, settingsService, faceEnrollmentService, worksiteService) {
        this.clockService = clockService;
        this.failureService = failureService;
        this.queryService = queryService;
        this.reviewService = reviewService;
        this.settingsService = settingsService;
        this.faceEnrollmentService = faceEnrollmentService;
        this.worksiteService = worksiteService;
    }
    getAttendanceUsers(authUser) {
        return this.worksiteService.getAttendanceUsers(authUser);
    }
    getUserWorksites(authUser, targetAppUserId) {
        return this.worksiteService.getUserWorksites(authUser, targetAppUserId);
    }
    updateUserWorksites(authUser, targetAppUserId, dto) {
        return this.worksiteService.updateUserWorksites(authUser, targetAppUserId, dto);
    }
    getWorksites(query) {
        return this.worksiteService.getWorksites(query);
    }
    createWorksite(dto, authUser) {
        return this.worksiteService.createWorksite(dto, authUser);
    }
    updateWorksite(id, dto, authUser) {
        return this.worksiteService.updateWorksite(id, dto, authUser);
    }
    removeWorksite(id, authUser) {
        return this.worksiteService.removeWorksite(id, authUser);
    }
    createFaceEnrollment(authUser, dto) {
        return this.faceEnrollmentService.createFaceEnrollment(authUser, dto);
    }
    getFaceEnrollmentManagement(authUser) {
        return this.faceEnrollmentService.getFaceEnrollmentManagement(authUser);
    }
    identifyFace(authUser, dto) {
        return this.faceEnrollmentService.identifyFace(authUser, dto);
    }
    getFaceEnrollmentSnapshot(authUser, enrollmentId) {
        return this.faceEnrollmentService.getFaceEnrollmentSnapshot(authUser, enrollmentId);
    }
    clockIn(authUser, dto) {
        return this.clockService.clockIn(authUser, dto);
    }
    clockOut(authUser, dto) {
        return this.clockService.clockOut(authUser, dto);
    }
    reportAttendanceFailure(authUser, dto) {
        return this.failureService.reportAttendanceFailure(authUser, dto);
    }
    getAttendanceMe(authUser) {
        return this.queryService.getAttendanceMe(authUser);
    }
    getAttendanceHistory(authUser, query) {
        return this.queryService.getAttendanceHistory(authUser, query);
    }
    getAttendanceDashboard(authUser) {
        return this.queryService.getAttendanceDashboard(authUser);
    }
    getAttendanceEventSnapshot(authUser, eventId) {
        return this.queryService.getAttendanceEventSnapshot(authUser, eventId);
    }
    getAttendanceReviews(authUser, query) {
        return this.reviewService.getAttendanceReviews(authUser, query);
    }
    getAttendanceReviewDetail(authUser, eventId) {
        return this.reviewService.getAttendanceReviewDetail(authUser, eventId);
    }
    updateAttendanceReview(authUser, eventId, nextStatus, note) {
        return this.reviewService.updateAttendanceReview(authUser, eventId, nextStatus, note);
    }
    getSettings(authUser) {
        return this.settingsService.getSettings(authUser);
    }
    updateSetting(authUser, settingKey, value) {
        return this.settingsService.updateSetting(authUser, settingKey, value);
    }
};
exports.HrAttendanceService = HrAttendanceService;
exports.HrAttendanceService = HrAttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [attendance_clock_service_1.AttendanceClockService,
        attendance_failure_service_1.AttendanceFailureService,
        attendance_query_service_1.AttendanceQueryService,
        attendance_review_service_1.AttendanceReviewService,
        attendance_settings_service_1.AttendanceSettingsService,
        face_enrollment_service_1.FaceEnrollmentService,
        worksite_service_1.WorksiteService])
], HrAttendanceService);
//# sourceMappingURL=hr-attendance.service.js.map