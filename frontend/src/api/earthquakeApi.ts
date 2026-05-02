export interface Earthquake {
  id: number;
  magnitude: number;
  latitude: number;
  longitude: number;
  depth: number;
  time: string;
}

interface MapEventParams {
  min_magnitude?: number;
  max_magnitude?: number;
  limit?: number;
}

export async function fetchMapEvents(params: MapEventParams = {}): Promise<Earthquake[]> {
  const url = new URL("/api/earthquakes/map-events", window.location.origin);
  if (params.min_magnitude != null) url.searchParams.set("min_magnitude", String(params.min_magnitude));
  if (params.max_magnitude != null) url.searchParams.set("max_magnitude", String(params.max_magnitude));
  if (params.limit != null) url.searchParams.set("limit", String(params.limit));

  const response = await fetch(url.toString(), { cache: "no-store" });
  if (!response.ok) throw new Error(`API error ${response.status}`);
  return response.json();
}
