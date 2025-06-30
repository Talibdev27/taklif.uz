import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from "@shared/schema";

// Environment-based database configuration
const DATABASE_URL = process.env.DATABASE_URL;

let db: any = null;

// Try to use PostgreSQL if available, fallback to SQLite
try {
  if (DATABASE_URL && DATABASE_URL.startsWith('postgres')) {
    console.log('🔗 Attempting PostgreSQL connection...');
    // Dynamic import for PostgreSQL (will be ignored if package not available)
    import('drizzle-orm/node-postgres').then(async ({ drizzle: drizzleNode }) => {
      const { Pool } = await import('pg');
      const pool = new Pool({
        connectionString: DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      });
      db = drizzleNode(pool, { schema });
      console.log('✅ PostgreSQL connected successfully');
    }).catch(error => {
      console.log('⚠️ PostgreSQL not available, using SQLite fallback');
      const sqlite = new Database('wedding.db');
      db = drizzle(sqlite, { schema });
    });
  } else {
    console.log('💾 Using SQLite database (local development)');
    const sqlite = new Database('wedding.db');
    db = drizzle(sqlite, { schema });
  }
} catch (error) {
  console.log('💾 Fallback to SQLite due to error:', error instanceof Error ? error.message : String(error));
  const sqlite = new Database('wedding.db');
  db = drizzle(sqlite, { schema });
}

// If db is still null after a moment, initialize with SQLite
setTimeout(() => {
  if (!db) {
    console.log('💾 Final SQLite fallback after timeout');
    const sqlite = new Database('wedding.db');
    db = drizzle(sqlite, { schema });
  }
}, 1000);

export { db };