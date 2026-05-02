"""
Scrapes earthquake data from the USGS FDSNWS API and upserts into the database.
Run from the backend/ directory:
    python -m scripts.scrape
"""
import asyncio
import sys
from datetime import date, datetime, timedelta, timezone
from typing import Any

import httpx
from sqlalchemy.dialects.postgresql import insert

from app.database import AsyncSessionLocal
from app.models.earthquake import Earthquake

USGS_API_URL = "https://earthquake.usgs.gov/fdsnws/event/1/query"
MIN_MAGNITUDE = 2.5
REQUEST_DELAY_SECONDS = 2.0


def _build_params(start_date: date, end_date: date) -> dict:
    return {
        "format": "geojson",
        "starttime": start_date.isoformat(),
        "endtime": end_date.isoformat(),
        "minmagnitude": MIN_MAGNITUDE,
        "orderby": "time-asc",
    }


def _sanitise_feature(feature: dict[str, Any]) -> dict | None:
    """Convert a USGS GeoJSON feature to a DB-ready dict. Returns None if the record is unusable."""
    try:
        props = feature.get("properties", {})
        geometry = feature.get("geometry")
        event_id = feature.get("id")

        if not event_id or not geometry:
            return None

        coords = geometry.get("coordinates", [])
        if len(coords) < 3:
            return None

        longitude, latitude, depth = coords[0], coords[1], coords[2]
        magnitude = props.get("mag")
        event_time_ms = props.get("time")

        if any(v is None for v in [magnitude, latitude, longitude, depth, event_time_ms]):
            return None

        return {
            "event_id": event_id,
            "magnitude": float(magnitude),
            "latitude": float(latitude),
            "longitude": float(longitude),
            "depth": float(depth),
            "time": datetime.fromtimestamp(event_time_ms / 1000, tz=timezone.utc),
        }
    except (TypeError, ValueError, KeyError):
        return None


async def scrape_range(start_date: date, end_date: date) -> int:
    """Fetch earthquakes from USGS for the given date range and upsert into the database.

    Returns the number of new records inserted (conflicts on event_id are silently skipped).
    """
    async with httpx.AsyncClient(timeout=30, http2=False) as client:
        response = await client.get(USGS_API_URL, params=_build_params(start_date, end_date))
        response.raise_for_status()
        data = response.json()

    records = [_sanitise_feature(f) for f in data.get("features", [])]
    records = [r for r in records if r is not None]

    if not records:
        return 0

    async with AsyncSessionLocal() as session:
        stmt = insert(Earthquake).values(records).on_conflict_do_nothing(index_elements=["event_id"])
        result = await session.execute(stmt)
        await session.commit()

    return result.rowcount


async def scrape_all(years: int = 1, chunk_days: int = 7) -> None:
    """Scrape all earthquakes from the past `years` years, one chunk at a time.

    Chunks default to weekly to stay well within USGS rate limits and the 20,000
    events-per-response cap. A polite delay is applied between each request.
    """
    end = date.today()
    start = end.replace(year=end.year - years)

    chunks: list[tuple[date, date]] = []
    cursor = start
    while cursor < end:
        chunk_end = min(cursor + timedelta(days=chunk_days), end)
        chunks.append((cursor, chunk_end))
        cursor = chunk_end

    total_inserted = 0
    for i, (chunk_start, chunk_end) in enumerate(chunks, 1):
        print(f"[{i}/{len(chunks)}] {chunk_start} → {chunk_end} ... ", end="", flush=True)
        try:
            inserted = await scrape_range(chunk_start, chunk_end)
            total_inserted += inserted
            print(f"{inserted} new records")
        except httpx.HTTPStatusError as e:
            print(f"HTTP {e.response.status_code} — skipping")
        except httpx.RequestError as e:
            print(f"Request error: {e} — skipping")
        except Exception as e:
            print(f"Unexpected error: {type(e).__name__}: {e} — skipping")

        if i < len(chunks):
            await asyncio.sleep(REQUEST_DELAY_SECONDS)

    print(f"\nComplete. {total_inserted} new records inserted across {len(chunks)} requests.")


if __name__ == "__main__":
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(scrape_all())
