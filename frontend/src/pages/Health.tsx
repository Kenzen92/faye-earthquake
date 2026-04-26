import { useEffect, useState } from "react";
import "../App.css";

type HealthStatus = "loading" | "ok" | "error";

function StatusBadge({ status }: { status: HealthStatus }) {
  const map: Record<HealthStatus, { label: string; color: string }> = {
    loading: { label: "Checking…", color: "#64748b" },
    ok: { label: "Connected", color: "#22c55e" },
    error: { label: "Unavailable", color: "#ef4444" },
  };
  const { label, color } = map[status];
  return (
    <span className="badge" style={{ background: color }}>
      {label}
    </span>
  );
}

export default function Health() {
  const [apiStatus, setApiStatus] = useState<HealthStatus>("loading");
  const [dbStatus, setDbStatus] = useState<HealthStatus>("loading");

  useEffect(() => {
    fetch("/api/health", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(() => setApiStatus("ok"))
      .catch(() => setApiStatus("error"));

    fetch("/api/health/db", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: { database: string }) =>
        setDbStatus(data.database === "connected" ? "ok" : "error"),
      )
      .catch(() => setDbStatus("error"));
  }, []);

  return (
    <div className="app-container">
      <h1>Faye Earthquake</h1>
      <p className="subtitle">FastAPI · PostgreSQL · React</p>
      <div className="card-grid">
        <div className="card">
          <h2>API</h2>
          <StatusBadge status={apiStatus} />
        </div>
        <div className="card">
          <h2>Database</h2>
          <StatusBadge status={dbStatus} />
        </div>
      </div>
      /* Navigation to state component */
      <button
        onClick={() => {
          window.location.href = "/state";
        }}
      >
        Click me
      </button>
    </div>
  );
}
