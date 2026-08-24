import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useJournalStore } from "@/lib/journal/store";

export function AccountFocus({ className }: { className?: string }) {
  const accounts = useJournalStore((s) => s.accounts);
  const focus = useJournalStore((s) => s.focusAccountId);
  const setFocus = useJournalStore((s) => s.setFocusAccountId);

  if (accounts.length === 0) return null;

  return (
    <Select value={focus} onValueChange={setFocus}>
      <SelectTrigger className={className ?? "w-full sm:w-52"}>
        <SelectValue placeholder="All accounts" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All accounts</SelectItem>
        {accounts.map((a) => (
          <SelectItem key={a.id} value={a.id}>
            {a.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
