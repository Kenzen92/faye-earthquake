import { useCallback, useEffect, useState } from "react";
import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchMapEvents, type Earthquake } from "../api/earthquakeApi";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

function magnitudeColor(m: number): string {
  if (m >= 7) return "#ef4444";
  if (m >= 5) return "#f97316";
  if (m >= 3) return "#eab308";
  return "#22d3ee";
}

function pinSize(m: number): number {
  return Math.max(6, Math.min(28, 4 + m * 3));
}

function Sep() {
  return (
    <div
      style={{ width: "1px", height: "20px", background: "#1c1f2e", flexShrink: 0 }}
    />
  );
}

const inputStyle: React.CSSProperties = {
  background: "transparent",
  border: "1px solid #252840",
  borderRadius: "3px",
  color: "#8a93b8",
  fontSize: "12px",
  padding: "3px 6px",
  height: "26px",
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontSize: "10px",
  color: "#3d4268",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginRight: "5px",
  flexShrink: 0,
  userSelect: "none",
};

const groupStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  flexShrink: 0,
};

export default function EarthquakeMap() {
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [selected, setSelected] = useState<Earthquake | null>(null);
  const [loading, setLoading] = useState(false);

  const [minMag, setMinMag] = useState("0");
  const [maxMag, setMaxMag] = useState("10");
  const [limit, setLimit] = useState("100");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const applyFilters = useCallback(() => {
    const params: Parameters<typeof fetchMapEvents>[0] = {
      limit: Math.max(1, parseInt(limit) || 100),
      min_magnitude: parseFloat(minMag),
      max_magnitude: parseFloat(maxMag),
    };
    if (startDate) params.start_date = startDate + "T00:00:00Z";
    if (endDate) params.end_date = endDate + "T23:59:59Z";

    setLoading(true);
    fetchMapEvents(params)
      .then(setEarthquakes)
      .catch((err: Error) =>
        toast.error(`Failed to load earthquake data: ${err.message}`)
      )
      .finally(() => setLoading(false));
  }, [minMag, maxMag, limit, startDate, endDate]);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        background: "#0d0f17",
        fontFamily:
          "'Inter', 'SF Pro Display', system-ui, -apple-system, sans-serif",
      }}
    >
      <ToastContainer position="bottom-right" theme="dark" />

      {/* ── Filter bar ── */}
      <div
        style={{
          height: "48px",
          minHeight: "48px",
          background: "#0d0f17",
          borderBottom: "1px solid #1c1f2e",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: "14px",
          flexShrink: 0,
          overflowX: "auto",
          overflowY: "hidden",
        }}
      >
        {/* Brand mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#ef4444",
              boxShadow: "0 0 6px #ef444488",
            }}
          />
          <span
            style={{
              fontSize: "10px",
              color: "#3d4268",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              whiteSpace: "nowrap",
            }}
          >
            Seismic Monitor
          </span>
        </div>

        <Sep />

        {/* Magnitude range */}
        <div style={groupStyle}>
          <span style={labelStyle}>Mag</span>
          <input
            type="number"
            min={0}
            max={10}
            step={0.1}
            value={minMag}
            onChange={(e) => setMinMag(e.target.value)}
            style={{ ...inputStyle, width: "50px" }}
            title="Minimum magnitude"
          />
          <span style={{ color: "#252840", fontSize: "12px", flexShrink: 0 }}>
            —
          </span>
          <input
            type="number"
            min={0}
            max={10}
            step={0.1}
            value={maxMag}
            onChange={(e) => setMaxMag(e.target.value)}
            style={{ ...inputStyle, width: "50px" }}
            title="Maximum magnitude"
          />
        </div>

        <Sep />

        {/* Result limit */}
        <div style={groupStyle}>
          <span style={labelStyle}>Limit</span>
          <input
            type="number"
            min={1}
            max={2000}
            step={1}
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            style={{ ...inputStyle, width: "62px" }}
            title="Maximum number of results"
          />
        </div>

        <Sep />

        {/* Date range */}
        <div style={groupStyle}>
          <span style={labelStyle}>From</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ ...inputStyle, width: "136px", colorScheme: "dark" }}
            title="Start date"
          />
        </div>
        <div style={groupStyle}>
          <span style={labelStyle}>To</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ ...inputStyle, width: "136px", colorScheme: "dark" }}
            title="End date"
          />
        </div>

        <Sep />

        {/* Apply */}
        <button
          onClick={applyFilters}
          disabled={loading}
          style={{
            background: loading ? "#151826" : "#1a2545",
            border: "1px solid #253060",
            borderRadius: "3px",
            color: loading ? "#3d4268" : "#5b7ec8",
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            padding: "0 12px",
            height: "26px",
            cursor: loading ? "default" : "pointer",
            flexShrink: 0,
            fontFamily: "inherit",
            transition: "background 0.15s, color 0.15s",
            whiteSpace: "nowrap",
          }}
        >
          {loading ? "Loading…" : "Apply"}
        </button>

        {/* Result count — right-aligned */}
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: loading ? "#252840" : "#22d3ee",
              boxShadow: loading ? "none" : "0 0 5px #22d3ee88",
              transition: "background 0.3s",
            }}
          />
          <span
            style={{
              fontSize: "11px",
              color: "#3d4268",
              letterSpacing: "0.04em",
              whiteSpace: "nowrap",
            }}
          >
            {earthquakes.length.toLocaleString()} events
          </span>
        </div>
      </div>

      {/* ── Map + detail panel ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Map
            initialViewState={{ longitude: 0, latitude: 20, zoom: 2 }}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/dark-v11"
            mapboxAccessToken={MAPBOX_TOKEN}
          >
            {earthquakes.map((eq) => (
              <Marker
                key={eq.id}
                longitude={eq.longitude}
                latitude={eq.latitude}
                anchor="center"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  setSelected(eq);
                }}
              >
                <div
                  title={`M${eq.magnitude.toFixed(1)}`}
                  style={{
                    cursor: "pointer",
                    width: `${pinSize(eq.magnitude)}px`,
                    height: `${pinSize(eq.magnitude)}px`,
                    borderRadius: "50%",
                    background: magnitudeColor(eq.magnitude),
                    opacity: 0.82,
                    boxShadow:
                      selected?.id === eq.id
                        ? `0 0 0 2px #fff, 0 0 10px ${magnitudeColor(eq.magnitude)}`
                        : `0 0 5px ${magnitudeColor(eq.magnitude)}80`,
                    transition: "box-shadow 0.15s",
                    flexShrink: 0,
                  }}
                />
              </Marker>
            ))}
          </Map>

          {/* Magnitude legend */}
          <div
            style={{
              position: "absolute",
              bottom: "24px",
              left: "12px",
              background: "#0d0f17cc",
              backdropFilter: "blur(6px)",
              border: "1px solid #1c1f2e",
              borderRadius: "4px",
              padding: "10px 12px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            {(
              [
                { label: "≥ 7.0", color: "#ef4444" },
                { label: "5.0 – 6.9", color: "#f97316" },
                { label: "3.0 – 4.9", color: "#eab308" },
                { label: "< 3.0", color: "#22d3ee" },
              ] as const
            ).map(({ label, color }) => (
              <div
                key={label}
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: color,
                    boxShadow: `0 0 4px ${color}88`,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: "10px",
                    color: "#3d4268",
                    letterSpacing: "0.04em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Detail panel ── */}
        <div
          style={{
            width: selected ? "300px" : "0",
            overflow: "hidden",
            transition: "width 0.25s ease",
            background: "#0d0f17",
            borderLeft: "1px solid #1c1f2e",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
          }}
        >
          {selected && (
            <div style={{ padding: "20px", width: "300px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "16px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#3d4268",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: "6px",
                    }}
                  >
                    Event Detail
                  </div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "24px",
                      color: magnitudeColor(selected.magnitude),
                      fontWeight: 600,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    M{selected.magnitude.toFixed(1)}
                  </h2>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  style={{
                    background: "none",
                    border: "1px solid #1c1f2e",
                    borderRadius: "3px",
                    color: "#3d4268",
                    fontSize: "13px",
                    cursor: "pointer",
                    lineHeight: 1,
                    padding: "4px 8px",
                    fontFamily: "inherit",
                  }}
                >
                  ✕
                </button>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  borderTop: "1px solid #1c1f2e",
                  paddingTop: "16px",
                }}
              >
                <InfoRow
                  label="Magnitude"
                  value={selected.magnitude.toFixed(2)}
                  accent={magnitudeColor(selected.magnitude)}
                />
                <InfoRow label="Depth" value={`${selected.depth.toFixed(1)} km`} />
                <InfoRow
                  label="Time (UTC)"
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
    </div>
  );
}

function InfoRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: "10px",
          color: "#3d4268",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: "4px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "13px",
          color: accent ?? "#8a93b8",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </div>
    </div>
  );
}
