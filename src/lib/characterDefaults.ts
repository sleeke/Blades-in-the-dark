// ─── Playbook definitions ────────────────────────────────────────────────────

export type Playbook =
  | 'cutter'
  | 'hound'
  | 'leech'
  | 'lurk'
  | 'slide'
  | 'whisper'
  | '';

export const PLAYBOOKS: Playbook[] = ['cutter', 'hound', 'leech', 'lurk', 'slide', 'whisper'];

export const HERITAGES = [
  'Akoros',
  'The Dagger Isles',
  'Iruvia',
  'Severos',
  'Skovlan',
  'Tycheros',
] as const;

export const BACKGROUNDS = [
  'Academic',
  'Labor',
  'Law',
  'Trade',
  'Military',
  'Noble',
  'Underworld',
] as const;

export const VICE_TYPES = [
  'Faith',
  'Gambling',
  'Luxury',
  'Obligation',
  'Pleasure',
  'Stupor',
  'Weird',
] as const;

export const LOAD_OPTIONS = ['light', 'normal', 'heavy'] as const;
export type LoadOption = (typeof LOAD_OPTIONS)[number];
export const LOAD_CAPACITY: Record<LoadOption, number> = {
  light: 3,
  normal: 5,
  heavy: 6,
};

// ─── Action descriptions ─────────────────────────────────────────────────────

export const ACTION_DESCRIPTIONS: Record<string, string> = {
  hunt: 'Track a target, gather information through observation, detect a threat.',
  study: "Closely examine details, read a person's intentions, do research.",
  survey: 'Observe a situation, assess an area, spot an opportunity or danger.',
  tinker: 'Fiddle with devices, build or repair, disable mechanisms.',
  finesse: 'Employ dexterous manipulation or subtle misdirection.',
  prowl: 'Move stealthily, traverse obstacles, avoid detection.',
  skirmish: 'Engage a target in close fighting, grapple, overpower them.',
  wreck: 'Unleash savage force, apply mayhem, smash obstacles.',
  attune: 'Open your mind to the ghost field, sense presence of spirits, channel power.',
  command: 'Compel swift obedience with skills and force of will.',
  consort: 'Socialize with connections, wine and dine, gather information.',
  sway: 'Convince with guile, persuasion or seduction.',
};

// ─── Harm descriptions ───────────────────────────────────────────────────────

export const HARM_LEVEL_LABELS = {
  level3: 'Need Help — you cannot act unless a friend assists you',
  level2: 'Reduced Effect — you suffer -1d to all rolls',
  level1: 'Weakened Effect — you have less effect on your actions',
} as const;

// ─── Playbook-specific data ───────────────────────────────────────────────────

