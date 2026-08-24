use serde::{Deserialize, Serialize};

pub const DEMO_ACCOUNT_ID: &str = "acc-main";

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TradingAccount {
    pub id: String,
    pub name: String,
    pub server: String,
    pub username: String,
    pub platform: String,
    pub status: String,
    pub progress: i64,
    pub last_sync_at: Option<String>,
    pub error_message: Option<String>,
    pub trade_count: i64,
    pub created_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Trade {
    pub id: String,
    pub account_id: String,
    pub symbol: String,
    pub asset_class: String,
    pub side: String,
    pub qty: f64,
    pub entry_price: f64,
    pub exit_price: f64,
    pub entry_at: String,
    pub exit_at: String,
    pub fees: f64,
    pub pnl: f64,
    #[serde(default)]
    pub setup: String,
    #[serde(default)]
    pub tags: Vec<String>,
    #[serde(default)]
    pub notes: String,
    #[serde(default)]
    pub grade: String,
    #[serde(default)]
    pub emotions: Vec<String>,
    #[serde(default)]
    pub platform: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct JournalState {
    pub accounts: Vec<TradingAccount>,
    pub trades: Vec<Trade>,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ConnectInput {
    pub name: String,
    pub server: String,
    pub username: String,
    pub password: String,
    pub platform: String,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ImportRequest {
    pub account_id: String,
    pub trades: Vec<Trade>,
    pub mode: String,
}

