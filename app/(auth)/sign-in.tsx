import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/theme';

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSignIn() {
    if (!email.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    setLoading(false);
    if (error) setError("Let's try that again — please check your email and password.");
    // Successful sign-in: auth gate in _layout.tsx handles the redirect
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6 pb-10" style={{ paddingTop: 64 }}>

          {/* Back */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start', marginBottom: 32 }}
          >
            <Text className="text-primary text-base">← Back</Text>
          </TouchableOpacity>

          {/* Heading */}
          <Text
            className="text-primary"
            style={{ fontFamily: 'Georgia', fontSize: 30, lineHeight: 38, marginBottom: 8 }}
          >
            Welcome back
          </Text>
          <Text className="text-subtext text-base" style={{ marginBottom: 36 }}>
            Sign in to continue your reflection
          </Text>

          {/* Fields */}
          <View style={{ gap: 16 }}>
            <View>
              <Text className="text-ink text-sm" style={{ marginBottom: 8, fontWeight: '500' }}>
                Email
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                placeholderTextColor={Colors.subtext}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                style={{
                  minHeight: 52,
                  backgroundColor: 'white',
                  borderWidth: 1.5,
                  borderColor: Colors.secondary,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  fontSize: 16,
                  color: Colors.text,
                }}
              />
            </View>

            <View>
              <Text className="text-ink text-sm" style={{ marginBottom: 8, fontWeight: '500' }}>
                Password
              </Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Your password"
                placeholderTextColor={Colors.subtext}
                secureTextEntry
                autoComplete="current-password"
                style={{
                  minHeight: 52,
                  backgroundColor: 'white',
                  borderWidth: 1.5,
                  borderColor: Colors.secondary,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  fontSize: 16,
                  color: Colors.text,
                }}
              />
            </View>
          </View>

          {error ? (
            <Text className="text-error text-sm" style={{ marginTop: 12 }}>
              {error}
            </Text>
          ) : null}

          <TouchableOpacity
            onPress={handleSignIn}
            disabled={loading}
            className="bg-primary rounded-2xl items-center justify-center"
            style={{ minHeight: 52, marginTop: 32, opacity: loading ? 0.7 : 1 }}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="white" />
              : <Text className="text-white text-base" style={{ fontWeight: '600' }}>Sign In</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace('/(auth)/register')}
            style={{ minHeight: 44, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}
          >
            <Text className="text-subtext text-sm">
              Don't have an account?{' '}
              <Text className="text-primary">Get started</Text>
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
