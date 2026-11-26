import { NextResponse, type NextRequest } from "next/server";
import { listEvents } from "@/lib/events";

const MAX_PAGE_SIZE = 200;

/** GET /api/events?page=1&pageSize=50 returns raw events, newest first. */
export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const page = Number(params.get("page") ?? 1);
  const pageSize = Number(params.get("pageSize") ?? 50);
  if (
    !Number.isInteger(page) ||
    page < 1 ||
    !Number.isInteger(pageSize) ||
    pageSize < 1 ||
    pageSize > MAX_PAGE_SIZE
  ) {
    return NextResponse.json(
      { error: `page must be an integer >= 1 and pageSize an integer from 1 to ${MAX_PAGE_SIZE}` },
      { status: 400 },
    );
  }
  return NextResponse.json(listEvents(page, pageSize));
}
