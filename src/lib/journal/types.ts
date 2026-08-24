export type Side = "long" | "short";
export type AssetClass = "futures" | "stocks" | "forex" | "crypto";
export type Grade = "A" | "B" | "C" | "D" | "F";
export type AccountStatus = "connecting" | "syncing" | "connected" | "error";
export type TerminalPlatform = "MT4" | "MT5";

export const DEFAULT_SETUPS = [
  "ORB",
  "VWAP Fade",
  "Breakout",
  "Pullback",
  "News",
  "Range",
] as const;
export const SETUPS: readonly string[] = DEFAULT_SETUPS;
export type Setup = string;

export const EMOTIONS = [
  { id: "calm", label: "Calm" },
  { id: "fear", label: "Fear" },
  { id: "greed", label: "Greed" },
  { id: "fomo", label: "FOMO" },
  { id: "revenge", label: "Revenge" },
  { id: "hope", label: "Hope" },
  { id: "overconfidence", label: "Overconfidence" },
  { id: "impatience", label: "Impatience" },
  { id: "hesitation", label: "Hesitation" },
  { id: "frustration", label: "Frustration" },
] as const;
export type Emotion = (typeof EMOTIONS)[number]["id"];

const EMOTION_IDS = new Set<string>(EMOTIONS.map((e) => e.id));
const LEGACY_EMOTION: Record<string, Emotion> = {
  hesitant: "hesitation",
  bored: "impatience",
};

export function isEmotion(value: string): value is Emotion {
  return EMOTION_IDS.has(value);
}

export function parseEmotions(raw: unknown): Emotion[] {
  if (!raw) return [];
  const values = (() => {
    if (Array.isArray(raw)) return raw.map(String);
    if (typeof raw !== "string") return [];
    const trimmed = raw.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      /* single legacy value */
    }
    return trimmed.split(/[|,]/).map((s) => s.trim());
  })();
  const out: Emotion[] = [];
  for (const value of values) {
    const mapped = LEGACY_EMOTION[value] ?? value;
    if (isEmotion(mapped) && !out.includes(mapped)) out.push(mapped);
  }
  return out;
}

export function emotionLabel(id: Emotion): string {
  return EMOTIONS.find((e) => e.id === id)?.label ?? id;
}

export type TradingAccount = {
  id: string;
  name: string;
  server: string;
  username: string;
  platform: TerminalPlatform;
  status: AccountStatus;
  progress: number;
  lastSyncAt: string | null;
  errorMessage: string | null;
  tradeCount: number;
  createdAt: string;
};

export type Trade = {
  id: string;
  accountId: string;
  symbol: string;
  assetClass: AssetClass;
  side: Side;
  qty: number;
  entryPrice: number;
  exitPrice: number;
  entryAt: string;
  exitAt: string;
  fees: number;
  pnl: number;
  setup: Setup | "";
  tags: string[];
  notes: string;
  grade: Grade | "";
  emotions: Emotion[];
  platform: string;
};

export type JournalSettings = {
  startingEquity: number;
  currency: string;
  setups: string[];
};

export const DEFAULT_SETTINGS: JournalSettings = {
  startingEquity: 50_000,
  currency: "USD",
  setups: [...DEFAULT_SETUPS],
};

export type Instrument = {
  symbol: string;
  name: string;
  assetClass: AssetClass;
  multiplier: number;
  decimals: number;
};

export const INSTRUMENTS: Record<string, Instrument> = {
  ES: { symbol: "ES", name: "E-mini S&P", assetClass: "futures", multiplier: 50, decimals: 2 },
  NQ: { symbol: "NQ", name: "E-mini Nasdaq", assetClass: "futures", multiplier: 20, decimals: 2 },
  CL: { symbol: "CL", name: "Crude Oil", assetClass: "futures", multiplier: 1000, decimals: 2 },
  GC: { symbol: "GC", name: "Gold", assetClass: "futures", multiplier: 100, decimals: 1 },
  AAPL: { symbol: "AAPL", name: "Apple", assetClass: "stocks", multiplier: 1, decimals: 2 },
  NVDA: { symbol: "NVDA", name: "NVIDIA", assetClass: "stocks", multiplier: 1, decimals: 2 },
  SPY: { symbol: "SPY", name: "S&P 500 ETF", assetClass: "stocks", multiplier: 1, decimals: 2 },
  EURUSD: { symbol: "EURUSD", name: "Euro / Dollar", assetClass: "forex", multiplier: 100_000, decimals: 5 },
  BTCUSD: { symbol: "BTCUSD", name: "Bitcoin", assetClass: "crypto", multiplier: 1, decimals: 2 },
};

export const SYMBOLS = Object.keys(INSTRUMENTS);

export function computePnl(input: {
  symbol: string;
  side: Side;
  qty: number;
  entryPrice: number;
  exitPrice: number;
  fees: number;
}): number {
  const m = INSTRUMENTS[input.symbol]?.multiplier ?? 1;
  const dir = input.side === "long" ? 1 : -1;
  const raw = dir * (input.exitPrice - input.entryPrice) * input.qty * m - input.fees;
  return Math.round(raw * 100) / 100;
}

export const DEMO_ACCOUNT_ID = "acc-main";
