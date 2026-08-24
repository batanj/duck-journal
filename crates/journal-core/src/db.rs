use anyhow::Result;
use rusqlite::Connection;
use std::path::Path;

pub fn open(path: &Path) -> Result<Connection> {
    if let Some(parent) = path.parent() {
        std::fs::create_dir_all(parent)?;
    }
    let conn = Connection::open(path)?;
    conn.execute_batch(
        r#"
        PRAGMA foreign_keys = ON;
        PRAGMA journal_mode = WAL;
        PRAGMA busy_timeout = 5000;

        CREATE TABLE IF NOT EXISTS trading_accounts (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          server TEXT NOT NULL,
          username TEXT NOT NULL,
          investor_password TEXT NOT NULL,
          platform TEXT NOT NULL DEFAULT 'MT5',
          status TEXT NOT NULL DEFAULT 'connecting',
          progress INTEGER NOT NULL DEFAULT 0,
          last_sync_at TEXT,
          error_message TEXT,
          trade_count INTEGER NOT NULL DEFAULT 0,
          created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS trades (
          id TEXT PRIMARY KEY,
          account_id TEXT NOT NULL REFERENCES trading_accounts(id) ON DELETE CASCADE,
          symbol TEXT NOT NULL,
          asset_class TEXT NOT NULL,
          side TEXT NOT NULL,
          qty REAL NOT NULL,
          entry_price REAL NOT NULL,
          exit_price REAL NOT NULL,
          entry_at TEXT NOT NULL,
          exit_at TEXT NOT NULL,
          fees REAL NOT NULL DEFAULT 0,
          pnl REAL NOT NULL,
          setup TEXT NOT NULL DEFAULT '',
          tags TEXT NOT NULL DEFAULT '[]',
          notes TEXT NOT NULL DEFAULT '',
          grade TEXT NOT NULL DEFAULT '',
          emotion TEXT NOT NULL DEFAULT '[]',
          platform TEXT NOT NULL DEFAULT '',
          created_at TEXT NOT NULL
        );

        CREATE INDEX IF NOT EXISTS trades_account_id_idx ON trades (account_id);
        CREATE INDEX IF NOT EXISTS trades_exit_at_idx ON trades (exit_at);
        "#,
    )?;
    Ok(conn)
}
