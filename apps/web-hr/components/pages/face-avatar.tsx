"use client";

import { useState } from "react";
import { UserRound } from "lucide-react";
import { faceEnrollmentSnapshotUrl } from "@/lib/api/face-enrollments";

/**
 * Avatar wajah untuk list pendaftaran wajah.
 * - Belum ada enrollment (activeEnrollmentId kosong) → ikon default (UserRound).
 * - Sudah ada → <img> snapshot; bila gagal dimuat (endpoint 404/file hilang),
 *   fallback ke ikon default agar tidak menampilkan broken-image.
 */
export function FaceAvatar({
  activeEnrollmentId,
  name,
}: {
  activeEnrollmentId?: string | number | null;
  name?: string | null;
}) {
  const [failed, setFailed] = useState(false);
  const id = activeEnrollmentId ? String(activeEnrollmentId) : null;

  if (!id || failed) {
    return (
      <span
        className="flex h-9 w-9 items-center justify-center rounded-full border bg-muted text-muted-foreground"
        aria-label={name ? `Wajah belum terdaftar: ${name}` : "Wajah belum terdaftar"}
      >
        <UserRound className="h-4 w-4" />
      </span>
    );
  }

  return (
    <span className="block h-9 w-9 overflow-hidden rounded-full border bg-muted">
      <img
        src={faceEnrollmentSnapshotUrl(id)}
        alt={name ?? "Foto wajah"}
        className="h-full w-full object-cover"
        onError={() => setFailed(true)}
      />
    </span>
  );
}