export const PLAYBOOK_SPECIAL_ABILITIES: Record<string, { name: string; description: string }[]> = {
  cutter: [
    { name: 'Battleborn', description: 'You may expend your special armor to resist a consequence of attack in combat, or to push yourself during a fight.' },
    { name: 'Bodyguard', description: 'When you protect a teammate, take +1d to your resistance roll. When you gather info to anticipate possible threats in the current situation, you get +1 effect.' },
    { name: 'Ghost Fighter', description: 'You may imbue your fists, blade, or other held items with spirit energy. You can struggle with a ghost or demon as if it were a physical being, even if it\'s insubstantial.' },
    { name: 'Leader', description: 'When you Command a cohort in combat, they continue to fight when they might otherwise break (you don\'t need to make a fortune roll to rally them). When you lead a group action, you can suffer only 1 stress at most, regardless of how many failed rolls there are.' },
    { name: 'Mule', description: 'Your load limits are higher. Light: 5. Normal: 7. Heavy: 8.' },
    { name: 'Not to Be Trifled With', description: "You can push yourself to do one of the following: perform a feat of physical force that verges on the superhuman — engage a small gang on equal footing in close combat." },
    { name: 'Savage', description: "When you unleash physical violence, it's especially frightening. When you Command a frightened target, gain +1d." },
    { name: 'Vigorous', description: 'You recover from harm faster. Permanently fill your 3rd (severe) harm box. Take +1d to healing treatment rolls.' },
    { name: 'Veteran', description: 'Choose a special ability from another playbook.' },
  ],
  hound: [
    { name: 'Sharpshooter', description: 'You can push yourself to do one of the following: make a ranged attack at extreme distance beyond what\'s normally possible — unleash a barrage of rapid fire to suppress the enemy.' },
    { name: 'Focused', description: 'You may expend your special armor to resist a consequence of surprise or mental harm, or to push yourself for ranged combat or tracking.' },
    { name: 'Ghost Hunter', description: 'Your hunting pet is imbued with spirit energy. It can hunt and attack spirits, ghosts, or demons as if they were physical beings. When you yourself attack a spirit with a physical weapon, you may take 2 stress to do so.' },
    { name: 'Scout', description: 'When you gather info to learn the details of an upcoming engagement, you get +1 effect. When you Survey a target from a safe position before an action, take +1d.' },
    { name: 'Survivor', description: 'Each time you roll a desperate action, gain +1 xp in that attribute (in addition to the regular xp you get).' },
    { name: 'Tough as Nails', description: 'Penalties from harm are one level less severe (though level 4 harm is still fatal).' },
    { name: 'Vengeful', description: 'You gain an additional xp trigger: you got payback against someone who harmed you or someone you care about. If your target is a person, the xp trigger is: you got payback against them.' },
    { name: 'Veteran', description: 'Choose a special ability from another playbook.' },
  ],
  leech: [
    { name: 'Alchemist', description: 'When you invent or craft a creation with unreliable alchemicals, you get +1 result level to your roll (a 1-3 becomes a 4/5, etc.). You begin with one special formula already known.' },
    { name: 'Analyst', description: 'During downtime, you get two ticks to distribute among any long-term project clocks that involve investigation or learning a new formula or design plan.' },
    { name: 'Artificer', description: 'When you invent or craft a creation with gadgets or tinkering tools, you get +1 result level to your roll (a 1-3 becomes a 4/5, etc.). You begin with one special design already known.' },
    { name: 'Fortitude', description: 'You may expend your special armor to resist a consequence of toxins, illness, or injury, or to push yourself when working with potions or in combat.' },
    { name: 'Ghost Ward', description: 'You know the arcane methods to disrupt the presence of spirits. You can Wreck an area with arcane methods to suppress or banish a ghost (take +1d to the action roll).' },
    { name: 'Physicker', description: 'You can Tinker with bones and tissue to heal (or harm) people, and you may push yourself to provide first aid to yourself. Also, your healing treatment rolls have +1d.' },
    { name: 'Saboteur', description: 'When you Wreck, your work is much quieter than it should be and the damage is concealed until it is triggered. You get -2 heat for any job with sabotage.' },
    { name: 'Venomous', description: 'Choose a drug or poison (from your bandolier stock) to be your signature substance. Whenever you ingest it or use it, you reduce its harmful effects and get a bonus die when you use it to affect others.' },
    { name: 'Veteran', description: 'Choose a special ability from another playbook.' },
  ],
  lurk: [
    { name: 'Infiltrator', description: 'You are not affected by quality or tier when you bypass security measures.' },
    { name: 'Ambush', description: 'When you attack from hiding or spring a trap, you get +1d to your roll.' },
    { name: 'Daredevil', description: 'When you roll a desperate action, you get +1d to your roll if you also take -1d to any resistance rolls against consequences from that action.' },
    { name: "Devil's Footsteps", description: 'You can push yourself to do one of the following: perform a feat of athletics that verges on the superhuman — maneuver to confuse your enemies so they suffer +1 difficulty against you until you take a different action.' },
    { name: 'Expertise', description: 'Choose one of your action ratings. When you lead a group action using that action, you can suffer only 1 stress at most, regardless of how many failed rolls there are.' },
    { name: 'Ghost Veil', description: 'You may expend your special armor to resist a supernatural consequence, or to push yourself when sneaking or hiding.' },
    { name: 'Reflexes', description: 'When there\'s a question about who acts first, the answer is you (two characters with Reflexes act simultaneously).' },
    { name: 'Shadow', description: 'You may expend your special armor to resist a consequence from detection or security measures, or to push yourself to do one of the following: vanish from sight in an instant — pass through a solid barrier.' },
    { name: 'Veteran', description: 'Choose a special ability from another playbook.' },
  ],
  slide: [
    { name: "Rook's Gambit", description: 'Take 2 stress to roll your best action rating while performing a different action. Say how you adapt your skill to this use.' },
    { name: 'Cloak & Dagger', description: 'When you use a disguise or other form of covert misdirection, you get +1d to rolls to confuse or deflect suspicion. When you throw off a disguise and reveal your true self, take +1d to your next roll.' },
    { name: 'Ghost Voice', description: 'You know the ritual of Spiritbane, allowing you to Attune to a spirit and have it speak through you (or to speak through it) across great distances.' },
    { name: 'Like Looking in a Mirror', description: 'You can always tell when someone is lying to you.' },
    { name: 'Little Something on the Side', description: 'At the end of each downtime phase, you earn +2 stash.' },
    { name: 'Mesmerism', description: 'When you Sway a person, if you fail, you may take 2 stress to make one of their approaches harder (-1d to one roll of their choice) before they resist.' },
    { name: 'Subterfuge', description: 'You may expend your special armor to resist a consequence from suspicion or persuasion, or to push yourself to deceive someone.' },
    { name: 'Trust in Me', description: 'You get +1d vs. a target with whom you have an intimate relationship.' },
    { name: 'Veteran', description: 'Choose a special ability from another playbook.' },
  ],
  whisper: [
    { name: 'Compel', description: 'You can Attune to the ghost field to force a nearby ghost to do your bidding; the action roll tells you the result. You gain potency when compelling spirits.' },
    { name: 'Ghost Mind', description: 'You may expend your special armor to resist a supernatural consequence, or to push yourself when sensing or communicating with spirits.' },
    { name: 'Iron Will', description: 'You are immune to the terror that ghosts and demons inspire. When you make resistance rolls vs. arcane harm, take +1d.' },
    { name: 'Occultist', description: 'You know one ritual (from your book of shadows). You gain potency when you perform that ritual. Also, when you Learn a Ritual downtime action, take +1d.' },
    { name: 'Ritual', description: 'You know the arcane method to perform rituals. You may Attune to the ghost field without any preparation, though special rituals may still require ingredients or other preparation.' },
    { name: 'Strange Methods', description: 'When you invent or craft a mystical creation, take +1 result level to your roll (a 1-3 becomes a 4/5, etc.). You begin with one arcane formula already known.' },
    { name: 'Tempest', description: 'You may push yourself to do one of the following: unleash a vicious assault of arcane force on a nearby target, or channel a powerful spirit into your body as a reservoir of energy.' },
    { name: 'Warded', description: 'You may expend your special armor to resist a supernatural consequence, or to push yourself to summon a spirit or manipulate the ghost field.' },
    { name: 'Veteran', description: 'Choose a special ability from another playbook.' },
  ],
};

