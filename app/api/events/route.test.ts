import { describe, expect, it } from "vite-plus/test";
import { NextRequest } from "next/server";
import { GET } from "./route";

const get = (query: string) => GET(new NextRequest(`http://localhost/api/events${query}`));

describe("GET /api/events", () => {
  it("returns a page of events, newest first", async () => {
    const res = get("?page=1&pageSize=5");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.events).toHaveLength(5);
    expect(body.total).toBeGreaterThan(5);
    const times = body.events.map((e: { created_at: string }) => e.created_at);
    expect(times).toEqual([...times].sort((a, b) => b.localeCompare(a)));
  });

  it("does not repeat events across pages", async () => {
    const [a, b] = await Promise.all([
      get("?page=1&pageSize=3").json(),
      get("?page=2&pageSize=3").json(),
    ]);
    const ids = [...a.events, ...b.events].map((e: { event_id: string }) => e.event_id);
    expect(new Set(ids).size).toBe(6);
  });

  it.each(["?page=0", "?pageSize=500", "?page=abc"])("rejects %s", (query) => {
    expect(get(query).status).toBe(400);
  });
});
