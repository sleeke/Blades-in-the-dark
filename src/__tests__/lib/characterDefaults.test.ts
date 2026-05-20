/**
 * Schema-protection tests for defaultCharacterData and related constants.
 *
 * These tests act as a safety net against accidental database-breaking changes:
 * if a field is renamed, removed, or its type changed, a test here will fail
 * before the migration reaches production.
 *
 * No mocks or network calls are needed — only the pure in-memory defaults.
 */

import { describe, it, expect } from 'vitest';
import {
  defaultCharacterData,
  PLAYBOOKS,
  HERITAGES,
  BACKGROUNDS,
  VICE_TYPES,
  LOAD_OPTIONS,
  STANDARD_ITEMS,
  ACTION_DESCRIPTIONS,
} from '@/lib/characterDefaults';

// ── Identity fields ────────────────────────────────────────────────────────

describe('defaultCharacterData — identity', () => {
  it('has all required identity string fields', () => {
    const { alias, playbook, heritage, heritageDetail, background, backgroundDetail, look, vice, vicePurveyor } =
      defaultCharacterData;
    for (const field of [alias, playbook, heritage, heritageDetail, background, backgroundDetail, look, vice, vicePurveyor]) {
      expect(typeof field).toBe('string');
    }
  });
});

// ── Numeric fields ─────────────────────────────────────────────────────────

describe('defaultCharacterData — numeric fields', () => {
  it('stress and trauma start at 0', () => {
    expect(defaultCharacterData.stress).toBe(0);
    expect(defaultCharacterData.trauma).toBe(0);
  });

  it('economy fields (coins, stash) start at 0', () => {
    expect(defaultCharacterData.coins).toBe(0);
    expect(defaultCharacterData.stash).toBe(0);
  });

  it('XP tracks start at 0', () => {
    expect(defaultCharacterData.insightXp).toBe(0);
    expect(defaultCharacterData.prowessXp).toBe(0);
    expect(defaultCharacterData.resolveXp).toBe(0);
    expect(defaultCharacterData.playbookXp).toBe(0);
  });

  it('healingClock and projectClock start at 0', () => {
    expect(defaultCharacterData.healingClock).toBe(0);
    expect(defaultCharacterData.projectClock).toBe(0);
  });
});

// ── Trauma conditions ──────────────────────────────────────────────────────

describe('defaultCharacterData — traumaConditions', () => {
  const CONDITIONS = ['Cold', 'Haunted', 'Obsessed', 'Paranoid', 'Reckless', 'Soft', 'Unstable', 'Vicious'] as const;

  it('has all 8 trauma conditions', () => {
    expect(Object.keys(defaultCharacterData.traumaConditions)).toHaveLength(8);
  });

  it.each(CONDITIONS)('condition "%s" exists and defaults to false', (condition) => {
    expect(defaultCharacterData.traumaConditions[condition]).toBe(false);
  });
});

// ── XP triggers ────────────────────────────────────────────────────────────

describe('defaultCharacterData — xpTriggers', () => {
  it('has violence, beliefs, and viceTrauma triggers starting at 0', () => {
    expect(defaultCharacterData.xpTriggers).toMatchObject({
      violence: 0,
      beliefs: 0,
      viceTrauma: 0,
    });
  });
});

// ── Actions ────────────────────────────────────────────────────────────────

describe('defaultCharacterData — action ratings', () => {
  const ACTIONS = ['hunt', 'study', 'survey', 'tinker', 'finesse', 'prowl', 'skirmish', 'wreck', 'attune', 'command', 'consort', 'sway'] as const;

  it.each(ACTIONS)('action "%s" starts at 0', (action) => {
    expect(defaultCharacterData[action]).toBe(0);
  });

  it('has descriptions for all 12 actions', () => {
    expect(Object.keys(ACTION_DESCRIPTIONS)).toHaveLength(12);
    for (const action of ACTIONS) {
      expect(ACTION_DESCRIPTIONS[action]).toBeDefined();
    }
  });
});

// ── Harm ───────────────────────────────────────────────────────────────────

describe('defaultCharacterData — harm', () => {
  it('has all 5 harm slots as empty strings', () => {
    const { level3, level2a, level2b, level1a, level1b } = defaultCharacterData.harm;
    for (const slot of [level3, level2a, level2b, level1a, level1b]) {
      expect(slot).toBe('');
    }
  });
});

// ── Armor ──────────────────────────────────────────────────────────────────

describe('defaultCharacterData — armor', () => {
  it('has used, heavyUsed, and specialUsed all defaulting to false', () => {
    expect(defaultCharacterData.armor).toMatchObject({
      used: false,
      heavyUsed: false,
      specialUsed: false,
    });
  });
});

// ── Load ───────────────────────────────────────────────────────────────────

describe('defaultCharacterData — load', () => {
  it('defaults to "normal"', () => {
    expect(defaultCharacterData.load).toBe('normal');
  });

  it('LOAD_OPTIONS contains light, normal, and heavy', () => {
    expect(LOAD_OPTIONS).toContain('light');
    expect(LOAD_OPTIONS).toContain('normal');
    expect(LOAD_OPTIONS).toContain('heavy');
  });
});

// ── Standard items ─────────────────────────────────────────────────────────

describe('defaultCharacterData — standardItems', () => {
  it('has an entry for every item defined in STANDARD_ITEMS', () => {
    for (const item of STANDARD_ITEMS) {
      expect(defaultCharacterData.standardItems).toHaveProperty(item.key);
    }
  });

  it('all standard items start as unequipped (false)', () => {
    for (const value of Object.values(defaultCharacterData.standardItems)) {
      expect(value).toBe(false);
    }
  });
});

// ── Friends ────────────────────────────────────────────────────────────────

describe('defaultCharacterData — friends', () => {
  it('has exactly 5 friend slots', () => {
    expect(defaultCharacterData.friends).toHaveLength(5);
  });

  it('each slot has name, isFriend, and isRival fields', () => {
    for (const friend of defaultCharacterData.friends) {
      expect(friend).toMatchObject({ name: '', isFriend: false, isRival: false });
    }
  });
});

// ── Gather info answers ────────────────────────────────────────────────────

describe('defaultCharacterData — gatherInfoAnswers', () => {
  it('has exactly 7 answer slots', () => {
    expect(defaultCharacterData.gatherInfoAnswers).toHaveLength(7);
  });

  it('all slots start as empty strings', () => {
    for (const answer of defaultCharacterData.gatherInfoAnswers) {
      expect(answer).toBe('');
    }
  });
});

// ── Reference constants ────────────────────────────────────────────────────

describe('reference constants', () => {
  it('PLAYBOOKS has 6 entries', () => {
    expect(PLAYBOOKS).toHaveLength(6);
  });

  it('HERITAGES has 6 entries', () => {
    expect(HERITAGES).toHaveLength(6);
  });

  it('BACKGROUNDS has 7 entries', () => {
    expect(BACKGROUNDS).toHaveLength(7);
  });

  it('VICE_TYPES has 7 entries', () => {
    expect(VICE_TYPES).toHaveLength(7);
  });

  it('STANDARD_ITEMS has 15 entries', () => {
    expect(STANDARD_ITEMS).toHaveLength(15);
  });

  it('each STANDARD_ITEM has key, label, and a positive load', () => {
    for (const item of STANDARD_ITEMS) {
      expect(typeof item.key).toBe('string');
      expect(typeof item.label).toBe('string');
      expect(item.load).toBeGreaterThan(0);
    }
  });
});
