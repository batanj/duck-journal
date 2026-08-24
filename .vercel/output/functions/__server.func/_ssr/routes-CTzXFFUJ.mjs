import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as format } from "../_libs/date-fns.mjs";
import { S as useJournalUi, c as RANGE_OPTIONS, g as money, h as filterByRange, i as ClientOnly, m as cn, n as Badge, r as Button, s as PnlText, t as AppShell, v as pct, x as useJournalStore } from "./app-shell-BIAHNqug.mjs";
import { n as Surface, t as SectionLabel } from "./surface-DsYwUmlw.mjs";
import { i as computeStats, n as EquityChart, t as DailyBarChart } from "./stats-D2WHFcwC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CTzXFFUJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dashboard, {}) });
}
function Dashboard() {
	const trades = useJournalStore((s) => s.trades);
	const settings = useJournalStore((s) => s.settings);
	const openAdd = useJournalUi((s) => s.openAddAccount);
	const accounts = useJournalStore((s) => s.accounts);
	const select = useJournalUi((s) => s.select);
	const [range, setRange] = (0, import_react.useState)("all");
	const scoped = (0, import_react.useMemo)(() => filterByRange(trades, range), [trades, range]);
	const stats = (0, import_react.useMemo)(() => computeStats(scoped, settings.startingEquity), [scoped, settings.startingEquity]);
	const recent = (0, import_react.useMemo)(() => [...scoped].sort((a, b) => +new Date(b.exitAt) - +new Date(a.exitAt)).slice(0, 6), [scoped]);
	if (trades.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-lg flex-col items-start gap-5 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-4xl font-semibold tracking-tight",
				children: "No fills yet"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: "Connect a terminal account to pull history, or import a CSV from MetaTrader, thinkorswim, or NinjaTrader."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: openAdd,
					children: "Add account"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/import",
						children: "Import history"
					})
				})]
			})
		]
	});
	const pf = !Number.isFinite(stats.profitFactor) ? "∞" : stats.profitFactor.toFixed(2);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "stagger-in grid gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase",
						children: format(/* @__PURE__ */ new Date(), "EEEE, d MMMM yyyy")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 text-4xl font-semibold tracking-tight sm:text-5xl",
						children: "The book"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 max-w-xl text-sm text-muted-foreground",
						children: [
							"All accounts · ",
							accounts.length,
							" desk",
							accounts.length === 1 ? "" : "s",
							" · ",
							stats.count,
							" ",
							"fills · started from ",
							money(settings.startingEquity, { digits: 0 })
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1 rounded-lg bg-secondary p-1",
					children: RANGE_OPTIONS.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setRange(opt.id),
						className: cn("h-9 rounded-md px-3 text-sm transition-colors duration-150", range === opt.id ? "bg-card text-foreground shadow-[var(--shadow-border)]" : "text-muted-foreground hover:text-foreground"),
						children: opt.label
					}, opt.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Surface, {
				className: "bg-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Net P&L" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-5xl font-semibold tracking-tight sm:text-6xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PnlText, {
							value: stats.netPnl,
							className: "font-semibold"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: [
							pct(stats.returnPct),
							" on starting equity · ending ",
							money(stats.endingEquity, { digits: 0 })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Win rate",
								value: pct(stats.winRate)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Profit factor",
								value: pf
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Expectancy",
								value: money(stats.expectancy, { sign: true }),
								tone: stats.expectancy
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Max drawdown",
								value: money(stats.maxDrawdown, { digits: 0 }),
								muted: true
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Surface, {
					className: "lg:col-span-3 h-80",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Equity" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-60",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, {
							fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full rounded-md bg-muted" }),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EquityChart, { data: stats.equityCurve })
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Surface, {
					className: "lg:col-span-2 h-80",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Daily P&L" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-60",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, {
							fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full rounded-md bg-muted" }),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DailyBarChart, { data: stats.daily })
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Surface, {
					className: "lg:col-span-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Recent fills" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/trades",
							className: "text-xs text-muted-foreground hover:text-foreground",
							children: "View all"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-border",
						children: recent.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => select(t.id),
							className: "flex w-full items-center gap-3 py-3 text-left transition-colors duration-150 hover:bg-accent/40",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "w-16",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium",
										children: t.symbol
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: format(new Date(t.exitAt), "MMM d")
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: t.side === "long" ? "win" : "loss",
									className: "capitalize",
									children: t.side
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "hidden flex-1 truncate text-sm text-muted-foreground sm:block",
									children: t.setup || t.notes || "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PnlText, {
									value: t.pnl,
									className: "ml-auto text-sm font-medium"
								})
							]
						}) }, t.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Surface, {
					className: "lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "By setup" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid gap-3",
						children: stats.bySetup.slice(0, 6).map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "grid grid-cols-[1fr_auto] items-baseline gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm",
								children: row.key
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									row.trades,
									" fills · ",
									pct(row.winRate, 0),
									" wins"
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PnlText, {
								value: row.pnl,
								className: "text-sm"
							})]
						}, row.key))
					})]
				})]
			})
		]
	});
}
function Stat({ label, value, tone, muted }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-xs tracking-wide text-muted-foreground uppercase",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: cn("mt-1 font-medium tabular", muted && "text-foreground", tone !== void 0 && tone > 0 && "text-win", tone !== void 0 && tone < 0 && "text-loss"),
		children: value
	})] });
}
//#endregion
export { Home as component };