export const PLAYBOOK_ITEMS: Record<string, { key: string; label: string; load: number }[]> = {
  cutter: [
    { key: 'fine_hand_weapon', label: 'Fine Hand Weapon (1 load)', load: 1 },
    { key: 'fine_heavy_weapon', label: 'Fine Heavy Weapon (2 load)', load: 2 },
    { key: 'scary_weapon_or_tool', label: 'Scary Weapon or Tool (1 load)', load: 1 },
    { key: 'manacles_chain', label: 'Manacles & Chain (1 load)', load: 1 },
    { key: 'rage_essence_vial', label: 'Rage Essence Vial (0 load)', load: 0 },
    { key: 'spiritbane_charm', label: 'Spiritbane Charm (0 load)', load: 0 },
  ],
  hound: [
    { key: 'fine_pair_pistols', label: 'Fine Pair of Pistols (1 load)', load: 1 },
    { key: 'fine_long_rifle', label: 'Fine Long Rifle (2 load)', load: 2 },
    { key: 'electroplasmic_ammo', label: 'Electroplasmic Ammunition (1 load)', load: 1 },
    { key: 'trained_hunting_pet', label: 'Trained Hunting Pet (2 load)', load: 2 },
    { key: 'spyglass', label: 'Spyglass (1 load)', load: 1 },
    { key: 'spiritbane_charm', label: 'Spiritbane Charm (0 load)', load: 0 },
  ],
  leech: [
    { key: 'fine_tinkering_tools', label: 'Fine Tinkering Tools (2 load)', load: 2 },
    { key: 'fine_wrecking_tools', label: 'Fine Wrecking Tools (2 load)', load: 2 },
    { key: 'blowgun_darts_syringes', label: 'Blowgun & Darts / Syringes (1 load)', load: 1 },
    { key: 'bandolier_1', label: 'Bandolier (alchemicals, slot 1) (2 load)', load: 2 },
    { key: 'bandolier_2', label: 'Bandolier (alchemicals, slot 2) (2 load)', load: 2 },
    { key: 'gadgets', label: 'Gadgets (varies)', load: 1 },
  ],
  lurk: [
    { key: 'fine_lockpicks', label: 'Fine Lockpicks (1 load)', load: 1 },
    { key: 'fine_shadow_cloak', label: 'Fine Shadow Cloak (2 load)', load: 2 },
    { key: 'light_climbing_gear', label: 'Light Climbing Gear (1 load)', load: 1 },
    { key: 'silence_potion_vial', label: 'Silence Potion Vial (0 load)', load: 0 },
    { key: 'dark_sight_goggles', label: 'Dark Sight Goggles (1 load)', load: 1 },
    { key: 'spiritbane_charm', label: 'Spiritbane Charm (0 load)', load: 0 },
  ],
  slide: [
    { key: 'fine_clothes_jewelry', label: 'Fine Clothes & Jewelry (1 load)', load: 1 },
    { key: 'fine_disguise_kit', label: 'Fine Disguise Kit (2 load)', load: 2 },
    { key: 'fine_loaded_dice_trick_cards', label: 'Fine Loaded Dice / Trick Cards (0 load)', load: 0 },
    { key: 'trance_powder', label: 'Trance Powder (0 load)', load: 0 },
    { key: 'cane_sword', label: 'Cane Sword (1 load)', load: 1 },
    { key: 'spiritbane_charm', label: 'Spiritbane Charm (0 load)', load: 0 },
  ],
  whisper: [
    { key: 'fine_lightning_hook', label: 'Fine Lightning Hook (1 load)', load: 1 },
    { key: 'fine_spirit_mask', label: 'Fine Spirit Mask (1 load)', load: 1 },
    { key: 'electroplasm_vials', label: 'Electroplasm Vials (1 load)', load: 1 },
    { key: 'spirit_bottles_2', label: 'Spirit Bottles ×2 (2 load)', load: 2 },
    { key: 'ghost_key', label: 'Ghost Key (0 load)', load: 0 },
    { key: 'demonbane_charm', label: 'Demonbane Charm (0 load)', load: 0 },
  ],
};

