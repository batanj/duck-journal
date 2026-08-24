import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { AppShell } from "@/components/journal/app-shell";
import { ConfirmAction } from "@/components/journal/confirm-action";
import { SectionLabel, Surface } from "@/components/journal/surface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { tradesToCsv } from "@/lib/journal/csv";
import { useJournalStore } from "@/lib/journal/store";
import { useThemeStore, type ThemeMode } from "@/lib/theme";
import { DEFAULT_SETUPS } from "@/lib/journal/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

const THEMES: { id: ThemeMode; label: string; hint: string }[] = [
  { id: "dark", label: "Dark", hint: "Charcoal desk, mint and coral P&L" },
  { id: "light", label: "Light", hint: "Paper field, same punchy marks" },
  { id: "system", label: "System", hint: "Follow the device" },
];

function SettingsPage() {
  return (
    <AppShell>
      <SettingsView />
    </AppShell>
  );
}

function SettingsView() {
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  const trades = useJournalStore((s) => s.trades);
  const accounts = useJournalStore((s) => s.accounts);
  const settings = useJournalStore((s) => s.settings);
  const setSettings = useJournalStore((s) => s.setSettings);
  const setups = settings.setups?.length ? settings.setups : [...DEFAULT_SETUPS];
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState<string | null>(null);

  function exportCsv() {
    const blob = new Blob([tradesToCsv(trades)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "duckjournal-export.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast("Exported CSV");
  }

  function addSetup() {
    const name = draft.trim().slice(0, 40);
    if (!name) return;
    if (setups.some((s) => s.toLowerCase() === name.toLowerCase())) {
      toast("That setup is already on the playbook");
      return;
    }
    setSettings({ setups: [...setups, name] });
    setDraft("");
    toast(`Added ${name}`);
  }

  return (
    <div className="mx-auto grid max-w-2xl gap-6">
      <header>
        <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">App</p>
        <h1 className="mt-1 text-4xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Appearance, playbook, and backup. Accounts live on their own page.
        </p>
      </header>

      <Surface>
        <SectionLabel>Appearance</SectionLabel>
        <div className="mt-4 grid gap-2">
          {THEMES.map((item) => {
            const on = mode === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setMode(item.id)}
                className={cn(
                  "flex min-h-12 items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors duration-150",
                  on ? "bg-secondary" : "hover:bg-accent",
                )}
              >
                <span>
                  <span className="block text-sm font-medium">{item.label}</span>
                  <span className="block text-xs text-muted-foreground">{item.hint}</span>
                </span>
                <span
                  className={cn(
                    "size-2.5 rounded-full",
                    on ? "bg-primary" : "bg-border",
                  )}
                />
              </button>
            );
          })}
        </div>
      </Surface>

      <Surface>
        <SectionLabel>Playbook</SectionLabel>
        <p className="mt-2 text-sm text-muted-foreground">
          Setups you tag on a fill. Analytics buckets by these. Removing one does not strip it from
          fills you already tagged.
        </p>
        <ul className="mt-4 grid gap-1">
          {setups.map((name) => (
            <li
              key={name}
              className="flex min-h-11 items-center justify-between gap-3 rounded-md px-2 hover:bg-accent"
            >
              <span className="text-sm">{name}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label={`Remove ${name}`}
                onClick={() => setPending(name)}
              >
                <Trash2 className="size-4" />
                Remove
              </Button>
            </li>
          ))}
        </ul>
        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            addSetup();
          }}
        >
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="New setup"
            aria-label="New setup"
            maxLength={40}
          />
          <Button type="submit" disabled={!draft.trim()}>
            <Plus className="size-4" />
            Add
          </Button>
        </form>
      </Surface>

      <Surface>
        <SectionLabel>Backup</SectionLabel>
        <p className="mt-2 text-sm text-muted-foreground">
          {trades.length} fills across {accounts.length} account{accounts.length === 1 ? "" : "s"}.
          Generic CSV — Date, Symbol, Side, Qty, Entry, Exit, Fees, PnL, Setup, Notes.
        </p>
        <Button variant="outline" className="mt-4" onClick={exportCsv} disabled={!trades.length}>
          Export CSV
        </Button>
      </Surface>

      <Surface>
        <SectionLabel>About</SectionLabel>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Local-first journal. Investor passwords stay on this device after connect and are never
          shown again. Theme and playbook are stored in the browser.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          <Link to="/accounts" className="text-primary hover:underline">
            Manage accounts
          </Link>
        </p>
      </Surface>

      <ConfirmAction
        open={pending !== null}
        onOpenChange={(open) => {
          if (!open) setPending(null);
        }}
        title={`Remove ${pending ?? "this setup"}?`}
        description="Fills already tagged with it keep the tag. It just drops off the playbook list."
        confirmLabel="Remove"
        onConfirm={() => {
          if (!pending) return;
          setSettings({ setups: setups.filter((s) => s !== pending) });
          toast(`Removed ${pending}`);
          setPending(null);
        }}
      />
    </div>
  );
}
