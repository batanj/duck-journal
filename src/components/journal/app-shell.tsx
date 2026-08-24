import { useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  LayoutGrid,
  Plus,
  Settings,
  Upload,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBusyAccounts, useJournalStore } from "@/lib/journal/store";
import { useJournalUi } from "@/lib/journal/ui";
import { cn } from "@/lib/utils";
import { AddAccountDialog, AddTradeDialog } from "./dialogs";
import { TradeChartDialog } from "./trade-chart";

const NAV = [
  { to: "/", label: "Overview", icon: LayoutGrid },
  { to: "/trades", label: "Fills", icon: BookOpen },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/accounts", label: "Accounts", icon: Wallet },
] as const;

const DESKTOP_NAV = [...NAV, { to: "/import", label: "Import", icon: Upload }] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const refresh = useJournalStore((s) => s.refresh);
  const accounts = useJournalStore((s) => s.accounts);
  const hydrated = useJournalStore((s) => s.hydrated);
  const openAdd = useJournalUi((s) => s.openAddAccount);
  const busy = useBusyAccounts();

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!busy) return;
    const id = window.setInterval(() => {
      void refresh();
    }, 1200);
    return () => window.clearInterval(id);
  }, [busy, refresh]);

  const deskLabel =
    accounts.length === 0
      ? "No accounts"
      : accounts.length === 1
        ? accounts[0].name
        : `${accounts.length} accounts`;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 flex-col border-r border-border bg-card px-4 py-6 lg:flex">
        <Link to="/" className="mb-8 px-2">
          <p className="text-xl font-semibold leading-none tracking-tight">
            <span className="text-primary">Duck</span>Journal
          </p>
          <p className="mt-1.5 text-xs text-muted-foreground">{deskLabel}</p>
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {DESKTOP_NAV.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors duration-150",
                  active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="grid gap-2">
          <Button onClick={openAdd} className="w-full">
            <Plus className="size-4" />
            Add account
          </Button>
          <Link
            to="/settings"
            className={cn(
              "flex h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors duration-150",
              pathname === "/settings"
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <Settings className="size-4" />
            Settings
          </Link>
        </div>
      </aside>

      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-sm lg:hidden">
        <Link to="/" className="text-lg font-semibold tracking-tight">
          <span className="text-primary">Duck</span>Journal
        </Link>
        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost" asChild>
            <Link to="/settings" aria-label="Settings">
              <Settings className="size-4" />
            </Link>
          </Button>
          <Button size="icon" onClick={openAdd} aria-label="Add account">
            <Plus className="size-4" />
          </Button>
        </div>
      </header>

      <main className="px-4 pt-6 pb-28 lg:ml-56 lg:px-8 lg:pt-8 lg:pb-12">
        <div className="mx-auto max-w-7xl">
          {hydrated ? children : <div className="h-72 rounded-xl bg-card" />}
        </div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 px-2 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-sm lg:hidden">
        <ul className="grid grid-cols-5">
          {NAV.map((item) => {
            const active = pathname === item.to;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex h-12 flex-col items-center justify-center gap-0.5 text-[10px] tracking-wide uppercase",
                    active ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <AddAccountDialog />
      <AddTradeDialog />
      <TradeChartDialog />
    </div>
  );
}
