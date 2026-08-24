import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { d as FileUp } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as parseTradesCsv, m as cn, n as Badge, o as PLATFORMS, r as Button, s as PnlText, t as AppShell, x as useJournalStore, y as tradesToCsv } from "./app-shell-BIAHNqug.mjs";
import { n as Surface } from "./surface-DsYwUmlw.mjs";
import { t as AccountFocus } from "./account-focus-ZXuU57WI.mjs";
import { t as SAMPLE_TRADES } from "./sample-data-CasQwOSK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/import-BMfG0H0c.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ImportPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImportView, {}) });
}
function ImportView() {
	const importTrades = useJournalStore((s) => s.importTrades);
	const accounts = useJournalStore((s) => s.accounts);
	const [platform, setPlatform] = (0, import_react.useState)("generic");
	const [parsed, setParsed] = (0, import_react.useState)(null);
	const [drag, setDrag] = (0, import_react.useState)(false);
	const net = (0, import_react.useMemo)(() => parsed?.trades.reduce((s, t) => s + t.pnl, 0) ?? 0, [parsed]);
	function handleText(text, source) {
		const result = parseTradesCsv(text, platform === "generic" ? "auto" : platform);
		setParsed(result);
		if (!result.trades.length) {
			toast(`No fills read from ${source}`);
			return;
		}
		toast(`Read ${result.trades.length} fills · ${result.detected}`);
	}
	async function onFiles(files) {
		const file = files?.[0];
		if (!file) return;
		handleText(await file.text(), file.name);
	}
	function apply(mode) {
		if (!parsed?.trades.length) return;
		if (!accounts.length) {
			toast("Connect an account first");
			return;
		}
		importTrades(parsed.trades, mode).then((n) => {
			toast(mode === "replace" ? `Replaced book with ${n} fills` : `Merged ${n} new fills`);
			setParsed(null);
		});
	}
	function downloadTemplate() {
		const blob = new Blob([tradesToCsv(SAMPLE_TRADES.slice(0, 12))], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "duckjournal-template.csv";
		a.click();
		URL.revokeObjectURL(url);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "max-w-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase",
						children: "Terminals"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 text-4xl font-semibold tracking-tight",
						children: "Import"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-muted-foreground",
						children: "DuckJournal reads the history file your platform already exports. Drop a CSV from MetaTrader, thinkorswim, NinjaTrader, Interactive Brokers, or TradingView. Parsing happens on this device — fills are saved to the selected account."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 max-w-xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountFocus, {})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2 sm:grid-cols-2 lg:grid-cols-3",
				children: PLATFORMS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setPlatform(p.id),
					className: cn("rounded-xl p-4 text-left shadow-[var(--shadow-border)] transition-[box-shadow,background-color] duration-150", platform === p.id ? "bg-secondary" : "bg-card hover:shadow-[var(--shadow-border-hover)]"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: p.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs leading-relaxed text-muted-foreground",
						children: p.blurb
					})]
				}, p.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Surface, {
				className: cn("grid place-items-center gap-3 py-12 text-center transition-colors duration-150", drag && "bg-secondary"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					onDragOver: (e) => {
						e.preventDefault();
						setDrag(true);
					},
					onDragLeave: () => setDrag(false),
					onDrop: (e) => {
						e.preventDefault();
						setDrag(false);
						onFiles(e.dataTransfer.files);
					},
					className: "grid w-full place-items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, { className: "size-6 text-muted-foreground" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: "Drop a CSV here"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: PLATFORMS.find((p) => p.id === platform)?.hint
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap justify-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "cursor-pointer",
									children: ["Choose file", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										accept: ".csv,text/csv,text/plain",
										className: "sr-only",
										onChange: (e) => {
											onFiles(e.target.files);
											e.target.value = "";
										}
									})]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								onClick: downloadTemplate,
								children: "Download template"
							})]
						})
					]
				})
			}),
			parsed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Surface, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-wide text-muted-foreground uppercase",
							children: "Preview"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm",
							children: [
								parsed.trades.length,
								" fills · detected ",
								parsed.detected,
								" · net",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PnlText, { value: net })
							]
						}),
						parsed.issues.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-loss",
							children: [
								parsed.issues.length,
								" row",
								parsed.issues.length === 1 ? "" : "s",
								" skipped"
							]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => apply("merge"),
							children: "Merge"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => apply("replace"),
							children: "Replace book"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 divide-y divide-border",
					children: parsed.trades.slice(0, 8).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-3 py-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-16 font-medium",
								children: t.symbol
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: t.side === "long" ? "win" : "loss",
								className: "capitalize",
								children: t.side
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: t.exitAt.slice(0, 10)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PnlText, {
								value: t.pnl,
								className: "ml-auto"
							})
						]
					}, t.id))
				}),
				parsed.trades.length > 8 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-xs text-muted-foreground",
					children: [
						"+",
						parsed.trades.length - 8,
						" more"
					]
				})
			] })
		]
	});
}
//#endregion
export { ImportPage as component };
