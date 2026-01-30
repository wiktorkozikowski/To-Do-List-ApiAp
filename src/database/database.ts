import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(__dirname, '../../tasks.db');
const db = new Database(DB_PATH);

db.pragma('foreign_keys = ON');

export function initializeDatabase(): void {
  const createTablesSQL = `
    CREATE TABLE IF NOT EXISTS task_lists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      list_id INTEGER,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'completed', 'cancelled')),
      deadline TEXT,
      estimated_time REAL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (list_id) REFERENCES task_lists(id) ON DELETE CASCADE
    );
  `;

  try {
    db.exec(createTablesSQL);
    try { db.exec('ALTER TABLE tasks ADD COLUMN deadline TEXT;'); } catch {}
    try { db.exec('ALTER TABLE tasks ADD COLUMN estimated_time REAL;'); } catch {}
    console.log('✅ Baza danych zainicjalizowana pomyślnie');
  } catch (error) {
    console.error('❌ Błąd inicjalizacji bazy danych:', error);
    throw error;
  }
}

// Export instancji bazy danych
export default db;
