const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'growthpath.db'), { verbose: console.log });

// Initialize Schema
const schema = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    firstName TEXT,
    lastName TEXT,
    email TEXT UNIQUE,
    avatar TEXT,
    settings TEXT
  );

  CREATE TABLE IF NOT EXISTS habits (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    emoji TEXT,
    category TEXT,
    completions TEXT
  );

  CREATE TABLE IF NOT EXISTS journal_entries (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    date TEXT NOT NULL,
    mood_text TEXT,
    gratitude TEXT,
    highlights TEXT,
    challenges TEXT,
    learning TEXT,
    goals TEXT,
    notes TEXT,
    lastUpdated TEXT,
    UNIQUE(user_id, date)
  );

  CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT,
    type TEXT,
    content TEXT,
    createdAt TEXT
  );
`;

db.exec(schema);

module.exports = db;
