import { computePnl, INSTRUMENTS, type Setup, type Side, type Trade } from "./types";

export type PlatformId = "auto" | "generic" | "mt4" | "mt5";

export type ParseIssue = { row: number; message: string };

export type ParseResult = {
  trades: Trade[];
  issues: ParseIssue[];
  detected: Exclude<PlatformId, "auto">;
  headers: string[];
};

export const PLATFORMS: {
  id: Exclude<PlatformId, "auto">;
  name: string;
  blurb: string;
  hint: string;
}[] = [
  {
    id: "generic",
    name: "Generic CSV",
    blurb: "Date, symbol, side, qty, entry, exit, fees.",
    hint: "Columns: Date, Symbol, Side, Qty, Entry, Exit, Fees, Setup, Notes",
  },
  {
    id: "mt4",
    name: "MetaTrader 4",
    blurb: "Account History → Save as Report. HTML or CSV.",
    hint: "Terminal → Account History → right click → Save as Report",
  },
  {
    id: "mt5",
    name: "MetaTrader 5",
    blurb: "History → Save as Report. HTML, Excel CSV, or positions CSV.",
    hint: "Toolbox → History → right click → Save as Report",
  },
];

const SKIP_TYPES = new Set([
  "balance",
  "credit",
  "deposit",
  "withdrawal",
  "cancelled",
  "canceled",
  "buylimit",
  "selllimit",
  "buystop",
  "sellstop",
  "buystoplimit",
  "sellstoplimit",
]);

function stripBom(text: string) {
  return text.replace(/^\uFEFF/, "");
}

function decodeHtml(text: string) {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&/gi, "&")
    .replace(/</gi, "<")
    .replace(/>/gi, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function rowsFromHtmlTable(tableHtml: string): string[][] {
  const trs = [...tableHtml.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)];
  return trs
    .map((tr) =>
      [...tr[1].matchAll(/<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/gi)].map((c) => decodeHtml(c[1])),
    )
    .filter((row) => row.some((c) => c.length));
}

function isTradeHeader(row: string[]): boolean {
  const joined = row.map(norm).join(" ");
  const hasTicket = joined.includes("ticket") || joined.includes("position") || joined.includes("deal");
  const hasMarket =
    joined.includes("item") ||
    joined.includes("symbol") ||
    joined.includes("instrument");
  const hasType = joined.includes("type") || joined.includes("side");
  return (hasTicket && (hasMarket || hasType)) || (hasMarket && hasType && joined.includes("profit"));
}

function tablesFromHtml(html: string): string[][] {
  const tables = [...html.matchAll(/<table\b[\s\S]*?<\/table>/gi)].map((m) => m[0]);
  let fallback: string[][] = [];
  for (const table of tables) {
    const rows = rowsFromHtmlTable(table);
    if (!rows.length) continue;
    const headerAt = rows.findIndex(isTradeHeader);
    if (headerAt >= 0) return rows.slice(headerAt);
    if (rows.length > fallback.length) fallback = rows;
  }
  return fallback;
}

function detectDelimiter(text: string): "," | ";" | "\t" {
  const line =
    text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .find((l) => l.length > 8 && !l.startsWith("<")) ?? "";
  const commas = (line.match(/,/g) ?? []).length;
  const semis = (line.match(/;/g) ?? []).length;
  const tabs = (line.match(/\t/g) ?? []).length;
  if (tabs > commas && tabs > semis) return "\t";
  if (semis > commas) return ";";
  return ",";
}

export function parseCsvText(text: string, delimiter?: "," | ";" | "\t"): string[][] {
  const src = stripBom(text).replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const sep = delimiter ?? detectDelimiter(src);
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let i = 0;
  let quoted = false;
  while (i < src.length) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          cell += '"';
          i += 2;
          continue;
        }
        quoted = false;
        i += 1;
        continue;
      }
      cell += ch;
      i += 1;
      continue;
    }
    if (ch === '"') {
      quoted = true;
      i += 1;
      continue;
    }
    if (ch === sep) {
      row.push(cell.trim());
      cell = "";
      i += 1;
      continue;
    }
    if (ch === "\n") {
      row.push(cell.trim());
      cell = "";
      if (row.some((c) => c.length)) rows.push(row);
      row = [];
      i += 1;
      continue;
    }
    cell += ch;
    i += 1;
  }
  row.push(cell.trim());
  if (row.some((c) => c.length)) rows.push(row);
  return rows;
}

function extractRows(text: string): string[][] {
  const raw = stripBom(text);
  if (/<table/i.test(raw)) return tablesFromHtml(raw);
  return parseCsvText(raw);
}

