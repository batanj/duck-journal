import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as SYMBOLS, i as SETUPS } from "./types-GL5ccc67.mjs";
import { l as Plus, s as Search } from "../_libs/lucide-react.mjs";
import { a as format } from "../_libs/date-fns.mjs";
import { S as useJournalUi, a as Input, b as useFocusedTrades, d as SelectItem, f as SelectTrigger, l as Select, n as Badge, p as SelectValue, r as Button, s as PnlText, t as AppShell, u as SelectContent } from "./app-shell-BIAHNqug.mjs";
import { t as AccountFocus } from "./account-focus-ZXuU57WI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/trades-BIF_5lFL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TradesPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TradesView, {}) });
}
function TradesView() {
	const trades = useFocusedTrades();
	const select = useJournalUi((s) => s.select);
	const openLogFill = useJournalUi((s) => s.openLogFill);
	const [q, setQ] = (0, import_react.useState)("");
	const [symbol, setSymbol] = (0, import_react.useState)("all");
	const [side, setSide] = (0, import_react.useState)("all");
	const [setup, setSetup] = (0, import_react.useState)("all");
	const rows = (0, import_react.useMemo)(() => {
		const query = q.trim().toLowerCase();
		return [...trades].filter((t) => symbol === "all" ? true : t.symbol === symbol).filter((t) => side === "all" ? true : t.side === side).filter((t) => setup === "all" ? true : t.setup === setup).filter((t) => {
			if (!query) return true;
			return t.symbol.toLowerCase().includes(query) || t.notes.toLowerCase().includes(query) || t.setup.toLowerCase().includes(query) || t.tags.some((tag) => tag.includes(query));
		}).sort((a, b) => +new Date(b.exitAt) - +new Date(a.exitAt));
	}, [
		trades,
		q,
		symbol,
		side,
		setup
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase",
					children: [
						rows.length,
						" of ",
						trades.length
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 text-4xl font-semibold tracking-tight",
					children: "Fills"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountFocus, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: openLogFill,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Log fill"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative sm:col-span-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "Search notes, tags",
							className: "pl-9"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: symbol,
						onValueChange: setSymbol,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Symbol" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All symbols"
						}), SYMBOLS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: s,
							children: s
						}, s))] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: side,
						onValueChange: (v) => setSide(v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Side" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								children: "Long & short"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "long",
								children: "Long"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "short",
								children: "Short"
							})
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: setup,
						onValueChange: setSetup,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Setup" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All setups"
						}), SETUPS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: s,
							children: s
						}, s))] })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)] md:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "text-xs tracking-wide text-muted-foreground uppercase",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-left font-medium",
									children: "Closed"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-left font-medium",
									children: "Symbol"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-left font-medium",
									children: "Side"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-right font-medium",
									children: "Size"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-left font-medium",
									children: "Setup"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-right font-medium",
									children: "P&L"
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [rows.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "cursor-pointer border-b border-border last:border-0 hover:bg-accent/40",
						onClick: () => select(t.id),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-muted-foreground",
								children: format(new Date(t.exitAt), "MMM d, HH:mm")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 font-medium",
								children: t.symbol
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: t.side === "long" ? "win" : "loss",
									className: "capitalize",
									children: t.side
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-right tabular",
								children: t.qty
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-muted-foreground",
								children: t.setup || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PnlText, {
									value: t.pnl,
									className: "font-medium"
								})
							})
						]
					}, t.id)), rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 6,
						className: "px-4 py-10 text-center text-muted-foreground",
						children: "No fills match those filters."
					}) })] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-2 md:hidden",
				children: rows.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => select(t.id),
					className: "flex w-full items-center gap-3 rounded-xl bg-card p-4 text-left shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-medium",
							children: [
								t.symbol,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground capitalize",
									children: ["· ", t.side]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "truncate text-xs text-muted-foreground",
							children: [
								format(new Date(t.exitAt), "MMM d"),
								" · ",
								t.setup || "untagged"
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PnlText, {
						value: t.pnl,
						className: "text-sm font-medium"
					})]
				}) }, t.id))
			})
		]
	});
}
//#endregion
export { TradesPage as component };
