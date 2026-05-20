"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinicBookingModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../prisma/prisma.module");
const clinic_wa_module_1 = require("../clinic-wa/clinic-wa.module");
const idempotency_interceptor_1 = require("../common/interceptors/idempotency.interceptor");
const booking_events_service_1 = require("./booking-events.service");
const booking_notes_service_1 = require("./booking-notes.service");
const booking_notification_service_1 = require("./booking-notification.service");
const booking_package_service_1 = require("./booking-package.service");
const booking_auto_transition_scheduler_1 = require("./booking-auto-transition.scheduler");
const booking_reminder_scheduler_1 = require("./booking-reminder.scheduler");
const booking_stream_controller_1 = require("./booking-stream.controller");
const booking_validation_service_1 = require("./booking-validation.service");
const clinic_booking_controller_1 = require("./clinic-booking.controller");
const clinic_booking_service_1 = require("./clinic-booking.service");
let ClinicBookingModule = class ClinicBookingModule {
};
exports.ClinicBookingModule = ClinicBookingModule;
exports.ClinicBookingModule = ClinicBookingModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, clinic_wa_module_1.ClinicWaModule],
        controllers: [clinic_booking_controller_1.ClinicBookingController, booking_stream_controller_1.BookingStreamController],
        providers: [
            clinic_booking_service_1.ClinicBookingService,
            booking_validation_service_1.BookingValidationService,
            booking_notification_service_1.BookingNotificationService,
            booking_notes_service_1.BookingNotesService,
            booking_package_service_1.BookingPackageService,
            booking_events_service_1.BookingEventsService,
            booking_reminder_scheduler_1.BookingReminderScheduler,
            booking_auto_transition_scheduler_1.BookingAutoTransitionScheduler,
            idempotency_interceptor_1.IdempotencyInterceptor,
        ],
        exports: [clinic_booking_service_1.ClinicBookingService, booking_events_service_1.BookingEventsService],
    })
], ClinicBookingModule);
//# sourceMappingURL=clinic-booking.module.js.map