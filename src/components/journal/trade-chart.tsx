import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { buildCandles, inferLevels, type Candle, type PositionLevels } from "@/lib/journal/trade-chart";
import { useJournalStore } from "@/lib/journal/store";
import { useJournalUi } from "@/lib/journal/ui";
import { INSTRUMENTS, type Trade } from "@/lib/journal/types";
import { PnlText } from "./pnl";

export function CandlePane({
  candles,
  levels,
  trade,
  compact = false,
}: {
  candles: Candle[];
  levels: PositionLevels;
  trade: Trade;
  compact?: boolean;
}) {
  const width = 800;
  const height = compact ? 240 : 360;
  const pad = compact
    ? { l: 8, r: 8, t: 10, b: 8 }
    : { l: 12, r: 78, t: 18, b: 28 };
  const plotW = width - pad.l - pad.r;
  const plotH = height - pad.t - pad.b;
  const prices = [
    ...candles.flatMap((c) => [c.h, c.l]),
    levels.entry,
    levels.sl,
    levels.tp,
  ];
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const span = max - min || 1;
  const y = (p: number) => pad.t + ((max - p) / span) * plotH;
  const slot = plotW / candles.length;
  const x = (i: number) => pad.l + i * slot + slot / 2;
  const long = trade.side === "long";
  const zoneRight = width - pad.r;
  const zoneLeft = x(levels.entryIndex) - slot * 0.2;
  const entryY = y(levels.entry);
  const slY = y(levels.sl);
  const tpY = y(levels.tp);
  const decimals = INSTRUMENTS[trade.symbol]?.decimals ?? 2;
  const labels = spreadLabels([
    { key: "tp", y: tpY, label: "TP", value: levels.tp, tone: "win" as const },
    { key: "entry", y: entryY, label: "Entry", value: levels.entry, tone: "fg" as const },
    { key: "sl", y: slY, label: "SL", value: levels.sl, tone: "loss" as const },
  ]);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" role="img" aria-label="Candlestick chart">
      <rect x={zoneLeft} width={zoneRight - zoneLeft} y={Math.min(entryY, tpY)} height={Math.abs(tpY - entryY)} fill="var(--color-win)" opacity="0.12" />
      <rect x={zoneLeft} width={zoneRight - zoneLeft} y={Math.min(entryY, slY)} height={Math.abs(slY - entryY)} fill="var(--color-loss)" opacity="0.12" />

      {candles.map((c, i) => {
        const up = c.c >= c.o;
        const color = up ? "var(--color-win)" : "var(--color-loss)";
        const cx = x(i);
        const bodyTop = y(Math.max(c.o, c.c));
        const bodyBot = y(Math.min(c.o, c.c));
        const bodyH = Math.max(1.2, bodyBot - bodyTop);
        const cw = Math.max(3, slot * 0.55);
        return (
          <g key={c.t}>
            <line x1={cx} x2={cx} y1={y(c.h)} y2={y(c.l)} stroke={color} strokeWidth="1.2" />
            <rect x={cx - cw / 2} y={bodyTop} width={cw} height={bodyH} fill={color} />
          </g>
        );
      })}

      <line x1={pad.l} x2={zoneRight} y1={entryY} y2={entryY} stroke="var(--color-foreground)" strokeWidth="1" strokeDasharray="4 3" />
      <line x1={pad.l} x2={zoneRight} y1={tpY} y2={tpY} stroke="var(--color-win)" strokeWidth="1.2" />
      <line x1={pad.l} x2={zoneRight} y1={slY} y2={slY} stroke="var(--color-loss)" strokeWidth="1.2" />

      <polygon
        points={
          long
            ? `${x(levels.entryIndex)},${entryY - 10} ${x(levels.entryIndex) - 6},${entryY - 1} ${x(levels.entryIndex) + 6},${entryY - 1}`
            : `${x(levels.entryIndex)},${entryY + 10} ${x(levels.entryIndex) - 6},${entryY + 1} ${x(levels.entryIndex) + 6},${entryY + 1}`
        }
        fill="var(--color-primary)"
      />

      {!compact ? (
        <>
          {labels.map((item) => (
            <LevelTag
              key={item.key}
              x={zoneRight + 6}
              y={item.y}
              label={item.label}
              value={item.value}
              tone={item.tone}
              decimals={decimals}
            />
          ))}
          {candles.filter((_, i) => i % 7 === 0 || i === candles.length - 1).map((c, idx, arr) => {
            const i = candles.indexOf(c);
            return (
              <text
                key={`t-${c.t}`}
                x={x(i)}
                y={height - 8}
                textAnchor={idx === arr.length - 1 ? "end" : "middle"}
                fill="var(--color-muted-foreground)"
                fontSize="10"
              >
                {format(c.t, "HH:mm")}
              </text>
            );
          })}
        </>
      ) : null}
    </svg>
  );
}

