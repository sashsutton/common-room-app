import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { fetchSelectedThemesWithDetails } from '@/lib/api';
import { Colors } from '@/constants/theme';

export default function DashboardScreen() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  useEffect(() => {
    if (!userId) return;
    supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.full_name) setUserName(data.full_name.split(' ')[0]);
      });
  }, [userId]);

  const { data: selectedThemes = [], isLoading, refetch } = useQuery({
    queryKey: ['selected-themes-details', userId],
    queryFn: () => fetchSelectedThemesWithDetails(userId!),
    enabled: !!userId,
  });

  // Refetch whenever the tab comes into focus (user may have changed selections)
  useFocusEffect(
    useCallback(() => {
      if (userId) refetch();
    }, [userId, refetch])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ paddingTop: 12, marginBottom: 28 }}>
          <Text style={{ fontFamily: 'Georgia', fontSize: 28, color: Colors.primary, lineHeight: 36 }}>
            My Purpose
          </Text>
          {userName && (
            <Text style={{ fontSize: 15, color: Colors.subtext, marginTop: 4 }}>
              {userName}'s selected themes
            </Text>
          )}
        </View>

        {/* Loading */}
        {isLoading && (
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <ActivityIndicator color={Colors.primary} />
          </View>
        )}

        {/* Empty state */}
        {!isLoading && selectedThemes.length === 0 && (
          <View
            style={{
              alignItems: 'center',
              paddingTop: 48,
              paddingHorizontal: 16,
            }}
          >
            <Text
              style={{
                fontFamily: 'Georgia',
                fontSize: 20,
                color: Colors.primary,
                textAlign: 'center',
                marginBottom: 12,
              }}
            >
              Your themes will appear here once selected
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: Colors.subtext,
                textAlign: 'center',
                lineHeight: 24,
                marginBottom: 32,
              }}
            >
              Head to the Themes tab to choose up to 10 ADOPT themes that feel most relevant to you right now.
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/adopt')}
              style={{
                backgroundColor: Colors.primary,
                borderRadius: 14,
                paddingHorizontal: 28,
                minHeight: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              activeOpacity={0.85}
            >
              <Text style={{ color: 'white', fontSize: 15, fontWeight: '600' }}>
                Choose Themes
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Theme list */}
        {!isLoading && selectedThemes.length > 0 && (
          <View>
            <Text
              style={{
                fontSize: 13,
                fontWeight: '600',
                color: Colors.subtext,
                textTransform: 'uppercase',
                letterSpacing: 0.6,
                marginBottom: 16,
              }}
            >
              {selectedThemes.length} theme{selectedThemes.length !== 1 ? 's' : ''} selected
            </Text>

            {selectedThemes.map((item, index) => {
              const theme = item.adopt_themes;
              const categoryColor = theme.category_colour ?? Colors.secondary;

              return (
                <View
                  key={item.theme_id}
                  style={{
                    flexDirection: 'row',
                    marginBottom: 12,
                    borderRadius: 14,
                    overflow: 'hidden',
                    backgroundColor: 'white',
                  }}
                >
                  {/* Category colour left bar */}
                  <View style={{ width: 5, backgroundColor: categoryColor }} />

                  {/* Number */}
                  <View
                    style={{
                      width: 44,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: categoryColor + '30',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'Georgia',
                        fontSize: 18,
                        color: Colors.primary,
                        fontWeight: '600',
                      }}
                    >
                      {index + 1}
                    </Text>
                  </View>

                  {/* Content */}
                  <View style={{ flex: 1, paddingHorizontal: 14, paddingVertical: 14 }}>
                    <Text
                      style={{
                        fontFamily: 'Georgia',
                        fontSize: 16,
                        color: Colors.text,
                        lineHeight: 22,
                        marginBottom: 6,
                      }}
                    >
                      {theme.theme}
                    </Text>
                    <View
                      style={{
                        alignSelf: 'flex-start',
                        backgroundColor: categoryColor,
                        borderRadius: 100,
                        paddingHorizontal: 10,
                        paddingVertical: 3,
                      }}
                    >
                      <Text style={{ fontSize: 11, color: Colors.text }}>
                        {theme.category}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Bottom actions */}
      {!isLoading && selectedThemes.length > 0 && (
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
            gap: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/reflections')}
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
              View Reflections
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(tabs)/adopt')}
            style={{
              borderRadius: 14,
              minHeight: 44,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1.5,
              borderColor: Colors.primary + '40',
            }}
            activeOpacity={0.7}
          >
            <Text style={{ color: Colors.primary, fontSize: 15 }}>
              Edit Themes
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
