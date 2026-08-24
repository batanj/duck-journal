import { useMemo, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AccountFocus } from "@/components/journal/account-focus";
import { AppShell } from "@/components/journal/app-shell";
import { ClientOnly } from "@/components/journal/client-only";
import { GroupBarChart } from "@/components/journal/charts";
import { PnlText } from "@/components/journal/pnl";
import { SectionLabel, Surface } from "@/components/journal/surface";
import { money, pct } from "@/lib/journal/format";
import { computeStats, type GroupStat } from "@/lib/journal/stats";
import { useFocusedTrades } from "@/lib/journal/store";

export const Route = createFileRoute("/analytics")({ component: AnalyticsPage });

function AnalyticsPage() {
  return (
    <AppShell>
      <AnalyticsView />
    </AppShell>
  );
}

function processLine(stats: ReturnType<typeof computeStats>): string {
  if (stats.count === 0) return "No fills in this book yet.";
  if (stats.reviewed === 0) {
    return "None of these fills have a grade. Open a fill, mark the setup, and tag how it felt.";
  }
  const leak = stats.byEmotion.find((row) => row.key !== "Untagged");
  if (leak && leak.pnl < 0) {
    return `${leak.key} shows up on ${leak.trades} fills for ${money(leak.pnl)}. That’s the tell.`;
  }
  if (stats.leakPnl < 0 && stats.aTradePnl > stats.leakPnl) {
    return "A and B trades carry the book. The leak is below B.";
  }
  return "Grade the process, not the P&L. A losing A-trade still belongs here.";
}

function AnalyticsView() {
  const trades = useFocusedTrades();
  const stats = useMemo(() => computeStats(trades), [trades]);

  const weekdayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const byWeekday = weekdayOrder
    .map((k) => stats.byWeekday.find((r) => r.key === k))
    .filter((r): r is GroupStat => Boolean(r));
  const firstUntagged = trades.find((t) => !t.grade);

  return (
    <div className="grid gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
            Process & edge
          </p>
          <h1 className="mt-1 text-4xl font-semibold tracking-tight">Analytics</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">{processLine(stats)}</p>
        </div>
        <AccountFocus />
      </header>

      <Surface>
        <SectionLabel>Process</SectionLabel>
        <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Metric
            label="Reviewed"
            value={`${stats.reviewed}/${stats.count}`}
          />
          <Metric label="A / B rate" value={stats.reviewed ? pct(stats.aBRate, 0) : "—"} />
          <Metric label="A–B P&L" value={<PnlText value={stats.aTradePnl} />} />
          <Metric label="C–F leak" value={<PnlText value={stats.leakPnl} />} />
        </dl>
        {stats.reviewed === 0 && firstUntagged ? (
          <Link
            to="/trades"
            search={{ fill: firstUntagged.id }}
            className="mt-4 inline-flex h-11 items-center text-sm text-primary hover:underline"
          >
            Review the latest fill
          </Link>
        ) : null}
      </Surface>

      <div className="grid gap-4 lg:grid-cols-2">
        <Surface className="h-72">
          <SectionLabel>By grade</SectionLabel>
          <div className="h-52">
            <ClientOnly fallback={<div className="h-full rounded-md bg-muted" />}>
              <GroupBarChart data={stats.byGrade} />
            </ClientOnly>
          </div>
        </Surface>
        <Surface className="h-72">
          <SectionLabel>By emotion</SectionLabel>
          <div className="h-52">
            <ClientOnly fallback={<div className="h-full rounded-md bg-muted" />}>
              <GroupBarChart data={stats.byEmotion} labelWidth={108} />
            </ClientOnly>
          </div>
        </Surface>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GroupTable title="Grade" rows={stats.byGrade} />
        <GroupTable title="Emotion" rows={stats.byEmotion} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Avg win" value={money(stats.avgWin)} />
        <Kpi label="Avg loss" value={money(stats.avgLoss)} />
        <Kpi
          label="Current streak"
          value={
            stats.currentStreak === 0
              ? "—"
              : stats.currentStreak > 0
                ? `${stats.currentStreak} wins`
                : `${Math.abs(stats.currentStreak)} losses`
          }
        />
        <Kpi
          label="Best / worst"
          value={`${money(stats.maxWin, { sign: true, digits: 0 })} / ${money(stats.maxLoss, { digits: 0 })}`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Surface className="h-72">
          <SectionLabel>By symbol</SectionLabel>
          <div className="h-52">
            <ClientOnly fallback={<div className="h-full rounded-md bg-muted" />}>
              <GroupBarChart data={stats.bySymbol} />
            </ClientOnly>
          </div>
        </Surface>
        <Surface className="h-72">
          <SectionLabel>By weekday</SectionLabel>
          <div className="h-52">
            <ClientOnly fallback={<div className="h-full rounded-md bg-muted" />}>
              <GroupBarChart data={byWeekday} />
            </ClientOnly>
          </div>
        </Surface>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GroupTable title="Setups" rows={stats.bySetup} />
        <GroupTable title="Side" rows={stats.bySide} />
      </div>

      <Surface>
        <SectionLabel>Time of day</SectionLabel>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs tracking-wide text-muted-foreground uppercase">
              <tr className="border-b border-border">
                <th className="py-2 text-left font-medium">Hour</th>
                <th className="py-2 text-right font-medium">Fills</th>
                <th className="py-2 text-right font-medium">Win %</th>
                <th className="py-2 text-right font-medium">Net</th>
              </tr>
            </thead>
            <tbody>
              {[...stats.byHour]
                .sort((a, b) => a.key.localeCompare(b.key))
                .map((row) => (
                  <tr key={row.key} className="border-b border-border last:border-0">
                    <td className="py-2">{row.key}</td>
                    <td className="py-2 text-right tabular">{row.trades}</td>
                    <td className="py-2 text-right tabular">{pct(row.winRate, 0)}</td>
                    <td className="py-2 text-right">
                      <PnlText value={row.pnl} />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Surface>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <p className="text-xs tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className="mt-2 text-lg font-medium tabular">{value}</p>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Surface>
      <Metric label={label} value={value} />
    </Surface>
  );
}

function GroupTable({ title, rows }: { title: string; rows: GroupStat[] }) {
  return (
    <Surface>
      <SectionLabel>{title}</SectionLabel>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">Nothing to bucket yet.</p>
      ) : (
        <table className="w-full text-sm">
          <thead className="text-xs tracking-wide text-muted-foreground uppercase">
            <tr className="border-b border-border">
              <th className="py-2 text-left font-medium">Bucket</th>
              <th className="py-2 text-right font-medium">n</th>
              <th className="py-2 text-right font-medium">Win %</th>
              <th className="py-2 text-right font-medium">Avg</th>
              <th className="py-2 text-right font-medium">Net</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-b border-border last:border-0">
                <td className="py-2">{row.key}</td>
                <td className="py-2 text-right tabular">{row.trades}</td>
                <td className="py-2 text-right tabular">{pct(row.winRate, 0)}</td>
                <td className="py-2 text-right">
                  <PnlText value={row.avgPnl} />
                </td>
                <td className="py-2 text-right">
                  <PnlText value={row.pnl} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Surface>
  );
}
