'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import CharacterSheet from '@/components/CharacterSheet';
import { defaultCharacterData, CharacterData } from '@/lib/characterDefaults';

export default function CharacterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [character, setCharacter] = useState<{ id: number; name: string; data: CharacterData } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated' && id) {
      fetch(`/api/characters/${id}`)
        .then((r) => {
          if (!r.ok) throw new Error('Not found');
          return r.json();
        })
        .then((data) => {
          setCharacter({
            id: data.id,
            name: data.name,
            data: { ...defaultCharacterData, ...data.data },
          });
          setLoading(false);
        })
        .catch(() => {
          setError('Character not found.');
          setLoading(false);
        });
    }
  }, [status, id]);

  const handleSave = async (name: string, data: CharacterData) => {
    const res = await fetch(`/api/characters/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, data }),
    });
    if (!res.ok) throw new Error('Save failed');
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-500 animate-pulse tracking-widest uppercase text-sm">
          Loading character…
        </p>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-stone-400 text-lg mb-4">{error || 'Character not found'}</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-amber-500 hover:text-amber-400 transition-colors text-sm"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-stone-500 hover:text-amber-400 transition-colors text-sm flex items-center gap-1"
          >
            ← All Characters
          </button>
        </div>

        <CharacterSheet
          characterId={character.id}
          initialName={character.name}
          initialData={character.data}
          onSave={handleSave}
        />
      </main>
    </div>
  );
}
