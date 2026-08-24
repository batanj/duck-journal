create table if not exists trading_accounts (
  id text primary key,
  name text not null,
  server text not null,
  username text not null,
  investor_password text not null,
  status text not null default 'connecting',
  progress integer not null default 0,
  last_sync_at timestamptz,
  error_message text,
  trade_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists trades (
  id text primary key,
  account_id text not null references trading_accounts(id) on delete cascade,
  symbol text not null,
  asset_class text not null,
  side text not null,
  qty double precision not null,
  entry_price double precision not null,
  exit_price double precision not null,
  entry_at timestamptz not null,
  exit_at timestamptz not null,
  fees double precision not null default 0,
  pnl double precision not null,
  setup text not null default '',
  tags text not null default '[]',
  notes text not null default '',
  grade text not null default '',
  emotion text not null default '',
  platform text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists trades_account_id_idx on trades (account_id);
create index if not exists trades_exit_at_idx on trades (exit_at);
