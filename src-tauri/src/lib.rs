use journal_core::{ConnectInput, ImportRequest, Journal, JournalState, Trade, TradingAccount};
use serde::Deserialize;
use std::sync::Mutex;
use tauri::{Manager, State};

struct AppJournal(Journal);
struct Jobs(Mutex<std::collections::HashSet<String>>);

#[derive(Deserialize)]
struct IdBody {
    id: String,
}

#[derive(Deserialize)]
struct RenameBody {
    id: String,
    name: String,
}

fn map_err(err: anyhow::Error) -> String {
    err.to_string()
}

#[tauri::command]
fn load_journal(journal: State<AppJournal>) -> Result<JournalState, String> {
    journal.0.load().map_err(map_err)
}

#[tauri::command]
fn connect_account(
    app: tauri::AppHandle,
    journal: State<AppJournal>,
    jobs: State<Jobs>,
    input: ConnectInput,
) -> Result<TradingAccount, String> {
    let account = journal.0.connect(input).map_err(map_err)?;
    spawn_pull(app, account.id.clone(), jobs);
    Ok(account)
}

#[tauri::command]
fn sync_account(
    app: tauri::AppHandle,
    journal: State<AppJournal>,
    jobs: State<Jobs>,
    body: IdBody,
) -> Result<JournalState, String> {
    spawn_pull(app, body.id, jobs);
    journal.0.load().map_err(map_err)
}

fn spawn_pull(app: tauri::AppHandle, id: String, jobs: State<Jobs>) {
    {
        let mut set = jobs.0.lock().expect("jobs");
        if !set.insert(id.clone()) {
            return;
        }
    }
    std::thread::spawn(move || {
        if let Some(journal) = app.try_state::<AppJournal>() {
            let _ = journal.0.pull_history(&id);
        }
        if let Some(jobs) = app.try_state::<Jobs>() {
            jobs.0.lock().expect("jobs").remove(&id);
        }
    });
}

#[tauri::command]
fn rename_account(journal: State<AppJournal>, body: RenameBody) -> Result<JournalState, String> {
    journal.0.rename(&body.id, &body.name).map_err(map_err)
}

#[tauri::command]
fn delete_account(journal: State<AppJournal>, body: IdBody) -> Result<JournalState, String> {
    journal.0.delete_account(&body.id).map_err(map_err)
}

#[tauri::command]
fn upsert_trade(journal: State<AppJournal>, trade: Trade) -> Result<JournalState, String> {
    journal.0.upsert_trade(trade).map_err(map_err)
}

#[tauri::command]
fn remove_trade(journal: State<AppJournal>, body: IdBody) -> Result<JournalState, String> {
    journal.0.remove_trade(&body.id).map_err(map_err)
}

#[tauri::command]
fn import_trades(journal: State<AppJournal>, body: ImportRequest) -> Result<JournalState, String> {
    journal
        .0
        .import_trades(&body.account_id, body.trades, &body.mode)
        .map_err(map_err)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let dir = app.path().app_data_dir()?;
            std::fs::create_dir_all(&dir)?;
            let db = dir.join("duckjournal.sqlite");
            let journal = Journal::open(&db).map_err(|e| e.to_string())?;
            app.manage(AppJournal(journal));
            app.manage(Jobs(Mutex::new(std::collections::HashSet::new())));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            load_journal,
            connect_account,
            sync_account,
            rename_account,
            delete_account,
            upsert_trade,
            remove_trade,
            import_trades
        ])
        .run(tauri::generate_context!())
        .expect("error while running DuckJournal");
}
