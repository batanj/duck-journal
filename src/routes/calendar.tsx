import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AccountFocus } from "@/components/journal/account-focus";
import { AppShell } from "@/components/journal/app-shell";
import { PnlText } from "@/components/journal/pnl";
import { SectionLabel, Surface } from "@/components/journal/surface";
import { Button } from "@/components/ui/button";
import { useFocusedTrades } from "@/lib/journal/store";
import { cn } from "@/lib/utils";

function cellMoney(n: number) {
  const sign = n > 0 ? "+" : n < 0 ? "-" : "";
  const abs = Math.abs(n);
  if (abs >= 1000) return `${sign}${(abs / 1000).toFixed(1)}k`;
  return `${sign}${Math.round(abs)}`;
}

export const Route = createFileRoute("/calendar")({ component: CalendarPage });

function CalendarPage() {
  return (
    <AppShell>
      <CalendarView />
    </AppShell>
  );
}

function CalendarView() {
  const trades = useFocusedTrades();
  const navigate = useNavigate();
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));
  const [picked, setPicked] = useState<string | null>(null);

  const byDay = useMemo(() => {
    const map = new Map<string, { pnl: number; trades: typeof trades }>();
    for (const t of trades) {
      const key = format(new Date(t.exitAt), "yyyy-MM-dd");
      const prev = map.get(key) ?? { pnl: 0, trades: [] };
      prev.pnl += t.pnl;
      prev.trades.push(t);
      map.set(key, prev);
    }
    return map;
  }, [trades]);

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(cursor), { weekStartsOn: 0 }),
    end: endOfWeek(endOfMonth(cursor), { weekStartsOn: 0 }),
  });

  const monthPnl = [...byDay.entries()]
    .filter(([k]) => k.startsWith(format(cursor, "yyyy-MM")))
    .reduce((s, [, v]) => s + v.pnl, 0);

  const pickedDay = picked ? byDay.get(picked) : null;
  const intensities = [...byDay.values()].map((v) => Math.abs(v.pnl));
  const maxAbs = Math.max(400, ...intensities, 1);

  return (
    <div className="grid gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
            Daily P&L
          </p>
          <h1 className="mt-1 text-4xl font-semibold tracking-tight">
            {format(cursor, "MMMM yyyy")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Month net <PnlText value={monthPnl} className="font-medium" />
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <AccountFocus />
          <div className="flex gap-1">
          <Button
            size="icon"
            variant="outline"
            aria-label="Previous month"
            onClick={() => setCursor((d) => subMonths(d, 1))}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            aria-label="Next month"
            onClick={() => setCursor((d) => addMonths(d, 1))}
          >
            <ChevronRight className="size-4" />
          </Button>
          </div>
        </div>
      </header>

      <Surface className="p-3 sm:p-4">
        <div className="mb-2 grid grid-cols-7 text-center text-xs tracking-wide text-muted-foreground uppercase">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="py-2">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const rec = byDay.get(key);
            const inMonth = isSameMonth(day, cursor);
            const intensity = rec ? Math.min(1, Math.abs(rec.pnl) / maxAbs) : 0;
            const win = (rec?.pnl ?? 0) >= 0;
            return (
              <button
                key={key}
                type="button"
                disabled={!rec}
                onClick={() => setPicked(key)}
                className={cn(
                  "relative flex min-h-14 flex-col items-start overflow-hidden rounded-md p-1.5 text-left transition-colors duration-150 sm:min-h-20 sm:p-2",
                  inMonth ? "text-foreground" : "text-muted-foreground/40",
                  rec ? "hover:ring-1 hover:ring-foreground/30" : "cursor-default",
                  picked === key && "ring-1 ring-foreground/80",
                )}
                style={
                  rec
                    ? {
                        backgroundColor: win
                          ? `color-mix(in oklab, var(--win) ${8 + intensity * 28}%, transparent)`
                          : `color-mix(in oklab, var(--loss) ${8 + intensity * 28}%, transparent)`,
                      }
                    : undefined
                }
              >
                <span className="text-xs tabular">{format(day, "d")}</span>
                {rec ? (
                  <span
                    className={cn(
                      "mt-auto hidden whitespace-nowrap text-xs font-medium leading-none tabular sm:block",
                      rec.pnl >= 0 ? "text-win" : "text-loss",
                    )}
                  >
                    {cellMoney(rec.pnl)}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </Surface>

      {picked && pickedDay ? (
        <Surface>
          <SectionLabel>{format(new Date(picked), "EEEE, d MMMM")}</SectionLabel>
          <p className="mb-4 text-sm text-muted-foreground">
            {pickedDay.trades.length} fill{pickedDay.trades.length === 1 ? "" : "s"} · net{" "}
            <PnlText value={pickedDay.pnl} />
          </p>
          <ul className="divide-y divide-border">
            {pickedDay.trades
              .slice()
              .sort((a, b) => +new Date(a.exitAt) - +new Date(b.exitAt))
              .map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => navigate({ to: "/trades", search: { fill: t.id } })}
                    className="flex w-full items-center gap-3 py-3 text-left hover:bg-accent/40"
                  >
                    <span className="w-16 font-medium">{t.symbol}</span>
                    <span className="text-xs text-muted-foreground capitalize">{t.side}</span>
                    <span className="hidden flex-1 truncate text-sm text-muted-foreground sm:block">
                      {t.setup || t.notes}
                    </span>
                    <PnlText value={t.pnl} className="ml-auto text-sm" />
                  </button>
                </li>
              ))}
          </ul>
        </Surface>
      ) : (
        <p className="text-sm text-muted-foreground">Select a day with fills to review the tape.</p>
      )}
    </div>
  );
}
