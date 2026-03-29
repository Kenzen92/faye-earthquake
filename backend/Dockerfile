FROM python:3.13-slim

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

# Copy workspace root files (uv needs both to resolve the lockfile)
COPY pyproject.toml uv.lock ./
COPY backend/pyproject.toml ./backend/

RUN uv sync --no-dev --no-install-workspace

COPY backend/alembic.ini ./backend/
COPY backend/migrations/ ./backend/migrations/
COPY backend/app/ ./backend/app/

ENV PATH="/app/.venv/bin:$PATH"

EXPOSE 8000
CMD ["sh", "-c", "cd /app/backend && alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
