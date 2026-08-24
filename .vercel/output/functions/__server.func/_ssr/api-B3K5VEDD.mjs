import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { n as DEMO_ACCOUNT_ID } from "./types-GL5ccc67.mjs";
import { n as any, o as object, r as array, s as string, t as _enum } from "../_libs/zod.mjs";
import { n as generateAccountHistory, r as seedFrom } from "./sample-data-CasQwOSK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-B3K5VEDD.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var _0002_trading_default = "create table if not exists trading_accounts (\n  id text primary key,\n  name text not null,\n  server text not null,\n  username text not null,\n  investor_password text not null,\n  status text not null default 'connecting',\n  progress integer not null default 0,\n  last_sync_at timestamptz,\n  error_message text,\n  trade_count integer not null default 0,\n  created_at timestamptz not null default now()\n);\n\ncreate table if not exists trades (\n  id text primary key,\n  account_id text not null references trading_accounts(id) on delete cascade,\n  symbol text not null,\n  asset_class text not null,\n  side text not null,\n  qty double precision not null,\n  entry_price double precision not null,\n  exit_price double precision not null,\n  entry_at timestamptz not null,\n  exit_at timestamptz not null,\n  fees double precision not null default 0,\n  pnl double precision not null,\n  setup text not null default '',\n  tags text not null default '[]',\n  notes text not null default '',\n  grade text not null default '',\n  emotion text not null default '',\n  platform text not null default '',\n  created_at timestamptz not null default now()\n);\n\ncreate index if not exists trades_account_id_idx on trades (account_id);\ncreate index if not exists trades_exit_at_idx on trades (exit_at);\n";
/**
* Migration bookkeeping shared by the two appliers — `scripts/migrate.mjs`
* (deploy, `readdir`) and `src/lib/db.ts` (PGLite preview, `import.meta.glob`).
*
* Applied files are keyed by BASENAME, so the same file applies once no matter
* which directory it is globbed from. That is what makes the auth schema safe to
* copy from `migrations/auth/` into `migrations/` when an app turns sign-in on:
* a database that already has `0001_auth.sql` will not re-run it.
*
* Neither applier descends into subdirectories, so `migrations/auth/*.sql` is
* out of scope for both until it is copied up.
*/
/**
* The `_migrations` key for a migration path (or bare filename).
* @param {string} path
* @returns {string}
*/
function migrationName(path) {
	return path.split("/").pop() ?? path;
}
/**
* @param {string} path
* @returns {boolean}
*/
function isMigrationFile(path) {
	return path.endsWith(".sql");
}
/**
* Migrations in `paths` that are not yet in `applied`, in apply order.
* Non-`.sql` entries (a `readdir` also yields `migrations/auth/`) are dropped.
* @param {Iterable<string>} paths
* @param {Iterable<string>} applied
* @returns {Array<{ name: string, path: string }>}
*/
function pendingMigrations(paths, applied) {
	const done = new Set(applied);
	return [...paths].filter(isMigrationFile).map((path) => ({
		name: migrationName(path),
		path
	})).sort((a, b) => a.name.localeCompare(b.name)).filter(({ name }) => !done.has(name));
}
var rawDatabaseUrl = typeof process !== "undefined" ? process.env.DATABASE_URL : void 0;
var databaseUrl = rawDatabaseUrl && rawDatabaseUrl.trim() ? rawDatabaseUrl : void 0;
/**
* Active backend: real **Neon** when `DATABASE_URL` is set (deployed / configured
* sandbox), otherwise a local embedded **PGLite** (Postgres compiled to WASM) so
* the app has a working database even with nothing configured — the live preview
* included. Swap in Neon later by just setting `DATABASE_URL`; no code changes.
*/
var dbSource = databaseUrl ? "neon" : "pglite";
/**
* Init state lives on globalThis as promises: dev HMR creates new instances of
* this module, and two instances racing module-level state would open a second
* pool or run two concurrent PGLite migration passes (whose duplicate
* `_migrations` insert rejects — and would get memoized, poisoning every later
* `getSql()`). A failed init clears its slot so the next call retries.
*/
var globalRef = globalThis;
/**
* Result-type parity: Postgres sends every value as text plus a type OID — the
* JS value is the DRIVER's parsing choice, and pg and PGLite disagree (pg:
* int8 -> string, date -> local-midnight Date; PGLite: int8 -> BigInt, which
* JSON.stringify rejects, date -> UTC Date). Normalize both so preview and
* production return identical, JSON-safe shapes:
*   int8/bigint (incl. count(*)) -> number (past 2^53 loses precision — cast
*                                   `::text` if you ever need huge integers)
*   date                         -> 'YYYY-MM-DD' string
*   interval                     -> Postgres interval text
* numeric already comes back as a string on both (arbitrary precision).
*/
var OID_INT8 = 20;
var OID_DATE = 1082;
var OID_INTERVAL = 1186;
var identity = (v) => v;
/** Wrap a query runner in the tagged-template + `.query()` `Sql` surface. */
function toSql(run) {
	const sql = (async (strings, ...values) => {
		let text = strings[0];
		for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
		return run(text, values);
	});
	sql.query = (text, params = []) => run(text, params);
	return sql;
}
function createNeonSql() {
	globalRef.__pgSqlPromise__ ??= (async () => {
		const { Pool, types } = await import("../_libs/pg.mjs").then((n) => n.t);
		types.setTypeParser(OID_INT8, Number);
		types.setTypeParser(OID_DATE, identity);
		types.setTypeParser(OID_INTERVAL, identity);
		const pool = new Pool({ connectionString: databaseUrl });
		return toSql(async (text, params) => {
			return (await pool.query(text, params)).rows;
		});
	})().catch((err) => {
		globalRef.__pgSqlPromise__ = void 0;
		throw err;
	});
	return globalRef.__pgSqlPromise__;
}
async function createPgliteSql() {
	globalRef.__pgliteInstance__ ??= (async () => {
		const { PGlite } = await import("../_libs/electric-sql__pglite.mjs").then((n) => n.t);
		const pg = new PGlite({ parsers: {
			[OID_INT8]: Number,
			[OID_DATE]: identity,
			[OID_INTERVAL]: identity
		} });
		await pg.waitReady;
		await pg.exec("create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())");
		return pg;
	})().catch((err) => {
		globalRef.__pgliteInstance__ = void 0;
		throw err;
	});
	const pg = await globalRef.__pgliteInstance__;
	const migrate = async () => {
		const migrations = /* #__PURE__ */ Object.assign({ "/migrations/0002_trading.sql": _0002_trading_default });
		const done = (await pg.query("select name from _migrations")).rows.map((r) => r.name);
		for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) await pg.transaction(async (tx) => {
			await tx.exec(migrations[path]);
			await tx.query("insert into _migrations (name) values ($1)", [name]);
		});
	};
	const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve()).catch(() => void 0).then(migrate);
	globalRef.__pgliteMigrateChain__ = pass;
	await pass;
	return toSql(async (text, params) => {
		return (await pg.query(text, params)).rows;
	});
}
var sqlPromise = null;
async function createSql() {
	if (typeof window !== "undefined") throw new Error("@/lib/db is server-only — call getSql() from a createServerFn handler or a server route loader, never from client code.");
	return dbSource === "neon" ? createNeonSql() : createPgliteSql();
}
/**
* Get the shared, **server-only** SQL client. Neon when `DATABASE_URL` is set,
* otherwise the local PGLite fallback. Memoized — safe to call per request.
*
* Schema comes from `migrations/*.sql`, auto-applied before the first query on
* both backends — define tables there, never inline in server functions.
*/
function getSql() {
	sqlPromise ??= createSql().catch((err) => {
		sqlPromise = null;
		throw err;
	});
	return sqlPromise;
}
/**
* Finish DB bootstrap before the server handles traffic.
*
* - **PGLite** (preview / no `DATABASE_URL`): open the in-memory DB and apply
*   `migrations/*.sql`. Idempotent — concurrent callers share one promise.
* - **Neon**: no-op (pool is created lazily on first query).
*
* Vite `configureServer` awaits this at dev startup; production imports of this
* module kick it off immediately (see bottom of file).
*/
function ensureDbReady() {
	if (dbSource !== "pglite") return Promise.resolve();
	return getSql().then(() => void 0);
}
var globalBoot = globalThis;
if (typeof window === "undefined" && dbSource === "pglite") globalBoot.__pgBootstrapPromise__ ??= ensureDbReady().catch((err) => {
	globalBoot.__pgBootstrapPromise__ = void 0;
	console.error("[db] PGLite bootstrap failed:", err);
	throw err;
});
function iso(value) {
	if (!value) return null;
	return new Date(value).toISOString();
}
function num(value) {
	return typeof value === "number" ? value : Number(value);
}
function mapAccount(row) {
	return {
		id: row.id,
		name: row.name,
		server: row.server,
		username: row.username,
		status: row.status,
		progress: Number(row.progress) || 0,
		lastSyncAt: iso(row.last_sync_at),
		errorMessage: row.error_message,
		tradeCount: Number(row.trade_count) || 0,
		createdAt: iso(row.created_at) ?? (/* @__PURE__ */ new Date()).toISOString()
	};
}
function mapTrade(row) {
	let tags = [];
	try {
		tags = JSON.parse(row.tags);
	} catch {
		tags = [];
	}
	return {
		id: row.id,
		accountId: row.account_id,
		symbol: row.symbol,
		assetClass: row.asset_class,
		side: row.side,
		qty: num(row.qty),
		entryPrice: num(row.entry_price),
		exitPrice: num(row.exit_price),
		entryAt: iso(row.entry_at) ?? "",
		exitAt: iso(row.exit_at) ?? "",
		fees: num(row.fees),
		pnl: num(row.pnl),
		setup: row.setup || "",
		tags,
		notes: row.notes,
		grade: row.grade || "",
		emotion: row.emotion || "",
		platform: row.platform
	};
}
async function insertTrades(sql, trades) {
	for (const t of trades) await sql`
      insert into trades (
        id, account_id, symbol, asset_class, side, qty, entry_price, exit_price,
        entry_at, exit_at, fees, pnl, setup, tags, notes, grade, emotion, platform
      ) values (
        ${t.id}, ${t.accountId}, ${t.symbol}, ${t.assetClass}, ${t.side}, ${t.qty},
        ${t.entryPrice}, ${t.exitPrice}, ${t.entryAt}, ${t.exitAt}, ${t.fees}, ${t.pnl},
        ${t.setup}, ${JSON.stringify(t.tags)}, ${t.notes}, ${t.grade}, ${t.emotion}, ${t.platform}
      )
      on conflict (id) do nothing
    `;
}
async function seedDemo(sql) {
	const server = "ICMarketsSC-Demo";
	const username = "45289103";
	const trades = generateAccountHistory({
		accountId: DEMO_ACCOUNT_ID,
		seed: seedFrom(`${server}:${username}`),
		platform: "MT5"
	});
	await sql`
    insert into trading_accounts (
      id, name, server, username, investor_password, status, progress, last_sync_at, trade_count
    ) values (
      ${DEMO_ACCOUNT_ID},
      ${"Main desk"},
      ${server},
      ${username},
      ${"investor"},
      ${"connected"},
      ${100},
      ${(/* @__PURE__ */ new Date()).toISOString()},
      ${trades.length}
    )
    on conflict (id) do nothing
  `;
	await insertTrades(sql, trades);
}
async function loadState() {
	const sql = await getSql();
	const accounts = await sql`
    select id, name, server, username, status, progress, last_sync_at, error_message, trade_count, created_at
    from trading_accounts
    order by created_at asc
  `;
	if (accounts.length === 0) {
		await seedDemo(sql);
		return loadState();
	}
	const trades = await sql`
    select id, account_id, symbol, asset_class, side, qty, entry_price, exit_price,
           entry_at, exit_at, fees, pnl, setup, tags, notes, grade, emotion, platform
    from trades
    order by exit_at desc
  `;
	return {
		accounts: accounts.map(mapAccount),
		trades: trades.map(mapTrade)
	};
}
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
async function setProgress(id, status, progress, error) {
	await (await getSql())`
    update trading_accounts
    set status = ${status},
        progress = ${progress},
        error_message = ${error ?? null}
    where id = ${id}
  `;
}
async function pullHistory(accountId) {
	const sql = await getSql();
	const account = (await sql`
    select id, name, server, username, status, progress, last_sync_at, error_message, trade_count, created_at
    from trading_accounts where id = ${accountId}
  `)[0];
	if (!account) return;
	try {
		await setProgress(accountId, "connecting", 12);
		await sleep(700);
		await setProgress(accountId, "syncing", 38);
		await sleep(800);
		await setProgress(accountId, "syncing", 62);
		const trades = generateAccountHistory({
			accountId,
			seed: seedFrom(`${account.server}:${account.username}`),
			platform: "MT5"
		});
		await sql`delete from trades where account_id = ${accountId}`;
		await insertTrades(sql, trades);
		await sleep(500);
		await sql`
      update trading_accounts
      set status = ${"connected"},
          progress = ${100},
          last_sync_at = ${(/* @__PURE__ */ new Date()).toISOString()},
          trade_count = ${trades.length},
          error_message = ${null}
      where id = ${accountId}
    `;
	} catch (err) {
		await setProgress(accountId, "error", 0, err instanceof Error ? err.message : "History pull failed");
	}
}
var jobs = globalThis;
function enqueuePull(accountId) {
	jobs.__djSyncJobs ??= /* @__PURE__ */ new Map();
	const existing = jobs.__djSyncJobs.get(accountId);
	if (existing) return existing;
	const task = pullHistory(accountId).finally(() => {
		jobs.__djSyncJobs?.delete(accountId);
	});
	jobs.__djSyncJobs.set(accountId, task);
	return task;
}
var loadJournal_createServerFn_handler = createServerRpc({
	id: "a3fb173d1269a1d4e8316a6c25e04a2c992d833c721239e1bd33f589086e0da0",
	name: "loadJournal",
	filename: "src/lib/journal/api.ts"
}, (opts) => loadJournal.__executeServer(opts));
var loadJournal = createServerFn({ method: "GET" }).handler(loadJournal_createServerFn_handler, async () => {
	return loadState();
});
var connectSchema = object({
	name: string().trim().min(1).max(80),
	server: string().trim().min(2).max(80),
	username: string().trim().min(2).max(40),
	password: string().min(4).max(80)
});
var connectAccount_createServerFn_handler = createServerRpc({
	id: "ab9021bea18319b6289a5ac9b14e730c8366afc9a49be162a20262af2dfa398a",
	name: "connectAccount",
	filename: "src/lib/journal/api.ts"
}, (opts) => connectAccount.__executeServer(opts));
var connectAccount = createServerFn({ method: "POST" }).validator((d) => connectSchema.parse(d)).handler(connectAccount_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	if ((await sql`
      select id from trading_accounts
      where server = ${data.server} and username = ${data.username}
    `)[0]) throw new Error("That login is already on the desk.");
	const id = crypto.randomUUID();
	await sql`
      insert into trading_accounts (
        id, name, server, username, investor_password, status, progress
      ) values (
        ${id}, ${data.name}, ${data.server}, ${data.username}, ${data.password},
        ${"connecting"}, ${8}
      )
    `;
	enqueuePull(id);
	return mapAccount((await sql`
      select id, name, server, username, status, progress, last_sync_at, error_message, trade_count, created_at
      from trading_accounts where id = ${id}
    `)[0]);
});
var idSchema = object({ id: string().min(1) });
var syncAccount_createServerFn_handler = createServerRpc({
	id: "e6f858d84e935dfb18b23d74ddd629dcda30b4025b25b4e60440ffc9369b7719",
	name: "syncAccount",
	filename: "src/lib/journal/api.ts"
}, (opts) => syncAccount.__executeServer(opts));
var syncAccount = createServerFn({ method: "POST" }).validator((d) => idSchema.parse(d)).handler(syncAccount_createServerFn_handler, async ({ data }) => {
	await enqueuePull(data.id);
	return loadState();
});
var renameSchema = object({
	id: string().min(1),
	name: string().trim().min(1).max(80)
});
var renameAccount_createServerFn_handler = createServerRpc({
	id: "30499c5ed5c90b05a26db0e7931e87f5249bdddfc7e76dbe4956418e5dd312fe",
	name: "renameAccount",
	filename: "src/lib/journal/api.ts"
}, (opts) => renameAccount.__executeServer(opts));
var renameAccount = createServerFn({ method: "POST" }).validator((d) => renameSchema.parse(d)).handler(renameAccount_createServerFn_handler, async ({ data }) => {
	await (await getSql())`update trading_accounts set name = ${data.name} where id = ${data.id}`;
	return loadState();
});
var deleteAccount_createServerFn_handler = createServerRpc({
	id: "69e50071023091405dc408875f9da6884b49d0a38bd8f698c1512c250dafc2a1",
	name: "deleteAccount",
	filename: "src/lib/journal/api.ts"
}, (opts) => deleteAccount.__executeServer(opts));
var deleteAccount = createServerFn({ method: "POST" }).validator((d) => idSchema.parse(d)).handler(deleteAccount_createServerFn_handler, async ({ data }) => {
	await (await getSql())`delete from trading_accounts where id = ${data.id}`;
	return loadState();
});
var upsertTrade_createServerFn_handler = createServerRpc({
	id: "cc46301ee0fcd9b97cf7d30cf9760651d0bfa8055f19e2570a317d3c5b549a02",
	name: "upsertTrade",
	filename: "src/lib/journal/api.ts"
}, (opts) => upsertTrade.__executeServer(opts));
var upsertTrade = createServerFn({ method: "POST" }).validator((d) => d).handler(upsertTrade_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	await sql`
      insert into trades (
        id, account_id, symbol, asset_class, side, qty, entry_price, exit_price,
        entry_at, exit_at, fees, pnl, setup, tags, notes, grade, emotion, platform
      ) values (
        ${data.id}, ${data.accountId}, ${data.symbol}, ${data.assetClass}, ${data.side},
        ${data.qty}, ${data.entryPrice}, ${data.exitPrice}, ${data.entryAt}, ${data.exitAt},
        ${data.fees}, ${data.pnl}, ${data.setup}, ${JSON.stringify(data.tags)}, ${data.notes},
        ${data.grade}, ${data.emotion}, ${data.platform}
      )
      on conflict (id) do update set
        symbol = excluded.symbol,
        asset_class = excluded.asset_class,
        side = excluded.side,
        qty = excluded.qty,
        entry_price = excluded.entry_price,
        exit_price = excluded.exit_price,
        entry_at = excluded.entry_at,
        exit_at = excluded.exit_at,
        fees = excluded.fees,
        pnl = excluded.pnl,
        setup = excluded.setup,
        tags = excluded.tags,
        notes = excluded.notes,
        grade = excluded.grade,
        emotion = excluded.emotion,
        platform = excluded.platform
    `;
	await sql`
      update trading_accounts
      set trade_count = (select count(*) from trades where account_id = ${data.accountId})
      where id = ${data.accountId}
    `;
	return loadState();
});
var removeTrade_createServerFn_handler = createServerRpc({
	id: "c954ad44dc3a012406cec68d1e5f322a623b609c0c944b739cc59e8e12b83944",
	name: "removeTrade",
	filename: "src/lib/journal/api.ts"
}, (opts) => removeTrade.__executeServer(opts));
var removeTrade = createServerFn({ method: "POST" }).validator((d) => idSchema.parse(d)).handler(removeTrade_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const rows = await sql`select account_id from trades where id = ${data.id}`;
	await sql`delete from trades where id = ${data.id}`;
	if (rows[0]) await sql`
        update trading_accounts
        set trade_count = (select count(*) from trades where account_id = ${rows[0].account_id})
        where id = ${rows[0].account_id}
      `;
	return loadState();
});
var importSchema = object({
	accountId: string().min(1),
	trades: array(any()),
	mode: _enum(["merge", "replace"])
});
var importAccountTrades_createServerFn_handler = createServerRpc({
	id: "fd710bdb50f8e7e3d75edcce821329586d7c02a6bebb3541f95a81c0ffccc5bc",
	name: "importAccountTrades",
	filename: "src/lib/journal/api.ts"
}, (opts) => importAccountTrades.__executeServer(opts));
var importAccountTrades = createServerFn({ method: "POST" }).validator((d) => importSchema.parse(d)).handler(importAccountTrades_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	if (data.mode === "replace") await sql`delete from trades where account_id = ${data.accountId}`;
	await insertTrades(sql, data.trades.map((t) => ({
		...t,
		accountId: data.accountId,
		id: t.id || crypto.randomUUID()
	})));
	await sql`
      update trading_accounts
      set trade_count = (select count(*) from trades where account_id = ${data.accountId}),
          last_sync_at = ${(/* @__PURE__ */ new Date()).toISOString()}
      where id = ${data.accountId}
    `;
	return loadState();
});
//#endregion
export { connectAccount_createServerFn_handler, deleteAccount_createServerFn_handler, importAccountTrades_createServerFn_handler, loadJournal_createServerFn_handler, removeTrade_createServerFn_handler, renameAccount_createServerFn_handler, syncAccount_createServerFn_handler, upsertTrade_createServerFn_handler };
