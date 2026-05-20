import { CharacterData, defaultCharacterData } from './characterDefaults';

const BACKUP_VERSION = '1.0';

export interface CharacterBackup {
  version: string;
  backupDate: string;
  name: string;
  data: CharacterData;
}

/**
 * Creates a safe filename for the backup: "{safeName}_{YYYY-MM-DD}.json"
 * Characters that are invalid in filenames on Windows, macOS, or Linux are replaced with "_".
 * The original name is stored verbatim inside the JSON so it is fully preserved on restore.
 */
export function createBackupFilename(characterName: string): string {
  const rawName = characterName.trim() || 'character';
  const safeName = rawName
    .replace(/[\x00-\x1f\x7f]/g, '')       // strip control characters
    .replace(/[^a-zA-Z0-9._\-]/g, '_')      // replace all chars not safe in filenames
    .replace(/^\.+/, '')                     // strip leading dots (hidden files on macOS/Linux)
    .slice(0, 100) || 'character';           // cap length; fallback if result is empty
  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return `${safeName}_${date}.json`;
}

/**
 * Serializes a character's name and data into a JSON backup string.
 * The `name` field stores the original name verbatim (including any special characters).
 */
export function serializeBackup(name: string, data: CharacterData): string {
  const backup: CharacterBackup = {
    version: BACKUP_VERSION,
    backupDate: new Date().toISOString(),
    name,
    data,
  };
  return JSON.stringify(backup, null, 2);
}

/**
 * Parses and validates a backup file's JSON content.
 * Missing fields (added after the backup was created) are filled from defaultCharacterData.
 * Throws a descriptive Error if the file is not a valid character sheet backup.
 */
export function parseAndValidateBackup(content: string): { name: string; data: CharacterData } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error('The file is not valid JSON. Please select a valid backup file.');
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error('Invalid backup: file content must be a JSON object.');
  }

  const obj = parsed as Record<string, unknown>;

  if (typeof obj.name !== 'string' || obj.name.trim() === '') {
    throw new Error('Invalid backup: missing or empty "name" field.');
  }

  if (typeof obj.data !== 'object' || obj.data === null || Array.isArray(obj.data)) {
    throw new Error('Invalid backup: missing or invalid "data" field.');
  }

  const data = obj.data as Record<string, unknown>;

  // Validate a minimum set of required fields to confirm this is a character sheet backup
  const requiredFields = ['alias', 'playbook', 'stress', 'harm'] as const;
  for (const field of requiredFields) {
    if (!(field in data)) {
      throw new Error(
        `Invalid backup: missing required field "data.${field}". This file may not be a character sheet backup.`
      );
    }
  }

  // Merge with defaults to fill in any fields added after the backup was made
  const mergedData: CharacterData = {
    ...defaultCharacterData,
    ...(obj.data as Partial<CharacterData>),
  };

  return { name: obj.name.trim(), data: mergedData };
}
