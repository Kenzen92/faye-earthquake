from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.earthquake import Earthquake
from app.schemas.earthquake import EarthquakeRead

router = APIRouter(prefix="/earthquakes", tags=["earthquakes"])


@router.get("", response_model=list[EarthquakeRead])
async def list_earthquakes(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Earthquake).order_by(Earthquake.time.desc()))
    return result.scalars().all()


@router.get("/map-events", response_model=list[EarthquakeRead])
async def list_earthquakes_on_map(
    db: AsyncSession = Depends(get_db),
    min_magnitude: float | None = None,
    max_magnitude: float | None = None,
    limit: int = 100,
):
    query = select(Earthquake).order_by(Earthquake.time.desc())
    if min_magnitude is not None:
        query = query.where(Earthquake.magnitude >= min_magnitude)
    if max_magnitude is not None:
        query = query.where(Earthquake.magnitude <= max_magnitude)
    query = query.limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{earthquake_id}", response_model=EarthquakeRead)
async def get_earthquake(earthquake_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Earthquake).where(Earthquake.id == earthquake_id))
    earthquake = result.scalar_one_or_none()
    if earthquake is None:
        raise HTTPException(status_code=404, detail="Earthquake not found")
    return earthquake