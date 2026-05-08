import { useState, useEffect, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, SectionList,
  ScrollView, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { fetchAdoptThemes, fetchUserSelections, addThemeSelection, removeThemeSelection } from '@/lib/api';
import { Database } from '@/lib/database.types';
import { Colors } from '@/constants/theme';
import { ThemeCard } from '@/components/ThemeCard';
import { ThemeInfoModal } from '@/components/ThemeInfoModal';

type AdoptTheme = Database['public']['Tables']['adopt_themes']['Row'];
type Section = { title: string; data: AdoptTheme[] };

const CATEGORY_SHORT: Record<string, string> = {
  'Creativity, culture and legacy': 'Creativity',
  'Health and wellbeing': 'Health',
  'Lifework and resilience': 'Lifework',
  'Relationships and belonging': 'Relationships',
  'Self development and inner growth': 'Self & Growth',
};

const MAX_SELECTIONS = 10;

export default function AdoptScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [userId, setUserId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [infoTheme, setInfoTheme] = useState<AdoptTheme | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  const { data: themes = [], isLoading: themesLoading } = useQuery({
    queryKey: ['adopt-themes'],
    queryFn: fetchAdoptThemes,
    staleTime: Infinity, // seed data never changes
  });

  const { data: selectedIds = [] } = useQuery({
    queryKey: ['user-selections', userId],
    queryFn: () => fetchUserSelections(userId!),
    enabled: !!userId,
  });

  async function toggleSelection(themeId: number) {
    if (!userId) return;
    const isSelected = selectedIds.includes(themeId);
    if (!isSelected && selectedIds.length >= MAX_SELECTIONS) return;

    // Optimistic update
    const next = isSelected
      ? selectedIds.filter((id) => id !== themeId)
      : [...selectedIds, themeId];
    queryClient.setQueryData(['user-selections', userId], next);

    try {
      if (isSelected) {
        await removeThemeSelection(userId, themeId);
      } else {
        await addThemeSelection(userId, themeId);
      }
    } catch {
      queryClient.setQueryData(['user-selections', userId], selectedIds);
    }
  }

  const categories = useMemo(() => {
    const cats = [...new Set(themes.map((t) => t.category))].sort();
    return ['All', ...cats];
  }, [themes]);

  const sections: Section[] = useMemo(() => {
    const q = search.trim().toLowerCase();
    let filtered = themes;
    if (q) {
      filtered = themes.filter(
        (t) =>
          t.theme.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
      );
    }
    if (activeCategory !== 'All') {
      filtered = filtered.filter((t) => t.category === activeCategory);
    }

    // Flat single section when filtering or searching
    if (activeCategory !== 'All' || q) {
      return [{ title: activeCategory !== 'All' ? activeCategory : 'Results', data: filtered }];
    }

    // Group by category when showing all
    const grouped: Record<string, AdoptTheme[]> = {};
    for (const theme of filtered) {
      if (!grouped[theme.category]) grouped[theme.category] = [];
      grouped[theme.category].push(theme);
    }
    return Object.entries(grouped).map(([title, data]) => ({ title, data }));
  }, [themes, search, activeCategory]);

  const atMax = selectedIds.length >= MAX_SELECTIONS;
  const showGroupHeaders = activeCategory === 'All' && search.trim() === '';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>

      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 }}>
        <Text style={{ fontFamily: 'Georgia', fontSize: 26, color: Colors.primary, lineHeight: 34 }}>
          ADOPT Themes
        </Text>
        <Text style={{ fontSize: 13, color: Colors.subtext, marginTop: 2 }}>
          {selectedIds.length} / {MAX_SELECTIONS} selected
        </Text>
      </View>

      {themesLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={Colors.primary} />
          <Text style={{ color: Colors.subtext, marginTop: 12, fontSize: 14 }}>
            Loading themes…
          </Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id.toString()}
          stickySectionHeadersEnabled={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 110 }}
          ListHeaderComponent={
            <View>
              {/* Search */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  borderWidth: 1.5,
                  borderColor: Colors.secondary,
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  marginBottom: 12,
                  marginTop: 12,
                  minHeight: 48,
                }}
              >
                <Text style={{ fontSize: 15, color: Colors.subtext, marginRight: 8 }}>
                  ⌕
                </Text>
                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Search themes…"
                  placeholderTextColor={Colors.subtext}
                  style={{ flex: 1, fontSize: 15, color: Colors.text }}
                  returnKeyType="search"
                  clearButtonMode="while-editing"
                />
              </View>

              {/* Category filter pills */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, paddingRight: 4, paddingBottom: 12 }}
              >
                {categories.map((cat) => {
                  const isActive = cat === activeCategory;
                  return (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setActiveCategory(cat)}
                      style={{
                        paddingHorizontal: 14,
                        paddingVertical: 8,
                        minHeight: 36,
                        borderRadius: 100,
                        backgroundColor: isActive ? Colors.primary : 'white',
                        borderWidth: 1.5,
                        borderColor: isActive ? Colors.primary : Colors.secondary,
                        justifyContent: 'center',
                      }}
                      activeOpacity={0.75}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          color: isActive ? 'white' : Colors.text,
                          fontWeight: isActive ? '600' : '400',
                        }}
                      >
                        {cat === 'All' ? 'All' : (CATEGORY_SHORT[cat] ?? cat)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Max reached banner */}
              {atMax && (
                <View
                  style={{
                    backgroundColor: Colors.accent + '30',
                    borderRadius: 10,
                    padding: 12,
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ fontSize: 13, color: Colors.text, lineHeight: 20 }}>
                    You've selected 10 themes — remove one to add another.
                  </Text>
                </View>
              )}
            </View>
          }
          renderSectionHeader={({ section: { title } }) =>
            showGroupHeaders ? (
              <View
                style={{
                  paddingTop: 16,
                  paddingBottom: 8,
                  backgroundColor: Colors.background,
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '600',
                    color: Colors.subtext,
                    textTransform: 'uppercase',
                    letterSpacing: 0.6,
                  }}
                >
                  {title}
                </Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <ThemeCard
              theme={item}
              selected={selectedIds.includes(item.id)}
              disabled={atMax && !selectedIds.includes(item.id)}
              onSelect={() => toggleSelection(item.id)}
              onInfo={() => setInfoTheme(item)}
            />
          )}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', paddingTop: 48 }}>
              <Text style={{ color: Colors.subtext, fontSize: 15 }}>
                No themes match your search.
              </Text>
            </View>
          }
        />
      )}

      {/* Sticky bottom CTA */}
      {selectedIds.length > 0 && (
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
          }}
        >
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/dashboard')}
            style={{
              backgroundColor: Colors.primary,
              borderRadius: 14,
              minHeight: 52,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            activeOpacity={0.85}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
              View My Purpose
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <ThemeInfoModal theme={infoTheme} onClose={() => setInfoTheme(null)} />
    </SafeAreaView>
  );
}
