import Database from "better-sqlite3";

export function connect() {
  let dbi = Database("./src/db/tasks.db"); //{ verbose: console.log }

  createDatabase(dbi);

  return dbi;
}

function createDatabase(db) {
  const query = `CREATE TABLE IF NOT EXISTS threads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    threadId INTEGER UNIQUE NOT NULL,
    threadPath TEXT NOT NULL,
    title TEXT NOT NULL,
    published BOOLEAN NOT NULL CHECK (published IN (0, 1)),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TRIGGER IF NOT EXISTS trg_updated_at
    AFTER UPDATE ON threads FOR EACH ROW 
    BEGIN
    UPDATE threads SET updated_at = CURRENT_TIMESTAMP WHERE id = old.id;
    END;`;

  return db.exec(query);
}
