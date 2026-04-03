<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## Blades in the Dark Player Sheets Schema (v8.2)

Blades in the Dark character sheets for the specified playbooks (Cutter, Hound, Leech, Lurk, Slide, Whisper) share a common structure with playbook-specific abilities, items, XP triggers, and gather info prompts.[^1][^2][^3] This JSON-like schema categorizes all fields, metrics (e.g., dot ratings 0-4), checkboxes (boolean), text fields (string), and options (enums)—ready for an AI agent to generate a web app form (e.g., React/Flutter with dynamic sections, validation for 4 initial dots max rating 2).[^4][^5]

### Common Fields (All Playbooks)

```json
{
  "character": {
    "name": "string",
    "alias": "string",
    "look": "string",  // Free text description
    "playbook": "enum: ['cutter', 'hound', 'leech', 'lurk', 'slide', 'whisper']",
    "heritage": { "type": "enum: ['akoros', 'the dagger isles', 'iruvia', 'severos', 'skovlan', 'tycheros']", "detail": "string" },
    "background": { "type": "enum: ['academic', 'labor', 'law', 'trade', 'military', 'noble', 'underworld']", "detail": "string" },
    "vice": { "type": "enum: ['faith', 'gambling', 'luxury', 'obligation', 'pleasure', 'stupor', 'weird']", "purveyor": "string" },
    "trauma": ["array of strings"],  // Checkboxes or text: cold, haunted, obsessed, paranoid, reckless, soft, unstable, vicious
    "xp_triggers": {  // Checkboxes for session-end XP (mark 1 or 2xp)
      "desperate_action": "boolean",
      "challenge_type": "string",  // Playbook-specific
      "beliefs_drives": "boolean",
      "vice_trauma": "boolean"
    },
    "stress": "array[^9]",  // 9 checkboxes ■
    "stash": "number: 0-?",  // Dots ■■■ etc.
    "coin": "number: 0-?"
  },
  "actions": {  // Dots 0-4 per action (assign exactly 4 dots initially, max 2 each)
    "insight": {
      "hunt": "number:0-4",
      "study": "number:0-4",
      "survey": "number:0-4",
      "tinker": "number:0-4"
    },
    "prowess": {
      "finesse": "number:0-4",
      "prowl": "number:0-4",
      "skirmish": "number:0-4",
      "wreck": "number:0-4"
    },
    "resolve": {
      "attune": "number:0-4",
      "command": "number:0-4",
      "consort": "number:0-4",
      "sway": "number:0-4"
    }
  },
  "load": { "selected": "enum: ['light:3', 'normal:5', 'heavy:6']" },  // Radio + metrics
  "harm": {  // 4-level clock with labels
    "level3": "string",  // 'need help'
    "level2": "string",  // '-1d'
    "level1": "string"   // 'less effect'
  },
  "armor": {
    "uses": "array[?]",  // Checkboxes for special/heavy
    "heavy": "boolean",
    "special": "boolean",
    "healing": "array[^6]"  // Clock segments ■■■■■■
  },
  "project_clock": "array[^4]",  // Generic ■■■■
  "teamwork": {  // Checkboxes for engagement
    "lead_group": "boolean",
    "assault": "string",
    "occult": "string",
    "setup_teammate": "boolean",
    "stealth": "string",
    "transport": "string",
    "protect": "boolean",
    "deception": "string",
    "social": "string",
    "assist": "boolean"
  },
  "gather_info": ["array of strings"],  // 8 playbook-specific prompts as textarea or chips
  "items": {  // Checkboxes (load-aware), standard + playbook-specific
    "standard": ["boolean for each: 'blade_or_two', 'throwing_knives', 'pistol', 'large_weapon', 'unusual_weapon', 'armor', 'heavy_armor', 'burglary_gear', 'climbing_gear', 'arcane_implements', 'documents', 'subterfuge_supplies', 'demolition_tools', 'tinkering_tools', 'lantern']",
    "fine_items": ["boolean for playbook fines e.g. 'fine_hand_weapon'"],
    "notes": "string"
  },
  "friends": [  // 5 slots, each {name: string, friend: boolean, rival: boolean}
    {"name": "string", "friend": "boolean ↑", "rival": "boolean ↓"}
  ],
  "notes": "string"
}
```


