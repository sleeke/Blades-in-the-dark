'use client';

import { useState, useCallback } from 'react';
import TextField from '@/components/TextField';
import CheckboxField from '@/components/CheckboxField';
import Counter from '@/components/Counter';
import { CharacterData } from '@/lib/characterDefaults';

interface CharacterSheetProps {
  characterId: number;
  initialName: string;
  initialData: CharacterData;
  onSave: (name: string, data: CharacterData) => Promise<void>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-stone-900/40 border border-stone-800 rounded-lg p-5">
      <h2
        className="text-sm font-bold uppercase tracking-[0.2em] text-amber-500 mb-4 
                      pb-2 border-b border-stone-800"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export default function CharacterSheet({
  characterId,
  initialName,
  initialData,
  onSave,
}: CharacterSheetProps) {
  const [name, setName] = useState(initialName);
  const [data, setData] = useState<CharacterData>(initialData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = useCallback(<K extends keyof CharacterData>(key: K, value: CharacterData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }, []);

  const updateNested = useCallback(
    <K extends keyof CharacterData>(key: K, nestedKey: string, value: boolean) => {
      setData((prev) => ({
        ...prev,
        [key]: { ...(prev[key] as Record<string, boolean>), [nestedKey]: value },
      }));
      setSaved(false);
    },
    []
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(name, data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const actionRating = (label: string, key: keyof CharacterData) => (
    <div className="flex items-center justify-between">
      <span className="text-sm text-stone-300 capitalize">{label}</span>
      <Counter
        label=""
        value={data[key] as number}
        onChange={(v) => update(key, v as CharacterData[typeof key])}
        max={4}
        dotStyle
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header / Character Name */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold uppercase tracking-widest text-amber-500/80 mb-1">
            Character Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setSaved(false); }}
            className="w-full bg-transparent border-b-2 border-amber-700 focus:border-amber-400 
                       outline-none text-2xl font-bold text-stone-100 pb-1 tracking-wide
                       placeholder-stone-600 transition-colors duration-200"
            style={{ fontFamily: 'Georgia, serif' }}
            placeholder="Enter name..."
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className={
            'px-5 py-2 rounded text-sm font-semibold uppercase tracking-widest transition-all duration-200 ' +
            (saved
              ? 'bg-green-800/60 border border-green-700 text-green-300'
              : 'bg-amber-700/80 hover:bg-amber-600/80 border border-amber-600 text-stone-100 disabled:opacity-50')
          }
        >
          {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save'}
        </button>
      </div>

      {/* Identity */}
      <Section title="Identity">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            label="Alias"
            value={data.alias}
            onChange={(v) => update('alias', v)}
            placeholder="Street name or alias"
          />
          <TextField
            label="Playbook"
            value={data.playbook}
            onChange={(v) => update('playbook', v)}
            placeholder="e.g. Cutter, Slide, Whisper…"
          />
          <TextField
            label="Heritage"
            value={data.heritage}
            onChange={(v) => update('heritage', v)}
            placeholder="Where you're from"
          />
          <TextField
            label="Background"
            value={data.background}
            onChange={(v) => update('background', v)}
            placeholder="What you did before"
          />
          <TextField
            label="Vice"
            value={data.vice}
            onChange={(v) => update('vice', v)}
            placeholder="Your weakness or obsession"
          />
          <TextField
            label="Look / Description"
            value={data.lookDescription}
            onChange={(v) => update('lookDescription', v)}
            placeholder="How others see you"
          />
        </div>
      </Section>

      {/* Status */}
      <Section title="Status">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <Counter label="Stress" value={data.stress} onChange={(v) => update('stress', v)} max={9} />
          <Counter label="Trauma" value={data.trauma} onChange={(v) => update('trauma', v)} max={4} />
          <Counter label="Coins" value={data.coins} onChange={(v) => update('coins', v)} max={4} />
          <Counter label="Stash" value={data.stash} onChange={(v) => update('stash', v)} max={40} />
        </div>

        <div className="pt-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-500/80 mb-3">
            Trauma Conditions
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.entries(data.traumaConditions).map(([condition, checked]) => (
              <CheckboxField
                key={condition}
                label={condition}
                checked={checked}
                onChange={(v) => updateNested('traumaConditions', condition, v)}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* XP */}
      <Section title="Experience">
        <div className="grid grid-cols-2 gap-6">
          <Counter label="XP" value={data.xp} onChange={(v) => update('xp', v)} max={8} dotStyle />
          <Counter label="Playbook XP" value={data.playbookXp} onChange={(v) => update('playbookXp', v)} max={8} dotStyle />
        </div>
      </Section>

      {/* Actions */}
      <Section title="Actions">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-1">
          <div className="space-y-1">
            <p className="text-xs text-stone-500 uppercase tracking-widest mb-2">Insight</p>
            {actionRating('Hunt', 'hunt')}
            {actionRating('Study', 'study')}
            {actionRating('Survey', 'survey')}
            {actionRating('Tinker', 'tinker')}
          </div>
          <div className="space-y-1">
            <p className="text-xs text-stone-500 uppercase tracking-widest mb-2">Prowess</p>
            {actionRating('Finesse', 'finesse')}
            {actionRating('Prowl', 'prowl')}
            {actionRating('Skirmish', 'skirmish')}
            {actionRating('Wreck', 'wreck')}
          </div>
          <div className="space-y-1">
            <p className="text-xs text-stone-500 uppercase tracking-widest mb-2">Resolve</p>
            {actionRating('Attune', 'attune')}
            {actionRating('Command', 'command')}
            {actionRating('Consort', 'consort')}
            {actionRating('Sway', 'sway')}
          </div>
        </div>
      </Section>

      {/* Abilities */}
      <Section title="Special Abilities">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(data.abilities).map(([ability, checked]) => (
            <CheckboxField
              key={ability}
              label={ability}
              checked={checked}
              onChange={(v) => updateNested('abilities', ability, v)}
            />
          ))}
        </div>
      </Section>

      {/* Items */}
      <Section title="Items & Equipment">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Object.entries(data.items).map(([item, checked]) => (
            <CheckboxField
              key={item}
              label={item}
              checked={checked}
              onChange={(v) => updateNested('items', item, v)}
            />
          ))}
        </div>
      </Section>

      {/* Notes */}
      <Section title="Notes">
        <TextField
          label="Notes"
          value={data.notes}
          onChange={(v) => update('notes', v)}
          multiline
          rows={5}
          placeholder="Contacts, debts, schemes, secrets…"
        />
      </Section>

      {/* Bottom save button */}
      <div className="flex justify-end pb-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className={
            'px-6 py-2.5 rounded text-sm font-semibold uppercase tracking-widest transition-all duration-200 ' +
            (saved
              ? 'bg-green-800/60 border border-green-700 text-green-300'
              : 'bg-amber-700/80 hover:bg-amber-600/80 border border-amber-600 text-stone-100 disabled:opacity-50')
          }
        >
          {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
