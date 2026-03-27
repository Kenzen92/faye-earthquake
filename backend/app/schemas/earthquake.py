from pydantic import BaseModel
from datetime import datetime


class EarthquakeBase(BaseModel):
    magnitude: float
    latitude: float
    longitude: float
    altitude: float
    depth: float
    time: datetime


class EarthquakeCreate(EarthquakeBase):
    pass


class EarthquakeRead(EarthquakeBase):
    id: int

    model_config = {"from_attributes": True}