export const PLAYBOOK_FRIENDS: Record<string, { name: string; role: string }[]> = {
  cutter: [
    { name: 'Marlane', role: 'Pugilist' },
    { name: 'Chael', role: 'Thug' },
    { name: 'Mercy', role: 'Killer' },
    { name: 'Grace', role: 'Extortionist' },
    { name: 'Sawtooth', role: 'Physicker' },
  ],
  hound: [
    { name: 'Steiner', role: 'Assassin' },
    { name: 'Celene', role: 'Sentinel' },
    { name: 'Melvir', role: 'Physicker' },
    { name: 'Veleris', role: 'Spy' },
    { name: 'Casta', role: 'Bounty Hunter' },
  ],
  leech: [
    { name: 'Stazia', role: 'Apothecary' },
    { name: 'Veldren', role: 'Psychonaut' },
    { name: 'Eckerd', role: 'Corpse Thief' },
    { name: 'Jul', role: 'Blood Dealer' },
    { name: 'Malista', role: 'Priestess' },
  ],
  lurk: [
    { name: 'Telda', role: 'Beggar' },
    { name: 'Darmot', role: 'Bluecoat' },
    { name: 'Frake', role: 'Locksmith' },
    { name: 'Roslyn Kellis', role: 'Noble' },
    { name: 'Petra', role: 'City Clerk' },
  ],
  slide: [
    { name: 'Bryl', role: 'Drug Dealer' },
    { name: 'Bazso Baz', role: 'Gang Leader' },
    { name: 'Klyra', role: 'Tavern Owner' },
    { name: 'Nyryx', role: 'Prostitute' },
    { name: 'Harker', role: 'Jail Bird' },
  ],
  whisper: [
    { name: 'Nyryx', role: 'Possessor Ghost' },
    { name: 'Scurlock', role: 'Vampire' },
    { name: 'Setarra', role: 'Demon' },
    { name: 'Quellyn', role: 'Witch' },
    { name: 'Flint', role: 'Spirit Trafficker' },
  ],
};

