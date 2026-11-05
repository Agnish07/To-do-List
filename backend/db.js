const { DatabaseSync } = require('node:sqlite');
const path = require('path');

// One file on disk, created on first run. No server, no network.
const dbPath = process.env.SQLITE_PATH || path.join(__dirname, 'todolist.db');
const db = new DatabaseSync(dbPath);

// Enforce foreign keys so a task can't outlive its user
db.exec('PRAGMA foreign_keys = ON');

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        email         TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at    TEXT NOT NULL DEFAULT (datetime('now'))
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
        id      INTEGER PRIMARY KEY AUTOINCREMENT,
        text    TEXT NOT NULL,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
    )
`);

db.exec('CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id)');

console.log('SQLite ready at', dbPath);

module.exports = db;
