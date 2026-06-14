'use client';

import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { divIcon } from 'leaflet';
import { MapPin, MapPinned, Search } from 'lucide-react';
import { Circle, MapContainer, Marker, TileLayer, ZoomControl, useMap, useMapEvents } from 'react-leaflet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

type GeofenceSearchResult = { place_id: number; display_name: string; lat: string; lon: string };

const DEFAULT_LAT = -5.145;
const DEFAULT_LNG = 119.432;

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div className="space-y-2"><Label>{label}</Label>{children}</div>;
}

const worksiteMarkerIcon = divIcon({
  className: '',
  html: '<div class="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 shadow-[0_0_0_6px_rgba(59,130,246,0.12)]"><div class="h-2.5 w-2.5 rounded-full bg-white"></div></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

function MapViewportSync({ latitude, longitude }: { latitude: number; longitude: number }) {
  const map = useMap();
  useEffect(() => {
    const syncMap = () => { map.invalidateSize(); map.setView([latitude, longitude], map.getZoom(), { animate: false }); };
    syncMap();
    const timers = [80, 220, 500].map((delay) => window.setTimeout(syncMap, delay));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [latitude, longitude, map]);
  return null;
}

function WorksiteMapPicker({ latitude, longitude, radiusMeters, onChange }: { latitude: number; longitude: number; radiusMeters: number; onChange: (lat: number, lng: number) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeofenceSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  function LocationEvents() {
    useMapEvents({ click(e) { onChange(e.latlng.lat, e.latlng.lng); } });
    return null;
  }

  async function searchLocation() {
    const query = searchQuery.trim();
    if (!query) { setSearchResults([]); setSearchError(null); return; }
    setSearching(true); setSearchError(null);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&q=${encodeURIComponent(query)}`, { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error('Pencarian lokasi gagal.');
      const results = (await res.json()) as GeofenceSearchResult[];
      setSearchResults(results);
      if (results.length === 0) setSearchError('Lokasi tidak ditemukan. Coba nama jalan, area, atau kota yang lebih spesifik.');
    } catch (error) {
      setSearchResults([]); setSearchError(error instanceof Error ? error.message : 'Pencarian lokasi gagal.');
    } finally { setSearching(false); }
  }

  return (
    <div className="relative h-[430px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
      <div className="absolute left-4 right-4 top-4 z-[500] space-y-2">
        <div className="flex items-center justify-between gap-3 rounded-xl bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
          <div>
            <p className="text-sm font-semibold text-slate-900">Peta Geofence</p>
            <p className="text-xs text-slate-500">Klik peta untuk memindahkan pin lokasi kerja.</p>
          </div>
          <Badge className="border-0 bg-blue-100 text-blue-700">{radiusMeters} m</Badge>
        </div>
        <div className="flex gap-2 rounded-xl bg-white/95 p-3 shadow-sm backdrop-blur">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); void searchLocation(); } }} className="h-11 rounded-xl border-slate-200 bg-white pl-10" placeholder="Cari lokasi..." />
          </div>
          <Button type="button" className="h-11 rounded-xl bg-blue-600 px-5 text-white hover:bg-blue-700" disabled={searching} onClick={() => void searchLocation()}>{searching ? '...' : 'Cari'}</Button>
        </div>
        {searchError ? <div className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700 shadow-sm">{searchError}</div> : null}
        {searchResults.length > 0 ? (
          <div className="max-h-48 overflow-auto rounded-xl bg-white/95 p-2 shadow-sm backdrop-blur">
            {searchResults.map((result) => (
              <button key={result.place_id} type="button" className="flex w-full items-start gap-2 rounded-lg px-3 py-2 text-left hover:bg-slate-50" onClick={() => { onChange(Number(result.lat), Number(result.lon)); setSearchResults([]); setSearchError(null); }}>
                <MapPin className="mt-0.5 size-4 shrink-0 text-blue-600" />
                <span className="line-clamp-2 text-slate-700">{result.display_name}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div className="absolute inset-0">
        <MapContainer center={[latitude, longitude] as [number, number]} zoom={16} scrollWheelZoom zoomControl={false} className="geofence-map-canvas h-full w-full" style={{ height: '100%', width: '100%' }}>
          <ZoomControl position="topright" />
          <MapViewportSync latitude={latitude} longitude={longitude} />
          <LocationEvents />
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Circle center={[latitude, longitude] as [number, number]} radius={radiusMeters} pathOptions={{ color: '#2563eb', fillColor: '#93c5fd', fillOpacity: 0.18 }} />
          <Marker position={[latitude, longitude] as [number, number]} draggable icon={worksiteMarkerIcon} eventHandlers={{ dragend(e) { const m = e.target as { getLatLng: () => { lat: number; lng: number } }; const p = m.getLatLng(); onChange(p.lat, p.lng); } }} />
        </MapContainer>
      </div>
    </div>
  );
}

export type WorksiteFormFieldsProps = {
  name: string; code: string; latitude: string; longitude: string; radiusMeters: string;
  isActive?: boolean; showActiveToggle?: boolean;
  onName: (v: string) => void; onCode: (v: string) => void;
  onLatitude: (v: string) => void; onLongitude: (v: string) => void;
  onRadiusMeters: (v: string) => void; onIsActive?: (v: boolean) => void;
  onMapChange: (lat: number, lng: number) => void;
};

export function WorksiteFormFields({ name, code, latitude, longitude, radiusMeters, isActive, showActiveToggle, onName, onCode, onLatitude, onLongitude, onRadiusMeters, onIsActive, onMapChange }: WorksiteFormFieldsProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
      <div className="space-y-4">
        <div className="grid gap-3">
          <Field label="NAMA LOKASI"><Input className="h-10 rounded-xl" value={name} onChange={(e) => onName(e.target.value)} placeholder="Head Office" /></Field>
          <Field label="KODE"><Input className="h-10 rounded-xl" value={code} onChange={(e) => onCode(e.target.value)} placeholder="HQ" /></Field>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Koordinat Dipilih</p>
            <MapPin className="size-4 text-blue-600" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Latitude</Label>
              <Input className="h-9 rounded-lg bg-white px-2 text-xs" value={latitude} onChange={(e) => onLatitude(e.target.value)} placeholder="-6.200000" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Longitude</Label>
              <Input className="h-9 rounded-lg bg-white px-2 text-xs" value={longitude} onChange={(e) => onLongitude(e.target.value)} placeholder="106.816666" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Radius Geofence</p>
            <span className="text-sm font-semibold text-slate-900">{radiusMeters} meter</span>
          </div>
          <div className="mt-4">
            <Slider value={[Number(radiusMeters) || 100]} min={50} max={1000} step={10} onValueChange={(v) => onRadiusMeters(String(v[0] ?? 100))} />
          </div>
        </div>
        {showActiveToggle && onIsActive ? (
          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Status Aktif</p>
              <p className="text-xs leading-5 text-slate-500">Nonaktifkan jika lokasi tidak lagi dipakai.</p>
            </div>
            <Checkbox checked={isActive} onCheckedChange={(c) => onIsActive(c === true)} />
          </label>
        ) : null}
        <div className="flex gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-5 text-blue-700">
          <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-white text-blue-600"><MapPinned className="size-4" /></span>
          <span>Klik peta untuk memindahkan pin. Lokasi yang dipilih akan menjadi pusat geofence.</span>
        </div>
      </div>
      <div className="min-w-0">
        <WorksiteMapPicker latitude={Number(latitude) || DEFAULT_LAT} longitude={Number(longitude) || DEFAULT_LNG} radiusMeters={Number(radiusMeters) || 100} onChange={onMapChange} />
      </div>
    </div>
  );
}
