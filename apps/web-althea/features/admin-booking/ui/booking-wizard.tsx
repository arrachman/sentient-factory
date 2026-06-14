'use client';

/**
 * Booking Wizard — single-page form.
 *
 * Sebelumnya 4-step wizard dengan Next/Prev — admin harus klik 3-4×
 * untuk submit 1 booking. Now: semua section visible in one scroll,
 * fill top-to-bottom, klik "Buat Booking" sekali.
 *
 * Sections (urut, prereq cascading):
 *   1. Klien (combobox searchable)
 *   2. Layanan (button grid grouped by category) — unlock after klien dipilih
 *   3. Psikolog (card grid) — unlock after layanan dipilih
 *   4. Jadwal & Ruang (date + slot picker + room) — unlock after psikolog dipilih
 *
 * Auto-scroll ke section selanjutnya saat user pick. Sections dengan
 * prereq belum terpenuhi → disabled overlay + hint message.
 */
import { useEffect, useRef } from 'react';
import { Check, X } from 'lucide-react';
import type { Booking } from '../model/types';
import { Step1Client } from './booking-wizard/step1-client';
import { Step2Service } from './booking-wizard/step2-service';
import { Step3Psikolog } from './booking-wizard/step3-psikolog';
import { Step4ScheduleRoom } from './booking-wizard/step4-schedule-room';
import { useWizardState } from './booking-wizard/use-wizard-state';

