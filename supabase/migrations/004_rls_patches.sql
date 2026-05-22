-- Missing DELETE policy on user_notes
create policy "Users can delete own note"
  on user_notes for delete
  using (auth.uid() = user_id);
