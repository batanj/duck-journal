use crate::models::Trade;
use chrono::{Datelike, Duration, TimeZone, Utc};

struct Instrument {
    asset_class: &'static str,
    multiplier: f64,
    decimals: i32,
}

fn instrument(symbol: &str) -> Option<Instrument> {
    Some(match symbol {
        "ES" => Instrument { asset_class: "futures", multiplier: 50.0, decimals: 2 },
        "NQ" => Instrument { asset_class: "futures", multiplier: 20.0, decimals: 2 },
        "CL" => Instrument { asset_class: "futures", multiplier: 1000.0, decimals: 2 },
        "GC" => Instrument { asset_class: "futures", multiplier: 100.0, decimals: 1 },
        "AAPL" => Instrument { asset_class: "stocks", multiplier: 1.0, decimals: 2 },
        "NVDA" => Instrument { asset_class: "stocks", multiplier: 1.0, decimals: 2 },
        "SPY" => Instrument { asset_class: "stocks", multiplier: 1.0, decimals: 2 },
        "EURUSD" => Instrument { asset_class: "forex", multiplier: 100_000.0, decimals: 5 },
        "BTCUSD" => Instrument { asset_class: "crypto", multiplier: 1.0, decimals: 2 },
        _ => return None,
    })
}

const SYMBOLS: [&str; 9] = ["ES", "NQ", "CL", "GC", "AAPL", "NVDA", "SPY", "EURUSD", "BTCUSD"];
const SETUPS: [&str; 6] = ["ORB", "VWAP Fade", "Breakout", "Pullback", "News", "Range"];

pub fn seed_from(text: &str) -> u32 {
    let mut h: u32 = 2_166_136_261;
    for ch in text.encode_utf16() {
        h ^= ch as u32;
        h = h.wrapping_mul(16_777_619);
    }
    h
}

fn mulberry32(seed: u32) -> impl FnMut() -> f64 {
    let mut a = seed;
    move || {
        a = a.wrapping_add(0x6d2b79f5);
        let mut t = a;
        t = (t ^ t.wrapping_shr(15)).wrapping_mul(t | 1);
        t ^= t.wrapping_add((t ^ t.wrapping_shr(7)).wrapping_mul(t | 61));
        f64::from(t ^ t.wrapping_shr(14)) / 4_294_967_296.0
    }
}

fn pick<'a, T>(rng: &mut impl FnMut() -> f64, list: &'a [T]) -> &'a T {
    let i = ((rng)() * list.len() as f64).floor() as usize;
    &list[i.min(list.len() - 1)]
}

fn lerp(a: f64, b: f64, t: f64) -> f64 {
    a + (b - a) * t
}

fn round_to(value: f64, decimals: i32) -> f64 {
    let p = 10f64.powi(decimals);
    (value * p).round() / p
}

fn utc(y: i32, m: u32, d: u32, h: u32, min: u32) -> chrono::DateTime<Utc> {
    Utc.with_ymd_and_hms(y, m, d, h, min, 0).unwrap()
}

fn compute_pnl(symbol: &str, side: &str, qty: f64, entry: f64, exit: f64, fees: f64) -> f64 {
    let m = instrument(symbol).map(|i| i.multiplier).unwrap_or(1.0);
    let dir = if side == "long" { 1.0 } else { -1.0 };
    round_to(dir * (exit - entry) * qty * m - fees, 2)
}

fn qty_for(symbol: &str, size: f64, rng: &mut impl FnMut() -> f64) -> f64 {
    match instrument(symbol).map(|i| i.asset_class) {
        Some("futures") => ((if rng() < 0.7 { 1.0 } else { 2.0 }) * size).round().max(1.0),
        Some("forex") => ((if rng() < 0.5 { 0.1 } else { 0.2 }) * size * 10.0).round() / 10.0,
        Some("crypto") => ((0.04 + rng() * 0.08) * size * 1000.0).round() / 1000.0,
        _ => ((50.0 + rng() * 150.0) * size).round(),
    }
}

fn move_for(symbol: &str, win: bool, rng: &mut impl FnMut() -> f64) -> f64 {
    let mag = rng();
    let dir = if win { 1.0 } else { -1.0 };
    dir * match symbol {
        "ES" => lerp(2.5, 18.0, mag),
        "NQ" => lerp(12.0, 90.0, mag),
        "CL" => lerp(0.12, 1.15, mag),
        "GC" => lerp(1.5, 14.0, mag),
        "AAPL" => lerp(0.35, 3.8, mag),
        "NVDA" => lerp(0.4, 4.6, mag),
        "SPY" => lerp(0.25, 2.8, mag),
        "EURUSD" => lerp(0.0004, 0.0032, mag),
        "BTCUSD" => lerp(180.0, 2200.0, mag),
        _ => lerp(0.5, 4.0, mag),
    }
}

fn fees_for(symbol: &str, qty: f64) -> f64 {
    round_to(
        match instrument(symbol).map(|i| i.asset_class) {
            Some("futures") => qty * 4.6,
            Some("forex") => qty * 7.0,
            Some("crypto") => qty * 12.0,
            _ => 0.8 + qty * 0.005,
        },
        2,
    )
}

fn band(symbol: &str) -> (f64, f64) {
    match symbol {
        "ES" => (5120.0, 5660.0),
        "NQ" => (17840.0, 20110.0),
        "CL" => (76.4, 82.1),
        "GC" => (2320.0, 2510.0),
        "AAPL" => (172.0, 228.0),
        "NVDA" => (106.0, 134.0),
        "SPY" => (508.0, 564.0),
        "EURUSD" => (1.072, 1.098),
        "BTCUSD" => (61200.0, 68400.0),
        _ => (100.0, 110.0),
    }
}

