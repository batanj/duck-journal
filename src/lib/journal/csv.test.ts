import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseTradesCsv } from "./csv.ts";

const MT4_CSV = `Ticket,Open Time,Type,Size,Item,Price,S/L,T/P,Close Time,Price,Commission,Taxes,Swap,Profit
13904324,2024.01.15 09:32:01,buy,0.10,eurusd,1.09432,1.09200,1.09800,2024.01.15 11:15:22,1.09610,0.00,0.00,-0.12,17.80
13904325,2024.01.15 13:02:00,sell,0.20,gbpusd,1.27100,0,0,2024.01.15 15:40:11,1.26840,-1.40,0.00,0.00,52.00
,2024.01.16 00:00:00,balance,0,,0,0,0,2024.01.16 00:00:00,0,0,0,0,1000.00
`;

const MT4_EU = `Ticket;Open Time;Type;Size;Item;Price;S/L;T/P;Close Time;Price;Commission;Taxes;Swap;Profit
13904324;2024.01.15 09:32:01;buy;0,10;eurusd;1,09432;1,09200;1,09800;2024.01.15 11:15:22;1,09610;0,00;0,00;-0,12;17,80
`;

const MT4_HTML = `<html><body>
<table><tr><th colspan="13">Account: 45289103</th></tr></table>
<table>
<tr>
<th>Ticket</th><th>Open Time</th><th>Type</th><th>Size</th><th>Item</th>
<th>Price</th><th>S/L</th><th>T/P</th><th>Close Time</th><th>Price</th>
<th>Commission</th><th>Taxes</th><th>Swap</th><th>Profit</th>
</tr>
<tr>
<td>2211</td><td>2024.03.01 10:15:00</td><td>buy</td><td>0.10</td><td>eurusd</td>
<td>1.08320</td><td>1.08000</td><td>1.09000</td><td>2024.03.01 14:22:11</td><td>1.08510</td>
<td>0.00</td><td>0.00</td><td>-0.32</td><td>19.00</td>
</tr>
</table>
</body></html>`;

const MT5_CSV = `Time,Position,Symbol,Type,Volume,Price,S/L,T/P,Time,Price,Commission,Swap,Profit
2024.05.01 10:00:00,88011,EURUSD,buy,0.10,1.07200,0,0,2024.05.01 12:00:00,1.07350,-0.70,0,15.00
2024.05.02 09:12:00,88012,XAUUSD,sell,0.05,2320.40,0,0,2024.05.02 11:40:00,2312.10,-0.50,-0.20,41.50
`;

const GENERIC = `Date,Symbol,Side,Qty,Entry,Exit,Fees,PnL
2024-06-01,AAPL,long,10,190.5,192.1,1.2,14.8
`;

describe("parseTradesCsv", () => {
  it("reads MT4 CSV with two Price columns", () => {
    const r = parseTradesCsv(MT4_CSV);
    assert.equal(r.detected, "mt4");
    assert.equal(r.trades.length, 2);
    assert.equal(r.trades[0].symbol, "EURUSD");
    assert.equal(r.trades[0].side, "long");
    assert.equal(r.trades[0].entryPrice, 1.09432);
    assert.equal(r.trades[0].exitPrice, 1.0961);
    assert.equal(r.trades[0].pnl, 17.8);
    assert.equal(r.trades[0].fees, 0.12);
    assert.equal(r.trades[1].side, "short");
    assert.equal(r.trades[1].pnl, 52);
  });

  it("reads MT4 European semicolon CSV", () => {
    const r = parseTradesCsv(MT4_EU);
    assert.equal(r.trades.length, 1);
    assert.equal(r.trades[0].qty, 0.1);
    assert.equal(r.trades[0].entryPrice, 1.09432);
    assert.equal(r.trades[0].exitPrice, 1.0961);
    assert.equal(r.trades[0].pnl, 17.8);
  });

  it("reads MT4 Save as Report HTML", () => {
    const r = parseTradesCsv(MT4_HTML);
    assert.equal(r.detected, "mt4");
    assert.equal(r.trades.length, 1);
    assert.equal(r.trades[0].symbol, "EURUSD");
    assert.equal(r.trades[0].entryPrice, 1.0832);
    assert.equal(r.trades[0].exitPrice, 1.0851);
    assert.equal(r.trades[0].pnl, 19);
  });

  it("reads MT5 closed-position CSV", () => {
    const r = parseTradesCsv(MT5_CSV);
    assert.equal(r.detected, "mt5");
    assert.equal(r.trades.length, 2);
    assert.equal(r.trades[0].entryPrice, 1.072);
    assert.equal(r.trades[0].exitPrice, 1.0735);
    assert.equal(r.trades[0].fees, 0.7);
    assert.equal(r.trades[1].symbol, "XAUUSD");
    assert.equal(r.trades[1].fees, 0.7);
  });

  it("still reads generic CSV", () => {
    const r = parseTradesCsv(GENERIC);
    assert.equal(r.detected, "generic");
    assert.equal(r.trades.length, 1);
    assert.equal(r.trades[0].symbol, "AAPL");
    assert.equal(r.trades[0].side, "long");
  });
});
