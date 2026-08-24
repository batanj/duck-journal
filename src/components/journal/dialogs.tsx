import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useJournalStore } from "@/lib/journal/store";
import { useJournalUi } from "@/lib/journal/ui";
import { AccountForm } from "./account-form";
import { TradeForm } from "./trade-form";

export function AddAccountDialog() {
  const open = useJournalUi((s) => s.addAccountOpen);
  const close = useJournalUi((s) => s.closeAddAccount);

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? null : close())}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add trading account</DialogTitle>
          <DialogDescription>
            Investor login on the terminal server. After connect, history downloads in the
            background.
          </DialogDescription>
        </DialogHeader>
        <AccountForm onDone={close} />
      </DialogContent>
    </Dialog>
  );
}

export function AddTradeDialog() {
  const open = useJournalUi((s) => s.logFillOpen);
  const close = useJournalUi((s) => s.closeLogFill);
  const addTrade = useJournalStore((s) => s.addTrade);
  const accounts = useJournalStore((s) => s.accounts);
  const focus = useJournalStore((s) => s.focusAccountId);
  const accountId = focus !== "all" ? focus : accounts[0]?.id;

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? null : close())}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log a fill</DialogTitle>
          <DialogDescription>Manual entry when the export is still on the way.</DialogDescription>
        </DialogHeader>
        {accountId ? (
          <TradeForm
            submitLabel="Add fill"
            initial={{ accountId }}
            onCancel={close}
            onSubmit={(trade) => {
              void addTrade({ ...trade, accountId });
              close();
              toast(`Logged ${trade.symbol}`);
            }}
          />
        ) : (
          <p className="text-sm text-muted-foreground">Connect an account first.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}

