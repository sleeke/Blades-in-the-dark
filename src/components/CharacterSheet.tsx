'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import TextField from '@/components/TextField';
import CheckboxField from '@/components/CheckboxField';
import Counter from '@/components/Counter';
import SelectField from '@/components/SelectField';
import {
  CharacterData,
  PLAYBOOKS,
  HERITAGES,
  BACKGROUNDS,
  VICE_TYPES,
  LOAD_OPTIONS,
  LOAD_CAPACITY,
  ACTION_DESCRIPTIONS,
  HARM_LEVEL_LABELS,
  PLAYBOOK_SPECIAL_ABILITIES,
  PLAYBOOK_ITEMS,
  PLAYBOOK_FRIENDS,
  PLAYBOOK_GATHER_INFO,
  STANDARD_ITEMS,
} from '@/lib/characterDefaults';

interface CharacterSheetProps {
  characterId: number;
  initialName: string;
  initialData: CharacterData;
  onSave: (name: string, data: CharacterData) => Promise<void>;
}

function Section({ title, children, hint }: { title: string; children: React.ReactNode; hint?: string }) {
  return (
    <section className="bg-stone-900/40 border border-stone-800 rounded-lg p-5">
      <div className="pb-2 border-b border-stone-800 mb-4">
        <h2
          className="text-sm font-bold uppercase tracking-[0.2em] text-amber-500"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {title}
        </h2>
        {hint && <p className="text-xs text-stone-500 mt-0.5 italic">{hint}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-amber-500/80 mb-2">
      {children}
    </p>
  );
}

export default function CharacterSheet({
  characterId: _characterId,
  initialName,
  initialData,
  onSave,
}: CharacterSheetProps) {
  const [name, setName] = useState(initialName);
  const [data, setData] = useState<CharacterData>(initialData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const isFirstRender = useRef(true);
  const onSaveRef = useRef(onSave);
  useEffect(() => { onSaveRef.current = onSave; }, [onSave]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setSaved(false);
    const timer = setTimeout(async () => {
      setSaving(true);
      try {
        await onSaveRef.current(name, data);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch (e) {
        console.error('Auto-save failed:', e);
      } finally {
        setSaving(false);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [name, data]);

  const update = useCallback(<K extends keyof CharacterData>(key: K, value: CharacterData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateNested = useCallback(
    <K extends keyof CharacterData>(key: K, nestedKey: string, value: boolean) => {
      setData((prev) => ({
        ...prev,
        [key]: { ...(prev[key] as Record<string, boolean>), [nestedKey]: value },
      }));
    },
    []
  );

  // Updates a field within a nested object (e.g. harm.level3, armor.used, xpTriggers.violence)
  const updateNestedValue = useCallback(
    <K extends keyof CharacterData>(key: K, field: string, value: unknown) => {
      setData((prev) => ({
        ...prev,
        [key]: { ...(prev[key] as Record<string, unknown>), [field]: value },
      }));
    },
    []
  );

  const updateFriend = useCallback(
    (index: number, field: 'name' | 'isFriend' | 'isRival', value: string | boolean) => {
      setData((prev) => {
        const friends = [...prev.friends];
        friends[index] = { ...friends[index], [field]: value };
        return { ...prev, friends };
      });
    },
    []
  );

  const updateGatherInfo = useCallback((index: number, value: string) => {
    setData((prev) => {
      const answers = [...prev.gatherInfoAnswers];
      answers[index] = value;
      return { ...prev, gatherInfoAnswers: answers };
    });
  }, []);

  const playbook = data.playbook;
  const abilities = useMemo(
    () => (playbook ? PLAYBOOK_SPECIAL_ABILITIES[playbook] ?? [] : []),
    [playbook]
  );
  const playbookItems = useMemo(
    () => (playbook ? PLAYBOOK_ITEMS[playbook] ?? [] : []),
    [playbook]
  );
  const friends = useMemo(
    () => (playbook ? PLAYBOOK_FRIENDS[playbook] ?? [] : []),
    [playbook]
  );
  const gatherInfoPrompts = useMemo(
    () => (playbook ? PLAYBOOK_GATHER_INFO[playbook] ?? [] : []),
    [playbook]
  );

  // Load tracking
  const loadLimit = LOAD_CAPACITY[data.load];
  const currentLoad = useMemo(() => {
    let total = 0;
    STANDARD_ITEMS.forEach((item) => {
      if (data.standardItems[item.key]) total += item.load;
    });
    playbookItems.forEach((item) => {
      if (data.playbookItems[item.key]) total += item.load;
    });
    return total;
  }, [data.standardItems, data.playbookItems, playbookItems]);

  const actionRating = (label: string, key: keyof CharacterData) => (
    <div key={key} className="flex items-center justify-between gap-2">
      <div className="flex flex-col min-w-0">
        <span className="text-sm text-stone-200 capitalize">{label}</span>
        <span className="text-xs text-stone-500 italic leading-snug">
          {ACTION_DESCRIPTIONS[key as string] ?? ''}
        </span>
      </div>
      <Counter
        label=""
        value={data[key] as number}
        onChange={(v) => update(key, v as CharacterData[typeof key])}
        max={4}
        dotStyle
        hideReset
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────── */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold uppercase tracking-widest text-amber-500/80 mb-1">
            Character Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-transparent border-b-2 border-amber-700 focus:border-amber-400
                       outline-none text-2xl font-bold text-stone-100 pb-1 tracking-wide
                       placeholder-stone-600 transition-colors duration-200"
            style={{ fontFamily: 'Georgia, serif' }}
            placeholder="Enter name…"
          />
        </div>
        <div className="text-xs text-stone-500 italic h-8 flex items-center">
          {saving ? 'Saving…' : saved ? '✓ Saved' : ''}
        </div>
      </div>

      {/* ── Identity ─────────────────────────────────── */}
      <Section
        title="Identity"
        hint="Who you are and where you come from."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField
            label="Alias"
            value={data.alias}
            onChange={(v) => update('alias', v)}
            placeholder="Street name or alias"
          />
          <SelectField
            label="Playbook"
            value={data.playbook}
            onChange={(v) => update('playbook', v as CharacterData['playbook'])}
            options={PLAYBOOKS.map((p) => ({ value: p, label: p.charAt(0).toUpperCase() + p.slice(1) }))}
            placeholder="Choose playbook…"
          />
          <SelectField
            label="Heritage"
            value={data.heritage}
            onChange={(v) => update('heritage', v)}
            options={HERITAGES}
            placeholder="Where you're from…"
          />
          <TextField
            label="Heritage Detail"
            value={data.heritageDetail}
            onChange={(v) => update('heritageDetail', v)}
            placeholder="Rumours, culture, distinguishing mark…"
          />
          <SelectField
            label="Background"
            value={data.background}
            onChange={(v) => update('background', v)}
            options={BACKGROUNDS}
            placeholder="What you did before…"
          />
          <TextField
            label="Background Detail"
            value={data.backgroundDetail}
            onChange={(v) => update('backgroundDetail', v)}
            placeholder="A notable deed, connection, or stain…"
          />
          <TextField
            label="Look"
            value={data.look}
            onChange={(v) => update('look', v)}
            placeholder="How others see you — dress, manner, scars…"
          />
          <SelectField
            label="Vice"
            value={data.vice}
            onChange={(v) => update('vice', v)}
            options={VICE_TYPES}
            placeholder="Your indulgence…"
          />
          <TextField
            label="Vice Purveyor"
            value={data.vicePurveyor}
            onChange={(v) => update('vicePurveyor', v)}
            placeholder="Who supplies your vice?"
          />
        </div>
      </Section>

      {/* ── Stress & Trauma ─────────────────────────── */}
      <Section
        title="Stress & Trauma"
        hint="Fill stress boxes as you push yourself or resist consequences. At 9 stress you are taken out."
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <Counter label="Stress" value={data.stress} onChange={(v) => update('stress', v)} max={9} dotStyle />
          <Counter label="Trauma" value={data.trauma} onChange={(v) => update('trauma', v)} max={4} dotStyle />
        </div>
        <div className="pt-2">
          <SubLabel>Trauma Conditions</SubLabel>
          <p className="text-xs text-stone-500 italic mb-3">
            Mark a trauma condition when you are taken out. Each condition permanently changes how you interact with the world.
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

      {/* ── Economy ─────────────────────────────── */}
      <Section
        title="Coin & Stash"
        hint="Coin is cash on hand. Stash is long-term savings (max 40)."
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <Counter label="Coin" value={data.coins} onChange={(v) => update('coins', v)} max={4} dotStyle />
          <Counter label="Stash" value={data.stash} onChange={(v) => update('stash', v)} max={40} />
        </div>
      </Section>

      {/* ── XP ─────────────────────────────────────── */}
      <Section
        title="Experience"
        hint="Mark XP triggers at end of session. Fill the track to advance."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Counter label="Playbook XP (0–8)" value={data.playbookXp} onChange={(v) => update('playbookXp', v)} max={8} dotStyle />
          <Counter label="Insight XP (0–6)" value={data.insightXp} onChange={(v) => update('insightXp', v)} max={6} dotStyle />
          <Counter label="Prowess XP (0–6)" value={data.prowessXp} onChange={(v) => update('prowessXp', v)} max={6} dotStyle />
          <Counter label="Resolve XP (0–6)" value={data.resolveXp} onChange={(v) => update('resolveXp', v)} max={6} dotStyle />
        </div>
        <div className="pt-2 space-y-3">
          <SubLabel>XP Triggers (mark at end of session)</SubLabel>
          <p className="text-xs text-stone-500 italic">Each trigger can be marked up to 2 times. Tracked separately from the main XP tracks.</p>
          {(
            [
              { key: 'violence' as const, label: 'You addressed a challenge with violence or coercion.' },
              { key: 'beliefs' as const, label: 'You expressed your beliefs, drives, heritage, or background.' },
              { key: 'viceTrauma' as const, label: 'You struggled with issues from your vice or traumas during the session.' },
            ] as const
          ).map(({ key, label }) => {
            const val = data.xpTriggers[key] as number ?? 0;
            return (
              <div key={key} className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {Array.from({ length: 2 }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => updateNestedValue('xpTriggers', key, val === i + 1 ? i : i + 1)}
                      className={
                        'w-5 h-5 rounded-full border-2 transition-all duration-150 ' +
                        (i < val
                          ? 'bg-amber-500 border-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.5)]'
                          : 'bg-stone-900 border-stone-600 hover:border-amber-700')
                      }
                      aria-label={`Set "${label}" to ${i + 1}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-stone-300">{label}</span>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ── Actions ─────────────────────────────────── */}
      <Section
        title="Actions"
        hint="Assign 4 dots at character creation (max 2 per action). Each dot = +1d on the related roll."
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-2">
          <div className="space-y-3">
            <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">
              Insight — mental acuity
            </p>
            {actionRating('Hunt', 'hunt')}
            {actionRating('Study', 'study')}
            {actionRating('Survey', 'survey')}
            {actionRating('Tinker', 'tinker')}
          </div>
          <div className="space-y-3">
            <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">
              Prowess — physical capability
            </p>
            {actionRating('Finesse', 'finesse')}
            {actionRating('Prowl', 'prowl')}
            {actionRating('Skirmish', 'skirmish')}
            {actionRating('Wreck', 'wreck')}
          </div>
          <div className="space-y-3">
            <p className="text-xs text-stone-400 uppercase tracking-widest mb-1">
              Resolve — force of will
            </p>
            {actionRating('Attune', 'attune')}
            {actionRating('Command', 'command')}
            {actionRating('Consort', 'consort')}
            {actionRating('Sway', 'sway')}
          </div>
        </div>
      </Section>

      {/* ── Harm ─────────────────────────────────────── */}
      <Section
        title="Harm"
        hint="Record physical and mental injuries. Higher levels have harsher penalties."
      >
        <div className="space-y-3">
          <div>
            <SubLabel>Level 3 — Need Help</SubLabel>
            <p className="text-xs text-stone-500 italic mb-1">{HARM_LEVEL_LABELS.level3}</p>
            <TextField
              label=""
              value={data.harm.level3}
              onChange={(v) => updateNestedValue('harm', 'level3', v)}
              placeholder="Describe the injury…"
            />
          </div>
          <div>
            <SubLabel>Level 2 — -1d to All Rolls</SubLabel>
            <p className="text-xs text-stone-500 italic mb-1">{HARM_LEVEL_LABELS.level2}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <TextField
                label=""
                value={data.harm.level2a}
                onChange={(v) => updateNestedValue('harm', 'level2a', v)}
                placeholder="Injury slot A…"
              />
              <TextField
                label=""
                value={data.harm.level2b}
                onChange={(v) => updateNestedValue('harm', 'level2b', v)}
                placeholder="Injury slot B…"
              />
            </div>
          </div>
          <div>
            <SubLabel>Level 1 — Less Effect</SubLabel>
            <p className="text-xs text-stone-500 italic mb-1">{HARM_LEVEL_LABELS.level1}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <TextField
                label=""
                value={data.harm.level1a}
                onChange={(v) => updateNestedValue('harm', 'level1a', v)}
                placeholder="Injury slot A…"
              />
              <TextField
                label=""
                value={data.harm.level1b}
                onChange={(v) => updateNestedValue('harm', 'level1b', v)}
                placeholder="Injury slot B…"
              />
            </div>
          </div>
        </div>
        <div className="pt-2">
          <SubLabel>Healing</SubLabel>
          <p className="text-xs text-stone-500 italic mb-2">
            Advance the healing clock during downtime to recover from harm (6 segments = full recovery).
          </p>
          <Counter label="Healing Clock" value={data.healingClock} onChange={(v) => update('healingClock', v)} max={6} dotStyle />
        </div>
      </Section>

      {/* ── Armor ─────────────────────────────────────── */}
      <Section
        title="Armor"
        hint="Check a box when you use armor to resist a consequence. Recover during downtime."
      >
        <div className="flex flex-wrap gap-6">
          <CheckboxField label="Armor used" checked={data.armor.used} onChange={(v) => updateNestedValue('armor', 'used', v)} />
          <CheckboxField label="Heavy armor used" checked={data.armor.heavyUsed} onChange={(v) => updateNestedValue('armor', 'heavyUsed', v)} />
          <CheckboxField label="Special armor used" checked={data.armor.specialUsed} onChange={(v) => updateNestedValue('armor', 'specialUsed', v)} />
        </div>
      </Section>

      {/* ── Load ─────────────────────────────────────── */}
      <Section
        title="Load"
        hint={`Current load: ${currentLoad} / ${loadLimit}. Carrying more than your limit is not allowed.`}
      >
        <div className="flex flex-wrap gap-4">
          {LOAD_OPTIONS.map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="load"
                value={opt}
                checked={data.load === opt}
                onChange={() => update('load', opt)}
                className="sr-only"
              />
              <div
                className={
                  'w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-150 ' +
                  (data.load === opt
                    ? 'bg-amber-500 border-amber-400'
                    : 'bg-stone-900 border-stone-600 group-hover:border-amber-700')
                }
              >
                {data.load === opt && <div className="w-2 h-2 rounded-full bg-stone-950" />}
              </div>
              <span className="text-sm text-stone-300 capitalize">
                {opt} ({LOAD_CAPACITY[opt]})
              </span>
            </label>
          ))}
        </div>
      </Section>

      {/* ── Items ─────────────────────────────────────── */}
      <Section
        title="Items & Equipment"
        hint="Check items you're carrying. Load adds up — stay within your limit."
      >
        <div>
          <SubLabel>Standard Items</SubLabel>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {STANDARD_ITEMS.map((item) => (
              <CheckboxField
                key={item.key}
                label={item.label}
                checked={!!data.standardItems[item.key]}
                onChange={(v) => updateNested('standardItems', item.key, v)}
              />
            ))}
          </div>
        </div>
        {playbookItems.length > 0 && (
          <div className="pt-2">
            <SubLabel>
              {playbook.charAt(0).toUpperCase() + playbook.slice(1)} Items
            </SubLabel>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {playbookItems.map((item) => (
                <CheckboxField
                  key={item.key}
                  label={item.label}
                  checked={!!data.playbookItems[item.key]}
                  onChange={(v) => updateNested('playbookItems', item.key, v)}
                />
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* ── Special Abilities ─────────────────────────── */}
      {abilities.length > 0 && (
        <Section
          title="Special Abilities"
          hint="Check abilities your character has unlocked. You start with one; buy more with Playbook XP."
        >
          <div className="grid grid-cols-1 gap-3">
            {abilities.map((ability) => (
              <CheckboxField
                key={ability.name}
                label={ability.name}
                description={ability.description}
                checked={!!data.abilities[ability.name]}
                onChange={(v) => updateNested('abilities', ability.name, v)}
              />
            ))}
          </div>
        </Section>
      )}

      {/* ── Friends & Rivals ─────────────────────────── */}
      <Section
        title="Friends & Rivals"
        hint="Mark ↑ for friend, ↓ for rival. Relationships shift with play. You can also write in new contacts."
      >
        <div className="space-y-3">
          {data.friends.map((f, i) => {
            const suggestion = friends[i];
            return (
              <div key={i} className="flex items-center gap-3 flex-wrap">
                <div className="flex-1 min-w-[140px]">
                  <input
                    type="text"
                    value={f.name}
                    onChange={(e) => updateFriend(i, 'name', e.target.value)}
                    placeholder={
                      suggestion ? `${suggestion.name} — ${suggestion.role}` : `Contact ${i + 1}…`
                    }
                    className="w-full bg-stone-900/60 border border-stone-700 rounded px-2 py-1.5
                               text-stone-200 text-sm placeholder-stone-600 focus:outline-none
                               focus:border-amber-600 transition-colors duration-200"
                  />
                </div>
                <CheckboxField
                  label="Friend ↑"
                  checked={f.isFriend}
                  onChange={(v) => updateFriend(i, 'isFriend', v)}
                />
                <CheckboxField
                  label="Rival ↓"
                  checked={f.isRival}
                  onChange={(v) => updateFriend(i, 'isRival', v)}
                />
              </div>
            );
          })}
        </div>
      </Section>

      {/* ── Gather Info ─────────────────────────────────── */}
      {gatherInfoPrompts.length > 0 && (
        <Section
          title="Gather Information"
          hint="These are the questions your character can ask their contacts or the GM during the job."
        >
          <div className="space-y-3">
            {gatherInfoPrompts.map((prompt, i) => (
              <div key={i}>
                <p className="text-xs text-stone-400 italic mb-1">{prompt}</p>
                <TextField
                  label=""
                  value={data.gatherInfoAnswers[i] ?? ''}
                  onChange={(v) => updateGatherInfo(i, v)}
                  placeholder="Your notes…"
                />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── Project Clock ───────────────────────────────── */}
      <Section
        title="Project Clock"
        hint="A 4-segment clock for tracking a long-running personal project or goal."
      >
        <Counter label="Progress" value={data.projectClock} onChange={(v) => update('projectClock', v)} max={4} dotStyle />
      </Section>

      {/* ── Notes ───────────────────────────────────────── */}
      <Section title="Notes">
        <TextField
          label="Notes"
          value={data.notes}
          onChange={(v) => update('notes', v)}
          multiline
          rows={5}
          placeholder="Contacts, debts, schemes, secrets, jobs in progress…"
        />
      </Section>
    </div>
  );
}
