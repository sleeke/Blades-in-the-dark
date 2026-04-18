# Project Instructions

## What this repository is

A reusable, generic set of GitHub Copilot agent definitions (`.agent.md` files) that
form an automated development pipeline. These agents are designed to be copied into
**any** repository — they must remain technology-agnostic and discover the target
project's stack at runtime.

## Architecture

Three-tier agent hierarchy:

| Tier | Role | Agents |
|------|------|--------|
| **1** | Intent routing | Orchestrator |
| **2** | Workflow coordination | Feature Delivery, Refactor, Release Manager |
| **3** | Specialist execution | Spec Expander, Implementer, Code Reviewer, Architect, Quality Gate, Designer, Scribe, Deployer, Mentor |

Data flows through shared artefacts:
- `plan/ROADMAP.md` — feature backlog
- `plan/BUG_TRACKER.md` — bug tracking
- `specs/` — generated specification files (created by spec-expander)
- `agent-output/` — reports and reviews (created at runtime)

## Conventions for agent files

- **Location:** `.github/agents/<name>.agent.md`
- **Frontmatter:** YAML between `---` markers. Required fields: `name` (or `description`), `tools`.
- **Language-agnostic:** Never hard-code language, framework, or tool names in agent
  instructions. Use generic terms like "test command", "build tool", "entry point".
  Agents discover specifics from the target project's config files and
  `copilot-instructions.md`.
- **One responsibility per agent.** If an agent does two unrelated things, split it.
- **Cross-references:** When an agent delegates to another, reference by name
  (e.g. "invoke the implementer agent"), not by file path.
- **Tier discipline:** Tier 1 routes, Tier 2 orchestrates workflows, Tier 3 executes
  a single specialist task. Never skip tiers in delegation.

## Key files

- [ADAPTING.md](../ADAPTING.md) — instructions for adapting agents to a target repository
- [.github/agents/README.md](agents/README.md) — agent system overview, data flow, invocation examples
- [plan/ROADMAP.md](../plan/ROADMAP.md) — feature backlog for this repo's own development

## When editing agent instructions

1. Read the agent file and its section in `.github/agents/README.md` before modifying.
2. Preserve the agent's tier and single-responsibility scope.
3. Keep instructions generic — no language-specific examples unless clearly marked as
   illustrative (e.g. inside a "Template" section of `ADAPTING.md`).
4. If adding a new agent, also update `.github/agents/README.md` (overview table and
   data flow diagram) and the orchestrator's routing table.
5. Test trigger phrases and argument-hint examples mentally — would a user reasonably
   type them?

---

## Blades in the Dark — App-Specific Context

### Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router) |
| Language | TypeScript 5 |
| Database | PostgreSQL via `pg` — raw SQL, no ORM |
| Auth | NextAuth.js v4 · JWT strategy · CredentialsProvider · bcryptjs |
| Styling | Tailwind CSS v4 |
| Tests | Vitest · mocked dependencies (no real DB or server needed) |

### Key source files

| File | Purpose |
|---|---|
| `src/lib/db.ts` | All PostgreSQL queries; creates `users` and `characters` tables |
| `src/lib/characterDefaults.ts` | `defaultCharacterData` object + all game constants (playbooks, actions, items…) |
| `src/lib/auth.ts` | NextAuth configuration |
| `src/app/api/characters/route.ts` | `GET` (list) / `POST` (create) character endpoints |
| `src/app/api/characters/[id]/route.ts` | `GET` / `PUT` / `UPDATE` / `DELETE` single-character endpoints |
| `src/components/CharacterSheet.tsx` | Main character-editor UI with 1.5 s auto-save debounce |
| `vitest.config.ts` | Vitest configuration (uses `vite-tsconfig-paths` for `@/` alias) |
| `.github/workflows/test.yml` | CI — runs `npm test` on every pull request |

### Database schema

```sql
-- users
id SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE, password_hash VARCHAR(255),
username VARCHAR(100), created_at TIMESTAMP

-- characters
id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
name VARCHAR(255) DEFAULT 'Unnamed Character',
data JSONB NOT NULL DEFAULT '{}',
created_at TIMESTAMP, updated_at TIMESTAMP
```

Character game-state lives in the `data` JSONB column as `defaultCharacterData`
(see `src/lib/characterDefaults.ts`).

### Testing requirements

These requirements apply to all current and future tests in this repository:

1. **No UI-content dependency** — tests must not rely on visible text, labels, or
   structural HTML. Use element IDs or `data-testid` attributes when interacting with
   the DOM.
2. **Minimal coverage** — each test proves a single behaviour; avoid duplicating
   assertions already made elsewhere.
3. **No real external services** — unit tests must mock all database and auth calls.
   Tests must pass in CI without a Postgres connection or `NEXTAUTH_SECRET`.
4. **Schema protection** — the shape of `defaultCharacterData` and its nested objects
   (trauma conditions, harm slots, actions, friends, items…) must be covered by
   assertions in `src/__tests__/lib/characterDefaults.test.ts`.  Any rename or removal
   of a persisted field must cause at least one test to fail.
5. **CRUD coverage** — every HTTP method on every character API route
   (`/api/characters` and `/api/characters/[id]`) must have test cases for:
   - unauthenticated → 401
   - authenticated + success path
   - authenticated + not-found / invalid-input path
6. **CI gate** — `npm test` must be green before a PR is merged.
   The workflow is defined in `.github/workflows/test.yml`.

### Running the tests locally

```bash
npm test          # single run
npm run test:watch  # watch mode
```

### Commands

| Task | Command |
|---|---|
| Dev server | `npm run dev` |
| Production build | `npm run build` |
| Lint | `npm run lint` |
| Run tests | `npm test` |
| Tests in watch mode | `npm run test:watch` |
