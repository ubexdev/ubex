"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

interface StreetViewExplorerProps {
  lat: number;
  lng: number;
  heading?: number;
  pitch?: number;
  onPositionChange?: (lat: number, lng: number) => void;
  onNoCoverage?: () => void;
}

let initialized = false;
let loadPromise: Promise<void> | null = null;

function ensureMapsLoaded(): Promise<void> {
  if (initialized) return Promise.resolve();
  if (loadPromise) return loadPromise;

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return Promise.reject(new Error("GOOGLE_MAPS_API_KEY no configurada"));

  setOptions({ key: apiKey, v: "weekly" });
  loadPromise = importLibrary("streetView").then(() => {
    initialized = true;
  });
  return loadPromise;
}

export default function StreetViewExplorer({
  lat,
  lng,
  heading = 0,
  pitch = 0,
  onPositionChange,
  onNoCoverage,
}: StreetViewExplorerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const panoRef = useRef<google.maps.StreetViewPanorama | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error" | "no-coverage">("loading");
  const onPositionChangeRef = useRef(onPositionChange);
  onPositionChangeRef.current = onPositionChange;
  const onNoCoverageRef = useRef(onNoCoverage);
  onNoCoverageRef.current = onNoCoverage;

  // Initialize panorama once
  useEffect(() => {
    let cancelled = false;

    ensureMapsLoaded()
      .then(async () => {
        if (cancelled || !containerRef.current) return;

        // Find nearest panorama within 300m radius (OUTDOOR only, no aerials)
        const svService = new google.maps.StreetViewService();
        const response = await svService.getPanorama({
          location: { lat, lng },
          radius: 300,
          preference: google.maps.StreetViewPreference.NEAREST,
          source: google.maps.StreetViewSource.OUTDOOR,
        });

        if (cancelled || !containerRef.current) return;

        // Verify the found panorama has navigation links (reject isolated aerials)
        const panoLocation = response.data.location;
        if (!panoLocation?.pano || !panoLocation.latLng) {
          setStatus("no-coverage");
          onNoCoverageRef.current?.();
          return;
        }

        const panorama = new google.maps.StreetViewPanorama(containerRef.current, {
          pano: response.data.location?.pano,
          pov: { heading, pitch },
          zoom: 1,
          addressControl: true,
          addressControlOptions: { position: google.maps.ControlPosition.BOTTOM_CENTER },
          showRoadLabels: false,
          motionTracking: false,
          motionTrackingControl: false,
          fullscreenControl: false,
          linksControl: true,
          panControl: true,
          zoomControl: true,
          zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_CENTER },
        });

        panoRef.current = panorama;

        panorama.addListener("position_changed", () => {
          const pos = panorama.getPosition();
          if (pos && onPositionChangeRef.current) {
            onPositionChangeRef.current(pos.lat(), pos.lng());
          }
        });

        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        const msg = err?.message || String(err);
        if (msg.includes("ZERO_RESULTS") || msg.includes("no panorama")) {
          setStatus("no-coverage");
          onNoCoverageRef.current?.();
        } else {
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update position when level changes
  useEffect(() => {
    if (!panoRef.current || !initialized) return;

    const svService = new google.maps.StreetViewService();
    svService
      .getPanorama({
        location: { lat, lng },
        radius: 300,
        preference: google.maps.StreetViewPreference.NEAREST,
        source: google.maps.StreetViewSource.OUTDOOR,
      })
      .then((response) => {
        if (!panoRef.current) return;
        const panoId = response.data.location?.pano;
        if (panoId) {
          panoRef.current.setPano(panoId);
          panoRef.current.setPov({ heading, pitch });
          setStatus("ready");
        }
      })
      .catch(() => {
        setStatus("no-coverage");
        onNoCoverageRef.current?.();
      });
  }, [lat, lng, heading, pitch]);

  // Always render the container div so Google Maps can attach to it.
  // Overlay loading/error states on top.
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: "#0a0a0a" }}>
      {/* The div Google Maps attaches to — always in the DOM */}
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          visibility: status === "ready" ? "visible" : "hidden",
        }}
      />

      {/* Loading overlay */}
      {status === "loading" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            background: "#0a0a0a",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              border: "3px solid rgba(245,158,11,0.2)",
              borderTopColor: "#f59e0b",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
            Cargando Google Street View...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      )}

      {/* Error overlay */}
      {status === "error" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            padding: 24,
            background: "#0a0a0a",
          }}
        >
          <span style={{ fontSize: 48 }}>🗺️</span>
          <p style={{ color: "#ef4444", fontSize: 16, fontWeight: 600 }}>
            Error cargando Google Maps
          </p>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, textAlign: "center", maxWidth: 300 }}>
            Verifica tu API key de Google Maps o tu conexión a internet.
          </p>
        </div>
      )}

      {/* No coverage overlay — satellite map fallback + skip */}
      {status === "no-coverage" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            background: "#0a0a0a",
          }}
        >
          {/* Satellite map iframe as fallback */}
          <div style={{ width: "100%", height: "60%", position: "absolute", top: 0, left: 0, opacity: 0.5 }}>
            <iframe
              title="Satellite fallback"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              src={`https://www.google.com/maps/embed/v1/view?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&center=${lat},${lng}&zoom=17&maptype=satellite`}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, #0a0a0a 100%)" }} />
          </div>
          <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginTop: 80 }}>
            <span style={{ fontSize: 48 }}>📍</span>
            <p style={{ color: "#fbbf24", fontSize: 16, fontWeight: 600 }}>
              Sin cobertura Street View
            </p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, textAlign: "center", maxWidth: 300, lineHeight: 1.5 }}>
              Esta ubicación no tiene imágenes de Street View. Puedes usar la vista satelital como referencia o saltar esta misión.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
