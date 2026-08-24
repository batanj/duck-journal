import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { AppShell } from "@/components/journal/app-shell";
import { ClientOnly } from "@/components/journal/client-only";
import { DailyBarChart, EquityChart } from "@/components/journal/charts";
import { PnlText } from "@/components/journal/pnl";
import { SectionLabel, Surface } from "@/components/journal/surface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { money, pct } from "@/lib/journal/format";
import { filterByRange, RANGE_OPTIONS, type RangeKey } from "@/lib/journal/range";
import { computeStats } from "@/lib/journal/stats";
import { useJournalStore } from "@/lib/journal/store";
import { useJournalUi } from "@/lib/journal/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <AppShell>
      <Dashboard />
    </AppShell>
  );
}

function Dashboard() {
  const trades = useJournalStore((s) => s.trades);
  const openAdd = useJournalUi((s) => s.openAddAccount);
  const accounts = useJournalStore((s) => s.accounts);
  const navigate = useNavigate();
  const [range, setRange] = useState<RangeKey>("all");

  const scoped = useMemo(() => filterByRange(trades, range), [trades, range]);
  const stats = useMemo(() => computeStats(scoped), [scoped]);
  const recent = useMemo(
    () => [...scoped].sort((a, b) => +new Date(b.exitAt) - +new Date(a.exitAt)).slice(0, 6),
    [scoped],
  );

  if (trades.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-start gap-5 py-10">
        <p className="text-4xl font-semibold tracking-tight">No fills yet</p>
        <p className="text-muted-foreground">
          Connect a terminal account to pull history, or import a CSV from MetaTrader 4 or 5.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button onClick={openAdd}>Add account</Button>
          <Button asChild variant="outline">
            <Link to="/import">Import history</Link>
          </Button>
        </div>
      </div>
    );
  }

  const pf =
    !Number.isFinite(stats.profitFactor)
      ? "∞"
      : stats.profitFactor.toFixed(2);

  return (
    <div className="stagger-in grid gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
            {format(new Date(), "EEEE, d MMMM yyyy")}
          </p>
          <h1 className="mt-1 text-4xl font-semibold tracking-tight sm:text-5xl">
            The book
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            All accounts · {accounts.length} desk{accounts.length === 1 ? "" : "s"} · {stats.count}{" "}
            fills
          </p>
        </div>
        <div className="flex flex-wrap gap-1 rounded-lg bg-secondary p-1">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setRange(opt.id)}
              className={cn(
                "h-9 rounded-md px-3 text-sm transition-colors duration-150",
                range === opt.id
                  ? "bg-card text-foreground shadow-[var(--shadow-border)]"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </header>

      <Surface className="bg-card">
        <SectionLabel>Net P&L</SectionLabel>
        <p className="text-5xl font-semibold tracking-tight sm:text-6xl">
          <PnlText value={stats.netPnl} className="font-semibold" />
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Running P&L from closed fills · max DD {money(stats.maxDrawdown, { digits: 0 })}
        </p>
        <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat label="Win rate" value={pct(stats.winRate)} />
          <Stat label="Profit factor" value={pf} />
          <Stat label="Expectancy" value={money(stats.expectancy, { sign: true })} tone={stats.expectancy} />
          <Stat
            label="Max drawdown"
            value={money(stats.maxDrawdown, { digits: 0 })}
            muted
          />
        </dl>
      </Surface>

      <div className="grid gap-4 lg:grid-cols-5">
        <Surface className="lg:col-span-3 h-80">
          <SectionLabel>Equity</SectionLabel>
          <div className="h-60">
            <ClientOnly fallback={<div className="h-full rounded-md bg-muted" />}>
              <EquityChart data={stats.equityCurve} />
            </ClientOnly>
          </div>
        </Surface>
        <Surface className="lg:col-span-2 h-80">
          <SectionLabel>Daily P&L</SectionLabel>
          <div className="h-60">
            <ClientOnly fallback={<div className="h-full rounded-md bg-muted" />}>
              <DailyBarChart data={stats.daily} />
            </ClientOnly>
          </div>
        </Surface>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Surface className="lg:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <SectionLabel>Recent fills</SectionLabel>
            <Link to="/trades" className="text-xs text-muted-foreground hover:text-foreground">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {recent.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/trades", search: { fill: t.id } })}
                  className="flex w-full items-center gap-3 py-3 text-left transition-colors duration-150 hover:bg-accent/40"
                >
                  <div className="w-16">
                    <p className="text-sm font-medium">{t.symbol}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(t.exitAt), "MMM d")}
                    </p>
                  </div>
                  <Badge variant={t.side === "long" ? "win" : "loss"} className="capitalize">
                    {t.side}
                  </Badge>
                  <p className="hidden flex-1 truncate text-sm text-muted-foreground sm:block">
                    {t.setup || t.notes || "—"}
                  </p>
                  <PnlText value={t.pnl} className="ml-auto text-sm font-medium" />
                </button>
              </li>
            ))}
          </ul>
        </Surface>
        <Surface className="lg:col-span-2">
          <SectionLabel>By setup</SectionLabel>
          <ul className="grid gap-3">
            {stats.bySetup.slice(0, 6).map((row) => (
              <li key={row.key} className="grid grid-cols-[1fr_auto] items-baseline gap-2">
                <div>
                  <p className="text-sm">{row.key}</p>
                  <p className="text-xs text-muted-foreground">
                    {row.trades} fills · {pct(row.winRate, 0)} wins
                  </p>
                </div>
                <PnlText value={row.pnl} className="text-sm" />
              </li>
            ))}
          </ul>
        </Surface>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
  muted,
}: {
  label: string;
  value: string;
  tone?: number;
  muted?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs tracking-wide text-muted-foreground uppercase">{label}</dt>
      <dd
        className={cn(
          "mt-1 font-medium tabular",
          muted && "text-foreground",
          tone !== undefined && tone > 0 && "text-win",
          tone !== undefined && tone < 0 && "text-loss",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
