"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

interface StreetViewExplorerProps {
  lat: number;
  lng: number;
  heading?: number;
  pitch?: number;
  onPositionChange?: (lat: number, lng: number) => void;
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
}: StreetViewExplorerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const panoRef = useRef<google.maps.StreetViewPanorama | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error" | "no-coverage">("loading");
  const onPositionChangeRef = useRef(onPositionChange);
  onPositionChangeRef.current = onPositionChange;

  // Initialize once
  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;

    ensureMapsLoaded()
      .then(() => {
        if (cancelled || !containerRef.current) return;

        const panorama = new google.maps.StreetViewPanorama(containerRef.current, {
          position: { lat, lng },
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

        panorama.addListener("status_changed", () => {
          const s = panorama.getStatus();
          if (s === google.maps.StreetViewStatus.OK) {
            setStatus("ready");
          } else {
            setStatus("no-coverage");
          }
        });

        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update position when level changes
  const updatePosition = useCallback(
    (newLat: number, newLng: number, newHeading: number, newPitch: number) => {
      if (!panoRef.current) return;
      panoRef.current.setPosition({ lat: newLat, lng: newLng });
      panoRef.current.setPov({ heading: newHeading, pitch: newPitch });
    },
    []
  );

  useEffect(() => {
    updatePosition(lat, lng, heading, pitch);
  }, [lat, lng, heading, pitch, updatePosition]);

  // Loading state
  if (status === "loading") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0a0a0a",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
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
    );
  }

  // Error states
  if (status === "error") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0a0a0a",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          padding: 24,
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
    );
  }

  if (status === "no-coverage") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0a0a0a",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <span style={{ fontSize: 48 }}>📍</span>
        <p style={{ color: "#fbbf24", fontSize: 16, fontWeight: 600 }}>
          Sin cobertura Street View
        </p>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
          Esta ubicación no tiene imágenes de Street View disponibles.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", background: "#0a0a0a" }}
    />
  );
}
