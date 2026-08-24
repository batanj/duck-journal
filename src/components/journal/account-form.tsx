import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useJournalStore } from "@/lib/journal/store";
import { useJournalUi } from "@/lib/journal/ui";
import type { TerminalPlatform } from "@/lib/journal/types";
import { cn } from "@/lib/utils";

export function AccountForm({ onDone }: { onDone?: () => void }) {
  const connectDesk = useJournalStore((s) => s.connectDesk);
  const [name, setName] = useState("");
  const [server, setServer] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [platform, setPlatform] = useState<TerminalPlatform>("MT5");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const account = await connectDesk({ name, server, username, password, platform });
      toast(`Connected ${account.name}. Pulling history…`);
      onDone?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not connect.";
      setError(message.replace(/^Error:\s*/, ""));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={(e) => void submit(e)}>
      <div className="grid gap-1.5">
        <Label>Terminal</Label>
        <div className="grid grid-cols-2 gap-1 rounded-lg bg-secondary p-1">
          {(["MT4", "MT5"] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setPlatform(id)}
              className={cn(
                "h-10 rounded-md text-sm transition-colors duration-150",
                platform === id
                  ? "bg-card text-foreground shadow-[var(--shadow-border)]"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {id === "MT4" ? "MetaTrader 4" : "MetaTrader 5"}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="acct-name">Account name</Label>
        <Input
          id="acct-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Main futures"
          required
          autoComplete="off"
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="acct-server">Server</Label>
        <Input
          id="acct-server"
          value={server}
          onChange={(e) => setServer(e.target.value)}
          placeholder="ICMarketsSC-Demo"
          required
          autoComplete="off"
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="acct-user">Login</Label>
        <Input
          id="acct-user"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="45289103"
          required
          autoComplete="off"
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="acct-pass">Investor password</Label>
        <Input
          id="acct-pass"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Read-only password"
          required
          minLength={4}
          autoComplete="new-password"
        />
        <p className="text-xs text-muted-foreground">
          That {platform} terminal must be open and signed into this login. Investor password is
          enough — DuckJournal never places orders. A terminal logged into a different account
          cannot see this one.
        </p>
      </div>
      {error ? <p className="text-sm text-loss">{error}</p> : null}
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={busy}>
          {busy ? "Connecting…" : "Connect"}
        </Button>
      </div>
    </form>
  );
}

export function useAddAccount() {
  return useJournalUi((s) => s.openAddAccount);
}
