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
exports.AttendanceFailureService = void 0;
const common_1 = require("@nestjs/common");
const audit_user_util_1 = require("../common/utils/audit-user.util");
const prisma_service_1 = require("../prisma/prisma.service");
const hr_attendance_helpers_1 = require("./hr-attendance-helpers");
const hr_attendance_snapshot_1 = require("./hr-attendance-snapshot");
const face_enrollment_service_1 = require("./face-enrollment.service");
let AttendanceFailureService = class AttendanceFailureService {
    prisma;
    faceEnrollmentService;
    constructor(prisma, faceEnrollmentService) {
        this.prisma = prisma;
        this.faceEnrollmentService = faceEnrollmentService;
    }
    async reportAttendanceFailure(authUser, dto) {
        const profile = await (0, hr_attendance_helpers_1.requireHrProfileByAppUserId)(this.prisma, authUser.id);
        const actorId = (0, audit_user_util_1.toAuditUserId)(authUser.id);
        const snapshotUrl = dto.snapshotDataUrl
            ? await (0, hr_attendance_snapshot_1.persistSnapshot)('attempt-failures', `user-${authUser.id}`, dto.snapshotDataUrl)
            : null;
        await this.faceEnrollmentService.insertAttendanceEvent(profile.hrUserId, actorId, {
            eventType: dto.eventType,
            result: 'rejected',
            reasonCode: dto.reasonCode,
            latitude: dto.latitude,
            longitude: dto.longitude,
            faceScore: dto.faceScore,
            livenessScore: dto.livenessScore,
            snapshotUrl,
            deviceInfo: dto.deviceInfo,
            metadata: dto.metadata,
        });
        return {
            success: true,
            message: 'Attendance failure attempt recorded.',
            data: {
                eventType: dto.eventType,
                reasonCode: dto.reasonCode,
                snapshotUrl,
            },
        };
    }
};
exports.AttendanceFailureService = AttendanceFailureService;
exports.AttendanceFailureService = AttendanceFailureService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        face_enrollment_service_1.FaceEnrollmentService])
], AttendanceFailureService);
//# sourceMappingURL=attendance-failure.service.js.map