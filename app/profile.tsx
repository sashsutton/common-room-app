import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/theme';

type Profile = {
  full_name: string | null;
  gender: string | null;
  year_of_birth: number | null;
  home_postcode: string | null;
};

export default function ProfileScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email ?? '');
      const { data } = await supabase
        .from('profiles')
        .select('full_name, gender, year_of_birth, home_postcode')
        .eq('id', user.id)
        .maybeSingle();
      setProfile(data);
      setLoading(false);
    }
    load();
  }, []);

  async function handleSignOut() {
    setSigningOut(true);
    await supabase.auth.signOut();
    // Auth gate in _layout.tsx handles the redirect to /(auth)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 16, marginBottom: 36 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ minHeight: 44, minWidth: 44, justifyContent: 'center' }}
          >
            <Text style={{ color: Colors.primary, fontSize: 16 }}>← Back</Text>
          </TouchableOpacity>
        </View>

        <Text
          style={{
            fontFamily: 'Georgia',
            fontSize: 28,
            color: Colors.primary,
            lineHeight: 36,
            marginBottom: 8,
          }}
        >
          My Profile
        </Text>
        <Text style={{ fontSize: 14, color: Colors.subtext, marginBottom: 36 }}>
          Your account details
        </Text>

        {loading ? (
          <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
        ) : (
          <>
            <Row label="Name" value={profile?.full_name ?? '—'} />
            <Row label="Email" value={email} />
            <Row label="Gender" value={profile?.gender ?? '—'} />
            <Row label="Year of birth" value={profile?.year_of_birth?.toString() ?? '—'} />
            <Row label="Home postcode" value={profile?.home_postcode ?? '—'} />

            <View
              style={{
                height: 1,
                backgroundColor: Colors.secondary + '60',
                marginVertical: 32,
              }}
            />

            <TouchableOpacity
              onPress={handleSignOut}
              disabled={signingOut}
              style={{
                borderRadius: 14,
                minHeight: 52,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1.5,
                borderColor: Colors.error,
                opacity: signingOut ? 0.6 : 1,
              }}
              activeOpacity={0.75}
            >
              {signingOut ? (
                <ActivityIndicator color={Colors.error} />
              ) : (
                <Text style={{ color: Colors.error, fontSize: 16, fontWeight: '600' }}>
                  Sign Out
                </Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.secondary + '50',
      }}
    >
      <Text style={{ fontSize: 12, color: Colors.subtext, marginBottom: 4, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </Text>
      <Text style={{ fontSize: 16, color: Colors.text }}>
        {value}
      </Text>
    </View>
  );
}