export const PLAYBOOK_XP_CHALLENGES: Record<string, string> = {
  cutter: 'You dealt with a challenging situation using violence or coercion',
  hound: 'You dealt with a challenging situation using tracking or violence',
  leech: 'You dealt with a challenging situation using technical skill or mayhem',
  lurk: 'You dealt with a challenging situation using stealth or evasion',
  slide: 'You dealt with a challenging situation using deception or influence',
  whisper: 'You dealt with a challenging situation using knowledge or arcane power',
};

export const PLAYBOOK_GATHER_INFO: Record<string, string[]> = {
  cutter: [
    'How can I hurt them?',
    "Who's most afraid of me?",
    "Who's most dangerous here?",
    'What do they intend to do?',
    'How can I get them to do X?',
    'Are they telling the truth?',
    "What's really going on here?",
  ],
  hound: [
    'What do they intend to do?',
    'How can I get them to do X?',
    'Are they telling the truth?',
    'What can I tinker with here?',
    'What might happen if I do X?',
    'How can I find X?',
    "What's really going on here?",
  ],
  leech: [
    'What do they intend to do?',
    'How can I get them to do X?',
    'Are they telling the truth?',
    'What can I tinker with here?',
    'What might happen if I do X?',
    'How can I find X?',
    "What's really going on here?",
  ],
  lurk: [
    'What do they intend to do?',
    'How can I get them to do X?',
    'What should I look out for?',
    "What's the best way in?",
    'Where can I hide here?',
    'How can I find X?',
    "What's really going on here?",
  ],
  slide: [
    'What do they intend to do?',
    'How can I get them to do X?',
    'Are they telling the truth?',
    'What are they really feeling?',
    'What do they really care about?',
    'How can I blend in here?',
    "What's really going on here?",
  ],
  whisper: [
    'What is arcane or weird here?',
    'What echoes in the ghost field?',
    'What is hidden or lost here?',
    'What do they intend to do?',
    'What drives them to do this?',
    'How can I reveal X?',
    "What's really going on here?",
  ],
};

// ─── Standard items (all playbooks) ──────────────────────────────────────────

