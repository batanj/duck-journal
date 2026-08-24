import type { Trade, TradingAccount } from "./types";

export type JournalPayload = {
  accounts: TradingAccount[];
  trades: Trade[];
};

type ConnectInput = {
  name: string;
  server: string;
  username: string;
  password: string;
  platform: "MT4" | "MT5";
};

function isTauri() {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

async function invoke<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
  const { invoke: tauriInvoke } = await import("@tauri-apps/api/core");
  return tauriInvoke<T>(cmd, args);
}

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed (${res.status})`);
  }
  if (res.headers.get("content-type")?.includes("json")) {
    return (await res.json()) as T;
  }
  return (await res.text()) as T;
}

export async function loadJournal(): Promise<JournalPayload> {
  if (typeof window === "undefined") return { accounts: [], trades: [] };
  if (isTauri()) return invoke("load_journal");
  return http("/api/journal");
}

export async function connectAccount(input: ConnectInput): Promise<TradingAccount> {
  if (isTauri()) return invoke("connect_account", { input });
  return http("/api/accounts", { method: "POST", body: JSON.stringify(input) });
}

export async function syncAccount(id: string): Promise<JournalPayload> {
  if (isTauri()) return invoke("sync_account", { body: { id } });
  return http("/api/accounts/sync", { method: "POST", body: JSON.stringify({ id }) });
}

export async function renameAccount(id: string, name: string): Promise<JournalPayload> {
  if (isTauri()) return invoke("rename_account", { body: { id, name } });
  return http("/api/accounts/rename", { method: "POST", body: JSON.stringify({ id, name }) });
}

export async function deleteAccount(id: string): Promise<JournalPayload> {
  if (isTauri()) return invoke("delete_account", { body: { id } });
  return http("/api/accounts/delete", { method: "POST", body: JSON.stringify({ id }) });
}

export async function upsertTrade(trade: Trade): Promise<JournalPayload> {
  if (isTauri()) return invoke("upsert_trade", { trade });
  return http("/api/trades/upsert", { method: "POST", body: JSON.stringify(trade) });
}

export async function removeTrade(id: string): Promise<JournalPayload> {
  if (isTauri()) return invoke("remove_trade", { body: { id } });
  return http("/api/trades/delete", { method: "POST", body: JSON.stringify({ id }) });
}

export async function importAccountTrades(
  accountId: string,
  trades: Trade[],
  mode: "merge" | "replace",
): Promise<JournalPayload> {
  const body = { accountId, trades, mode };
  if (isTauri()) return invoke("import_trades", { body });
  return http("/api/trades/import", { method: "POST", body: JSON.stringify(body) });
}
