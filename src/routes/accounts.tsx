import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { toast } from "sonner";
import { Plus, RefreshCw, Trash2, Upload } from "lucide-react";
import { AppShell } from "@/components/journal/app-shell";
import { ConfirmAction } from "@/components/journal/confirm-action";
import { SectionLabel, Surface } from "@/components/journal/surface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useJournalStore } from "@/lib/journal/store";
import { useJournalUi } from "@/lib/journal/ui";
import type { AccountStatus } from "@/lib/journal/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/accounts")({ component: AccountsPage });

function statusLabel(status: AccountStatus) {
  if (status === "connecting") return "Connecting";
  if (status === "syncing") return "Pulling history";
  if (status === "error") return "Error";
  return "Connected";
}

function AccountsPage() {
  return (
    <AppShell>
      <AccountsView />
    </AppShell>
  );
}

function AccountsView() {
  const accounts = useJournalStore((s) => s.accounts);
  const openAdd = useJournalUi((s) => s.openAddAccount);
  const resync = useJournalStore((s) => s.resync);
  const renameDesk = useJournalStore((s) => s.renameDesk);
  const removeDesk = useJournalStore((s) => s.removeDesk);
  const setFocus = useJournalStore((s) => s.setFocusAccountId);
  const [editing, setEditing] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [pendingRemove, setPendingRemove] = useState<string | null>(null);
  const pending = accounts.find((a) => a.id === pendingRemove);

  return (
    <div className="grid gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
            {accounts.length} connected
          </p>
          <h1 className="mt-1 text-4xl font-semibold tracking-tight">Accounts</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Investor logins live here. Overview combines every desk. Fills, calendar, and
            analytics can focus on one.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/import">
              <Upload className="size-4" />
              Import CSV
            </Link>
          </Button>
          <Button onClick={openAdd}>
            <Plus className="size-4" />
            Add account
          </Button>
        </div>
      </header>

      <div className="grid gap-3">
        {accounts.map((account) => {
          const busy = account.status === "connecting" || account.status === "syncing";
          return (
            <Surface key={account.id} className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
              <div className="min-w-0">
                {editing === account.id ? (
                  <form
                    className="flex max-w-sm gap-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      void renameDesk(account.id, name).then(() => setEditing(null));
                    }}
                  >
                    <Input value={name} onChange={(e) => setName(e.target.value)} autoFocus />
                    <Button type="submit" size="sm">
                      Save
                    </Button>
                  </form>
                ) : (
                  <button
                    type="button"
                    className="text-left"
                    onClick={() => {
                      setFocus(account.id);
                      toast(`Focusing ${account.name}`);
                    }}
                  >
                    <p className="text-lg font-semibold tracking-tight">{account.name}</p>
                  </button>
                )}
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {account.platform} · {account.server} · {account.username}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Badge
                    variant={
                      account.status === "connected"
                        ? "win"
                        : account.status === "error"
                          ? "loss"
                          : "outline"
                    }
                  >
                    {statusLabel(account.status)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {account.tradeCount} fills
                    {account.lastSyncAt
                      ? ` · synced ${format(new Date(account.lastSyncAt), "MMM d HH:mm")}`
                      : ""}
                  </span>
                </div>
                {busy ? (
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full bg-primary transition-[width] duration-500"
                      style={{ width: `${Math.max(8, account.progress)}%` }}
                    />
                  </div>
                ) : null}
                {account.errorMessage ? (
                  <p className="mt-2 text-sm text-loss">{account.errorMessage}</p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={busy}
                  onClick={() => {
                    toast(`Syncing ${account.name}`);
                    void resync(account.id).then(() => toast("History updated"));
                  }}
                >
                  <RefreshCw className={cn("size-4", busy && "animate-spin")} />
                  Sync
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditing(account.id);
                    setName(account.name);
                  }}
                >
                  Rename
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={busy}
                  onClick={() => setPendingRemove(account.id)}
                >
                  <Trash2 className="size-4" />
                  Remove
                </Button>
              </div>
            </Surface>
          );
        })}
        {accounts.length === 0 ? (
          <Surface>
            <SectionLabel>Empty desk</SectionLabel>
            <p className="mt-2 text-sm text-muted-foreground">
              Add an investor login to pull closed trades into the journal.
            </p>
            <Button className="mt-4" onClick={openAdd}>
              Add account
            </Button>
          </Surface>
        ) : null}
      </div>
      <ConfirmAction
        open={Boolean(pendingRemove)}
        onOpenChange={(open) => {
          if (!open) setPendingRemove(null);
        }}
        title={`Remove ${pending?.name ?? "account"}?`}
        description="This desk and its fills leave the journal. You can connect the same login later and sync history again."
        confirmLabel="Remove account"
        onConfirm={() => {
          if (!pending) return;
          void removeDesk(pending.id);
          toast(`Removed ${pending.name}`);
          setPendingRemove(null);
        }}
      />
    </div>
  );
}
