import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

const sqlite = new Database('sqlite.db');
export const db = drizzle(sqlite, { schema });

// Initialize database
export function initDb() {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      name TEXT,
      lives INTEGER DEFAULT 5,
      streak INTEGER DEFAULT 0,
      level TEXT DEFAULT 'Algorithm Novice'
    );
    CREATE TABLE IF NOT EXISTS progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER REFERENCES users(id),
      algorithm TEXT NOT NULL,
      levelReached INTEGER DEFAULT 1,
      completionPercentage INTEGER DEFAULT 0,
      stars INTEGER DEFAULT 0
    );
  `);
}
