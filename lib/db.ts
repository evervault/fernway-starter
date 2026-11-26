import { DatabaseSync } from "node:sqlite";
import { existsSync } from "node:fs";
import path from "node:path";

const DB_PATH = path.join(process.cwd(), "data", "fernway.db");

let db: DatabaseSync | undefined;

/** The local SQLite database, opened read-only. Server code only. */
export function getDb(): DatabaseSync {
  if (!db) {
    if (!existsSync(DB_PATH))
      throw new Error("data/fernway.db not found. Run `npm run db:setup` first.");
    db = new DatabaseSync(DB_PATH, { readOnly: true });
  }
  return db;
}
