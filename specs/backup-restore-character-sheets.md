# Spec: Backup and Restore Character Sheets

## Summary
Allow users to download their character sheet as a JSON file and re-upload it to restore
the character to that saved state. Two buttons are added to the CharacterSheet header area.

## Current behaviour
No export/import functionality exists. Character data is only accessible through the live
session connected to the database.

## Requirements

### Download backup
1. A menu item labelled **"Download backup"** is present in the account dropdown (Navigation),
   in a new section separated from existing items by a theme-consistent border, but only
   visible when the user is on a character sheet page.
2. Clicking it immediately triggers a browser file download.
3. The downloaded file is named `{safeName}_{YYYY-MM-DD}.json` where:
   - `safeName` is the character name with filesystem-invalid characters replaced by `_`.
   - The original name is preserved verbatim inside the JSON `name` field.
   - The date is the current local date (ISO format).
4. The file contents are JSON with this envelope:
   ```json
   {
     "version": "1.0",
     "backupDate": "<ISO 8601 timestamp>",
     "name": "<character name — original, unescaped>",
     "data": { /* CharacterData */ }
   }
   ```

### Upload backup (restore)
5. A menu item labelled **"Upload backup"** is present in the account dropdown (Navigation),
   in the same separated section as "Download backup".
6. Clicking it opens a native file-picker filtered to `.json` files.
7. After file selection:
   a. The file is read client-side (no server round-trip for parsing).
   b. The JSON is validated — see validation rules below.
   c. If valid: the restored state is saved via the existing PUT API endpoint, then
      the character page re-loads the updated data. The CharacterSheet remounts with
      the new initial data.
   d. If invalid: a user-visible error message is shown in the status area;
      the existing character state is left unchanged.

### Validation rules
- Content must be valid JSON.
- Root object must have `name` (non-empty string) and `data` (object).
- `data` must contain all of: `alias`, `playbook`, `stress`, `harm`.
- Missing fields (added after the backup was made) are filled from `defaultCharacterData`.

## Design-token changes
None — uses existing stone/amber CSS classes consistent with the rest of the UI.

## Affected files
- `src/lib/characterBackup.ts` (new) — pure functions: `createBackupFilename`,
  `serializeBackup`, `parseAndValidateBackup`.
- `src/components/Navigation.tsx` — add backup section + file input.
- `src/app/character/[id]/page.tsx` — download/upload handlers, `restoreKey`, pass
  `characterActions` to Navigation.
- `jest.config.ts` (new) — Jest configuration.
- `jest.setup.ts` (new) — Jest setup file.
- `package.json` — add `test` script and Jest devDependencies.
- `src/__tests__/characterBackup.test.ts` (new) — unit tests.

## Acceptance criteria

| # | Given | When | Then |
|---|-------|------|------|
| 1 | A character sheet is open with name "Arden" | User clicks "Download backup" in account menu | Browser downloads `Arden_{today}.json` |
| 2 | A character sheet is open with name `A/B:C` | User clicks "Download backup" | Filename is `A_B_C_{today}.json`; JSON `name` field is `A/B:C` (original preserved) |
| 3 | A downloaded backup file exists | User selects it via "Upload backup" | Character restored (with original name), saved via API, sheet remounts |
| 4 | A non-JSON file is selected | Upload runs | Error message shown; character state unchanged |
| 5 | A JSON file missing `data.stress` is selected | Upload runs | Error message shown; character state unchanged |
| 6 | A backup from an older version (missing new fields) is uploaded | Upload runs | Missing fields filled from defaults; no error |
| 7 | User is not on a character page | Account menu opened | Backup section is not shown |

## Testing instructions
Run `npm test` from the project root. All tests in `src/__tests__/characterBackup.test.ts`
must pass.

## Implementation notes
- The backup/restore logic lives in a separate utility module (`characterBackup.ts`) so it
  can be tested without mounting React components.
- Download uses a temporary `<a>` element with `URL.createObjectURL` — no server route needed.
- Upload: Navigation holds a hidden `<input type="file" accept=".json">` triggered by the menu
  item click. It emits the raw `File` to the parent via `onUploadBackup(file)`. The character
  page reads, validates, saves via PUT API, updates state, and increments `restoreKey`.
- `<CharacterSheet key={restoreKey} ...>` remounts with fresh initial data after a restore.
- Navigation receives optional `characterActions` prop; backup items are only rendered when it
  is present (i.e. on the character sheet page). Other pages pass no `characterActions`.
- Filename uses `_` to replace chars invalid on Windows/macOS/Linux: `/ \ : * ? " < > |` and
  control characters. The original name (with special chars) is stored verbatim in the JSON
  `name` field so it is fully restored.

## Out of scope
- Server-side backup storage.
- Backup encryption.
- Backup history / versioning (covered by the separate "Restore previous states" feature).
