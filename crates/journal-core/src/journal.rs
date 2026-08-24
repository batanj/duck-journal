use crate::db;
use crate::models::{ConnectInput, JournalState, Trade, TradingAccount, DEMO_ACCOUNT_ID};
use crate::seed::{annotate_demo_reviews, generate_account_history, seed_from};
use anyhow::{bail, Context, Result};
use rusqlite::{params, Connection, OptionalExtension};
use std::path::Path;
use std::sync::Mutex;
use std::time::Duration;
use uuid::Uuid;

pub struct Journal {
    conn: Mutex<Connection>,
}

impl Journal {
    pub fn open(path: &Path) -> Result<Self> {
        let conn = db::open(path)?;
        let journal = Self {
            conn: Mutex::new(conn),
        };
        journal.ensure_demo()?;
        Ok(journal)
    }

    fn lock(&self) -> Result<std::sync::MutexGuard<'_, Connection>> {
        self.conn.lock().map_err(|_| anyhow::anyhow!("database lock poisoned"))
    }

    fn ensure_demo(&self) -> Result<()> {
        let conn = self.lock()?;
        let count: i64 = conn.query_row("select count(*) from trading_accounts", [], |r| r.get(0))?;
        if count > 0 {
            drop(conn);
            self.backfill_reviews()?;
            return Ok(());
        }
        let server = "ICMarketsSC-Demo";
        let username = "45289103";
        let trades = annotate_demo_reviews(generate_account_history(
            DEMO_ACCOUNT_ID,
            seed_from(&format!("{server}:{username}")),
            "MT5",
        ));
        let now = chrono::Utc::now().to_rfc3339();
        conn.execute(
            "insert into trading_accounts (
                id, name, server, username, investor_password, platform, status, progress,
                last_sync_at, trade_count, created_at
             ) values (?1, ?2, ?3, ?4, ?5, 'MT5', 'connected', 100, ?6, ?7, ?6)",
            params![
                DEMO_ACCOUNT_ID,
                "Main desk",
                server,
                username,
                "investor",
                now,
                trades.len() as i64
            ],
        )?;
        drop(conn);
        self.insert_trades(&trades, false)?;
        Ok(())
    }

    fn backfill_reviews(&self) -> Result<()> {
        let conn = self.lock()?;
        let tagged: Option<String> = conn
            .query_row(
                "select id from trades where grade <> '' limit 1",
                [],
                |r| r.get(0),
            )
            .optional()?;
        if tagged.is_some() {
            return Ok(());
        }
        drop(conn);
        let trades = self.load_trades()?;
        if trades.is_empty() {
            return Ok(());
        }
        let reviewed = annotate_demo_reviews(trades);
        let conn = self.lock()?;
        for t in reviewed {
            conn.execute(
                "update trades set setup = ?1, grade = ?2, emotion = ?3 where id = ?4",
                params![t.setup, t.grade, serde_json::to_string(&t.emotions)?, t.id],
            )?;
        }
        Ok(())
    }

    pub fn load(&self) -> Result<JournalState> {
        Ok(JournalState {
            accounts: self.load_accounts()?,
            trades: self.load_trades()?,
        })
    }

    fn load_accounts(&self) -> Result<Vec<TradingAccount>> {
        let conn = self.lock()?;
        let mut stmt = conn.prepare(
            "select id, name, server, username, platform, status, progress, last_sync_at,
                    error_message, trade_count, created_at
             from trading_accounts order by created_at asc",
        )?;
        let rows = stmt.query_map([], map_account)?;
        rows.collect::<rusqlite::Result<Vec<_>>>().map_err(Into::into)
    }

    fn load_trades(&self) -> Result<Vec<Trade>> {
        let conn = self.lock()?;
        let mut stmt = conn.prepare(
            "select id, account_id, symbol, asset_class, side, qty, entry_price, exit_price,
                    entry_at, exit_at, fees, pnl, setup, tags, notes, grade, emotion, platform
             from trades order by exit_at desc",
        )?;
        let rows = stmt.query_map([], map_trade)?;
        rows.collect::<rusqlite::Result<Vec<_>>>().map_err(Into::into)
    }

    pub fn connect(&self, input: ConnectInput) -> Result<TradingAccount> {
        let name = input.name.trim();
        let server = input.server.trim();
        let username = input.username.trim();
        if name.is_empty() || server.len() < 2 || username.len() < 2 || input.password.len() < 4 {
            bail!("Name, server, login, and investor password are required.");
        }
        let platform = if input.platform == "MT4" { "MT4" } else { "MT5" };
        let conn = self.lock()?;
        let dup: Option<String> = conn
            .query_row(
                "select id from trading_accounts where server = ?1 and username = ?2",
                params![server, username],
                |r| r.get(0),
            )
            .optional()?;
        if dup.is_some() {
            bail!("That login is already on the desk.");
        }
        let id = Uuid::new_v4().to_string();
        let now = chrono::Utc::now().to_rfc3339();
        conn.execute(
            "insert into trading_accounts (
                id, name, server, username, investor_password, platform, status, progress, created_at
             ) values (?1, ?2, ?3, ?4, ?5, ?6, 'connecting', 8, ?7)",
            params![id, name, server, username, input.password, platform, now],
        )?;
        drop(conn);
        self.load_accounts()?
            .into_iter()
            .find(|a| a.id == id)
            .context("account missing after insert")
    }

    pub fn rename(&self, id: &str, name: &str) -> Result<JournalState> {
        let name = name.trim();
        if name.is_empty() {
            bail!("Name is required.");
        }
        self.lock()?.execute(
            "update trading_accounts set name = ?1 where id = ?2",
            params![name, id],
        )?;
        self.load()
    }

    pub fn delete_account(&self, id: &str) -> Result<JournalState> {
        self.lock()?
            .execute("delete from trading_accounts where id = ?1", params![id])?;
        self.load()
    }

    pub fn upsert_trade(&self, trade: Trade) -> Result<JournalState> {
        self.insert_trades(std::slice::from_ref(&trade), true)?;
        self.refresh_count(&trade.account_id)?;
        self.load()
    }

    pub fn remove_trade(&self, id: &str) -> Result<JournalState> {
        let conn = self.lock()?;
        let account_id: Option<String> = conn
            .query_row("select account_id from trades where id = ?1", params![id], |r| r.get(0))
            .optional()?;
        conn.execute("delete from trades where id = ?1", params![id])?;
        drop(conn);
        if let Some(account_id) = account_id {
            self.refresh_count(&account_id)?;
        }
        self.load()
    }

    pub fn import_trades(&self, account_id: &str, mut trades: Vec<Trade>, mode: &str) -> Result<JournalState> {
        if mode == "replace" {
            self.lock()?
                .execute("delete from trades where account_id = ?1", params![account_id])?;
        }
        for t in &mut trades {
            t.account_id = account_id.into();
            if t.id.is_empty() {
                t.id = Uuid::new_v4().to_string();
            }
        }
        self.insert_trades(&trades, false)?;
        let conn = self.lock()?;
        conn.execute(
            "update trading_accounts
             set trade_count = (select count(*) from trades where account_id = ?1),
                 last_sync_at = ?2
             where id = ?1",
            params![account_id, chrono::Utc::now().to_rfc3339()],
        )?;
        drop(conn);
        self.load()
    }

    pub fn set_progress(&self, id: &str, status: &str, progress: i64, error: Option<&str>) -> Result<()> {
        self.lock()?.execute(
            "update trading_accounts set status = ?1, progress = ?2, error_message = ?3 where id = ?4",
            params![status, progress, error, id],
        )?;
        Ok(())
    }

    pub fn pull_history(&self, account_id: &str) -> Result<()> {
        let accounts = self.load_accounts()?;
        let Some(account) = accounts.into_iter().find(|a| a.id == account_id) else {
            return Ok(());
        };
        let run = || -> Result<()> {
            self.set_progress(account_id, "connecting", 12, None)?;
            std::thread::sleep(Duration::from_millis(700));
            self.set_progress(account_id, "syncing", 38, None)?;
            std::thread::sleep(Duration::from_millis(800));
            self.set_progress(account_id, "syncing", 62, None)?;

            let platform = if account.platform == "MT4" { "MT4" } else { "MT5" };
            let seed = seed_from(&format!("{}:{}", account.server, account.username));
            let trades = generate_account_history(account_id, seed, platform);
            self.upsert_server_fills(&trades)?;
            std::thread::sleep(Duration::from_millis(500));

            self.lock()?.execute(
                "update trading_accounts
                 set status = 'connected',
                     progress = 100,
                     last_sync_at = ?1,
                     trade_count = (select count(*) from trades where account_id = ?2),
                     error_message = null
                 where id = ?2",
                params![chrono::Utc::now().to_rfc3339(), account_id],
            )?;
            Ok(())
        };
        if let Err(err) = run() {
            let _ = self.set_progress(account_id, "error", 0, Some(&err.to_string()));
            return Err(err);
        }
        Ok(())
    }

    fn refresh_count(&self, account_id: &str) -> Result<()> {
        self.lock()?.execute(
            "update trading_accounts
             set trade_count = (select count(*) from trades where account_id = ?1)
             where id = ?1",
            params![account_id],
        )?;
        Ok(())
    }

    fn insert_trades(&self, trades: &[Trade], replace: bool) -> Result<()> {
        let conn = self.lock()?;
        let sql = if replace {
            "insert into trades (
                id, account_id, symbol, asset_class, side, qty, entry_price, exit_price,
                entry_at, exit_at, fees, pnl, setup, tags, notes, grade, emotion, platform, created_at
             ) values (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14,?15,?16,?17,?18,?19)
             on conflict(id) do update set
                symbol=excluded.symbol, asset_class=excluded.asset_class, side=excluded.side,
                qty=excluded.qty, entry_price=excluded.entry_price, exit_price=excluded.exit_price,
                entry_at=excluded.entry_at, exit_at=excluded.exit_at, fees=excluded.fees, pnl=excluded.pnl,
                setup=excluded.setup, tags=excluded.tags, notes=excluded.notes, grade=excluded.grade,
                emotion=excluded.emotion, platform=excluded.platform"
        } else {
            "insert into trades (
                id, account_id, symbol, asset_class, side, qty, entry_price, exit_price,
                entry_at, exit_at, fees, pnl, setup, tags, notes, grade, emotion, platform, created_at
             ) values (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14,?15,?16,?17,?18,?19)
             on conflict(id) do nothing"
        };
        let now = chrono::Utc::now().to_rfc3339();
        let mut stmt = conn.prepare(sql)?;
        for t in trades {
            stmt.execute(params![
                t.id,
                t.account_id,
                t.symbol,
                t.asset_class,
                t.side,
                t.qty,
                t.entry_price,
                t.exit_price,
                t.entry_at,
                t.exit_at,
                t.fees,
                t.pnl,
                t.setup,
                serde_json::to_string(&t.tags)?,
                t.notes,
                t.grade,
                serde_json::to_string(&t.emotions)?,
                t.platform,
                now,
            ])?;
        }
        Ok(())
    }

    fn upsert_server_fills(&self, trades: &[Trade]) -> Result<()> {
        let conn = self.lock()?;
        let mut stmt = conn.prepare(
            "insert into trades (
                id, account_id, symbol, asset_class, side, qty, entry_price, exit_price,
                entry_at, exit_at, fees, pnl, setup, tags, notes, grade, emotion, platform, created_at
             ) values (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14,?15,?16,?17,?18,?19)
             on conflict(id) do update set
                symbol=excluded.symbol, asset_class=excluded.asset_class, side=excluded.side,
                qty=excluded.qty, entry_price=excluded.entry_price, exit_price=excluded.exit_price,
                entry_at=excluded.entry_at, exit_at=excluded.exit_at, fees=excluded.fees, pnl=excluded.pnl,
                platform=excluded.platform",
        )?;
        let now = chrono::Utc::now().to_rfc3339();
        for t in trades {
            stmt.execute(params![
                t.id,
                t.account_id,
                t.symbol,
                t.asset_class,
                t.side,
                t.qty,
                t.entry_price,
                t.exit_price,
                t.entry_at,
                t.exit_at,
                t.fees,
                t.pnl,
                t.setup,
                serde_json::to_string(&t.tags)?,
                t.notes,
                t.grade,
                serde_json::to_string(&t.emotions)?,
                t.platform,
                now,
            ])?;
        }
        Ok(())
    }
}

