-- Allow multiple notes per user (remove single-note constraint)
alter table user_notes drop constraint user_notes_user_id_key;

-- submitted_at = null means active draft, set means archived/submitted
alter table user_notes add column submitted_at timestamptz;

-- Efficient lookups
create index user_notes_draft_idx
  on user_notes (user_id) where submitted_at is null;

create index user_notes_submitted_idx
  on user_notes (user_id, submitted_at desc) where submitted_at is not null;
