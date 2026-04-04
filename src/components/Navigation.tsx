'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from '@/components/ThemeProvider';
import { useState, useRef, useEffect } from 'react';

function ProfileIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-7 h-7"
      aria-hidden="true"
    >
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0-12a1 1 0 0 0 1-1V2a1 1 0 0 0-2 0v2a1 1 0 0 0 1 1zm0 14a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0v-2a1 1 0 0 0-1-1zm10-5a1 1 0 0 0 0-2h-2a1 1 0 0 0 0 2h2zM4 12a1 1 0 0 0-1-1H1a1 1 0 0 0 0 2h2a1 1 0 0 0 1-1zm14.95 5.54-1.41-1.42a1 1 0 0 0-1.42 1.42l1.42 1.41a1 1 0 0 0 1.41-1.41zm-12.9-12.9a1 1 0 0 0-1.41 1.41l1.41 1.42a1 1 0 0 0 1.42-1.42L6.05 4.64zm12.9 1.42-1.42-1.41a1 1 0 0 0-1.41 1.41l1.41 1.42a1 1 0 0 0 1.42-1.42zM6.05 19.36l-1.41 1.41a1 1 0 1 0 1.41 1.42l1.42-1.42a1 1 0 0 0-1.42-1.41z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path d="M21 12.79A9 9 0 0 1 11.21 3a7 7 0 1 0 9.79 9.79z" />
    </svg>
  );
}

export default function Navigation() {
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center justify-center w-9 h-9 rounded-full border border-stone-700
                         text-stone-400 hover:text-amber-400 hover:border-amber-700 transition-all duration-200
                         bg-stone-900/60"
              aria-label="Account menu"
              aria-expanded={open}
              aria-haspopup="true"
            >
              <ProfileIcon />
            </button>

            {open && (
              <div
                className="absolute right-0 mt-2 w-52 rounded-lg border border-stone-800 bg-stone-950/95
                           backdrop-blur-sm shadow-xl shadow-black/40 py-1"
                role="menu"
              >
                <div className="px-4 py-2 border-b border-stone-800">
                  <p className="text-xs text-stone-500 uppercase tracking-widest">Signed in as</p>
                  <p className="text-sm font-medium text-amber-400 truncate">{session.user.name}</p>
                </div>

                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-stone-300
                             hover:text-amber-400 hover:bg-stone-900/60 transition-colors duration-150"
                  role="menuitem"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0" aria-hidden="true">
                    <path d="M4 6h16M4 10h16M4 14h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                  </svg>
                  Characters
                </Link>

                <button
                  onClick={() => { toggleTheme(); setOpen(false); }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-stone-300
                             hover:text-amber-400 hover:bg-stone-900/60 transition-colors duration-150"
                  role="menuitem"
                >
                  <span className="flex-shrink-0">
                    {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                  </span>
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>

                <div className="border-t border-stone-800 mt-1 pt-1">
                  <button
                    onClick={() => { setOpen(false); signOut({ callbackUrl: '/login' }); }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-stone-400
                               hover:text-red-400 hover:bg-stone-900/60 transition-colors duration-150"
                    role="menuitem"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0" aria-hidden="true">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

