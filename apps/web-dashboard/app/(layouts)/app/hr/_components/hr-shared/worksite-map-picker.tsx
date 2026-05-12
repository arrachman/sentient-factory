'use client';

/**
 * Map picker untuk worksite (Leaflet + OpenStreetMap):
 *  - Klik peta → ubah pin
 *  - Drag marker → ubah pin
 *  - Search box (Nominatim) → pilih lokasi
 *  - Circle radius mengikuti `radiusMeters`
 */
import { useEffect, useState } from 'react';
import { divIcon } from 'leaflet';
import { MapPin, Search } from 'lucide-react';
import {
  Circle,
  MapContainer,
  Marker,
  TileLayer,
  ZoomControl,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const DEFAULT_WORKSITE_LATITUDE = -5.145;
export const DEFAULT_WORKSITE_LONGITUDE = 119.432;

type GeofenceSearchResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

const worksiteMarkerIcon = divIcon({
  className: '',
  html:
    '<div class="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 shadow-[0_0_0_6px_rgba(59,130,246,0.12)]"><div class="h-2.5 w-2.5 rounded-full bg-white"></div></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

function MapViewportSync({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  const map = useMap();

  useEffect(() => {
    const syncMap = () => {
      map.invalidateSize();
      map.setView([latitude, longitude], map.getZoom(), { animate: false });
    };
    syncMap();
    const timers = [80, 220, 500].map((delay) =>
      window.setTimeout(syncMap, delay),
    );
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [latitude, longitude, map]);

  return null;
}

export function WorksiteMapPicker({
  latitude,
  longitude,
  radiusMeters,
  onChange,
}: {
  latitude: number;
  longitude: number;
  radiusMeters: number;
  onChange: (nextLatitude: number, nextLongitude: number) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeofenceSearchResult[]>(
    [],
  );
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  function LocationEvents() {
    useMapEvents({
      click(event) {
        onChange(event.latlng.lat, event.latlng.lng);
      },
    });
    return null;
  }

  async function searchLocation() {
    const query = searchQuery.trim();
    if (!query) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    setSearching(true);
    setSearchError(null);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&q=${encodeURIComponent(query)}`,
        { headers: { Accept: 'application/json' } },
      );

      if (!response.ok) {
        throw new Error('Pencarian lokasi gagal.');
      }

      const results = (await response.json()) as GeofenceSearchResult[];
      setSearchResults(results);
      if (results.length === 0) {
        setSearchError(
          'Lokasi tidak ditemukan. Coba nama jalan, area, atau kota yang lebih spesifik.',
        );
      }
    } catch (error) {
      setSearchResults([]);
      setSearchError(
        error instanceof Error ? error.message : 'Pencarian lokasi gagal.',
      );
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="relative h-[430px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
      <div className="absolute left-4 right-4 top-4 z-[500] space-y-2">
        <div className="flex items-center justify-between gap-3 rounded-xl bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
          <div>
            <p className="text-sm font-semibold text-slate-900">Peta Geofence</p>
            <p className="text-xs text-slate-500">
              Klik peta untuk memindahkan pin lokasi kerja.
            </p>
          </div>
          <Badge className="border-0 bg-blue-100 text-blue-700">
            {radiusMeters} m
          </Badge>
        </div>
        <div className="flex gap-2 rounded-xl bg-white/95 p-3 shadow-sm backdrop-blur">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  void searchLocation();
                }
              }}
              className="h-11 rounded-xl border-slate-200 bg-white pl-10"
              placeholder="Cari lokasi..."
            />
          </div>
          <Button
            type="button"
            className="h-11 rounded-xl bg-blue-600 px-5 text-white hover:bg-blue-700"
            disabled={searching}
            onClick={() => void searchLocation()}
          >
            {searching ? '...' : 'Cari'}
          </Button>
        </div>
        {searchError ? (
          <div className="rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700 shadow-sm">
            {searchError}
          </div>
        ) : null}
        {searchResults.length > 0 ? (
          <div className="max-h-48 overflow-auto rounded-xl bg-white/95 p-2 shadow-sm backdrop-blur">
            {searchResults.map((result) => (
              <button
                key={result.place_id}
                type="button"
                className="flex w-full items-start gap-2 rounded-lg px-3 py-2 text-left hover:bg-slate-50"
                onClick={() => {
                  onChange(Number(result.lat), Number(result.lon));
                  setSearchResults([]);
                  setSearchError(null);
                }}
              >
                <MapPin className="mt-0.5 size-4 shrink-0 text-blue-600" />
                <span className="line-clamp-2 text-slate-700">
                  {result.display_name}
                </span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <div className="absolute inset-0">
        <MapContainer
          center={[latitude, longitude] as [number, number]}
          zoom={16}
          scrollWheelZoom
          zoomControl={false}
          className="geofence-map-canvas h-full w-full"
          style={{ height: '100%', width: '100%' }}
        >
          <ZoomControl position="topright" />
          <MapViewportSync latitude={latitude} longitude={longitude} />
          <LocationEvents />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Circle
            center={[latitude, longitude] as [number, number]}
            radius={radiusMeters}
            pathOptions={{
              color: '#2563eb',
              fillColor: '#93c5fd',
              fillOpacity: 0.18,
            }}
          />
          <Marker
            position={[latitude, longitude] as [number, number]}
            draggable
            icon={worksiteMarkerIcon}
            eventHandlers={{
              dragend(event) {
                const marker = event.target as {
                  getLatLng: () => { lat: number; lng: number };
                };
                const point = marker.getLatLng();
                onChange(point.lat, point.lng);
              },
            }}
          />
        </MapContainer>
      </div>
    </div>
  );
}
