import { cn } from "@/lib/utils";

export function Surface({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-xl bg-card p-4 shadow-[var(--shadow-border)] sm:p-5",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
      {children}
    </p>
  );
}
