import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { Plus, Search } from "lucide-react";
import { AccountFocus } from "@/components/journal/account-focus";
import { AppShell } from "@/components/journal/app-shell";
import { PnlText } from "@/components/journal/pnl";
import { TradeInspector } from "@/components/journal/trade-inspector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFocusedTrades, usePlaybook } from "@/lib/journal/store";
import { useJournalUi } from "@/lib/journal/ui";
import { SYMBOLS, type Side } from "@/lib/journal/types";
import { cn } from "@/lib/utils";

type FillsSearch = { fill?: string };

export const Route = createFileRoute("/trades")({
  validateSearch: (search: Record<string, unknown>): FillsSearch => ({
    fill: typeof search.fill === "string" ? search.fill : undefined,
  }),
  component: TradesPage,
});

function TradesPage() {
  return (
    <AppShell>
      <TradesView />
    </AppShell>
  );
}

function TradesView() {
  const trades = useFocusedTrades();
  const playbook = usePlaybook();
  const navigate = Route.useNavigate();
  const { fill } = Route.useSearch();
  const openLogFill = useJournalUi((s) => s.openLogFill);
  const [q, setQ] = useState("");
  const [symbol, setSymbol] = useState("all");
  const [side, setSide] = useState<"all" | Side>("all");
  const [setup, setSetup] = useState("all");

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    return [...trades]
      .filter((t) => (symbol === "all" ? true : t.symbol === symbol))
      .filter((t) => (side === "all" ? true : t.side === side))
      .filter((t) => (setup === "all" ? true : t.setup === setup))
      .filter((t) => {
        if (!query) return true;
        return (
          t.symbol.toLowerCase().includes(query) ||
          t.notes.toLowerCase().includes(query) ||
          t.setup.toLowerCase().includes(query) ||
          t.tags.some((tag) => tag.includes(query))
        );
      })
      .sort((a, b) => +new Date(b.exitAt) - +new Date(a.exitAt));
  }, [trades, q, symbol, side, setup]);

  const siblingIds = rows.map((t) => t.id);

  function openFill(id: string) {
    void navigate({ search: { fill: id } });
  }

  function closeFill() {
    void navigate({ search: { fill: undefined } });
  }

  return (
    <div className={cn("grid gap-5", fill && "lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-start")}>
      <div className={cn("grid gap-5", fill && "max-lg:hidden")}>
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
              {rows.length} of {trades.length}
            </p>
            <h1 className="mt-1 text-4xl font-semibold tracking-tight">Fills</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <AccountFocus />
            <Button onClick={openLogFill}>
              <Plus className="size-4" />
              Log fill
            </Button>
          </div>
        </header>

        <div className="grid gap-2 sm:grid-cols-4">
          <div className="relative sm:col-span-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search notes, tags"
              className="pl-9"
            />
          </div>
          <Select value={symbol} onValueChange={setSymbol}>
            <SelectTrigger>
              <SelectValue placeholder="Symbol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All symbols</SelectItem>
              {SYMBOLS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={side} onValueChange={(v) => setSide(v as "all" | Side)}>
            <SelectTrigger>
              <SelectValue placeholder="Side" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Long & short</SelectItem>
              <SelectItem value="long">Long</SelectItem>
              <SelectItem value="short">Short</SelectItem>
            </SelectContent>
          </Select>
          <Select value={setup} onValueChange={setSetup}>
            <SelectTrigger>
              <SelectValue placeholder="Setup" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All setups</SelectItem>
              {playbook.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="hidden overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)] md:block">
          <table className="w-full text-sm">
            <thead className="text-xs tracking-wide text-muted-foreground uppercase">
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left font-medium">Closed</th>
                <th className="px-4 py-3 text-left font-medium">Symbol</th>
                <th className="px-4 py-3 text-left font-medium">Side</th>
                <th className="px-4 py-3 text-right font-medium">Size</th>
                <th className="px-4 py-3 text-left font-medium">Setup</th>
                <th className="px-4 py-3 text-right font-medium">P&L</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr
                  key={t.id}
                  className={cn(
                    "cursor-pointer border-b border-border last:border-0 hover:bg-accent/40",
                    fill === t.id && "bg-accent border-l-2 border-l-primary",
                  )}
                  onClick={() => openFill(t.id)}
                >
                  <td className="px-4 py-3 text-muted-foreground">
                    {format(new Date(t.exitAt), "MMM d, HH:mm")}
                  </td>
                  <td className="px-4 py-3 font-medium">{t.symbol}</td>
                  <td className="px-4 py-3">
                    <Badge variant={t.side === "long" ? "win" : "loss"} className="capitalize">
                      {t.side}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right tabular">{t.qty}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.setup || "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <PnlText value={t.pnl} className="font-medium" />
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                    No fills match those filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <ul className="grid gap-2 md:hidden">
          {rows.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => openFill(t.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl bg-card p-4 text-left shadow-[var(--shadow-border)]",
                  fill === t.id && "ring-1 ring-primary/40",
                )}
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium">
                    {t.symbol}{" "}
                    <span className="text-muted-foreground capitalize">· {t.side}</span>
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {format(new Date(t.exitAt), "MMM d")} · {t.setup || "untagged"}
                  </p>
                </div>
                <PnlText value={t.pnl} className="text-sm font-medium" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {fill ? (
        <div className="max-lg:fixed max-lg:inset-0 max-lg:z-40 lg:sticky lg:top-8 lg:h-[calc(100dvh-4rem)]">
          <TradeInspector
            tradeId={fill}
            siblings={siblingIds}
            onSelect={openFill}
            onClose={closeFill}
          />
        </div>
      ) : null}
    </div>
  );
}
