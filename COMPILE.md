# DuckJournal — compile and use

DuckJournal is a **local trading journal**. The desktop app is a Windows `.exe` (Rust + Tauri + SQLite). There is no cloud database and no extra Postgres install.

The same React dashboard also runs in a browser against a local Rust API — useful while developing.

## What you need (Windows)

1. [Rust](https://rustup.rs/) (stable)
2. [Node.js 22+](https://nodejs.org/)
3. WebView2 — already on Windows 10/11
4. Visual Studio Build Tools with the **Desktop development with C++** workload (MSVC), required to compile Rust on Windows

If `link.exe` is missing, install [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/).

## Install once

From the project folder:

```bat
npm install
```

That pulls `@tauri-apps/cli`. Do **not** run `npx tauri` — that hits an unrelated npm package named `tauri` and fails with `could not determine executable to run`.

## Run in a window (daily use)

```bat
npm run desktop
```

A DuckJournal window opens. Data is stored here:

```
%APPDATA%\com.duckjournal.desk\duckjournal.sqlite
```

Copy that file to back up the book.

## Build the Windows installer

```bat
npm run desktop:build
```

Same thing, explicitly:

```bat
npx @tauri-apps/cli build
```

Output:

- `src-tauri\target\release\DuckJournal.exe` — portable executable
- `src-tauri\target\release\bundle\nsis\` — NSIS installer

Install it like any Windows app. MetaTrader can stay in its own folder; DuckJournal does not replace the terminal.

Optional (Rust CLI instead of npm):

```bat
cargo install tauri-cli --locked --version "^2"
cargo tauri build
```

Icons are under `src-tauri/icons`. To remake them from a PNG:

```bat
npx @tauri-apps/cli icon src-tauri/icons/icon.png
```

## Use the journal

1. **Accounts** → **Add account** → pick MT4 or MT5, then name, server, login, investor password → **Connect**.
2. The terminal for that login should be **open and signed in** as that account. Investor password is enough (read-only). A terminal logged into a different account cannot see this one.
3. History is pulled in the background. This build **simulates** the broker handshake so you can journal without a live bridge. A later native MT bridge would use the same form.
4. **Overview** is every account combined. **Fills / Calendar / Analytics** can focus on one desk.
5. Click a fill to grade it, tag the setup, and tick emotions. Sync **keeps** those fields.
6. **Import** accepts MT4/MT5 **Save as Report** (HTML) or CSV. Excel `.xlsx` — save as CSV first.
7. Theme and playbook live in **Settings**.

Deleting a fill asks for confirm. Syncing that account again can bring the fill back; your notes on it will not.

## Browser / local API (optional)

If you only want the site in a browser:

```bat
set DUCKJOURNAL_DB=%USERPROFILE%\duckjournal.sqlite
set DUCKJOURNAL_API=127.0.0.1:8787
cargo run -p journal-server --release
npm run dev
```

Then open the Vite URL (this repo binds `0.0.0.0:8080` for the live preview). The UI talks to `/api`, which proxies to the Rust process.

## Project map

| Piece | Where |
|---|---|
| Dashboard (React) | `src/` |
| Journal engine + SQLite | `crates/journal-core` |
| HTTP API (browser / preview) | `crates/journal-server` |
| Windows shell | `src-tauri/` |
| Database file | SQLite next to the app data dir |

No DuckDB. No Postgres server. One SQLite file is the book.
