"""
Populate the database with sample earthquake data.
Run from the backend/ directory:
    python -m scripts.seed
"""
import asyncio
from datetime import datetime, timezone

from sqlalchemy import delete

from app.database import AsyncSessionLocal
from app.models.earthquake import Earthquake

SAMPLE_DATA = [
    Earthquake(
        magnitude=7.1,
        latitude=35.6762,
        longitude=139.6503,
        depth=10.0,
        time=datetime(2024, 1, 1, 6, 30, 0, tzinfo=timezone.utc),
    ),
    Earthquake(
        magnitude=5.4,
        latitude=-33.8688,
        longitude=151.2093,
        depth=22.5,
        time=datetime(2024, 3, 15, 14, 10, 0, tzinfo=timezone.utc),
    ),
    Earthquake(
        magnitude=6.8,
        latitude=37.7749,
        longitude=-122.4194,
        depth=8.3,
        time=datetime(2024, 6, 20, 9, 45, 0, tzinfo=timezone.utc),
    ),
    Earthquake(
        magnitude=4.2,
        latitude=51.5074,
        longitude=-0.1278,
        depth=15.0,
        time=datetime(2024, 9, 5, 3, 22, 0, tzinfo=timezone.utc),
    ),
    Earthquake(
        magnitude=8.0,
        latitude=-13.1631,
        longitude=-72.5450,
        depth=30.0,
        time=datetime(2024, 11, 30, 18, 0, 0, tzinfo=timezone.utc),
    ),
]


async def seed():
    async with AsyncSessionLocal() as session:
        await session.execute(delete(Earthquake))
        session.add_all(SAMPLE_DATA)
        await session.commit()
    print(f"Seeded {len(SAMPLE_DATA)} earthquakes.")


if __name__ == "__main__":
    asyncio.run(seed())
