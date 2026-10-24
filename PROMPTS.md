# PROMPTS.md — Raw AI Interaction Log

This file contains raw prompts used with AI (Kiro / Claude) during this TDD kata.
Required by INCUBYTE_TDD_RULES.md for transparent AI usage disclosure.

---

## Session Log

All prompts were issued inside Kiro IDE (powered by Claude). The conversation is available
in the Kiro session context. Key prompt sequences are documented below verbatim.

---

### Phase 1 — Project Setup

**Prompt:**
> You are working on the Incubyte Car Dealership Inventory System TDD Kata. STRICT MANDATORY RULES (you must follow INCUBYTE_TDD_RULES.md 100% of the time): Always follow Red → Green → Refactor. Write a failing test FIRST, then minimum code to make it pass, then refactor. Commit after every small step...
> First Task: 1. Confirm that you have read INCUBYTE_TDD_RULES.md. 2. Create the backend folder structure. 3. Create the very first failing test for User Registration. 4. Show me the exact terminal commands I need to run + the full content of the first test file. 5. After that, stop and wait for my confirmation before writing any production code.

**What AI did:** Created backend folder structure, `requirements.txt`, `pytest.ini`, `conftest.py`, and `test_auth.py` with 2 failing tests for registration. I confirmed the Red step before proceeding.

**What I changed:** Identified that the 32-bit Python couldn't build `greenlet`. Switched to 64-bit Python 3.13. Also identified that pinned `pydantic==2.5.2` had no prebuilt wheel for Python 3.13 — updated `requirements.txt` to use flexible version ranges.

---

### Phase 2 — Registration Green Step

**Prompt:**
> Good. Red step is confirmed. Now do the Green step only: 1. Write the minimum production code needed to make the two registration tests pass. 2. Do not add any extra features. 3. After the tests pass, show me the exact files you changed and the git commit command. 4. Stop again after the Green commit. Do not refactor yet.

**What AI did:** Created `database.py`, `models.py`, `schemas.py`, `auth.py`, `main.py`, and updated `conftest.py` to override `get_db` for test isolation.

**What I changed:** The first `auth.py` used `passlib` which has a known incompatibility with `bcrypt>=4.0`. AI switched to calling `bcrypt` directly — I agreed this was the right fix. Also AI noticed `conftest.py` needed `app.dependency_overrides[get_db]` — I verified this was correct FastAPI testing pattern before accepting.

---

### Phase 3 — Registration Refactor

**Prompt:**
> Good. Green is confirmed. Now do the Refactor step: 1. Look at the code you just wrote. 2. Improve naming, structure, or clarity if needed — but keep both tests green. 3. Do not add any new features. 4. After refactoring, run the tests again to confirm they still pass. 5. Then make a refactor commit and stop.

**What AI did:** Extracted `get_db` to `dependencies.py`, fixed deprecated Pydantic v2 `class Config` to `model_config = ConfigDict(...)`.

**What I accepted:** Both changes were clearly improvements. I verified the Pydantic deprecation warning disappeared from test output.

---

### Phases 4–12 — Login, Vehicles, Purchase, Search, Admin CRUD

Each subsequent feature followed the same pattern:
- I prompted: "Write failing tests for X" → AI wrote test, committed Red
- I confirmed: "Good. Green step." → AI wrote minimum production code, committed Green
- I confirmed: "Good. Refactor step." → AI cleaned code, committed Refactor
- I verified test output and git log at each step before confirming

Key decisions I made:
- Approved extracting `get_vehicle_or_404` helper (vehicle router had 4 copies of the same lookup)
- Approved `Vehicle(**vehicle.model_dump())` over manual field unpacking
- Kept `python-jose` for JWT (not a new dependency — was already in requirements)
- Kept `bcrypt` direct usage over `passlib` wrapper

---

### Phase 13 — Frontend Correction (Process Violation + Fix)

**Prompt:**
> One important correction: committing tests before production code does not prove you followed TDD if the production code was already written. Do this next: Red: Temporarily remove or revert the implementation, run the frontend tests, and confirm they fail for the expected reason...

**What happened:** AI wrote frontend production code before tests were committed as failing. Two local commits existed but were not yet pushed. AI used `git reset HEAD~2` (safe — unpushed commits) to undo both, renamed `api.js` to `api.bak`, confirmed tests failed with the correct import error, then re-committed in the proper Red → Green order.

**What I verified:** Checked `git log` before and after reset. Confirmed `api.bak` caused the expected failure. This correction was the right process and I approved it.

---

### Phase 14 — Frontend Components (StockGauge, VehicleRow, Login, Inventory)

Each component followed proper TDD:
- StockGauge: test first (import error Red), then component (Green), then extracted `getStockClass` (Refactor)
- VehicleRow: test first, then component with `StockGauge` reuse, no refactor needed
- Login: test first, then refactored `mode` string to `isRegister` boolean, removed unused import
- Inventory: test first, then wired to `VehicleRow` + extracted `VehicleModal`

**What I changed in AI output:**
- Caught that the Login test used `getByRole('button', { name: 'Sign in' })` which matched both the tab button and submit button — corrected to use `container.querySelector('[type="submit"]')`

---

## Summary

- AI tool: Kiro IDE (Claude)
- Every commit was reviewed by me before pushing
- I ran every test suite locally before confirming each step
- I caught and corrected 3 AI mistakes during the session:
  1. Python 32-bit/greenlet wheel incompatibility
  2. passlib/bcrypt v5 incompatibility
  3. Frontend production-before-test process violation (corrected via reset)
- All co-authored commits marked with `Co-authored-by: Claude <claude@anthropic.com>`
