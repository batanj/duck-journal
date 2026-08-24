import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  computePnl,
  EMOTIONS,
  INSTRUMENTS,
  SYMBOLS,
  type Emotion,
  type Grade,
  type Setup,
  type Side,
  type Trade,
} from "@/lib/journal/types";
import { money } from "@/lib/journal/format";
import { usePlaybook } from "@/lib/journal/store";
import { cn } from "@/lib/utils";
import { PnlText } from "./pnl";

function toLocal(iso?: string) {
  const d = iso ? new Date(iso) : new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export type TradeDraft = {
  symbol: string;
  side: Side;
  qty: string;
  entryPrice: string;
  exitPrice: string;
  entryAt: string;
  exitAt: string;
  fees: string;
  setup: Setup | "";
  grade: Grade | "";
  emotions: Emotion[];
  notes: string;
};

export function draftFromTrade(t?: Partial<Trade> | null): TradeDraft {
  return {
    symbol: t?.symbol ?? "ES",
    side: t?.side ?? "long",
    qty: t?.qty !== undefined ? String(t.qty) : "1",
    entryPrice: t?.entryPrice !== undefined ? String(t.entryPrice) : "",
    exitPrice: t?.exitPrice !== undefined ? String(t.exitPrice) : "",
    entryAt: toLocal(t?.entryAt),
    exitAt: toLocal(t?.exitAt),
    fees: t?.fees !== undefined ? String(t.fees) : "4.60",
    setup: t?.setup ?? "",
    grade: t?.grade ?? "",
    emotions: t?.emotions ?? [],
    notes: t?.notes ?? "",
  };
}

export function tradeFromDraft(draft: TradeDraft, id?: string, accountId = ""): Trade {
  const qty = Number(draft.qty) || 0;
  const entryPrice = Number(draft.entryPrice) || 0;
  const exitPrice = Number(draft.exitPrice) || 0;
  const fees = Number(draft.fees) || 0;
  const inst = INSTRUMENTS[draft.symbol];
  return {
    id: id ?? crypto.randomUUID(),
    symbol: draft.symbol,
    assetClass: inst?.assetClass ?? "stocks",
    side: draft.side,
    qty,
    entryPrice,
    exitPrice,
    entryAt: new Date(draft.entryAt).toISOString(),
    exitAt: new Date(draft.exitAt).toISOString(),
    fees,
    pnl: computePnl({
      symbol: draft.symbol,
      side: draft.side,
      qty,
      entryPrice,
      exitPrice,
      fees,
    }),
    setup: draft.setup,
    tags: [],
    notes: draft.notes,
    grade: draft.grade,
    emotions: draft.emotions,
    platform: "Manual",
    accountId,
  };
}

export function TradeForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: Partial<Trade> | null;
  submitLabel: string;
  onSubmit: (trade: Trade) => void;
  onCancel?: () => void;
}) {
  const playbook = usePlaybook();
  const [draft, setDraft] = useState<TradeDraft>(() => draftFromTrade(initial));
  const preview = useMemo(() => {
    const qty = Number(draft.qty) || 0;
    const entryPrice = Number(draft.entryPrice) || 0;
    const exitPrice = Number(draft.exitPrice) || 0;
    const fees = Number(draft.fees) || 0;
    if (!qty || !entryPrice || !exitPrice) return null;
    return computePnl({
      symbol: draft.symbol,
      side: draft.side,
      qty,
      entryPrice,
      exitPrice,
      fees,
    });
  }, [draft]);

  function patch<K extends keyof TradeDraft>(key: K, value: TradeDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(tradeFromDraft(draft, initial?.id, initial?.accountId));
      }}
    >
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label htmlFor="symbol">Symbol</Label>
          <Select value={draft.symbol} onValueChange={(v) => patch("symbol", v)}>
            <SelectTrigger id="symbol">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SYMBOLS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="side">Side</Label>
          <Select value={draft.side} onValueChange={(v) => patch("side", v as Side)}>
            <SelectTrigger id="side">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="long">Long</SelectItem>
              <SelectItem value="short">Short</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="qty">Size</Label>
          <Input
            id="qty"
            inputMode="decimal"
            value={draft.qty}
            onChange={(e) => patch("qty", e.target.value)}
            required
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="fees">Fees</Label>
          <Input
            id="fees"
            inputMode="decimal"
            value={draft.fees}
            onChange={(e) => patch("fees", e.target.value)}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="entry">Entry</Label>
          <Input
            id="entry"
            inputMode="decimal"
            value={draft.entryPrice}
            onChange={(e) => patch("entryPrice", e.target.value)}
            required
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="exit">Exit</Label>
          <Input
            id="exit"
            inputMode="decimal"
            value={draft.exitPrice}
            onChange={(e) => patch("exitPrice", e.target.value)}
            required
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="entryAt">Opened</Label>
          <Input
            id="entryAt"
            type="datetime-local"
            value={draft.entryAt}
            onChange={(e) => patch("entryAt", e.target.value)}
            required
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="exitAt">Closed</Label>
          <Input
            id="exitAt"
            type="datetime-local"
            value={draft.exitAt}
            onChange={(e) => patch("exitAt", e.target.value)}
            required
          />
        </div>
        <div className="grid gap-1.5">
          <Label>Setup</Label>
          <Select value={draft.setup || "none"} onValueChange={(v) => patch("setup", v === "none" ? "" : (v as Setup))}>
            <SelectTrigger>
              <SelectValue />
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
          <Select value={draft.grade || "none"} onValueChange={(v) => patch("grade", v === "none" ? "" : (v as Grade))}>
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
        <p className="text-xs text-muted-foreground">
          What was present at the click. Check all that apply.
        </p>
        <div className="flex flex-wrap gap-2">
          {EMOTIONS.map((item) => {
            const on = draft.emotions.includes(item.id);
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
                    patch(
                      "emotions",
                      checked
                        ? [...draft.emotions, item.id]
                        : draft.emotions.filter((e) => e !== item.id),
                    );
                  }}
                />
                {item.label}
              </label>
            );
          })}
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="What did you see? Did you follow the plan?"
          value={draft.notes}
          onChange={(e) => patch("notes", e.target.value)}
        />
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm text-muted-foreground">
          Net{" "}
          {preview === null ? (
            <span className="text-muted-foreground">—</span>
          ) : (
            <PnlText value={preview} className="font-medium" />
          )}
          {preview !== null && (
            <span className="sr-only">{money(preview, { sign: true })}</span>
          )}
        </div>
        <div className="flex gap-2">
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">{submitLabel}</Button>
        </div>
      </div>
    </form>
  );
}
