import { format, parseISO } from "date-fns";

export function money(value: number, opts?: { sign?: boolean; digits?: number }): string {
  if (!Number.isFinite(value)) return "—";
  const digits = opts?.digits ?? 2;
  const abs = Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
  if (opts?.sign) {
    if (value > 0) return `+$${abs}`;
    if (value < 0) return `-$${abs}`;
    return `$${abs}`;
  }
  return value < 0 ? `-$${abs}` : `$${abs}`;
}

export function compactMoney(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  const abs = Math.abs(value);
  if (abs >= 1000) return `${sign}$${(abs / 1000).toFixed(1)}k`;
  return `${sign}$${Math.round(abs)}`;
}

export function pct(value: number, digits = 1): string {
  if (!Number.isFinite(value)) return "—";
  return `${(value * 100).toFixed(digits)}%`;
}

export function num(value: number, digits = 2): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatWhen(iso: string): string {
  try {
    return format(parseISO(iso), "MMM d, HH:mm");
  } catch {
    return iso;
  }
}

export function formatDay(iso: string): string {
  try {
    return format(parseISO(iso), "EEE, MMM d");
  } catch {
    return iso;
  }
}

export function formatFull(iso: string): string {
  try {
    return format(parseISO(iso), "MMM d yyyy, HH:mm");
  } catch {
    return iso;
  }
}

export function pnlTone(value: number): "win" | "loss" | "flat" {
  if (value > 0.005) return "win";
  if (value < -0.005) return "loss";
  return "flat";
}
