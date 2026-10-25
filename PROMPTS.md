# PROMPTS.md — AI Interaction & Prompt Log

This document provides a complete, transparent record of all AI prompts, system directives, and human oversight during the development of the Incubyte Car Dealership Inventory System TDD Kata.

---

## 1. Initial System Prompt & Mandatory Process Rules

The following structured directives from `INCUBYTE_TDD_RULES.md` were established at the very beginning of the AI pair programming session to enforce strict Red → Green → Refactor discipline and eliminate shortcuts.

```text
================================================================================
SYSTEM DIRECTIVE & INITIATION PROMPT
================================================================================
You are pair programming on the Incubyte Car Dealership Inventory System TDD Kata.
You must strictly follow the rules defined below 100% of the time. No shortcuts.
No "I'll fix history later".

CORE PHILOSOPHY:
Incubyte filters on process evidence:
1. Visible Red-Green-Refactor in Git history
2. Ability to explain and modify every line of code
3. Clean code + structure over features
4. Meaningful tests (not just coverage numbers)
5. Transparent and owned AI usage
6. Core requirements actually working

MANDATORY DEVELOPMENT WORKFLOW:
For every piece of functionality:
  1. RED: Write a failing test first. Commit it.
  2. GREEN: Write minimum code to make it pass. Commit it.
  3. REFACTOR: Clean the code while keeping tests green. Commit it.

COMMIT RULES:
- Commit early and often (15–40 small commits).
- Every commit message must narrate the TDD step:
  test: add failing test for...
  feat: make test pass for...
  refactor: extract/clean...
- Never commit working features without a preceding failing test commit.
- Never squash, rewrite history, or force-push.
- Include AI co-author trailer on every AI-assisted commit:
  Co-authored-by: Claude <claude@anthropic.com>

CORE REQUIREMENTS THAT MUST WORK:
Backend:
- POST /api/auth/register
- POST /api/auth/login
- JWT-protected routes
- POST /api/vehicles (admin)
- GET /api/vehicles
- GET /api/vehicles/search (make, model, category, price range)
- PUT /api/vehicles/:id
- DELETE /api/vehicles/:id (admin only)
- POST /api/vehicles/:id/purchase (decreases quantity)
- POST /api/vehicles/:id/restock (admin only)

Frontend:
- User registration and login
- Vehicle list + search & filtering
- Purchase button (disabled when quantity == 0)
- Admin forms for add, update, delete, and restock

WORKING RULES FOR THE AI ASSISTANT:
1. Always start with a failing test before writing production code.
2. Suggest the next small commit message after every meaningful change.
3. Refuse to generate large chunks of code without corresponding tests.
4. After any AI-generated code, force a review + refactor step.
5. Remind about co-authored-by and PROMPTS.md updates.
6. Prefer simple, readable solutions over clever ones.
7. Keep frontend clean and functional.
8. Continuously check that Git history tells a clear TDD story.
================================================================================
```

---

## 2. Chronological Prompt & Interaction History

### Phase 1 — Project Setup & Initial Failing Test
**Prompt:**
> You are working on the Incubyte Car Dealership Inventory System TDD Kata. STRICT MANDATORY RULES (you must follow INCUBYTE_TDD_RULES.md 100% of the time): Always follow Red → Green → Refactor. Write a failing test FIRST, then minimum code to make it pass, then refactor. Commit after every small step...  
> First Task:  
> 1. Confirm that you have read INCUBYTE_TDD_RULES.md.  
> 2. Create the backend folder structure.  
> 3. Create the very first failing test for User Registration.  
> 4. Show me the exact terminal commands I need to run + the full content of the first test file.  
> 5. After that, stop and wait for my confirmation before writing any production code.

