import { sql } from '@vercel/postgres';

export async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      username VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS characters (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL DEFAULT 'Unnamed Character',
      data JSONB NOT NULL DEFAULT '{}',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

export async function getUserByEmail(email: string) {
  const result = await sql`
    SELECT id, email, password_hash, username FROM users WHERE email = ${email}
  `;
  return result.rows[0] || null;
}

export async function createUser(email: string, passwordHash: string, username: string) {
  const result = await sql`
    INSERT INTO users (email, password_hash, username)
    VALUES (${email}, ${passwordHash}, ${username})
    RETURNING id, email, username
  `;
  return result.rows[0];
}

export async function getCharactersByUser(userId: number) {
  const result = await sql`
    SELECT id, name, updated_at FROM characters
    WHERE user_id = ${userId}
    ORDER BY updated_at DESC
  `;
  return result.rows;
}

export async function getCharacterById(id: number, userId: number) {
  const result = await sql`
    SELECT id, name, data, created_at, updated_at FROM characters
    WHERE id = ${id} AND user_id = ${userId}
  `;
  return result.rows[0] || null;
}

export async function createCharacter(userId: number, name: string, data: object) {
  const result = await sql`
    INSERT INTO characters (user_id, name, data)
    VALUES (${userId}, ${name}, ${JSON.stringify(data)})
    RETURNING id, name, data, created_at, updated_at
  `;
  return result.rows[0];
}

export async function updateCharacter(id: number, userId: number, name: string, data: object) {
  const result = await sql`
    UPDATE characters
    SET name = ${name}, data = ${JSON.stringify(data)}, updated_at = NOW()
    WHERE id = ${id} AND user_id = ${userId}
    RETURNING id, name, data, updated_at
  `;
  return result.rows[0] || null;
}

export async function deleteCharacter(id: number, userId: number) {
  const result = await sql`
    DELETE FROM characters WHERE id = ${id} AND user_id = ${userId}
    RETURNING id
  `;
  return result.rows[0] || null;
}
