'use client';

/**
 * Dialog form untuk Create/Edit worksite + map picker.
 * Dipakai dua kali oleh halaman Lokasi Kerja (mode create vs edit).
 * Mode `edit` menampilkan toggle status aktif tambahan.
 */
import { MapPin, MapPinned } from 'lucide-react';
import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  DEFAULT_WORKSITE_LATITUDE,
  DEFAULT_WORKSITE_LONGITUDE,
  WorksiteMapPicker,
} from './worksite-map-picker';

export type WorksiteFormValues = {
  name: string;
  code: string;
  latitude: string;
  longitude: string;
  radiusMeters: string;
  isActive: boolean;
};

export type WorksiteFormHandlers = {
  setName: (value: string) => void;
  setCode: (value: string) => void;
  setLatitude: (value: string) => void;
  setLongitude: (value: string) => void;
  setRadiusMeters: (value: string) => void;
  setIsActive: (value: boolean) => void;
};

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

export function WorksiteFormDialog({
  open,
  onOpenChange,
  title,
  description,
  values,
  handlers,
  submitting,
  onSubmit,
  submitLabel,
  showActiveToggle = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  values: WorksiteFormValues;
  handlers: WorksiteFormHandlers;
  submitting: boolean;
  onSubmit: () => void;
  submitLabel: string;
  showActiveToggle?: boolean;
}) {
  const {
    name,
    code,
    latitude,
    longitude,
    radiusMeters,
    isActive,
  } = values;
  const {
    setName,
    setCode,
    setLatitude,
    setLongitude,
    setRadiusMeters,
    setIsActive,
  } = handlers;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[980px] overflow-hidden rounded-2xl border-0 p-0 shadow-[0px_18px_60px_rgba(15,23,42,0.18)]">
        <DialogHeader className="border-b border-slate-100 px-5 py-4">
          <DialogTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900">
            <span className="flex size-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <MapPinned className="size-4" />
            </span>
            <span>{title}</span>
          </DialogTitle>
          <DialogDescription className="pl-12 text-sm text-slate-500">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="px-5 py-5">
          <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
            <div className="space-y-4">
              <div className="grid gap-3">
                <Field label="NAMA LOKASI">
                  <Input
                    className="h-10 rounded-xl"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Head Office"
                  />
                </Field>
                <Field label="KODE">
                  <Input
                    className="h-10 rounded-xl"
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                    placeholder="HQ"
                  />
                </Field>
              </div>
              <CoordinateBlock
                latitude={latitude}
                longitude={longitude}
                onLatitude={setLatitude}
                onLongitude={setLongitude}
              />
              <RadiusBlock
                radiusMeters={radiusMeters}
                onRadius={setRadiusMeters}
              />
              {showActiveToggle ? (
                <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Status Aktif
                    </p>
                    <p className="text-xs leading-5 text-slate-500">
                      Nonaktifkan jika lokasi tidak lagi dipakai.
                    </p>
                  </div>
                  <Checkbox
                    checked={isActive}
                    onCheckedChange={(checked) => setIsActive(checked === true)}
                  />
                </label>
              ) : null}
              <div className="flex gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-5 text-blue-700">
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-white text-blue-600">
                  <MapPinned className="size-4" />
                </span>
                <span>
                  Klik peta untuk memindahkan pin. Lokasi yang dipilih akan
                  menjadi pusat geofence.
                </span>
              </div>
            </div>
            <div className="min-w-0">
              <WorksiteMapPicker
                latitude={Number(latitude) || DEFAULT_WORKSITE_LATITUDE}
                longitude={Number(longitude) || DEFAULT_WORKSITE_LONGITUDE}
                radiusMeters={Number(radiusMeters) || 100}
                onChange={(nextLatitude, nextLongitude) => {
                  setLatitude(String(nextLatitude));
                  setLongitude(String(nextLongitude));
                }}
              />
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="flex items-center justify-end gap-3 border-t border-slate-100 bg-white px-5 py-4">
          <Button
            variant="outline"
            className="h-10 rounded-xl px-5"
            disabled={submitting}
            onClick={() => onOpenChange(false)}
          >
            Batal
          </Button>
          <Button
            className="h-10 rounded-xl bg-blue-600 px-5 text-white hover:bg-blue-700"
            disabled={submitting || !name || !code}
            onClick={onSubmit}
          >
            {submitting ? 'Menyimpan...' : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CoordinateBlock({
  latitude,
  longitude,
  onLatitude,
  onLongitude,
}: {
  latitude: string;
  longitude: string;
  onLatitude: (value: string) => void;
  onLongitude: (value: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Koordinat Dipilih
        </p>
        <MapPin className="size-4 text-blue-600" />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <Label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Latitude
          </Label>
          <Input
            className="h-9 rounded-lg bg-white px-2 text-xs"
            value={latitude}
            onChange={(event) => onLatitude(event.target.value)}
            placeholder="-6.200000"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Longitude
          </Label>
          <Input
            className="h-9 rounded-lg bg-white px-2 text-xs"
            value={longitude}
            onChange={(event) => onLongitude(event.target.value)}
            placeholder="106.816666"
          />
        </div>
      </div>
    </div>
  );
}

function RadiusBlock({
  radiusMeters,
  onRadius,
}: {
  radiusMeters: string;
  onRadius: (value: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Radius Geofence
        </p>
        <span className="text-sm font-semibold text-slate-900">
          {radiusMeters} meter
        </span>
      </div>
      <div className="mt-4">
        <Slider
          value={[Number(radiusMeters) || 100]}
          min={50}
          max={1000}
          step={10}
          onValueChange={(value) => onRadius(String(value[0] ?? 100))}
        />
      </div>
    </div>
  );
}
