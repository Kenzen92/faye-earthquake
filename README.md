# Faye Earthquake

A full-stack web app with a Python backend, PostgreSQL database, and React frontend.

---

## What you need before you start

Install all of these on your computer first. Each name is a link to the download page.

| Tool | What it does | Check if installed |
|---|---|---|
| [Python 3.13+](https://www.python.org/downloads/) | Runs the backend | `python --version` |
| [uv](https://docs.astral.sh/uv/getting-started/installation/) | Manages Python packages | `uv --version` |
| [Node.js 20+](https://nodejs.org/) | Runs the frontend | `node --version` |
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | Runs the database | `docker --version` |
| [Git](https://git-scm.com/downloads) | Downloads the code | `git --version` |

> To check if something is already installed, open a terminal and type the command in the last column. If you see a version number, you have it. If you see an error, you need to install it.

---

## Download the project

Open a terminal and run:

```bash
git clone https://github.com/your-username/faye-earthquake.git
cd faye-earthquake
```

> Replace `your-username` with the actual GitHub username.

---

## Option A — Run everything with Docker (easiest)

This starts the database, backend, and frontend all at once. Docker Desktop must be open.

```bash
docker compose up --build
```

Then open your browser:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- API docs: http://localhost:8080/docs

To stop everything, press `Ctrl + C` in the terminal, then run:

```bash
docker compose down
```

---

## Option B — Run each part separately (for development)

This lets you see code changes instantly without rebuilding Docker images.

You will need **three separate terminal windows** open at the same time.

### Step 1 — Start the database

In terminal 1, from the `faye-earthquake` folder:

```bash
docker compose up db -d
```

The `-d` means it runs in the background. You only need to do this once per session.

To check it started correctly:

```bash
docker compose ps
```

You should see `faye-earthquake-db-1` with status `healthy`.

---

### Step 2 — Start the backend

In terminal 2, go into the backend folder:

```bash
cd faye-earthquake/backend
```

Install the Python packages (first time only):

```bash
uv sync
```

Start the server:

```bash
uv run uvicorn app.main:app --reload --port 8080
```

You should see:
```
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8080
```

Test it is working by opening http://localhost:8080/health in your browser. You should see:
```json
{"status": "ok"}
```

---

### Step 3 — Start the frontend

In terminal 3, go into the frontend folder:

```bash
cd faye-earthquake/frontend
```

Install the JavaScript packages (first time only):

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

You should see:
```
VITE ready in ...ms
Local: http://localhost:5173/
```

Open http://localhost:5173 in your browser. You should see the Faye Earthquake homepage with two green "Connected" badges.

---

## Project structure

```
faye-earthquake/
├── docker-compose.yml      # runs all services together
├── backend/                # Python API (FastAPI)
│   ├── app/
│   │   ├── main.py         # API entry point
│   │   ├── config.py       # settings (database URL etc.)
│   │   ├── database.py     # database connection
│   │   └── routers/
│   │       └── health.py   # /health and /health/db routes
│   └── pyproject.toml      # Python package config
└── frontend/               # React app (Vite)
    └── src/
        └── App.tsx         # main page
```

---

## Common problems

**`uv: command not found`**
You need to install uv. Follow the instructions at https://docs.astral.sh/uv/getting-started/installation/

**`docker: command not found`**
Make sure Docker Desktop is installed and open.

**`port is already in use`**
Something else on your computer is using that port. Stop the other program, or ask for help.

**The database badge shows "Unavailable"**
Make sure Step 1 (the database) is running. Check with `docker compose ps`.

**`npm: command not found`**
You need to install Node.js from https://nodejs.org/