export const STANDARD_ITEMS: { key: string; label: string; load: number }[] = [
  { key: 'blade_or_two', label: 'A Blade or Two (1 load)', load: 1 },
  { key: 'throwing_knives', label: 'Throwing Knives (1 load)', load: 1 },
  { key: 'pistol', label: 'Pistol (1 load)', load: 1 },
  { key: 'large_weapon', label: 'Large Weapon (2 load)', load: 2 },
  { key: 'unusual_weapon', label: 'Unusual Weapon (1 load)', load: 1 },
  { key: 'armor', label: 'Armor (2 load)', load: 2 },
  { key: 'heavy_armor', label: 'Heavy Armor (3 load)', load: 3 },
  { key: 'burglary_gear', label: 'Burglary Gear (1 load)', load: 1 },
  { key: 'climbing_gear', label: 'Climbing Gear (2 load)', load: 2 },
  { key: 'arcane_implements', label: 'Arcane Implements (1 load)', load: 1 },
  { key: 'documents', label: 'Documents (1 load)', load: 1 },
  { key: 'subterfuge_supplies', label: 'Subterfuge Supplies (1 load)', load: 1 },
  { key: 'demolition_tools', label: 'Demolition Tools (2 load)', load: 2 },
  { key: 'tinkering_tools', label: 'Tinkering Tools (2 load)', load: 2 },
  { key: 'lantern', label: 'Lantern (1 load)', load: 1 },
];

// ─── Default character data ───────────────────────────────────────────────────

/** Default character sheet data for a new character */
export const defaultCharacterData = {
  // Identity
  alias: '',
  playbook: '' as Playbook,
  heritage: '',
  heritageDetail: '',
  background: '',
  backgroundDetail: '',
  look: '',
  vice: '',
  vicePurveyor: '',

  // Stress & Trauma (stress: 9 boxes, trauma: 4 boxes)
  stress: 0,   // 0–9
  trauma: 0,   // 0–4
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

  // Economy
  coins: 0,   // 0–4 on hand
  stash: 0,   // 0–40 long-term stash

  // XP tracks (0–8 each)
  insightXp: 0,
  prowessXp: 0,
  resolveXp: 0,
  playbookXp: 0,

  // XP triggers — tracked with pips (0–2 each) at end of session
  xpTriggers: {
    violence: 0,    // 0–2: You addressed a challenge with violence or coercion.
    beliefs: 0,     // 0–2: You expressed your beliefs, drives, heritage, or background.
    viceTrauma: 0,  // 0–2: You struggled with issues from your vice or traumas during the session.
  },

  // Actions (rated 0–4, assign 4 dots initially, max 2 each)
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

  // Harm (levels 1–3; level 4 = dead)
  harm: {
    level3: '',  // Fatal severity — need help
    level2a: '', // Moderate — -1d
    level2b: '', // Moderate — -1d (second slot)
    level1a: '', // Minor — less effect
    level1b: '', // Minor — less effect (second slot)
  },

  // Armor
  armor: {
    used: false,
    heavyUsed: false,
    specialUsed: false,
  },

  // Healing clock (6 segments)
  healingClock: 0,  // 0–6

  // Load
  load: 'normal' as LoadOption,  // light=3, normal=5, heavy=6

  // Items — standard (all playbooks)
  standardItems: Object.fromEntries(STANDARD_ITEMS.map((i) => [i.key, false])) as Record<string, boolean>,

  // Items — playbook-specific (keyed by item.key)
  playbookItems: {} as Record<string, boolean>,

  // Special abilities (keyed by ability name)
  abilities: {} as Record<string, boolean>,

  // Friends / rivals (5 slots)
  friends: [
    { name: '', isFriend: false, isRival: false },
    { name: '', isFriend: false, isRival: false },
    { name: '', isFriend: false, isRival: false },
    { name: '', isFriend: false, isRival: false },
    { name: '', isFriend: false, isRival: false },
  ],

  // Gather info prompts used this session (free-text answers)
  gatherInfoAnswers: ['', '', '', '', '', '', ''],

  // Project clock (4 segments, generic)
  projectClock: 0,  // 0–4

  // Notes
  notes: '',
};

export type CharacterData = typeof defaultCharacterData;