fn map_account(row: &rusqlite::Row<'_>) -> rusqlite::Result<TradingAccount> {
    Ok(TradingAccount {
        id: row.get(0)?,
        name: row.get(1)?,
        server: row.get(2)?,
        username: row.get(3)?,
        platform: row.get::<_, String>(4).unwrap_or_else(|_| "MT5".into()),
        status: row.get(5)?,
        progress: row.get(6)?,
        last_sync_at: row.get(7)?,
        error_message: row.get(8)?,
        trade_count: row.get(9)?,
        created_at: row.get(10)?,
    })
}

fn map_trade(row: &rusqlite::Row<'_>) -> rusqlite::Result<Trade> {
    let tags: String = row.get(13)?;
    let emotion: String = row.get(16)?;
    Ok(Trade {
        id: row.get(0)?,
        account_id: row.get(1)?,
        symbol: row.get(2)?,
        asset_class: row.get(3)?,
        side: row.get(4)?,
        qty: row.get(5)?,
        entry_price: row.get(6)?,
        exit_price: row.get(7)?,
        entry_at: row.get(8)?,
        exit_at: row.get(9)?,
        fees: row.get(10)?,
        pnl: row.get(11)?,
        setup: row.get(12)?,
        tags: serde_json::from_str(&tags).unwrap_or_default(),
        notes: row.get(14)?,
        grade: row.get(15)?,
        emotions: serde_json::from_str(&emotion).unwrap_or_else(|_| {
            if emotion.is_empty() {
                Vec::new()
            } else {
                vec![emotion]
            }
        }),
        platform: row.get(17)?,
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::seed::seed_from;

    fn tmp_journal() -> Journal {
        let path = std::env::temp_dir().join(format!("dj-{}.sqlite", Uuid::new_v4()));
        Journal::open(&path).unwrap()
    }

    #[test]
    fn seed_from_matches_fnv_style() {
        assert_eq!(seed_from("dj-reviews"), {
            let mut h: u32 = 2_166_136_261;
            for ch in "dj-reviews".encode_utf16() {
                h ^= ch as u32;
                h = h.wrapping_mul(16_777_619);
            }
            h
        });
    }

    #[test]
    fn demo_seeds_and_reviews() {
        let j = tmp_journal();
        let state = j.load().unwrap();
        assert_eq!(state.accounts.len(), 1);
        assert!(state.trades.len() > 50);
        assert!(state.trades.iter().any(|t| !t.grade.is_empty()));
    }

    #[test]
    fn sync_keeps_journal_fields() {
        let j = tmp_journal();
        let state = j.load().unwrap();
        let id = state.trades[0].id.clone();
        let account_id = state.trades[0].account_id.clone();
        j.lock()
            .unwrap()
            .execute(
                "update trades set grade = 'A', notes = 'held the plan', emotion = '[\"calm\"]' where id = ?1",
                params![id],
            )
            .unwrap();
        j.upsert_server_fills(&generate_account_history(
            &account_id,
            seed_from("ICMarketsSC-Demo:45289103"),
            "MT5",
        ))
        .unwrap();
        let after = j.load_trades().unwrap();
        let t = after.iter().find(|t| t.id == id).unwrap();
        assert_eq!(t.grade, "A");
        assert_eq!(t.notes, "held the plan");
        assert_eq!(t.emotions, vec!["calm"]);
    }

    #[test]
    fn duplicate_login_rejected() {
        let j = tmp_journal();
        let err = j
            .connect(ConnectInput {
                name: "Copy".into(),
                server: "ICMarketsSC-Demo".into(),
                username: "45289103".into(),
                password: "investor".into(),
                platform: "MT5".into(),
            })
            .unwrap_err();
        assert!(err.to_string().contains("already"));
    }

    #[test]
    fn delete_account_cascades() {
        let j = tmp_journal();
        j.delete_account(DEMO_ACCOUNT_ID).unwrap();
        let state = j.load().unwrap();
        // empty book re-seeds? we only seed on open. load after delete should be empty.
        assert!(state.accounts.is_empty());
        assert!(state.trades.is_empty());
    }
}
