import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCharactersByUser, createCharacter, initDb } from '@/lib/db';
import { defaultCharacterData } from '@/lib/characterDefaults';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initDb();
    const characters = await getCharactersByUser(Number(session.user.id));
    return NextResponse.json(characters);
  } catch (error) {
    console.error('GET characters error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initDb();
    const body = await request.json();
    const name = body.name || 'New Character';
    const character = await createCharacter(Number(session.user.id), name, defaultCharacterData);
    return NextResponse.json(character, { status: 201 });
  } catch (error) {
    console.error('POST character error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
