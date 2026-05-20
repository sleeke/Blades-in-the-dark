/**
 * Tests for GET /api/characters/[id], PUT /api/characters/[id],
 * and DELETE /api/characters/[id]
 *
 * All database and auth dependencies are mocked so no real DB or session is needed.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// ── Mocks ──────────────────────────────────────────────────────────────────

vi.mock('next-auth', () => ({ getServerSession: vi.fn() }));
vi.mock('@/lib/auth', () => ({ authOptions: {} }));
vi.mock('@/lib/db', () => ({
  getCharacterById: vi.fn(),
  updateCharacter: vi.fn(),
  deleteCharacter: vi.fn(),
}));

import { getServerSession } from 'next-auth';
import { getCharacterById, updateCharacter, deleteCharacter } from '@/lib/db';
import { GET, PUT, DELETE } from '@/app/api/characters/[id]/route';

// ── Helpers ────────────────────────────────────────────────────────────────

const AUTHED_SESSION = { user: { id: '42' } };
const PARAMS = { params: Promise.resolve({ id: '1' }) };

function makeRequest(method: string, body?: object) {
  return new NextRequest('http://localhost/api/characters/1', {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
}

const SAMPLE_CHARACTER = {
  id: 1,
  name: 'Shadow',
  data: { stress: 2, coins: 1, alias: 'The Shadow' },
  created_at: '2024-01-01',
  updated_at: '2024-01-02',
};

// ── GET ────────────────────────────────────────────────────────────────────

describe('GET /api/characters/[id]', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 401 when not authenticated', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    const response = await GET(makeRequest('GET'), PARAMS);
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body).toMatchObject({ error: 'Unauthorized' });
  });

  it('returns 404 when the character does not belong to the user', async () => {
    vi.mocked(getServerSession).mockResolvedValue(AUTHED_SESSION);
    vi.mocked(getCharacterById).mockResolvedValue(null);

    const response = await GET(makeRequest('GET'), PARAMS);
    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body).toMatchObject({ error: 'Character not found' });
  });

  it('returns the character data when found', async () => {
    vi.mocked(getServerSession).mockResolvedValue(AUTHED_SESSION);
    vi.mocked(getCharacterById).mockResolvedValue(SAMPLE_CHARACTER);

    const response = await GET(makeRequest('GET'), PARAMS);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual(SAMPLE_CHARACTER);
    expect(getCharacterById).toHaveBeenCalledWith(1, 42);
  });
});

// ── PUT ────────────────────────────────────────────────────────────────────

describe('PUT /api/characters/[id]', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 401 when not authenticated', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    const response = await PUT(makeRequest('PUT', { name: 'X', data: {} }), PARAMS);
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body).toMatchObject({ error: 'Unauthorized' });
  });

  it('returns 400 when name is missing', async () => {
    vi.mocked(getServerSession).mockResolvedValue(AUTHED_SESSION);

    const response = await PUT(makeRequest('PUT', { data: {} }), PARAMS);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body).toMatchObject({ error: 'Name and data are required' });
  });

  it('returns 400 when data is missing', async () => {
    vi.mocked(getServerSession).mockResolvedValue(AUTHED_SESSION);

    const response = await PUT(makeRequest('PUT', { name: 'Shadow' }), PARAMS);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body).toMatchObject({ error: 'Name and data are required' });
  });

  it('returns 404 when the character does not belong to the user', async () => {
    vi.mocked(getServerSession).mockResolvedValue(AUTHED_SESSION);
    vi.mocked(updateCharacter).mockResolvedValue(null);

    const response = await PUT(makeRequest('PUT', { name: 'Shadow', data: {} }), PARAMS);
    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body).toMatchObject({ error: 'Character not found' });
  });

  it('updates and returns the character', async () => {
    vi.mocked(getServerSession).mockResolvedValue(AUTHED_SESSION);
    const updated = { id: 1, name: 'Shadow', data: { stress: 3 }, updated_at: '2024-06-01' };
    vi.mocked(updateCharacter).mockResolvedValue(updated);

    const response = await PUT(
      makeRequest('PUT', { name: 'Shadow', data: { stress: 3 } }),
      PARAMS,
    );
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual(updated);
    expect(updateCharacter).toHaveBeenCalledWith(1, 42, 'Shadow', { stress: 3 });
  });
});

// ── DELETE ─────────────────────────────────────────────────────────────────

describe('DELETE /api/characters/[id]', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 401 when not authenticated', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    const response = await DELETE(makeRequest('DELETE'), PARAMS);
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body).toMatchObject({ error: 'Unauthorized' });
  });

  it('returns 404 when the character does not exist for this user', async () => {
    vi.mocked(getServerSession).mockResolvedValue(AUTHED_SESSION);
    vi.mocked(deleteCharacter).mockResolvedValue(null);

    const response = await DELETE(makeRequest('DELETE'), PARAMS);
    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body).toMatchObject({ error: 'Character not found' });
  });

  it('deletes the character and returns success', async () => {
    vi.mocked(getServerSession).mockResolvedValue(AUTHED_SESSION);
    vi.mocked(deleteCharacter).mockResolvedValue({ id: 1 });

    const response = await DELETE(makeRequest('DELETE'), PARAMS);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual({ success: true });
    expect(deleteCharacter).toHaveBeenCalledWith(1, 42);
  });
});
