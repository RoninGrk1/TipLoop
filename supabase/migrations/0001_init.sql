-- TipLoop schema. Apply in the Supabase SQL editor.
create extension if not exists "pgcrypto";
create extension if not exists "citext";

create type public.payment_status as enum ('pending','processing','success','failed','expired','refunded');
create type public.ledger_entry_type as enum ('tip_gross','platform_fee','creator_net','refund','adjustment');
create type public.webhook_status as enum ('received','processed','ignored','failed');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  handle citext not null unique,
  display_name text not null,
  bio text, avatar_url text, banner_url text, website text,
  socials jsonb not null default '{}'::jsonb,
  theme jsonb not null default '{}'::jsonb,
  is_public boolean not null default true,
  is_verified boolean not null default false,
  referral_code text not null unique,
  referred_by uuid references public.profiles (id) on delete set null,
  preferred_asset text not null default 'USDC',
  preferred_network text not null default 'solana',
  payout_address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint handle_format check (handle ~ '^[a-z0-9]([a-z0-9-]*[a-z0-9])$'),
  constraint handle_len check (char_length(handle) between 3 and 24)
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.profiles (id) on delete restrict,
  handle citext not null,
  supporter_name text, supporter_email text, message text,
  asset text not null, network text not null,
  gross_cents integer not null check (gross_cents > 0),
  fee_cents integer not null check (fee_cents >= 0),
  net_cents integer not null check (net_cents > 0),
  fee_bps integer not null check (fee_bps >= 0),
  crypto_amount text,
  status public.payment_status not null default 'pending',
  provider text not null,
  provider_payment_id text,
  idempotency_key text not null unique,
  checkout_url text, qr_payload text,
  expires_at timestamptz not null,
  paid_at timestamptz, refunded_at timestamptz, failure_reason text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint fee_identity check (gross_cents = fee_cents + net_cents)
);
create unique index payments_provider_id_uidx on public.payments (provider, provider_payment_id) where provider_payment_id is not null;
create index payments_creator_created_idx on public.payments (creator_id, created_at desc);

create table public.ledger_entries (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references public.payments (id) on delete cascade,
  entry_type public.ledger_entry_type not null,
  amount_cents integer not null,
  currency text not null default 'USD',
  created_at timestamptz not null default now()
);

create table public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null, event_id text not null,
  payment_id uuid references public.payments (id) on delete set null,
  status public.webhook_status not null default 'received',
  payload jsonb not null, error text,
  created_at timestamptz not null default now(), processed_at timestamptz,
  unique (provider, event_id)
);

create table public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references public.profiles (id) on delete cascade,
  referee_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  unique (referee_id)
);

create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger payments_updated_at before update on public.payments for each row execute function public.set_updated_at();

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
declare raw_handle text; raw_name text; code text;
begin
  raw_handle := coalesce(new.raw_user_meta_data->>'handle', 'user-' || substr(new.id::text, 1, 8));
  raw_name := coalesce(new.raw_user_meta_data->>'display_name', raw_handle);
  code := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
  insert into public.profiles (id, handle, display_name, referral_code) values (new.id, raw_handle, raw_name, code) on conflict (id) do nothing;
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.payments enable row level security;
alter table public.ledger_entries enable row level security;
alter table public.webhook_events enable row level security;
alter table public.referrals enable row level security;
create policy profiles_public_read on public.profiles for select using (is_public = true or auth.uid() = id);
create policy profiles_self_update on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy payments_creator_read on public.payments for select using (auth.uid() = creator_id);
create policy ledger_creator_read on public.ledger_entries for select using (exists (select 1 from public.payments p where p.id = ledger_entries.payment_id and p.creator_id = auth.uid()));
create policy referrals_self_read on public.referrals for select using (auth.uid() = referrer_id or auth.uid() = referee_id);
