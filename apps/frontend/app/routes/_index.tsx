import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export interface HelloResponse {
  message: string;
  app: string;
  version: string;
  status: string;
  timestamp: string;
}

export interface StationResponse {
  id: string;
  name: string;
  country: string;
  fuelType: string;
  capacityMw: number;
  latitude: number;
  longitude: number;
  status: string;
}

export interface LoaderData {
  backendUrl: string;
  backendConnected: boolean;
  helloData: HelloResponse | null;
  stations: StationResponse[];
  errorMessage?: string;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const backendUrl =
    process.env.BACKEND_INTERNAL_URL ||
    process.env.BACKEND_URL ||
    "http://localhost:8080";

  try {
    const [helloRes, stationsRes] = await Promise.all([
      fetch(`${backendUrl}/api/hello`, { signal: AbortSignal.timeout(3000) }),
      fetch(`${backendUrl}/api/stations`, { signal: AbortSignal.timeout(3000) }),
    ]);

    if (!helloRes.ok || !stationsRes.ok) {
      throw new Error(
        `Backend returned non-200 status: Hello (${helloRes.status}), Stations (${stationsRes.status})`
      );
    }

    const helloData: HelloResponse = await helloRes.json();
    const stations: StationResponse[] = await stationsRes.json();

    return json<LoaderData>({
      backendUrl,
      backendConnected: true,
      helloData,
      stations,
    });
  } catch (err: any) {
    return json<LoaderData>({
      backendUrl,
      backendConnected: false,
      helloData: null,
      stations: [],
      errorMessage: err?.message || "Failed to connect to backend",
    });
  }
}

const FUEL_COLORS: Record<string, { bg: string; text: string }> = {
  HYDRO: { bg: "#0d47a1", text: "#90caf9" },
  NUCLEAR: { bg: "#4a148c", text: "#ce93d8" },
  SOLAR: { bg: "#f57f17", text: "#fff59d" },
  WIND: { bg: "#004d40", text: "#80cbc4" },
  STORAGE: { bg: "#1b5e20", text: "#a5d6a7" },
  GEOTHERMAL: { bg: "#bf360c", text: "#ffab91" },
  DEFAULT: { bg: "#21262d", text: "#c9d1d9" },
};

export default function Index() {
  const { backendConnected, helloData, stations, errorMessage, backendUrl } =
    useLoaderData<LoaderData>();

  return (
    <main
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "40px 20px",
        fontFamily: "inherit",
      }}
    >
      {/* Header */}
      <header
        style={{
          borderBottom: "1px solid #30363d",
          paddingBottom: "24px",
          marginBottom: "32px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <span style={{ fontSize: "2rem" }}>⚡</span>
          <h1 style={{ fontSize: "2rem", fontWeight: "700", color: "#f0f6fc" }}>
            World Power Stations (WPS)
          </h1>
        </div>
        <p style={{ color: "#8b949e", fontSize: "1.1rem" }}>
          Interactive world map & registry of power generation and energy storage plants.
        </p>
      </header>

      {/* Status Card */}
      <section
        aria-label="System Connectivity Status"
        style={{
          backgroundColor: "#161b22",
          border: `1px solid ${backendConnected ? "#238636" : "#da3633"}`,
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "32px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: backendConnected ? "#2ea043" : "#f85149",
              }}
            />
            <h2 style={{ fontSize: "1.2rem", fontWeight: "600", color: "#f0f6fc" }}>
              Backend Connection Status:{" "}
              <span style={{ color: backendConnected ? "#3fb950" : "#f85149" }}>
                {backendConnected ? "ONLINE" : "OFFLINE"}
              </span>
            </h2>
          </div>
          <span style={{ color: "#8b949e", fontSize: "0.85rem" }}>
            Target: <code>{backendUrl}</code>
          </span>
        </div>

        {backendConnected && helloData ? (
          <div>
            <p style={{ color: "#c9d1d9", marginBottom: "8px" }}>
              <strong>API Message:</strong> {helloData.message}
            </p>
            <div
              style={{
                display: "flex",
                gap: "20px",
                color: "#8b949e",
                fontSize: "0.9rem",
                flexWrap: "wrap",
              }}
            >
              <span>Version: <strong>{helloData.version}</strong></span>
              <span>Backend Status: <strong>{helloData.status}</strong></span>
              <span>Timestamp: <strong>{new Date(helloData.timestamp).toLocaleString()}</strong></span>
            </div>
          </div>
        ) : (
          <p style={{ color: "#f85149" }}>
            Unable to connect to Spring Boot API. Error: {errorMessage}
          </p>
        )}
      </section>

      {/* Stations List */}
      <section aria-label="Sample Power Stations">
        <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "16px", color: "#f0f6fc" }}>
          Initial Power Stations Data Feed ({stations.length})
        </h2>

        {stations.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {stations.map((station) => {
              const fuelStyle = FUEL_COLORS[station.fuelType] || FUEL_COLORS.DEFAULT;
              return (
                <div
                  key={station.id}
                  style={{
                    backgroundColor: "#161b22",
                    border: "1px solid #30363d",
                    borderRadius: "8px",
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: "600", color: "#f0f6fc" }}>
                      {station.name}
                    </h3>
                    <span
                      style={{
                        backgroundColor: fuelStyle.bg,
                        color: fuelStyle.text,
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        textTransform: "uppercase",
                      }}
                    >
                      {station.fuelType}
                    </span>
                  </div>

                  <div style={{ color: "#8b949e", fontSize: "0.9rem" }}>
                    <p>📍 {station.country} ({station.latitude.toFixed(3)}, {station.longitude.toFixed(3)})</p>
                    <p>⚡ Capacity: <strong style={{ color: "#58a6ff" }}>{station.capacityMw.toLocaleString()} MW</strong></p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ color: "#8b949e" }}>
            No stations available or waiting for backend service...
          </p>
        )}
      </section>

      {/* Tech Stack Summary */}
      <footer
        style={{
          marginTop: "48px",
          paddingTop: "24px",
          borderTop: "1px solid #30363d",
          color: "#8b949e",
          fontSize: "0.875rem",
        }}
      >
        <p>
          World Power Stations Monorepo Architecture: Remix (SSR/React) Frontend + Spring Boot (Java 21) Backend + PostgreSQL/PostGIS.
        </p>
      </footer>
    </main>
  );
}
