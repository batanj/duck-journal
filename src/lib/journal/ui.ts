import { create } from "zustand";

type UiState = {
  addAccountOpen: boolean;
  logFillOpen: boolean;
  chartTradeId: string | null;
  openAddAccount: () => void;
  closeAddAccount: () => void;
  openLogFill: () => void;
  closeLogFill: () => void;
  openChart: (id: string) => void;
  closeChart: () => void;
};

export const useJournalUi = create<UiState>((set) => ({
  addAccountOpen: false,
  logFillOpen: false,
  chartTradeId: null,
  openAddAccount: () => set({ addAccountOpen: true }),
  closeAddAccount: () => set({ addAccountOpen: false }),
  openLogFill: () => set({ logFillOpen: true }),
  closeLogFill: () => set({ logFillOpen: false }),
  openChart: (id) => set({ chartTradeId: id }),
  closeChart: () => set({ chartTradeId: null }),
}));
