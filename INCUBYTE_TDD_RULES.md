# Incubyte Car Dealership TDD Kata – Mandatory Process Rules

**This file is non-negotiable. Follow every rule 100% of the time. No exceptions. No shortcuts. No "I'll fix the history later".**

## Core Philosophy (Memorize This)

Incubyte does **not** primarily filter on “does the app work” or how pretty the UI is.  
They filter on **process evidence**:

1. Visible Red-Green-Refactor in Git history
2. Ability to explain and modify every line of code
3. Clean code + structure over features
4. Meaningful tests (not just coverage numbers)
5. Transparent and owned AI usage
6. Core requirements actually working

They shortlist people who demonstrate **craft process** (TDD history + clean ownership + honest AI use) more than people who ship the flashiest full-stack app.

---

## 1. Mandatory Development Workflow (Red-Green-Refactor)

**You must follow this cycle for every single piece of functionality:**

1. **Red** – Write a failing test first. Commit it.
2. **Green** – Write the absolute minimum code to make the test pass. Commit it.
3. **Refactor** – Clean the code while keeping tests green. Commit it.

### Commit Rules (Critical – Most Common Rejection Reason)

- Commit **early and often**. Target **15–40 small commits** for the whole project.
- Every commit message must narrate the TDD step:
  - `test: add failing test for user registration`
  - `feat: make registration test pass`
  - `refactor: extract validation logic from auth service`
- Never commit a large working feature in one go.
- Never rewrite history. Never squash. Never force-push.
- If you use AI, add the co-author trailer (see AI section).

**Forbidden**:
- Big bang commits
- “feat: implement entire auth system”
- Committing working code without a preceding failing test commit

---

## 2. Project Structure Rules

- Keep a **neat, conventional directory structure**.
- Backend and frontend must be clearly separated.
- No god files. No 300+ line files.
- Clear naming. Small functions/classes. Single Responsibility.
- SOLID-ish without over-engineering.
- Proper error handling everywhere.
- Prefer the stack you know deeply (FastAPI / Node + React is fine). Do **not** pick a new stack just to impress.

Recommended high-level structure:

```
/
├── backend/
│   ├── tests/
│   ├── app/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   └── package.json
├── README.md
├── PROMPTS.md
├── DESIGN.md
└── INCUBYTE_TDD_RULES.md
```

---

## 3. Testing Rules

- Write **meaningful tests** that protect real behaviour.
- Required coverage areas:
  - Auth (register, login, invalid credentials, invalid/missing JWT)
  - Role-based access (admin-only endpoints must reject normal users)
  - Quantity = 0 (purchase must fail / button disabled)
  - Search filters (make, model, category, price range)
  - Edge cases and error paths
- Happy-path-only or copy-paste tests are harmful.
- Tests must be readable and serve as documentation.

---

## 4. AI Usage Rules (Strict Transparency)

AI is allowed and expected, but must be treated as a **junior pair programmer**.

### Mandatory for every AI-assisted commit:
```
git commit -m "feat: implement X

Used AI for Y. I then changed Z because...

Co-authored-by: Tool Name <AI@users.noreply.github.com>"
```

### Required files:
- `PROMPTS.md` at root → raw, unedited AI chat logs or public links (no summaries).
- `README.md` must contain a detailed section titled **"My AI Usage"** that explains:
  - Which tools you used
  - Exactly how you used them
  - What you accepted vs what you rewrote
  - Reflection on impact

**You must be able to explain and modify every line of AI-generated code.**  
Hiding AI usage or claiming “I wrote everything” when the code smells AI = rejection.

---

## 5. Feature Build Order (Vertical Slices)

Do **not** build everything at once.

Mandatory order:

1. Auth (register + login + JWT) + basic protected route
2. List vehicles + Purchase (quantity decreases)
3. Search / filter
4. Admin-only: Add / Update / Delete / Restock
5. Frontend UI that clearly distinguishes Admin vs Normal user
6. Polish, extra edge cases, deployment

Make admin vs normal user behaviour **obviously different** in both API and UI.

---

## 6. Core Requirements That Must Work

These are non-negotiable. Missing any = easy reject.

**Backend**
- `POST /api/auth/register`
- `POST /api/auth/login`
- JWT-protected routes
- `POST /api/vehicles` (admin)
- `GET /api/vehicles`
- `GET /api/vehicles/search` (make, model, category, price range)
- `PUT /api/vehicles/:id`
- `DELETE /api/vehicles/:id` (admin only)
- `POST /api/vehicles/:id/purchase` (decreases quantity)
- `POST /api/vehicles/:id/restock` (admin only)

**Frontend**
- Register / Login
- Vehicle list + search/filter
- Purchase button (disabled when quantity = 0)
- Admin forms for add/update/delete/restock

---

## 7. Deliverables Checklist (Must All Exist)

- Public Git repository
- Comprehensive README.md containing:
  - Project explanation
  - Exact setup & run instructions (backend + frontend)
  - Screenshots
  - **My AI Usage** section
- Test report (output of your test suite)
- Root `PROMPTS.md` with raw AI logs
- (Optional but recommended) Live deployed link

Before submitting: clone the repo on a clean machine and follow your own README. Broken setup = instant reject.

---

## 8. What Usually Kills Submissions (Avoid These)

- Commit history that does not show clear Red-Green-Refactor
- Cannot explain or change the code in the next interview round
- Missing auth / roles / quantity logic
- AI used but not declared or not understood
- Messy, unreadable, or over-engineered code
- Incomplete deliverables (missing PROMPTS.md, AI section, or test report)
- Big commits or rewritten history

---

## 9. Working Rules for the AI Assistant

When helping with this project you must:

1. Always start with a failing test before writing production code.
2. Suggest the next small commit message after every meaningful change.
3. Refuse to generate large chunks of code without corresponding tests.
4. After any AI-generated code, force a review + refactor step.
5. Remind about co-authored-by and PROMPTS.md updates.
6. Prefer simple, readable solutions over clever ones.
7. Keep frontend clean and functional — no fancy animations.
8. Continuously check that the Git history still tells a clear TDD story.

**If a request would violate any rule above, refuse and explain which rule is being broken.**

---

## Final Standard

The strongest signal is:

> A Git history that reads like a disciplined TDD story  
> + clean, explainable, owned code  
> + honest AI usage  

Everything else is secondary.

Follow these rules 100% of the time. No exceptions.
