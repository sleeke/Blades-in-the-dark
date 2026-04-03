---
name: workspace-instructions
description: "Workspace-level instructions for GitHub Copilot Chat in this repository. Use when interacting with code, files, or the dev workflow here."
applyTo: "**"
---

Purpose
-------
These instructions encode project-specific preferences and safe defaults for the Copilot Chat agent when working in this repository.

User Context
------------
- Assume the user is **learning the tech stack** (Next.js, TypeScript, NextAuth, Vercel Postgres, Tailwind CSS). Do not assume prior familiarity.
- When introducing any concept, library, API, or pattern that wasn't explicitly taught earlier in the conversation, **explain it clearly**: what it is, why it is used here, and how it works.
- Prefer plain language over jargon. If jargon must be used, define it inline.
- When making code changes, explain *what* was changed, *why* it was needed, and *what effect* it has at runtime.
- If there are multiple valid approaches, briefly describe the tradeoffs so the user can build intuition.

Rules (enforced)
-----------------
- Use the `manage_todo_list` tool for any multi-step or multi-file task and keep it up to date.
- When referring to filenames, paths, or symbols in this workspace, wrap them in backticks (e.g., `src/lib/db.ts`).
- Always include a 1–2 sentence preamble before running tools describing what will be done.
- Keep messages concise and actionable; default to ≤10 lines unless more detail is requested.
- Never volunteer the model name unless explicitly asked.
- Use `apply_patch` to edit files; make minimal, focused changes and avoid reformatting unrelated code.
- Load applicable `SKILL.md` files (via `read_file`) before performing skill-related actions.
- Do not print or paste secrets from env files; if asked, redact and instruct how to rotate secrets.

Validation & Workflow
---------------------
- After edits, run the relevant local check (build/tests/lint) and report results.
- If a change touches runtime behavior (env, DB, auth), list manual verification steps.

Examples (prompts to try)
------------------------
- "Run `npm run build`, report errors, and create a failing unit test if present."
- "Patch `src/lib/db.ts` to use pooled connections for Vercel Postgres and run the app locally."

Notes
-----
These instructions are workspace-scoped and will be loaded for requests about this repo. Keep them focused and update as conventions evolve.
