alter table trading_accounts
  add column if not exists platform text not null default 'MT5';
