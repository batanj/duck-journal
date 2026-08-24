import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { ChevronDown, ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatFull } from "@/lib/journal/format";
import { useJournalStore, usePlaybook } from "@/lib/journal/store";
import { useJournalUi } from "@/lib/journal/ui";
import {
  EMOTIONS,
  INSTRUMENTS,
  type Emotion,
  type Grade,
  type Setup,
  type Trade,
} from "@/lib/journal/types";
import { cn } from "@/lib/utils";
import { ConfirmAction } from "./confirm-action";
import { PnlText } from "./pnl";
import { TradeChartPreview } from "./trade-chart";

export function TradeInspector({
  tradeId,
  siblings,
  onSelect,
  onClose,
}: {
  tradeId: string;
  siblings: string[];
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const trade = useJournalStore((s) => s.trades.find((t) => t.id === tradeId));
  const account = useJournalStore((s) => s.accounts.find((a) => a.id === trade?.accountId));
  const updateTrade = useJournalStore((s) => s.updateTrade);
  const removeTrade = useJournalStore((s) => s.removeTrade);
  const openChart = useJournalUi((s) => s.openChart);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [execOpen, setExecOpen] = useState(false);

  const index = siblings.indexOf(tradeId);
  const prevId = index > 0 ? siblings[index - 1] : null;
  const nextId = index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const typing =
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLInputElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable);
      if (e.key === "Escape") {
        if (confirmDelete) return;
        onClose();
      }
      if (typing) return;
      if (e.key === "ArrowUp" && prevId) {
        e.preventDefault();
        onSelect(prevId);
      }
      if (e.key === "ArrowDown" && nextId) {
        e.preventDefault();
        onSelect(nextId);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onSelect, prevId, nextId, confirmDelete]);

  if (!trade) {
    return (
      <aside className="flex h-full flex-col gap-3 rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
        <p className="text-sm text-muted-foreground">That fill is not on this desk.</p>
        <Button variant="outline" onClick={onClose}>
          Back to fills
        </Button>
      </aside>
    );
  }

  const fill = trade;

  function patch(next: Partial<Trade>) {
    void updateTrade(fill.id, next);
  }

  return (
    <aside className="flex h-full min-h-0 flex-col bg-background lg:rounded-xl lg:bg-card lg:shadow-[var(--shadow-border)]">
      <header className="flex items-start gap-2 border-b border-border px-4 py-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-2">
            <h2 className="text-xl font-semibold tracking-tight">{trade.symbol}</h2>
            <PnlText value={trade.pnl} className="font-sans text-base" />
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <Badge variant={trade.side === "long" ? "win" : "loss"} className="capitalize">
              {trade.side} {trade.qty}
            </Badge>
            {account ? <Badge variant="outline">{account.name}</Badge> : null}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button size="icon" variant="ghost" disabled={!prevId} onClick={() => prevId && onSelect(prevId)} aria-label="Previous fill">
            <ChevronLeft className="size-4" />
          </Button>
          <Button size="icon" variant="ghost" disabled={!nextId} onClick={() => nextId && onSelect(nextId)} aria-label="Next fill">
            <ChevronRight className="size-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={onClose} aria-label="Close inspector">
            <X className="size-4" />
          </Button>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <button
          type="button"
          onClick={() => openChart(trade.id)}
          className="relative mb-4 block h-48 w-full overflow-hidden rounded-lg bg-background text-left lg:bg-secondary/40"
        >
          <TradeChartPreview trade={trade} className="h-full w-full" />
          <span className="absolute top-2 right-2 inline-flex size-8 items-center justify-center rounded-md bg-card/90 text-muted-foreground">
            <Maximize2 className="size-3.5" />
          </span>
        </button>

        <button
          type="button"
          onClick={() => setExecOpen((v) => !v)}
          className="mb-4 flex w-full items-center justify-between rounded-md py-1 text-left"
        >
          <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Execution</span>
          <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", execOpen && "rotate-180")} />
        </button>
        {execOpen ? (
          <dl className="mb-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <Fact label="Instrument" value={INSTRUMENTS[trade.symbol]?.name ?? trade.symbol} />
            <Fact label="Fees" value={`$${trade.fees.toFixed(2)}`} />
            <Fact label="Entry" value={String(trade.entryPrice)} />
            <Fact label="Exit" value={String(trade.exitPrice)} />
            <Fact label="Opened" value={formatFull(trade.entryAt)} />
            <Fact label="Closed" value={format(new Date(trade.exitAt), "MMM d, HH:mm")} />
          </dl>
        ) : (
          <p className="mb-5 text-xs text-muted-foreground">
            {trade.entryPrice} → {trade.exitPrice} · {format(new Date(trade.entryAt), "HH:mm")}–
            {format(new Date(trade.exitAt), "HH:mm")}
          </p>
        )}

        <JournalEditor trade={trade} onPatch={patch} />
      </div>

      <footer className="border-t border-border px-4 py-3">
        <Button variant="destructive" className="w-full" onClick={() => setConfirmDelete(true)}>
          Delete fill
        </Button>
      </footer>

      <ConfirmAction
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete this fill?"
        description="It leaves the journal. Syncing this account again from Accounts will pull the fill back from the server. Setup, emotion, and notes on this row will not come back."
        confirmLabel="Delete fill"
        onConfirm={() => {
          void removeTrade(trade.id);
          onClose();
          toast("Fill removed");
        }}
      />
    </aside>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs tracking-wide text-muted-foreground uppercase">{label}</dt>
      <dd className="mt-1">{value}</dd>
    </div>
  );
}

