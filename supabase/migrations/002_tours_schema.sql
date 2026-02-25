-- Create tours table
create table if not exists public.tours (
  id uuid not null default gen_random_uuid (),
  title text not null,
  description text not null,
  region text not null,
  types text[] not null default '{}'::text[],
  season text not null,
  duration_days integer not null,
  duration_nights integer not null,
  photo_url text not null,
  is_custom boolean null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint tours_pkey primary key (id),
  constraint tours_duration_days_check check ((duration_days > 0)),
  constraint tours_duration_nights_check check ((duration_nights >= 0))
) tablespace pg_default;

-- Create indexes for better query performance
create index if not exists idx_tours_region on public.tours using btree (region) tablespace pg_default;
create index if not exists idx_tours_types on public.tours using gin (types) tablespace pg_default;
create index if not exists idx_tours_season on public.tours using btree (season) tablespace pg_default;

-- Create trigger for updated_at
create trigger set_updated_at_tours before
update on tours for each row
execute function handle_updated_at ();

-- Enable Row Level Security (RLS)
alter table public.tours enable row level security;

-- Policy: Allow public read access
create policy "Allow public read access to tours"
  on public.tours for select
  using (true);

-- Policy: Disable insert/update/delete for now (handled by backend with admin key)
-- No policies for insert/update/delete means only service role can perform these operations
