# DuckJournal — compile and use

DuckJournal is a **local trading journal**. The desktop app is Rust + Tauri + SQLite. There is no cloud database and no extra Postgres install.

Build **on the OS you want to ship**: Windows → NSIS / `.exe`. Linux → AppImage / `.deb`.

The same React dashboard also runs in a browser against a local Rust API — useful while developing.

## What you need

Shared:

1. [Rust](https://rustup.rs/) (stable)
2. [Node.js 22+](https://nodejs.org/)

**Windows**

3. WebView2 — already on Windows 10/11
4. Visual Studio Build Tools with the **Desktop development with C++** workload (MSVC)

If `link.exe` is missing, install [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/).

**Linux (Debian/Ubuntu)**

```bash
sudo apt update
sudo apt install -y libwebkit2gtk-4.1-dev build-essential curl wget file \
  libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev \
  libgtk-3-dev patchelf
```

**Linux (Fedora)**

```bash
sudo dnf install -y webkit2gtk4.1-devel openssl-devel curl wget file \
  gtk3-devel libappindicator-gtk3-devel librsvg2-devel xdotool
```

**Linux (Arch)**

```bash
sudo pacman -Syu --needed webkit2gtk-4.1 base-devel curl wget file openssl \
  gtk3 libappindicator-gtk3 librsvg xdotool patchelf appmenu-gtk-module
```

Node on Arch: `sudo pacman -S nodejs npm` (or nvm / fnm if you want 22+ pinned). Rust: [rustup](https://rustup.rs/), not the `rust` pacman package.

## Install once

From the project folder:

```bash
npm install
```

That pulls `@tauri-apps/cli`. Do **not** run `npx tauri` — that hits an unrelated npm package named `tauri` and fails with `could not determine executable to run`.

## Run in a window (daily use)

```bash
npm run desktop
```

Data lives here:

| OS | Journal file |
|---|---|
| Windows | `%APPDATA%\com.duckjournal.desk\duckjournal.sqlite` |
| Linux | `~/.local/share/com.duckjournal.desk/duckjournal.sqlite` |

Copy that file to back up the book.

## Build

Current OS (whatever you are on):

```bash
npm run desktop:build
```

Linux only (AppImage + `.deb`):

```bash
npm run desktop:build:linux
```

Arch (AppImage only — Arch will not install a `.deb`):

```bash
npm run desktop:build:arch
```

Windows only (NSIS):

```bash
npm run desktop:build:windows
```

Same thing, explicitly:

```bash
npx @tauri-apps/cli build
npx @tauri-apps/cli build --bundles appimage,deb
npx @tauri-apps/cli build --bundles appimage
npx @tauri-apps/cli build --bundles nsis
```

Output:

- Windows: `src-tauri/target/release/DuckJournal.exe`
- Windows installer: `src-tauri/target/release/bundle/nsis/`
- Linux AppImage: `src-tauri/target/release/bundle/appimage/`
- Linux `.deb`: `src-tauri/target/release/bundle/deb/`

On Arch and most distros, `chmod +x` the AppImage and run it. On Debian/Ubuntu you can also install the `.deb`:

```bash
sudo dpkg -i src-tauri/target/release/bundle/deb/*.deb
```

Do **not** `dpkg` the `.deb` on Arch.

MetaTrader can stay in its own folder; DuckJournal does not replace the terminal.

Optional (Rust CLI instead of npm):

```bash
cargo install tauri-cli --locked --version "^2"
cargo tauri build
```

Icons are under `src-tauri/icons`. To remake them from a PNG:

```bash
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

Linux / macOS:

```bash
export DUCKJOURNAL_DB="$HOME/.local/share/duckjournal/duckjournal.sqlite"
export DUCKJOURNAL_API=127.0.0.1:8787
cargo run -p journal-server --release
npm run dev
```

Windows:

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
| Desktop shell | `src-tauri/` |
| Database file | SQLite in the OS app-data dir |

No DuckDB. No Postgres server. One SQLite file is the book.
