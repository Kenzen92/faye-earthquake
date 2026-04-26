import { useState } from "react";
import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

interface Landmark {
  id: string;
  name: string;
  longitude: number;
  latitude: number;
  description: string;
  builtYear: number;
  location: string;
  type: string;
}

const LANDMARKS: Landmark[] = [
  {
    id: "london-bridge",
    name: "London Bridge",
    longitude: -0.0877,
    latitude: 51.5079,
    description:
      "A historic crossing over the River Thames, connecting the City of London to Southwark. The current bridge was completed in 1973.",
    builtYear: 1973,
    location: "London, United Kingdom",
    type: "Bridge",
  },
  {
    id: "eiffel-tower",
    name: "Eiffel Tower",
    longitude: 2.2945,
    latitude: 48.8584,
    description:
      "An iconic wrought-iron lattice tower on the Champ de Mars in Paris. Built as the centerpiece of the 1889 World's Fair, it stands 330 metres tall.",
    builtYear: 1889,
    location: "Paris, France",
    type: "Monument",
  },
];

export default function EarthquakeMap() {
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(
    null,
  );

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
      <div style={{ flex: 1 }}>
        <Map
          initialViewState={{
            longitude: 1.0,
            latitude: 50.5,
            zoom: 5,
          }}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          mapboxAccessToken={MAPBOX_TOKEN}
        >
          {LANDMARKS.map((landmark) => (
            <Marker
              key={landmark.id}
              longitude={landmark.longitude}
              latitude={landmark.latitude}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setSelectedLandmark(landmark);
              }}
            >
              <div
                title={landmark.name}
                style={{
                  cursor: "pointer",
                  fontSize: "28px",
                  lineHeight: 1,
                  filter:
                    selectedLandmark?.id === landmark.id
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
          width: selectedLandmark ? "320px" : "0",
          overflow: "hidden",
          transition: "width 0.3s ease",
          background: "#1e1e2e",
          color: "#cdd6f4",
          borderLeft: "1px solid #313244",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {selectedLandmark && (
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
                {selectedLandmark.name}
              </h2>
              <button
                onClick={() => setSelectedLandmark(null)}
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
                display: "inline-block",
                background: "#313244",
                color: "#89b4fa",
                borderRadius: "6px",
                padding: "3px 10px",
                fontSize: "12px",
                marginBottom: "16px",
              }}
            >
              {selectedLandmark.type}
            </div>

            <p
              style={{
                fontSize: "14px",
                lineHeight: "1.6",
                color: "#bac2de",
                marginBottom: "20px",
              }}
            >
              {selectedLandmark.description}
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                borderTop: "1px solid #313244",
                paddingTop: "16px",
              }}
            >
              <InfoRow label="Location" value={selectedLandmark.location} />
              <InfoRow
                label="Built"
                value={String(selectedLandmark.builtYear)}
              />
              <InfoRow
                label="Coordinates"
                value={`${selectedLandmark.latitude.toFixed(4)}°N, ${selectedLandmark.longitude.toFixed(4)}°E`}
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
