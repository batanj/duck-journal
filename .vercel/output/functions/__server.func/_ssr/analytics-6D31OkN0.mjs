import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { b as useFocusedTrades, g as money, i as ClientOnly, s as PnlText, t as AppShell, v as pct, x as useJournalStore } from "./app-shell-BIAHNqug.mjs";
import { n as Surface, t as SectionLabel } from "./surface-DsYwUmlw.mjs";
import { t as AccountFocus } from "./account-focus-ZXuU57WI.mjs";
import { i as computeStats, r as GroupBarChart } from "./stats-D2WHFcwC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analytics-6D31OkN0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AnalyticsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnalyticsView, {}) });
}
function AnalyticsView() {
	const trades = useFocusedTrades();
	const startingEquity = useJournalStore((s) => s.settings.startingEquity);
	const stats = (0, import_react.useMemo)(() => computeStats(trades, startingEquity), [trades, startingEquity]);
	const byWeekday = [
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri"
	].map((k) => stats.byWeekday.find((r) => r.key === k)).filter((r) => Boolean(r));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase",
						children: "Process & edge"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 text-4xl font-semibold tracking-tight",
						children: "Analytics"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-xl text-sm text-muted-foreground",
						children: "Where the money actually came from — not the story you told yourself at the close."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountFocus, {})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Avg win",
						value: money(stats.avgWin)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Avg loss",
						value: money(stats.avgLoss)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Current streak",
						value: stats.currentStreak === 0 ? "—" : stats.currentStreak > 0 ? `${stats.currentStreak} wins` : `${Math.abs(stats.currentStreak)} losses`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Best / worst",
						value: `${money(stats.maxWin, {
							sign: true,
							digits: 0
						})} / ${money(stats.maxLoss, { digits: 0 })}`
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Surface, {
					className: "h-72",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "By symbol" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-52",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, {
							fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full rounded-md bg-muted" }),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GroupBarChart, { data: stats.bySymbol })
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Surface, {
					className: "h-72",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "By weekday" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-52",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, {
							fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full rounded-md bg-muted" }),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GroupBarChart, { data: byWeekday })
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GroupTable, {
					title: "Setups",
					rows: stats.bySetup
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GroupTable, {
					title: "Side",
					rows: stats.bySide
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Surface, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Time of day" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "text-xs tracking-wide text-muted-foreground uppercase",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 text-left font-medium",
									children: "Hour"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 text-right font-medium",
									children: "Fills"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 text-right font-medium",
									children: "Win %"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 text-right font-medium",
									children: "Net"
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: [...stats.byHour].sort((a, b) => a.key.localeCompare(b.key)).map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border last:border-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2",
								children: row.key
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2 text-right tabular",
								children: row.trades
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2 text-right tabular",
								children: pct(row.winRate, 0)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2 text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PnlText, { value: row.pnl })
							})
						]
					}, row.key)) })]
				})
			})] })
		]
	});
}
function Kpi({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Surface, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-xs tracking-wide text-muted-foreground uppercase",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-2 text-lg font-medium tabular",
		children: value
	})] });
}
function GroupTable({ title, rows }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Surface, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: title }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
		className: "w-full text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
			className: "text-xs tracking-wide text-muted-foreground uppercase",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-b border-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "py-2 text-left font-medium",
						children: "Bucket"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "py-2 text-right font-medium",
						children: "n"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "py-2 text-right font-medium",
						children: "Win %"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "py-2 text-right font-medium",
						children: "Net"
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
			className: "border-b border-border last:border-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "py-2",
					children: row.key
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "py-2 text-right tabular",
					children: row.trades
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "py-2 text-right tabular",
					children: pct(row.winRate, 0)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "py-2 text-right",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PnlText, { value: row.pnl })
				})
			]
		}, row.key)) })]
	})] });
}
//#endregion
export { AnalyticsPage as component };
