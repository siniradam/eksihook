export function addThreads(db) {
  const query = `INSERT OR IGNORE INTO threads (threadId, threadPath, title, published) VALUES (@threadId, @threadPath, @title, @published)`;
  const insert = db.prepare(query);

  const queries = db.transaction((threads) => {
    for (const thread of threads) insert.run(thread);
  });

  return queries;
}

export function listTreads(db) {
  const query = `SELECT * FROM threads`;
  const select = db.prepare(query).all();
  return select;
}

export function getUnpublished(db) {
  const query = `SELECT * FROM threads WHERE published = 0`;
  const select = db.prepare(query).all();
  return select;
}

export function updatePublishStatus(db, threadId) {
  const query = `UPDATE threads SET published = 1 WHERE threadId = ?`;
  const update = db.prepare(query).run(threadId);
  return update;
}
