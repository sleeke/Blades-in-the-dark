# Code Review — Backup and Restore Character Sheets

**Date:** 2026-05-19  
**Scope:** `src/lib/characterBackup.ts`, `src/components/Navigation.tsx`, `src/app/character/[id]/page.tsx`, `src/__tests__/characterBackup.test.ts`

---

## Summary

| Severity | Count |
|----------|-------|
| 🔴 Critical | 0 |
| 🟡 Medium | 0 |
| 🟢 Low | 2 |
| ℹ️ Info | 2 |

No blockers. Safe to proceed to quality gate.

---

## Findings

### 🟢 Low — Upload error message is never automatically cleared

**File:** `src/app/character/[id]/page.tsx`  
**Context:** `uploadError` state is shown in the header but only cleared on the next
successful upload. If the user manually corrects the file and uploads successfully, it
clears — but if they navigate away and back, the error will reappear.

**Suggested improvement (not required):** Clear `uploadError` on successful upload
(already done), and optionally after a timeout.

**Decision:** Acceptable. Clearing on success is handled; the error is informational.

---

### 🟢 Low — No client-side file size cap on upload

**File:** `src/app/character/[id]/page.tsx` — `handleUploadBackup`  
**Context:** `FileReader.readAsText` will attempt to read any file the user selects,
regardless of size. A large file won't crash the app but wastes memory and causes a
confusing validation error.

**Suggested improvement:** Add a guard:
```ts
if (file.size > 1_048_576) { // 1 MB
  setUploadError('File is too large. Please select a valid backup file.');
  return;
}
```

**Decision:** Acceptable for now; character sheet JSON files are typically < 50 KB.

---

### ℹ️ Info — `characterActions` object created inline causes Navigation re-renders

**File:** `src/app/character/[id]/page.tsx`  
**Context:** `characterActions={{ onDownloadBackup, onUploadBackup }}` is a new object
reference on every render, so Navigation receives a changed `characterActions` prop even
when nothing meaningful changed. Since both handlers are `useCallback` with stable deps,
a `useMemo` wrapper would avoid this.

**Impact:** Negligible — the character page renders infrequently.

---

### ℹ️ Info — Backup `data` is merged with defaults before server write

**File:** `src/app/character/[id]/page.tsx` — `handleUploadBackup`  
**Context:** `parseAndValidateBackup` merges the backup `data` with `defaultCharacterData`
to fill any gaps from older backups. The merged data is then sent directly to the PUT
endpoint. This means fields added after the backup was created are reset to defaults —
which is the correct, documented behaviour.

No change needed. Documented for future reference.

---

## Security assessment

- All parsing is client-side only; no trust boundary is crossed without server
  authentication (the PUT API enforces `getServerSession` ownership check).
- No user input is injected into DOM without sanitisation — the backup `name` is used
  only as a state value, never rendered as raw HTML.
- `URL.createObjectURL` is revoked immediately after use.
- No secrets are read from or written to the backup file.