## Playbook-Specific Overrides

Each extends common schema. Special abilities: checkboxes (select 1+ up to veteran levels).

### Cutter (Dangerous fighter)

- **xp_trigger.challenge**: "violence or coercion"
- **gather_info**: ["How can I hurt them?", "Who's most afraid of me?", "Who's most dangerous here?", "What do they intend to do?", "How can I get them to [X]?", "Are they telling the truth?", "What's really going on here?"]
- **items.playbook**: ["fine_hand_weapon", "fine_heavy_weapon", "scary_weapon_or_tool", "manacles_chain", "rage_essence_vial", "spiritbane_charm"]
- **friends**: ["Marlane pugilist ↑↓", "Chael thug ↑↓", "Mercy killer ↑↓", "Grace extortionist ↑↓", "Sawtooth physicker ↑↓"]
- **special_abilities**: checkboxes [
"battleborn", "bodyguard", "ghost_fighter", "leader", "mule", "not_to_be_trifled_with", "savage", "vigorous", "veteran"
] [^6]


### Hound (Sharpshooter/tracker)

- **xp_trigger.challenge**: "tracking or violence"
- **gather_info**: ["What do they intend to do?", "How can I get them to [X]?", "Are they telling the truth?", "What can I tinker with here?", "What might happen if I [X]?", "How can I find [X]?", "What's really going on here?"]
- **items.playbook**: ["fine_pair_pistols", "fine_long_rifle", "electroplasmic_ammo", "trained_hunting_pet", "spyglass", "spiritbane_charm"]
- **friends**: ["Steiner assassin ↑↓", "Celene sentinel ↑↓", "Melvir physicker ↑↓", "Veleris spy ↑↓", "Casta bounty_hunter ↑↓"]
- **special_abilities**: ["sharpshooter", "focused", "ghost_hunter", "scout", "survivor", "tough_as_nails", "vengeful", "veteran"] [^1]


### Leech (Saboteur/technician)

- **xp_trigger.challenge**: "technical skill or mayhem"
- **gather_info**: ["What do they intend to do?", "How can I get them to [X]?", "Are they telling the truth?", "What can I tinker with here?", "What might happen if I [X]?", "How can I find [X]?", "What's really going on here?"]  // Matches Hound in extract
- **items.playbook**: alchemicals enum ["alcahest", "binding_oil", ... "trance_powder"], bandolier[^6] checkboxes, gadgets[^7], "fine_tinkering_tools", "fine_wrecking_tools", "blowgun_darts_syringes"
- **friends**: ["Stazia apothecary ↑↓", "Veldren psychonaut ↑↓", "Eckerd corpse_thief ↑↓", "Jul blood_dealer ↑↓", "Malista priestess ↑↓"]
- **special_abilities**: ["alchemist", "analyst", "artificer", "fortitude", "ghost_ward", "physicker", "saboteur", "venomous", "veteran"] [^1]


### Lurk (Infiltrator/burglar)

- **xp_trigger.challenge**: "stealth or evasion"
- **gather_info**: ["What do they intend to do?", "How can I get them to [X]?", "What should I look out for?", "What's the best way in?", "Where can I hide here?", "How can I find [X]?", "What's really going on here?"]
- **items.playbook**: ["fine_lockpicks", "fine_shadow_cloak", "light_climbing_gear", "silence_potion_vial", "dark_sight_goggles", "spiritbane_charm"]
- **friends**: ["Telda beggar ↑↓", "Darmot bluecoat ↑↓", "Frake locksmith ↑↓", "Roslyn_Kellis noble ↑↓", "Petra city_clerk ↑↓"]
- **special_abilities**: ["infiltrator", "ambush", "daredevil", "devils_footsteps", "expertise", "ghost_veil", "reflexes", "shadow", "veteran"] [^1]


