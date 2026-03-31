"use client";

import { useEffect, useRef, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { MapPin, CircleNotch, Warning } from "@phosphor-icons/react";

interface MapPickerProps {
  lat: number;
  lng: number;
  onCoordinateChange: (lat: number, lng: number) => void;
  showStreetView?: boolean;
  label?: string;
  className?: string;
}

let mapsLoaded = false;
let loadPromise: Promise<void> | null = null;

function ensureMapsApi(): Promise<void> {
  if (mapsLoaded) return Promise.resolve();
  if (loadPromise) return loadPromise;

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return Promise.reject(new Error("API key faltante"));

  setOptions({ key: apiKey, v: "weekly" });
  loadPromise = Promise.all([
    importLibrary("maps"),
    importLibrary("streetView"),
  ]).then(() => {
    mapsLoaded = true;
  });
  return loadPromise;
}

const DARK_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#212121" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#757575" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#181818" }],
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [{ color: "#2c2c2c" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212121" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.fill",
    stylers: [{ color: "#3c3c3c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f2f2f" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#000000" }],
  },
];

export default function MapPicker({
  lat,
  lng,
  onCoordinateChange,
  showStreetView = false,
  label,
  className = "",
}: MapPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const svContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const svPanoRef = useRef<google.maps.StreetViewPanorama | null>(null);
  const onChangeRef = useRef(onCoordinateChange);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );

  useEffect(() => {
    onChangeRef.current = onCoordinateChange;
  }, [onCoordinateChange]);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!mapContainerRef.current) return;
      try {
        await ensureMapsApi();
        if (cancelled) return;

        const pos = { lat, lng };

        const map = new google.maps.Map(mapContainerRef.current, {
          center: pos,
          zoom: 16,
          disableDefaultUI: true,
          zoomControl: true,
          clickableIcons: false,
          backgroundColor: "#18181b",
          styles: DARK_STYLES,
        });
        mapRef.current = map;

        const marker = new google.maps.Marker({
          map,
          position: pos,
          draggable: true,
        });
        markerRef.current = marker;

        marker.addListener("dragend", () => {
          const p = marker.getPosition();
          if (p) onChangeRef.current(p.lat(), p.lng());
        });

        map.addListener("click", (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            marker.setPosition(e.latLng);
            onChangeRef.current(e.latLng.lat(), e.latLng.lng());
          }
        });

        if (showStreetView && svContainerRef.current) {
          svPanoRef.current = new google.maps.StreetViewPanorama(
            svContainerRef.current,
            {
              position: pos,
              pov: { heading: 0, pitch: 0 },
              disableDefaultUI: true,
              enableCloseButton: false,
              visible: true,
            }
          );
        }

        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    init();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const pos = { lat, lng };
    if (markerRef.current) markerRef.current.setPosition(pos);
    if (mapRef.current) mapRef.current.panTo(pos);
    if (svPanoRef.current) svPanoRef.current.setPosition(pos);
  }, [lat, lng]);

  return (
    <div className={className}>
      {label && (
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <MapPin size={14} weight="bold" />
          {label}
        </p>
      )}

      <div className="relative rounded-lg overflow-hidden border border-zinc-800">
        <div ref={mapContainerRef} className="w-full h-60" />
        {status === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
            <CircleNotch size={24} className="text-zinc-600 animate-spin" />
          </div>
        )}
        {status === "error" && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
            <div className="text-center">
              <Warning size={24} className="mx-auto text-red-400 mb-1" />
              <p className="text-xs text-red-400">Error cargando mapa</p>
            </div>
          </div>
        )}
      </div>

      {showStreetView && (
        <div className="mt-2 relative rounded-lg overflow-hidden border border-zinc-800">
          <div ref={svContainerRef} className="w-full h-40" />
        </div>
      )}

      <p className="mt-1.5 text-xs text-zinc-600 font-mono">
        {lat.toFixed(6)}, {lng.toFixed(6)}
      </p>
    </div>
  );
}
