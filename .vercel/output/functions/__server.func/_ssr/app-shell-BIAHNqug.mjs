import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { d as useRouterState, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime, r as Slot } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as SYMBOLS, i as SETUPS, o as computePnl, r as INSTRUMENTS, t as DEFAULT_SETTINGS } from "./types-GL5ccc67.mjs";
import { n as any, o as object, r as array, s as string, t as _enum } from "../_libs/zod.mjs";
import { _ as ChartCandlestick, g as ChartColumn, h as Check, l as Plus, m as ChevronDown, n as Wallet, o as Settings, r as Upload, t as X, u as LayoutGrid, v as CalendarDays, y as BookOpen } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as format, c as startOfMonth, n as parseISO, r as subDays, s as startOfYear } from "../_libs/date-fns.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
import { a as SelectItemIndicator, c as SelectTrigger$1, i as SelectItem$1, l as SelectValue$1, n as SelectContent$1, o as SelectItemText, r as SelectIcon, s as SelectPortal, t as Select$1, u as SelectViewport } from "../_libs/@radix-ui/react-select+[...].mjs";
import { a as XAxis, c as CartesianGrid, i as YAxis, l as ReferenceDot, m as Tooltip, p as ResponsiveContainer, r as LineChart, s as Line, u as ReferenceLine } from "../_libs/recharts+[...].mjs";
import { i as Viewport, n as Scrollbar, r as Thumb, t as Root$1 } from "../_libs/radix-ui__react-scroll-area.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-shell-BIAHNqug.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-[color,background-color,box-shadow,transform,opacity] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			destructive: "bg-destructive text-foreground hover:bg-destructive/90",
			outline: "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-foreground underline-offset-4 hover:underline"
		},
		size: {
			default: "h-10 rounded-md px-4",
			sm: "h-9 rounded-md px-3",
			lg: "h-11 rounded-lg px-5",
			icon: "size-10 rounded-md"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var loadJournal = createServerFn({ method: "GET" }).handler(createSsrRpc("a3fb173d1269a1d4e8316a6c25e04a2c992d833c721239e1bd33f589086e0da0"));
var connectSchema = object({
	name: string().trim().min(1).max(80),
	server: string().trim().min(2).max(80),
	username: string().trim().min(2).max(40),
	password: string().min(4).max(80)
});
var connectAccount = createServerFn({ method: "POST" }).validator((d) => connectSchema.parse(d)).handler(createSsrRpc("ab9021bea18319b6289a5ac9b14e730c8366afc9a49be162a20262af2dfa398a"));
var idSchema = object({ id: string().min(1) });
var syncAccount = createServerFn({ method: "POST" }).validator((d) => idSchema.parse(d)).handler(createSsrRpc("e6f858d84e935dfb18b23d74ddd629dcda30b4025b25b4e60440ffc9369b7719"));
var renameSchema = object({
	id: string().min(1),
	name: string().trim().min(1).max(80)
});
var renameAccount = createServerFn({ method: "POST" }).validator((d) => renameSchema.parse(d)).handler(createSsrRpc("30499c5ed5c90b05a26db0e7931e87f5249bdddfc7e76dbe4956418e5dd312fe"));
var deleteAccount = createServerFn({ method: "POST" }).validator((d) => idSchema.parse(d)).handler(createSsrRpc("69e50071023091405dc408875f9da6884b49d0a38bd8f698c1512c250dafc2a1"));
var upsertTrade = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("cc46301ee0fcd9b97cf7d30cf9760651d0bfa8055f19e2570a317d3c5b549a02"));
var removeTrade = createServerFn({ method: "POST" }).validator((d) => idSchema.parse(d)).handler(createSsrRpc("c954ad44dc3a012406cec68d1e5f322a623b609c0c944b739cc59e8e12b83944"));
var importSchema = object({
	accountId: string().min(1),
	trades: array(any()),
	mode: _enum(["merge", "replace"])
});
var importAccountTrades = createServerFn({ method: "POST" }).validator((d) => importSchema.parse(d)).handler(createSsrRpc("fd710bdb50f8e7e3d75edcce821329586d7c02a6bebb3541f95a81c0ffccc5bc"));
var RANGE_OPTIONS = [
	{
		id: "7d",
		label: "7 days"
	},
	{
		id: "30d",
		label: "30 days"
	},
	{
		id: "month",
		label: "This month"
	},
	{
		id: "year",
		label: "This year"
	},
	{
		id: "all",
		label: "All"
	}
];
function filterByRange(trades, range, now = /* @__PURE__ */ new Date()) {
	if (range === "all") return trades;
	const t0 = (range === "month" ? startOfMonth(now) : range === "year" ? startOfYear(now) : subDays(now, range === "7d" ? 7 : 30)).getTime();
	return trades.filter((t) => new Date(t.exitAt).getTime() >= t0);
}
function filterByAccount(trades, accountId) {
	if (accountId === "all") return trades;
	return trades.filter((t) => t.accountId === accountId);
}
function apply(set, payload) {
	set({
		accounts: payload.accounts,
		trades: payload.trades
	});
}
var useJournalStore = create()(persist((set, get) => ({
	trades: [],
	accounts: [],
	settings: DEFAULT_SETTINGS,
	focusAccountId: "all",
	hydrated: false,
	syncing: false,
	setHydrated: (value) => set({ hydrated: value }),
	setSettings: (patch) => set({ settings: {
		...get().settings,
		...patch
	} }),
	setFocusAccountId: (id) => set({ focusAccountId: id }),
	refresh: async () => {
		apply(set, await loadJournal());
		set({ hydrated: true });
	},
	connectDesk: async (input) => {
		const account = await connectAccount({ data: input });
		await get().refresh();
		syncAccount({ data: { id: account.id } }).then((payload) => apply(set, payload)).catch(() => get().refresh());
		return account;
	},
	resync: async (id) => {
		set({ syncing: true });
		try {
			apply(set, await syncAccount({ data: { id } }));
		} finally {
			set({ syncing: false });
		}
	},
	renameDesk: async (id, name) => {
		apply(set, await renameAccount({ data: {
			id,
			name
		} }));
	},
	removeDesk: async (id) => {
		apply(set, await deleteAccount({ data: { id } }));
		if (get().focusAccountId === id) set({ focusAccountId: "all" });
	},
	addTrade: async (trade) => {
		apply(set, await upsertTrade({ data: trade }));
	},
	updateTrade: async (id, patch) => {
		const current = get().trades.find((t) => t.id === id);
		if (!current) return;
		apply(set, await upsertTrade({ data: {
			...current,
			...patch,
			id
		} }));
	},
	removeTrade: async (id) => {
		apply(set, await removeTrade({ data: { id } }));
	},
	importTrades: async (incoming, mode) => {
		const accountId = get().focusAccountId !== "all" ? get().focusAccountId : get().accounts[0]?.id;
		if (!accountId) return 0;
		const before = get().trades.length;
		apply(set, await importAccountTrades({ data: {
			accountId,
			trades: incoming,
			mode
		} }));
		return Math.max(0, get().trades.length - (mode === "replace" ? 0 : before));
	}
}), {
	name: "duckjournal-v2",
	partialize: (s) => ({
		settings: s.settings,
		focusAccountId: s.focusAccountId
	}),
	onRehydrateStorage: () => () => {
		useJournalStore.setState({ hydrated: false });
	}
}));
function useFocusedTrades() {
	return filterByAccount(useJournalStore((s) => s.trades), useJournalStore((s) => s.focusAccountId));
}
function useBusyAccounts() {
	return useJournalStore((s) => s.accounts.some((a) => a.status === "connecting" || a.status === "syncing"));
}
var useJournalUi = create((set) => ({
	addAccountOpen: false,
	logFillOpen: false,
	selectedId: null,
	chartTradeId: null,
	settingsOpen: false,
	openAddAccount: () => set({ addAccountOpen: true }),
	closeAddAccount: () => set({ addAccountOpen: false }),
	openLogFill: () => set({ logFillOpen: true }),
	closeLogFill: () => set({ logFillOpen: false }),
	select: (id) => set({ selectedId: id }),
	openChart: (id) => set({ chartTradeId: id }),
	closeChart: () => set({ chartTradeId: null }),
	openSettings: () => set({ settingsOpen: true }),
	closeSettings: () => set({ settingsOpen: false })
}));
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-background/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed top-[50%] left-[50%] z-50 grid w-[calc(100%-2rem)] max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-border)] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute top-4 right-4 rounded-sm text-muted-foreground opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-1.5 pr-6", className),
		...props
	});
}
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-xl font-semibold tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-10 w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground shadow-none transition-[box-shadow,border-color] duration-150 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 disabled:cursor-not-allowed disabled:opacity-50", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn("text-xs font-medium tracking-wide text-muted-foreground", className),
	...props
}));
Label.displayName = Root.displayName;
var Sheet = Dialog$1;
var SheetPortal = DialogPortal$1;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-background/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
SheetOverlay.displayName = DialogOverlay$1.displayName;
var SheetContent = import_react.forwardRef(({ className, children, side = "right", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed z-50 flex flex-col gap-4 bg-card shadow-[var(--shadow-border)] transition ease-out data-[state=open]:animate-in data-[state=closed]:animate-out", side === "right" && "inset-y-0 right-0 h-full w-full border-l border-border sm:max-w-md data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right", side === "left" && "inset-y-0 left-0 h-full w-full border-r border-border sm:max-w-sm data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left", side === "bottom" && "inset-x-0 bottom-0 border-t border-border rounded-t-xl data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute top-4 right-4 rounded-sm text-muted-foreground opacity-70 transition-opacity hover:opacity-100",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
SheetContent.displayName = "SheetContent";
function SheetHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-1 px-5 pt-5 pr-12", className),
		...props
	});
}
function SheetFooter({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("mt-auto flex gap-2 border-t border-border px-5 py-4", className),
		...props
	});
}
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-xl font-semibold tracking-tight", className),
	...props
}));
SheetTitle.displayName = DialogTitle$1.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = DialogDescription$1.displayName;
var PLATFORMS = [
	{
		id: "generic",
		name: "Generic CSV",
		blurb: "Date, symbol, side, qty, entry, exit, fees.",
		hint: "Columns: Date, Symbol, Side, Qty, Entry, Exit, Fees, Setup, Notes"
	},
	{
		id: "mt4",
		name: "MetaTrader 4",
		blurb: "Account History → Save as Report, then export CSV.",
		hint: "Ticket, Open Time, Type, Size, Item, Price, Close Time, Profit"
	},
	{
		id: "mt5",
		name: "MetaTrader 5",
		blurb: "History → positions. Export the deal list as CSV.",
		hint: "Time, Symbol, Type, Volume, Price, Profit, Commission"
	},
	{
		id: "tos",
		name: "thinkorswim",
		blurb: "Account statement → Trades tab → Export to file.",
		hint: "Exec Time, Side, Qty, Symbol, Price, Net Price"
	},
	{
		id: "ibkr",
		name: "Interactive Brokers",
		blurb: "Activity Flex / Trades CSV from Account Management.",
		hint: "Symbol, DateTime, Buy/Sell, Quantity, TradePrice, Comm"
	},
	{
		id: "ninjatrader",
		name: "NinjaTrader",
		blurb: "Trade Performance → right click → Export.",
		hint: "Instrument, Action, Quantity, Price, Time"
	},
	{
		id: "tradingview",
		name: "TradingView",
		blurb: "Paper or live trade list → Export to CSV.",
		hint: "Symbol, Side, Qty, Fill Price, Time"
	}
];
function stripBom(text) {
	return text.replace(/^\uFEFF/, "");
}
function parseCsvText(text) {
	const src = stripBom(text).replace(/\r\n/g, "\n").replace(/\r/g, "\n");
	const rows = [];
	let row = [];
	let cell = "";
	let i = 0;
	let quoted = false;
	while (i < src.length) {
		const ch = src[i];
		if (quoted) {
			if (ch === "\"") {
				if (src[i + 1] === "\"") {
					cell += "\"";
					i += 2;
					continue;
				}
				quoted = false;
				i += 1;
				continue;
			}
			cell += ch;
			i += 1;
			continue;
		}
		if (ch === "\"") {
			quoted = true;
			i += 1;
			continue;
		}
		if (ch === ",") {
			row.push(cell.trim());
			cell = "";
			i += 1;
			continue;
		}
		if (ch === "\n") {
			row.push(cell.trim());
			cell = "";
			if (row.some((c) => c.length)) rows.push(row);
			row = [];
			i += 1;
			continue;
		}
		cell += ch;
		i += 1;
	}
	row.push(cell.trim());
	if (row.some((c) => c.length)) rows.push(row);
	return rows;
}
function norm(h) {
	return h.toLowerCase().replace(/[^a-z0-9]+/g, "");
}
function headerMap(headers) {
	const map = /* @__PURE__ */ new Map();
	headers.forEach((h, i) => map.set(norm(h), i));
	return map;
}
function cell(row, map, names) {
	for (const n of names) {
		const i = map.get(norm(n));
		if (i !== void 0 && row[i]) return row[i];
	}
	return "";
}
function parseSide(raw) {
	const s = raw.trim().toLowerCase();
	if ([
		"buy",
		"long",
		"bot",
		"bought",
		"b"
	].includes(s)) return "long";
	if ([
		"sell",
		"short",
		"sold",
		"sht",
		"s"
	].includes(s)) return "short";
	return null;
}
function parseNum(raw) {
	if (!raw) return null;
	const n = Number(raw.replace(/[$,\s]/g, "").replace(/^\((.+)\)$/, "-$1"));
	return Number.isFinite(n) ? n : null;
}
function parseDate(raw) {
	if (!raw) return null;
	const cleaned = raw.replace(/\./g, "-").replace("T", " ");
	const d = new Date(cleaned);
	if (!Number.isNaN(d.getTime())) return d;
	const m = raw.match(/^(\d{4})[.\/-](\d{1,2})[.\/-](\d{1,2})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/);
	if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), Number(m[4] ?? 9), Number(m[5] ?? 0), Number(m[6] ?? 0));
	return null;
}
function detectPlatform(headers) {
	const h = headers.map(norm).join(" ");
	if (h.includes("ticket") && h.includes("opentime")) return "mt4";
	if (h.includes("position") && h.includes("volume")) return "mt5";
	if (h.includes("exectime") || h.includes("poseffect")) return "tos";
	if (h.includes("buy/sell") || h.includes("tradeprice") || h.includes("ibkr")) return "ibkr";
	if (h.includes("instrument") && h.includes("action")) return "ninjatrader";
	if (h.includes("fillprice") || h.includes("ticker") && h.includes("side")) return "tradingview";
	return "generic";
}
function asSetup(raw) {
	const s = raw.trim();
	return SETUPS.includes(s) ? s : "";
}
function toTrade(partial) {
	const inst = INSTRUMENTS[partial.symbol];
	const pnl = partial.pnl !== void 0 && Number.isFinite(partial.pnl) ? partial.pnl : computePnl(partial);
	return {
		...partial,
		id: partial.id ?? crypto.randomUUID(),
		assetClass: inst?.assetClass ?? "stocks",
		pnl,
		tags: partial.tags ?? [],
		notes: partial.notes ?? "",
		setup: partial.setup ?? "",
		grade: partial.grade ?? "",
		emotion: partial.emotion ?? "",
		platform: partial.platform ?? "",
		accountId: partial.accountId ?? ""
	};
}
function parseTradesCsv(text, platform = "auto") {
	const rows = parseCsvText(text);
	const issues = [];
	if (rows.length < 2) return {
		trades: [],
		issues: [{
			row: 0,
			message: "No data rows found."
		}],
		detected: "generic",
		headers: []
	};
	let headerIndex = 0;
	for (let i = 0; i < Math.min(rows.length, 8); i++) {
		const joined = rows[i].map(norm).join(" ");
		if (joined.includes("symbol") || joined.includes("item") || joined.includes("instrument") || joined.includes("ticket")) {
			headerIndex = i;
			break;
		}
	}
	const headers = rows[headerIndex];
	const detected = platform === "auto" ? detectPlatform(headers) : platform;
	const map = headerMap(headers);
	const trades = [];
	rows.slice(headerIndex + 1).forEach((row, idx) => {
		const rowNum = headerIndex + idx + 2;
		try {
			const symbol = (cell(row, map, [
				"symbol",
				"item",
				"instrument",
				"ticker",
				"asset"
			]) || "").toUpperCase().replace(/\s+/g, "");
			if (!symbol || symbol === "BALANCE" || symbol === "CREDIT") return;
			const sideRaw = cell(row, map, [
				"side",
				"type",
				"action",
				"buy/sell",
				"direction",
				"bs"
			]);
			let side = parseSide(sideRaw);
			if (!side) {
				const qtySigned = parseNum(cell(row, map, [
					"qty",
					"quantity",
					"size",
					"volume",
					"lots"
				]));
				if (qtySigned !== null && qtySigned < 0) side = "short";
				else if (qtySigned !== null && qtySigned > 0 && !sideRaw) side = "long";
			}
			if (!side) {
				issues.push({
					row: rowNum,
					message: `Could not read side for ${symbol}.`
				});
				return;
			}
			const qty = Math.abs(parseNum(cell(row, map, [
				"qty",
				"quantity",
				"size",
				"volume",
				"lots"
			])) ?? 0);
			if (!qty) {
				issues.push({
					row: rowNum,
					message: `Missing quantity for ${symbol}.`
				});
				return;
			}
			const entryPrice = parseNum(cell(row, map, [
				"entry",
				"entryprice",
				"openprice",
				"price",
				"tprice",
				"tradeprice",
				"fillprice"
			])) ?? null;
			const exitPrice = parseNum(cell(row, map, [
				"exit",
				"exitprice",
				"closeprice",
				"price2",
				"close"
			])) ?? entryPrice;
			if (entryPrice === null || exitPrice === null) {
				issues.push({
					row: rowNum,
					message: `Missing prices for ${symbol}.`
				});
				return;
			}
			const entryDate = parseDate(cell(row, map, [
				"entryat",
				"opentime",
				"datetime",
				"date",
				"time",
				"exectime",
				"open"
			])) ?? /* @__PURE__ */ new Date();
			const exitDate = parseDate(cell(row, map, [
				"exitat",
				"closetime",
				"closed",
				"exitdate"
			])) ?? entryDate;
			const fees = Math.abs(parseNum(cell(row, map, [
				"fees",
				"commission",
				"comm",
				"commissions",
				"swap"
			])) ?? 0);
			const pnlCell = parseNum(cell(row, map, [
				"pnl",
				"profit",
				"netpnl",
				"amount",
				"pl"
			]));
			const notes = cell(row, map, [
				"notes",
				"comment",
				"comment"
			]);
			const setup = asSetup(cell(row, map, [
				"setup",
				"strategy",
				"play"
			]));
			trades.push(toTrade({
				symbol,
				side,
				qty,
				entryPrice,
				exitPrice,
				entryAt: entryDate.toISOString(),
				exitAt: exitDate.toISOString(),
				fees,
				pnl: pnlCell ?? void 0,
				setup,
				tags: [],
				notes,
				grade: "",
				emotion: "",
				platform: detected === "generic" ? "CSV" : detected.toUpperCase()
			}));
		} catch (err) {
			issues.push({
				row: rowNum,
				message: err instanceof Error ? err.message : "Unreadable row."
			});
		}
	});
	return {
		trades,
		issues,
		detected,
		headers
	};
}
function tradesToCsv(trades) {
	const header = [
		"Date",
		"Symbol",
		"Side",
		"Qty",
		"Entry",
		"Exit",
		"Fees",
		"PnL",
		"Setup",
		"Grade",
		"Notes",
		"EntryAt",
		"ExitAt"
	];
	const lines = trades.map((t) => [
		t.exitAt.slice(0, 10),
		t.symbol,
		t.side,
		t.qty,
		t.entryPrice,
		t.exitPrice,
		t.fees,
		t.pnl,
		t.setup,
		t.grade,
		`"${t.notes.replace(/"/g, "\"\"")}"`,
		t.entryAt,
		t.exitAt
	].join(","));
	return [header.join(","), ...lines].join("\n");
}
function AccountForm({ onDone }) {
	const connectDesk = useJournalStore((s) => s.connectDesk);
	const [name, setName] = (0, import_react.useState)("");
	const [server, setServer] = (0, import_react.useState)("");
	const [username, setUsername] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	async function submit(e) {
		e.preventDefault();
		setError(null);
		setBusy(true);
		try {
			const account = await connectDesk({
				name,
				server,
				username,
				password
			});
			toast(`Connected ${account.name}. Pulling history…`);
			onDone?.();
		} catch (err) {
			const message = err instanceof Error ? err.message : "Could not connect.";
			setError(message.replace(/^Error:\s*/, ""));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "grid gap-4",
		onSubmit: (e) => void submit(e),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "acct-name",
					children: "Account name"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "acct-name",
					value: name,
					onChange: (e) => setName(e.target.value),
					placeholder: "Main futures",
					required: true,
					autoComplete: "off"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "acct-server",
					children: "Server"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "acct-server",
					value: server,
					onChange: (e) => setServer(e.target.value),
					placeholder: "ICMarketsSC-Demo",
					required: true,
					autoComplete: "off"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "acct-user",
					children: "Username"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "acct-user",
					value: username,
					onChange: (e) => setUsername(e.target.value),
					placeholder: "45289103",
					required: true,
					autoComplete: "off"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "acct-pass",
						children: "Investor password"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "acct-pass",
						type: "password",
						value: password,
						onChange: (e) => setPassword(e.target.value),
						placeholder: "Read-only password",
						required: true,
						minLength: 4,
						autoComplete: "new-password"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Investor login is read-only. DuckJournal never places orders."
					})
				]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-loss",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end gap-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: busy,
					children: busy ? "Connecting…" : "Connect"
				})
			})
		]
	});
}
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-24 w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 disabled:cursor-not-allowed disabled:opacity-50", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
var Select = Select$1;
var SelectValue = SelectValue$1;
var SelectTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
	ref,
	className: cn("flex h-10 w-full items-center justify-between rounded-md border border-input bg-secondary px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/60 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4 text-muted-foreground" })
	})]
}));
SelectTrigger.displayName = SelectTrigger$1.displayName;
var SelectContent = import_react.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent$1, {
	ref,
	className: cn("relative z-50 max-h-72 min-w-32 overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-[var(--shadow-border)]", position === "popper" && "data-[side=bottom]:translate-y-1", className),
	position,
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
		className: "p-1",
		children
	})
}) }));
SelectContent.displayName = SelectContent$1.displayName;
var SelectItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
	ref,
	className: cn("relative flex w-full cursor-pointer items-center rounded-md py-2 pr-8 pl-2 text-sm outline-none select-none focus:bg-accent data-disabled:pointer-events-none data-disabled:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute right-2 flex size-4 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
}));
SelectItem.displayName = SelectItem$1.displayName;
function money(value, opts) {
	const digits = opts?.digits ?? 2;
	const abs = Math.abs(value).toLocaleString("en-US", {
		minimumFractionDigits: digits,
		maximumFractionDigits: digits
	});
	if (opts?.sign) {
		if (value > 0) return `+$${abs}`;
		if (value < 0) return `-$${abs}`;
		return `$${abs}`;
	}
	return value < 0 ? `-$${abs}` : `$${abs}`;
}
function pct(value, digits = 1) {
	return `${(value * 100).toFixed(digits)}%`;
}
function formatFull(iso) {
	try {
		return format(parseISO(iso), "MMM d yyyy, HH:mm");
	} catch {
		return iso;
	}
}
function pnlTone(value) {
	if (value > .005) return "win";
	if (value < -.005) return "loss";
	return "flat";
}
function PnlText({ value, className, compact = false, signed = true }) {
	const tone = pnlTone(value);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("tabular", tone === "win" && "text-win", tone === "loss" && "text-loss", tone === "flat" && "text-muted-foreground", className),
		children: compact ? `${value > 0 ? "+" : value < 0 ? "-" : ""}$${Math.abs(value).toLocaleString("en-US", { maximumFractionDigits: 0 })}` : money(value, { sign: signed })
	});
}
function toLocal(iso) {
	const d = iso ? new Date(iso) : /* @__PURE__ */ new Date();
	const pad = (n) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function draftFromTrade(t) {
	return {
		symbol: t?.symbol ?? "ES",
		side: t?.side ?? "long",
		qty: t?.qty !== void 0 ? String(t.qty) : "1",
		entryPrice: t?.entryPrice !== void 0 ? String(t.entryPrice) : "",
		exitPrice: t?.exitPrice !== void 0 ? String(t.exitPrice) : "",
		entryAt: toLocal(t?.entryAt),
		exitAt: toLocal(t?.exitAt),
		fees: t?.fees !== void 0 ? String(t.fees) : "4.60",
		setup: t?.setup ?? "ORB",
		grade: t?.grade ?? "B",
		emotion: t?.emotion ?? "calm",
		notes: t?.notes ?? ""
	};
}
function tradeFromDraft(draft, id, accountId = "") {
	const qty = Number(draft.qty) || 0;
	const entryPrice = Number(draft.entryPrice) || 0;
	const exitPrice = Number(draft.exitPrice) || 0;
	const fees = Number(draft.fees) || 0;
	const inst = INSTRUMENTS[draft.symbol];
	return {
		id: id ?? crypto.randomUUID(),
		symbol: draft.symbol,
		assetClass: inst?.assetClass ?? "stocks",
		side: draft.side,
		qty,
		entryPrice,
		exitPrice,
		entryAt: new Date(draft.entryAt).toISOString(),
		exitAt: new Date(draft.exitAt).toISOString(),
		fees,
		pnl: computePnl({
			symbol: draft.symbol,
			side: draft.side,
			qty,
			entryPrice,
			exitPrice,
			fees
		}),
		setup: draft.setup,
		tags: [],
		notes: draft.notes,
		grade: draft.grade,
		emotion: draft.emotion,
		platform: "Manual",
		accountId
	};
}
function TradeForm({ initial, submitLabel, onSubmit, onCancel }) {
	const [draft, setDraft] = (0, import_react.useState)(() => draftFromTrade(initial));
	const preview = (0, import_react.useMemo)(() => {
		const qty = Number(draft.qty) || 0;
		const entryPrice = Number(draft.entryPrice) || 0;
		const exitPrice = Number(draft.exitPrice) || 0;
		const fees = Number(draft.fees) || 0;
		if (!qty || !entryPrice || !exitPrice) return null;
		return computePnl({
			symbol: draft.symbol,
			side: draft.side,
			qty,
			entryPrice,
			exitPrice,
			fees
		});
	}, [draft]);
	function patch(key, value) {
		setDraft((d) => ({
			...d,
			[key]: value
		}));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "grid gap-4",
		onSubmit: (e) => {
			e.preventDefault();
			onSubmit(tradeFromDraft(draft, initial?.id, initial?.accountId));
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "symbol",
							children: "Symbol"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: draft.symbol,
							onValueChange: (v) => patch("symbol", v),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								id: "symbol",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: SYMBOLS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: s,
								children: s
							}, s)) })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "side",
							children: "Side"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: draft.side,
							onValueChange: (v) => patch("side", v),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								id: "side",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "long",
								children: "Long"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "short",
								children: "Short"
							})] })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "qty",
							children: "Size"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "qty",
							inputMode: "decimal",
							value: draft.qty,
							onChange: (e) => patch("qty", e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "fees",
							children: "Fees"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "fees",
							inputMode: "decimal",
							value: draft.fees,
							onChange: (e) => patch("fees", e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "entry",
							children: "Entry"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "entry",
							inputMode: "decimal",
							value: draft.entryPrice,
							onChange: (e) => patch("entryPrice", e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "exit",
							children: "Exit"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "exit",
							inputMode: "decimal",
							value: draft.exitPrice,
							onChange: (e) => patch("exitPrice", e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "entryAt",
							children: "Opened"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "entryAt",
							type: "datetime-local",
							value: draft.entryAt,
							onChange: (e) => patch("entryAt", e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "exitAt",
							children: "Closed"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "exitAt",
							type: "datetime-local",
							value: draft.exitAt,
							onChange: (e) => patch("exitAt", e.target.value),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Setup" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: draft.setup || "none",
							onValueChange: (v) => patch("setup", v === "none" ? "" : v),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "none",
								children: "Untagged"
							}), SETUPS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: s,
								children: s
							}, s))] })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Process grade" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: draft.grade || "none",
							onValueChange: (v) => patch("grade", v === "none" ? "" : v),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
								"A",
								"B",
								"C",
								"D",
								"F"
							].map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: g,
								children: g
							}, g)) })]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "notes",
					children: "Notes"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					id: "notes",
					placeholder: "What did you see? Did you follow the plan?",
					value: draft.notes,
					onChange: (e) => patch("notes", e.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-sm text-muted-foreground",
					children: [
						"Net",
						" ",
						preview === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "—"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PnlText, {
							value: preview,
							className: "font-medium"
						}),
						preview !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "sr-only",
							children: money(preview, { sign: true })
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [onCancel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						onClick: onCancel,
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: submitLabel
					})]
				})]
			})
		]
	});
}
function AddAccountDialog() {
	const open = useJournalUi((s) => s.addAccountOpen);
	const close = useJournalUi((s) => s.closeAddAccount);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (v) => v ? null : close(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add trading account" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Investor login on the terminal server. After connect, history downloads in the background." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountForm, { onDone: close })] })
	});
}
function AddTradeDialog() {
	const open = useJournalUi((s) => s.logFillOpen);
	const close = useJournalUi((s) => s.closeLogFill);
	const addTrade = useJournalStore((s) => s.addTrade);
	const accounts = useJournalStore((s) => s.accounts);
	const focus = useJournalStore((s) => s.focusAccountId);
	const accountId = focus !== "all" ? focus : accounts[0]?.id;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (v) => v ? null : close(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[90dvh] overflow-y-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Log a fill" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Manual entry when the export is still on the way." })] }), accountId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TradeForm, {
				submitLabel: "Add fill",
				initial: { accountId },
				onCancel: close,
				onSubmit: (trade) => {
					addTrade({
						...trade,
						accountId
					});
					close();
					toast(`Logged ${trade.symbol}`);
				}
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Connect an account first."
			})]
		})
	});
}
function SettingsSheet() {
	const open = useJournalUi((s) => s.settingsOpen);
	const close = useJournalUi((s) => s.closeSettings);
	const settings = useJournalStore((s) => s.settings);
	const setSettings = useJournalStore((s) => s.setSettings);
	const trades = useJournalStore((s) => s.trades);
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open,
		onOpenChange: (v) => v ? null : close(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
			side: "right",
			className: "w-full sm:max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, { children: "Desk settings" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-5 px-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "equity",
							children: "Starting equity"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "equity",
							inputMode: "decimal",
							value: settings.startingEquity,
							onChange: (e) => setSettings({ startingEquity: Number(e.target.value) || 0 })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2 border-t border-border pt-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-wide text-muted-foreground uppercase",
							children: "Book"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: exportCsv,
							children: "Export CSV"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "pb-6 text-xs leading-relaxed text-muted-foreground",
						children: "Accounts live in the journal database. Investor passwords stay on the server and are never shown again after connect."
					})
				]
			})]
		})
	});
}
var badgeVariants = cva("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium tracking-wide", {
	variants: { variant: {
		default: "border-transparent bg-secondary text-secondary-foreground",
		outline: "border-border text-muted-foreground",
		win: "border-transparent bg-win/15 text-win",
		loss: "border-transparent bg-loss/15 text-loss",
		paper: "border-transparent bg-paper/10 text-paper"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
function mulberry32(seed) {
	let a = seed >>> 0;
	return () => {
		a += 1831565813;
		let t = a;
		t = Math.imul(t ^ t >>> 15, t | 1);
		t ^= t + Math.imul(t ^ t >>> 7, t | 61);
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function hash(text) {
	let h = 2166136261;
	for (let i = 0; i < text.length; i += 1) {
		h ^= text.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}
function buildTradeChart(trade) {
	const entryAt = new Date(trade.entryAt).getTime();
	const exitAt = new Date(trade.exitAt).getTime();
	const hold = Math.max(exitAt - entryAt, 48e4);
	const pre = entryAt - hold * .45;
	const post = exitAt + hold * .3;
	const rng = mulberry32(hash(trade.id));
	const decimals = INSTRUMENTS[trade.symbol]?.decimals ?? 2;
	const noise = Math.max(Math.abs(trade.exitPrice - trade.entryPrice) * .28, trade.entryPrice * .0012);
	const n = 56;
	const points = [];
	for (let i = 0; i < n; i += 1) {
		const t = pre + (post - pre) * i / 55;
		let price;
		if (t <= entryAt) {
			const u = (t - pre) / Math.max(entryAt - pre, 1);
			price = trade.entryPrice + (rng() - .48) * noise * (1 - u) + Math.sin(i / 3) * noise * .15 * (1 - u);
		} else if (t >= exitAt) {
			const u = (t - exitAt) / Math.max(post - exitAt, 1);
			price = trade.exitPrice + (rng() - .5) * noise * .45 * u;
		} else {
			const u = (t - entryAt) / Math.max(exitAt - entryAt, 1);
			const ease = u * u * (3 - 2 * u);
			price = trade.entryPrice + (trade.exitPrice - trade.entryPrice) * ease + Math.sin(i * .7) * noise * .55 * (1 - Math.abs(u - .5) * 2);
		}
		points.push({
			t,
			price: Number(price.toFixed(decimals))
		});
	}
	const pin = (time, price, mark) => {
		const idx = points.reduce((best, p, i) => Math.abs(p.t - time) < Math.abs(points[best].t - time) ? i : best, 0);
		points[idx] = {
			t: time,
			price,
			mark
		};
	};
	pin(entryAt, trade.entryPrice, "entry");
	pin(exitAt, trade.exitPrice, "exit");
	return points.sort((a, b) => a.t - b.t);
}
function ClientOnly({ children, fallback = null }) {
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setMounted(true), []);
	if (!mounted) return fallback;
	return children;
}
function TradeChartDialog() {
	const chartTradeId = useJournalUi((s) => s.chartTradeId);
	const closeChart = useJournalUi((s) => s.closeChart);
	const trade = useJournalStore((s) => s.trades.find((t) => t.id === chartTradeId));
	const account = useJournalStore((s) => s.accounts.find((a) => a.id === trade?.accountId));
	const points = trade ? buildTradeChart(trade) : [];
	const entry = points.find((p) => p.mark === "entry");
	const exit = points.find((p) => p.mark === "exit");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: Boolean(chartTradeId),
		onOpenChange: (v) => v ? null : closeChart(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			className: "max-w-2xl",
			children: trade ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "flex flex-wrap items-baseline gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: trade.symbol }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PnlText, {
						value: trade.pnl,
						className: "font-sans text-lg"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: trade.side === "long" ? "win" : "loss",
							className: "capitalize",
							children: trade.side
						}),
						account ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							children: account.name
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted-foreground",
							children: [
								format(new Date(trade.entryAt), "MMM d HH:mm"),
								" →",
								" ",
								format(new Date(trade.exitAt), "HH:mm")
							]
						})
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-72",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
							data: points,
							margin: {
								top: 12,
								right: 12,
								left: 0,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "var(--color-border)",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "t",
									type: "number",
									domain: ["dataMin", "dataMax"],
									tickFormatter: (v) => format(v, "HH:mm"),
									tick: {
										fill: "var(--color-muted-foreground)",
										fontSize: 11
									},
									axisLine: false,
									tickLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									domain: ["auto", "auto"],
									tick: {
										fill: "var(--color-muted-foreground)",
										fontSize: 11
									},
									axisLine: false,
									tickLine: false,
									width: 64
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: ({ active, payload }) => {
									if (!active || !payload?.length) return null;
									const p = payload[0].payload;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-md border border-border bg-popover px-3 py-2 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-muted-foreground",
											children: format(p.t, "MMM d HH:mm")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "tabular",
											children: p.price
										})]
									});
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									type: "monotone",
									dataKey: "price",
									stroke: "var(--color-primary)",
									strokeWidth: 1.6,
									dot: false,
									isAnimationActive: false
								}),
								entry ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
									y: entry.price,
									stroke: "var(--color-win)",
									strokeDasharray: "4 4"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceDot, {
									x: entry.t,
									y: entry.price,
									r: 5,
									fill: "var(--color-win)",
									stroke: "none"
								})] }) : null,
								exit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
									y: exit.price,
									stroke: "var(--color-loss)",
									strokeDasharray: "4 4"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceDot, {
									x: exit.t,
									y: exit.price,
									r: 5,
									fill: trade.pnl >= 0 ? "var(--color-win)" : "var(--color-loss)",
									stroke: "none"
								})] }) : null
							]
						})
					}) })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [
						"Entry ",
						trade.entryPrice,
						" · Exit ",
						trade.exitPrice,
						" · reconstructed from the fill."
					]
				})
			] }) : null
		})
	});
}
var ScrollArea = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root$1, {
	ref,
	className: cn("relative overflow-hidden", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Viewport, {
		className: "size-full rounded-[inherit]",
		children
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scrollbar, {
		orientation: "vertical",
		className: "flex w-2.5 touch-none p-px select-none",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thumb, { className: "relative flex-1 rounded-full bg-border" })
	})]
}));
ScrollArea.displayName = Root$1.displayName;
function TradeDetail() {
	const selectedId = useJournalUi((s) => s.selectedId);
	const select = useJournalUi((s) => s.select);
	const openChart = useJournalUi((s) => s.openChart);
	const trade = useJournalStore((s) => s.trades.find((t) => t.id === selectedId));
	const account = useJournalStore((s) => s.accounts.find((a) => a.id === trade?.accountId));
	const updateTrade = useJournalStore((s) => s.updateTrade);
	const removeTrade = useJournalStore((s) => s.removeTrade);
	const [editing, setEditing] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open: Boolean(selectedId),
		onOpenChange: (open) => {
			if (!open) {
				select(null);
				setEditing(false);
			}
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
			className: "w-full sm:max-w-md",
			children: trade ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetTitle, {
					className: "flex items-baseline gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: trade.symbol }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PnlText, {
						value: trade.pnl,
						className: "font-sans text-lg"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-1.5 pt-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: trade.side === "long" ? "win" : "loss",
							children: trade.side === "long" ? "Long" : "Short"
						}),
						trade.setup ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							children: trade.setup
						}) : null,
						trade.grade ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "paper",
							children: ["Grade ", trade.grade]
						}) : null,
						account ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							children: account.name
						}) : null
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
					className: "min-h-0 flex-1 px-5",
					children: editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TradeForm, {
						initial: trade,
						submitLabel: "Save fill",
						onCancel: () => setEditing(false),
						onSubmit: (next) => {
							updateTrade(trade.id, next);
							setEditing(false);
							toast("Fill updated");
						}
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "grid grid-cols-2 gap-x-4 gap-y-4 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs tracking-wide text-muted-foreground uppercase",
								children: "Instrument"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1",
								children: INSTRUMENTS[trade.symbol]?.name ?? trade.symbol
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs tracking-wide text-muted-foreground uppercase",
								children: "Size"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 tabular",
								children: trade.qty
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs tracking-wide text-muted-foreground uppercase",
								children: "Entry"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 tabular",
								children: trade.entryPrice
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs tracking-wide text-muted-foreground uppercase",
								children: "Exit"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 tabular",
								children: trade.exitPrice
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs tracking-wide text-muted-foreground uppercase",
								children: "Opened"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1",
								children: formatFull(trade.entryAt)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs tracking-wide text-muted-foreground uppercase",
								children: "Closed"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1",
								children: formatFull(trade.exitAt)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs tracking-wide text-muted-foreground uppercase",
								children: "Fees"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
								className: "mt-1 tabular",
								children: ["$", trade.fees.toFixed(2)]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs tracking-wide text-muted-foreground uppercase",
								children: "Emotion"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 capitalize",
								children: trade.emotion || "—"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-xs tracking-wide text-muted-foreground uppercase",
									children: "Notes"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "mt-1 whitespace-pre-wrap text-foreground/90",
									children: trade.notes || "No notes on this fill."
								})]
							})
						]
					})
				}),
				!editing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetFooter, {
					className: "flex-col gap-2 sm:flex-col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "w-full",
						onClick: () => openChart(trade.id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCandlestick, { className: "size-4" }), "View on chart"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex w-full gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "flex-1",
							onClick: () => setEditing(true),
							children: "Edit"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "destructive",
							className: "flex-1",
							onClick: () => {
								removeTrade(trade.id);
								select(null);
								toast("Fill removed");
							},
							children: "Delete"
						})]
					})]
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, { children: "Fill" }) })
		})
	});
}
var NAV = [
	{
		to: "/",
		label: "Overview",
		icon: LayoutGrid
	},
	{
		to: "/trades",
		label: "Fills",
		icon: BookOpen
	},
	{
		to: "/calendar",
		label: "Calendar",
		icon: CalendarDays
	},
	{
		to: "/analytics",
		label: "Analytics",
		icon: ChartColumn
	},
	{
		to: "/accounts",
		label: "Accounts",
		icon: Wallet
	}
];
var DESKTOP_NAV = [...NAV, {
	to: "/import",
	label: "Import",
	icon: Upload
}];
function AppShell({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const refresh = useJournalStore((s) => s.refresh);
	const accounts = useJournalStore((s) => s.accounts);
	const openAdd = useJournalUi((s) => s.openAddAccount);
	const openSettings = useJournalUi((s) => s.openSettings);
	const busy = useBusyAccounts();
	(0, import_react.useEffect)(() => {
		refresh();
	}, [refresh]);
	(0, import_react.useEffect)(() => {
		if (!busy) return;
		const id = window.setInterval(() => {
			refresh();
		}, 1200);
		return () => window.clearInterval(id);
	}, [busy, refresh]);
	const deskLabel = accounts.length === 0 ? "No accounts" : accounts.length === 1 ? accounts[0].name : `${accounts.length} accounts`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "fixed inset-y-0 left-0 z-30 hidden w-56 flex-col border-r border-border bg-card px-4 py-6 lg:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "mb-8 px-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xl font-semibold leading-none tracking-tight",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-primary",
								children: "Duck"
							}), "Journal"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-xs text-muted-foreground",
							children: deskLabel
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex flex-1 flex-col gap-1",
						children: DESKTOP_NAV.map((item) => {
							const active = pathname === item.to;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								className: cn("flex h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors duration-150", active ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-4" }), item.label]
							}, item.to);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: openAdd,
							className: "w-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Add account"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							className: "w-full justify-start",
							onClick: openSettings,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-4" }), "Settings"]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-sm lg:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "text-lg font-semibold tracking-tight",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-primary",
						children: "Duck"
					}), "Journal"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						onClick: openSettings,
						"aria-label": "Settings",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						onClick: openAdd,
						"aria-label": "Add account",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "px-4 pt-6 pb-28 lg:ml-56 lg:px-8 lg:pt-8 lg:pb-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-6xl",
					children
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 px-2 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-sm lg:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid grid-cols-5",
					children: NAV.map((item) => {
						const active = pathname === item.to;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: cn("flex h-12 flex-col items-center justify-center gap-0.5 text-[10px] tracking-wide uppercase", active ? "text-foreground" : "text-muted-foreground"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-4" }), item.label]
						}) }, item.to);
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddAccountDialog, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddTradeDialog, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsSheet, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TradeDetail, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TradeChartDialog, {})
		]
	});
}
//#endregion
export { useJournalUi as S, parseTradesCsv as _, Input as a, useFocusedTrades as b, RANGE_OPTIONS as c, SelectItem as d, SelectTrigger as f, money as g, filterByRange as h, ClientOnly as i, Select as l, cn as m, Badge as n, PLATFORMS as o, SelectValue as p, Button as r, PnlText as s, AppShell as t, SelectContent as u, pct as v, useJournalStore as x, tradesToCsv as y };
