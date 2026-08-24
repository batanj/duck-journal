import { INSTRUMENTS, type Trade } from "./types";

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export type Candle = {
  t: number;
  o: number;
  h: number;
  l: number;
  c: number;
};

export type PositionLevels = {
  entry: number;
  sl: number;
  tp: number;
  entryIndex: number;
  exitIndex: number;
};

function roundPx(n: number, decimals: number) {
  return Number(n.toFixed(decimals));
}

export function buildCandles(trade: Trade): Candle[] {
  const entryAt = new Date(trade.entryAt).getTime();
  const exitAt = new Date(trade.exitAt).getTime();
  const hold = Math.max(exitAt - entryAt, 12 * 60_000);
  const pre = entryAt - hold * 0.55;
  const post = exitAt + hold * 0.35;
  const rng = mulberry32(hash(trade.id));
  const decimals = INSTRUMENTS[trade.symbol]?.decimals ?? 2;
  const span = Math.max(Math.abs(trade.exitPrice - trade.entryPrice), trade.entryPrice * 0.0015);
  const n = 42;
  const dt = (post - pre) / n;
  const candles: Candle[] = [];
  let prev = trade.entryPrice + (rng() - 0.5) * span * 0.35;

  for (let i = 0; i < n; i += 1) {
    const t = pre + i * dt;
    const uEntry = (t - pre) / Math.max(entryAt - pre, 1);
    const uHold = (t - entryAt) / Math.max(exitAt - entryAt, 1);
    let close: number;
    if (t <= entryAt) {
      close = trade.entryPrice + (prev - trade.entryPrice) * (1 - Math.min(1, uEntry)) * 0.65 + (rng() - 0.5) * span * 0.18;
    } else if (t >= exitAt) {
      close = trade.exitPrice + (rng() - 0.5) * span * 0.16;
    } else {
      const ease = uHold * uHold * (3 - 2 * uHold);
      close =
        trade.entryPrice +
        (trade.exitPrice - trade.entryPrice) * ease +
        Math.sin(i * 0.9) * span * 0.22 * (1 - Math.abs(uHold - 0.5) * 1.4);
    }
    const open = prev;
    const wick = span * (0.12 + rng() * 0.28);
    const high = Math.max(open, close) + wick * rng();
    const low = Math.min(open, close) - wick * rng();
    candles.push({
      t,
      o: roundPx(open, decimals),
      h: roundPx(high, decimals),
      l: roundPx(low, decimals),
      c: roundPx(close, decimals),
    });
    prev = close;
  }

  const nearest = (time: number) =>
    candles.reduce((best, c, i) => (Math.abs(c.t - time) < Math.abs(candles[best].t - time) ? i : best), 0);
  const entryI = nearest(entryAt);
  const exitI = nearest(exitAt);
  candles[entryI] = {
    ...candles[entryI],
    t: entryAt,
    c: trade.entryPrice,
    o: roundPx((candles[entryI].o + trade.entryPrice) / 2, decimals),
  };
  candles[exitI] = {
    ...candles[exitI],
    t: exitAt,
    c: trade.exitPrice,
    o: roundPx((candles[exitI].o + trade.exitPrice) / 2, decimals),
  };
  return candles;
}

export function inferLevels(trade: Trade, candles: Candle[]): PositionLevels {
  const decimals = INSTRUMENTS[trade.symbol]?.decimals ?? 2;
  const entryIndex = candles.reduce(
    (best, c, i) => (Math.abs(c.t - +new Date(trade.entryAt)) < Math.abs(candles[best].t - +new Date(trade.entryAt)) ? i : best),
    0,
  );
  const exitIndex = candles.reduce(
    (best, c, i) => (Math.abs(c.t - +new Date(trade.exitAt)) < Math.abs(candles[best].t - +new Date(trade.exitAt)) ? i : best),
    0,
  );
  const range = Math.max(
    ...candles.map((c) => c.h),
  ) - Math.min(...candles.map((c) => c.l));
  const minSep = Math.max(range * 0.12, trade.entryPrice * 0.0012, Math.abs(trade.exitPrice - trade.entryPrice) * 0.35);
  const long = trade.side === "long";
  const won = trade.pnl >= 0;

  let sl: number;
  let tp: number;
  if (long) {
    sl = won ? trade.entryPrice - minSep : Math.min(trade.exitPrice, trade.entryPrice - minSep * 0.4);
    tp = won ? Math.max(trade.exitPrice, trade.entryPrice + minSep * 1.7) : trade.entryPrice + minSep * 1.8;
    sl = Math.min(sl, trade.entryPrice - minSep);
    tp = Math.max(tp, trade.entryPrice + minSep);
  } else {
    sl = won ? trade.entryPrice + minSep : Math.max(trade.exitPrice, trade.entryPrice + minSep * 0.4);
    tp = won ? Math.min(trade.exitPrice, trade.entryPrice - minSep * 1.7) : trade.entryPrice - minSep * 1.8;
    sl = Math.max(sl, trade.entryPrice + minSep);
    tp = Math.min(tp, trade.entryPrice - minSep);
  }

  return {
    entry: trade.entryPrice,
    sl: roundPx(sl, decimals),
    tp: roundPx(tp, decimals),
    entryIndex,
    exitIndex,
  };
}