function spreadLabels<T extends { y: number }>(items: T[]): T[] {
  const sorted = [...items].sort((a, b) => a.y - b.y);
  for (let i = 1; i < sorted.length; i += 1) {
    if (sorted[i].y - sorted[i - 1].y < 28) {
      sorted[i] = { ...sorted[i], y: sorted[i - 1].y + 28 };
    }
  }
  return sorted;
}

function LevelTag({
  x,
  y,
  label,
  value,
  tone,
  decimals,
}: {
  x: number;
  y: number;
  label: string;
  value: number;
  tone: "win" | "loss" | "fg";
  decimals: number;
}) {
  const fill = tone === "win" ? "var(--color-win)" : tone === "loss" ? "var(--color-loss)" : "var(--color-foreground)";
  return (
    <g>
      <text x={x} y={y - 4} fill={fill} fontSize="9" fontWeight="600">
        {label}
      </text>
      <text x={x} y={y + 9} fill={fill} fontSize="10">
        {value.toFixed(decimals)}
      </text>
    </g>
  );
}

export function TradeChartPreview({ trade, className }: { trade: Trade; className?: string }) {
  const candles = buildCandles(trade);
  const levels = inferLevels(trade, candles);
  return (
    <div className={className}>
      <CandlePane candles={candles} levels={levels} trade={trade} compact />
    </div>
  );
}

export function TradeChartDialog() {
  const chartTradeId = useJournalUi((s) => s.chartTradeId);
  const closeChart = useJournalUi((s) => s.closeChart);
  const trade = useJournalStore((s) => s.trades.find((t) => t.id === chartTradeId));
  const account = useJournalStore((s) => s.accounts.find((a) => a.id === trade?.accountId));
  const candles = trade ? buildCandles(trade) : [];
  const levels = trade ? inferLevels(trade, candles) : null;

  return (
    <Dialog open={Boolean(chartTradeId)} onOpenChange={(v) => (v ? null : closeChart())}>
      <DialogContent className="max-w-3xl">
        {trade && levels ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex flex-wrap items-baseline gap-3">
                <span>{trade.symbol}</span>
                <PnlText value={trade.pnl} className="font-sans text-lg" />
              </DialogTitle>
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant={trade.side === "long" ? "win" : "loss"} className="capitalize">
                  {trade.side} {trade.qty}
                </Badge>
                {account ? <Badge variant="outline">{account.name}</Badge> : null}
                <span className="text-xs text-muted-foreground">
                  {format(new Date(trade.entryAt), "MMM d HH:mm")} →{" "}
                  {format(new Date(trade.exitAt), "HH:mm")}
                </span>
              </div>
            </DialogHeader>
            <div className="h-80 overflow-hidden rounded-lg bg-background">
              <CandlePane candles={candles} levels={levels} trade={trade} />
            </div>
            <p className="text-xs text-muted-foreground">
              Long/short tool: entry, stop, and target on reconstructed candles from this fill.
            </p>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