function JournalEditor({
  trade,
  onPatch,
}: {
  trade: Trade;
  onPatch: (next: Partial<Trade>) => void;
}) {
  const playbook = usePlaybook();
  const [notes, setNotes] = useState(trade.notes);
  const notesRef = useRef(notes);
  notesRef.current = notes;
  const savedRef = useRef(trade.notes);
  savedRef.current = trade.notes;
  const patchRef = useRef(onPatch);
  patchRef.current = onPatch;

  useEffect(() => {
    setNotes(trade.notes);
  }, [trade.id, trade.notes]);

  useEffect(() => {
    if (notes === trade.notes) return;
    const timer = window.setTimeout(() => onPatch({ notes }), 450);
    return () => window.clearTimeout(timer);
    // Save on notes only — parent patch identity is stable enough for a timer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notes, trade.id, trade.notes]);

  useEffect(() => {
    return () => {
      if (notesRef.current !== savedRef.current) {
        patchRef.current({ notes: notesRef.current });
      }
    };
  }, [trade.id]);

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label>Setup</Label>
          <Select
            value={trade.setup || "none"}
            onValueChange={(v) => onPatch({ setup: v === "none" ? "" : (v as Setup) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Untagged" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Untagged</SelectItem>
              {playbook.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label>Process grade</Label>
          <Select
            value={trade.grade || "none"}
            onValueChange={(v) => onPatch({ grade: v === "none" ? "" : (v as Grade) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Ungraded" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Ungraded</SelectItem>
              {(["A", "B", "C", "D", "F"] as Grade[]).map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-2">
        <Label>Emotion</Label>
        <div className="flex flex-wrap gap-2">
          {EMOTIONS.map((item) => {
            const on = trade.emotions.includes(item.id);
            return (
              <label
                key={item.id}
                className={cn(
                  "flex h-10 min-h-10 cursor-pointer items-center gap-2 rounded-md border border-border px-2.5 text-sm",
                  on && "border-primary/50 bg-primary/10",
                )}
              >
                <Checkbox
                  checked={on}
                  onCheckedChange={(checked) => {
                    const emotions: Emotion[] = checked
                      ? [...trade.emotions, item.id]
                      : trade.emotions.filter((e) => e !== item.id);
                    onPatch({ emotions });
                  }}
                />
                {item.label}
              </label>
            );
          })}
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="journal-notes">Notes</Label>
        <Textarea
          id="journal-notes"
          placeholder="What did you see? Did you follow the plan?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-24"
        />
      </div>
    </div>
  );
}
