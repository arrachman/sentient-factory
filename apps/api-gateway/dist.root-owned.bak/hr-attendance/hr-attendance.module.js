"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HrAttendanceModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const hr_attendance_controller_1 = require("./hr-attendance.controller");
const hr_attendance_service_1 = require("./hr-attendance.service");
const attendance_clock_service_1 = require("./attendance-clock.service");
const attendance_failure_service_1 = require("./attendance-failure.service");
const attendance_query_service_1 = require("./attendance-query.service");
const attendance_dashboard_service_1 = require("./attendance-dashboard.service");
const attendance_review_service_1 = require("./attendance-review.service");
const attendance_settings_service_1 = require("./attendance-settings.service");
const face_enrollment_service_1 = require("./face-enrollment.service");
const face_identification_service_1 = require("./face-identification.service");
const user_worksite_service_1 = require("./user-worksite.service");
const worksite_service_1 = require("./worksite.service");
let HrAttendanceModule = class HrAttendanceModule {
};
exports.HrAttendanceModule = HrAttendanceModule;
exports.HrAttendanceModule = HrAttendanceModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [hr_attendance_controller_1.HrAttendanceController],
        providers: [
            hr_attendance_service_1.HrAttendanceService,
            attendance_clock_service_1.AttendanceClockService,
            attendance_failure_service_1.AttendanceFailureService,
            attendance_query_service_1.AttendanceQueryService,
            attendance_dashboard_service_1.AttendanceDashboardService,
            attendance_review_service_1.AttendanceReviewService,
            attendance_settings_service_1.AttendanceSettingsService,
            face_enrollment_service_1.FaceEnrollmentService,
            face_identification_service_1.FaceIdentificationService,
            user_worksite_service_1.UserWorksiteService,
            worksite_service_1.WorksiteService,
        ],
    })
], HrAttendanceModule);
//# sourceMappingURL=hr-attendance.module.js.map