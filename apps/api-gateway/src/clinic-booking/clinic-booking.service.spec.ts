import { BadRequestException, ConflictException } from '@nestjs/common';
import { BookingCrudService } from './booking-crud.service';
import { BookingEventsService } from './booking-events.service';
import { BookingNotesService } from './booking-notes.service';
import { BookingNotificationService } from './booking-notification.service';
import { BookingPackageService } from './booking-package.service';
import { BookingTransitionsService } from './booking-transitions.service';
import { BookingValidationService } from './booking-validation.service';
import { ClinicBookingService } from './clinic-booking.service';

/**
 * Sample Jest spec untuk core booking logic.
 * Pattern reference untuk slice berikutnya.
 *
 * Mocks PrismaService manually (no NestJS testing module to keep simple).
 * For full integration tests, pakai @nestjs/testing + supertest.
 */

// Reserved for future spec utilities — kept inert untuk dipakai saat ekspand spec coverage.
type _Mock<T extends (...args: any) => any> = jest.Mock<ReturnType<T>, Parameters<T>>;
void (null as unknown as _Mock<() => void>);

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
  } as any;
}

describe('ClinicBookingService — state machine + conflict detection', () => {
  let prisma: ReturnType<typeof makePrismaMock>;
  let service: ClinicBookingService;

  beforeEach(() => {
    prisma = makePrismaMock();
    // Real BookingValidationService — exercise actual validation logic against
    // mocked Prisma. Untuk notification & notes pakai stub karena tidak
    // relevant ke state-machine / conflict tests.
    const validation = new BookingValidationService(prisma);
    const notifier = {
      notify: jest.fn().mockResolvedValue(undefined),
      sendManualReminder: jest.fn().mockResolvedValue({ logId: 1, status: 'queued' }),
    } as unknown as BookingNotificationService;
    const notes = {
      addNote: jest.fn(),
      listNotes: jest.fn(),
    } as unknown as BookingNotesService;
    const packageService = {
      create: jest.fn(),
    } as unknown as BookingPackageService;
    const events = {
      emit: jest.fn(),
      asObservable: jest.fn(),
    } as unknown as BookingEventsService;
    const crudService = new BookingCrudService(prisma, validation, notifier, events);
    const transitionsService = new BookingTransitionsService(prisma, events, notifier, validation, crudService);
    service = new ClinicBookingService(
      crudService,
      transitionsService,
      notifier,
      notes,
      packageService,
    );
  });

  describe('create', () => {
    it('rejects when scheduledStart >= scheduledEnd', async () => {
      await expect(
        service.create({
          clientId: 1,
          serviceId: 1,
          psikologUserId: 1,
          roomId: 1,
          scheduledStart: '2026-05-15T10:00:00Z',
          scheduledEnd: '2026-05-15T09:00:00Z', // before start
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('rejects when client/service/psikolog/room not found', async () => {
      prisma.clinicClient.findFirst.mockResolvedValue(null);
      prisma.clinicService.findFirst.mockResolvedValue({ id: 1 });
      prisma.user.findFirst.mockResolvedValue({ id: 1 });
      prisma.clinicRoom.findFirst.mockResolvedValue({ id: 1 });

      await expect(
        service.create({
          clientId: 999,
          serviceId: 1,
          psikologUserId: 1,
          roomId: 1,
          scheduledStart: '2026-05-15T10:00:00Z',
          scheduledEnd: '2026-05-15T11:00:00Z',
        }),
      ).rejects.toThrow(/Client.*not found/);
    });

    it('rejects when psikolog has overlapping booking', async () => {
      prisma.clinicClient.findFirst.mockResolvedValue({ id: 1 });
      prisma.clinicService.findFirst.mockResolvedValue({ id: 1 });
      prisma.user.findFirst.mockResolvedValue({ id: 1 });
      prisma.clinicRoom.findFirst.mockResolvedValue({ id: 1 });
      prisma.clinicSettings.findFirst.mockResolvedValue({ bufferMinutes: 15 });

      // Psikolog conflict found
      prisma.clinicBooking.findFirst.mockResolvedValueOnce({
        id: 99,
        scheduledStart: new Date('2026-05-15T10:30:00Z'),
        scheduledEnd: new Date('2026-05-15T11:30:00Z'),
      });

      await expect(
        service.create({
          clientId: 1,
          serviceId: 1,
          psikologUserId: 1,
          roomId: 1,
          scheduledStart: '2026-05-15T10:00:00Z',
          scheduledEnd: '2026-05-15T11:00:00Z',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('transition state machine', () => {
    function setupBooking(currentStatus: string) {
      prisma.clinicBooking.findFirst.mockResolvedValue({
        id: 1,
        status: currentStatus,
        scheduledStart: new Date(),
        scheduledEnd: new Date(),
        rescheduleHistory: [],
      });
      prisma.clinicBooking.update.mockImplementation((args: any) =>
        Promise.resolve({ id: 1, ...args.data }),
      );
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
      await expect(service.transition(1, 'cancelled')).rejects.toThrow(BadRequestException);
    });

    it('rejects cancelled → anything (terminal state)', async () => {
      setupBooking('cancelled');
      await expect(service.transition(1, 'in_progress')).rejects.toThrow(BadRequestException);
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
