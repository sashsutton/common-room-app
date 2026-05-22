import { supabase } from './supabase';
import { Database } from './database.types';

type AdoptTheme = Database['public']['Tables']['adopt_themes']['Row'];
type Reflection = Database['public']['Tables']['reflections']['Row'];
type UserNote = Database['public']['Tables']['user_notes']['Row'];

export type SelectedTheme = {
  theme_id: number;
  selected_at: string;
  adopt_themes: {
    id: number;
    category: string;
    theme: string;
    description: string | null;
    category_colour: string | null;
  };
};

export async function fetchSelectedThemesWithDetails(userId: string): Promise<SelectedTheme[]> {
  const { data, error } = await supabase
    .from('user_adopt_selections')
    .select('theme_id, selected_at, adopt_themes(id, category, theme, description, category_colour)')
    .eq('user_id', userId)
    .order('selected_at', { ascending: true });

  if (error) throw error;
  return data as SelectedTheme[];
}

export async function fetchAdoptThemes(): Promise<AdoptTheme[]> {
  const { data, error } = await supabase
    .from('adopt_themes')
    .select('*')
    .order('category', { ascending: true })
    .order('theme', { ascending: true });

  if (error) throw error;
  return data;
}

export async function fetchUserSelections(userId: string): Promise<number[]> {
  const { data, error } = await supabase
    .from('user_adopt_selections')
    .select('theme_id')
    .eq('user_id', userId);

  if (error) throw error;
  return (data as { theme_id: number }[]).map((row) => row.theme_id);
}

export async function addThemeSelection(userId: string, themeId: number): Promise<void> {
  const { error } = await supabase
    .from('user_adopt_selections')
    .insert({ user_id: userId, theme_id: themeId });

  if (error) throw error;
}

export async function removeThemeSelection(userId: string, themeId: number): Promise<void> {
  const { error } = await supabase
    .from('user_adopt_selections')
    .delete()
    .eq('user_id', userId)
    .eq('theme_id', themeId);

  if (error) throw error;
}

export async function fetchLatestReflection(userId: string): Promise<Reflection | null> {
  const { data, error } = await supabase
    .from('reflections')
    .select('*')
    .eq('user_id', userId)
    .order('generated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function generateReflections(userId: string): Promise<string[]> {
  const { data, error } = await supabase.functions.invoke('generate-reflections', {
    body: { user_id: userId },
  });

  if (error) throw error;
  return data.reflections as string[];
}

export type PurposeSnapshot = {
  id: string;
  captured_at: string;
  theme_ids: number[];
  reflection_id: string | null;
  themes?: { id: number; theme: string; category: string; category_colour: string | null }[];
};

export async function fetchPurposeHistory(userId: string): Promise<PurposeSnapshot[]> {
  const { data, error } = await supabase
    .from('purpose_snapshots')
    .select('id, captured_at, theme_ids, reflection_id')
    .eq('user_id', userId)
    .order('captured_at', { ascending: false });

  if (error) throw error;
  return data as PurposeSnapshot[];
}

export async function fetchMonthlyReflectionCount(userId: string): Promise<number> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const { count, error } = await supabase
    .from('reflections')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('generated_at', startOfMonth);

  if (error) throw error;
  return count ?? 0;
}

export async function fetchUserNote(userId: string): Promise<UserNote | null> {
  const { data, error } = await supabase
    .from('user_notes')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function upsertUserNote(userId: string, content: string): Promise<void> {
  const { error } = await supabase.from('user_notes').upsert(
    { user_id: userId, content, updated_at: new Date().toISOString() },
    { onConflict: 'user_id' }
  );

  if (error) throw error;
}