### Slide (Manipulator/spy)

- **xp_trigger.challenge**: "deception or influence"
- **gather_info**: ["What do they intend to do?", "How can I get them to [X]?", "Are they telling the truth?", "What are they really feeling?", "What do they really care about?", "How can I blend in here?", "What's really going on here?"]
- **items.playbook**: ["fine_clothes_jewelry", "fine_disguise_kit", "fine_loaded_dice_trick_cards", "trance_powder", "cane_sword", "spiritbane_charm"]
- **friends**: ["Bryl drug_dealer ↑↓", "Bazso_Baz gang_leader ↑↓", "Klyra tavern_owner ↑↓", "Nyryx prostitute ↑↓", "Harker jail_bird ↑↓"]
- **special_abilities**: ["rooks_gambit", "cloak_dagger", "ghost_voice", "like_looking_in_mirror", "little_something_side", "mesmerism", "subterfuge", "trust_in_me", "veteran"] [^1]


### Whisper (Arcane adept/channeler)

- **xp_trigger.challenge**: "knowledge or arcane power"
- **gather_info**: ["What is arcane or weird here?", "What echoes in the ghost field?", "What is hidden or lost here?", "What do they intend to do?", "What drives them to do this?", "How can I reveal [X]?", "What's really going on here?"]
- **items.playbook**: ["fine_lightning_hook", "fine_spirit_mask", "electroplasm_vials", "spirit_bottles_2", "ghost_key", "demonbane_charm"]
- **friends**: ["Nyryx possessor_ghost ↑↓", "Scurlock vampire ↑↓", "Setarra demon ↑↓", "Quellyn witch ↑↓", "Flint spirit_trafficker ↑↓"]
- **special_abilities**: ["compel", "ghost_mind", "iron_will", "occultist", "ritual", "strange_methods", "tempest", "warded", "veteran"] [^1]


### Validation Rules for App

- Total action dots == 4; no >2 initially.
- Load checkboxes <= selected limit.
- XP: Mark via checkboxes, track per attribute/playbook.
- Harm: Levels reduce effect/dice as labeled.[^2][^1]
<span style="display:none">[^10][^11][^12][^13][^8]</span>

<div align="center">⁂</div>

[^1]: https://basilai.app/privacy-app-alternatives/databases/

[^2]: https://bladesinthedark.com/sites/default/files/blades_playerkit_v8_2.pdf

[^3]: https://bladesinthedark.com/sites/default/files/sheets/blades_sheets_v8_2_Cutter.pdf

[^4]: https://roll20.net/compendium/BITD/Blades in the Dark - Roll20 Characters

[^5]: https://www.scribd.com/document/554836928/blades-playerkit-v8-2-part-2

[^6]: https://baserow.io/blog/best-database-hosting-websites

[^7]: https://getathenic.com/blog/supabase-vs-firebase-vs-planetscale-backend

[^8]: https://pdfcoffee.com/blades-in-the-dark-v8-2pdf-pdf-free.html

[^9]: https://ad1066.com/bens-character-sheets/blades-in-the-dark-playbooks

[^10]: https://www.scribd.com/document/602506091/Blades-Sheets-v8-2-Cutter

[^11]: https://www.scribd.com/document/896234983/Httpsbladesinthedark-comsitesdefaultfilesblades-Playerkit-v8-2-PDF

[^12]: https://www.reddit.com/r/bladesinthedark/comments/85fko2/i_built_google_sheets_versions_of_the_playbooks/

[^13]: https://www.scribd.com/document/554838221/blades-playerkit-v8-2-part-5

