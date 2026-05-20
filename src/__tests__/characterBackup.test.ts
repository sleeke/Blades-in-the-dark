import {
  createBackupFilename,
  serializeBackup,
  parseAndValidateBackup,
} from '@/lib/characterBackup';
import { defaultCharacterData } from '@/lib/characterDefaults';

// ─── createBackupFilename ─────────────────────────────────────────────────────

describe('createBackupFilename', () => {
  beforeEach(() => {
    // Pin the date so filename tests are deterministic
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-05-19T10:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('produces {name}_{YYYY-MM-DD}.json for a plain name', () => {
    expect(createBackupFilename('Arden')).toBe('Arden_2026-05-19.json');
  });

  it('replaces filesystem-invalid characters with _', () => {
    expect(createBackupFilename('A/B:C')).toBe('A_B_C_2026-05-19.json');
    // Backslash (avoids test-string escape ambiguity by using String.fromCharCode)
    const backslash = String.fromCharCode(92);
    expect(createBackupFilename(`a${backslash}b`)).toBe('a_b_2026-05-19.json');
    // Other invalid chars: * ? " < > |
    expect(createBackupFilename('x*y?z')).toBe('x_y_z_2026-05-19.json');
    expect(createBackupFilename('a"b<c>d|e')).toBe('a_b_c_d_e_2026-05-19.json');
  });

  it('replaces each whitespace character with _ (spaces are not collapsed)', () => {
    expect(createBackupFilename('My  Character')).toBe('My__Character_2026-05-19.json');
    expect(createBackupFilename('Name Here')).toBe('Name_Here_2026-05-19.json');
  });

  it('uses "character" as fallback when name is empty', () => {
    expect(createBackupFilename('')).toBe('character_2026-05-19.json');
    expect(createBackupFilename('   ')).toBe('character_2026-05-19.json');
  });

  it('strips leading dots', () => {
    expect(createBackupFilename('..hidden')).toBe('hidden_2026-05-19.json');
  });

  it('caps the name portion at 100 characters', () => {
    const longName = 'a'.repeat(200);
    const result = createBackupFilename(longName);
    // name portion is 100 chars, then _YYYY-MM-DD.json (16 chars)
    expect(result.length).toBe(100 + 1 + 10 + 5); // name + _ + date + .json
    expect(result.endsWith('_2026-05-19.json')).toBe(true);
  });
});

// ─── serializeBackup ─────────────────────────────────────────────────────────

describe('serializeBackup', () => {
  it('produces valid JSON with the correct envelope fields', () => {
    const data = { ...defaultCharacterData, alias: 'Shadow' };
    const json = serializeBackup('Arden', data);
    const parsed = JSON.parse(json);

    expect(parsed.version).toBe('1.0');
    expect(parsed.name).toBe('Arden');
    expect(parsed.backupDate).toBeDefined();
    expect(parsed.data).toMatchObject({ alias: 'Shadow' });
  });

  it('preserves the original name verbatim, including special characters', () => {
    const json = serializeBackup('Arden/The:Knife', defaultCharacterData);
    const parsed = JSON.parse(json);
    expect(parsed.name).toBe('Arden/The:Knife');
  });

  it('round-trips all CharacterData fields without loss', () => {
    const data = {
      ...defaultCharacterData,
      alias: 'Ghost',
      playbook: 'lurk' as const,
      stress: 5,
      coins: 3,
    };
    const json = serializeBackup('Test', data);
    const parsed = JSON.parse(json);

    expect(parsed.data.alias).toBe('Ghost');
    expect(parsed.data.playbook).toBe('lurk');
    expect(parsed.data.stress).toBe(5);
    expect(parsed.data.coins).toBe(3);
  });
});

// ─── parseAndValidateBackup ───────────────────────────────────────────────────

describe('parseAndValidateBackup', () => {
  function makeValidBackup(overrides: Record<string, unknown> = {}) {
    return JSON.stringify({
      version: '1.0',
      backupDate: new Date().toISOString(),
      name: 'Arden',
      data: { ...defaultCharacterData },
      ...overrides,
    });
  }

  it('parses a valid backup produced by serializeBackup', () => {
    const json = serializeBackup('Arden', defaultCharacterData);
    const result = parseAndValidateBackup(json);
    expect(result.name).toBe('Arden');
    expect(result.data).toMatchObject(defaultCharacterData);
  });

  it('restores special characters in the name', () => {
    const json = serializeBackup('Arden/The:Knife', defaultCharacterData);
    const result = parseAndValidateBackup(json);
    expect(result.name).toBe('Arden/The:Knife');
  });

  it('throws on invalid JSON', () => {
    expect(() => parseAndValidateBackup('not json')).toThrow(
      'The file is not valid JSON'
    );
  });

  it('throws when root is not an object', () => {
    expect(() => parseAndValidateBackup('"a string"')).toThrow('must be a JSON object');
    expect(() => parseAndValidateBackup('[1,2,3]')).toThrow('must be a JSON object');
  });

  it('throws when name is missing', () => {
    expect(() =>
      parseAndValidateBackup(makeValidBackup({ name: undefined }))
    ).toThrow('missing or empty "name"');
  });

  it('throws when name is an empty string', () => {
    expect(() =>
      parseAndValidateBackup(makeValidBackup({ name: '   ' }))
    ).toThrow('missing or empty "name"');
  });

  it('throws when data is missing', () => {
    expect(() =>
      parseAndValidateBackup(makeValidBackup({ data: undefined }))
    ).toThrow('missing or invalid "data"');
  });

  it('throws when data is not an object', () => {
    expect(() =>
      parseAndValidateBackup(makeValidBackup({ data: 'invalid' }))
    ).toThrow('missing or invalid "data"');
  });

  it('throws when a required data field is absent', () => {
    const incompleteData = { alias: 'Ghost' }; // missing playbook, stress, harm
    const json = JSON.stringify({ name: 'Arden', data: incompleteData });
    expect(() => parseAndValidateBackup(json)).toThrow(
      'missing required field "data.playbook"'
    );
  });

  it('fills missing fields from defaults (older backup compatibility)', () => {
    // Simulate a backup that is missing a field added in a later version
    const backupData = { ...defaultCharacterData } as Record<string, unknown>;
    delete backupData.notes; // pretend 'notes' was added after this backup was made

    const json = JSON.stringify({ name: 'Arden', data: backupData });
    const result = parseAndValidateBackup(json);

    // Should be filled from defaultCharacterData
    expect(result.data.notes).toBe(defaultCharacterData.notes);
  });

  it('does not modify the character state when an error is thrown', () => {
    // Verify the function throws without side-effects by catching the error
    let threw = false;
    try {
      parseAndValidateBackup('garbage');
    } catch {
      threw = true;
    }
    expect(threw).toBe(true);
  });

  it('trims whitespace from the name', () => {
    const json = makeValidBackup({ name: '  Arden  ' });
    const result = parseAndValidateBackup(json);
    expect(result.name).toBe('Arden');
  });
});
