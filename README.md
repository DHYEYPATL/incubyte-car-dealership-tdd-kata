# Incubyte Car Dealership Inventory System — TDD Kata

A car dealership inventory management system built using strict Test-Driven Development (Red → Green → Refactor) for the Incubyte assessment.

---

## What It Does

- Register and log in as an **admin** (manage inventory) or **user** (browse and purchase)
- View all vehicles in a stock-sheet table with a **stock gauge bar** (green/amber/empty)
- Search vehicles by make or model (case-insensitive)
- Purchase a vehicle — quantity decreases by 1; button disabled when out of stock
- Admin: add, edit, delete, and restock vehicles

---

## Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI + SQLAlchemy + SQLite |
| Auth | JWT via python-jose, bcrypt for password hashing |
| Frontend | React + Vite |
| Backend tests | pytest + httpx TestClient |
| Frontend tests | Vitest + Testing Library |

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

Expected: **23 passed**

### Frontend tests (from frontend/)

```bash
cd frontend
npm test
```

Expected: **33 passed**

---

## Test Report

### Backend — 23 tests

```
test_auth.py::test_register_user_success PASSED
test_auth.py::test_register_duplicate_user_fails PASSED
test_auth.py::test_login_success_returns_jwt PASSED
test_auth.py::test_login_wrong_password_returns_401 PASSED
test_auth.py::test_login_nonexistent_user_returns_401 PASSED
test_vehicles.py::test_get_vehicles_empty PASSED
test_vehicles.py::test_admin_can_add_vehicle PASSED
test_vehicles.py::test_non_admin_cannot_add_vehicle PASSED
test_vehicles.py::test_purchase_decreases_quantity PASSED
test_vehicles.py::test_purchase_out_of_stock_returns_400 PASSED
test_vehicles.py::test_purchase_nonexistent_vehicle_returns_404 PASSED
test_vehicles.py::test_search_returns_matching_vehicles PASSED
test_vehicles.py::test_search_no_matches_returns_empty PASSED
test_vehicles.py::test_search_requires_authentication PASSED
test_vehicles.py::test_admin_can_update_vehicle PASSED
test_vehicles.py::test_non_admin_cannot_update_vehicle PASSED
test_vehicles.py::test_update_nonexistent_vehicle_returns_404 PASSED
test_vehicles.py::test_admin_can_delete_vehicle PASSED
test_vehicles.py::test_non_admin_cannot_delete_vehicle PASSED
test_vehicles.py::test_delete_nonexistent_vehicle_returns_404 PASSED
test_vehicles.py::test_admin_can_restock_vehicle PASSED
test_vehicles.py::test_non_admin_cannot_restock_vehicle PASSED
test_vehicles.py::test_restock_nonexistent_vehicle_returns_404 PASSED
```

### Frontend — 33 tests

```
api.test.js (7) — API service: login, register, getVehicles, purchase, create, 401 handling
auth.test.js (2) — JWT decode: valid payload, invalid/null token
StockGauge.test.jsx (6) — quantity display, in-stock/low/out classes, fill width, cap at 100%
VehicleRow.test.jsx (6) — render fields, Buy enabled/disabled, onPurchase callback, admin buttons
Login.test.jsx (6) — tabs, fields, role field, api call, token storage, error display
Inventory.test.jsx (6) — render list, Buy/Sold out states, empty state, admin vs user views
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

> **Note:** To add screenshots, run both servers (`uvicorn` and `npm run dev`), open http://localhost:5173, and take screenshots at 1440px and 390px wide.
>
> Pending: login page, inventory table (user view), inventory table (admin view), out-of-stock state.
