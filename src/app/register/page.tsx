'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, username }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Registration failed.');
      return;
    }

    router.push('/login?registered=1');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <h1
          className="text-4xl font-bold text-amber-400 tracking-widest mb-2"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          ⚔ Blades in the Dark
        </h1>
        <p className="text-stone-500 text-sm tracking-wide">Character Sheet Manager</p>
      </div>

      <div className="w-full max-w-sm bg-stone-900/70 border border-stone-800 rounded-xl p-8 shadow-xl">
        <h2
          className="text-xl font-bold text-stone-200 mb-6 text-center tracking-wider uppercase"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-amber-500/80 mb-1">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-stone-950/60 border border-stone-700 rounded px-3 py-2 text-stone-200 
                         placeholder-stone-600 focus:outline-none focus:border-amber-600 
                         focus:ring-1 focus:ring-amber-600 transition-colors"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-amber-500/80 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-stone-950/60 border border-stone-700 rounded px-3 py-2 text-stone-200 
                         placeholder-stone-600 focus:outline-none focus:border-amber-600 
                         focus:ring-1 focus:ring-amber-600 transition-colors"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-amber-500/80 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-stone-950/60 border border-stone-700 rounded px-3 py-2 text-stone-200 
                         placeholder-stone-600 focus:outline-none focus:border-amber-600 
                         focus:ring-1 focus:ring-amber-600 transition-colors"
              placeholder="At least 8 characters"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-950/40 border border-red-900 rounded px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-amber-700/80 hover:bg-amber-600/80 border border-amber-600 
                       rounded text-stone-100 font-semibold uppercase tracking-widest text-sm 
                       transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'Forging your identity…' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-500">
          Already have an account?{' '}
          <Link href="/login" className="text-amber-500 hover:text-amber-400 transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
