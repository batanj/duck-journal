//#region node_modules/.nitro/vite/services/ssr/assets/types-GL5ccc67.js
var SETUPS = [
	"ORB",
	"VWAP Fade",
	"Breakout",
	"Pullback",
	"News",
	"Range"
];
var DEFAULT_SETTINGS = {
	startingEquity: 5e4,
	currency: "USD"
};
var INSTRUMENTS = {
	ES: {
		symbol: "ES",
		name: "E-mini S&P",
		assetClass: "futures",
		multiplier: 50,
		decimals: 2
	},
	NQ: {
		symbol: "NQ",
		name: "E-mini Nasdaq",
		assetClass: "futures",
		multiplier: 20,
		decimals: 2
	},
	CL: {
		symbol: "CL",
		name: "Crude Oil",
		assetClass: "futures",
		multiplier: 1e3,
		decimals: 2
	},
	GC: {
		symbol: "GC",
		name: "Gold",
		assetClass: "futures",
		multiplier: 100,
		decimals: 1
	},
	AAPL: {
		symbol: "AAPL",
		name: "Apple",
		assetClass: "stocks",
		multiplier: 1,
		decimals: 2
	},
	NVDA: {
		symbol: "NVDA",
		name: "NVIDIA",
		assetClass: "stocks",
		multiplier: 1,
		decimals: 2
	},
	SPY: {
		symbol: "SPY",
		name: "S&P 500 ETF",
		assetClass: "stocks",
		multiplier: 1,
		decimals: 2
	},
	EURUSD: {
		symbol: "EURUSD",
		name: "Euro / Dollar",
		assetClass: "forex",
		multiplier: 1e5,
		decimals: 5
	},
	BTCUSD: {
		symbol: "BTCUSD",
		name: "Bitcoin",
		assetClass: "crypto",
		multiplier: 1,
		decimals: 2
	}
};
var SYMBOLS = Object.keys(INSTRUMENTS);
function computePnl(input) {
	const m = INSTRUMENTS[input.symbol]?.multiplier ?? 1;
	const raw = (input.side === "long" ? 1 : -1) * (input.exitPrice - input.entryPrice) * input.qty * m - input.fees;
	return Math.round(raw * 100) / 100;
}
var DEMO_ACCOUNT_ID = "acc-main";
//#endregion
export { SYMBOLS as a, SETUPS as i, DEMO_ACCOUNT_ID as n, computePnl as o, INSTRUMENTS as r, DEFAULT_SETTINGS as t };
