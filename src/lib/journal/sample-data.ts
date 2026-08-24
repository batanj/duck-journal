import {
  computePnl,
  INSTRUMENTS,
  SETUPS,
  DEMO_ACCOUNT_ID,
  type Emotion,
  type Grade,
  type Side,
  type Trade,
} from "./types";

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

function pick<T>(rng: () => number, list: readonly T[]): T {
  return list[Math.floor(rng() * list.length)] as T;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function utc(y: number, m: number, d: number, h = 0, min = 0) {
  return new Date(Date.UTC(y, m - 1, d, h, min));
}

function addMinutesUtc(d: Date, minutes: number) {
  return new Date(d.getTime() + minutes * 60_000);
}

const BASE: Record<string, { start: number; end: number }> = {
  ES: { start: 5120, end: 5660 },
  NQ: { start: 17840, end: 20110 },
  CL: { start: 76.4, end: 82.1 },
  GC: { start: 2320, end: 2510 },
  AAPL: { start: 172, end: 228 },
  NVDA: { start: 106, end: 134 },
  SPY: { start: 508, end: 564 },
  EURUSD: { start: 1.072, end: 1.098 },
  BTCUSD: { start: 61200, end: 68400 },
};

function phase(day: Date): { pWin: number; size: number } {
  const t = day.getTime();
  if (t < utc(2026, 6, 1).getTime()) return { pWin: 0.58, size: 1 };
  if (t < utc(2026, 6, 21).getTime()) return { pWin: 0.36, size: 1.45 };
  if (t < utc(2026, 7, 1).getTime()) return { pWin: 0.52, size: 0.9 };
  if (t < utc(2026, 8, 1).getTime()) return { pWin: 0.61, size: 1 };
  return { pWin: 0.55, size: 1.05 };
}

function qtyFor(symbol: string, size: number, rng: () => number): number {
  switch (INSTRUMENTS[symbol]?.assetClass) {
    case "futures":
      return Math.max(1, Math.round((rng() < 0.7 ? 1 : 2) * size));
    case "forex":
      return Math.round((rng() < 0.5 ? 0.1 : 0.2) * size * 10) / 10;
    case "crypto":
      return Math.round((0.04 + rng() * 0.08) * size * 1000) / 1000;
    default:
      return Math.round((50 + rng() * 150) * size);
  }
}

function moveFor(symbol: string, win: boolean, rng: () => number): number {
  const mag = rng();
  const dir = win ? 1 : -1;
  switch (symbol) {
    case "ES":
      return dir * lerp(2.5, 18, mag);
    case "NQ":
      return dir * lerp(12, 90, mag);
    case "CL":
      return dir * lerp(0.12, 1.15, mag);
    case "GC":
      return dir * lerp(1.5, 14, mag);
    case "AAPL":
      return dir * lerp(0.35, 3.8, mag);
    case "NVDA":
      return dir * lerp(0.4, 4.6, mag);
    case "SPY":
      return dir * lerp(0.25, 2.8, mag);
    case "EURUSD":
      return dir * lerp(0.0004, 0.0032, mag);
    case "BTCUSD":
      return dir * lerp(180, 2200, mag);
    default:
      return dir * lerp(0.5, 4, mag);
  }
}

function feesFor(symbol: string, qty: number): number {
  const cls = INSTRUMENTS[symbol]?.assetClass;
  if (cls === "futures") return Math.round(qty * 4.6 * 100) / 100;
  if (cls === "forex") return Math.round(qty * 7 * 100) / 100;
  if (cls === "crypto") return Math.round(qty * 12 * 100) / 100;
  return Math.round((0.8 + qty * 0.005) * 100) / 100;
}

export function generateAccountHistory({
  accountId,
  seed,
  platform,
}: {
  accountId: string;
  seed: number;
  platform: string;
}): Trade[] {
  const rng = mulberry32(seed);
  const trades: Trade[] = [];
  const start = utc(2026, 5, 4);
  const end = utc(2026, 8, 21);
  const symbols = Object.keys(INSTRUMENTS);
  let n = 0;

  for (let t = start.getTime(); t <= end.getTime(); t += 86_400_000) {
    const day = new Date(t);
    const dow = day.getUTCDay();
    if (dow === 0 || dow === 6) continue;
    const ph = phase(day);
    const countRoll = rng();
    let count = 0;
    if (countRoll < 0.18) count = 0;
    else if (countRoll < 0.55) count = 1;
    else if (countRoll < 0.84) count = 2;
    else count = 3;
    if (ph.pWin < 0.4 && rng() < 0.5) count = Math.max(count, 2);

    let cursor = utc(
      day.getUTCFullYear(),
      day.getUTCMonth() + 1,
      day.getUTCDate(),
      13 + Math.floor(rng() * 2),
      Math.floor(rng() * 50),
    );

    for (let i = 0; i < count; i++) {
      const symbol = pick(rng, symbols);
      const inst = INSTRUMENTS[symbol];
      if (!inst) continue;
      const band = BASE[symbol] ?? { start: 100, end: 110 };
      const tFrac = (day.getTime() - start.getTime()) / (end.getTime() - start.getTime());
      const px = lerp(band.start, band.end, tFrac + (rng() - 0.5) * 0.08);
      const side: Side = rng() < 0.56 ? "long" : "short";
      let win = rng() < ph.pWin;
      if (symbol === "NVDA") win = rng() < ph.pWin + 0.08;
      if (dow === 1) win = rng() < ph.pWin - 0.08;

      const qty = qtyFor(symbol, ph.size, rng);
      const signedMove = moveFor(symbol, win, rng);
      const entryPrice = Number(px.toFixed(inst.decimals));
      const dir = side === "long" ? 1 : -1;
      const exitPrice = Number((entryPrice + signedMove * dir).toFixed(inst.decimals));
      const hold = 12 + Math.floor(rng() * 140);
      const entryAt = cursor.toISOString();
      const exitAt = addMinutesUtc(cursor, hold).toISOString();
      const fees = feesFor(symbol, qty);
      const pnl = computePnl({ symbol, side, qty, entryPrice, exitPrice, fees });

      const tags: string[] = [];
      if (hold < 20) tags.push("scalp");
      if (hold > 120) tags.push("held");

      n += 1;
      trades.push({
        id: `${accountId}-t-${String(n).padStart(3, "0")}`,
        accountId,
        symbol,
        assetClass: inst.assetClass,
        side,
        qty,
        entryPrice,
        exitPrice,
        entryAt,
        exitAt,
        fees,
        pnl,
        setup: "",
        tags,
        notes: "",
        grade: "",
        emotions: [],
        platform,
      });

      cursor = addMinutesUtc(cursor, hold + 20 + Math.floor(rng() * 50));
    }
  }

  return trades.sort((a, b) => new Date(b.exitAt).getTime() - new Date(a.exitAt).getTime());
}

const REVIEW_GRADES_WIN: Grade[] = ["A", "A", "B", "B", "B", "C"];
const REVIEW_GRADES_LOSS: Grade[] = ["B", "C", "C", "D", "F", "F"];
const LEAK_EMOTIONS: Emotion[] = ["revenge", "fomo", "fear", "frustration", "hope", "impatience"];
const CLEAN_EMOTIONS: Emotion[] = ["calm", "calm", "overconfidence", "hesitation"];

export function annotateDemoReviews(trades: Trade[]): Trade[] {
  const rng = mulberry32(seedFrom("dj-reviews"));
  return trades.map((t) => {
    if (rng() < 0.22) return t;
    const grade = pick(rng, t.pnl >= 0 ? REVIEW_GRADES_WIN : REVIEW_GRADES_LOSS);
    const emotions: Emotion[] = [];
    if (grade === "A" || grade === "B") {
      emotions.push(pick(rng, CLEAN_EMOTIONS));
      if (rng() < 0.18) emotions.push("overconfidence");
    } else {
      emotions.push(pick(rng, LEAK_EMOTIONS));
      if (rng() < 0.35) {
        const extra = pick(rng, LEAK_EMOTIONS);
        if (!emotions.includes(extra)) emotions.push(extra);
      }
    }
    return {
      ...t,
      setup: t.setup || pick(rng, SETUPS),
      grade,
      emotions,
    };
  });
}

export function buildSampleTrades(): Trade[] {
  return generateAccountHistory({
    accountId: DEMO_ACCOUNT_ID,
    seed: 20260823,
    platform: "MT5",
  });
}

export const SAMPLE_TRADES = buildSampleTrades();

export function seedFrom(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
