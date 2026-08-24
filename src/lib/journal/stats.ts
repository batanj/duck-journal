import { startOfDay } from "date-fns";
import { emotionLabel } from "./types";
import type { Trade } from "./types";

export type EquityPoint = { t: number; equity: number; pnl: number };
export type GroupStat = {
  key: string;
  trades: number;
  wins: number;
  pnl: number;
  winRate: number;
  avgPnl: number;
};

export type JournalStats = {
  count: number;
  wins: number;
  losses: number;
  scratches: number;
  winRate: number;
  netPnl: number;
  grossProfit: number;
  grossLoss: number;
  profitFactor: number;
  avgWin: number;
  avgLoss: number;
  expectancy: number;
  avgPnl: number;
  maxWin: number;
  maxLoss: number;
  maxDrawdown: number;
  maxDrawdownPct: number;
  currentStreak: number;
  maxWinStreak: number;
  maxLossStreak: number;
  equityCurve: EquityPoint[];
  endingEquity: number;
  returnPct: number;
  bySymbol: GroupStat[];
  bySetup: GroupStat[];
  byWeekday: GroupStat[];
  byHour: GroupStat[];
  bySide: GroupStat[];
  byGrade: GroupStat[];
  byEmotion: GroupStat[];
  reviewed: number;
  aBRate: number;
  aTradePnl: number;
  leakPnl: number;
  daily: { date: string; pnl: number; trades: number }[];
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function group(trades: Trade[], keyFn: (t: Trade) => string): GroupStat[] {
  const map = new Map<string, Trade[]>();
  for (const t of trades) {
    const k = keyFn(t) || "—";
    const arr = map.get(k);
    if (arr) arr.push(t);
    else map.set(k, [t]);
  }
  return [...map.entries()]
    .map(([key, list]) => {
      const wins = list.filter((x) => x.pnl > 0).length;
      const pnl = list.reduce((s, x) => s + x.pnl, 0);
      return {
        key,
        trades: list.length,
        wins,
        pnl,
        winRate: list.length ? wins / list.length : 0,
        avgPnl: list.length ? pnl / list.length : 0,
      };
    })
    .sort((a, b) => b.pnl - a.pnl);
}

const GRADE_ORDER = ["A", "B", "C", "D", "F", "Untagged"];

function groupEmotions(trades: Trade[]): GroupStat[] {
  const map = new Map<string, Trade[]>();
  for (const t of trades) {
    const keys = t.emotions.length ? t.emotions.map(emotionLabel) : ["Untagged"];
    for (const k of keys) {
      const arr = map.get(k);
      if (arr) arr.push(t);
      else map.set(k, [t]);
    }
  }
  return [...map.entries()]
    .map(([key, list]) => {
      const wins = list.filter((x) => x.pnl > 0).length;
      const pnl = list.reduce((s, x) => s + x.pnl, 0);
      return {
        key,
        trades: list.length,
        wins,
        pnl,
        winRate: list.length ? wins / list.length : 0,
        avgPnl: list.length ? pnl / list.length : 0,
      };
    })
    .sort((a, b) => a.pnl - b.pnl);
}

function orderGrades(rows: GroupStat[]): GroupStat[] {
  return [...rows].sort(
    (a, b) => GRADE_ORDER.indexOf(a.key) - GRADE_ORDER.indexOf(b.key),
  );
}

export function computeStats(trades: Trade[], startingEquity = 0): JournalStats {
  const sorted = [...trades].sort(
    (a, b) => new Date(a.exitAt).getTime() - new Date(b.exitAt).getTime(),
  );
  const winsList = sorted.filter((t) => t.pnl > 0);
  const lossesList = sorted.filter((t) => t.pnl < 0);
  const scratches = sorted.filter((t) => t.pnl === 0).length;
  const grossProfit = winsList.reduce((s, t) => s + t.pnl, 0);
  const grossLoss = Math.abs(lossesList.reduce((s, t) => s + t.pnl, 0));
  const netPnl = sorted.reduce((s, t) => s + t.pnl, 0);

  const equityCurve: EquityPoint[] = [];
  let equity = startingEquity;
  let peak = startingEquity;
  let maxDrawdown = 0;
  if (sorted.length) {
    const first = new Date(sorted[0].entryAt).getTime();
    equityCurve.push({ t: first, equity: startingEquity, pnl: 0 });
  }
  for (const t of sorted) {
    equity += t.pnl;
    peak = Math.max(peak, equity);
    maxDrawdown = Math.max(maxDrawdown, peak - equity);
    equityCurve.push({ t: new Date(t.exitAt).getTime(), equity, pnl: t.pnl });
  }

  let currentStreak = 0;
  let maxWinStreak = 0;
  let maxLossStreak = 0;
  let run = 0;
  let runSign = 0;
  for (const t of sorted) {
    const sign = t.pnl > 0 ? 1 : t.pnl < 0 ? -1 : 0;
    if (sign === 0) continue;
    if (sign === runSign) run += 1;
    else {
      runSign = sign;
      run = 1;
    }
    if (sign > 0) maxWinStreak = Math.max(maxWinStreak, run);
    else maxLossStreak = Math.max(maxLossStreak, run);
    currentStreak = runSign * run;
  }

  const dailyMap = new Map<string, { pnl: number; trades: number }>();
  for (const t of sorted) {
    const d = startOfDay(new Date(t.exitAt)).toISOString().slice(0, 10);
    const prev = dailyMap.get(d) ?? { pnl: 0, trades: 0 };
    prev.pnl += t.pnl;
    prev.trades += 1;
    dailyMap.set(d, prev);
  }
  const daily = [...dailyMap.entries()]
    .map(([date, v]) => ({ date, ...v }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const count = sorted.length;
  const wins = winsList.length;
  const losses = lossesList.length;
  const graded = sorted.filter((t) => t.grade);
  const reviewed = graded.length;
  const aB = graded.filter((t) => t.grade === "A" || t.grade === "B");
  const leak = graded.filter((t) => t.grade === "C" || t.grade === "D" || t.grade === "F");

  return {
    count,
    wins,
    losses,
    scratches,
    winRate: count ? wins / count : 0,
    netPnl,
    grossProfit,
    grossLoss,
    profitFactor: grossLoss === 0 ? (grossProfit > 0 ? Infinity : 0) : grossProfit / grossLoss,
    avgWin: wins ? grossProfit / wins : 0,
    avgLoss: losses ? grossLoss / losses : 0,
    expectancy: count ? netPnl / count : 0,
    avgPnl: count ? netPnl / count : 0,
    maxWin: winsList.reduce((m, t) => Math.max(m, t.pnl), 0),
    maxLoss: lossesList.reduce((m, t) => Math.min(m, t.pnl), 0),
    maxDrawdown,
    maxDrawdownPct: peak ? maxDrawdown / peak : 0,
    currentStreak,
    maxWinStreak,
    maxLossStreak,
    equityCurve,
    endingEquity: equity,
    returnPct: startingEquity ? netPnl / startingEquity : 0,
    bySymbol: group(sorted, (t) => t.symbol),
    bySetup: group(sorted, (t) => t.setup || "Untagged"),
    byWeekday: group(sorted, (t) => WEEKDAYS[new Date(t.exitAt).getDay()] ?? "—"),
    byHour: group(sorted, (t) => `${String(new Date(t.exitAt).getHours()).padStart(2, "0")}:00`),
    bySide: group(sorted, (t) => (t.side === "long" ? "Long" : "Short")),
    byGrade: orderGrades(group(sorted, (t) => t.grade || "Untagged")),
    byEmotion: groupEmotions(sorted),
    reviewed,
    aBRate: reviewed ? aB.length / reviewed : 0,
    aTradePnl: aB.reduce((s, t) => s + t.pnl, 0),
    leakPnl: leak.reduce((s, t) => s + t.pnl, 0),
    daily,
  };
}
