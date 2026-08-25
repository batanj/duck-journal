# DuckJournal

Local-first trading journal. One window, one SQLite file, no cloud database.

Connect MT4/MT5 desks, import broker reports, grade fills, and read combined P&L, calendar, and process stats. Builds as a **Windows** installer or a **Linux** AppImage / `.deb`.

![DuckJournal overview](screenshots/rust-overview.png)

## What it does

- **Overview** — combined P&L, equity, daily bars, recent fills across every account
- **Fills** — blotter with inspector: setup, process grade, emotions, notes, chart with entry / SL / TP
- **Calendar** — heatmap of the book
- **Analytics** — edge plus process (reviewed %, A/B rate, C–F leak, grade and emotion tables)
- **Accounts** — add desks (MT4 or MT5), sync, rename, remove
- **Import** — Generic CSV, MetaTrader 4, and MetaTrader 5 (`Save as Report` HTML or CSV)
- **Settings** — dark / light / system, playbook setups, CSV export of the book

Overview is always all accounts. Fills, calendar, and analytics can focus on one desk.

## Stack

| Layer | Tech |
|---|---|
| Desktop | [Tauri 2](https://tauri.app/) |
| UI | React, TanStack Router, Tailwind CSS |
| Engine | Rust + SQLite (`crates/journal-core`) |
| Windows data | `%APPDATA%\com.duckjournal.desk\duckjournal.sqlite` |
| Linux data | `~/.local/share/com.duckjournal.desk/duckjournal.sqlite` |

No Postgres server. No DuckDB. Copy the `.sqlite` file to back up.

## Requirements

Shared:

- [Node.js 22+](https://nodejs.org/)
- [Rust](https://rustup.rs/) (stable)

**Windows:** WebView2 (already on 10/11) and [VS Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) with **Desktop development with C++**.

**Linux (Debian/Ubuntu):**

```bash
sudo apt update
sudo apt install -y libwebkit2gtk-4.1-dev build-essential curl wget file \
  libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev \
  libgtk-3-dev patchelf
```

**Linux (Fedora):**

```bash
sudo dnf install -y webkit2gtk4.1-devel openssl-devel curl wget file \
  gtk3-devel libappindicator-gtk3-devel librsvg2-devel xdotool
```

**Linux (Arch):**

```bash
sudo pacman -Syu --needed webkit2gtk-4.1 base-devel curl wget file openssl \
  gtk3 libappindicator-gtk3 librsvg xdotool patchelf appmenu-gtk-module
```

Build **on** the OS you want to ship. Windows → NSIS. Debian/Fedora → AppImage + `.deb`. Arch → **AppImage** (skip the `.deb`).

## Run

```bash
npm install
npm run desktop
```

Do **not** run `npx tauri` — that is a different npm package. Use `npm run desktop` or `npx @tauri-apps/cli`.

## Build

Current machine, current OS:

```bash
npm run desktop:build
```

Or pick a bundle:

```bash
npm run desktop:build:windows   # NSIS, run on Windows
npm run desktop:build:linux     # AppImage + .deb
npm run desktop:build:arch      # AppImage only (Arch)
```

| OS | Output |
|---|---|
| Windows | `src-tauri/target/release/DuckJournal.exe` |
| Windows | `src-tauri/target/release/bundle/nsis/` |
| Linux | `src-tauri/target/release/bundle/appimage/` |
| Debian/Ubuntu | `src-tauri/target/release/bundle/deb/` |

To update, build again and install over the old copy. The journal file in AppData / `.local/share` is left alone.

Full compile notes: [COMPILE.md](COMPILE.md).

## Use

1. **Accounts → Add account** — pick MT4 or MT5, then name, server, login, investor password.
2. MetaTrader should be **open and signed in** as that login. Investor password is read-only.
3. Click a fill to tag the setup, grade the process, and tick emotions. Sync keeps those fields.
4. **Import** for a real MT4/MT5 HTML report or CSV if you are not pulling from the terminal.
5. Deletes ask for confirm. Syncing an account again can restore a deleted fill; notes on it will not.

This build **simulates** the broker handshake so you can journal without a live MT bridge. Import is the path for real history today.

## Layout

```
src/                  React dashboard
crates/journal-core   SQLite journal engine
crates/journal-server Local HTTP API (browser / preview)
src-tauri/            Desktop shell (Windows + Linux)
```

## License

MIT
