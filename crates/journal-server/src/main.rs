use axum::extract::State;
use axum::http::{Method, StatusCode};
use axum::routing::{get, post};
use axum::{Json, Router};
use journal_core::{ConnectInput, ImportRequest, Journal, JournalState, Trade};
use serde::Deserialize;
use std::collections::HashMap;
use std::path::PathBuf;
use std::sync::Arc;
use tokio::sync::Mutex;
use tower_http::cors::{Any, CorsLayer};

struct AppState {
    journal: Journal,
    jobs: Mutex<HashMap<String, ()>>,
}

type Shared = Arc<AppState>;

#[derive(Deserialize)]
struct IdBody {
    id: String,
}

#[derive(Deserialize)]
struct RenameBody {
    id: String,
    name: String,
}

fn db_path() -> PathBuf {
    if let Ok(path) = std::env::var("DUCKJOURNAL_DB") {
        return PathBuf::from(path);
    }
    if let Some(home) = std::env::var_os("HOME") {
        return PathBuf::from(home).join(".local/share/duckjournal/duckjournal.sqlite");
    }
    PathBuf::from("data/duckjournal.sqlite")
}

fn listen_addr() -> String {
    std::env::var("DUCKJOURNAL_API").unwrap_or_else(|_| "127.0.0.1:8787".into())
}

#[tokio::main]
async fn main() {
    let path = db_path();
    let journal = Journal::open(&path).expect("open sqlite");
    eprintln!("DuckJournal API sqlite={}", path.display());
    let state = Arc::new(AppState {
        journal,
        jobs: Mutex::new(HashMap::new()),
    });

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST, Method::OPTIONS])
        .allow_headers(Any);

    let app = Router::new()
        .route("/api/health", get(health))
        .route("/api/journal", get(load))
        .route("/api/accounts", post(connect))
        .route("/api/accounts/sync", post(sync))
        .route("/api/accounts/rename", post(rename))
        .route("/api/accounts/delete", post(delete_account))
        .route("/api/trades/upsert", post(upsert_trade))
        .route("/api/trades/delete", post(delete_trade))
        .route("/api/trades/import", post(import_trades))
        .with_state(state)
        .layer(cors);

    let addr = listen_addr();
    let listener = tokio::net::TcpListener::bind(&addr)
        .await
        .unwrap_or_else(|e| panic!("bind {addr}: {e}"));
    eprintln!("DuckJournal API listening on {addr}");
    axum::serve(listener, app).await.expect("serve");
}

async fn health() -> &'static str {
    "ok"
}

fn fail(err: anyhow::Error) -> (StatusCode, String) {
    (StatusCode::BAD_REQUEST, err.to_string())
}

async fn load(State(state): State<Shared>) -> Result<Json<JournalState>, (StatusCode, String)> {
    state.journal.load().map(Json).map_err(fail)
}

async fn connect(
    State(state): State<Shared>,
    Json(input): Json<ConnectInput>,
) -> Result<Json<journal_core::TradingAccount>, (StatusCode, String)> {
    let account = state.journal.connect(input).map_err(fail)?;
    spawn_pull(state, account.id.clone());
    Ok(Json(account))
}

async fn sync(
    State(state): State<Shared>,
    Json(body): Json<IdBody>,
) -> Result<Json<JournalState>, (StatusCode, String)> {
    spawn_pull(state.clone(), body.id);
    state.journal.load().map(Json).map_err(fail)
}

fn spawn_pull(state: Shared, id: String) {
    tokio::spawn(async move {
        {
            let mut jobs = state.jobs.lock().await;
            if jobs.contains_key(&id) {
                return;
            }
            jobs.insert(id.clone(), ());
        }
        let state2 = state.clone();
        let account_id = id.clone();
        let _ = tokio::task::spawn_blocking(move || state2.journal.pull_history(&account_id)).await;
        state.jobs.lock().await.remove(&id);
    });
}

async fn rename(
    State(state): State<Shared>,
    Json(body): Json<RenameBody>,
) -> Result<Json<JournalState>, (StatusCode, String)> {
    state.journal.rename(&body.id, &body.name).map(Json).map_err(fail)
}

async fn delete_account(
    State(state): State<Shared>,
    Json(body): Json<IdBody>,
) -> Result<Json<JournalState>, (StatusCode, String)> {
    state.journal.delete_account(&body.id).map(Json).map_err(fail)
}

async fn upsert_trade(
    State(state): State<Shared>,
    Json(trade): Json<Trade>,
) -> Result<Json<JournalState>, (StatusCode, String)> {
    state.journal.upsert_trade(trade).map(Json).map_err(fail)
}

async fn delete_trade(
    State(state): State<Shared>,
    Json(body): Json<IdBody>,
) -> Result<Json<JournalState>, (StatusCode, String)> {
    state.journal.remove_trade(&body.id).map(Json).map_err(fail)
}

async fn import_trades(
    State(state): State<Shared>,
    Json(body): Json<ImportRequest>,
) -> Result<Json<JournalState>, (StatusCode, String)> {
    state
        .journal
        .import_trades(&body.account_id, body.trades, &body.mode)
        .map(Json)
        .map_err(fail)
}
