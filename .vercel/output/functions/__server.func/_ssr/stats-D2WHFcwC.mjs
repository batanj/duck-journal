import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as format, d as startOfDay } from "../_libs/date-fns.mjs";
import { a as XAxis, c as CartesianGrid, d as Bar, f as Cell, i as YAxis, m as Tooltip, n as BarChart, o as Area, p as ResponsiveContainer, t as AreaChart } from "../_libs/recharts+[...].mjs";
import { g as money } from "./app-shell-BIAHNqug.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/stats-D2WHFcwC.js
var import_jsx_runtime = require_jsx_runtime();
function ChartTip({ active, payload, label, labelFmt }) {
	if (!active || !payload?.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-1 text-muted-foreground",
			children: labelFmt ? labelFmt(label ?? "") : label
		}), payload.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "tabular text-foreground",
			children: money(p.value, { sign: true })
		}, p.name))]
	});
}
function EquityChart({ data }) {
	const points = data.map((d) => ({
		t: d.t,
		equity: Math.round(d.equity * 100) / 100
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
		width: "100%",
		height: "100%",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
			data: points,
			margin: {
				top: 8,
				right: 8,
				left: 0,
				bottom: 0
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
					id: "eqFill",
					x1: "0",
					y1: "0",
					x2: "0",
					y2: "1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "0%",
						stopColor: "var(--color-win)",
						stopOpacity: .28
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "100%",
						stopColor: "var(--color-win)",
						stopOpacity: 0
					})]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
					stroke: "var(--color-border)",
					vertical: false
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
					dataKey: "t",
					type: "number",
					domain: ["dataMin", "dataMax"],
					tickFormatter: (v) => format(v, "MMM d"),
					tick: {
						fill: "var(--color-muted-foreground)",
						fontSize: 11
					},
					axisLine: false,
					tickLine: false,
					minTickGap: 28
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
					tickFormatter: (v) => v >= 1e3 ? `$${(v / 1e3).toFixed(0)}k` : `$${v}`,
					tick: {
						fill: "var(--color-muted-foreground)",
						fontSize: 11
					},
					axisLine: false,
					tickLine: false,
					width: 52,
					domain: ["auto", "auto"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTip, { labelFmt: (v) => format(Number(v), "MMM d, yyyy") }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
					type: "monotone",
					dataKey: "equity",
					stroke: "var(--color-win)",
					strokeWidth: 1.6,
					fill: "url(#eqFill)",
					isAnimationActive: false
				})
			]
		})
	});
}
function DailyBarChart({ data }) {
	const last = data.slice(-40);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
		width: "100%",
		height: "100%",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
			data: last,
			margin: {
				top: 8,
				right: 4,
				left: 0,
				bottom: 0
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
					stroke: "var(--color-border)",
					vertical: false
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
					dataKey: "date",
					tickFormatter: (v) => format(new Date(v), "d"),
					tick: {
						fill: "var(--color-muted-foreground)",
						fontSize: 11
					},
					axisLine: false,
					tickLine: false
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
					tickFormatter: (v) => Math.abs(v) >= 1e3 ? `${(v / 1e3).toFixed(0)}k` : `${v}`,
					tick: {
						fill: "var(--color-muted-foreground)",
						fontSize: 11
					},
					axisLine: false,
					tickLine: false,
					width: 40
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTip, { labelFmt: (v) => format(new Date(String(v)), "EEE, MMM d") }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
					dataKey: "pnl",
					radius: [
						3,
						3,
						0,
						0
					],
					isAnimationActive: false,
					children: last.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: d.pnl >= 0 ? "var(--color-win)" : "var(--color-loss)" }, d.date))
				})
			]
		})
	});
}
function GroupBarChart({ data }) {
	const rows = [...data].slice(0, 8);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
		width: "100%",
		height: "100%",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
			data: rows,
			layout: "vertical",
			margin: {
				top: 4,
				right: 8,
				left: 8,
				bottom: 0
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
					type: "number",
					hide: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
					type: "category",
					dataKey: "key",
					width: 72,
					tick: {
						fill: "var(--color-muted-foreground)",
						fontSize: 11
					},
					axisLine: false,
					tickLine: false
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTip, {}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
					dataKey: "pnl",
					radius: [
						0,
						3,
						3,
						0
					],
					isAnimationActive: false,
					children: rows.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: d.pnl >= 0 ? "var(--color-win)" : "var(--color-loss)" }, d.key))
				})
			]
		})
	});
}
var WEEKDAYS = [
	"Sun",
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat"
];
function group(trades, keyFn) {
	const map = /* @__PURE__ */ new Map();
	for (const t of trades) {
		const k = keyFn(t) || "—";
		const arr = map.get(k);
		if (arr) arr.push(t);
		else map.set(k, [t]);
	}
	return [...map.entries()].map(([key, list]) => {
		const wins = list.filter((x) => x.pnl > 0).length;
		const pnl = list.reduce((s, x) => s + x.pnl, 0);
		return {
			key,
			trades: list.length,
			wins,
			pnl,
			winRate: list.length ? wins / list.length : 0,
			avgPnl: list.length ? pnl / list.length : 0
		};
	}).sort((a, b) => b.pnl - a.pnl);
}
function computeStats(trades, startingEquity) {
	const sorted = [...trades].sort((a, b) => new Date(a.exitAt).getTime() - new Date(b.exitAt).getTime());
	const winsList = sorted.filter((t) => t.pnl > 0);
	const lossesList = sorted.filter((t) => t.pnl < 0);
	const scratches = sorted.filter((t) => t.pnl === 0).length;
	const grossProfit = winsList.reduce((s, t) => s + t.pnl, 0);
	const grossLoss = Math.abs(lossesList.reduce((s, t) => s + t.pnl, 0));
	const netPnl = sorted.reduce((s, t) => s + t.pnl, 0);
	const equityCurve = [];
	let equity = startingEquity;
	let peak = startingEquity;
	let maxDrawdown = 0;
	if (sorted.length) {
		const first = new Date(sorted[0].entryAt).getTime();
		equityCurve.push({
			t: first,
			equity: startingEquity,
			pnl: 0
		});
	}
	for (const t of sorted) {
		equity += t.pnl;
		peak = Math.max(peak, equity);
		maxDrawdown = Math.max(maxDrawdown, peak - equity);
		equityCurve.push({
			t: new Date(t.exitAt).getTime(),
			equity,
			pnl: t.pnl
		});
	}
	let currentStreak = 0;
	let maxWinStreak = 0;
	let maxLossStreak = 0;
	let run = 0;
	let runSign = 0;
	for (const t of sorted) {
		const sign = t.pnl > 0 ? 1 : t.pnl < 0 ? -1 : 0;
		if (sign === 0) continue;
		if (sign === runSign) run += 1;
		else {
			runSign = sign;
			run = 1;
		}
		if (sign > 0) maxWinStreak = Math.max(maxWinStreak, run);
		else maxLossStreak = Math.max(maxLossStreak, run);
		currentStreak = runSign * run;
	}
	const dailyMap = /* @__PURE__ */ new Map();
	for (const t of sorted) {
		const d = startOfDay(new Date(t.exitAt)).toISOString().slice(0, 10);
		const prev = dailyMap.get(d) ?? {
			pnl: 0,
			trades: 0
		};
		prev.pnl += t.pnl;
		prev.trades += 1;
		dailyMap.set(d, prev);
	}
	const daily = [...dailyMap.entries()].map(([date, v]) => ({
		date,
		...v
	})).sort((a, b) => a.date.localeCompare(b.date));
	const count = sorted.length;
	const wins = winsList.length;
	const losses = lossesList.length;
	return {
		count,
		wins,
		losses,
		scratches,
		winRate: count ? wins / count : 0,
		netPnl,
		grossProfit,
		grossLoss,
		profitFactor: grossLoss === 0 ? grossProfit > 0 ? Infinity : 0 : grossProfit / grossLoss,
		avgWin: wins ? grossProfit / wins : 0,
		avgLoss: losses ? grossLoss / losses : 0,
		expectancy: count ? netPnl / count : 0,
		avgPnl: count ? netPnl / count : 0,
		maxWin: winsList.reduce((m, t) => Math.max(m, t.pnl), 0),
		maxLoss: lossesList.reduce((m, t) => Math.min(m, t.pnl), 0),
		maxDrawdown,
		maxDrawdownPct: peak ? maxDrawdown / peak : 0,
		currentStreak,
		maxWinStreak,
		maxLossStreak,
		equityCurve,
		endingEquity: equity,
		returnPct: startingEquity ? netPnl / startingEquity : 0,
		bySymbol: group(sorted, (t) => t.symbol),
		bySetup: group(sorted, (t) => t.setup || "Untagged"),
		byWeekday: group(sorted, (t) => WEEKDAYS[new Date(t.exitAt).getDay()] ?? "—"),
		byHour: group(sorted, (t) => `${String(new Date(t.exitAt).getHours()).padStart(2, "0")}:00`),
		bySide: group(sorted, (t) => t.side === "long" ? "Long" : "Short"),
		daily
	};
}
//#endregion
export { computeStats as i, EquityChart as n, GroupBarChart as r, DailyBarChart as t };
