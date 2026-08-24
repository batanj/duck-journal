import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { FileUp } from "lucide-react";
import { AccountFocus } from "@/components/journal/account-focus";
import { AppShell } from "@/components/journal/app-shell";
import { ConfirmAction } from "@/components/journal/confirm-action";
import { PnlText } from "@/components/journal/pnl";
import { Surface } from "@/components/journal/surface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  parseTradesCsv,
  PLATFORMS,
  tradesToCsv,
  type ParseResult,
  type PlatformId,
} from "@/lib/journal/csv";
import { SAMPLE_TRADES } from "@/lib/journal/sample-data";
import { useJournalStore } from "@/lib/journal/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/import")({ component: ImportPage });

function ImportPage() {
  return (
    <AppShell>
      <ImportView />
    </AppShell>
  );
}

function ImportView() {
  const importTrades = useJournalStore((s) => s.importTrades);
  const accounts = useJournalStore((s) => s.accounts);
  const [platform, setPlatform] = useState<Exclude<PlatformId, "auto">>("generic");
  const [parsed, setParsed] = useState<ParseResult | null>(null);
  const [drag, setDrag] = useState(false);
  const [confirmReplace, setConfirmReplace] = useState(false);
  const net = useMemo(
    () => parsed?.trades.reduce((s, t) => s + t.pnl, 0) ?? 0,
    [parsed],
  );

  function handleText(text: string, source: string) {
    const result = parseTradesCsv(text, platform === "generic" ? "auto" : platform);
    setParsed(result);
    if (!result.trades.length) {
      toast(`No fills read from ${source}`);
      return;
    }
    toast(`Read ${result.trades.length} fills · ${result.detected}`);
  }

  async function onFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    if (/\.xlsx?$/i.test(file.name)) {
      toast("Save the Excel file as CSV, or drop the HTML report instead.");
      return;
    }
    handleText(await file.text(), file.name);
  }

  function apply(mode: "merge" | "replace") {
    if (!parsed?.trades.length) return;
    if (!accounts.length) {
      toast("Connect an account first");
      return;
    }
    void importTrades(parsed.trades, mode).then((n) => {
      toast(mode === "replace" ? `Replaced this account with ${n} fills` : `Merged ${n} fills`);
      setParsed(null);
      setConfirmReplace(false);
    });
  }

  function downloadTemplate() {
    const blob = new Blob([tradesToCsv(SAMPLE_TRADES.slice(0, 12))], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "duckjournal-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-6">
      <header className="max-w-2xl">
        <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
          Terminals
        </p>
        <h1 className="mt-1 text-4xl font-semibold tracking-tight">Import</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          DuckJournal reads the file your terminal already exports. MT4/MT5{" "}
          <span className="text-foreground">Save as Report</span> (HTML), a CSV
          saved from that report, or a generic blotter. Parsing stays on this device.
        </p>
        <div className="mt-4 max-w-xs">
          <AccountFocus />
        </div>
      </header>

      <div className="grid gap-2 sm:grid-cols-3">
        {PLATFORMS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPlatform(p.id)}
            className={cn(
              "rounded-xl p-4 text-left shadow-[var(--shadow-border)] transition-[box-shadow,background-color] duration-150",
              platform === p.id ? "bg-secondary" : "bg-card hover:shadow-[var(--shadow-border-hover)]",
            )}
          >
            <p className="text-sm font-medium">{p.name}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.blurb}</p>
          </button>
        ))}
      </div>

      <Surface
        className={cn(
          "grid place-items-center gap-3 py-12 text-center transition-colors duration-150",
          drag && "bg-secondary",
        )}
      >
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            void onFiles(e.dataTransfer.files);
          }}
          className="grid w-full place-items-center gap-3"
        >
          <FileUp className="size-6 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Drop a report here</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {PLATFORMS.find((p) => p.id === platform)?.hint}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <Button asChild variant="outline">
              <label className="cursor-pointer">
                Choose file
                <input
                  type="file"
                  accept=".csv,.htm,.html,.txt,text/csv,text/html,text/plain"
                  className="sr-only"
                  onChange={(e) => {
                    void onFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
              </label>
            </Button>
            <Button variant="ghost" onClick={downloadTemplate}>
              Download template
            </Button>
          </div>
        </div>
      </Surface>

      {parsed && (
        <Surface>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs tracking-wide text-muted-foreground uppercase">Preview</p>
              <p className="mt-1 text-sm">
                {parsed.trades.length} fills · detected {parsed.detected} · net{" "}
                <PnlText value={net} />
              </p>
              {parsed.issues.length > 0 && (
                <p className="mt-1 text-xs text-loss">
                  {parsed.issues.length} row{parsed.issues.length === 1 ? "" : "s"} skipped
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => apply("merge")}>
                Merge
              </Button>
              <Button onClick={() => setConfirmReplace(true)}>Replace book</Button>
            </div>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {parsed.trades.slice(0, 8).map((t) => (
              <li key={t.id} className="flex items-center gap-3 py-2 text-sm">
                <span className="w-16 font-medium">{t.symbol}</span>
                <Badge variant={t.side === "long" ? "win" : "loss"} className="capitalize">
                  {t.side}
                </Badge>
                <span className="text-muted-foreground">{t.exitAt.slice(0, 10)}</span>
                <PnlText value={t.pnl} className="ml-auto" />
              </li>
            ))}
          </ul>
          {parsed.trades.length > 8 && (
            <p className="mt-2 text-xs text-muted-foreground">
              +{parsed.trades.length - 8} more
            </p>
          )}
        </Surface>
      )}

      <ConfirmAction
        open={confirmReplace}
        onOpenChange={setConfirmReplace}
        title="Replace this account's fills?"
        description="Existing fills on the focused account are removed. Other accounts are left alone. Journal notes on those fills will be gone."
        confirmLabel="Replace"
        onConfirm={() => apply("replace")}
      />
    </div>
  );
}
