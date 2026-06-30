"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Camera, RefreshCw, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCamera } from "@/lib/use-camera";
import { createFaceEnrollment } from "@/lib/api/face-enrollments";
import { hrQueryKeys } from "@/lib/api/hooks";

/**
 * Face enrollment capture. Self-enroll when `targetAppUserId` is omitted, or
 * admin enroll-for-user when provided. Captures a webcam snapshot and POSTs to
 * /api/hr/face-enrollment. On-device embedding/liveness ML can be layered later;
 * the snapshot-based flow already registers a usable reference.
 */
export function FaceEnrollDialog({
  open,
  onOpenChange,
  targetAppUserId,
  subjectName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetAppUserId?: number;
  subjectName?: string;
}) {
  const qc = useQueryClient();
  const {
    videoRef,
    ready,
    error: camError,
    start,
    stop,
    capture,
  } = useCamera();
  const [shot, setShot] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      void start();
    } else {
      stop();
    }
  }, [open, start, stop]);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setShot(null);
    }
    onOpenChange(nextOpen);
  }

  function takeShot() {
    const data = capture();
    if (!data) {
      toast.error("Kamera belum siap.");
      return;
    }
    setShot(data);
  }

  async function save() {
    if (!shot) {
      toast.error("Ambil foto wajah dulu.");
      return;
    }
    setSaving(true);
    try {
      await createFaceEnrollment({
        targetAppUserId,
        snapshotDataUrl: shot,
        faceDetectionMode: "browser",
        metadata: { source: "web-hr", capturedAt: new Date().toISOString() },
      });
      toast.success("Wajah berhasil didaftarkan.");
      await qc.invalidateQueries({ queryKey: hrQueryKeys.faceEnrollments });
      await qc.invalidateQueries({ queryKey: hrQueryKeys.employees });
      onOpenChange(false);
    } catch (e) {
      toast.error((e as Error)?.message ?? "Gagal mendaftarkan wajah.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Daftarkan Wajah{subjectName ? ` — ${subjectName}` : ""}
          </DialogTitle>
        </DialogHeader>
        <DialogBody className="space-y-3">
          <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
            {shot ? (
              <img
                src={shot}
                alt="Pratinjau wajah"
                className="h-full w-full object-cover"
              />
            ) : (
              <video
                ref={videoRef}
                playsInline
                muted
                className="h-full w-full object-cover"
              />
            )}
            {!ready && !shot && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/80">
                {camError ? (
                  <p className="max-w-xs px-4 text-center text-sm">
                    {camError}
                  </p>
                ) : (
                  <>
                    <Camera className="h-6 w-6" />
                    <span className="text-sm">Menyiapkan kamera…</span>
                  </>
                )}
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            Posisikan wajah di tengah, pencahayaan cukup, lalu ambil foto. Foto
            ini jadi referensi verifikasi saat clock-in.
          </p>

          <div className="flex justify-end gap-2">
            {shot ? (
              <Button
                variant="default"
                onClick={() => setShot(null)}
                disabled={saving}
              >
                <RefreshCw className="h-4 w-4" /> Ambil ulang
              </Button>
            ) : (
              <Button variant="default" onClick={takeShot} disabled={!ready}>
                <Camera className="h-4 w-4" /> Ambil Foto
              </Button>
            )}
            <Button variant="primary" onClick={save} disabled={saving || !shot}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}{" "}
              Daftarkan
            </Button>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
