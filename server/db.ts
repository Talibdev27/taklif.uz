import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from "@shared/schema";

// Environment-based database configuration
const DATABASE_URL = process.env.DATABASE_URL;

let db: any = null;

// Initialize database connection
async function initializeDatabase() {
  // Try to use PostgreSQL if available
  if (DATABASE_URL && DATABASE_URL.startsWith('postgres')) {
    console.log('🔗 Attempting PostgreSQL connection...');
    try {
      // Dynamic import for PostgreSQL
      const { drizzle: drizzleNode } = await import('drizzle-orm/node-postgres');
      const { Pool } = await import('pg');
      
      const pool = new Pool({
        connectionString: DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      });

      // Test the connection
      const client = await pool.connect();
      await client.query('SELECT NOW()');
      client.release();

      db = drizzleNode(pool, { schema });
      console.log('✅ PostgreSQL connected successfully');
      return true;
    } catch (error) {
      console.error('❌ PostgreSQL connection failed:', error instanceof Error ? error.message : String(error));
      console.log('⚠️ Falling back to SQLite...');
    }
  }

  // Fallback to SQLite
  console.log('💾 Using SQLite database');
  const sqlite = new Database('wedding.db');
  db = drizzle(sqlite, { schema });
  
  // Warn if using SQLite in production
  if (process.env.NODE_ENV === 'production') {
    console.warn('⚠️ WARNING: Using SQLite in production! Data may not persist between deployments.');
    console.warn('⚠️ Please configure DATABASE_URL with a PostgreSQL connection string.');
  }
  
  return false;
}

// Initialize database immediately
initializeDatabase().catch(error => {
  console.error('💥 Database initialization failed:', error);
  process.exit(1);
});

export { db };