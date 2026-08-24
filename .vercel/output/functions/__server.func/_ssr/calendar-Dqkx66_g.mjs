import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { f as ChevronRight, p as ChevronLeft } from "../_libs/lucide-react.mjs";
import { a as format, c as startOfMonth, f as startOfWeek, i as isSameMonth, l as eachDayOfInterval, o as endOfWeek, p as addMonths, t as subMonths, u as endOfMonth } from "../_libs/date-fns.mjs";
import { S as useJournalUi, b as useFocusedTrades, m as cn, r as Button, s as PnlText, t as AppShell } from "./app-shell-BIAHNqug.mjs";
import { n as Surface, t as SectionLabel } from "./surface-DsYwUmlw.mjs";
import { t as AccountFocus } from "./account-focus-ZXuU57WI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/calendar-Dqkx66_g.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cellMoney(n) {
	const sign = n > 0 ? "+" : n < 0 ? "-" : "";
	const abs = Math.abs(n);
	if (abs >= 1e3) return `${sign}${(abs / 1e3).toFixed(1)}k`;
	return `${sign}${Math.round(abs)}`;
}
function CalendarPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarView, {}) });
}
function CalendarView() {
	const trades = useFocusedTrades();
	const select = useJournalUi((s) => s.select);
	const [cursor, setCursor] = (0, import_react.useState)(() => startOfMonth(/* @__PURE__ */ new Date()));
	const [picked, setPicked] = (0, import_react.useState)(null);
	const byDay = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const t of trades) {
			const key = format(new Date(t.exitAt), "yyyy-MM-dd");
			const prev = map.get(key) ?? {
				pnl: 0,
				trades: []
			};
			prev.pnl += t.pnl;
			prev.trades.push(t);
			map.set(key, prev);
		}
		return map;
	}, [trades]);
	const days = eachDayOfInterval({
		start: startOfWeek(startOfMonth(cursor), { weekStartsOn: 0 }),
		end: endOfWeek(endOfMonth(cursor), { weekStartsOn: 0 })
	});
	const monthPnl = [...byDay.entries()].filter(([k]) => k.startsWith(format(cursor, "yyyy-MM"))).reduce((s, [, v]) => s + v.pnl, 0);
	const pickedDay = picked ? byDay.get(picked) : null;
	const intensities = [...byDay.values()].map((v) => Math.abs(v.pnl));
	const maxAbs = Math.max(400, ...intensities, 1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase",
						children: "Daily P&L"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 text-4xl font-semibold tracking-tight",
						children: format(cursor, "MMMM yyyy")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: ["Month net ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PnlText, {
							value: monthPnl,
							className: "font-medium"
						})]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountFocus, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "outline",
							"aria-label": "Previous month",
							onClick: () => setCursor((d) => subMonths(d, 1)),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "outline",
							"aria-label": "Next month",
							onClick: () => setCursor((d) => addMonths(d, 1)),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Surface, {
				className: "p-3 sm:p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 grid grid-cols-7 text-center text-xs tracking-wide text-muted-foreground uppercase",
					children: [
						"Sun",
						"Mon",
						"Tue",
						"Wed",
						"Thu",
						"Fri",
						"Sat"
					].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "py-2",
						children: d
					}, d))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-7 gap-1",
					children: days.map((day) => {
						const key = format(day, "yyyy-MM-dd");
						const rec = byDay.get(key);
						const inMonth = isSameMonth(day, cursor);
						const intensity = rec ? Math.min(1, Math.abs(rec.pnl) / maxAbs) : 0;
						const win = (rec?.pnl ?? 0) >= 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: !rec,
							onClick: () => setPicked(key),
							className: cn("relative flex min-h-14 flex-col items-start overflow-hidden rounded-md p-1.5 text-left transition-colors duration-150 sm:min-h-20 sm:p-2", inMonth ? "text-foreground" : "text-muted-foreground/40", rec ? "hover:ring-1 hover:ring-foreground/30" : "cursor-default", picked === key && "ring-1 ring-foreground/80"),
							style: rec ? { backgroundColor: win ? `color-mix(in oklab, var(--win) ${8 + intensity * 28}%, transparent)` : `color-mix(in oklab, var(--loss) ${8 + intensity * 28}%, transparent)` } : void 0,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs tabular",
								children: format(day, "d")
							}), rec ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("mt-auto hidden whitespace-nowrap text-xs font-medium leading-none tabular sm:block", rec.pnl >= 0 ? "text-win" : "text-loss"),
								children: cellMoney(rec.pnl)
							}) : null]
						}, key);
					})
				})]
			}),
			picked && pickedDay ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Surface, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: format(new Date(picked), "EEEE, d MMMM") }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mb-4 text-sm text-muted-foreground",
					children: [
						pickedDay.trades.length,
						" fill",
						pickedDay.trades.length === 1 ? "" : "s",
						" · net",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PnlText, { value: pickedDay.pnl })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border",
					children: pickedDay.trades.slice().sort((a, b) => +new Date(a.exitAt) - +new Date(b.exitAt)).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => select(t.id),
						className: "flex w-full items-center gap-3 py-3 text-left hover:bg-accent/40",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-16 font-medium",
								children: t.symbol
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground capitalize",
								children: t.side
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden flex-1 truncate text-sm text-muted-foreground sm:block",
								children: t.setup || t.notes
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PnlText, {
								value: t.pnl,
								className: "ml-auto text-sm"
							})
						]
					}) }, t.id))
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Select a day with fills to review the tape."
			})
		]
	});
}
//#endregion
export { CalendarPage as component };