- **What AI did:** Created backend structure, `requirements.txt`, `pytest.ini`, `conftest.py`, and `test_auth.py` with 2 failing tests for user registration (`test_register_user_success`, `test_register_duplicate_user_fails`).
- **Human Verification & Changes:**  
  1. Identified that 32-bit Python could not compile `greenlet`. Switched to 64-bit Python 3.13 (`py -3.13`).
  2. Caught that `pydantic==2.5.2` had no prebuilt wheel for Python 3.13; adjusted `requirements.txt` to flexible version ranges (`pydantic>=2.5`).
  3. Ran pytest locally and confirmed tests failed with expected `ImportError: cannot import name 'app' from 'app.main'`.
  4. Committed Red: `f2d1f35 test: add failing test for user registration`.

---

### Phase 2 — Registration Green Step
**Prompt:**
> Good. Red step is confirmed. Now do the Green step only:  
> 1. Write the minimum production code needed to make the two registration tests pass.  
> 2. Do not add any extra features.  
> 3. After the tests pass, show me the exact files you changed and the git commit command.  
> 4. Stop again after the Green commit. Do not refactor yet.

- **What AI did:** Created `database.py`, `models.py`, `schemas.py`, `auth.py`, `main.py`, and updated `conftest.py` with `app.dependency_overrides[get_db]`.
- **Human Verification & Changes:**  
  1. The initial suggestion included `passlib`, which has deprecated internals that fail on `bcrypt>=4.0`. Changed implementation to use `bcrypt` directly.
  2. Verified test pass (2 passed).
  3. Committed Green: `c12f616 feat: make registration tests pass`.

---

### Phase 3 — Registration Refactor Step
**Prompt:**
> Good. Green is confirmed. Now do the Refactor step:  
> 1. Look at the code you just wrote.  
> 2. Improve naming, structure, or clarity if needed — but keep both tests green.  
> 3. Do not add any new features.  
> 4. After refactoring, run the tests again to confirm they still pass.  
> 5. Then make a refactor commit and stop.

- **What AI did:** Extracted `get_db` to `dependencies.py` to prevent cyclic imports; updated Pydantic v2 `class Config` to `model_config = ConfigDict(from_attributes=True)`.
- **Human Verification & Changes:** Confirmed elimination of deprecation warnings; verified both tests still passed.
- **Commit:** `cc2ec12 refactor: extract get_db to dependencies, fix Pydantic v2 config`.

---

### Phase 4 — User Login & JWT Authentication
**Prompt:**
> Write failing tests for user login: successful login returning JWT access token, invalid password returning 401, nonexistent user returning 401, configurable secret key via env, and CORS headers.

- **What AI did:** Added login test cases to `backend/tests/test_auth.py`.
- **Commit Cycle:**
  - Red: `566cfba test: add failing tests for user login`
  - Green: `766f6e3 feat: make login tests pass` (added `LoginRequest`, `TokenResponse`, password verification, JWT generation)
  - Refactor: `ca12ee5 refactor: extract auth routes into router, collapse duplicate 401 check`

---

### Phases 5–12 — Vehicles: List, Roles, Purchase, Search, and Admin CRUD
Each vehicle feature was implemented through strict isolated iterations:

1. **Vehicle List, Add & Role-Based Access:**
   - Red: `09d8bff test: add failing tests for vehicle list, add, and role-based access`
   - Green: `f76061f feat: make vehicle list, add, and role-based access tests pass`
   - Refactor: `88071fa refactor: handle JWT errors, simplify vehicle creation, clean imports`
2. **Vehicle Purchase (Decrements Quantity, 400 when 0):**
   - Red: `abb304b test: add failing tests for vehicle purchase`
   - Green: `ed12b63 feat: make purchase tests pass`
   - Refactor: `3a4474c refactor: remove unnecessary db.refresh in purchase endpoint`
3. **Vehicle Search & Filters:**
   - Red: `7aa968b test: add failing tests for vehicle search`
   - Green: `45f97ca feat: make vehicle search tests pass`
4. **Admin Update, Delete, and Restock:**
   - Red: `0661fc2 test: add failing tests for admin update, delete, and restock`
   - Green: `dbab1f3 feat: make admin update, delete, and restock tests pass`
   - Refactor: `993543c refactor: extract get_vehicle_or_404 helper to reduce duplication`

