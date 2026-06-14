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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HrAttendanceController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const clock_attendance_dto_1 = require("./dto/clock-attendance.dto");
const create_hr_worksite_dto_1 = require("./dto/create-hr-worksite.dto");
const create_face_enrollment_dto_1 = require("./dto/create-face-enrollment.dto");
const identify_face_dto_1 = require("./dto/identify-face.dto");
const query_hr_attendance_history_dto_1 = require("./dto/query-hr-attendance-history.dto");
const query_hr_attendance_review_dto_1 = require("./dto/query-hr-attendance-review.dto");
const query_hr_worksite_dto_1 = require("./dto/query-hr-worksite.dto");
const report_attendance_failure_dto_1 = require("./dto/report-attendance-failure.dto");
const update_user_worksites_dto_1 = require("./dto/update-user-worksites.dto");
const update_hr_attendance_review_dto_1 = require("./dto/update-hr-attendance-review.dto");
const update_hr_setting_dto_1 = require("./dto/update-hr-setting.dto");
const update_hr_worksite_dto_1 = require("./dto/update-hr-worksite.dto");
const hr_attendance_service_1 = require("./hr-attendance.service");
let HrAttendanceController = class HrAttendanceController {
    service;
    constructor(service) {
        this.service = service;
    }
    getAttendanceMe(req) {
        return this.service.getAttendanceMe(req.user);
    }
    getAttendanceHistory(req, query) {
        return this.service.getAttendanceHistory(req.user, query);
    }
    getAttendanceDashboard(req) {
        return this.service.getAttendanceDashboard(req.user);
    }
    getHrAttendanceUsers(req) {
        return this.service.getAttendanceUsers(req.user);
    }
    getUserWorksites(req, appUserId) {
        return this.service.getUserWorksites(req.user, appUserId);
    }
    updateUserWorksites(req, appUserId, dto) {
        return this.service.updateUserWorksites(req.user, appUserId, dto);
    }
    getFaceEnrollments(req) {
        return this.service.getFaceEnrollmentManagement(req.user);
    }
    getAttendanceReviews(req, query) {
        return this.service.getAttendanceReviews(req.user, query);
    }
    getAttendanceReviewDetail(req, eventId) {
        return this.service.getAttendanceReviewDetail(req.user, eventId);
    }
    approveAttendanceReview(req, eventId, dto) {
        return this.service.updateAttendanceReview(req.user, eventId, 'approved', dto.note);
    }
    rejectAttendanceReview(req, eventId, dto) {
        return this.service.updateAttendanceReview(req.user, eventId, 'rejected', dto.note);
    }
    requestAttendanceReviewClarification(req, eventId, dto) {
        return this.service.updateAttendanceReview(req.user, eventId, 'needs_clarification', dto.note);
    }
    reopenAttendanceReview(req, eventId, dto) {
        return this.service.updateAttendanceReview(req.user, eventId, 'pending', dto.note);
    }
    createFaceEnrollment(dto, req) {
        return this.service.createFaceEnrollment(req.user, dto);
    }
    identifyFace(dto, req) {
        return this.service.identifyFace(req.user, dto);
    }
    clockIn(dto, req) {
        return this.service.clockIn(req.user, dto);
    }
    clockOut(dto, req) {
        return this.service.clockOut(req.user, dto);
    }
    reportAttendanceFailure(dto, req) {
        return this.service.reportAttendanceFailure(req.user, dto);
    }
    async getAttendanceEventSnapshot(eventId, req, res) {
        const snapshot = await this.service.getAttendanceEventSnapshot(req.user, eventId);
        res.setHeader('Content-Type', snapshot.mimeType);
        res.setHeader('Content-Disposition', `inline; filename="${snapshot.fileName}"`);
        res.send(snapshot.buffer);
    }
    async getFaceEnrollmentSnapshot(enrollmentId, req, res) {
        const snapshot = await this.service.getFaceEnrollmentSnapshot(req.user, enrollmentId);
        res.setHeader('Content-Type', snapshot.mimeType);
        res.setHeader('Content-Disposition', `inline; filename="${snapshot.fileName}"`);
        res.send(snapshot.buffer);
    }
    getWorksites(query) {
        return this.service.getWorksites(query);
    }
    getSettings(req) {
        return this.service.getSettings(req.user);
    }
    updateSetting(settingKey, dto, req) {
        return this.service.updateSetting(req.user, settingKey, dto.value);
    }
    createWorksite(dto, req) {
        return this.service.createWorksite(dto, req.user);
    }
    updateWorksite(id, dto, req) {
        return this.service.updateWorksite(id, dto, req.user);
    }
    removeWorksite(id, req) {
        return this.service.removeWorksite(id, req.user);
    }
};
exports.HrAttendanceController = HrAttendanceController;
__decorate([
    (0, common_1.Get)('attendance/me'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user attendance summary' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Current user attendance summary' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HrAttendanceController.prototype, "getAttendanceMe", null);
__decorate([
    (0, common_1.Get)('attendance/history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get attendance history' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attendance history' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, query_hr_attendance_history_dto_1.QueryHrAttendanceHistoryDto]),
    __metadata("design:returntype", void 0)
], HrAttendanceController.prototype, "getAttendanceHistory", null);
__decorate([
    (0, common_1.Get)('attendance/dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get attendance dashboard payload' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attendance dashboard payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HrAttendanceController.prototype, "getAttendanceDashboard", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'Get HR employee list for attendance operations' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'HR employee list' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HrAttendanceController.prototype, "getHrAttendanceUsers", null);
__decorate([
    (0, common_1.Get)('users/:appUserId/worksites'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user worksite assignments' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User worksite assignments' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('appUserId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], HrAttendanceController.prototype, "getUserWorksites", null);
__decorate([
    (0, common_1.Put)('users/:appUserId/worksites'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user worksite assignments' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User worksite assignments updated' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('appUserId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, update_user_worksites_dto_1.UpdateUserWorksitesDto]),
    __metadata("design:returntype", void 0)
], HrAttendanceController.prototype, "updateUserWorksites", null);
__decorate([
    (0, common_1.Get)('face-enrollments'),
    (0, swagger_1.ApiOperation)({ summary: 'Get HR face enrollment management list' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'HR face enrollment management list' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HrAttendanceController.prototype, "getFaceEnrollments", null);
__decorate([
    (0, common_1.Get)('attendance-reviews'),
    (0, swagger_1.ApiOperation)({ summary: 'Get attendance review queue' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attendance review queue' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, query_hr_attendance_review_dto_1.QueryHrAttendanceReviewDto]),
    __metadata("design:returntype", void 0)
], HrAttendanceController.prototype, "getAttendanceReviews", null);
__decorate([
    (0, common_1.Get)('attendance-reviews/:eventId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get attendance review detail' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attendance review detail' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], HrAttendanceController.prototype, "getAttendanceReviewDetail", null);
__decorate([
    (0, common_1.Post)('attendance-reviews/:eventId/approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve attendance review item' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attendance review approved' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, update_hr_attendance_review_dto_1.UpdateHrAttendanceReviewDto]),
    __metadata("design:returntype", void 0)
], HrAttendanceController.prototype, "approveAttendanceReview", null);
__decorate([
    (0, common_1.Post)('attendance-reviews/:eventId/reject'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject attendance review item' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attendance review rejected' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, update_hr_attendance_review_dto_1.UpdateHrAttendanceReviewDto]),
    __metadata("design:returntype", void 0)
], HrAttendanceController.prototype, "rejectAttendanceReview", null);
__decorate([
    (0, common_1.Post)('attendance-reviews/:eventId/request-clarification'),
    (0, swagger_1.ApiOperation)({ summary: 'Request clarification for attendance review item' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attendance review clarification requested' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, update_hr_attendance_review_dto_1.UpdateHrAttendanceReviewDto]),
    __metadata("design:returntype", void 0)
], HrAttendanceController.prototype, "requestAttendanceReviewClarification", null);
__decorate([
    (0, common_1.Post)('attendance-reviews/:eventId/reopen'),
    (0, swagger_1.ApiOperation)({ summary: 'Reopen attendance review item back to pending' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attendance review reopened' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('eventId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, update_hr_attendance_review_dto_1.UpdateHrAttendanceReviewDto]),
    __metadata("design:returntype", void 0)
], HrAttendanceController.prototype, "reopenAttendanceReview", null);
__decorate([
    (0, common_1.Post)('face-enrollment'),
    (0, swagger_1.ApiOperation)({ summary: 'Create or replace active face enrollment for current user' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Face enrollment saved' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_face_enrollment_dto_1.CreateFaceEnrollmentDto, Object]),
    __metadata("design:returntype", void 0)
], HrAttendanceController.prototype, "createFaceEnrollment", null);
__decorate([
    (0, common_1.Post)('attendance/face-identify'),
    (0, swagger_1.ApiOperation)({ summary: 'Identify the most likely enrolled face for current capture' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Face identification result' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [identify_face_dto_1.IdentifyFaceDto, Object]),
    __metadata("design:returntype", void 0)
], HrAttendanceController.prototype, "identifyFace", null);
__decorate([
    (0, common_1.Post)('attendance/clock-in'),
    (0, swagger_1.ApiOperation)({ summary: 'Clock in current user' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Clock in processed' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [clock_attendance_dto_1.ClockAttendanceDto, Object]),
    __metadata("design:returntype", void 0)
], HrAttendanceController.prototype, "clockIn", null);
__decorate([
    (0, common_1.Post)('attendance/clock-out'),
    (0, swagger_1.ApiOperation)({ summary: 'Clock out current user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Clock out processed' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [clock_attendance_dto_1.ClockAttendanceDto, Object]),
    __metadata("design:returntype", void 0)
], HrAttendanceController.prototype, "clockOut", null);
__decorate([
    (0, common_1.Post)('attendance/report-failure'),
    (0, swagger_1.ApiOperation)({ summary: 'Report a client-side attendance failure attempt' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Attendance failure attempt recorded' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [report_attendance_failure_dto_1.ReportAttendanceFailureDto, Object]),
    __metadata("design:returntype", void 0)
], HrAttendanceController.prototype, "reportAttendanceFailure", null);
__decorate([
    (0, common_1.Get)('events/:eventId/snapshot'),
    (0, swagger_1.ApiOperation)({ summary: 'Get attendance event snapshot image' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Attendance event snapshot file' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('eventId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], HrAttendanceController.prototype, "getAttendanceEventSnapshot", null);
__decorate([
    (0, common_1.Get)('face-enrollments/:enrollmentId/snapshot'),
    (0, swagger_1.ApiOperation)({ summary: 'Get face enrollment snapshot image' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Face enrollment snapshot file' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('enrollmentId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], HrAttendanceController.prototype, "getFaceEnrollmentSnapshot", null);
__decorate([
    (0, common_1.Get)('worksites'),
    (0, swagger_1.ApiOperation)({ summary: 'Get HR worksites' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of worksites' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_hr_worksite_dto_1.QueryHrWorksiteDto]),
    __metadata("design:returntype", void 0)
], HrAttendanceController.prototype, "getWorksites", null);
__decorate([
    (0, common_1.Get)('settings'),
    (0, swagger_1.ApiOperation)({ summary: 'Get HR settings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'HR settings payload' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HrAttendanceController.prototype, "getSettings", null);
__decorate([
    (0, common_1.Patch)('settings/:settingKey'),
    (0, swagger_1.ApiOperation)({ summary: 'Update HR setting' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'HR setting updated' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('settingKey')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_hr_setting_dto_1.UpdateHrSettingDto, Object]),
    __metadata("design:returntype", void 0)
], HrAttendanceController.prototype, "updateSetting", null);
__decorate([
    (0, common_1.Post)('worksites'),
    (0, swagger_1.ApiOperation)({ summary: 'Create HR worksite' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Worksite created' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_hr_worksite_dto_1.CreateHrWorksiteDto, Object]),
    __metadata("design:returntype", void 0)
], HrAttendanceController.prototype, "createWorksite", null);
__decorate([
    (0, common_1.Patch)('worksites/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update HR worksite' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Worksite updated' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_hr_worksite_dto_1.UpdateHrWorksiteDto, Object]),
    __metadata("design:returntype", void 0)
], HrAttendanceController.prototype, "updateWorksite", null);
__decorate([
    (0, common_1.Delete)('worksites/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete HR worksite' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Worksite deleted' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], HrAttendanceController.prototype, "removeWorksite", null);
exports.HrAttendanceController = HrAttendanceController = __decorate([
    (0, swagger_1.ApiTags)('HR Attendance'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('hr'),
    __metadata("design:paramtypes", [hr_attendance_service_1.HrAttendanceService])
], HrAttendanceController);
//# sourceMappingURL=hr-attendance.controller.js.map