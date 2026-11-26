import { getDb } from "./db";

export type EventStatus = "queued" | "sent" | "delivered" | "failed";

/** One row of the `events` table. */
export type MessageEvent = {
  event_id: string;
  message_id: string;
  api_key: string;
  channel: "sms" | "email";
  country: string;
  status: EventStatus;
  failure_reason: string | null;
  cost_usd_micros: number;
  created_at: string;
};

export type EventsPage = { events: MessageEvent[]; page: number; pageSize: number; total: number };

/** Raw events, newest first. `page` starts at 1. */
export function listEvents(page: number, pageSize: number): EventsPage {
  const db = getDb();
  const events = db
    .prepare("SELECT * FROM events ORDER BY created_at DESC, event_id DESC LIMIT ? OFFSET ?")
    .all(pageSize, (page - 1) * pageSize) as MessageEvent[];
  const { total } = db.prepare("SELECT COUNT(*) AS total FROM events").get() as { total: number };
  return { events, page, pageSize, total };
}
