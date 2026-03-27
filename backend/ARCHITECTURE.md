# Backend Architecture

## Layers

### 1. ORM Model (`app/models/earthquake.py`)
Defines the database table. Inherits from `Base` (SQLAlchemy `DeclarativeBase`), which tracks all models for schema management.

```
Earthquake (Base)
  id          → primary key, indexed
  magnitude   → float
  latitude    → float
  longitude   → float
  altitude    → float
  depth       → float
  time        → datetime (event time)
  created_at  → datetime (auto-set by DB on insert)
```

### 2. Pydantic Schemas (`app/schemas/earthquake.py`)
Define the API request/response shapes. No database knowledge — used for validation and serialisation only.

| Schema | Purpose |
|---|---|
| `EarthquakeBase` | Shared fields (all except `id`) |
| `EarthquakeCreate` | POST request body (inherits Base, no `id`) |
| `EarthquakeRead` | Response body (includes `id`, `from_attributes=True` to convert from ORM) |

`from_attributes=True` is what allows `EarthquakeRead.model_validate(orm_object)` to work — it reads fields from object attributes rather than a dict.

### 3. Migrations (`migrations/`)
Managed by Alembic. The `env.py` imports `Base.metadata` (via `app.models`) and connects to the DB URL from `app/config.py`.

```
# create a new migration after changing a model
alembic revision --autogenerate -m "description"

# apply pending migrations
alembic upgrade head

# roll back one migration
alembic downgrade -1
```

Migration files live in `migrations/versions/` and are committed to git — equivalent to Django's `migrations/` directory.

## Data flow (example: POST /earthquakes)

```
Request JSON
    → EarthquakeCreate (Pydantic validates)
    → Earthquake (SQLAlchemy ORM object)
    → INSERT via AsyncSession
    → EarthquakeRead.model_validate(result)
    → Response JSON
```
