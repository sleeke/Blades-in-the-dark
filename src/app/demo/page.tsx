'use client';

import CharacterSheet from '@/components/CharacterSheet';
import { defaultCharacterData } from '@/lib/characterDefaults';

const sampleData = {
  ...defaultCharacterData,
  alias: 'The Whisper',
  playbook: 'slide' as const,
  heritage: 'Akoros',
  heritageDetail: 'Born in the dockyards, raised among sailors and smugglers.',
  background: 'Underworld',
  backgroundDetail: 'Ran numbers for a vice den before going independent.',
  look: 'Narrow eyes, quick hands, always watching the exits',
  vice: 'Gambling',
  vicePurveyor: 'Drav at The Six Arms',
  stress: 3,
  trauma: 1,
  coins: 2,
  stash: 10,
  playbookXp: 2,
  insightXp: 1,
  prowessXp: 0,
  resolveXp: 3,
  traumaConditions: { ...defaultCharacterData.traumaConditions, Haunted: true },
  hunt: 1,
  study: 2,
  finesse: 1,
  consort: 2,
  sway: 1,
  harm: {
    level3: '',
    level2a: 'Bruised ribs',
    level2b: '',
    level1a: 'Pulled muscle',
    level1b: '',
  },
  abilities: { 'Trust in Me': true, 'Cloak & Dagger': false, "Rook's Gambit": false },
  standardItems: { ...defaultCharacterData.standardItems, blade_or_two: true, pistol: true },
  playbookItems: { fine_clothes_jewelry: true, cane_sword: false },
  notes: 'Owes Roric 4 coin. Meet with Lady Nyr on the 3rd bell. Do not trust the Gondoliers.',
};

export default function DemoPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-stone-800 bg-stone-950/80 sticky top-0 z-50 px-4 py-3">
        <span className="text-lg font-bold tracking-wider text-amber-400" style={{ fontFamily: 'Georgia, serif' }}>
          ⚔ Blades in the Dark — Demo
        </span>
        <span className="ml-4 text-xs text-stone-500">(character sheet preview — no login required)</span>
      </nav>
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <CharacterSheet
          characterId={0}
          initialName="Silas Dunmore"
          initialData={sampleData}
          onSave={async () => {}}
        />
      </main>
    </div>
  );
}

