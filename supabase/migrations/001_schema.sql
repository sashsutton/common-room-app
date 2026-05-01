-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Profiles (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users primary key,
  full_name text,
  gender text,
  year_of_birth int,
  home_postcode text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- ADOPT themes (shared, read-only for users)
create table adopt_themes (
  id serial primary key,
  category text not null,
  theme text not null,
  description text,
  third_person_description text,
  category_colour text
);

alter table adopt_themes enable row level security;

create policy "Themes are publicly readable"
  on adopt_themes for select
  using (true);

-- User theme selections
create table user_adopt_selections (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  theme_id int references adopt_themes not null,
  selected_at timestamptz default now(),
  unique(user_id, theme_id)
);

alter table user_adopt_selections enable row level security;

create policy "Users can view own selections"
  on user_adopt_selections for select
  using (auth.uid() = user_id);

create policy "Users can insert own selections"
  on user_adopt_selections for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own selections"
  on user_adopt_selections for delete
  using (auth.uid() = user_id);

-- Enforce max 10 selections per user
create or replace function check_max_selections()
returns trigger as $$
begin
  if (
    select count(*) from user_adopt_selections
    where user_id = new.user_id
  ) >= 10 then
    raise exception 'Maximum of 10 theme selections allowed';
  end if;
  return new;
end;
$$ language plpgsql;

create trigger enforce_max_selections
  before insert on user_adopt_selections
  for each row execute function check_max_selections();

-- Reflections
create table reflections (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  generated_at timestamptz default now(),
  theme_ids int[],
  content jsonb not null
);

alter table reflections enable row level security;

create policy "Users can view own reflections"
  on reflections for select
  using (auth.uid() = user_id);

create policy "Users can insert own reflections"
  on reflections for insert
  with check (auth.uid() = user_id);

-- User notes (one per user, upsert pattern)
create table user_notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null unique,
  content text,
  updated_at timestamptz default now()
);

alter table user_notes enable row level security;

create policy "Users can view own note"
  on user_notes for select
  using (auth.uid() = user_id);

create policy "Users can insert own note"
  on user_notes for insert
  with check (auth.uid() = user_id);

create policy "Users can update own note"
  on user_notes for update
  using (auth.uid() = user_id);

-- Auto-create profile on sign-up
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
