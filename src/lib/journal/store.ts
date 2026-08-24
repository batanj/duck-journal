import { useMemo } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  connectAccount,
  deleteAccount,
  importAccountTrades,
  loadJournal,
  removeTrade as removeTradeFn,
  renameAccount,
  syncAccount,
  upsertTrade,
} from "./api";
import { filterByAccount } from "./range";
import { DEFAULT_SETTINGS, DEFAULT_SETUPS, type JournalSettings, type Trade, type TradingAccount } from "./types";

type JournalState = {
  trades: Trade[];
  accounts: TradingAccount[];
  settings: JournalSettings;
  focusAccountId: string;
  hydrated: boolean;
  syncing: boolean;
  setHydrated: (value: boolean) => void;
  setSettings: (patch: Partial<JournalSettings>) => void;
  setFocusAccountId: (id: string) => void;
  refresh: () => Promise<void>;
  connectDesk: (input: {
    name: string;
    server: string;
    username: string;
    password: string;
    platform: "MT4" | "MT5";
  }) => Promise<TradingAccount>;
  resync: (id: string) => Promise<void>;
  renameDesk: (id: string, name: string) => Promise<void>;
  removeDesk: (id: string) => Promise<void>;
  addTrade: (trade: Trade) => Promise<void>;
  updateTrade: (id: string, patch: Partial<Trade>) => Promise<void>;
  removeTrade: (id: string) => Promise<void>;
  importTrades: (incoming: Trade[], mode: "merge" | "replace") => Promise<number>;
};

function apply(set: (partial: Partial<JournalState>) => void, payload: { accounts: TradingAccount[]; trades: Trade[] }) {
  set({ accounts: payload.accounts, trades: payload.trades });
}

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      trades: [],
      accounts: [],
      settings: DEFAULT_SETTINGS,
      focusAccountId: "all",
      hydrated: false,
      syncing: false,
      setHydrated: (value) => set({ hydrated: value }),
      setSettings: (patch) => set({ settings: { ...get().settings, ...patch } }),
      setFocusAccountId: (id) => set({ focusAccountId: id }),
      refresh: async () => {
        const payload = await loadJournal();
        const focus = get().focusAccountId;
        const focusOk =
          focus === "all" || payload.accounts.some((a) => a.id === focus);
        apply(set, payload);
        set({
          hydrated: true,
          focusAccountId: focusOk ? focus : "all",
        });
      },
      connectDesk: async (input) => {
        const account = await connectAccount(input);
        await get().refresh();
        return account;
      },
      resync: async (id) => {
        set({ syncing: true });
        try {
          apply(set, await syncAccount(id));
        } finally {
          set({ syncing: false });
        }
      },
      renameDesk: async (id, name) => {
        apply(set, await renameAccount(id, name));
      },
      removeDesk: async (id) => {
        apply(set, await deleteAccount(id));
        if (get().focusAccountId === id) set({ focusAccountId: "all" });
      },
      addTrade: async (trade) => {
        apply(set, await upsertTrade(trade));
      },
      updateTrade: async (id, patch) => {
        const current = get().trades.find((t) => t.id === id);
        if (!current) return;
        apply(set, await upsertTrade({ ...current, ...patch, id }));
      },
      removeTrade: async (id) => {
        apply(set, await removeTradeFn(id));
      },
      importTrades: async (incoming, mode) => {
        const accountId =
          get().focusAccountId !== "all"
            ? get().focusAccountId
            : get().accounts[0]?.id;
        if (!accountId) return 0;
        apply(set, await importAccountTrades(accountId, incoming, mode));
        return incoming.length;
      },
    }),
    {
      name: "duckjournal-v2",
      partialize: (s) => ({
        settings: s.settings,
        focusAccountId: s.focusAccountId,
      }),
      merge: (persisted, current) => {
        const prior = persisted as Partial<JournalState> | undefined;
        return {
          ...current,
          ...prior,
          settings: { ...DEFAULT_SETTINGS, ...prior?.settings },
          hydrated: false,
        };
      },
      onRehydrateStorage: () => () => {
        useJournalStore.setState({ hydrated: false });
      },
    },
  ),
);

export function useFocusedTrades() {
  const trades = useJournalStore((s) => s.trades);
  const focus = useJournalStore((s) => s.focusAccountId);
  return filterByAccount(trades, focus);
}

export function useBusyAccounts() {
  return useJournalStore((s) =>
    s.accounts.some((a) => a.status === "connecting" || a.status === "syncing"),
  );
}

export function usePlaybook() {
  const saved = useJournalStore((s) => s.settings.setups);
  const trades = useJournalStore((s) => s.trades);
  return useMemo(() => {
    const base = saved?.length ? saved : [...DEFAULT_SETUPS];
    const extra: string[] = [];
    const seen = new Set(base);
    for (const t of trades) {
      if (t.setup && !seen.has(t.setup)) {
        seen.add(t.setup);
        extra.push(t.setup);
      }
    }
    return extra.length ? [...base, ...extra] : base;
  }, [saved, trades]);
}
