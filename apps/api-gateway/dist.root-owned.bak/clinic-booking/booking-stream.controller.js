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
exports.BookingStreamController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const rxjs_1 = require("rxjs");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const skip_audit_decorator_1 = require("../clinic-audit/decorators/skip-audit.decorator");
const booking_events_service_1 = require("./booking-events.service");
let BookingStreamController = class BookingStreamController {
    events;
    constructor(events) {
        this.events = events;
    }
    stream() {
        return this.events.asObservable().pipe((0, rxjs_1.map)((event) => ({ data: event })));
    }
};
exports.BookingStreamController = BookingStreamController;
__decorate([
    (0, common_1.Sse)('booking'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('clinic-admin', 'clinic-resepsionis', 'clinic-psikolog', 'clinic-owner'),
    (0, swagger_1.ApiOperation)({ summary: 'SSE stream untuk realtime booking events' }),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", rxjs_1.Observable)
], BookingStreamController.prototype, "stream", null);
exports.BookingStreamController = BookingStreamController = __decorate([
    (0, swagger_1.ApiTags)('Clinic — Booking Stream (SSE)'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('clinic/stream'),
    (0, skip_audit_decorator_1.SkipAudit)(),
    __metadata("design:paramtypes", [booking_events_service_1.BookingEventsService])
], BookingStreamController);
//# sourceMappingURL=booking-stream.controller.js.map