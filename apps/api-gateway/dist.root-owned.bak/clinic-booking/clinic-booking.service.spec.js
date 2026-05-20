"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const booking_validation_service_1 = require("./booking-validation.service");
const clinic_booking_service_1 = require("./clinic-booking.service");
void null;
function makePrismaMock() {
    const transaction = jest.fn();
    const clinicSettings = { findFirst: jest.fn() };
    const clinicClient = { findFirst: jest.fn() };
    const clinicService = { findFirst: jest.fn() };
    const clinicRoom = { findFirst: jest.fn() };
    const user = { findFirst: jest.fn() };
    const clinicBooking = {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    };
    return {
        transaction,
        $transaction: transaction,
        clinicSettings,
        clinicClient,
        clinicService,
        clinicRoom,
        user,
        clinicBooking,
    };
}
describe('ClinicBookingService — state machine + conflict detection', () => {
    let prisma;
    let service;
    beforeEach(() => {
        prisma = makePrismaMock();
        const validation = new booking_validation_service_1.BookingValidationService(prisma);
        const notifier = {
            notify: jest.fn().mockResolvedValue(undefined),
            sendManualReminder: jest.fn().mockResolvedValue({ logId: 1, status: 'queued' }),
        };
        const notes = {
            addNote: jest.fn(),
            listNotes: jest.fn(),
        };
        const packageService = {
            create: jest.fn(),
        };
        const eventsMock = {
            emit: jest.fn(),
            asObservable: jest.fn(),
        };
        service = new clinic_booking_service_1.ClinicBookingService(prisma, validation, notifier, notes, packageService, eventsMock);
    });
    describe('create', () => {
        it('rejects when scheduledStart >= scheduledEnd', async () => {
            await expect(service.create({
                clientId: 1,
                serviceId: 1,
                psikologUserId: 1,
                roomId: 1,
                scheduledStart: '2026-05-15T10:00:00Z',
                scheduledEnd: '2026-05-15T09:00:00Z',
            })).rejects.toThrow(common_1.BadRequestException);
        });
        it('rejects when client/service/psikolog/room not found', async () => {
            prisma.clinicClient.findFirst.mockResolvedValue(null);
            prisma.clinicService.findFirst.mockResolvedValue({ id: 1 });
            prisma.user.findFirst.mockResolvedValue({ id: 1 });
            prisma.clinicRoom.findFirst.mockResolvedValue({ id: 1 });
            await expect(service.create({
                clientId: 999,
                serviceId: 1,
                psikologUserId: 1,
                roomId: 1,
                scheduledStart: '2026-05-15T10:00:00Z',
                scheduledEnd: '2026-05-15T11:00:00Z',
            })).rejects.toThrow(/Client.*not found/);
        });
        it('rejects when psikolog has overlapping booking', async () => {
            prisma.clinicClient.findFirst.mockResolvedValue({ id: 1 });
            prisma.clinicService.findFirst.mockResolvedValue({ id: 1 });
            prisma.user.findFirst.mockResolvedValue({ id: 1 });
            prisma.clinicRoom.findFirst.mockResolvedValue({ id: 1 });
            prisma.clinicSettings.findFirst.mockResolvedValue({ bufferMinutes: 15 });
            prisma.clinicBooking.findFirst.mockResolvedValueOnce({
                id: 99,
                scheduledStart: new Date('2026-05-15T10:30:00Z'),
                scheduledEnd: new Date('2026-05-15T11:30:00Z'),
            });
            await expect(service.create({
                clientId: 1,
                serviceId: 1,
                psikologUserId: 1,
                roomId: 1,
                scheduledStart: '2026-05-15T10:00:00Z',
                scheduledEnd: '2026-05-15T11:00:00Z',
            })).rejects.toThrow(common_1.ConflictException);
        });
    });
    describe('transition state machine', () => {
        function setupBooking(currentStatus) {
            prisma.clinicBooking.findFirst.mockResolvedValue({
                id: 1,
                status: currentStatus,
                scheduledStart: new Date(),
                scheduledEnd: new Date(),
                rescheduleHistory: [],
            });
            prisma.clinicBooking.update.mockImplementation((args) => Promise.resolve({ id: 1, ...args.data }));
        }
        it('allows checked_in → in_progress', async () => {
            setupBooking('checked_in');
            const result = await service.transition(1, 'in_progress');
            expect(result.success).toBe(true);
        });
        it('allows in_progress → completed', async () => {
            setupBooking('in_progress');
            const result = await service.transition(1, 'completed');
            expect(result.success).toBe(true);
        });
        it('rejects completed → anything (terminal state)', async () => {
            setupBooking('completed');
            await expect(service.transition(1, 'cancelled')).rejects.toThrow(common_1.BadRequestException);
        });
        it('rejects cancelled → anything (terminal state)', async () => {
            setupBooking('cancelled');
            await expect(service.transition(1, 'in_progress')).rejects.toThrow(common_1.BadRequestException);
        });
        it('allows cancellation from active states', async () => {
            for (const state of ['checked_in', 'in_progress']) {
                setupBooking(state);
                const result = await service.transition(1, 'cancelled');
                expect(result.success).toBe(true);
            }
        });
    });
});
//# sourceMappingURL=clinic-booking.service.spec.js.map