export function BookingWizard({
  open,
  onClose,
  editingBooking,
}: {
  open: boolean;
  onClose: () => void;
  /**
   * Kalau diisi → wizard masuk mode EDIT (atomic update via POST /booking/:id/edit).
   * Step 1 (Klien) di-lock & dirender sebagai info-banner. Auto-scroll mulai
   * dari Step 2 (Layanan) saat dialog dibuka. Valid untuk booking ber-status
   * `checked_in` (validasi penuh) atau `completed` (recategorisasi historis —
   * jadwal/slot/konflik di-skip backend) — backend enforce.
   */
  editingBooking?: Booking | null;
}) {
  const w = useWizardState({ open, onClose, editingBooking });
  const sec2Ref = useRef<HTMLDivElement>(null);
  const sec3Ref = useRef<HTMLDivElement>(null);
  const sec4Ref = useRef<HTMLDivElement>(null);
  const s = w.state;
  const setS = w.setState;

  const firstSlotIdx = s.sessions[0]?.slotIdx ?? null;
  const isEdit = w.isEditMode;

  // Create mode: cascade saat user pick di section sebelumnya.
  useEffect(() => {
    if (!open || isEdit) return;
    if (s.clientId && !s.serviceId) {
      sec2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (s.serviceId && !s.psikologUserId) {
      sec3Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (s.psikologUserId && firstSlotIdx === null) {
      sec4Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [open, isEdit, s.clientId, s.serviceId, s.psikologUserId, firstSlotIdx]);

  // Edit mode: hanya 1 step interaktif (Layanan). Scroll ke step 2 sekali
  // saat open. Psikolog & jadwal tidak diubah.
  useEffect(() => {
    if (!open || !isEdit) return;
    const t = setTimeout(() => {
      sec2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
    return () => clearTimeout(t);
  }, [open, isEdit]);

  // Daftar service id yang ditangani psikolog booking ini (junction kosong
  // = handle semua → undefined = no filter). Match `userId` (= booking.psikologUserId).
  const editingPsikolog = isEdit && editingBooking
    ? w.psikologList.data?.data.find((p) => p.userId === editingBooking.psikologUserId)
    : undefined;
  const editServiceWhitelist =
    isEdit && editingPsikolog && editingPsikolog.serviceIds && editingPsikolog.serviceIds.length > 0
      ? editingPsikolog.serviceIds
      : undefined;

  if (!open) return null;

  const canSubmit = w.canSubmit;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`card-althea w-full ${w.isMulti ? 'max-w-3xl' : 'max-w-2xl'} max-h-[92vh] overflow-hidden bg-card flex flex-col`}
      >
        <DialogHeader onClose={onClose} editingBooking={editingBooking ?? null} />

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {isEdit && editingBooking ? (
            <>
              <div className="rounded-lg border border-sage-300 bg-sage-50/40 px-4 py-2.5 flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-sage-500 text-white">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[10.5px] uppercase tracking-wider font-semibold text-fg-muted">
                    Klien
                  </div>
                  <div className="text-sm font-semibold text-teal-800 truncate">
                    {editingBooking.client.name}
                  </div>
                </div>
                <span className="caption italic text-fg-muted">terkunci saat ubah</span>
              </div>
              {editingBooking.status === 'completed' && (
                <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  <strong>Recategorisasi historis:</strong> booking ini sudah <strong>Selesai</strong>.
                  Jadwal & durasi historis tidak berubah meskipun layanan baru punya durasi berbeda —
                  hanya kategori layanan & pembayaran yang di-recompute.
                </div>
              )}
            </>
          ) : (
            <Section
              stepNum={1}
              title="Klien"
              filled={!!s.clientId}
              disabled={false}
            >
              <Step1Client
                clientList={w.clientList}
                selectedId={s.clientId}
                onChange={(clientId) => setS({ ...s, clientId })}
              />
            </Section>
          )}

          <Section
            ref={sec2Ref}
            stepNum={isEdit ? 1 : 2}
            title="Layanan"
            filled={!!s.serviceId && (!isEdit || (!!editingBooking && s.serviceId !== editingBooking.serviceId))}
            disabled={!isEdit && !s.clientId}
            disabledHint="Pilih klien dulu."
          >
            <Step2Service
              serviceList={w.serviceList}
              selectedId={s.serviceId}
              selectedService={w.selectedService}
              onChange={(serviceId) => setS({ ...s, serviceId })}
              serviceIdWhitelist={editServiceWhitelist}
            />
            {isEdit && editingBooking && (
              <div className="mt-3 caption text-fg-muted">
                {editServiceWhitelist ? (
                  <>
                    Hanya layanan yang ditangani{' '}
                    <strong>
                      {editingBooking.psikolog.fullName ?? editingBooking.psikolog.email}
                    </strong>{' '}
                    yang ditampilkan.{' '}
                  </>
                ) : null}
                Pilih layanan baru untuk ubah — psikolog & jadwal tidak berubah.
                Pembayaran akan dihitung ulang otomatis.
              </div>
            )}
          </Section>

          {!isEdit && (
            <>
              <Section
                ref={sec3Ref}
                stepNum={3}
                title="Psikolog"
                filled={!!s.psikologUserId}
                disabled={!s.serviceId}
                disabledHint="Pilih layanan dulu."
              >
                <Step3Psikolog
                  psikologList={w.psikologList}
                  filteredItems={w.psikologListFiltered}
                  selectedId={s.psikologUserId}
                  onChange={(psikologUserId) => setS({ ...s, psikologUserId })}
                  serviceFilterActive={!!s.serviceId}
                  totalPsikolog={w.psikologList.data?.data.length ?? 0}
                  selectedServiceName={w.selectedService?.name}
                />
              </Section>

              <Section
                ref={sec4Ref}
                stepNum={4}
                title={w.isMulti ? `Jadwal ${s.sessions.length} Sesi & Ruang` : 'Jadwal & Ruang'}
                filled={w.allSessionsFilled && !!s.roomId}
                disabled={!s.psikologUserId}
                disabledHint="Pilih psikolog dulu."
              >
                <Step4ScheduleRoom
                  state={s}
                  setState={setS}
                  isMulti={w.isMulti}
                  updateSession={w.updateSession}
                  reapplyInterval={w.reapplyInterval}
                  setIntervalDays={w.setIntervalDays}
                  intraConflict={w.intraConflict}
                  slots={w.slots}
                  unavailableSlotIdx={w.unavailableSlotIdx}
                  occupiedRoomIds={w.occupiedRoomIds}
                  psikologClosedToday={w.psikologClosedToday}
                  resolvedAvailability={w.resolvedAvailability}
                  selectedService={w.selectedService}
                  selectedSlot={w.selectedSlot}
                  psikologList={w.psikologList}
                  roomList={w.roomList}
                  psikologDayBookings={w.psikologDayBookings}
                  closedDayOfWeek={w.closedDayOfWeek}
                  holidays={w.holidays}
                  isPsikologAtCapacity={w.isPsikologAtCapacity}
                  psikologBookingsCount={w.psikologBookingsCount}
                  psikologDailyLimit={w.dailyLimit}
                />
              </Section>
            </>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-3">
          <button type="button" onClick={onClose} className="btn btn-ghost btn-sm">
            Batal
          </button>
          <button
            type="button"
            onClick={() => w.submit()}
            disabled={!canSubmit}
            className="btn btn-primary btn-sm disabled:opacity-50"
          >
            {w.submitting
              ? 'Menyimpan...'
              : isEdit
                ? 'Simpan Layanan Baru'
                : w.isMulti
                  ? `Buat ${s.sessions.length} Booking Sekaligus`
                  : 'Buat Booking'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DialogHeader({
  onClose,
  editingBooking,
}: {
  onClose: () => void;
  editingBooking: Booking | null;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border px-6 py-4 flex-shrink-0">
      <div>
        <h2 className="h2">
          {editingBooking ? `Ubah Layanan Booking #${editingBooking.id}` : 'Booking Baru'}
        </h2>
        <p className="caption mt-1">
          {editingBooking
            ? 'Pilih layanan baru untuk booking ini. Psikolog & jadwal tetap.'
            : 'Isi klien, layanan, psikolog, lalu pilih slot.'}
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="btn btn-ghost btn-icon btn-sm"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

const Section = ({
  ref,
  stepNum,
  title,
  filled,
  disabled,
  disabledHint,
  children,
}: {
  ref?: React.Ref<HTMLDivElement>;
  stepNum: number;
  title: string;
  filled: boolean;
  disabled: boolean;
  disabledHint?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      ref={ref}
      className={`rounded-lg border bg-card transition-opacity ${
        disabled ? 'opacity-50 pointer-events-none' : 'opacity-100'
      } ${filled ? 'border-sage-300' : 'border-border'}`}
    >
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
        <span
          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold ${
            filled
              ? 'bg-sage-500 text-white'
              : 'bg-cream-100 text-fg-muted'
          }`}
        >
          {filled ? <Check className="h-3.5 w-3.5" /> : stepNum}
        </span>
        <span className="text-sm font-semibold text-teal-800">{title}</span>
        {disabled && disabledHint ? (
          <span className="ml-auto caption text-fg-muted italic">{disabledHint}</span>
        ) : null}
      </div>
      <div className="px-4 py-3">{children}</div>
    </div>
  );
};
