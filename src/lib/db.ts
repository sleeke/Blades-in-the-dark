import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      username VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS characters (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL DEFAULT 'Unnamed Character',
      data JSONB NOT NULL DEFAULT '{}',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);
}

export async function getUserByEmail(email: string) {
  const result = await pool.query(
    'SELECT id, email, password_hash, username FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
}

export async function createUser(email: string, passwordHash: string, username: string) {
  const result = await pool.query(
    'INSERT INTO users (email, password_hash, username) VALUES ($1, $2, $3) RETURNING id, email, username',
    [email, passwordHash, username]
  );
  return result.rows[0];
}

export async function getCharactersByUser(userId: number) {
  const result = await pool.query(
    'SELECT id, name, updated_at FROM characters WHERE user_id = $1 ORDER BY updated_at DESC',
    [userId]
  );
  return result.rows;
}

export async function getCharacterById(id: number, userId: number) {
  const result = await pool.query(
    'SELECT id, name, data, created_at, updated_at FROM characters WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  return result.rows[0] || null;
}

export async function createCharacter(userId: number, name: string, data: object) {
  const result = await pool.query(
    'INSERT INTO characters (user_id, name, data) VALUES ($1, $2, $3) RETURNING id, name, data, created_at, updated_at',
    [userId, name, JSON.stringify(data)]
  );
  return result.rows[0];
}

export async function updateCharacter(id: number, userId: number, name: string, data: object) {
  const result = await pool.query(
    'UPDATE characters SET name = $1, data = $2, updated_at = NOW() WHERE id = $3 AND user_id = $4 RETURNING id, name, data, updated_at',
    [name, JSON.stringify(data), id, userId]
  );
  return result.rows[0] || null;
}

export async function deleteCharacter(id: number, userId: number) {
  const result = await pool.query(
    'DELETE FROM characters WHERE id = $1 AND user_id = $2 RETURNING id',
    [id, userId]
  );
  return result.rows[0] || null;
}
