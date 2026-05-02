import { useEffect, useState } from "react";
import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchMapEvents, type Earthquake } from "../api/earthquakeApi";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

function pinSize(magnitude: number): number {
  return Math.max(16, Math.min(52, 12 + magnitude * 4));
}

export default function EarthquakeMap() {
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [selected, setSelected] = useState<Earthquake | null>(null);

  useEffect(() => {
    fetchMapEvents({ limit: 100 })
      .then(setEarthquakes)
      .catch((err: Error) =>
        toast.error(`Failed to load earthquake data: ${err.message}`)
      );
  }, []);

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
      <ToastContainer position="bottom-right" theme="dark" />

      <div style={{ flex: 1 }}>
        <Map
          initialViewState={{ longitude: 0, latitude: 20, zoom: 2 }}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          mapboxAccessToken={MAPBOX_TOKEN}
        >
          {earthquakes.map((eq) => (
            <Marker
              key={eq.id}
              longitude={eq.longitude}
              latitude={eq.latitude}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setSelected(eq);
              }}
            >
              <div
                title={`M${eq.magnitude.toFixed(1)}`}
                style={{
                  cursor: "pointer",
                  fontSize: `${pinSize(eq.magnitude)}px`,
                  lineHeight: 1,
                  filter:
                    selected?.id === eq.id
                      ? "drop-shadow(0 0 6px #f59e0b)"
                      : "none",
                }}
              >
                📍
              </div>
            </Marker>
          ))}
        </Map>
      </div>

      <div
        style={{
          width: selected ? "320px" : "0",
          overflow: "hidden",
          transition: "width 0.3s ease",
          background: "#1e1e2e",
          color: "#cdd6f4",
          borderLeft: "1px solid #313244",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {selected && (
          <div style={{ padding: "24px", width: "320px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "16px",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "20px", color: "#cba6f7" }}>
                M{selected.magnitude.toFixed(1)} Earthquake
              </h2>
              <button
                onClick={() => setSelected(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#6c7086",
                  fontSize: "20px",
                  cursor: "pointer",
                  lineHeight: 1,
                  padding: "0 4px",
                }}
              >
                ✕
              </button>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                borderTop: "1px solid #313244",
                paddingTop: "16px",
              }}
            >
              <InfoRow label="Magnitude" value={selected.magnitude.toFixed(2)} />
              <InfoRow label="Depth" value={`${selected.depth.toFixed(1)} km`} />
              <InfoRow
                label="Time"
                value={new Date(selected.time).toUTCString()}
              />
              <InfoRow
                label="Coordinates"
                value={`${selected.latitude.toFixed(4)}°, ${selected.longitude.toFixed(4)}°`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: "11px", color: "#6c7086", marginBottom: "2px" }}>
        {label.toUpperCase()}
      </div>
      <div style={{ fontSize: "14px", color: "#cdd6f4" }}>{value}</div>
    </div>
  );
}
