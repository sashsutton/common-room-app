import { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ActivityIndicator,
  KeyboardAvoidingView, Platform, ScrollView, Share, Keyboard, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { fetchCurrentDraft, fetchSubmittedNotes, saveDraft, submitNote } from '@/lib/api';
import { Colors } from '@/constants/theme';
import { Database } from '@/lib/database.types';

type UserNote = Database['public']['Tables']['user_notes']['Row'];

const MAX_WORDS = 1000;
const WARN_WORDS = 900;

function countWords(text: string): number {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

function PastNote({ note }: { note: UserNote }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View
      style={{
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.secondary + '60',
        backgroundColor: 'white',
        marginBottom: 10,
        overflow: 'hidden',
      }}
    >
      <TouchableOpacity
        onPress={() => setExpanded((v) => !v)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 14,
          minHeight: 44,
        }}
        activeOpacity={0.7}
      >
        <Text style={{ fontSize: 14, color: Colors.text, fontWeight: '500' }}>
          {formatDate(note.submitted_at!)}
        </Text>
        <Text style={{ fontSize: 13, color: Colors.subtext }}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          <Text style={{ fontSize: 15, color: Colors.text, lineHeight: 24 }}>
            {note.content}
          </Text>
          <TouchableOpacity
            onPress={() => Share.share({ message: note.content ?? '', title: 'My Note — The Common Room' })}
            style={{ marginTop: 12, alignSelf: 'flex-start' }}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 13, color: Colors.primary }}>Share this note</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default function NotesScreen() {
  const [userId, setUserId] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [savedContent, setSavedContent] = useState('');
  const [submittedNotes, setSubmittedNotes] = useState<UserNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  async function loadNotes(uid: string) {
    setLoading(true);
    try {
      const [draft, past] = await Promise.all([
        fetchCurrentDraft(uid),
        fetchSubmittedNotes(uid),
      ]);
      const text = draft?.content ?? '';
      setContent(text);
      setSavedContent(text);
      setSubmittedNotes(past);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (userId) loadNotes(userId);
  }, [userId]);

  useFocusEffect(useCallback(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []));

  const words = countWords(content);
  const atLimit = words >= MAX_WORDS;
  const nearLimit = words >= WARN_WORDS;
  const isDirty = content !== savedContent;

  function handleChange(text: string) {
    if (countWords(text) > MAX_WORDS) return;
    setContent(text);
    setSaveStatus('idle');
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => handleSave(text), 2000);
  }

  async function handleSave(textToSave = content) {
    if (!userId) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaving(true);
    setSaveStatus('idle');
    try {
      await saveDraft(userId, textToSave);
      setSavedContent(textToSave);
      setSaveStatus('saved');
    } catch {
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  }

  function confirmSubmit() {
    if (!content.trim()) return;
    Alert.alert(
      'Submit this note?',
      'Your note will be saved and archived. You can start a fresh note afterwards.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Submit', style: 'default', onPress: handleSubmit },
      ]
    );
  }

  async function handleSubmit() {
    if (!userId) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSubmitting(true);
    try {
      await saveDraft(userId, content);
      await submitNote(userId);
      await loadNotes(userId);
    } catch {
      Alert.alert('Something went wrong', "Let's try that again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleExport() {
    if (!content.trim()) return;
    try {
      await Share.share({ message: content, title: 'My Note — The Common Room' });
    } catch {}
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>

        {/* Header */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 12,
            paddingBottom: 12,
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          <View>
            <Text style={{ fontFamily: 'Georgia', fontSize: 28, color: Colors.primary, lineHeight: 36 }}>
              My Note
            </Text>
            <Text style={{ fontSize: 13, color: Colors.subtext, marginTop: 2 }}>
              A private space for your own thoughts
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => Keyboard.dismiss()}
            style={{ minHeight: 44, minWidth: 60, alignItems: 'center', justifyContent: 'center' }}
            activeOpacity={0.7}
          >
            <Text style={{ fontSize: 15, color: Colors.primary, fontWeight: '500' }}>Done</Text>
          </TouchableOpacity>
        </View>

        {/* Word count + save status */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingBottom: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={{
              fontSize: 13,
              color: atLimit ? Colors.error : nearLimit ? '#B07A30' : Colors.subtext,
              fontWeight: nearLimit ? '500' : '400',
            }}
          >
            {words} / {MAX_WORDS} words
            {atLimit ? ' — limit reached' : nearLimit ? ' — almost full' : ''}
          </Text>
          <Text style={{ fontSize: 12, color: Colors.subtext }}>
            {saving ? 'Saving…' : saveStatus === 'saved' ? 'Saved' : saveStatus === 'error' ? 'Save failed' : isDirty ? 'Unsaved' : ''}
          </Text>
        </View>

        {/* Text input + past notes */}
        <ScrollView
          style={{ flex: 1, paddingHorizontal: 20 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Draft text area */}
          <TextInput
            value={content}
            onChangeText={handleChange}
            placeholder={content === '' ? "Write your thoughts here…" : undefined}
            placeholderTextColor={Colors.subtext}
            multiline
            textAlignVertical="top"
            style={{
              fontSize: 16,
              color: Colors.text,
              lineHeight: 26,
              minHeight: 200,
              paddingBottom: 16,
            }}
          />

          {/* Past submitted notes */}
          {submittedNotes.length > 0 && (
            <View style={{ marginTop: 24, paddingBottom: 140 }}>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: Colors.subtext,
                  textTransform: 'uppercase',
                  letterSpacing: 0.6,
                  marginBottom: 12,
                }}
              >
                Previous notes
              </Text>
              {submittedNotes.map((note) => (
                <PastNote key={note.id} note={note} />
              ))}
            </View>
          )}

          {submittedNotes.length === 0 && <View style={{ height: 140 }} />}
        </ScrollView>

        {/* Bottom action bar */}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            paddingHorizontal: 20,
            paddingTop: 12,
            paddingBottom: 20,
            backgroundColor: Colors.background,
            borderTopWidth: 1,
            borderTopColor: Colors.secondary + '60',
            flexDirection: 'row',
            gap: 10,
          }}
        >
          {/* Save */}
          <TouchableOpacity
            onPress={() => handleSave()}
            disabled={saving || !isDirty}
            style={{
              flex: 1,
              backgroundColor: isDirty ? Colors.primary : Colors.secondary + '60',
              borderRadius: 14,
              minHeight: 52,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: saving ? 0.7 : 1,
            }}
            activeOpacity={0.85}
          >
            {saving ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={{ color: isDirty ? 'white' : Colors.subtext, fontSize: 15, fontWeight: '600' }}>
                {saveStatus === 'saved' && !isDirty ? 'Saved' : 'Save'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Submit */}
          <TouchableOpacity
            onPress={confirmSubmit}
            disabled={submitting || !content.trim()}
            style={{
              flex: 1,
              borderRadius: 14,
              minHeight: 52,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1.5,
              borderColor: content.trim() ? Colors.accent : Colors.secondary + '40',
              backgroundColor: content.trim() ? Colors.accent + '20' : 'transparent',
              opacity: submitting ? 0.7 : content.trim() ? 1 : 0.4,
            }}
            activeOpacity={0.85}
          >
            {submitting ? (
              <ActivityIndicator color={Colors.primary} />
            ) : (
              <Text style={{ color: Colors.primary, fontSize: 15, fontWeight: '600' }}>
                Submit
              </Text>
            )}
          </TouchableOpacity>

          {/* Share */}
          <TouchableOpacity
            onPress={handleExport}
            disabled={!content.trim()}
            style={{
              borderRadius: 14,
              minHeight: 52,
              paddingHorizontal: 16,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1.5,
              borderColor: Colors.secondary + '60',
              opacity: content.trim() ? 1 : 0.3,
            }}
            activeOpacity={0.75}
          >
            <Text style={{ fontSize: 18, color: Colors.primary }}>↑</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
