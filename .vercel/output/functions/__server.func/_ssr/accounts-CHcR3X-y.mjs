import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as Trash2, c as RefreshCw, l as Plus, r as Upload } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as format } from "../_libs/date-fns.mjs";
import { S as useJournalUi, a as Input, m as cn, n as Badge, r as Button, t as AppShell, x as useJournalStore } from "./app-shell-BIAHNqug.mjs";
import { n as Surface, t as SectionLabel } from "./surface-DsYwUmlw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/accounts-CHcR3X-y.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function statusLabel(status) {
	if (status === "connecting") return "Connecting";
	if (status === "syncing") return "Pulling history";
	if (status === "error") return "Error";
	return "Connected";
}
function AccountsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountsView, {}) });
}
function AccountsView() {
	const accounts = useJournalStore((s) => s.accounts);
	const openAdd = useJournalUi((s) => s.openAddAccount);
	const resync = useJournalStore((s) => s.resync);
	const renameDesk = useJournalStore((s) => s.renameDesk);
	const removeDesk = useJournalStore((s) => s.removeDesk);
	const setFocus = useJournalStore((s) => s.setFocusAccountId);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [name, setName] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "flex flex-wrap items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase",
					children: [accounts.length, " connected"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 text-4xl font-semibold tracking-tight",
					children: "Accounts"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-xl text-sm text-muted-foreground",
					children: "Investor logins live here. Overview combines every desk. Fills, calendar, and analytics can focus on one."
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/import",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" }), "Import CSV"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: openAdd,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Add account"]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3",
			children: [accounts.map((account) => {
				const busy = account.status === "connecting" || account.status === "syncing";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Surface, {
					className: "grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							editing === account.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "flex max-w-sm gap-2",
								onSubmit: (e) => {
									e.preventDefault();
									renameDesk(account.id, name).then(() => setEditing(null));
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: name,
									onChange: (e) => setName(e.target.value),
									autoFocus: true
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									size: "sm",
									children: "Save"
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "text-left",
								onClick: () => {
									setFocus(account.id);
									toast(`Focusing ${account.name}`);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-lg font-semibold tracking-tight",
									children: account.name
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 truncate text-sm text-muted-foreground",
								children: [
									account.server,
									" · ",
									account.username
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-wrap items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: account.status === "connected" ? "win" : account.status === "error" ? "loss" : "outline",
									children: statusLabel(account.status)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted-foreground",
									children: [
										account.tradeCount,
										" fills",
										account.lastSyncAt ? ` · synced ${format(new Date(account.lastSyncAt), "MMM d HH:mm")}` : ""
									]
								})]
							}),
							busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 h-1.5 overflow-hidden rounded-full bg-secondary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full bg-primary transition-[width] duration-500",
									style: { width: `${Math.max(8, account.progress)}%` }
								})
							}) : null,
							account.errorMessage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-loss",
								children: account.errorMessage
							}) : null
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								disabled: busy,
								onClick: () => {
									toast(`Syncing ${account.name}`);
									resync(account.id).then(() => toast("History updated"));
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: cn("size-4", busy && "animate-spin") }), "Sync"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => {
									setEditing(account.id);
									setName(account.name);
								},
								children: "Rename"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "destructive",
								size: "sm",
								disabled: busy,
								onClick: () => {
									removeDesk(account.id);
									toast(`Removed ${account.name}`);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), "Remove"]
							})
						]
					})]
				}, account.id);
			}), accounts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Surface, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Empty desk" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Add an investor login to pull closed trades into the journal."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-4",
					onClick: openAdd,
					children: "Add account"
				})
			] }) : null]
		})]
	});
}
//#endregion
export { AccountsPage as component };
