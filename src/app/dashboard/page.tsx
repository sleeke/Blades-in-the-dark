'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

interface Character {
  id: number;
  name: string;
  updated_at: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/characters')
        .then((r) => r.json())
        .then((data) => {
          setCharacters(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status]);

  const createCharacter = async () => {
    setCreating(true);
    const res = await fetch('/api/characters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'New Character' }),
    });
    if (res.ok) {
      const char = await res.json();
      router.push(`/character/${char.id}`);
    }
    setCreating(false);
  };

  const deleteCharacter = async (id: number) => {
    if (!confirm('Delete this character? This cannot be undone.')) return;
    setDeletingId(id);
    await fetch(`/api/characters/${id}`, { method: 'DELETE' });
    setCharacters((prev) => prev.filter((c) => c.id !== id));
    setDeletingId(null);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-500 animate-pulse tracking-widest uppercase text-sm">
          Consulting the shadows…
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1
              className="text-2xl font-bold text-amber-400 tracking-wider"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Your Characters
            </h1>
            <p className="text-stone-500 text-sm mt-1">
              Welcome back, {session?.user?.name}
            </p>
          </div>
          <button
            onClick={createCharacter}
            disabled={creating}
            className="px-5 py-2.5 bg-amber-700/80 hover:bg-amber-600/80 border border-amber-600 
                       rounded text-stone-100 font-semibold uppercase tracking-widest text-sm 
                       transition-all duration-200 disabled:opacity-50"
          >
            {creating ? 'Creating…' : '+ New Character'}
          </button>
        </div>

        {/* Character list */}
        {characters.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-stone-800 rounded-xl">
            <p className="text-stone-500 text-lg mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              No characters yet
            </p>
            <p className="text-stone-600 text-sm mb-6">
              The shadows await your first scoundrel.
            </p>
            <button
              onClick={createCharacter}
              disabled={creating}
              className="px-5 py-2.5 bg-amber-700/80 hover:bg-amber-600/80 border border-amber-600 
                         rounded text-stone-100 font-semibold uppercase tracking-widest text-sm 
                         transition-all duration-200 disabled:opacity-50"
            >
              {creating ? 'Creating…' : 'Create Your First Character'}
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {characters.map((char) => (
              <div
                key={char.id}
                className="group bg-stone-900/50 border border-stone-800 rounded-xl p-5 
                           hover:border-amber-800 transition-colors duration-200 flex items-center justify-between"
              >
                <Link href={`/character/${char.id}`} className="flex-1 min-w-0">
                  <h3
                    className="font-bold text-stone-200 group-hover:text-amber-400 transition-colors 
                               truncate tracking-wide"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    {char.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Last updated:{' '}
                    {new Date(char.updated_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </Link>
                <button
                  onClick={() => deleteCharacter(char.id)}
                  disabled={deletingId === char.id}
                  className="ml-4 text-stone-600 hover:text-red-400 transition-colors text-lg 
                             disabled:opacity-30 flex-shrink-0"
                  aria-label="Delete character"
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
