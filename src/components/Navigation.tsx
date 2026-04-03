'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export default function Navigation() {
  const { data: session } = useSession();

  return (
    <nav className="border-b border-stone-800 bg-stone-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="text-lg font-bold tracking-wider text-amber-400 hover:text-amber-300 transition-colors"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          ⚔ Blades in the Dark
        </Link>

        {session?.user && (
          <div className="flex items-center gap-4">
            <span className="text-xs text-stone-400 hidden sm:block">
              {session.user.name}
            </span>
            <Link
              href="/dashboard"
              className="text-sm text-stone-300 hover:text-amber-400 transition-colors"
            >
              Characters
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-sm text-stone-400 hover:text-red-400 transition-colors"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
