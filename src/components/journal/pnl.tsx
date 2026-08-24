import { cn } from "@/lib/utils";
import { money, pnlTone } from "@/lib/journal/format";

export function PnlText({
  value,
  className,
  compact = false,
  signed = true,
}: {
  value: number;
  className?: string;
  compact?: boolean;
  signed?: boolean;
}) {
  const tone = pnlTone(value);
  return (
    <span
      className={cn(
        "tabular",
        tone === "win" && "text-win",
        tone === "loss" && "text-loss",
        tone === "flat" && "text-muted-foreground",
        className,
      )}
    >
      {compact
        ? `${value > 0 ? "+" : value < 0 ? "-" : ""}$${Math.abs(value).toLocaleString("en-US", { maximumFractionDigits: 0 })}`
        : money(value, { sign: signed })}
    </span>
  );
}
