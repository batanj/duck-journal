import { create } from "zustand";

export type ThemeMode = "light" | "dark" | "system";

const KEY = "dj-theme";

export function readStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  const value = window.localStorage.getItem(KEY);
  if (value === "light" || value === "dark" || value === "system") return value;
  return "dark";
}

export function isDark(mode: ThemeMode) {
  if (mode === "dark") return true;
  if (mode === "light") return false;
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function applyTheme(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  const dark = isDark(mode);
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
}

type ThemeState = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  hydrate: () => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  mode: "dark",
  setMode: (mode) => {
    window.localStorage.setItem(KEY, mode);
    applyTheme(mode);
    set({ mode });
  },
  hydrate: () => {
    const mode = readStoredTheme();
    applyTheme(mode);
    set({ mode });
  },
}));
