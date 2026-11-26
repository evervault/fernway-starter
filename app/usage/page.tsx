"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { EventsPage } from "@/lib/events";

const PAGE_SIZE = 50;

export default function UsagePage() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<EventsPage | null>(null);

  useEffect(() => {
    void fetch(`/api/events?page=${page}&pageSize=${PAGE_SIZE}`)
      .then((res) => res.json() as Promise<EventsPage>)
      .then(setData);
  }, [page]);

  const pageCount = data ? Math.ceil(data.total / data.pageSize) : 1;

  return (
    <main className="p-6">
      <h1>Usage</h1>
      <div>
        <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          Previous
        </Button>
        Page {page} of {pageCount}
        <Button
          variant="outline"
          disabled={page >= pageCount}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>created_at</TableHead>
            <TableHead>message_id</TableHead>
            <TableHead>api_key</TableHead>
            <TableHead>channel</TableHead>
            <TableHead>country</TableHead>
            <TableHead>status</TableHead>
            <TableHead>failure_reason</TableHead>
            <TableHead>cost_usd_micros</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.events.map((e) => (
            <TableRow key={e.event_id}>
              <TableCell>{e.created_at}</TableCell>
              <TableCell>{e.message_id}</TableCell>
              <TableCell>{e.api_key}</TableCell>
              <TableCell>{e.channel}</TableCell>
              <TableCell>{e.country}</TableCell>
              <TableCell>{e.status}</TableCell>
              <TableCell>{e.failure_reason}</TableCell>
              <TableCell>{e.cost_usd_micros}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}
