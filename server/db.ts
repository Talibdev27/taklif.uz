import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from "@shared/schema";

// Use SQLite for local development
const sqlite = new Database('wedding.db');
export const db = drizzle(sqlite, { schema });