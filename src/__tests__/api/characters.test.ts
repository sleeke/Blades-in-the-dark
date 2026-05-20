/**
 * Tests for GET /api/characters and POST /api/characters
 *
 * All database and auth dependencies are mocked so no real DB or session is needed.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// ── Mocks ──────────────────────────────────────────────────────────────────

vi.mock('next-auth', () => ({ getServerSession: vi.fn() }));
vi.mock('@/lib/auth', () => ({ authOptions: {} }));
vi.mock('@/lib/db', () => ({
  initDb: vi.fn(),
  getCharactersByUser: vi.fn(),
  createCharacter: vi.fn(),
}));

import { getServerSession } from 'next-auth';
import { initDb, getCharactersByUser, createCharacter } from '@/lib/db';
import { GET, POST } from '@/app/api/characters/route';

// ── Helpers ────────────────────────────────────────────────────────────────

const AUTHED_SESSION = { user: { id: '42' } };

function makePostRequest(body: object) {
  return new NextRequest('http://localhost/api/characters', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe('GET /api/characters', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 401 when not authenticated', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    const response = await GET();
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body).toMatchObject({ error: 'Unauthorized' });
  });

  it('returns the character list for the authenticated user', async () => {
    vi.mocked(getServerSession).mockResolvedValue(AUTHED_SESSION);
    const characters = [
      { id: 1, name: 'Shadow', updated_at: '2024-01-01' },
      { id: 2, name: 'Ghost', updated_at: '2024-01-02' },
    ];
    vi.mocked(getCharactersByUser).mockResolvedValue(characters);

    const response = await GET();
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual(characters);
    expect(getCharactersByUser).toHaveBeenCalledWith(42);
  });

  it('calls initDb before querying', async () => {
    vi.mocked(getServerSession).mockResolvedValue(AUTHED_SESSION);
    vi.mocked(getCharactersByUser).mockResolvedValue([]);

    await GET();
    expect(initDb).toHaveBeenCalledOnce();
  });
});

describe('POST /api/characters', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 401 when not authenticated', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    const response = await POST(makePostRequest({}));
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body).toMatchObject({ error: 'Unauthorized' });
  });

  it('creates a character with the provided name and returns 201', async () => {
    vi.mocked(getServerSession).mockResolvedValue(AUTHED_SESSION);
    const newChar = { id: 99, name: 'Rook', data: {}, created_at: '', updated_at: '' };
    vi.mocked(createCharacter).mockResolvedValue(newChar);

    const response = await POST(makePostRequest({ name: 'Rook' }));
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body).toEqual(newChar);
    expect(createCharacter).toHaveBeenCalledWith(42, 'Rook', expect.any(Object));
  });

  it('falls back to "New Character" when no name is supplied', async () => {
    vi.mocked(getServerSession).mockResolvedValue(AUTHED_SESSION);
    const newChar = { id: 100, name: 'New Character', data: {}, created_at: '', updated_at: '' };
    vi.mocked(createCharacter).mockResolvedValue(newChar);

    const response = await POST(makePostRequest({}));
    expect(response.status).toBe(201);
    expect(createCharacter).toHaveBeenCalledWith(42, 'New Character', expect.any(Object));
  });

  it('seeds the new character with the default character data', async () => {
    vi.mocked(getServerSession).mockResolvedValue(AUTHED_SESSION);
    vi.mocked(createCharacter).mockResolvedValue({ id: 1, name: 'X', data: {}, created_at: '', updated_at: '' });

    await POST(makePostRequest({ name: 'X' }));

    const passedData = vi.mocked(createCharacter).mock.calls[0][2] as Record<string, unknown>;
    // Spot-check a selection of fields from the default schema
    expect(passedData).toMatchObject({
      stress: 0,
      trauma: 0,
      coins: 0,
      load: 'normal',
    });
    expect(Array.isArray(passedData.friends)).toBe(true);
    expect(passedData.harm).toBeDefined();
    expect(passedData.armor).toBeDefined();
  });
});
