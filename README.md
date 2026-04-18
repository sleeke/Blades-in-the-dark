# Blades in the Dark — Character Sheet Manager

A web application for players of [Blades in the Dark](https://bladesinthedark.com/) to create, manage, and persist their character sheets online.

## Features

- **User authentication** — register and sign in with email and password
- **Character sheet editor** — full BITD character sheet with:
  - Text fields (identity, alias, playbook, heritage, background, vice, notes)
  - Checkboxes (special abilities, items, trauma conditions)
  - Counters with +/− buttons (stress, trauma, coins, stash)
  - Dot-style action ratings (Hunt, Finesse, Sway, etc.) and XP trackers
- **Cloud persistence** — characters are saved to a Vercel Postgres database
- **Dark fantasy theme** — atmospheric UI with amber/gold accents on a dark stone palette

## Stack

- [Next.js 16](https://nextjs.org) (App Router)
- [NextAuth.js](https://next-auth.js.org/) — credential-based auth with JWT sessions
- [@vercel/postgres](https://vercel.com/docs/storage/vercel-postgres) — serverless PostgreSQL
- [Tailwind CSS v4](https://tailwindcss.com/) — utility-first styling
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) — secure password hashing

## Getting Started

### 1. Clone and install

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

| Variable | Description |
|---|---|
| `POSTGRES_URL` | Vercel Postgres connection string |
| `NEXTAUTH_SECRET` | Random secret for JWT signing (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | App URL (e.g. `http://localhost:3000`) |

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you will be redirected to the login page.

The database tables are created automatically on first use.

### 4. Preview without login

Visit [http://localhost:3000/demo](http://localhost:3000/demo) to see the character sheet UI with sample data, no login required.

## Testing

The project uses [Vitest](https://vitest.dev/) for unit tests. No running database or
server is needed — all external dependencies (database, auth) are mocked.

### Running the tests

```bash
# Run the full test suite once
npm test

# Run in watch mode (re-runs on file change)
npm run test:watch
```

### Test coverage

| File | What it covers |
|------|----------------|
| `src/__tests__/api/characters.test.ts` | `GET /api/characters` and `POST /api/characters` — authentication guard, list retrieval, character creation, and default-data seeding |
| `src/__tests__/api/characters-id.test.ts` | `GET /api/characters/[id]`, `PUT /api/characters/[id]`, and `DELETE /api/characters/[id]` — authentication guard, ownership enforcement, validation, update, and delete |
| `src/__tests__/lib/characterDefaults.test.ts` | Schema-protection tests for `defaultCharacterData` — verifies that every field, nested object, array length, and reference constant (playbooks, heritages, items, etc.) retains its expected shape so accidental refactors are caught before they reach the database |

### CI

The tests run automatically on every pull request via the GitHub Actions workflow
defined in `.github/workflows/test.yml`. A PR cannot be considered ready until all
tests are green.

## Deployment

Deploy to [Vercel](https://vercel.com/) and add a Vercel Postgres database from the Storage tab of your project. The `POSTGRES_*` environment variables will be populated automatically.
