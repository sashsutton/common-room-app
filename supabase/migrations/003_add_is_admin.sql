-- Add is_admin flag to profiles
alter table profiles add column if not exists is_admin boolean not null default false;

-- Allow users to read their own is_admin status
create policy "Users can read own is_admin"
  on profiles for select
  using (auth.uid() = id);
