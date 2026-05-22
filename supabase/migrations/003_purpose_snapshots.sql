-- Purpose snapshots: records the user's full theme selection at a point in time.
-- A snapshot is taken automatically when reflections are generated.
-- reflection_id links back to what triggered the snapshot (nullable for future manual saves).

create table purpose_snapshots (
  id            uuid        default gen_random_uuid() primary key,
  user_id       uuid        references auth.users not null,
  captured_at   timestamptz default now(),
  theme_ids     int[]       not null,
  reflection_id uuid        references reflections(id) on delete set null
);

alter table purpose_snapshots enable row level security;

create policy "Users can read own snapshots"
  on purpose_snapshots for select
  using (auth.uid() = user_id);

create policy "Users can insert own snapshots"
  on purpose_snapshots for insert
  with check (auth.uid() = user_id);

create index purpose_snapshots_user_captured
  on purpose_snapshots (user_id, captured_at desc);
