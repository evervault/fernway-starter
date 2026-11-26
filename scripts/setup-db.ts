// Builds data/fernway.db from data/events.csv.gz. Safe to run again: it rebuilds from scratch.
import { DatabaseSync } from "node:sqlite";
import { readFileSync, rmSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { fileURLToPath } from "node:url";

const dataDir = fileURLToPath(new URL("../data/", import.meta.url));
const dbPath = `${dataDir}fernway.db`;
const started = performance.now();

rmSync(dbPath, { force: true });
const db = new DatabaseSync(dbPath);
db.exec(`
  PRAGMA journal_mode = OFF;
  PRAGMA synchronous = OFF;
  CREATE TABLE events (
    event_id        TEXT PRIMARY KEY,
    message_id      TEXT NOT NULL,
    api_key         TEXT NOT NULL,
    channel         TEXT NOT NULL,
    country         TEXT NOT NULL,
    status          TEXT NOT NULL,
    failure_reason  TEXT,
    cost_usd_micros INTEGER NOT NULL,
    created_at      TEXT NOT NULL
  );
`);

const lines = gunzipSync(readFileSync(`${dataDir}events.csv.gz`))
  .toString("utf8")
  .trimEnd()
  .split("\n");
const insert = db.prepare("INSERT INTO events VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
db.exec("BEGIN");
for (const line of lines.slice(1)) {
  const [eventId, messageId, apiKey, channel, country, status, reason, cost, createdAt] =
    line.split(",");
  insert.run(
    eventId!,
    messageId!,
    apiKey!,
    channel!,
    country!,
    status!,
    reason || null,
    Number(cost),
    createdAt!,
  );
}
db.exec("COMMIT");

db.exec(`
  CREATE INDEX events_created_at ON events (created_at);
  CREATE INDEX events_message_id ON events (message_id, created_at);
  CREATE INDEX events_api_key ON events (api_key);
  ANALYZE;
`);
db.close();

const seconds = ((performance.now() - started) / 1000).toFixed(1);
console.log(`Loaded ${lines.length - 1} events into data/fernway.db in ${seconds}s`);