fn phase(day: chrono::DateTime<Utc>) -> (f64, f64) {
    let t = day.timestamp_millis();
    if t < utc(2026, 6, 1, 0, 0).timestamp_millis() {
        (0.58, 1.0)
    } else if t < utc(2026, 6, 21, 0, 0).timestamp_millis() {
        (0.36, 1.45)
    } else if t < utc(2026, 7, 1, 0, 0).timestamp_millis() {
        (0.52, 0.9)
    } else if t < utc(2026, 8, 1, 0, 0).timestamp_millis() {
        (0.61, 1.0)
    } else {
        (0.55, 1.05)
    }
}

pub fn generate_account_history(account_id: &str, seed: u32, platform: &str) -> Vec<Trade> {
    let mut rng = mulberry32(seed);
    let mut trades = Vec::new();
    let start = utc(2026, 5, 4, 0, 0);
    let end = utc(2026, 8, 21, 0, 0);
    let mut n = 0u32;
    let mut day = start;
    while day <= end {
        let dow = day.weekday().num_days_from_sunday();
        if dow != 0 && dow != 6 {
            let (p_win, size) = phase(day);
            let count_roll = rng();
            let mut count = if count_roll < 0.18 {
                0
            } else if count_roll < 0.55 {
                1
            } else if count_roll < 0.84 {
                2
            } else {
                3
            };
            if p_win < 0.4 && rng() < 0.5 {
                count = count.max(2);
            }
            let mut cursor = utc(
                day.year(),
                day.month(),
                day.day(),
                13 + (rng() * 2.0).floor() as u32,
                (rng() * 50.0).floor() as u32,
            );
            for _ in 0..count {
                let symbol = *pick(&mut rng, &SYMBOLS);
                let Some(inst) = instrument(symbol) else { continue };
                let (b0, b1) = band(symbol);
                let span = (end.timestamp_millis() - start.timestamp_millis()) as f64;
                let t_frac = (day.timestamp_millis() - start.timestamp_millis()) as f64 / span;
                let px = lerp(b0, b1, t_frac + (rng() - 0.5) * 0.08);
                let side = if rng() < 0.56 { "long" } else { "short" };
                let mut win = rng() < p_win;
                if symbol == "NVDA" {
                    win = rng() < p_win + 0.08;
                }
                if dow == 1 {
                    win = rng() < p_win - 0.08;
                }
                let qty = qty_for(symbol, size, &mut rng);
                let signed_move = move_for(symbol, win, &mut rng);
                let entry_price = round_to(px, inst.decimals);
                let dir = if side == "long" { 1.0 } else { -1.0 };
                let exit_price = round_to(entry_price + signed_move * dir, inst.decimals);
                let hold = 12 + (rng() * 140.0).floor() as i64;
                let entry_at = cursor;
                let exit_at = cursor + Duration::minutes(hold);
                let fees = fees_for(symbol, qty);
                let pnl = compute_pnl(symbol, side, qty, entry_price, exit_price, fees);
                let mut tags = Vec::new();
                if hold < 20 {
                    tags.push("scalp".into());
                }
                if hold > 120 {
                    tags.push("held".into());
                }
                n += 1;
                trades.push(Trade {
                    id: format!("{account_id}-t-{n:03}"),
                    account_id: account_id.into(),
                    symbol: symbol.into(),
                    asset_class: inst.asset_class.into(),
                    side: side.into(),
                    qty,
                    entry_price,
                    exit_price,
                    entry_at: entry_at.to_rfc3339_opts(chrono::SecondsFormat::Millis, true),
                    exit_at: exit_at.to_rfc3339_opts(chrono::SecondsFormat::Millis, true),
                    fees,
                    pnl,
                    setup: String::new(),
                    tags,
                    notes: String::new(),
                    grade: String::new(),
                    emotions: Vec::new(),
                    platform: platform.into(),
                });
                cursor = exit_at + Duration::minutes(20 + (rng() * 50.0).floor() as i64);
            }
        }
        day += Duration::days(1);
    }
    trades.sort_by(|a, b| b.exit_at.cmp(&a.exit_at));
    trades
}

pub fn annotate_demo_reviews(trades: Vec<Trade>) -> Vec<Trade> {
    let mut rng = mulberry32(seed_from("dj-reviews"));
    let win_grades = ["A", "A", "B", "B", "B", "C"];
    let loss_grades = ["B", "C", "C", "D", "F", "F"];
    let leak = ["revenge", "fomo", "fear", "frustration", "hope", "impatience"];
    let clean = ["calm", "calm", "overconfidence", "hesitation"];
    trades
        .into_iter()
        .map(|mut t| {
            if rng() < 0.22 {
                return t;
            }
            let grade = if t.pnl >= 0.0 {
                *pick(&mut rng, &win_grades)
            } else {
                *pick(&mut rng, &loss_grades)
            };
            let mut emotions = Vec::new();
            if grade == "A" || grade == "B" {
                emotions.push((*pick(&mut rng, &clean)).into());
                if rng() < 0.18 {
                    emotions.push("overconfidence".into());
                }
            } else {
                emotions.push((*pick(&mut rng, &leak)).into());
                if rng() < 0.35 {
                    let extra = *pick(&mut rng, &leak);
                    if !emotions.iter().any(|e| e == extra) {
                        emotions.push(extra.into());
                    }
                }
            }
            if t.setup.is_empty() {
                t.setup = (*pick(&mut rng, &SETUPS)).into();
            }
            t.grade = grade.into();
            t.emotions = emotions;
            t
        })
        .collect()
}
