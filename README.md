# Incubyte Car Dealership Inventory System — TDD Kata

A car dealership inventory management system built using strict Test-Driven Development (Red → Green → Refactor) for the Incubyte assessment.

[![CI / CD Pipeline](https://github.com/DHYEYPATL/incubyte-car-dealership-tdd-kata/actions/workflows/ci.yml/badge.svg)](https://github.com/DHYEYPATL/incubyte-car-dealership-tdd-kata/actions/workflows/ci.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-brightgreen)](https://DHYEYPATL.github.io/incubyte-car-dealership-tdd-kata/)

---

## Live Demo & Repository Links

- **Live Frontend Demo**: [https://DHYEYPATL.github.io/incubyte-car-dealership-tdd-kata/](https://DHYEYPATL.github.io/incubyte-car-dealership-tdd-kata/)
- **GitHub Repository**: [https://github.com/DHYEYPATL/incubyte-car-dealership-tdd-kata](https://github.com/DHYEYPATL/incubyte-car-dealership-tdd-kata)

---

## What It Does

- Register and log in as an **admin** (manage inventory) or **user** (browse and purchase)
- View all vehicles in a stock-sheet table with a **stock gauge bar** (green/amber/empty)
- Search vehicles by make, model, category, or price range
- Search via `GET /api/vehicles` (with params) or the dedicated `GET /api/vehicles/search`
- Purchase a vehicle — quantity decreases by 1; button disabled when out of stock
- Admin: add, edit, delete, and restock vehicles

---

## Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI + SQLAlchemy + SQLite |
| Auth | JWT via python-jose, bcrypt for password hashing |
| Frontend | React + Vite + Tailwind CSS |
| Backend tests | pytest + httpx TestClient |
| Frontend tests | Vitest + Testing Library |
| CI / CD | GitHub Actions (automated test runner + GitHub Pages deployment) |

> **Styling & Design System:** Built with Tailwind CSS configured with custom automotive dealership tokens (Archivo typography, showroom steel/frost surfaces, asphalt text, turn-signal amber accents, and responsive stock-gauge status bars) adhering to strict visual rules in [`DESIGN.md`](./DESIGN.md).

---

## Setup and Run

### Requirements
- Python 3.13 (64-bit) — `py -3.13` or `python3.13`
- Node.js 18+

### Backend

```bash
# From repo root
py -3.13 -m venv backend/venv

# Windows
backend\venv\Scripts\activate

# Install dependencies
pip install -r backend/requirements.txt

# Run the server
uvicorn app.main:app --reload --app-dir backend
# Runs on http://localhost:8000
```

### Frontend

```bash
# From repo root
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173 (proxies /api to backend)
```

Open http://localhost:5173 — register an account, then log in.

---

## Run Tests

### Backend tests (from repo root)

```bash
backend\venv\Scripts\python.exe -m pytest backend/tests/ -v
```

Expected: **30 passed**

### Frontend tests (from frontend/)

```bash
cd frontend
npm test
```

Expected: **35 passed**

---

## Test Report

### Backend — 30 tests

```
test_auth.py (7) — register success, duplicate fails, login success, wrong password,
                   nonexistent user, configurable JWT secret via env, CORS headers
test_vehicles.py (23) — list, add (admin only), purchase (quantity/stock/404), search (make/model/
                         category/price range), dedicated /search endpoint, update (admin only),
                         delete (admin only), restock (admin only)
```

### Frontend — 35 tests

```
api.test.js (9)         — login, register, getVehicles (auth header, search param,
                          category+price params), purchase, createVehicle, updateVehicle, 401 clears token
auth.test.js (2)        — decodeToken: valid JWT payload, null for invalid/empty token
StockGauge.test.jsx (6) — quantity number, in-stock/low/out CSS classes,
                          fill width proportional to max, capped at 100%
VehicleRow.test.jsx (6) — renders make/model/category/price, Buy enabled when stock > 0,
                          Buy disabled (Sold out) when 0, calls onPurchase with id,
                          admin buttons shown/hidden by role
Login.test.jsx (6)      — tabs render, username/password fields, role field (register only),
                          api.login called with credentials, token stored on success,
                          error message on failure
Inventory.test.jsx (6)  — renders vehicle list from API, Buy enabled/disabled per stock,
                          empty state, admin buttons shown/hidden by role
```

---

## Git History — TDD Story

The commit history shows every Red → Green → Refactor cycle:

```
f2d1f35 test: add failing test for user registration
c12f616 feat: make registration tests pass
cc2ec12 refactor: extract get_db to dependencies, fix Pydantic v2 config
566cfba test: add failing tests for user login
766f6e3 feat: make login tests pass
ca12ee5 refactor: extract auth routes into router, collapse duplicate 401 check
09d8bff test: add failing tests for vehicle list, add, and role-based access
f76061f feat: make vehicle list, add, and role-based access tests pass
88071fa refactor: handle JWT errors, simplify vehicle creation, clean imports
abb304b test: add failing tests for vehicle purchase
ed12b63 feat: make purchase tests pass
3a4474c refactor: remove unnecessary db.refresh in purchase endpoint
7aa968b test: add failing tests for vehicle search
45f97ca feat: make vehicle search tests pass
0661fc2 test: add failing tests for admin update, delete, and restock
dbab1f3 feat: make admin update, delete, and restock tests pass
993543c refactor: extract get_vehicle_or_404 helper to reduce duplication
aec782e test: add failing frontend tests for API service and auth helpers
7278fb9 feat: implement api.js and auth.js service layer
423500b feat: add frontend UI shell - DESIGN.md, pages, CSS tokens, Vite config
4a2c275 test: add failing tests for StockGauge component
22566cd feat: implement StockGauge component
ce204c9 refactor: extract getStockClass helper, simplify StockGauge
ea23b1d test: add failing tests for VehicleRow component
9f0e966 feat: implement VehicleRow component
19a6437 test: add failing tests for Login page behaviour
3a1b21b refactor: replace mode string with isRegister bool, remove unused import
3d3985a test: add tests for Inventory page rendering and admin vs user views
e970cb9 feat: wire Inventory to VehicleRow and VehicleModal components
03185f5 test: add failing tests for category and price range filters
5ef21b4 feat: add category and price range filters to vehicle search
c956a94 refactor: extract handleEnter, move inline styles to CSS classes
c1f8c45 test: add failing tests for dedicated GET /api/vehicles/search endpoint
801d2db feat: add dedicated GET /api/vehicles/search endpoint
a7b505e refactor: extract apply_vehicle_filters to remove duplication
```

---

## My AI Usage

### Tools used
- **Kiro IDE** (powered by Claude) — used throughout the entire project as a pair programmer

### How I used AI

I used AI as a **junior pair programmer**, as instructed by `INCUBYTE_TDD_RULES.md`. The workflow:

1. I wrote the prompt describing the next small TDD step
2. AI suggested the test or production code
3. I reviewed every line, ran the tests myself, and confirmed the output
4. I approved, rejected, or modified before committing

### What I accepted vs what I rewrote

**Accepted as-is (after review):**
- Core FastAPI endpoint structure and SQLAlchemy patterns
- JWT encode/decode implementation using python-jose
- FastAPI dependency injection pattern for `get_current_user` / `require_admin`
- React component structure for StockGauge, VehicleRow, VehicleModal
- CSS token architecture in `index.css` following DESIGN.md

**Modified or corrected:**
- **Python environment**: AI suggested `passlib` + `bcrypt` which breaks on bcrypt>=5. I switched to calling `bcrypt` directly.
- **32-bit Python**: AI didn't know my default Python was 32-bit. I identified the `greenlet` build failure and switched to `py -3.13` (64-bit).
- **Test selectors**: Login tests used `getByRole('button', { name: 'Sign in' })` which matched both the tab and submit button. I fixed to `querySelector('[type="submit"]')`.
- **Process violation**: AI committed frontend production code before running failing tests. I caught this, used `git reset HEAD~2` to undo the unpushed commits, proved the tests failed without the code, then recommitted in the correct order.

### Impact and reflection

The AI accelerated the mechanical parts (boilerplate FastAPI routes, SQLAlchemy models, React state management). The TDD discipline — deciding *what* to test, verifying the failures are meaningful, catching the process violation — required my own judgment.

The `PROMPTS.md` file contains the full interaction log.

Every line of AI-generated code was reviewed. I can explain and modify any of it.

---

## Screenshots

### Login / Register
![Login](./screenshots/login.png)

### Inventory – User View
![User Inventory](./screenshots/inventory-user.png)

### Inventory – Admin View
![Admin Inventory](./screenshots/inventory-admin.png)

### Out of Stock (Buy disabled)
![Out of Stock](./screenshots/out-of-stock.png)
