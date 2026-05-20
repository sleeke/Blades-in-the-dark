'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import CharacterSheet from '@/components/CharacterSheet';
import { defaultCharacterData, CharacterData } from '@/lib/characterDefaults';
import {
  createBackupFilename,
  serializeBackup,
  parseAndValidateBackup,
} from '@/lib/characterBackup';

export default function CharacterPage() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [character, setCharacter] = useState<{ id: number; name: string; data: CharacterData } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadError, setUploadError] = useState('');
  // Incrementing this key forces CharacterSheet to remount with fresh initial data after a restore
  const [restoreKey, setRestoreKey] = useState(0);

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

  const handleDownloadBackup = useCallback(() => {
    if (!character) return;
    const json = serializeBackup(character.name, character.data);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = createBackupFilename(character.name);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [character]);

  const handleUploadBackup = useCallback(
    (file: File) => {
      setUploadError('');
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const { name, data } = parseAndValidateBackup(content);

          // Persist the restored state to the server immediately
          const res = await fetch(`/api/characters/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, data }),
          });
          if (!res.ok) throw new Error('Failed to save restored backup.');

          // Update local state and remount CharacterSheet with the restored data
          setCharacter((prev) => prev ? { ...prev, name, data } : prev);
          setRestoreKey((k) => k + 1);
        } catch (err) {
          setUploadError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
        }
      };
      reader.onerror = () => setUploadError('Could not read the file. Please try again.');
      reader.readAsText(file);
    },
    [id]
  );

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
      <Navigation
        characterActions={{
          onDownloadBackup: handleDownloadBackup,
          onUploadBackup: handleUploadBackup,
        }}
      />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-stone-500 hover:text-amber-400 transition-colors text-sm flex items-center gap-1"
          >
            ← All Characters
          </button>
          {uploadError && (
            <p className="text-xs text-red-400 italic" role="alert">
              {uploadError}
            </p>
          )}
        </div>

        <CharacterSheet
          key={restoreKey}
          characterId={character.id}
          initialName={character.name}
          initialData={character.data}
          onSave={handleSave}
        />
      </main>
    </div>
  );
}
