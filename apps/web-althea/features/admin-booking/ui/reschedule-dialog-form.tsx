'use client';

type PsikologItem = { userId: number; fullName?: string | null; email: string };
type RoomItem = { id: number; type: string; name: string };

export function RescheduleDialogPsikologField({
  psikologUserId,
  psikologListFiltered,
  onChangePsikolog,
}: {
  psikologUserId: number | null;
  psikologListFiltered: PsikologItem[];
  onChangePsikolog: (id: number | null) => void;
}) {
  return (
    <div>
      <label className="caption mb-1 block">Psikolog</label>
      <select
        value={psikologUserId ?? ''}
        onChange={(e) => {
          onChangePsikolog(e.target.value ? Number(e.target.value) : null);
        }}
        className="input-althea"
      >
        <option value="">-- pilih psikolog --</option>
        {psikologListFiltered.map((p) => (
          <option key={p.userId} value={p.userId}>
            {p.fullName ?? p.email}
          </option>
        ))}
      </select>
    </div>
  );
}

export function RescheduleDialogAvailabilityWarnings({
  psikologClosedToday,
  psikologFullName,
  resolvedAvailabilitySource,
  overrideReason,
}: {
  psikologClosedToday: boolean;
  psikologFullName?: string | null;
  resolvedAvailabilitySource?: string;
  overrideReason: string | null;
}) {
  if (psikologClosedToday) {
    return (
      <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
        ⚠ <strong>{psikologFullName}</strong> tidak praktik di tanggal ini
        {resolvedAvailabilitySource === 'override'
          ? ' (override khusus tanggal ini'
          : ' (sesuai jadwal mingguan psikolog'}
        {overrideReason ? `: ${overrideReason}` : ''}
        ). Pilih tanggal lain atau ganti psikolog.
      </div>
    );
  }
  if (resolvedAvailabilitySource === 'override') {
    return (
      <div className="rounded-md border border-sage-200 bg-sage-50 px-3 py-2 text-xs text-sage-800">
        ℹ Tanggal ini pakai <strong>jadwal khusus</strong> psikolog (override)
        {overrideReason ? ` — ${overrideReason}` : ''}.
      </div>
    );
  }
  return null;
}

export function RescheduleDialogRoomField({
  roomId,
  roomList,
  selectedSlotIdx,
  occupiedRoomIds,
  onChangeRoom,
}: {
  roomId: number | null;
  roomList: RoomItem[];
  selectedSlotIdx: number | null;
  occupiedRoomIds: Set<number>;
  onChangeRoom: (id: number | null) => void;
}) {
  return (
    <div>
      <label className="caption mb-1 block">Ruang (opsional ganti)</label>
      <select
        value={roomId ?? ''}
        onChange={(e) => onChangeRoom(e.target.value ? Number(e.target.value) : null)}
        className="input-althea"
      >
        <option value="">-- tetap pakai ruang saat ini --</option>
        {roomList.map((r) => {
          const occupied = selectedSlotIdx !== null && occupiedRoomIds.has(r.id);
          return (
            <option key={r.id} value={r.id} disabled={occupied}>
              {occupied ? '🔴 ' : ''}[{r.type}] {r.name}
              {occupied ? ' — terpakai' : ''}
            </option>
          );
        })}
      </select>
      {selectedSlotIdx !== null && occupiedRoomIds.size > 0 && (
        <p className="caption mt-1 text-rose-700">
          ⚠ Ruangan bertanda 🔴 sudah terpakai di slot ini.
        </p>
      )}
    </div>
  );
}

export function RescheduleDialogReasonField({
  reason,
  onChangeReason,
}: {
  reason: string;
  onChangeReason: (v: string) => void;
}) {
  return (
    <div>
      <label className="caption mb-1 block">Alasan reschedule (opsional)</label>
      <textarea
        value={reason}
        onChange={(e) => onChangeReason(e.target.value)}
        rows={2}
        className="input-althea h-auto py-2"
      />
    </div>
  );
}
