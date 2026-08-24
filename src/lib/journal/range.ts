import { startOfMonth, startOfYear, subDays } from "date-fns";
import type { Trade } from "./types";

export type RangeKey = "7d" | "30d" | "month" | "year" | "all";

export const RANGE_OPTIONS: { id: RangeKey; label: string }[] = [
  { id: "7d", label: "7 days" },
  { id: "30d", label: "30 days" },
  { id: "month", label: "This month" },
  { id: "year", label: "This year" },
  { id: "all", label: "All" },
];

export function filterByRange(trades: Trade[], range: RangeKey, now = new Date()): Trade[] {
  if (range === "all") return trades;
  const start =
    range === "month"
      ? startOfMonth(now)
      : range === "year"
        ? startOfYear(now)
        : subDays(now, range === "7d" ? 7 : 30);
  const t0 = start.getTime();
  return trades.filter((t) => new Date(t.exitAt).getTime() >= t0);
}

export function filterByAccount(trades: Trade[], accountId: string): Trade[] {
  if (accountId === "all") return trades;
  return trades.filter((t) => t.accountId === accountId);
}