function norm(h: string) {
  return h.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function headerMap(headers: string[]) {
  const map = new Map<string, number>();
  const seen = new Map<string, number>();
  headers.forEach((h, i) => {
    const n = norm(h);
    if (!n) return;
    const count = (seen.get(n) ?? 0) + 1;
    seen.set(n, count);
    if (count === 1) {
      map.set(n, i);
      if (n === "price") map.set("openprice", i);
      if (n === "time" || n === "datetime") map.set("opentime", i);
      return;
    }
    if (n === "price") {
      map.set("closeprice", i);
      map.set("price2", i);
    }
    if (n === "time" || n === "datetime") {
      map.set("closetime", i);
    }
  });
  return map;
}

function cell(row: string[], map: Map<string, number>, names: string[]): string {
  for (const n of names) {
    const i = map.get(norm(n));
    if (i !== undefined && row[i]) return row[i];
  }
  return "";
}

function parseSide(raw: string): Side | null {
  const s = raw.trim().toLowerCase().replace(/\s+/g, "");
  if (["buy", "long", "bot", "bought", "b", "inbuy"].includes(s)) return "long";
  if (["sell", "short", "sold", "sht", "s", "insell"].includes(s)) return "short";
  return null;
}

function parseNum(raw: string): number | null {
  if (!raw) return null;
  let s = raw.replace(/[$€£\s]/g, "").replace(/^\((.+)\)$/, "-$1");
  if (!s || s === "-") return null;
  const lastComma = s.lastIndexOf(",");
  const lastDot = s.lastIndexOf(".");
  if (lastComma > lastDot) s = s.replace(/\./g, "").replace(",", ".");
  else s = s.replace(/,/g, "");
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function parseDate(raw: string): Date | null {
  if (!raw) return null;
  const m = raw.trim().match(
    /^(\d{4})[.\/-](\d{1,2})[.\/-](\d{1,2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?/,
  );
  if (m) {
    return new Date(
      Number(m[1]),
      Number(m[2]) - 1,
      Number(m[3]),
      Number(m[4] ?? 9),
      Number(m[5] ?? 0),
      Number(m[6] ?? 0),
    );
  }
  const eu = raw.trim().match(
    /^(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{4})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?/,
  );
  if (eu) {
    return new Date(
      Number(eu[3]),
      Number(eu[2]) - 1,
      Number(eu[1]),
      Number(eu[4] ?? 9),
      Number(eu[5] ?? 0),
      Number(eu[6] ?? 0),
    );
  }
  const d = new Date(raw.replace(/\./g, "-").replace(" ", "T"));
  if (!Number.isNaN(d.getTime())) return d;
  return null;
}

function detectPlatform(headers: string[]): Exclude<PlatformId, "auto"> {
  const h = headers.map(norm).join(" ");
  if (h.includes("ticket") && (h.includes("opentime") || h.includes("item"))) return "mt4";
  if (
    h.includes("volume") &&
    (h.includes("position") || h.includes("deal") || h.includes("commission") || h.includes("symbol"))
  ) {
    return "mt5";
  }
  if (h.includes("ticket") && h.includes("profit")) return "mt4";
  return "generic";
}

function asSetup(raw: string): Setup | "" {
  const s = raw.trim().slice(0, 40);
  return s;
}

function toTrade(partial: Omit<Trade, "id" | "pnl" | "assetClass" | "accountId"> & {
  id?: string;
  pnl?: number;
  accountId?: string;
}): Trade {
  const inst = INSTRUMENTS[partial.symbol];
  const pnl =
    partial.pnl !== undefined && Number.isFinite(partial.pnl)
      ? partial.pnl
      : computePnl(partial);
  return {
    ...partial,
    id: partial.id ?? crypto.randomUUID(),
    assetClass: inst?.assetClass ?? "forex",
    pnl,
    tags: partial.tags ?? [],
    notes: partial.notes ?? "",
    setup: partial.setup ?? "",
    grade: partial.grade ?? "",
    emotions: partial.emotions ?? [],
    platform: partial.platform ?? "",
    accountId: partial.accountId ?? "",
  };
}

export function parseTradesCsv(text: string, platform: PlatformId = "auto"): ParseResult {
  const rows = extractRows(text);
  const issues: ParseIssue[] = [];
  if (rows.length < 2) {
    return { trades: [], issues: [{ row: 0, message: "No data rows found." }], detected: "generic", headers: [] };
  }

  let headerIndex = 0;
  for (let i = 0; i < Math.min(rows.length, 12); i++) {
    if (isTradeHeader(rows[i])) {
      headerIndex = i;
      break;
    }
    const joined = rows[i].map(norm).join(" ");
    if (
      joined.includes("symbol") ||
      joined.includes("item") ||
      joined.includes("instrument") ||
      joined.includes("ticket")
    ) {
      headerIndex = i;
      break;
    }
  }

  const headers = rows[headerIndex];
  const detected = platform === "auto" ? detectPlatform(headers) : platform;
  const map = headerMap(headers);
  const trades: Trade[] = [];

  rows.slice(headerIndex + 1).forEach((row, idx) => {
    const rowNum = headerIndex + idx + 2;
    try {
      const typeRaw = cell(row, map, ["type", "side", "action", "buy/sell", "direction", "bs"]);
      const typeKey = typeRaw.toLowerCase().replace(/\s+/g, "");
      if (SKIP_TYPES.has(typeKey)) return;

      const symbol = (
        cell(row, map, ["symbol", "item", "instrument", "ticker", "asset"]) || ""
      )
        .toUpperCase()
        .replace(/\s+/g, "");
      if (!symbol || symbol === "BALANCE" || symbol === "CREDIT") return;

      let side = parseSide(typeRaw);
      if (!side) side = parseSide(cell(row, map, ["direction", "entry", "cmd"]));
      if (!side) {
        const qtySigned = parseNum(cell(row, map, ["qty", "quantity", "size", "volume", "lots"]));
        if (qtySigned !== null && qtySigned < 0) side = "short";
        else if (qtySigned !== null && qtySigned > 0 && !typeRaw) side = "long";
      }
      if (!side) {
        issues.push({ row: rowNum, message: `Could not read side for ${symbol}.` });
        return;
      }

      const qty = Math.abs(
        parseNum(cell(row, map, ["qty", "quantity", "size", "volume", "lots"])) ?? 0,
      );
      if (!qty) {
        issues.push({ row: rowNum, message: `Missing quantity for ${symbol}.` });
        return;
      }

      const entryPrice =
        parseNum(
          cell(row, map, [
            "entry",
            "entryprice",
            "openprice",
            "open",
            "price",
            "tprice",
            "tradeprice",
            "fillprice",
          ]),
        ) ?? null;
      const exitPrice =
        parseNum(
          cell(row, map, ["exit", "exitprice", "closeprice", "price2", "close", "closeprice"]),
        ) ?? entryPrice;
      if (entryPrice === null || exitPrice === null) {
        issues.push({ row: rowNum, message: `Missing prices for ${symbol}.` });
        return;
      }

      const entryDate =
        parseDate(
          cell(row, map, ["entryat", "opentime", "open", "datetime", "date", "time", "exectime"]),
        ) ?? new Date();
      const exitDate =
        parseDate(cell(row, map, ["exitat", "closetime", "closed", "exitdate", "close"])) ??
        entryDate;

      const commission = Math.abs(parseNum(cell(row, map, ["commission", "comm", "commissions"])) ?? 0);
      const swap = Math.abs(parseNum(cell(row, map, ["swap", "swaps", "rollover"])) ?? 0);
      const taxes = Math.abs(parseNum(cell(row, map, ["taxes", "tax"])) ?? 0);
      const feesListed = Math.abs(parseNum(cell(row, map, ["fees"])) ?? 0);
      const fees = feesListed || commission + swap + taxes;
      const pnlCell = parseNum(cell(row, map, ["pnl", "profit", "netpnl", "netprofit", "amount", "pl"]));
      const notes = cell(row, map, ["notes", "comment", "comment"]);
      const setup = asSetup(cell(row, map, ["setup", "strategy", "play"]));
      const ticket = cell(row, map, ["ticket", "order", "position", "deal"]);

      trades.push(
        toTrade({
          id: ticket ? `${detected}-${ticket}-${entryDate.getTime()}` : undefined,
          symbol,
          side,
          qty,
          entryPrice,
          exitPrice,
          entryAt: entryDate.toISOString(),
          exitAt: exitDate.toISOString(),
          fees,
          pnl: pnlCell ?? undefined,
          setup,
          tags: [],
          notes,
          grade: "",
          emotions: [],
          platform: detected === "generic" ? "CSV" : detected.toUpperCase(),
        }),
      );
    } catch (err) {
      issues.push({
        row: rowNum,
        message: err instanceof Error ? err.message : "Unreadable row.",
      });
    }
  });

  return { trades, issues, detected, headers };
}

export function tradesToCsv(trades: Trade[]): string {
  const header = [
    "Date",
    "Symbol",
    "Side",
    "Qty",
    "Entry",
    "Exit",
    "Fees",
    "PnL",
    "Setup",
    "Grade",
    "Notes",
    "EntryAt",
    "ExitAt",
  ];
  const lines = trades.map((t) =>
    [
      t.exitAt.slice(0, 10),
      t.symbol,
      t.side,
      t.qty,
      t.entryPrice,
      t.exitPrice,
      t.fees,
      t.pnl,
      t.setup,
      t.grade,
      `"${t.notes.replace(/"/g, '""')}"`,
      t.entryAt,
      t.exitAt,
    ].join(","),
  );
  return [header.join(","), ...lines].join("\n");
}
