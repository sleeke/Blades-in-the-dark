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

## Deployment

Deploy to [Vercel](https://vercel.com/) and add a Vercel Postgres database from the Storage tab of your project. The `POSTGRES_*` environment variables will be populated automatically.
