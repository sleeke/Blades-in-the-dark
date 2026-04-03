'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError('Invalid email or password.');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Decorative title */}
      <div className="mb-8 text-center">
        <h1
          className="text-4xl font-bold text-amber-400 tracking-widest mb-2"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          ⚔ Blades in the Dark
        </h1>
        <p className="text-stone-500 text-sm tracking-wide">
          Character Sheet Manager
        </p>
      </div>

      <div className="w-full max-w-sm bg-stone-900/70 border border-stone-800 rounded-xl p-8 shadow-xl">
        <h2
          className="text-xl font-bold text-stone-200 mb-6 text-center tracking-wider uppercase"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Sign In
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-stone-950/60 border border-stone-700 rounded px-3 py-2 text-stone-200 
                         placeholder-stone-600 focus:outline-none focus:border-amber-600 
                         focus:ring-1 focus:ring-amber-600 transition-colors"
              placeholder="••••••••"
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
            {loading ? 'Entering the shadows…' : 'Enter'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-500">
          No account?{' '}
          <Link href="/register" className="text-amber-500 hover:text-amber-400 transition-colors">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
