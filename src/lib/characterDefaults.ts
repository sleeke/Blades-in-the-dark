/** Default character sheet data for a new character */
export const defaultCharacterData = {
  // Identity
  alias: '',
  playbook: '',
  heritage: '',
  background: '',
  vice: '',
  lookDescription: '',

  // Attributes & stress
  stress: 0,
  trauma: 0,
  coins: 0,
  stash: 0,
  xp: 0,
  playbookXp: 0,

  // Trauma checkboxes
  traumaConditions: {
    Cold: false,
    Haunted: false,
    Obsessed: false,
    Paranoid: false,
    Reckless: false,
    Soft: false,
    Unstable: false,
    Vicious: false,
  },

  // Actions (rated 0–4)
  hunt: 0,
  study: 0,
  survey: 0,
  tinker: 0,
  finesse: 0,
  prowl: 0,
  skirmish: 0,
  wreck: 0,
  attune: 0,
  command: 0,
  consort: 0,
  sway: 0,

  // Abilities (special abilities the character has unlocked)
  abilities: {
    'Battleborn': false,
    'Bodyguard': false,
    'Dangerous': false,
    'Ghost Veil': false,
    'Iron Will': false,
    'Sharpened Awareness': false,
  },

  // Items carried
  items: {
    'Sword': false,
    'Dagger': false,
    'Pistol': false,
    'Fine Clothes': false,
    'Toolkit': false,
    'Lantern': false,
  },

  // Notes
  notes: '',
};

export type CharacterData = typeof defaultCharacterData;
