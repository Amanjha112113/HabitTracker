const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'growthpath.db'), { verbose: console.log });

// Initialize Schema
const schema = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    avatar TEXT,
    settings TEXT -- JSON string for app settings
  );

  CREATE TABLE IF NOT EXISTS habits (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    emoji TEXT,
    category TEXT,
    completions TEXT -- JSON string array of dates
  );

  CREATE TABLE IF NOT EXISTS journal_entries (
    date TEXT PRIMARY KEY,
    mood INTEGER, -- Stored as number for now, or text 'happy', etc. Let's start with text to match frontend type if possible or map it. 
    -- Actually frontend uses 'happy' | 'neutral' etc. Let's use TEXT.
    mood_text TEXT,
    gratitude TEXT,
    highlights TEXT,
    challenges TEXT,
    learning TEXT,
    goals TEXT,
    notes TEXT,
    lastUpdated TEXT
  );

  CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    title TEXT,
    type TEXT,
    content TEXT,
    createdAt TEXT
  );
`;

db.exec(schema);

// Migration: Ensure password column exists for existing DBs
try {
  db.exec('ALTER TABLE users ADD COLUMN password TEXT');
} catch (e) {
  // Ignore error if column already exists
}

module.exports = db;
