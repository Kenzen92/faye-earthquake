from datetime import datetime

from sqlalchemy import DateTime, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Earthquake(Base):
    __tablename__ = "earthquakes"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    magnitude: Mapped[float]
    latitude: Mapped[float]
    longitude: Mapped[float]
    altitude: Mapped[float]
    depth: Mapped[float]
    time: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
