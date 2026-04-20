create extension if not exists "uuid-ossp";

create type user_role as enum ('user', 'admin');
create type market_category as enum ('politics', 'sports', 'finance', 'other');
create type market_status as enum ('pending', 'open', 'closed', 'resolved');
create type bet_position as enum ('yes', 'no');

create table users (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text unique not null,
  image text,
  role user_role not null default 'user',
  points int not null default 1000,
  coins int not null default 100,
  created_at timestamptz not null default now()
);

create table markets (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  category market_category not null,
  status market_status not null default 'pending',
  resolve_at timestamptz not null,
  outcome boolean,
  news_keywords text[] not null default '{}',
  created_by uuid references users(id) not null,
  created_at timestamptz not null default now()
);

create table market_state (
  market_id uuid primary key references markets(id) on delete cascade,
  q_yes decimal not null default 0,
  q_no decimal not null default 0,
  b decimal not null default 100,
  yes_probability decimal not null default 0.5,
  updated_at timestamptz not null default now()
);

create table bets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) not null,
  market_id uuid references markets(id) not null,
  position bet_position not null,
  points_wagered int not null,
  odds_at_bet decimal not null,
  payout int,
  created_at timestamptz not null default now()
);

create table news_cache (
  id uuid primary key default uuid_generate_v4(),
  market_id uuid references markets(id) on delete cascade,
  headline text not null,
  url text not null,
  published_at timestamptz not null,
  fetched_at timestamptz not null default now()
);

create index on bets(user_id);
create index on bets(market_id);
create index on news_cache(market_id);
create index on markets(status);
