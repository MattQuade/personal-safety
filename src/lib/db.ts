// src/lib/db.ts
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dataDir = path.join(process.cwd(), 'data');
const dbFile = path.join(dataDir, 'safety.db');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbFile);

// Create table if not exists
db.exec(`
  CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL,
    status TEXT NOT NULL,
    message TEXT,
    location TEXT
  );
`);

export type Alert = {
  id: number;
  created_at: string;
  status: 'pending' | 'acknowledged' | 'cancelled';
  message: string | null;
  location: string | null;
};

export function createAlert(message: string | null, location: string | null): Alert {
  const createdAt = new Date().toISOString();
  const stmt = db.prepare(
    'INSERT INTO alerts (created_at, status, message, location) VALUES (?, ?, ?, ?)'
  );
  const info = stmt.run(createdAt, 'pending', message, location);
  return {
    id: Number(info.lastInsertRowid),
    created_at: createdAt,
    status: 'pending',
    message,
    location,
  };
}

export function listAlerts(): Alert[] {
  return db.prepare<[], Alert>('SELECT * FROM alerts ORDER BY id DESC').all();
}

export function acknowledgeAlert(id: number) {
  db.prepare('UPDATE alerts SET status = ? WHERE id = ?').run('acknowledged', id);
}

export function cancelAlert(id: number) {
  db.prepare('UPDATE alerts SET status = ? WHERE id = ?').run('cancelled', id);
}