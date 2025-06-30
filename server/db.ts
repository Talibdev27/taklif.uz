import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { drizzle as drizzleNode } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from "@shared/schema";

// Environment-based database configuration
const DATABASE_URL = process.env.DATABASE_URL;

let db: any;

if (DATABASE_URL && DATABASE_URL.startsWith('postgres')) {
  // Use PostgreSQL for production
  console.log('🔗 Using PostgreSQL database');
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
  db = drizzleNode(pool, { schema });
} else {
  // Use SQLite for local development
  console.log('💾 Using SQLite database (local development)');
  const sqlite = new Database('wedding.db');
  db = drizzle(sqlite, { schema });
}

export { db };