---

### Phase 13 — Frontend Process Correction (Caught & Resolved)
**Prompt:**
> One important correction: committing tests before production code does not prove you followed TDD if the production code was already written. Do this next:  
> Red: Temporarily remove or revert the implementation, run the frontend tests, and confirm they fail for the expected reason...

- **What happened:** AI generated both `api.js` implementation and tests simultaneously.
- **Human Intervention:** Detected process violation. Executed `git reset HEAD~2` on unpushed commits, moved `api.js` to `api.bak`, ran `vitest`, proved failure with `Cannot find module './api'`, committed Red, restored `api.js`, proved Green, and committed Green.
- **Commit Cycle:**
  - Red: `aec782e test: add failing frontend tests for API service and auth helpers`
  - Green: `7278fb9 feat: implement api.js and auth.js service layer`

---

### Phase 14 — Frontend UI Components & Ledger Layout
**Prompt:**
> Implement frontend components according to DESIGN.md: StockGauge, VehicleRow, Login tabs, and Inventory dashboard with admin controls. Follow TDD for each component.

- **Component Iterations:**
  - `StockGauge`: Red (`4a2c275`), Green (`22566cd`), Refactor (`ce204c9` - extracted `getStockClass`)
  - `VehicleRow`: Red (`ea23b1d`), Green (`9f0e966`)
  - `Login`: Red (`19a6437`), Refactor (`3a1b21b`) — human fixed button query ambiguity between tab and submit buttons
  - `Inventory`: Red (`3d3985a`), Green (`e970cb9` - wired `VehicleRow` + `VehicleModal`)

---

### Phase 15 — Search Endpoint Refinement
**Prompt:**
> Add category and price range filters, and a dedicated GET /api/vehicles/search endpoint as requested by the kata brief.

- Red: `03185f5 test: add failing tests for category and price range filters`
- Green: `5ef21b4 feat: add category and price range filters to vehicle search`
- Refactor: `c956a94 refactor: extract handleEnter, move inline styles to CSS classes`
- Red: `c1f8c45 test: add failing tests for dedicated GET /api/vehicles/search endpoint`
- Green: `801d2db feat: add dedicated GET /api/vehicles/search endpoint`
- Refactor: `a7b505e refactor: extract apply_vehicle_filters to remove duplication`

---

### Phase 16 — Tailwind CSS Integration & CI/CD Pipeline
**Prompt:**
> Implement all remaining optional and stack requirements to achieve a 100% comprehensive submission:  
> 1. Integrate Tailwind CSS into the frontend with custom theme tokens mapped to DESIGN.md colors and typography.  
> 2. Ensure all 35 frontend tests continue to pass and production build succeeds.  
> 3. Add GitHub Actions CI/CD workflow (.github/workflows/ci.yml) to automatically run pytest and Vitest on every push and deploy live demo to GitHub Pages.

- **What AI did:** Configured `tailwind.config.js` and `postcss.config.js`, added `@tailwind` directives in `index.css`, created `.github/workflows/ci.yml`, and added `base` config in `vite.config.js`.
- **Human Verification:** Verified `npm test` (35 passed) and `npm run build` (clean bundle). Tested clean clone from GitHub to verify setup instructions.

---

## 3. Human Oversight & Reflection Summary

- **Total Backend Tests:** 30 passing
- **Total Frontend Tests:** 35 passing
- **Primary AI Pairing Tool:** Kiro IDE (powered by Claude)
- **Reviewer:** 100% human oversight on every commit
- **Key Interventions:**
  1. Resolved Python architecture/wheel build issues (64-bit switch).
  2. Fixed deprecated `passlib` cryptography bugs by moving to standard `bcrypt`.
  3. Enforced TDD integrity when AI attempted to write frontend production code ahead of tests.
  4. Ensured all commits adhere to the Red → Green → Refactor narrative with proper co-author trailers.
