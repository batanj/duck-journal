import { i as SETUPS, n as DEMO_ACCOUNT_ID, o as computePnl, r as INSTRUMENTS } from "./types-GL5ccc67.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sample-data-CasQwOSK.js
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
function pick(rng, list) {
	return list[Math.floor(rng() * list.length)];
}
function lerp(a, b, t) {
	return a + (b - a) * t;
}
function utc(y, m, d, h = 0, min = 0) {
	return new Date(Date.UTC(y, m - 1, d, h, min));
}
function addMinutesUtc(d, minutes) {
	return new Date(d.getTime() + minutes * 6e4);
}
var NOTES = {
	"2026-05-08": "Clean ORB on ES. Waited for the opening drive retest — no chase.",
	"2026-05-14": "VWAP fade in NVDA held the whole afternoon. Size was planned.",
	"2026-05-21": "News spike on CL. Cut half at +1R, let the rest work.",
	"2026-06-05": "Took the first pullback too early. Process was sloppy before the open.",
	"2026-06-11": "Chased NQ after being stopped. Size was 2× the plan.",
	"2026-06-12": "Revenge on CL. Should have been done for the day after the first two losses.",
	"2026-06-13": "Forced a Range fade into a trend day. Classic.",
	"2026-06-18": "Sat on hands until 11. Best decision of the month.",
	"2026-07-02": "Breakout on AAPL into the close. Held overnight thesis overnight.",
	"2026-07-16": "FOMC morning. Stood down until the second impulse. Paid.",
	"2026-07-24": "Textbook pullback short on ES from the prior day high.",
	"2026-08-06": "Overtraded the open. Three scratches that should have been one idea.",
	"2026-08-14": "CPI. Cut a winner too early — still the right size.",
	"2026-08-20": "Last hour fade on SPY. Patient. A-grade process even though it was small."
};
var BASE = {
	ES: {
		start: 5120,
		end: 5660
	},
	NQ: {
		start: 17840,
		end: 20110
	},
	CL: {
		start: 76.4,
		end: 82.1
	},
	GC: {
		start: 2320,
		end: 2510
	},
	AAPL: {
		start: 172,
		end: 228
	},
	NVDA: {
		start: 106,
		end: 134
	},
	SPY: {
		start: 508,
		end: 564
	},
	EURUSD: {
		start: 1.072,
		end: 1.098
	},
	BTCUSD: {
		start: 61200,
		end: 68400
	}
};
function phase(day) {
	const t = day.getTime();
	if (t < utc(2026, 6, 1).getTime()) return {
		pWin: .58,
		size: 1,
		emotionBias: "calm"
	};
	if (t < utc(2026, 6, 21).getTime()) return {
		pWin: .36,
		size: 1.45,
		emotionBias: "revenge"
	};
	if (t < utc(2026, 7, 1).getTime()) return {
		pWin: .52,
		size: .9,
		emotionBias: "hesitant"
	};
	if (t < utc(2026, 8, 1).getTime()) return {
		pWin: .61,
		size: 1,
		emotionBias: "calm"
	};
	return {
		pWin: .55,
		size: 1.05,
		emotionBias: "calm"
	};
}
function qtyFor(symbol, size, rng) {
	switch (INSTRUMENTS[symbol]?.assetClass) {
		case "futures": return Math.max(1, Math.round((rng() < .7 ? 1 : 2) * size));
		case "forex": return Math.round((rng() < .5 ? .1 : .2) * size * 10) / 10;
		case "crypto": return Math.round((.04 + rng() * .08) * size * 1e3) / 1e3;
		default: return Math.round((50 + rng() * 150) * size);
	}
}
function moveFor(symbol, win, rng) {
	const mag = rng();
	const dir = win ? 1 : -1;
	switch (symbol) {
		case "ES": return dir * lerp(2.5, 18, mag);
		case "NQ": return dir * lerp(12, 90, mag);
		case "CL": return dir * lerp(.12, 1.15, mag);
		case "GC": return dir * lerp(1.5, 14, mag);
		case "AAPL": return dir * lerp(.35, 3.8, mag);
		case "NVDA": return dir * lerp(.4, 4.6, mag);
		case "SPY": return dir * lerp(.25, 2.8, mag);
		case "EURUSD": return dir * lerp(4e-4, .0032, mag);
		case "BTCUSD": return dir * lerp(180, 2200, mag);
		default: return dir * lerp(.5, 4, mag);
	}
}
function feesFor(symbol, qty) {
	const cls = INSTRUMENTS[symbol]?.assetClass;
	if (cls === "futures") return Math.round(qty * 4.6 * 100) / 100;
	if (cls === "forex") return Math.round(qty * 7 * 100) / 100;
	if (cls === "crypto") return Math.round(qty * 12 * 100) / 100;
	return Math.round((.8 + qty * .005) * 100) / 100;
}
function gradeFor(win, emotion, rng) {
	if (emotion === "revenge" || emotion === "fomo") return rng() < .6 ? "D" : "F";
	if (emotion === "hesitant") return rng() < .5 ? "C" : "B";
	if (win) return rng() < .55 ? "A" : "B";
	return rng() < .5 ? "B" : "C";
}
function generateAccountHistory({ accountId, seed, platform }) {
	const rng = mulberry32(seed);
	const trades = [];
	const start = utc(2026, 5, 4);
	const end = utc(2026, 8, 21);
	const symbols = Object.keys(INSTRUMENTS);
	let n = 0;
	for (let t = start.getTime(); t <= end.getTime(); t += 864e5) {
		const day = new Date(t);
		const dow = day.getUTCDay();
		if (dow === 0 || dow === 6) continue;
		const ph = phase(day);
		const countRoll = rng();
		let count = 0;
		if (countRoll < .18) count = 0;
		else if (countRoll < .55) count = 1;
		else if (countRoll < .84) count = 2;
		else count = 3;
		if (ph.emotionBias === "revenge" && rng() < .5) count = Math.max(count, 2);
		const key = day.toISOString().slice(0, 10);
		let cursor = utc(day.getUTCFullYear(), day.getUTCMonth() + 1, day.getUTCDate(), 13 + Math.floor(rng() * 2), Math.floor(rng() * 50));
		for (let i = 0; i < count; i++) {
			const symbol = pick(rng, symbols);
			const inst = INSTRUMENTS[symbol];
			if (!inst) continue;
			const band = BASE[symbol] ?? {
				start: 100,
				end: 110
			};
			const tFrac = (day.getTime() - start.getTime()) / (end.getTime() - start.getTime());
			const px = lerp(band.start, band.end, tFrac + (rng() - .5) * .08);
			const side = rng() < .56 ? "long" : "short";
			let win = rng() < ph.pWin;
			if (symbol === "NVDA") win = rng() < ph.pWin + .08;
			if (dow === 1) win = rng() < ph.pWin - .08;
			const qty = qtyFor(symbol, ph.size, rng);
			const signedMove = moveFor(symbol, win, rng);
			const entryPrice = Number(px.toFixed(inst.decimals));
			const exitPrice = Number((entryPrice + signedMove * (side === "long" ? 1 : -1)).toFixed(inst.decimals));
			const hold = 12 + Math.floor(rng() * 140);
			const entryAt = cursor.toISOString();
			const exitAt = addMinutesUtc(cursor, hold).toISOString();
			const fees = feesFor(symbol, qty);
			const pnl = computePnl({
				symbol,
				side,
				qty,
				entryPrice,
				exitPrice,
				fees
			});
			let emotion = ph.emotionBias;
			if (ph.emotionBias === "revenge" && i === 0) emotion = rng() < .5 ? "fomo" : "calm";
			if (ph.emotionBias === "calm" && rng() < .12) emotion = "bored";
			if (ph.emotionBias === "calm" && rng() < .08) emotion = "hesitant";
			const setup = pick(rng, SETUPS);
			const tags = [];
			if (emotion === "revenge") tags.push("revenge");
			if (emotion === "fomo") tags.push("chased");
			if (hold < 20) tags.push("scalp");
			if (hold > 120) tags.push("held");
			if (setup === "News") tags.push("event");
			n += 1;
			trades.push({
				id: `${accountId}-t-${String(n).padStart(3, "0")}`,
				accountId,
				symbol,
				assetClass: inst.assetClass,
				side,
				qty,
				entryPrice,
				exitPrice,
				entryAt,
				exitAt,
				fees,
				pnl,
				setup,
				tags,
				notes: i === 0 ? NOTES[key] ?? "" : "",
				grade: gradeFor(win, emotion, rng),
				emotion,
				platform
			});
			cursor = addMinutesUtc(cursor, hold + 20 + Math.floor(rng() * 50));
		}
	}
	return trades.sort((a, b) => new Date(b.exitAt).getTime() - new Date(a.exitAt).getTime());
}
function buildSampleTrades() {
	return generateAccountHistory({
		accountId: DEMO_ACCOUNT_ID,
		seed: 20260823,
		platform: "MT5"
	});
}
var SAMPLE_TRADES = buildSampleTrades();
function seedFrom(text) {
	let h = 2166136261;
	for (let i = 0; i < text.length; i += 1) {
		h ^= text.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}
//#endregion
export { generateAccountHistory as n, seedFrom as r, SAMPLE_TRADES as t };
